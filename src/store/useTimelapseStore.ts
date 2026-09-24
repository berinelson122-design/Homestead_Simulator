import { create } from 'zustand';
import { HomesteadSnapshot } from '../types';
import { audioSynth } from '../services/AudioSynth';

export interface TimelapseState {
  snapshots: HomesteadSnapshot[];
  isViewerOpen: boolean;
  playbackIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // 1, 2, 4
  autoCaptureIntervalSec: number;
  isAutoCaptureEnabled: boolean;
  lastCaptureTimestamp: number;
  captureRequestSignal: number;

  triggerManualCapture: () => void;
  addSnapshot: (snapshot: HomesteadSnapshot) => void;
  deleteSnapshot: (id: string) => void;
  clearSnapshots: () => void;
  setViewerOpen: (open: boolean) => void;
  setPlaybackIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleAutoCapture: () => void;
}

const MAX_SNAPSHOTS = 60; // Keep up to 60 snapshots in local memory

export const useTimelapseStore = create<TimelapseState>((set, get) => ({
  snapshots: [],
  isViewerOpen: false,
  playbackIndex: 0,
  isPlaying: false,
  playbackSpeed: 1,
  autoCaptureIntervalSec: 12,
  isAutoCaptureEnabled: true,
  lastCaptureTimestamp: 0,
  captureRequestSignal: 0,

  triggerManualCapture: () => {
    audioSynth.playCameraShutter();
    set((state) => ({ captureRequestSignal: state.captureRequestSignal + 1 }));
  },

  addSnapshot: (snapshot) => {
    const { snapshots } = get();
    const updated = [...snapshots, snapshot].slice(-MAX_SNAPSHOTS);
    set({
      snapshots: updated,
      lastCaptureTimestamp: Date.now(),
      playbackIndex: updated.length - 1,
    });
  },

  deleteSnapshot: (id) => {
    audioSynth.playRemove();
    const { snapshots, playbackIndex } = get();
    const updated = snapshots.filter((s) => s.id !== id);
    const newIdx = Math.max(0, Math.min(playbackIndex, updated.length - 1));
    set({ snapshots: updated, playbackIndex: newIdx });
  },

  clearSnapshots: () => {
    audioSynth.playRemove();
    set({ snapshots: [], playbackIndex: 0, isPlaying: false });
  },

  setViewerOpen: (open) => {
    if (open) {
      audioSynth.playSelect();
      const count = get().snapshots.length;
      set({ isViewerOpen: true, playbackIndex: Math.max(0, count - 1), isPlaying: false });
    } else {
      set({ isViewerOpen: false, isPlaying: false });
    }
  },

  setPlaybackIndex: (index) => {
    const count = get().snapshots.length;
    if (count === 0) return;
    const clamped = Math.max(0, Math.min(count - 1, index));
    audioSynth.playTimelapseStep();
    set({ playbackIndex: clamped });
  },

  setIsPlaying: (playing) => {
    audioSynth.playSelect();
    set({ isPlaying: playing });
  },

  setPlaybackSpeed: (speed) => {
    audioSynth.playSelect();
    set({ playbackSpeed: speed });
  },

  toggleAutoCapture: () => {
    audioSynth.playSelect();
    set((state) => ({ isAutoCaptureEnabled: !state.isAutoCaptureEnabled }));
  },
}));
