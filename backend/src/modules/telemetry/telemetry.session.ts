import {
  PACKET_ID,
  TELEMETRY_CONFIG,
} from "./telemetry.constants.js";

export interface SessionInfo {
  trackId: number;
  trackName: string;
  sessionType: number;
  sessionName: string;
  weather: number;
  weatherName: string;
  trackTemperature: number;
  airTemperature: number;
}

const SESSION_PACKET_SIZE = 251;

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

const SESSION_NAMES: Record<number, string> = {
  0: "Unknown",
  1: "Practice 1",
  2: "Practice 2",
  3: "Practice 3",
  4: "Short Practice",
  5: "Qualifying 1",
  6: "Qualifying 2",
  7: "Qualifying 3",
  8: "Short Qualifying",
  9: "One-Shot Qualifying",
  10: "Race",
  11: "Race 2",
  12: "Time Trial",
};

const WEATHER_NAMES: Record<number, string> = {
  0: "Clear",
  1: "Light Cloud",
  2: "Overcast",
  3: "Light Rain",
  4: "Heavy Rain",
  5: "Storm",
};

export function decodeSession(
  buffer: Buffer
): SessionInfo | null {
  if (buffer.length !== SESSION_PACKET_SIZE) {
    return null;
  }

  const packetFormat = buffer.readUInt16LE(0);
  const packetId = buffer.readUInt8(5);

  if (
    packetFormat !== TELEMETRY_CONFIG.FORMAT ||
    packetId !== PACKET_ID.SESSION
  ) {
    return null;
  }

  const weather = buffer.readUInt8(24);
  const trackTemperature = buffer.readInt8(25);
  const airTemperature = buffer.readInt8(26);
  const sessionType = buffer.readUInt8(30);
  const trackId = buffer.readInt8(31);

  return {
    trackId,
    trackName:
      TRACK_NAMES[trackId] ?? `Unknown (${trackId})`,
    sessionType,
    sessionName:
      SESSION_NAMES[sessionType] ?? `Unknown (${sessionType})`,
    weather,
    weatherName:
      WEATHER_NAMES[weather] ?? `Unknown (${weather})`,
    trackTemperature,
    airTemperature,
  };
}