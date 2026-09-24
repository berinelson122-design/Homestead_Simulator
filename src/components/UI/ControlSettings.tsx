/* NEW CODE ADDITIONS START: DEVICE CONTROLS */
import React from 'react';
import { useInputStore } from '../../store/useInputStore';
import { useWeatherStore } from '../../store/useWeatherStore';
import { useTimelapseStore } from '../../store/useTimelapseStore';
import { Monitor, Smartphone, Gamepad2, CloudRain, Camera, Film } from 'lucide-react';

export const ControlSettings: React.FC = () => {
  const { deviceType, commands, setDevice } = useInputStore();
  const { cycleNextWeather } = useWeatherStore();
  const { triggerManualCapture, setViewerOpen, isViewerOpen } = useTimelapseStore();

  return (
    <div className="p-3.5 bg-black border-2 border-[#E056FD] font-mono text-[10px] w-64 shadow-[0_0_20px_rgba(224,86,253,0.25)] select-none">
      <div className="flex items-center justify-between text-[#E056FD] mb-2.5 border-b border-[#E056FD]/30 pb-2">
        <div className="flex items-center gap-2">
          {deviceType === 'MOBILE' && <Smartphone size={14} />}
          {deviceType === 'PC' && <Monitor size={14} />}
          {deviceType === 'CONSOLE' && <Gamepad2 size={14} />}
          <span className="font-bold tracking-widest uppercase">INPUT BRIDGE</span>
        </div>
        {/* Device Switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDevice('PC')}
            className={`px-1.5 py-0.5 border text-[8px] ${
              deviceType === 'PC' ? 'border-[#FF003C] text-[#FF003C] bg-[#FF003C]/10' : 'border-[#333] text-gray-500'
            }`}
          >
            PC
          </button>
          <button
            onClick={() => setDevice('MOBILE')}
            className={`px-1.5 py-0.5 border text-[8px] ${
              deviceType === 'MOBILE' ? 'border-[#FF003C] text-[#FF003C] bg-[#FF003C]/10' : 'border-[#333] text-gray-500'
            }`}
          >
            MOB
          </button>
        </div>
      </div>

      {/* Quick PC / Automation Triggers */}
      <div className="grid grid-cols-3 gap-1 mb-2.5">
        <button
          onClick={cycleNextWeather}
          className="flex flex-col items-center justify-center p-1.5 border border-[#333] hover:border-[#00F3FF] bg-[#0a0a0a] text-gray-300 hover:text-white"
          title="Cycle Weather [C]"
        >
          <CloudRain size={11} className="text-[#00F3FF] mb-0.5" />
          <span className="text-[8px]">[C] WEATHER</span>
        </button>
        <button
          onClick={triggerManualCapture}
          className="flex flex-col items-center justify-center p-1.5 border border-[#333] hover:border-[#FF003C] bg-[#0a0a0a] text-gray-300 hover:text-white"
          title="Capture Snapshot [X]"
        >
          <Camera size={11} className="text-[#FF003C] mb-0.5" />
          <span className="text-[8px]">[X] SNAP</span>
        </button>
        <button
          onClick={() => setViewerOpen(!isViewerOpen)}
          className="flex flex-col items-center justify-center p-1.5 border border-[#333] hover:border-[#E056FD] bg-[#0a0a0a] text-gray-300 hover:text-white"
          title="Toggle Time-Lapse [T]"
        >
          <Film size={11} className="text-[#E056FD] mb-0.5" />
          <span className="text-[8px]">[T] TIMELAPSE</span>
        </button>
      </div>

      {/* Real-time bus indicators */}
      <div className="space-y-1">
        {Object.entries(commands).map(([key, active]) => (
          <div key={key} className="flex justify-between items-center text-[9px]">
            <span className="text-gray-500 uppercase">{key}</span>
            <div
              className={`h-1.5 w-8 border transition-all ${
                active ? 'bg-[#FF003C] border-[#FF003C] shadow-[0_0_8px_#FF003C]' : 'border-gray-800 bg-black'
              }`}
            />
          </div>
        ))}
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#333] text-[8px] text-gray-500 flex justify-between">
        <span>MODE: {deviceType}</span>
        <span>LATENCY: 0.1MS</span>
      </div>
    </div>
  );
};
/* NEW CODE ADDITIONS END: DEVICE CONTROLS */