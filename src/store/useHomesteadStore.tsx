import { create } from 'zustand';
import { PlacedStructure, StructureType, HomesteadMetrics, StressTestResult } from '../types';
import { calculateHomesteadMetrics, runStressScenario } from '../utils/simulationEngine';
import { audioSynth } from '../services/AudioSynth';

interface HomesteadState {
  structures: PlacedStructure[];
  selectedTool: StructureType;
  metrics: HomesteadMetrics;
  stressResult: StressTestResult | null;
  isModalOpen: boolean;

  setSelectedTool: (tool: StructureType) => void;
  addStructure: (x: number, z: number) => void;
  removeStructure: (id: string) => void;
  clearGrid: () => void;
  runTest: (scenario: 'GRID-DOWN' | 'DROUGHT' | 'FREEZE') => void;
  closeModal: () => void;
}

const initialStructures: PlacedStructure[] = [
  { id: 'cab-1', type: 'CABIN', x: 0, z: 0 },
  { id: 'sol-1', type: 'SOLAR-ARRAY', x: -3, z: 0 },
  { id: 'bat-1', type: 'BATTERY-BANK', x: -3, z: -2 },
  { id: 'cis-1', type: 'RAIN-CISTERN', x: 3, z: 0 },
  { id: 'bed-1', type: 'RAISED-BED', x: 0, z: 4 },
  { id: 'bed-2', type: 'RAISED-BED', x: 2, z: 4 },
  { id: 'dig-1', type: 'METHANE-DIGESTER', x: -5, z: 4 },
  { id: 'cow-1', type: 'COW-PASTURE', x: -6, z: 8 },
];

export const useHomesteadStore = create<HomesteadState>((set, get) => ({
  structures: initialStructures,
  selectedTool: 'SOLAR-ARRAY',
  metrics: calculateHomesteadMetrics(initialStructures),
  stressResult: null,
  isModalOpen: false,

  setSelectedTool: (selectedTool) => {
    audioSynth.init();
    audioSynth.playSelect();
    set({ selectedTool });
  },

  addStructure: (x, z) => {
    const { structures, selectedTool } = get();
    // Check if cell occupied
    const occupied = structures.some((s) => s.x === x && s.z === z);
    if (occupied) return;

    audioSynth.playPlace();
    const newStructure: PlacedStructure = {
      id: `s-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: selectedTool,
      x,
      z,
    };

    const nextStructures = [...structures, newStructure];
    set({
      structures: nextStructures,
      metrics: calculateHomesteadMetrics(nextStructures),
    });
  },

  removeStructure: (id) => {
    audioSynth.playRemove();
    const nextStructures = get().structures.filter((s) => s.id !== id);
    set({
      structures: nextStructures,
      metrics: calculateHomesteadMetrics(nextStructures),
    });
  },

  clearGrid: () => {
    audioSynth.playRemove();
    set({
      structures: [],
      metrics: calculateHomesteadMetrics([]),
    });
  },

  runTest: (scenario) => {
    audioSynth.playAlert();
    const result = runStressScenario(scenario, get().structures);
    set({ stressResult: result, isModalOpen: true });
  },

  closeModal: () => {
    set({ isModalOpen: false });
  },
}));