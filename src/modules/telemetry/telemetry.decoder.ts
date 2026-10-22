import type { CarTelemetry } from "./telemetry.types.js";

const HEADER_SIZE = 24;
const CAR_SIZE = 58;
const CAR_COUNT = 22;
const TELEMETRY_PACKET_SIZE = 1307;

export function decodeCarTelemetry(
  buffer: Buffer
): CarTelemetry | null {
  if (buffer.length !== TELEMETRY_PACKET_SIZE) {
    return null;
  }

  const packetFormat = buffer.readUInt16LE(0);
  const packetId = buffer.readUInt8(5);
  const playerCarIndex = buffer.readUInt8(22);

  if (packetFormat !== 2020 || packetId !== 6) {
    return null;
  }

  if (playerCarIndex >= CAR_COUNT) {
    return null;
  }

  const offset = HEADER_SIZE + playerCarIndex * CAR_SIZE;

  return {
    speed: buffer.readUInt16LE(offset),
    throttle: buffer.readFloatLE(offset + 2),
    brake: buffer.readFloatLE(offset + 10),
    gear: buffer.readInt8(offset + 15),
    rpm: buffer.readUInt16LE(offset + 16),
  };
}