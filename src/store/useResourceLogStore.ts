import { create } from 'zustand';
import { ResourceLogPoint, HomesteadMetrics } from '../types';
import { audioSynth } from '../services/AudioSynth';

interface ResourceLogState {
  logPoints: ResourceLogPoint[];
  isLogPanelOpen: boolean;
  selectedMetricGroup: 'ENERGY' | 'WATER' | 'BIOMASS';
  setSelectedMetricGroup: (group: 'ENERGY' | 'WATER' | 'BIOMASS') => void;
  setLogPanelOpen: (open: boolean) => void;
  toggleLogPanel: () => void;
  recordPoint: (metrics: HomesteadMetrics) => void;
  generateHistory: (metrics: HomesteadMetrics) => void;
}

// Generates 60 realistic historical minute points leading up to the current moment
const createInitialHistory = (metrics: HomesteadMetrics): ResourceLogPoint[] => {
  const points: ResourceLogPoint[] = [];
  const now = Date.now();

  for (let i = 60; i >= 0; i--) {
    const minuteAgo = i;
    const timestamp = now - i * 60 * 1000;

    // Subtle sinusoidal variation across the 60 minutes
    const wave = Math.sin((60 - i) * 0.15) * 0.08;
    const waveNoise = (Math.sin((60 - i) * 0.7) + Math.cos((60 - i) * 1.3)) * 0.04;
    const factor = 1 + wave + waveNoise;

    const pGen = Math.max(0, Math.round(metrics.totalPowerGen * factor * 10) / 10);
    const pDraw = Math.max(0, Math.round(metrics.totalPowerDraw * (1 + wave * 0.5) * 10) / 10);
    const netP = Math.round((pGen - pDraw) * 10) / 10;

    const wGen = Math.max(0, Math.round(metrics.totalWaterGen * factor * 10) / 10);
    const wDraw = Math.max(0, Math.round(metrics.totalWaterDraw * (1 - wave * 0.3) * 10) / 10);
    const netW = Math.round((wGen - wDraw) * 10) / 10;

    const cal = Math.max(0, Math.round(metrics.totalCalories * factor));
    const ch4 = Math.max(0, Math.round(metrics.totalMethane * factor * 100) / 100);
    const fert = Math.max(0, Math.round(metrics.totalFertilizer * factor * 10) / 10);
    const bio = Math.max(0, Math.round(metrics.totalBiochar * factor * 10) / 10);

    points.push({
      minuteAgo,
      timestamp,
      powerGen: pGen,
      powerDraw: pDraw,
      netPower: netP,
      waterGen: wGen,
      waterDraw: wDraw,
      netWater: netW,
      calories: cal,
      methane: ch4,
      fertilizer: fert,
      biochar: bio,
    });
  }

  return points;
};

export const useResourceLogStore = create<ResourceLogState>((set, get) => ({
  logPoints: createInitialHistory({
    totalPowerGen: 15,
    totalPowerStorage: 15,
    totalPowerDraw: 8.5,
    netPower: 6.5,
    totalWaterGen: 25,
    totalWaterStorage: 500,
    totalWaterDraw: 74,
    netWater: -49,
    totalCalories: 6600,
    totalMethane: 1.8,
    totalFertilizer: 25,
    totalBiochar: 0,
    sustainabilityScore: 78,
  }),
  isLogPanelOpen: false,
  selectedMetricGroup: 'ENERGY',

  setSelectedMetricGroup: (selectedMetricGroup) => {
    audioSynth.playSelect();
    set({ selectedMetricGroup });
  },

  setLogPanelOpen: (isLogPanelOpen) => {
    audioSynth.playSelect();
    set({ isLogPanelOpen });
  },

  toggleLogPanel: () => {
    const next = !get().isLogPanelOpen;
    audioSynth.playSelect();
    set({ isLogPanelOpen: next });
  },

  recordPoint: (metrics) => {
    const currentPoints = get().logPoints;
    const now = Date.now();

    // Shift minuteAgo on older points and append new live point
    const shifted = currentPoints.slice(1).map((p, idx) => ({
      ...p,
      minuteAgo: 60 - idx,
    }));

    const newPoint: ResourceLogPoint = {
      minuteAgo: 0,
      timestamp: now,
      powerGen: metrics.totalPowerGen,
      powerDraw: metrics.totalPowerDraw,
      netPower: metrics.netPower,
      waterGen: metrics.totalWaterGen,
      waterDraw: metrics.totalWaterDraw,
      netWater: metrics.netWater,
      calories: metrics.totalCalories,
      methane: metrics.totalMethane,
      fertilizer: metrics.totalFertilizer,
      biochar: metrics.totalBiochar,
    };

    set({ logPoints: [...shifted, newPoint] });
  },

  generateHistory: (metrics) => {
    set({ logPoints: createInitialHistory(metrics) });
  },
}));
