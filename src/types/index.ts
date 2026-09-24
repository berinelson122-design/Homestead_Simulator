export type DeviceType = 'PC' | 'MOBILE' | 'CONSOLE';

export type CommandNode =
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT'
  | 'ACTION'
  | 'BOMB'
  | 'FOCUS'
  | 'WEATHER_CYCLE'
  | 'CAPTURE_SNAPSHOT'
  | 'TIMELAPSE_TOGGLE';

export type WeatherType = 'CLEAR' | 'RAIN' | 'SNOW' | 'ACID_STORM';

export interface WeatherState {
  current: WeatherType;
  intensity: number; // 0.0 to 1.0
  windSpeed: number; // km/h
  temperatureC: number; // Celsius
  autoCycle: boolean;
  cycleIntervalSec: number;
}

export interface HomesteadSnapshot {
  id: string;
  timestamp: number;
  dataUrl: string;
  structureCount: number;
  weather: WeatherType;
  sustainabilityScore: number;
  netPower: number;
  netWater: number;
  totalCalories: number;
  note?: string;
}

export type StructureType =
  | 'CABIN'
  | 'SOLAR-ARRAY'
  | 'BATTERY-BANK'
  | 'RAIN-CISTERN'
  | 'WELL-PUMP'
  | 'RAISED-BED'
  | 'GREENHOUSE'
  | 'COW-PASTURE'
  | 'METHANE-DIGESTER'
  | 'BIOCHAR-RETORT';

export interface GridPosition {
  x: number;
  z: number;
}

export interface PlacedStructure {
  id: string;
  type: StructureType;
  x: number;
  z: number;
}

export interface HomesteadMetrics {
  totalPowerGen: number; // kWh per day
  totalPowerStorage: number; // kWh capacity
  totalPowerDraw: number; // kWh per day
  netPower: number;

  totalWaterGen: number; // Gallons per day
  totalWaterStorage: number; // Gallons capacity
  totalWaterDraw: number; // Gallons per day
  netWater: number;

  totalCalories: number; // kcal per day
  totalMethane: number; // m3 per day
  totalFertilizer: number; // Liters per day
  totalBiochar: number; // kg per day

  sustainabilityScore: number; // 0 - 100%
}

export interface StressTestResult {
  scenarioName: string;
  daysSurvived: number;
  maxDays: number;
  bottleneck: string;
  failureDay: number | null;
  log: string[];
}
