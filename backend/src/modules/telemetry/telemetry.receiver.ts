import dgram from "node:dgram";

import {
  PACKET_ID,
  TELEMETRY_CONFIG,
} from "./telemetry.constants.js";

import { decodeCarTelemetry } from "./telemetry.decoder.js";
import { logTelemetry } from "./telemetry.logger.js";
import { decodeSession } from "./telemetry.session.js";
import { decodePlayerInfo } from "./telemetry.participants.js";

export interface TelemetryMessage {
  type: "telemetry" | "session" | "driver";
  data: unknown;
}

export type TelemetryCallback = (
  message: TelemetryMessage
) => void;

export function startTelemetryReceiver(
  onData?: TelemetryCallback
): () => Promise<void> {
  const socket = dgram.createSocket("udp4");

  let isClosed = false;
  let lastSessionSummary: string | null = null;
  let lastPlayerSummary: string | null = null;

  socket.on("error", (error: Error) => {
    console.error("❌ UDP receiver error:", error.message);
  });

  socket.on("message", (message: Buffer) => {
    if (message.length < 24) {
      return;
    }

    const packetId = message.readUInt8(5);

    switch (packetId) {
      case PACKET_ID.CAR_TELEMETRY: {
        const telemetry = decodeCarTelemetry(message);

        if (!telemetry) {
          break;
        }

        // Keep terminal logging throttled.
        logTelemetry(telemetry);

        // Send every decoded update to WebSocket.
        onData?.({
          type: "telemetry",
          data: telemetry,
        });

        break;
      }

      case PACKET_ID.SESSION: {
        const session = decodeSession(message);

        if (!session) {
          break;
        }

        const summary = [
          session.trackId,
          session.sessionType,
          session.weather,
          session.trackTemperature,
          session.airTemperature,
        ].join(":");

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

        // Broadcast session information.
        onData?.({
          type: "session",
          data: session,
        });

        break;
      }

      case PACKET_ID.PARTICIPANTS: {
        const player = decodePlayerInfo(message);

        if (!player) {
          break;
        }

        const summary = [
          player.driverId,
          player.driverName,
          player.teamId,
          player.raceNumber,
        ].join(":");

        if (summary !== lastPlayerSummary) {
          lastPlayerSummary = summary;

          console.log(
            `\n👤 Driver: ${player.driverName}\n` +
            `🏎️ Team: ${player.teamName}\n` +
            `🔢 Race number: ${player.raceNumber}\n`
          );
        }

        // Broadcast driver information.
        onData?.({
          type: "driver",
          data: player,
        });

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