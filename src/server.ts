import { app } from "./app.js";

const PORT = 3001;

app.listen(PORT, () => {
  console.log("🏎️ F1 Telemetry Backend");
  console.log(`🚀 HTTP server: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});