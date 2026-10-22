import {
  PACKET_ID,
  TELEMETRY_CONFIG,
} from "./telemetry.constants.js";

export interface SessionInfo {
  trackId: number;
  trackName: string;
}

const SESSION_PACKET_SIZE = 251;
const TRACK_ID_OFFSET = 31;

const TRACK_NAMES: Record<number, string> = {
  0: "Melbourne",
  1: "Paul Ricard",
  2: "Shanghai",
  3: "Sakhir (Bahrain)",
  4: "Catalunya",
  5: "Monaco",
  6: "Montreal",
  7: "Silverstone",
  8: "Hockenheim",
  9: "Hungaroring",
  10: "Spa-Francorchamps",
  11: "Monza",
  12: "Singapore",
  13: "Suzuka",
  14: "Abu Dhabi",
  15: "Texas (COTA)",
  16: "Brazil (Interlagos)",
  17: "Austria (Red Bull Ring)",
  18: "Sochi",
  19: "Mexico",
  20: "Baku",
  21: "Sakhir Short",
  22: "Silverstone Short",
  23: "Texas Short",
  24: "Suzuka Short",
  25: "Hanoi",
  26: "Zandvoort",
};

export function decodeSession(
  buffer: Buffer
): SessionInfo | null {
  // Validate the Session packet size.
  if (buffer.length !== SESSION_PACKET_SIZE) {
    return null;
  }

  // Read packet header.
  const packetFormat = buffer.readUInt16LE(0);
  const packetId = buffer.readUInt8(5);

  // Only accept F1 2020 Session packets.
  if (
    packetFormat !== TELEMETRY_CONFIG.FORMAT ||
    packetId !== PACKET_ID.SESSION
  ) {
    return null;
  }

  // Track ID is at byte offset 31.
  const trackId = buffer.readInt8(TRACK_ID_OFFSET);

  // Convert the numeric ID into a readable name.
  const trackName =
    TRACK_NAMES[trackId] ?? `Unknown (${trackId})`;

  return {
    trackId,
    trackName,
  };
}