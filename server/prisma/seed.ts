import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await Promise.all(
    [
      { name: "Italian", slug: "italian" },
      { name: "Chinese", slug: "chinese" },
      { name: "Desi", slug: "desi" },
      { name: "Fast Food", slug: "fast-food" },
      { name: "Desserts", slug: "desserts" },
    ].map((c) =>
      prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
    )
  );

  const adminPassword = await bcrypt.hash("mealoraAdmin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@mealora.dev" },
    update: {},
    create: {
      name: "MealOra Admin",
      email: "admin@mealora.dev",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const providerPassword = await bcrypt.hash("password123", 10);

  const providerUser = await prisma.user.upsert({
    where: { email: "provider@mealora.dev" },
    update: {},
    create: {
      name: "Mario Rossi",
      email: "provider@mealora.dev",
      password: providerPassword,
      role: "PROVIDER",
    },
  });

  const providerProfile = await prisma.providerProfile.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      businessName: "Mario's Kitchen",
      description: "Authentic Italian meals made fresh daily.",
      cuisine: "Italian",
      address: "12 Pasta Lane, Foodville",
    },
  });

  const italian = categories.find((c) => c.slug === "italian")!;
  const desserts = categories.find((c) => c.slug === "desserts")!;

  await prisma.meal.createMany({
    data: [
      {
        providerId: providerProfile.id,
        categoryId: italian.id,
        name: "Margherita Pizza",
        description: "Classic pizza with tomato, mozzarella, and basil.",
        price: 9.99,
      },
      {
        providerId: providerProfile.id,
        categoryId: italian.id,
        name: "Spaghetti Carbonara",
        description: "Creamy pasta with pancetta and parmesan.",
        price: 12.5,
      },
      {
        providerId: providerProfile.id,
        categoryId: desserts.id,
        name: "Tiramisu",
        description: "Coffee-soaked layers with mascarpone cream.",
        price: 6.0,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
