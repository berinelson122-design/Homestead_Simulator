export type DeviceType = 'PC' | 'MOBILE' | 'CONSOLE';

export type CommandNode = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'ACTION' | 'BOMB' | 'FOCUS';

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
