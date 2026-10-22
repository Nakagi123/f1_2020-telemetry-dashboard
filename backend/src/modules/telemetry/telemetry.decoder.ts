import {
  PACKET,
  PACKET_ID,
  TELEMETRY_CONFIG,
} from "./telemetry.constants.js";

import type { CarTelemetry } from "./telemetry.types.js";

export function decodeCarTelemetry(
  buffer: Buffer
): CarTelemetry | null {
  if (buffer.length !== PACKET.CAR_TELEMETRY_SIZE) {
    return null;
  }

  const packetFormat = buffer.readUInt16LE(0);
  const packetId = buffer.readUInt8(5);
  const playerCarIndex = buffer.readUInt8(
    PACKET.PLAYER_CAR_INDEX_OFFSET
  );

  if (
    packetFormat !== TELEMETRY_CONFIG.FORMAT ||
    packetId !== PACKET_ID.CAR_TELEMETRY
  ) {
    return null;
  }

  if (playerCarIndex >= PACKET.CAR_COUNT) {
    return null;
  }

  const offset =
    PACKET.HEADER_SIZE + playerCarIndex * PACKET.CAR_SIZE;

  return {
    speed: buffer.readUInt16LE(offset),
    throttle: buffer.readFloatLE(offset + 2),
    brake: buffer.readFloatLE(offset + 10),
    gear: buffer.readInt8(offset + 15),
    rpm: buffer.readUInt16LE(offset + 16),
  };
}