import React from 'react';
import { useSeasonStore, SEASONAL_CONFIGS } from '../../store/useSeasonStore';
import { Sprout, Sun, Leaf, Snowflake, Compass, Play, Pause } from 'lucide-react';

export const SeasonController: React.FC = () => {
  const {
    currentSeason,
    progress,
    autoCycle,
    setSeason,
    nextSeason,
    toggleAutoCycle,
  } = useSeasonStore();

  const config = SEASONAL_CONFIGS[currentSeason];

  const seasonIcons = {
    SPRING: <Sprout size={13} className="text-[#39FF14]" />,
    SUMMER: <Sun size={13} className="text-[#FFD700]" />,
    AUTUMN: <Leaf size={13} className="text-[#FF5500]" />,
    WINTER: <Snowflake size={13} className="text-[#00F3FF]" />,
  };

  return (
    <div className="border border-[#E056FD]/40 p-3 bg-black flex flex-col gap-2.5 font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222] pb-1.5">
        <div className="flex items-center gap-1.5">
          <Compass size={13} className="text-[#E056FD]" />
          <span className="text-[10px] font-bold text-[#E056FD] uppercase tracking-wider">
            SEASONAL CYCLE ENGINE
          </span>
        </div>
        <button
          onClick={toggleAutoCycle}
          className={`flex items-center gap-1 px-1.5 py-0.5 border text-[8px] font-bold transition-all ${
            autoCycle
              ? 'border-[#39FF14] text-[#39FF14] bg-[#39FF14]/10'
              : 'border-[#444] text-gray-500 bg-black'
          }`}
          title="Toggle Automatic Seasonal Cycle"
        >
          {autoCycle ? <Play size={8} /> : <Pause size={8} />}
          <span>{autoCycle ? 'AUTO: ON' : 'AUTO: PAUSED'}</span>
        </button>
      </div>

      {/* Active Season Display */}
      <div className="flex items-center justify-between bg-[#0a0a0a] p-2 border border-[#222]">
        <div className="flex items-center gap-2">
          {seasonIcons[currentSeason]}
          <div>
            <span className="text-xs font-black text-white tracking-wider block">
              {config.label}
            </span>
            <span className="text-[8px] text-gray-400">
              CYCLE: {Math.round(progress * 100)}% COMPLETED
            </span>
          </div>
        </div>

        <button
          onClick={nextSeason}
          className="px-2 py-1 border border-[#333] hover:border-[#E056FD] text-gray-300 hover:text-white text-[9px] font-bold"
          title="Advance to Next Season"
        >
          ADVANCE &gt;
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#111] h-1.5 border border-[#222] overflow-hidden">
        <div
          style={{ width: `${Math.round(progress * 100)}%` }}
          className="h-full bg-gradient-to-r from-[#00F3FF] via-[#39FF14] to-[#E056FD] transition-all duration-300"
        />
      </div>

      {/* Manual Quick Season Selectors */}
      <div className="grid grid-cols-4 gap-1 text-[9px] font-bold">
        {(['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSeason(s)}
            className={`py-1.5 border flex flex-col items-center justify-center gap-0.5 transition-all ${
              currentSeason === s
                ? 'border-[#E056FD] bg-[#E056FD]/20 text-white shadow-[0_0_8px_rgba(224,86,253,0.3)]'
                : 'border-[#222] bg-[#0a0a0a] text-gray-500 hover:border-[#444] hover:text-gray-300'
            }`}
          >
            {seasonIcons[s]}
            <span className="text-[7px]">{s}</span>
          </button>
        ))}
      </div>

      {/* Seasonal Thermal & Bio-Energetic Readout */}
      <div className="text-[8px] text-gray-400 space-y-0.5 border-t border-[#1a1a1a] pt-1.5">
        <div className="flex justify-between">
          <span>TEMPERATURE DELTA:</span>
          <span className={`font-bold ${config.temperatureModifier >= 0 ? 'text-[#FFD700]' : 'text-[#00F3FF]'}`}>
            {config.temperatureModifier > 0 ? `+${config.temperatureModifier}` : config.temperatureModifier}°C
          </span>
        </div>
        <div className="flex justify-between">
          <span>SOLAR POWER FACTOR:</span>
          <span className={`font-bold ${config.solarEfficiencyMultiplier >= 1.0 ? 'text-[#39FF14]' : 'text-[#FF003C]'}`}>
            {Math.round(config.solarEfficiencyMultiplier * 100)}% EFFICIENCY
          </span>
        </div>
        <div className="flex justify-between">
          <span>CROP GROWTH SPEED:</span>
          <span className={`font-bold ${config.cropYieldMultiplier >= 1.0 ? 'text-[#39FF14]' : 'text-[#FFD700]'}`}>
            {Math.round(config.cropYieldMultiplier * 100)}% BASE RATE
          </span>
        </div>
      </div>
    </div>
  );
};
