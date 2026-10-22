export interface CarTelemetry {
  speed: number;
  gear: number;
  rpm: number;
  throttle: number;
  brake: number;
}

export interface DriverInfo {
  driverName: string;
  teamName: string;
  raceNumber: number;
}

export interface SessionInfo {
  trackName: string;
  sessionName: string;
  weatherName: string;
  trackTemperature: number;
  airTemperature: number;
}