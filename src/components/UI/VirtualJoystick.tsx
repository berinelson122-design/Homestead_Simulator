/* NEW CODE ADDITIONS START: DEVICE CONTROLS */
import React from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { useWeatherStore } from '../../store/useWeatherStore';
import { useTimelapseStore } from '../../store/useTimelapseStore';
import { Button } from '../common/Button';
import { Sun, Battery, Sprout, Flame, CloudRain, Camera, Film } from 'lucide-react';

export const VirtualJoystick: React.FC = () => {
  const { setSelectedTool } = useHomesteadStore();
  const { cycleNextWeather } = useWeatherStore();
  const { triggerManualCapture, setViewerOpen, isViewerOpen } = useTimelapseStore();

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-wrap items-center gap-1.5 pointer-events-auto md:hidden font-mono select-none bg-black/80 p-2 border border-[#333] backdrop-blur-sm">
      <Button variant="secondary" onClick={() => setSelectedTool('SOLAR-ARRAY')} className="px-2 py-1.5">
        <Sun size={13} />
      </Button>
      <Button variant="secondary" onClick={() => setSelectedTool('BATTERY-BANK')} className="px-2 py-1.5">
        <Battery size={13} />
      </Button>
      <Button variant="secondary" onClick={() => setSelectedTool('RAISED-BED')} className="px-2 py-1.5">
        <Sprout size={13} />
      </Button>
      <Button variant="secondary" onClick={() => setSelectedTool('METHANE-DIGESTER')} className="px-2 py-1.5">
        <Flame size={13} />
      </Button>

      {/* Mobile Environmental & Evolution Controls */}
      <div className="h-5 w-[1px] bg-[#444] mx-1" />
      <button
        onClick={cycleNextWeather}
        className="p-1.5 border border-[#00F3FF] bg-[#00F3FF]/10 text-[#00F3FF] text-xs font-bold"
        title="Mobile Weather Cycle"
      >
        <CloudRain size={13} />
      </button>
      <button
        onClick={triggerManualCapture}
        className="p-1.5 border border-[#FF003C] bg-[#FF003C]/10 text-[#FF003C] text-xs font-bold"
        title="Mobile Snapshot"
      >
        <Camera size={13} />
      </button>
      <button
        onClick={() => setViewerOpen(!isViewerOpen)}
        className="p-1.5 border border-[#E056FD] bg-[#E056FD]/10 text-[#E056FD] text-xs font-bold"
        title="Mobile Timelapse Viewer"
      >
        <Film size={13} />
      </button>
    </div>
  );
};
/* NEW CODE ADDITIONS END: DEVICE CONTROLS */