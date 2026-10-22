export interface CarTelemetry {
  speed: number;      // km/h
  throttle: number;   // 0.0 to 1.0
  brake: number;      // 0.0 to 1.0
  gear: number;       // -1 = R, 0 = N, 1-8
  rpm: number;
}