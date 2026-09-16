import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../lib/prisma";
import { ChatMessage } from "../types/chat";

const genAI = new GoogleGenerativeAI(process.env.CHATBOT_API_KEY ?? "");

async function fetchAppData() {
  const [meals, providers, categories] = await Promise.all([
    prisma.meal.findMany({
      where: { isAvailable: true },
      take: 60,
      include: {
        category: true,
        provider: { select: { businessName: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.providerProfile.findMany(),
    prisma.category.findMany(),
  ]);
  return { meals, providers, categories };
}

function buildSystemPrompt(data: Awaited<ReturnType<typeof fetchAppData>>): string {
  const deals = data.meals.filter((m) => m.discountPercent > 0);

  const mealSummary = data.meals.map((m) => {
    const parts = [`${m.name} ($${m.price})`];
    if (m.category) parts.push(`category: ${m.category.name}`);

    if (m.discountPercent > 0) parts.push(`${m.discountPercent}% off`);
    parts.push(`by ${m.provider.businessName}`);

    if (m.description) parts.push(`- ${m.description.slice(0, 80)}`);
    return parts.join(", ");
  });

  const providerSummary = data.providers.map((p) => {
    const parts = [p.businessName];
    if (p.cuisine) parts.push(`cuisine: ${p.cuisine}`);
    if (p.description) parts.push(p.description.slice(0, 80));
    return parts.join(" | ");
  });

  const categoryNames = data.categories.map((c) => c.name).join(", ");

  return `You are MealOra's friendly food assistant. MealOra is a meal delivery platform with a variety of kitchens and menus.

Your job is to help users find the best meals based on their taste preferences, budget, and occasion. You can:
- Recommend specific meals by name, price, category, and discount
- Suggest the best kitchens (providers) for a given cuisine or preference
- Point out current deals (meals with discounts)
- Answer general food questions in a warm, enthusiastic tone

Keep responses concise (2-4 sentences or a short bullet list). Be specific — always mention meal names, prices, and kitchen names when recommending.

=== CURRENT MENU DATA ===
Categories available: ${categoryNames}

Meals (name, price, category, discounts, kitchen):
${mealSummary.join("\n")}

Kitchens on MealOra:
${providerSummary.join("\n")}

Current deals (${deals.length} meals with discounts):
${deals.map((m) => `${m.name} — ${m.discountPercent}% off at $${m.price}`).join("\n") || "No active deals right now."}
=== END MENU DATA ===`;
}

export async function chat(req: Request, res: Response) {
  const messages: ChatMessage[] = req.body.messages ?? [];
  if (!messages.length) {
    return res.status(400).json({ success: false, message: "No messages" });
  }

  try {
    const data = await fetchAppData();
    const systemPrompt = buildSystemPrompt(data);

    const lastMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: systemPrompt,
    });

    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessageStream(lastMessage);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) res.write(text);
    }
    res.end();
  } 
  catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[chat controller error]", msg);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: msg });
    } else {
      res.end();
    }
  }
}
