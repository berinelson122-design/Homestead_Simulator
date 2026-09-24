import { create } from 'zustand';
import { WeatherType } from '../types';
import { audioSynth } from '../services/AudioSynth';
import { useHomesteadStore } from './useHomesteadStore';
import { useTimelapseStore } from './useTimelapseStore';

export interface WeatherData {
  current: WeatherType;
  intensity: number;
  windSpeed: number;
  temperatureC: number;
  autoCycle: boolean;
  cycleIntervalSec: number;
  setWeather: (type: WeatherType) => void;
  cycleNextWeather: () => void;
  toggleAutoCycle: () => void;
  setIntensity: (intensity: number) => void;
}

const WEATHER_PRESETS: Record<WeatherType, { wind: number; temp: number; intensity: number }> = {
  CLEAR: { wind: 6, temp: 22, intensity: 0.0 },
  RAIN: { wind: 26, temp: 13, intensity: 0.8 },
  SNOW: { wind: 34, temp: -5, intensity: 0.9 },
  ACID_STORM: { wind: 48, temp: 31, intensity: 1.0 },
};

const WEATHER_ORDER: WeatherType[] = ['CLEAR', 'RAIN', 'SNOW', 'ACID_STORM'];

export const useWeatherStore = create<WeatherData>((set, get) => ({
  current: 'CLEAR',
  intensity: 0.0,
  windSpeed: 6,
  temperatureC: 22,
  autoCycle: false,
  cycleIntervalSec: 25,

  setWeather: (type: WeatherType) => {
    audioSynth.playWeatherChange(type);
    const preset = WEATHER_PRESETS[type];
    set({
      current: type,
      intensity: preset.intensity,
      windSpeed: preset.wind,
      temperatureC: preset.temp,
    });

    useHomesteadStore.getState().recomputeMetrics();

    setTimeout(() => {
      useTimelapseStore.getState().triggerManualCapture();
    }, 200);
  },

  cycleNextWeather: () => {
    const { current } = get();
    const nextIdx = (WEATHER_ORDER.indexOf(current) + 1) % WEATHER_ORDER.length;
    const nextType = WEATHER_ORDER[nextIdx];
    get().setWeather(nextType);
  },

  toggleAutoCycle: () => {
    audioSynth.playSelect();
    set((state) => ({ autoCycle: !state.autoCycle }));
  },

  setIntensity: (intensity: number) => {
    set({ intensity: Math.max(0, Math.min(1, intensity)) });
  },
}));
