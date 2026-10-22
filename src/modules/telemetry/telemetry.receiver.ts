import dgram from "node:dgram";
import { decodeCarTelemetry } from "./telemetry.decoder.js";

const UDP_PORT = 20777;
const UDP_HOST = "127.0.0.1";

export function startTelemetryReceiver(): void {
  const socket = dgram.createSocket("udp4");

  socket.on("error", (error: Error) => {
    console.error("❌ UDP receiver error:", error.message);
    socket.close();
  });

  socket.on("message", (message: Buffer) => {
    const telemetry = decodeCarTelemetry(message);

    if (!telemetry) {
      return;
    }

    const gear =
      telemetry.gear === -1
        ? "R"
        : telemetry.gear === 0
          ? "N"
          : String(telemetry.gear);

    const throttle = Math.round(telemetry.throttle * 100);
    const brake = Math.round(telemetry.brake * 100);

    console.log(
      `🏎️ SPEED: ${telemetry.speed} km/h | ` +
      `GEAR: ${gear} | RPM: ${telemetry.rpm} | ` +
      `THROTTLE: ${throttle}% | BRAKE: ${brake}%`
    );
  });

  socket.bind(UDP_PORT, UDP_HOST, () => {
    console.log(`📡 UDP receiver listening on ${UDP_HOST}:${UDP_PORT}`);
  });
}