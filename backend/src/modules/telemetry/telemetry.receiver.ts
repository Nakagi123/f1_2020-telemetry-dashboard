import dgram from "node:dgram";

import {
  PACKET_ID,
  TELEMETRY_CONFIG,
} from "./telemetry.constants.js";

import { decodeCarTelemetry } from "./telemetry.decoder.js";
import { logTelemetry } from "./telemetry.logger.js";
import { decodeSession } from "./telemetry.session.js";

export function startTelemetryReceiver(): () => Promise<void> {
  const socket = dgram.createSocket("udp4");

  let isClosed = false;
  let lastSessionSummary: string | null = null;

  socket.on("error", (error: Error) => {
    console.error("❌ UDP receiver error:", error.message);
  });

  socket.on("message", (message: Buffer) => {
    // Make sure the packet header is present.
    if (message.length < 24) {
      return;
    }

    const packetId = message.readUInt8(5);

    switch (packetId) {
      // ==========================================
      // CAR TELEMETRY — Packet ID 6
      // ==========================================
      case PACKET_ID.CAR_TELEMETRY: {
        const telemetry = decodeCarTelemetry(message);

        if (telemetry) {
          logTelemetry(telemetry);
        }

        break;
      }

      // ==========================================
      // SESSION INFORMATION — Packet ID 1
      // ==========================================
      case PACKET_ID.SESSION: {
        const session = decodeSession(message);

        if (!session) {
          break;
        }

        // Create a unique summary of the session data.
        const summary = [
          session.trackId,
          session.sessionType,
          session.weather,
          session.trackTemperature,
          session.airTemperature,
        ].join(":");

        // Only print when something changes.
        if (summary !== lastSessionSummary) {
          lastSessionSummary = summary;

          console.log(
            `\n🏁 Circuit: ${session.trackName}\n` +
            `🏎️ Session: ${session.sessionName}\n` +
            `🌤️ Weather: ${session.weatherName}\n` +
            `🌡️ Track: ${session.trackTemperature}°C | ` +
            `Air: ${session.airTemperature}°C\n`
          );
        }

        break;
      }

      default:
        // Ignore packet types we haven't implemented yet.
        break;
    }
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

  // Return a function for graceful shutdown.
  return () =>
    new Promise<void>((resolve, reject) => {
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
}