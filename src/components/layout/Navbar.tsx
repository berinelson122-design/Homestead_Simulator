import React from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { useWeatherStore } from '../../store/useWeatherStore';
import { useTimelapseStore } from '../../store/useTimelapseStore';
import { Button } from '../common/Button';
import { Zap, Activity, Flame, RotateCcw, CloudRain, Sun, Snowflake, Camera, Film } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { metrics, runTest, clearGrid } = useHomesteadStore();
  const { current: weather, cycleNextWeather } = useWeatherStore();
  const { snapshots, setViewerOpen, triggerManualCapture } = useTimelapseStore();

  const weatherIcons = {
    CLEAR: <Sun size={12} className="text-[#00F3FF]" />,
    RAIN: <CloudRain size={12} className="text-[#00A8FF]" />,
    SNOW: <Snowflake size={12} className="text-white" />,
    ACID_STORM: <Zap size={12} className="text-[#FF003C]" />,
  };

  return (
    <header className="w-full border-b border-[#E056FD]/30 bg-black p-3 z-50 flex flex-wrap items-center justify-between gap-3 font-mono">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 bg-[#FF003C] animate-pulse" />
        <h1 className="text-sm font-black tracking-widest text-[#E056FD] uppercase">
          HOMESTEAD 3D // SIMULATOR
        </h1>

        {/* Dynamic Weather Pill */}
        <button
          onClick={cycleNextWeather}
          title="Click to Cycle Weather State"
          className="ml-2 flex items-center gap-1.5 px-2.5 py-1 border border-[#333] hover:border-[#E056FD] bg-[#0a0a0a] text-[10px] cursor-pointer transition-all"
        >
          {weatherIcons[weather]}
          <span className="text-gray-400">WEATHER:</span>
          <span className="font-bold text-white tracking-wider">{weather}</span>
        </button>
      </div>

      {/* Top Level Metric Indicators */}
      <div className="flex items-center gap-3 text-xs">
        <div className="border border-[#FF003C] px-2.5 py-1 bg-black flex items-center gap-1.5">
          <Activity size={12} className="text-[#FF003C]" />
          <span className="text-gray-500 hidden sm:inline">SUSTAINABILITY:</span>
          <span className={`font-bold ${metrics.sustainabilityScore >= 70 ? 'text-[#39FF14]' : 'text-[#FF003C]'}`}>
            {metrics.sustainabilityScore}%
          </span>
        </div>
        <div className="border border-[#00F3FF] px-2.5 py-1 bg-black flex items-center gap-1.5">
          <Zap size={12} className="text-[#00F3FF]" />
          <span className="text-gray-500 hidden sm:inline">NET POWER:</span>
          <span className={`font-bold ${metrics.netPower >= 0 ? 'text-[#39FF14]' : 'text-[#FF003C]'}`}>
            {metrics.netPower > 0 ? `+${metrics.netPower}` : metrics.netPower} kWh
          </span>
        </div>
        <div className="border border-[#FFD700] px-2.5 py-1 bg-black flex items-center gap-1.5">
          <Flame size={12} className="text-[#FFD700]" />
          <span className="text-gray-500 hidden sm:inline">FOOD:</span>
          <span className="text-[#FFD700] font-bold">{metrics.totalCalories} kcal</span>
        </div>
      </div>

      {/* Controls & Tools */}
      <div className="flex items-center gap-2">
        <button
          onClick={triggerManualCapture}
          className="flex items-center gap-1 px-2.5 py-1.5 border border-[#333] hover:border-[#FF003C] bg-black text-[#FF003C] text-xs font-bold transition-all cursor-pointer"
          title="Capture Viewport Snapshot"
        >
          <Camera size={12} />
          <span className="hidden md:inline">SNAP</span>
        </button>
        <button
          onClick={() => setViewerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E056FD] bg-[#E056FD]/15 text-[#E056FD] hover:bg-[#E056FD] hover:text-black text-xs font-bold shadow-[0_0_12px_rgba(224,86,253,0.3)] transition-all cursor-pointer"
          title="Open Time-Lapse Evolution History"
        >
          <Film size={12} />
          <span>TIME-LAPSE ({snapshots.length})</span>
        </button>
        <Button variant="secondary" onClick={clearGrid} className="flex items-center gap-1">
          <RotateCcw size={12} /> Clear
        </Button>
        <Button variant="danger" onClick={() => runTest('GRID-DOWN')}>
          Blackout
        </Button>
      </div>
    </header>
  );
};