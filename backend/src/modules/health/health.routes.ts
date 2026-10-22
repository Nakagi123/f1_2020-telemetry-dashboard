import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "F1 Telemetry Backend Online 🏎️",
    timestamp: new Date().toISOString(),
  });
});