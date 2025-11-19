import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import healthRoutes from "./routes/healthRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// health
app.use(healthRoutes);

// dashboard + stats handled in frontend; backend just APIs + redirect
app.use(linkRoutes);

// 404 fallback for unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api/") || req.path === "/healthz") {
    return res.status(404).json({ error: "Not found" });
  }
  next();
});

app.use(errorHandler);

export default app;
