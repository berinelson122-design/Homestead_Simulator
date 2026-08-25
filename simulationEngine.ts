import { PlacedStructure, HomesteadMetrics, StressTestResult } from '../types';

export const STRUCTURE-SPECS = {
  'CABIN': { powerGen: 0, powerStorage: 0, powerDraw: 8, waterGen: 0, waterStorage: 0, waterDraw: 40, calories: 0, methane: 0, fertilizer: 0, biochar: 0, cost: 5000 },
  'SOLAR-ARRAY': { powerGen: 15, powerStorage: 0, powerDraw: 0, waterGen: 0, waterStorage: 0, waterDraw: 0, calories: 0, methane: 0, fertilizer: 0, biochar: 0, cost: 1200 },
  'BATTERY-BANK': { powerGen: 0, powerStorage: 15, powerDraw: 0.5, waterGen: 0, waterStorage: 0, waterDraw: 0, calories: 0, methane: 0, fertilizer: 0, biochar: 0, cost: 2000 },
  'RAIN-CISTERN': { powerGen: 0, powerStorage: 0, powerDraw: 0, waterGen: 25, waterStorage: 500, waterDraw: 0, calories: 0, methane: 0, fertilizer: 0, biochar: 0, cost: 400 },
  'WELL-PUMP': { powerGen: 0, powerStorage: 0, powerDraw: 3, waterGen: 150, waterStorage: 0, waterDraw: 0, calories: 0, methane: 0, fertilizer: 0, biochar: 0, cost: 3500 },
  'RAISED-BED': { powerGen: 0, powerStorage: 0, powerDraw: 0, waterGen: 0, waterStorage: 0, waterDraw: 4, calories: 800, methane: 0, fertilizer: 0, biochar: 0, cost: 100 },
  'GREENHOUSE': { powerGen: 0, powerStorage: 0, powerDraw: 2, waterGen: 0, waterStorage: 0, waterDraw: 15, calories: 3500, methane: 0, fertilizer: 0, biochar: 0, cost: 1500 },
  'COW-PASTURE': { powerGen: 0, powerStorage: 0, powerDraw: 0, waterGen: 0, waterStorage: 0, waterDraw: 30, calories: 5000, methane: 0, fertilizer: 0, biochar: 0, cost: 2500 },
  'METHANE-DIGESTER': { powerGen: 0, powerStorage: 0, powerDraw: 1, waterGen: 0, waterStorage: 0, waterDraw: 5, calories: 0, methane: 1.8, fertilizer: 25, biochar: 0, cost: 1800 },
  'BIOCHAR-RETORT': { powerGen: 0, powerStorage: 0, powerDraw: 0, waterGen: 0, waterStorage: 0, waterDraw: 0, calories: 0, methane: 0, fertilizer: 0, biochar: 12, cost: 600 },
};

export const calculateHomesteadMetrics = (structures: PlacedStructure[]): HomesteadMetrics => {
  let powerGen = 0;
  let powerStorage = 0;
  let powerDraw = 0;

  let waterGen = 0;
  let waterStorage = 0;
  let waterDraw = 0;

  let calories = 0;
  let methane = 0;
  let fertilizer = 0;
  let biochar = 0;

  structures.forEach((s) => {
    const spec = STRUCTURE-SPECS[s.type];
    if (!spec) return;
    powerGen += spec.powerGen;
    powerStorage += spec.powerStorage;
    powerDraw += spec.powerDraw;

    waterGen += spec.waterGen;
    waterStorage += spec.waterStorage;
    waterDraw += spec.waterDraw;

    calories += spec.calories;
    methane += spec.methane;
    fertilizer += spec.fertilizer;
    biochar += spec.biochar;
  });

  // Biochar boosts raised bed and greenhouse outputs by 25% if present
  if (biochar > 0) {
    calories *= 1.25;
  }

  const netPower = powerGen - powerDraw;
  const netWater = waterGen - waterDraw;

  // Sustainability index calculation (target: 6000 kcal for 2 humans, positive net power, positive net water)
  let score = 0;
  if (calories >= 6000) score += 35;
  else score += (calories / 6000) * 35;

  if (netPower >= 0) score += 35;
  else if (powerStorage > 0) score += Math.max(0, 35 + netPower * 2);

  if (netWater >= 0) score += 30;
  else if (waterStorage > 0) score += Math.max(0, 30 + netWater * 0.5);

  return {
    totalPowerGen: powerGen,
    totalPowerStorage: powerStorage,
    totalPowerDraw: powerDraw,
    netPower,

    totalWaterGen: waterGen,
    totalWaterStorage: waterStorage,
    totalWaterDraw: waterDraw,
    netWater,

    totalCalories: Math.round(calories),
    totalMethane: parseFloat(methane.toFixed(2)),
    totalFertilizer: Math.round(fertilizer),
    totalBiochar: Math.round(biochar),

    sustainabilityScore: Math.min(100, Math.round(score)),
  };
};

export const runStressScenario = (
  scenarioType: 'GRID-DOWN' | 'DROUGHT' | 'FREEZE',
  structures: PlacedStructure[]
): StressTestResult => {
  const metrics = calculateHomesteadMetrics(structures);
  const log: string[] = [];
  const maxDays = scenarioType === 'GRID-DOWN' ? 14 : 30;

  let currentBattery = metrics.totalPowerStorage;
  let currentWater = metrics.totalWaterStorage;
  let currentFood = 40000; // 40,000 kcal emergency baseline

  let failureDay: number | null = null;
  let bottleneck = 'NONE';

  for (let day = 1; day <= maxDays; day++) {
    let powerInput = metrics.totalPowerGen;
    let waterInput = metrics.totalWaterGen;
    let powerUse = metrics.totalPowerDraw;
    let waterUse = metrics.totalWaterDraw;
    let foodProduced = metrics.totalCalories;

    // Apply scenario parameters
    if (scenarioType === 'GRID-DOWN') {
      // Complete solar blackout / heavy overcast (Solar drops to 10%)
      powerInput *= 0.1;
    } else if (scenarioType === 'DROUGHT') {
      // Rainwater cisterns collect 0
      waterInput = structures.filter(s => s.type === 'WELL-PUMP').length * 150;
    } else if (scenarioType === 'FREEZE') {
      // Winter heating increases power draw, freezing drops water lines by 30%
      powerUse += 12;
      waterInput *= 0.7;
    }

    // Battery simulation
    const powerDelta = powerInput - powerUse;
    currentBattery += powerDelta;
    if (currentBattery > metrics.totalPowerStorage) {
      currentBattery = metrics.totalPowerStorage;
    }

    // Water simulation
    const waterDelta = waterInput - waterUse;
    currentWater += waterDelta;
    if (currentWater > metrics.totalWaterStorage) {
      currentWater = metrics.totalWaterStorage;
    }

    // Food balance (2 humans need 6,000 kcal per day)
    currentFood += (foodProduced - 6000);

    // Evaluate failure states
    if (currentBattery < 0 && failureDay === null) {
      failureDay = day;
      bottleneck = 'BATTERY RESERVES DEPLETED';
      log.push(`[DAY ${day}] FAILURE: Electrical storage exhausted. Systems shutdown.`);
    }

    if (currentWater < 0 && failureDay === null) {
      failureDay = day;
      bottleneck = 'HYDRATION CISTERN EXHAUSTED';
      log.push(`[DAY ${day}] FAILURE: Water reservoir empty. Irrigation and livestock fail.`);
    }

    if (currentFood < 0 && failureDay === null) {
      failureDay = day;
      bottleneck = 'CALORIC DEFICIT COLLAPSE';
      log.push(`[DAY ${day}] FAILURE: Food stores depleted. Nutritional starvation.`);
    }

    if (day === 1 || day === 7 || day === 14 || day === 30) {
      log.push(`[DAY ${day}] Power: ${formatDec(Math.max(0, currentBattery))} kWh | Water: ${formatDec(Math.max(0, currentWater))} Gal | Food: ${Math.round(currentFood)} kcal`);
    }
  }

  const daysSurvived = failureDay !== null ? failureDay : maxDays;

  return {
    scenarioName: scenarioType,
    daysSurvived,
    maxDays,
    bottleneck: failureDay !== null ? bottleneck : 'SYSTEM SUSTAINED (100% SUCCESS)',
    failureDay,
    log,
  };
};