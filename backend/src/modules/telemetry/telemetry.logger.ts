import type { CarTelemetry } from "./telemetry.types.js";

const LOG_INTERVAL_MS = 500;

let lastLogTime = 0;

export function logTelemetry(
  telemetry: CarTelemetry
): void {
  const now = Date.now();

  if (now - lastLogTime < LOG_INTERVAL_MS) {
    return;
  }

  lastLogTime = now;

  const gear =
    telemetry.gear === -1
      ? "R"
      : telemetry.gear === 0
        ? "N"
        : String(telemetry.gear);

  const throttle = Math.round(telemetry.throttle * 100);
  const brake = Math.round(telemetry.brake * 100);

  console.log(
    `🏎️ ${String(telemetry.speed).padStart(3)} km/h | ` +
    `Gear: ${gear} | ` +
    `RPM: ${String(telemetry.rpm).padStart(5)} | ` +
    `Throttle: ${String(throttle).padStart(3)}% | ` +
    `Brake: ${String(brake).padStart(3)}%`
  );
}