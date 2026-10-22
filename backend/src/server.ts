import { app } from "./app.js";
import { startTelemetryReceiver } from "./modules/telemetry/telemetry.receiver.js";

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 HTTP server running at http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});

const stopTelemetryReceiver = startTelemetryReceiver();

let isShuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`\n🛑 Received ${signal}. Shutting down...`);

  try {
    await Promise.all([
      new Promise<void>((resolve, reject) => {
        server.close((error?: Error) => {
          if (error) {
            reject(error);
            return;
          }

          console.log("🌐 HTTP server closed.");
          resolve();
        });
      }),
      stopTelemetryReceiver(),
    ]);

    console.log("🏁 Backend shutdown complete.");
    process.exitCode = 0;
  } catch (error) {
    console.error("❌ Shutdown error:", error);
    process.exitCode = 1;
  }
}

process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});