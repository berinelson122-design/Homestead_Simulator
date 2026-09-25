import { create } from 'zustand';
import {
  PlacedStructure,
  StructureType,
  HomesteadMetrics,
  StressTestResult,
  WeatherType,
  TouchInteractionMode,
  MobileActivePanel,
} from '../types';
import { calculateHomesteadMetrics, runStressScenario } from '../utils/simulationEngine';
import { audioSynth } from '../services/AudioSynth';
import { useTimelapseStore } from './useTimelapseStore';
import { useWeatherStore } from './useWeatherStore';

interface HomesteadState {
  structures: PlacedStructure[];
  selectedTool: StructureType;
  metrics: HomesteadMetrics;
  stressResult: StressTestResult | null;
  isModalOpen: boolean;
  interactionMode: TouchInteractionMode;
  mobilePanel: MobileActivePanel;
  cameraResetCounter: number;
  isBlueprintMode: boolean;
  isEnergyOverlayMode: boolean;
  isHelpModalOpen: boolean;

  setSelectedTool: (tool: StructureType) => void;
  setInteractionMode: (mode: TouchInteractionMode) => void;
  setMobilePanel: (panel: MobileActivePanel) => void;
  toggleMobilePanel: (panel: MobileActivePanel) => void;
  toggleBlueprintMode: () => void;
  toggleEnergyOverlayMode: () => void;
  setHelpModalOpen: (open: boolean) => void;
  toggleHelpModal: () => void;
  resetCamera: () => void;
  addStructure: (x: number, z: number) => void;
  removeStructure: (id: string) => void;
  removeStructureAtGrid: (x: number, z: number) => void;
  clearGrid: () => void;
  runTest: (scenario: 'GRID-DOWN' | 'DROUGHT' | 'FREEZE') => void;
  closeModal: () => void;
  recomputeMetrics: () => void;
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
  metrics: calculateHomesteadMetrics(initialStructures, 'CLEAR'),
  stressResult: null,
  isModalOpen: false,
  interactionMode: 'BUILD',
  mobilePanel: 'NONE',
  cameraResetCounter: 0,
  isBlueprintMode: false,
  isEnergyOverlayMode: false,
  isHelpModalOpen: false,

  recomputeMetrics: () => {
    const weather = useWeatherStore.getState().current;
    set({ metrics: calculateHomesteadMetrics(get().structures, weather) });
  },

  toggleBlueprintMode: () => {
    const next = !get().isBlueprintMode;
    audioSynth.playBlueprintToggle(next);
    set({ isBlueprintMode: next });
  },

  toggleEnergyOverlayMode: () => {
    const next = !get().isEnergyOverlayMode;
    audioSynth.playEnergyOverlayToggle(next);
    set({ isEnergyOverlayMode: next });
  },

  setHelpModalOpen: (open) => {
    if (open) audioSynth.playIntelOpen();
    else audioSynth.playSelect();
    set({ isHelpModalOpen: open });
  },

  toggleHelpModal: () => {
    const next = !get().isHelpModalOpen;
    if (next) audioSynth.playIntelOpen();
    else audioSynth.playSelect();
    set({ isHelpModalOpen: next });
  },

  setSelectedTool: (selectedTool) => {
    audioSynth.init();
    audioSynth.playSelect();
    set({ selectedTool, interactionMode: 'BUILD' });
  },

  setInteractionMode: (interactionMode) => {
    audioSynth.playSelect();
    set({ interactionMode });
  },

  setMobilePanel: (mobilePanel) => {
    audioSynth.playSelect();
    set({ mobilePanel });
  },

  toggleMobilePanel: (panel) => {
    audioSynth.playSelect();
    set((state) => ({
      mobilePanel: state.mobilePanel === panel ? 'NONE' : panel,
    }));
  },

  resetCamera: () => {
    audioSynth.playSelect();
    set((state) => ({ cameraResetCounter: state.cameraResetCounter + 1 }));
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
    const weather = useWeatherStore.getState().current;
    set({
      structures: nextStructures,
      metrics: calculateHomesteadMetrics(nextStructures, weather),
    });

    // Schedule snapshot frame after mesh renders
    setTimeout(() => {
      useTimelapseStore.getState().triggerManualCapture();
    }, 180);
  },

  removeStructure: (id) => {
    audioSynth.playRemove();
    const nextStructures = get().structures.filter((s) => s.id !== id);
    const weather = useWeatherStore.getState().current;
    set({
      structures: nextStructures,
      metrics: calculateHomesteadMetrics(nextStructures, weather),
    });

    // Schedule snapshot frame after mesh removal
    setTimeout(() => {
      useTimelapseStore.getState().triggerManualCapture();
    }, 180);
  },

  removeStructureAtGrid: (x, z) => {
    const match = get().structures.find((s) => s.x === x && s.z === z);
    if (match) {
      get().removeStructure(match.id);
    }
  },

  clearGrid: () => {
    audioSynth.playRemove();
    const weather = useWeatherStore.getState().current;
    set({
      structures: [],
      metrics: calculateHomesteadMetrics([], weather),
    });

    setTimeout(() => {
      useTimelapseStore.getState().triggerManualCapture();
    }, 180);
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