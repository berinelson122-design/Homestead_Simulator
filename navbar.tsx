import React from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { Button } from '../common/Button';
import { Zap, Activity, Flame, RotateCcw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { metrics, runTest, clearGrid } = useHomesteadStore();

  return (
    <header className="w-full border-b border-[#E056FD]/30 bg-black p-3 z-50 flex flex-wrap items-center justify-between gap-4 font-mono">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 bg-[#FF003C] animate-pulse" />
        <h1 className="text-sm font-black tracking-widest text-[#E056FD] uppercase">
          HOMESTEAD 3D // SIMULATOR
        </h1>
      </div>

      {/* Top Level Metric Indicators */}
      <div className="flex items-center gap-4 text-xs">
        <div className="border border-[#FF003C] px-3 py-1 bg-black flex items-center gap-2">
          <Activity size={12} className="text-[#FF003C]" />
          <span className="text-gray-500">SUSTAINABILITY:</span>
          <span className={`font-bold ${metrics.sustainabilityScore >= 70 ? 'text-[#39FF14]' : 'text-[#FF003C]'}`}>
            {metrics.sustainabilityScore}%
          </span>
        </div>
        <div className="border border-[#00F3FF] px-3 py-1 bg-black flex items-center gap-2">
          <Zap size={12} className="text-[#00F3FF]" />
          <span className="text-gray-500">NET POWER:</span>
          <span className={`font-bold ${metrics.netPower >= 0 ? 'text-[#39FF14]' : 'text-[#FF003C]'}`}>
            {metrics.netPower > 0 ? `+${metrics.netPower}` : metrics.netPower} kWh/d
          </span>
        </div>
        <div className="border border-[#FFD700] px-3 py-1 bg-black flex items-center gap-2">
          <Flame size={12} className="text-[#FFD700]" />
          <span className="text-gray-500">FOOD YIELD:</span>
          <span className="text-[#FFD700] font-bold">{metrics.totalCalories} kcal/d</span>
        </div>
      </div>

      {/* Stress Scenario Triggers */}
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={clearGrid} className="flex items-center gap-1">
          <RotateCcw size={12} /> Clear
        </Button>
        <Button variant="danger" onClick={() => runTest('GRID-DOWN')}>
          14-Day Blackout Test
        </Button>
        <Button variant="primary" onClick={() => runTest('DROUGHT')}>
          30-Day Drought
        </Button>
      </div>
    </header>
  );
};