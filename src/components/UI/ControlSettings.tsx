/* NEW CODE ADDITIONS START: DEVICE CONTROLS */
import React from 'react';
import { useInputStore } from '../../store/useInputStore';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { useWeatherStore } from '../../store/useWeatherStore';
import { useTimelapseStore } from '../../store/useTimelapseStore';
import { useSeasonStore } from '../../store/useSeasonStore';
import { useResourceLogStore } from '../../store/useResourceLogStore';
import {
  Monitor,
  Smartphone,
  Gamepad2,
  CloudRain,
  Camera,
  Film,
  RotateCcw,
  Hand,
  MousePointer,
  FileCode2,
  Zap,
  HelpCircle,
  BarChart3,
  Compass,
} from 'lucide-react';

export const ControlSettings: React.FC = () => {
  const { deviceType, commands, setDevice } = useInputStore();
  const {
    interactionMode,
    setInteractionMode,
    resetCamera,
    isBlueprintMode,
    toggleBlueprintMode,
    isEnergyOverlayMode,
    toggleEnergyOverlayMode,
    setHelpModalOpen,
  } = useHomesteadStore();

  const { cycleNextWeather } = useWeatherStore();
  const { triggerManualCapture, setViewerOpen, isViewerOpen } = useTimelapseStore();
  const { nextSeason, currentSeason } = useSeasonStore();
  const { toggleLogPanel, isLogPanelOpen } = useResourceLogStore();

  return (
    <div className="p-3 bg-black border-2 border-[#E056FD] font-mono text-[10px] w-76 shadow-[0_0_20px_rgba(224,86,253,0.25)] select-none">
      {/* Header & Device Switcher */}
      <div className="flex items-center justify-between text-[#E056FD] mb-2 border-b border-[#E056FD]/30 pb-1.5">
        <div className="flex items-center gap-1.5">
          {deviceType === 'MOBILE' && <Smartphone size={13} />}
          {deviceType === 'PC' && <Monitor size={13} />}
          {deviceType === 'CONSOLE' && <Gamepad2 size={13} />}
          <span className="font-bold tracking-widest uppercase">INPUT BRIDGE</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setDevice('PC')}
            className={`px-1.5 py-0.5 border text-[8px] font-bold ${
              deviceType === 'PC' ? 'border-[#FF003C] text-[#FF003C] bg-[#FF003C]/15' : 'border-[#333] text-gray-500'
            }`}
          >
            PC
          </button>
          <button
            onClick={() => setDevice('MOBILE')}
            className={`px-1.5 py-0.5 border text-[8px] font-bold ${
              deviceType === 'MOBILE' ? 'border-[#FF003C] text-[#FF003C] bg-[#FF003C]/15' : 'border-[#333] text-gray-500'
            }`}
          >
            MOB
          </button>
        </div>
      </div>

      {/* Mode Status & Selector */}
      <div className="mb-2 bg-[#0a0a0a] p-1.5 border border-[#222] flex items-center justify-between">
        <span className="text-gray-500 text-[8px]">ACTIVE MODE:</span>
        <div className="flex items-center gap-1">
          {(['BUILD', 'DEMOLISH', 'ORBIT'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setInteractionMode(m)}
              className={`px-1.5 py-0.5 border text-[8px] font-bold ${
                interactionMode === m
                  ? 'border-[#00F3FF] text-[#00F3FF] bg-[#00F3FF]/15'
                  : 'border-[#222] text-gray-500'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Analytics & Visualization Tools */}
      <div className="grid grid-cols-4 gap-1 mb-2">
        <button
          onClick={toggleLogPanel}
          className={`flex flex-col items-center justify-center p-1 border text-[8px] font-bold transition-all ${
            isLogPanelOpen
              ? 'border-[#00F3FF] bg-[#00F3FF]/20 text-[#00F3FF]'
              : 'border-[#222] bg-[#0a0a0a] text-gray-400'
          }`}
          title="Toggle 60M Resource Consumption Log [L]"
        >
          <BarChart3 size={11} className="mb-0.5" />
          <span>[L] LOGS</span>
        </button>

        <button
          onClick={nextSeason}
          className="flex flex-col items-center justify-center p-1 border border-[#39FF14] bg-[#39FF14]/10 text-[#39FF14] text-[8px] font-bold"
          title={`Cycle Season (Current: ${currentSeason}) [S]`}
        >
          <Compass size={11} className="mb-0.5" />
          <span>[S] SEASON</span>
        </button>

        <button
          onClick={toggleBlueprintMode}
          className={`flex flex-col items-center justify-center p-1 border text-[8px] font-bold transition-all ${
            isBlueprintMode
              ? 'border-[#00F3FF] bg-[#00F3FF]/15 text-[#00F3FF]'
              : 'border-[#222] bg-[#0a0a0a] text-gray-400'
          }`}
          title="Toggle Blueprint Mode [B]"
        >
          <FileCode2 size={11} className="mb-0.5" />
          <span>[B] DRAFT</span>
        </button>

        <button
          onClick={toggleEnergyOverlayMode}
          className={`flex flex-col items-center justify-center p-1 border text-[8px] font-bold transition-all ${
            isEnergyOverlayMode
              ? 'border-[#39FF14] bg-[#39FF14]/15 text-[#39FF14]'
              : 'border-[#222] bg-[#0a0a0a] text-gray-400'
          }`}
          title="Toggle Energy Grid [E]"
        >
          <Zap size={11} className="mb-0.5" />
          <span>[E] GRID</span>
        </button>
      </div>

      {/* Touch & PC Gesture Reference */}
      <div className="mb-2 p-1.5 bg-[#080808] border border-[#222] text-[8px] text-gray-400 space-y-0.5">
        <div className="flex items-center gap-1 text-[#00F3FF] font-bold uppercase">
          {deviceType === 'MOBILE' ? <Hand size={9} /> : <MousePointer size={9} />}
          <span>{deviceType === 'MOBILE' ? 'TOUCHSCREEN GESTURES' : 'PC PERIPHERAL BINDINGS'}</span>
        </div>
        {deviceType === 'MOBILE' ? (
          <>
            <p>• 1-Finger Tap: Place / remove module</p>
            <p>• 1-Finger Drag: Orbit 3D camera</p>
            <p>• 2-Finger Pinch: Zoom in & out</p>
            <p>• Double Tap: Re-center camera angle</p>
          </>
        ) : (
          <>
            <p>• Left-Click: Build active module</p>
            <p>• Right-Click: Demolish structure</p>
            <p>• Mouse Drag: Orbit 3D perspective</p>
            <p>• Scroll Wheel: Smooth zoom</p>
          </>
        )}
      </div>

      {/* Quick Action Triggers */}
      <div className="grid grid-cols-4 gap-1 mb-2">
        <button
          onClick={cycleNextWeather}
          className="flex flex-col items-center justify-center p-1 border border-[#333] hover:border-[#00F3FF] bg-[#0a0a0a] text-gray-300 hover:text-white"
          title="Cycle Weather [C]"
        >
          <CloudRain size={10} className="text-[#00F3FF] mb-0.5" />
          <span className="text-[7px]">[C] WEATHER</span>
        </button>
        <button
          onClick={triggerManualCapture}
          className="flex flex-col items-center justify-center p-1 border border-[#333] hover:border-[#FF003C] bg-[#0a0a0a] text-gray-300 hover:text-white"
          title="Capture Snapshot [X]"
        >
          <Camera size={10} className="text-[#FF003C] mb-0.5" />
          <span className="text-[7px]">[X] SNAP</span>
        </button>
        <button
          onClick={() => setViewerOpen(!isViewerOpen)}
          className="flex flex-col items-center justify-center p-1 border border-[#333] hover:border-[#E056FD] bg-[#0a0a0a] text-gray-300 hover:text-white"
          title="Toggle Time-Lapse [T]"
        >
          <Film size={10} className="text-[#E056FD] mb-0.5" />
          <span className="text-[7px]">[T] TIMELAPSE</span>
        </button>
        <button
          onClick={() => setHelpModalOpen(true)}
          className="flex flex-col items-center justify-center p-1 border border-[#E056FD] bg-[#E056FD]/15 text-[#E056FD] text-[7px] font-bold"
          title="Open System Intel Manual [H]"
        >
          <HelpCircle size={10} className="mb-0.5" />
          <span>[H] GUIDE</span>
        </button>
      </div>

      {/* Real-time bus indicators */}
      <div className="space-y-0.5">
        {Object.entries(commands).slice(0, 8).map(([key, active]) => (
          <div key={key} className="flex justify-between items-center text-[7px]">
            <span className="text-gray-500 uppercase">{key}</span>
            <div
              className={`h-1 w-6 border transition-all ${
                active ? 'bg-[#FF003C] border-[#FF003C] shadow-[0_0_8px_#FF003C]' : 'border-gray-800 bg-black'
              }`}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 pt-1.5 border-t border-[#333] text-[8px] text-gray-500 flex justify-between items-center">
        <span>MODE: {deviceType}</span>
        <button
          onClick={resetCamera}
          className="text-[#E056FD] hover:underline flex items-center gap-0.5"
        >
          <RotateCcw size={8} />
          <span>RESET CAM</span>
        </button>
      </div>
    </div>
  );
};
/* NEW CODE ADDITIONS END: DEVICE CONTROLS */
