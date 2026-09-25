import React from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { useWeatherStore } from '../../store/useWeatherStore';
import { useTimelapseStore } from '../../store/useTimelapseStore';
import { useSeasonStore } from '../../store/useSeasonStore';
import { useResourceLogStore } from '../../store/useResourceLogStore';
import { Button } from '../common/Button';
import {
  Zap,
  Activity,
  Flame,
  RotateCcw,
  CloudRain,
  Sun,
  Snowflake,
  Camera,
  Film,
  Boxes,
  Sliders,
  AlertTriangle,
  FileCode2,
  HelpCircle,
  BarChart3,
  Sprout,
  Leaf,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    metrics,
    runTest,
    clearGrid,
    toggleMobilePanel,
    mobilePanel,
    isBlueprintMode,
    toggleBlueprintMode,
    isEnergyOverlayMode,
    toggleEnergyOverlayMode,
    setHelpModalOpen,
  } = useHomesteadStore();

  const { current: weather, cycleNextWeather } = useWeatherStore();
  const { snapshots, setViewerOpen, triggerManualCapture } = useTimelapseStore();
  const { currentSeason, nextSeason } = useSeasonStore();
  const { setLogPanelOpen } = useResourceLogStore();

  const weatherIcons = {
    CLEAR: <Sun size={12} className="text-[#00F3FF]" />,
    RAIN: <CloudRain size={12} className="text-[#00A8FF]" />,
    SNOW: <Snowflake size={12} className="text-white" />,
    ACID_STORM: <Zap size={12} className="text-[#FF003C]" />,
  };

  const seasonIcons = {
    SPRING: <Sprout size={12} className="text-[#39FF14]" />,
    SUMMER: <Sun size={12} className="text-[#FFD700]" />,
    AUTUMN: <Leaf size={12} className="text-[#FF5500]" />,
    WINTER: <Snowflake size={12} className="text-[#00F3FF]" />,
  };

  return (
    <header className="w-full border-b border-[#E056FD]/30 bg-black px-2 sm:px-4 py-2 z-50 flex flex-wrap items-center justify-between gap-2 font-mono select-none">
      {/* Brand & Atmospheric / Seasonal Cycles */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="w-2.5 h-2.5 bg-[#FF003C] animate-pulse" />
        <h1 className="text-xs sm:text-sm font-black tracking-wider sm:tracking-widest text-[#E056FD] uppercase">
          HOMESTEAD <span className="hidden sm:inline">3D // SIMULATOR</span>
        </h1>

        {/* Dynamic Weather Pill */}
        <button
          onClick={cycleNextWeather}
          title="Click to Cycle Weather State [C]"
          className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:py-1 border border-[#333] hover:border-[#E056FD] bg-[#0a0a0a] text-[9px] sm:text-[10px] cursor-pointer transition-all"
        >
          {weatherIcons[weather]}
          <span className="text-gray-400 hidden md:inline">WEATHER:</span>
          <span className="font-bold text-white tracking-wider">{weather}</span>
        </button>

        {/* Seasonal Cycle Pill */}
        <button
          onClick={nextSeason}
          title="Click to Cycle Season (Spring/Summer/Autumn/Winter)"
          className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:py-1 border border-[#333] hover:border-[#39FF14] bg-[#0a0a0a] text-[9px] sm:text-[10px] cursor-pointer transition-all"
        >
          {seasonIcons[currentSeason]}
          <span className="text-gray-400 hidden md:inline">SEASON:</span>
          <span className="font-bold text-white tracking-wider">{currentSeason}</span>
        </button>
      </div>

      {/* Metric Indicators */}
      <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs">
        <div className="border border-[#FF003C] px-2 py-0.5 sm:py-1 bg-black flex items-center gap-1">
          <Activity size={11} className="text-[#FF003C]" />
          <span className="text-gray-500 hidden md:inline">SUSTAINABILITY:</span>
          <span className={`font-bold ${metrics.sustainabilityScore >= 70 ? 'text-[#39FF14]' : 'text-[#FF003C]'}`}>
            {metrics.sustainabilityScore}%
          </span>
        </div>
        <div className="border border-[#00F3FF] px-2 py-0.5 sm:py-1 bg-black flex items-center gap-1">
          <Zap size={11} className="text-[#00F3FF]" />
          <span className="text-gray-500 hidden md:inline">POWER:</span>
          <span className={`font-bold ${metrics.netPower >= 0 ? 'text-[#39FF14]' : 'text-[#FF003C]'}`}>
            {metrics.netPower > 0 ? `+${metrics.netPower}` : metrics.netPower}
            <span className="hidden sm:inline"> kWh</span>
          </span>
        </div>
        <div className="border border-[#FFD700] px-2 py-0.5 sm:py-1 bg-black flex items-center gap-1">
          <Flame size={11} className="text-[#FFD700]" />
          <span className="text-gray-500 hidden md:inline">FOOD:</span>
          <span className="text-[#FFD700] font-bold">
            {metrics.totalCalories}
            <span className="hidden sm:inline"> kcal</span>
          </span>
        </div>
      </div>

      {/* Visualization & Action Triggers */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* 60-Minute Resource Log Button */}
        <button
          onClick={() => setLogPanelOpen(true)}
          className="flex items-center gap-1 px-2 py-1 border border-[#00F3FF] bg-[#00F3FF]/15 text-[#00F3FF] hover:bg-[#00F3FF] hover:text-black text-[10px] font-bold transition-all shadow-[0_0_8px_rgba(0,243,255,0.25)]"
          title="Open 60-Minute Resource Consumption Log [L]"
        >
          <BarChart3 size={12} />
          <span className="hidden sm:inline">60M LOG</span>
        </button>

        {/* Wireframe Blueprint Toggle */}
        <button
          onClick={toggleBlueprintMode}
          className={`flex items-center gap-1 px-2 py-1 border text-[10px] font-bold transition-all ${
            isBlueprintMode
              ? 'border-[#00F3FF] bg-[#00F3FF]/20 text-[#00F3FF] shadow-[0_0_10px_rgba(0,243,255,0.3)]'
              : 'border-[#333] bg-[#0a0a0a] text-gray-400 hover:border-[#00F3FF] hover:text-white'
          }`}
          title="Toggle Wireframe Blueprint Mode [B]"
        >
          <FileCode2 size={12} />
          <span className="hidden md:inline">BLUEPRINT</span>
        </button>

        {/* Energy Grid Overlay Toggle */}
        <button
          onClick={toggleEnergyOverlayMode}
          className={`flex items-center gap-1 px-2 py-1 border text-[10px] font-bold transition-all ${
            isEnergyOverlayMode
              ? 'border-[#39FF14] bg-[#39FF14]/20 text-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)]'
              : 'border-[#333] bg-[#0a0a0a] text-gray-400 hover:border-[#39FF14] hover:text-white'
          }`}
          title="Toggle Energy Grid Overlay [E]"
        >
          <Zap size={12} />
          <span className="hidden md:inline">GRID</span>
        </button>

        {/* Help / Intel Guide Modal Trigger */}
        <button
          onClick={() => setHelpModalOpen(true)}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 border border-[#E056FD] bg-[#E056FD]/15 text-[#E056FD] hover:bg-[#E056FD] hover:text-black text-[10px] font-bold transition-all shadow-[0_0_8px_rgba(224,86,253,0.3)]"
          title="Open System Intel Manual & Guide [H]"
        >
          <HelpCircle size={12} />
          <span>GUIDE</span>
        </button>

        {/* Mobile Quick Drawer Toggles */}
        <button
          onClick={() => toggleMobilePanel('PALETTE')}
          className={`lg:hidden flex items-center gap-1 px-2 py-1 border text-[10px] font-bold transition-all ${
            mobilePanel === 'PALETTE'
              ? 'border-[#FF003C] bg-[#FF003C] text-black'
              : 'border-[#333] bg-[#111] text-[#E056FD]'
          }`}
          title="Toggle Mobile Build Palette"
        >
          <Boxes size={12} />
          <span className="hidden xs:inline">MODULES</span>
        </button>

        <button
          onClick={() => toggleMobilePanel('TELEMETRY')}
          className={`lg:hidden flex items-center gap-1 px-2 py-1 border text-[10px] font-bold transition-all ${
            mobilePanel === 'TELEMETRY'
              ? 'border-[#00F3FF] bg-[#00F3FF] text-black'
              : 'border-[#333] bg-[#111] text-[#00F3FF]'
          }`}
          title="Toggle Mobile Telemetry"
        >
          <Sliders size={12} />
          <span className="hidden xs:inline">STATS</span>
        </button>

        {/* Snapshot trigger */}
        <button
          onClick={triggerManualCapture}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 border border-[#333] hover:border-[#FF003C] bg-black text-[#FF003C] text-[10px] sm:text-xs font-bold transition-all cursor-pointer"
          title="Capture Viewport Snapshot [X]"
        >
          <Camera size={12} />
          <span className="hidden md:inline">SNAP</span>
        </button>

        {/* Timelapse trigger */}
        <button
          onClick={() => setViewerOpen(true)}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 border border-[#E056FD] bg-[#E056FD]/15 text-[#E056FD] hover:bg-[#E056FD] hover:text-black text-[10px] sm:text-xs font-bold shadow-[0_0_12px_rgba(224,86,253,0.3)] transition-all cursor-pointer"
          title="Open Time-Lapse Evolution History [T]"
        >
          <Film size={12} />
          <span>
            <span className="hidden md:inline">TIME-LAPSE </span>({snapshots.length})
          </span>
        </button>

        {/* Desktop Scenario & Reset buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="secondary" onClick={clearGrid} className="flex items-center gap-1 py-1 text-xs">
            <RotateCcw size={12} /> Clear
          </Button>
          <Button variant="danger" onClick={() => runTest('GRID-DOWN')} className="py-1 text-xs">
            Blackout
          </Button>
        </div>

        {/* Mobile scenario quick trigger */}
        <button
          onClick={() => runTest('GRID-DOWN')}
          className="lg:hidden p-1.5 border border-[#FF003C] text-[#FF003C] hover:bg-[#FF003C]/10"
          title="Run Blackout Test"
        >
          <AlertTriangle size={12} />
        </button>
      </div>
    </header>
  );
};
