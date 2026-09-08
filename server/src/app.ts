import cors from "cors";
import express from "express";
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import mealRoutes from "./routes/meal.routes";
import orderRoutes from "./routes/order.routes";
import providerRoutes from "./routes/provider.routes";
import providerMealRoutes from "./routes/provider-meal.routes";
import providerOrderRoutes from "./routes/provider-order.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/meal", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "MealOra API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/provider/meals", providerMealRoutes);
app.use("/api/provider/orders", providerOrderRoutes);
app.use("/api/admin", adminRoutes);

export default app;