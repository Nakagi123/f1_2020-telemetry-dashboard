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
  let lastTrackId: number | null = null;

  socket.on("error", (error: Error) => {
    console.error("❌ UDP receiver error:", error.message);
  });

  socket.on("message", (message: Buffer) => {
    // Packet header must be present.
    if (message.length < 24) {
      return;
    }

    const packetId = message.readUInt8(5);

    switch (packetId) {
      case PACKET_ID.CAR_TELEMETRY: {
        const telemetry = decodeCarTelemetry(message);

        if (telemetry) {
          logTelemetry(telemetry);
        }

        break;
      }

      case PACKET_ID.SESSION: {
        const session = decodeSession(message);

        if (session && session.trackId !== lastTrackId) {
          lastTrackId = session.trackId;

          console.log(
            `🏁 Circuit detected: ${session.trackName}`
          );
        }

        break;
      }

      default:
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