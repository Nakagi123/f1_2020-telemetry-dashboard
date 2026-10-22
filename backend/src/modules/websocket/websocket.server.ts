import type { Server } from "node:http";
import {
  WebSocket,
  WebSocketServer,
} from "ws";

export interface WebSocketService {
  broadcast: (data: unknown) => void;
  close: () => Promise<void>;
}

export function startWebSocketServer(
  httpServer: Server
): WebSocketService {
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws",
  });

  wss.on("connection", (socket: WebSocket) => {
    console.log("🔌 WebSocket client connected.");

    socket.send(
      JSON.stringify({
        type: "connection",
        message: "Connected to F1 Telemetry Backend",
      })
    );

    socket.on("close", () => {
      console.log("🔌 WebSocket client disconnected.");
    });

    socket.on("error", (error: Error) => {
      console.error(
        "❌ WebSocket client error:",
        error.message
      );
    });
  });

  console.log(
    "📡 WebSocket server initialized at /ws"
  );

  function broadcast(data: unknown): void {
    const message = JSON.stringify(data);

    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  function close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Close active clients before shutting down.
      for (const client of wss.clients) {
        client.terminate();
      }

      wss.close((error?: Error) => {
        if (error) {
          reject(error);
          return;
        }

        console.log("📡 WebSocket server closed.");
        resolve();
      });
    });
  }

  return {
    broadcast,
    close,
  };
}