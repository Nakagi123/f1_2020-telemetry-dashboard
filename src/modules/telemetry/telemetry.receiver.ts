import dgram from "node:dgram";

const UDP_PORT = 20777;
const UDP_HOST = "127.0.0.1";

export function startTelemetryReceiver(): void {
  const socket = dgram.createSocket("udp4");

  socket.on("error", (error: Error) => {
    console.error("❌ UDP receiver error:", error.message);
    socket.close();
  });

  socket.on("message", (message: Buffer) => {
    // F1 2020 packets have a 24-byte header.
    if (message.length < 24) {
      console.warn("⚠️ Received packet shorter than 24 bytes");
      return;
    }

    const packetFormat = message.readUInt16LE(0);
    const packetId = message.readUInt8(5);

    if (packetFormat !== 2020) {
      console.warn(`Unexpected packet format: ${packetFormat}`);
      return;
    }

    console.log(
      `🏎️ F1 Packet | ID: ${packetId} | Size: ${message.length} bytes`
    );
  });

  socket.bind(UDP_PORT, UDP_HOST, () => {
    console.log(`📡 UDP receiver listening on ${UDP_HOST}:${UDP_PORT}`);
  });
}