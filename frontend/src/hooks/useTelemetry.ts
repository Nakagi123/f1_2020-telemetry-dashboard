import { useEffect, useState } from "react";

import type {
  CarTelemetry,
  DriverInfo,
  SessionInfo,
} from "../types/telemetry";

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected";

interface TelemetryState {
  telemetry: CarTelemetry | null;
  driver: DriverInfo | null;
  session: SessionInfo | null;
  status: ConnectionStatus;
}

const WS_URL =
  import.meta.env.VITE_WS_URL ??
  "ws://localhost:3001/ws";

export function useTelemetry(): TelemetryState {
  const [telemetry, setTelemetry] =
    useState<CarTelemetry | null>(null);

  const [driver, setDriver] =
    useState<DriverInfo | null>(null);

  const [session, setSession] =
    useState<SessionInfo | null>(null);

  const [status, setStatus] =
    useState<ConnectionStatus>("connecting");

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let stopped = false;

    function connect() {
      if (stopped) return;

      setStatus("connecting");

      socket = new WebSocket(WS_URL);

      socket.onopen = () => {
        if (stopped) return;

        setStatus("connected");
        console.log("📡 Connected to F1 telemetry backend");
      };

      socket.onmessage = (event: MessageEvent) => {
        if (stopped) return;

        try {
          const message = JSON.parse(event.data);

          switch (message.type) {
            case "telemetry": {
              const data = message.data;

              setTelemetry({
                speed: data.speed,
                gear: data.gear,
                rpm: data.rpm,
                // UDP decoder returns fractions from 0 to 1.
                throttle: Math.round(data.throttle * 100),
                brake: Math.round(data.brake * 100),
              });

              break;
            }

            case "driver":
              setDriver(message.data as DriverInfo);
              break;

            case "session":
              setSession(message.data as SessionInfo);
              break;

            default:
              break;
          }
        } catch (error) {
          console.error(
            "❌ Failed to parse WebSocket message:",
            error
          );
        }
      };

      socket.onclose = () => {
        if (stopped) return;

        setStatus("disconnected");
        setTelemetry(null);
        setDriver(null);
        setSession(null);

        console.log(
          "🔌 Disconnected. Reconnecting in 3 seconds..."
        );

        reconnectTimer = setTimeout(connect, 3000);
      };

      socket.onerror = () => {
        // Closing triggers onclose, which schedules reconnect.
        socket?.close();
      };
    }

    connect();

    return () => {
      stopped = true;
      clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, []);

  return {
    telemetry,
    driver,
    session,
    status,
  };
}