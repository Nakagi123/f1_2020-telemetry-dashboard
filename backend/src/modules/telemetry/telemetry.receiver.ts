import dgram from "node:dgram";

import { TELEMETRY_CONFIG } from "./telemetry.constants.js";
import { decodeCarTelemetry } from "./telemetry.decoder.js";
import { logTelemetry } from "./telemetry.logger.js";

export function startTelemetryReceiver(): () => Promise<void> {
  const socket = dgram.createSocket("udp4");

  let isClosed = false;

  socket.on("error", (error: Error) => {
    console.error("❌ UDP receiver error:", error.message);
  });

  socket.on("message", (message: Buffer) => {
    const telemetry = decodeCarTelemetry(message);

    if (!telemetry) {
      return;
    }

    logTelemetry(telemetry);
  });

  socket.on("listening", () => {
    console.log(
      `📡 UDP receiver listening on ` +
      `${TELEMETRY_CONFIG.HOST}:${TELEMETRY_CONFIG.PORT}`
    );
  });

  socket.on("close", () => {
    isClosed = true;
    console.log("📡 UDP receiver closed.");
  });

  socket.bind(
    TELEMETRY_CONFIG.PORT,
    TELEMETRY_CONFIG.HOST
  );

  return () => {
    return new Promise<void>((resolve, reject) => {
      if (isClosed) {
        resolve();
        return;
      }

      socket.close((error?: Error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  };
}