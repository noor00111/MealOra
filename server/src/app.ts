import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import mealRoutes from "./routes/meal.routes";
import providerRoutes from "./routes/provider.routes";

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

export default app;