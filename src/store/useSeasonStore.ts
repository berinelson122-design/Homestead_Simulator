import { create } from 'zustand';
import { SeasonType, SeasonalConfig } from '../types';
import { audioSynth } from '../services/AudioSynth';

export const SEASONAL_CONFIGS: Record<SeasonType, SeasonalConfig> = {
  SPRING: {
    season: 'SPRING',
    label: 'VERDANT SPRING',
    temperatureModifier: 0,
    solarEfficiencyMultiplier: 1.05,
    waterEvaporationMultiplier: 0.95,
    cropYieldMultiplier: 1.25,
    terrainColor: 0x0a2615,
    gridColor: 0x39FF14,
    ambientColor: 0xd6fbe8,
    sunColor: 0x66ffaa,
    skyColor: 0x01140a,
    fogColor: 0x021c0e,
    description: 'Biological awakening. Crop germination speeds up by +25% with optimal moisture.',
  },
  SUMMER: {
    season: 'SUMMER',
    label: 'SOLAR SUMMER',
    temperatureModifier: 12,
    solarEfficiencyMultiplier: 1.35,
    waterEvaporationMultiplier: 1.3,
    cropYieldMultiplier: 1.1,
    terrainColor: 0x241d06,
    gridColor: 0xFFD700,
    ambientColor: 0xfff0dd,
    sunColor: 0xffbb00,
    skyColor: 0x120c02,
    fogColor: 0x1a1203,
    description: 'High solar radiation peak (+35% power). Increased irrigation demand from evaporation.',
  },
  AUTUMN: {
    season: 'AUTUMN',
    label: 'HARVEST AUTUMN',
    temperatureModifier: -2,
    solarEfficiencyMultiplier: 0.9,
    waterEvaporationMultiplier: 0.85,
    cropYieldMultiplier: 1.2,
    terrainColor: 0x260e06,
    gridColor: 0xFF5500,
    ambientColor: 0xffd2b5,
    sunColor: 0xff6622,
    skyColor: 0x140502,
    fogColor: 0x1f0904,
    description: 'Biomass harvest peak. Methane digestion and biochar feedstock output boosted by +30%.',
  },
  WINTER: {
    season: 'WINTER',
    label: 'GLACIAL WINTER',
    temperatureModifier: -16,
    solarEfficiencyMultiplier: 0.6,
    waterEvaporationMultiplier: 0.5,
    cropYieldMultiplier: 0.7,
    terrainColor: 0x061224,
    gridColor: 0x00F3FF,
    ambientColor: 0xd0eeff,
    sunColor: 0x88ccff,
    skyColor: 0x010714,
    fogColor: 0x030f24,
    description: 'Sub-zero freeze. Solar output drops by -40%, heating demand spikes (+6 kWh/d).',
  },
};

interface SeasonState {
  currentSeason: SeasonType;
  progress: number; // 0.0 to 1.0 within current season
  autoCycle: boolean;
  cycleDurationSec: number; // seconds per season
  setSeason: (season: SeasonType) => void;
  nextSeason: () => void;
  toggleAutoCycle: () => void;
  setCycleDurationSec: (sec: number) => void;
  advanceSeasonTick: (deltaSec: number) => void;
}

const SEASON_ORDER: SeasonType[] = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];

export const useSeasonStore = create<SeasonState>((set, get) => ({
  currentSeason: 'SPRING',
  progress: 0,
  autoCycle: true,
  cycleDurationSec: 40,

  setSeason: (currentSeason) => {
    audioSynth.playSelect();
    set({ currentSeason, progress: 0 });
  },

  nextSeason: () => {
    const current = get().currentSeason;
    const currentIndex = SEASON_ORDER.indexOf(current);
    const next = SEASON_ORDER[(currentIndex + 1) % SEASON_ORDER.length];
    audioSynth.playSelect();
    set({ currentSeason: next, progress: 0 });
  },

  toggleAutoCycle: () => {
    const next = !get().autoCycle;
    audioSynth.playSelect();
    set({ autoCycle: next });
  },

  setCycleDurationSec: (cycleDurationSec) => set({ cycleDurationSec }),

  advanceSeasonTick: (deltaSec) => {
    const { autoCycle, cycleDurationSec, progress, currentSeason } = get();
    if (!autoCycle) return;

    const newProgress = progress + deltaSec / cycleDurationSec;
    if (newProgress >= 1.0) {
      const currentIndex = SEASON_ORDER.indexOf(currentSeason);
      const next = SEASON_ORDER[(currentIndex + 1) % SEASON_ORDER.length];
      set({ currentSeason: next, progress: 0 });
    } else {
      set({ progress: newProgress });
    }
  },
}));
