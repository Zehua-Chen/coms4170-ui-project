export interface ProductionEnvironment {
  mode: 'production';
}

export interface Emulator {
  host: string;
  port: number;
}

export interface DevelopmentEnvironment {
  authEmulatorUrl: string;
  firestoreEmulator: Emulator;
  mode: 'development';
}

export type Environment = ProductionEnvironment | DevelopmentEnvironment;
