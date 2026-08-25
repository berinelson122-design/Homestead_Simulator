import { useEffect } from 'react';
import { useInputStore } from '../store/useInputStore';
import { CommandNode } from '../types';

export const useUniversalInput = () => {
  const { setCommand, setDevice } = useInputStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      };

      const cmd = keyMap[e.code];
      if (cmd) setCommand(cmd, true);
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