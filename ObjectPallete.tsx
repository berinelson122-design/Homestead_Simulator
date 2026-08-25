import React from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { StructureType } from '../../types';
import { Sun, Battery, Home, CloudRain, Droplets, Sprout, Building, Beef, Flame, Sparkles } from 'lucide-react';

interface ToolItem {
  type: StructureType;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

const TOOLS: ToolItem[] = [
  { type: 'CABIN', label: 'Homestead Cabin', desc: '-8 kWh/d | 2 Residents', icon: <Home size={14} /> },
  { type: 'SOLAR-ARRAY', label: 'Solar Array', desc: '+15 kWh/d Gen', icon: <Sun size={14} /> },
  { type: 'BATTERY-BANK', label: 'Battery Bank', desc: '+15 kWh Storage', icon: <Battery size={14} /> },
  { type: 'RAIN-CISTERN', label: 'Rain Cistern', desc: '+500 Gal Capacity', icon: <CloudRain size={14} /> },
  { type: 'WELL-PUMP', label: 'Deep Well Pump', desc: '+150 Gal/d | -3 kWh', icon: <Droplets size={14} /> },
  { type: 'RAISED-BED', label: 'Raised Garden Bed', desc: '+800 kcal/d | -4 Gal', icon: <Sprout size={14} /> },
  { type: 'GREENHOUSE', label: 'Automated Greenhouse', desc: '+3500 kcal/d | -15 Gal', icon: <Building size={14} /> },
  { type: 'COW-PASTURE', label: 'Pastured Cattle', desc: '+5000 kcal/d | +Manure', icon: <Beef size={14} /> },
  { type: 'METHANE-DIGESTER', label: 'Methane Digester', desc: '+1.8m³ CH4 | Bio-Fert', icon: <Flame size={14} /> },
  { type: 'BIOCHAR-RETORT', label: 'Biochar Retort', desc: '+12 kg Biochar (+25% Crop)', icon: <Sparkles size={14} /> },
];

export const ObjectPalette: React.FC = () => {
  const { selectedTool, setSelectedTool } = useHomesteadStore();

  return (
    <aside className="w-72 border-r border-[#333] bg-[#0a0a0a] p-4 flex flex-col gap-3 font-mono">
      <div className="border-b border-[#333] pb-2">
        <h2 className="text-xs font-bold text-[#E056FD] uppercase tracking-widest">
          INFRASTRUCTURE PALETTE
        </h2>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
        {TOOLS.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setSelectedTool(tool.type)}
            className={`flex flex-col p-2.5 text-xs border text-left transition-all ${
              selectedTool === tool.type
                ? 'border-[#FF003C] bg-[#FF003C]/10 text-white font-bold shadow-[0_0_10px_rgba(255,0,60,0.3)]'
                : 'border-[#222] hover:border-[#E056FD] text-gray-400 bg-black'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={selectedTool === tool.type ? 'text-[#FF003C]' : 'text-[#E056FD]'}>
                {tool.icon}
              </span>
              <span className="truncate">{tool.label}</span>
            </div>
            <span className="text-[10px] text-gray-500">{tool.desc}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};