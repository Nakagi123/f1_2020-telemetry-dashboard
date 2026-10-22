import {
  PACKET_ID,
  TELEMETRY_CONFIG,
} from "./telemetry.constants.js";

export interface PlayerInfo {
  driverId: number;
  driverName: string;
  teamId: number;
  teamName: string;
  raceNumber: number;
}

const PARTICIPANTS_PACKET_SIZE = 1213;
const PARTICIPANT_SIZE = 54;
const PARTICIPANTS_OFFSET = 25;

const TEAM_NAMES: Record<number, string> = {
  0: "Mercedes",
  1: "Ferrari",
  2: "Red Bull Racing",
  3: "Williams",
  4: "Racing Point",
  5: "Renault",
  6: "AlphaTauri",
  7: "Haas",
  8: "McLaren",
  9: "Alfa Romeo",
  10: "McLaren 1988",
  11: "McLaren 1991",
  12: "Williams 1992",
  20: "McLaren 2008",
  21: "Red Bull 2010",
  31: "McLaren 1990",
  38: "Williams 2003",
  39: "Brawn 2009",
  41: "F1 Generic Car",
  255: "My Team",
};

export function decodePlayerInfo(
  buffer: Buffer
): PlayerInfo | null {
  if (buffer.length !== PARTICIPANTS_PACKET_SIZE) {
    return null;
  }

  const packetFormat = buffer.readUInt16LE(0);
  const packetId = buffer.readUInt8(5);

  if (
    packetFormat !== TELEMETRY_CONFIG.FORMAT ||
    packetId !== PACKET_ID.PARTICIPANTS
  ) {
    return null;
  }

  const playerCarIndex = buffer.readUInt8(22);
  const activeCars = buffer.readUInt8(24);

  if (
    activeCars > 22 ||
    playerCarIndex >= activeCars
  ) {
    return null;
  }

  const offset =
    PARTICIPANTS_OFFSET +
    playerCarIndex * PARTICIPANT_SIZE;

  const driverId = buffer.readUInt8(offset + 1);
  const teamId = buffer.readUInt8(offset + 2);
  const raceNumber = buffer.readUInt8(offset + 3);

  // Driver names are UTF-8 and null-terminated.
  const nameBytes = buffer.subarray(
    offset + 5,
    offset + 53
  );

  const nullIndex = nameBytes.indexOf(0);

  const driverName = nameBytes
    .subarray(
      0,
      nullIndex === -1 ? nameBytes.length : nullIndex
    )
    .toString("utf8")
    .trim();

  return {
    driverId,
    driverName: driverName || `Driver ${driverId}`,
    teamId,
    teamName:
      TEAM_NAMES[teamId] ?? `Unknown Team (${teamId})`,
    raceNumber,
  };
}