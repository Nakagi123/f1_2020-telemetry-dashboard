import { app } from "./app.js";

import { startTelemetryReceiver } from "./modules/telemetry/telemetry.receiver.js";
import { startWebSocketServer } from "./modules/websocket/websocket.server.js";

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 HTTP server running at http://localhost:${PORT}`
  );

  console.log(
    `💚 Health check: http://localhost:${PORT}/api/health`
  );
});

// Start WebSocket server on the same HTTP port.
const websocket = startWebSocketServer(server);

// Store the latest message of each type.
const latestMessages = new Map<string, unknown>();

// Start receiving F1 2020 UDP packets.
const stopTelemetryReceiver = startTelemetryReceiver(
  (message) => {
    latestMessages.set(message.type, message);

    websocket.broadcast(message);
  }
);

let isShuttingDown = false;

async function shutdown(): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log("\n🛑 Shutting down servers...");

  try {
    await stopTelemetryReceiver();

    await websocket.close();

    await new Promise<void>((resolve, reject) => {
      server.close((error?: Error) => {
        if (error) {
          reject(error);
          return;
        }

        console.log("🚀 HTTP server closed.");
        resolve();
      });
    });

    console.log("✅ All servers shut down gracefully.");
  } catch (error) {
    console.error("❌ Shutdown error:", error);
    process.exitCode = 1;
  }
}

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});