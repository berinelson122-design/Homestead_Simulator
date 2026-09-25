import { useEffect } from 'react';
import { useInputStore } from '../store/useInputStore';
import { useHomesteadStore } from '../store/useHomesteadStore';
import { useWeatherStore } from '../store/useWeatherStore';
import { useTimelapseStore } from '../store/useTimelapseStore';
import { useSeasonStore } from '../store/useSeasonStore';
import { useResourceLogStore } from '../store/useResourceLogStore';
import { CommandNode } from '../types';

export const useUniversalInput = () => {
  const { setCommand, setDevice } = useInputStore();

  useEffect(() => {
    // Initial touchscreen / mobile auto-detection
    const checkDevice = () => {
      const isTouch =
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 1024;

      if (isTouch) {
        setDevice('MOBILE');
      } else {
        setDevice('PC');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside input elements
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      setDevice('PC');
      const keyMap: Record<string, CommandNode> = {
        ArrowUp: 'UP',
        KeyW: 'UP',
        ArrowDown: 'DOWN',
        KeyS: 'DOWN',
        ArrowLeft: 'LEFT',
        KeyA: 'LEFT',
        ArrowRight: 'RIGHT',
        KeyD: 'RIGHT',
        Space: 'ACTION',
        KeyC: 'WEATHER_CYCLE',
        KeyX: 'CAPTURE_SNAPSHOT',
        KeyT: 'TIMELAPSE_TOGGLE',
        KeyB: 'BLUEPRINT_TOGGLE',
        KeyE: 'ENERGY_OVERLAY_TOGGLE',
        KeyH: 'HELP_TOGGLE',
        KeyL: 'LOG_TOGGLE',
      };

      const cmd = keyMap[e.code];
      if (cmd) {
        setCommand(cmd, true);

        // Immediate functional actions
        if (cmd === 'WEATHER_CYCLE') {
          useWeatherStore.getState().cycleNextWeather();
        } else if (cmd === 'CAPTURE_SNAPSHOT') {
          useTimelapseStore.getState().triggerManualCapture();
        } else if (cmd === 'TIMELAPSE_TOGGLE') {
          const isOpen = useTimelapseStore.getState().isViewerOpen;
          useTimelapseStore.getState().setViewerOpen(!isOpen);
        } else if (cmd === 'BLUEPRINT_TOGGLE') {
          useHomesteadStore.getState().toggleBlueprintMode();
        } else if (cmd === 'ENERGY_OVERLAY_TOGGLE') {
          useHomesteadStore.getState().toggleEnergyOverlayMode();
        } else if (cmd === 'HELP_TOGGLE') {
          useHomesteadStore.getState().toggleHelpModal();
        } else if (cmd === 'LOG_TOGGLE') {
          useResourceLogStore.getState().toggleLogPanel();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyMap: Record<string, CommandNode> = {
        ArrowUp: 'UP',
        KeyW: 'UP',
        ArrowDown: 'DOWN',
        KeyS: 'DOWN',
        ArrowLeft: 'LEFT',
        KeyA: 'LEFT',
        ArrowRight: 'RIGHT',
        KeyD: 'RIGHT',
        Space: 'ACTION',
        KeyC: 'WEATHER_CYCLE',
        KeyX: 'CAPTURE_SNAPSHOT',
        KeyT: 'TIMELAPSE_TOGGLE',
        KeyB: 'BLUEPRINT_TOGGLE',
        KeyE: 'ENERGY_OVERLAY_TOGGLE',
        KeyH: 'HELP_TOGGLE',
        KeyL: 'LOG_TOGGLE',
      };
      const cmd = keyMap[e.code];
      if (cmd) setCommand(cmd, false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setCommand, setDevice]);
};
