import { useEffect } from 'react';
import { useInputStore } from '../store/useInputStore';
import { useWeatherStore } from '../store/useWeatherStore';
import { useTimelapseStore } from '../store/useTimelapseStore';
import { CommandNode } from '../types';

export const useUniversalInput = () => {
  const { setCommand, setDevice } = useInputStore();

  useEffect(() => {
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
      };
      const cmd = keyMap[e.code];
      if (cmd) setCommand(cmd, false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setCommand, setDevice]);
};