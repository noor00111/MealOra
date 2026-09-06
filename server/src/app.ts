import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";

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

export default app;