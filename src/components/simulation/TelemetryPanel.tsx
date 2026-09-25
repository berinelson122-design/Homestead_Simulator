import React from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { useResourceLogStore } from '../../store/useResourceLogStore';
import { WeatherController } from './WeatherController';
import { SeasonController } from './SeasonController';
import { Zap, Droplets, Flame, X, Activity, BarChart3 } from 'lucide-react';

export const TelemetryPanel: React.FC = () => {
  const { metrics, mobilePanel, setMobilePanel } = useHomesteadStore();
  const { setLogPanelOpen } = useResourceLogStore();
  const isMobileOpen = mobilePanel === 'TELEMETRY';

  const telemetryContent = (
    <>
      {/* 60-MINUTE HISTORICAL LOG BUTTON TRIGGER */}
      <button
        onClick={() => setLogPanelOpen(true)}
        className="w-full py-2 px-3 border border-[#00F3FF] bg-[#00F3FF]/15 text-[#00F3FF] hover:bg-[#00F3FF] hover:text-black transition-all flex items-center justify-between font-bold text-xs shadow-[0_0_12px_rgba(0,243,255,0.2)]"
      >
        <div className="flex items-center gap-2">
          <BarChart3 size={14} />
          <span>RESOURCE CONSUMPTION LOG</span>
        </div>
        <span className="text-[9px] bg-black/80 px-1.5 py-0.5 text-white border border-[#00F3FF]/40">
          60-MIN
        </span>
      </button>

      {/* SEASONAL CYCLE ENGINE */}
      <SeasonController />

      {/* ATMOSPHERIC SIMULATOR DOCK */}
      <WeatherController />

      {/* OVERALL SUSTAINABILITY METRIC */}
      <div className="border border-[#FF003C] p-3 bg-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#FF003C]" />
          <span className="text-[10px] text-gray-400 font-bold uppercase">SUSTAINABILITY INDEX</span>
        </div>
        <span
          className={`text-sm font-black ${
            metrics.sustainabilityScore >= 70 ? 'text-[#39FF14]' : 'text-[#FF003C]'
          }`}
        >
          {metrics.sustainabilityScore}%
        </span>
      </div>

      {/* ELECTRICAL GRID */}
      <div className="border border-[#00F3FF]/40 p-3 bg-black flex flex-col gap-1">
        <span className="text-[10px] text-[#00F3FF] font-bold flex items-center gap-1">
          <Zap size={12} /> ELECTRICAL POWER BUS
        </span>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-500">Generation:</span>
          <span className="text-white">+{metrics.totalPowerGen} kWh/d</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Draw Load:</span>
          <span className="text-white">-{metrics.totalPowerDraw} kWh/d</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Storage Bank:</span>
          <span className="text-[#00F3FF] font-bold">{metrics.totalPowerStorage} kWh</span>
        </div>
      </div>

      {/* HYDROLOGICAL NETWORK */}
      <div className="border border-[#005588] p-3 bg-black flex flex-col gap-1">
        <span className="text-[10px] text-[#00F3FF] font-bold flex items-center gap-1">
          <Droplets size={12} /> HYDROLOGICAL MATRIX
        </span>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-500">Supply Rate:</span>
          <span className="text-white">+{metrics.totalWaterGen} Gal/d</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Demand Rate:</span>
          <span className="text-white">-{metrics.totalWaterDraw} Gal/d</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Cistern Reservoir:</span>
          <span className="text-[#00F3FF] font-bold">{metrics.totalWaterStorage} Gal</span>
        </div>
      </div>

      {/* BIO-ENERGY & NUTRIENT LOOPS */}
      <div className="border border-[#FF003C]/40 p-3 bg-black flex flex-col gap-1">
        <span className="text-[10px] text-[#FF003C] font-bold flex items-center gap-1">
          <Flame size={12} /> METHANE & NUTRIENTS
        </span>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-500">Biogas Synthesis:</span>
          <span className="text-[#FF003C] font-bold">{metrics.totalMethane} m³/d</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Liquid Digestate:</span>
          <span className="text-white">{metrics.totalFertilizer} L/d</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Biochar Yield:</span>
          <span className="text-[#39FF14]">{metrics.totalBiochar} kg/d</span>
        </div>
      </div>

      <div className="border border-[#333] p-3 bg-[#111] text-[10px] text-gray-400">
        <span className="text-white font-bold block mb-1">OPERATOR CONTROLS:</span>
        <p>• Tap / Left-Click: Place active structure.</p>
        <p>• Mode DEMOLISH / Right-Click: Remove voxel.</p>
        <p>• 1-Finger Drag / Orbit Mode: Rotate 3D view.</p>
        <p>• 2-Finger Pinch: Zoom in & out.</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 border-l border-[#333] bg-[#0a0a0a] p-4 flex-col gap-4 font-mono select-none overflow-y-auto scrollbar-thin">
        <div className="border-b border-[#333] pb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#E056FD] uppercase tracking-widest">
            REAL-TIME TELEMETRY
          </h2>
          <span className="w-2 h-2 bg-[#39FF14] animate-pulse" />
        </div>
        {telemetryContent}
      </aside>

      {/* Mobile Drawer Sheet */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex flex-col justify-end">
          <div className="bg-[#0c0c0c] border-t-2 border-[#00F3FF] max-h-[82vh] p-4 flex flex-col gap-3 font-mono shadow-[0_-10px_30px_rgba(0,243,255,0.2)]">
            <div className="flex items-center justify-between border-b border-[#333] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#00F3FF] animate-pulse" />
                <h2 className="text-xs font-bold text-[#00F3FF] uppercase tracking-wider">
                  TELEMETRY & ATMOSPHERICS
                </h2>
              </div>
              <button
                onClick={() => setMobilePanel('NONE')}
                className="p-1.5 border border-[#444] text-gray-400 hover:text-white hover:border-[#00F3FF]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[65vh] flex flex-col gap-3 pr-1 scrollbar-thin">
              {telemetryContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
