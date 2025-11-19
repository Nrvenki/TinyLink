import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import healthRoutes from "./routes/healthRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// CORS config: Allow only your frontend deployed URL
app.use(
  cors({
    origin: "https://tinyylinks.netlify.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Health check route
app.use(healthRoutes);

// Link related API routes
app.use(linkRoutes);

// 404 fallback for unknown API or health routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api/") || req.path === "/healthz") {
    return res.status(404).json({ error: "Not found" });
  }
  next();
});

// General error handler middleware
app.use(errorHandler);

export default app;
