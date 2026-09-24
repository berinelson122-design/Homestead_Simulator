import { create } from 'zustand';
import { CommandNode, DeviceType } from '../types';

interface InputState {
  commands: Record<CommandNode, boolean>;
  deviceType: DeviceType;
  setDevice: (type: DeviceType) => void;
  setCommand: (cmd: CommandNode, active: boolean) => void;
  triggerCommand: (cmd: CommandNode) => void;
}

const defaultCommands: Record<CommandNode, boolean> = {
  UP: false,
  DOWN: false,
  LEFT: false,
  RIGHT: false,
  ACTION: false,
  BOMB: false,
  FOCUS: false,
  WEATHER_CYCLE: false,
  CAPTURE_SNAPSHOT: false,
  TIMELAPSE_TOGGLE: false,
};

export const useInputStore = create<InputState>((set) => ({
  commands: { ...defaultCommands },
  deviceType: 'PC',
  setDevice: (deviceType) => set({ deviceType }),
  setCommand: (cmd, active) =>
    set((state) => ({ commands: { ...state.commands, [cmd]: active } })),
  triggerCommand: (cmd) => {
    set((state) => ({ commands: { ...state.commands, [cmd]: true } }));
    setTimeout(() => {
      set((state) => ({ commands: { ...state.commands, [cmd]: false } }));
    }, 100);
  },
}));