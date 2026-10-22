import express from "express";
import { healthRouter } from "./modules/health/health.routes.js";

export const app = express();

// Global middleware
app.use(express.json());

// API routes
app.use("/api/health", healthRouter);