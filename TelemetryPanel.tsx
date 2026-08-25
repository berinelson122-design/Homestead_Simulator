import React from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { Zap, Droplets, Flame, Sparkles } from 'lucide-react';

export const TelemetryPanel: React.FC = () => {
  const { metrics } = useHomesteadStore();

  return (
    <aside className="w-80 border-l border-[#333] bg-[#0a0a0a] p-4 flex flex-col gap-4 font-mono select-none overflow-y-auto">
      <div className="border-b border-[#333] pb-2">
        <h2 className="text-xs font-bold text-[#E056FD] uppercase tracking-widest">
          REAL-TIME TELEMETRY
        </h2>
      </div>

      {/* ELECTRICAL GRID */}
      <div className="border border-[#00F3FF]/40 p-3 bg-black flex flex-col gap-1">
        <span className="text-[10px] text-[#00F3FF] font-bold flex items-center gap-1">
          <Zap size={12} /> ELECTRICAL POWER BUS
        </span>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-500">Generation:</span>
          <span className="text-white">{metrics.totalPowerGen} kWh/d</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Draw Load:</span>
          <span className="text-white">{metrics.totalPowerDraw} kWh/d</span>
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
          <span className="text-white">{metrics.totalWaterGen} Gal/d</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Demand Rate:</span>
          <span className="text-white">{metrics.totalWaterDraw} Gal/d</span>
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
        <p>• Left-Click: Place active structure.</p>
        <p>• Right-Click: Remove targeted voxel.</p>
      </div>
    </aside>
  );
};