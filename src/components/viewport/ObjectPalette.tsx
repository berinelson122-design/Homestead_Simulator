import React, { useState } from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { StructureType } from '../../types';
import { STRUCTURE_SPECS } from '../../utils/simulationEngine';
import { Sun, Battery, Home, CloudRain, Droplets, Sprout, Building, Beef, Flame, Sparkles, X, Check } from 'lucide-react';

interface ToolItem {
  type: StructureType;
  label: string;
  desc: string;
  category: 'POWER' | 'WATER' | 'FOOD' | 'HABITAT';
  icon: React.ReactNode;
}

const TOOLS: ToolItem[] = [
  { type: 'CABIN', label: 'Homestead Cabin', desc: '-8 kWh/d | 2 Residents', category: 'HABITAT', icon: <Home size={14} /> },
  { type: 'SOLAR-ARRAY', label: 'Solar Array', desc: '+15 kWh/d Gen', category: 'POWER', icon: <Sun size={14} /> },
  { type: 'BATTERY-BANK', label: 'Battery Bank', desc: '+15 kWh Storage', category: 'POWER', icon: <Battery size={14} /> },
  { type: 'RAIN-CISTERN', label: 'Rain Cistern', desc: '+500 Gal Capacity', category: 'WATER', icon: <CloudRain size={14} /> },
  { type: 'WELL-PUMP', label: 'Deep Well Pump', desc: '+150 Gal/d | -3 kWh', category: 'WATER', icon: <Droplets size={14} /> },
  { type: 'RAISED-BED', label: 'Raised Garden Bed', desc: '+800 kcal/d | -4 Gal', category: 'FOOD', icon: <Sprout size={14} /> },
  { type: 'GREENHOUSE', label: 'Automated Greenhouse', desc: '+3500 kcal/d | -15 Gal', category: 'FOOD', icon: <Building size={14} /> },
  { type: 'COW-PASTURE', label: 'Pastured Cattle', desc: '+5000 kcal/d | +Manure', category: 'FOOD', icon: <Beef size={14} /> },
  { type: 'METHANE-DIGESTER', label: 'Methane Digester', desc: '+1.8m³ CH4 | Bio-Fert', category: 'POWER', icon: <Flame size={14} /> },
  { type: 'BIOCHAR-RETORT', label: 'Biochar Retort', desc: '+12 kg Biochar (+25% Crop)', category: 'FOOD', icon: <Sparkles size={14} /> },
];

export const ObjectPalette: React.FC = () => {
  const { selectedTool, setSelectedTool, mobilePanel, setMobilePanel } = useHomesteadStore();
  const [hoveredTool, setHoveredTool] = useState<StructureType | null>(null);
  const [tooltipY, setTooltipY] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'POWER' | 'WATER' | 'FOOD' | 'HABITAT'>('ALL');

  const filteredTools = activeCategory === 'ALL' ? TOOLS : TOOLS.filter((t) => t.category === activeCategory);

  const isMobileOpen = mobilePanel === 'PALETTE';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-[#333] bg-[#0a0a0a] p-4 flex-col gap-3 font-mono relative select-none">
        <div className="border-b border-[#333] pb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#E056FD] uppercase tracking-widest">
            INFRASTRUCTURE PALETTE
          </h2>
          <span className="text-[9px] text-[#39FF14] font-bold">10 MODULES</span>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-140px)] pr-1 scrollbar-thin">
          {filteredTools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => setSelectedTool(tool.type)}
              onMouseEnter={(e) => {
                setHoveredTool(tool.type);
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipY(rect.top);
              }}
              onMouseLeave={() => setHoveredTool(null)}
              className={`flex flex-col p-2.5 text-xs border text-left transition-all relative cursor-pointer ${
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

        {/* Desktop Cyberpunk Floating Spec Tooltip */}
        {hoveredTool && STRUCTURE_SPECS[hoveredTool] && (
          <div
            style={{ top: `${tooltipY}px` }}
            className="fixed left-[294px] w-64 bg-black border border-[#FF003C] p-3.5 shadow-[0_0_20px_rgba(255,0,60,0.25)] z-[100] font-mono text-[10px] pointer-events-none transition-all duration-75 flex flex-col gap-2.5"
          >
            <div className="border-b border-[#FF003C]/30 pb-1.5 flex items-center justify-between">
              <span className="font-bold text-[#E056FD] uppercase tracking-wider">
                {hoveredTool.replace('-', ' ')} // SPEC
              </span>
              <span className="text-gray-500 text-[8px]">Y-REF: {Math.round(tooltipY)}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-white">
                <span className="text-gray-500">CAPITAL COST:</span>
                <span className="font-bold text-[#39FF14]">{STRUCTURE_SPECS[hoveredTool].cost.toLocaleString()} CR</span>
              </div>

              {(STRUCTURE_SPECS[hoveredTool].powerGen > 0 ||
                STRUCTURE_SPECS[hoveredTool].powerDraw > 0 ||
                STRUCTURE_SPECS[hoveredTool].powerStorage > 0) && (
                <div className="border-t border-[#1a1a1a] pt-1.5 flex flex-col gap-0.5">
                  <span className="text-[#00F3FF] font-bold text-[8px] tracking-widest uppercase">⚡ POWER BUS</span>
                  {STRUCTURE_SPECS[hoveredTool].powerGen > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span>GENERATION:</span>
                      <span className="text-[#39FF14]">+{STRUCTURE_SPECS[hoveredTool].powerGen} kWh/d</span>
                    </div>
                  )}
                  {STRUCTURE_SPECS[hoveredTool].powerDraw > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span>DRAW LOAD:</span>
                      <span className="text-[#FF003C]">-{STRUCTURE_SPECS[hoveredTool].powerDraw} kWh/d</span>
                    </div>
                  )}
                  {STRUCTURE_SPECS[hoveredTool].powerStorage > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span>CAPACITY:</span>
                      <span className="text-[#E056FD]">+{STRUCTURE_SPECS[hoveredTool].powerStorage} kWh</span>
                    </div>
                  )}
                </div>
              )}

              {(STRUCTURE_SPECS[hoveredTool].waterGen > 0 ||
                STRUCTURE_SPECS[hoveredTool].waterDraw > 0 ||
                STRUCTURE_SPECS[hoveredTool].waterStorage > 0) && (
                <div className="border-t border-[#1a1a1a] pt-1.5 flex flex-col gap-0.5">
                  <span className="text-[#00F3FF] font-bold text-[8px] tracking-widest uppercase">💧 HYDRO NETWORK</span>
                  {STRUCTURE_SPECS[hoveredTool].waterGen > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span>SUPPLY RATE:</span>
                      <span className="text-[#00F3FF]">+{STRUCTURE_SPECS[hoveredTool].waterGen} Gal/d</span>
                    </div>
                  )}
                  {STRUCTURE_SPECS[hoveredTool].waterDraw > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span>CONSUMPTION:</span>
                      <span className="text-[#FFD700]">-{STRUCTURE_SPECS[hoveredTool].waterDraw} Gal/d</span>
                    </div>
                  )}
                  {STRUCTURE_SPECS[hoveredTool].waterStorage > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span>RESERVOIR:</span>
                      <span className="text-[#00F3FF]">+{STRUCTURE_SPECS[hoveredTool].waterStorage} Gal</span>
                    </div>
                  )}
                </div>
              )}

              {(STRUCTURE_SPECS[hoveredTool].calories > 0 ||
                STRUCTURE_SPECS[hoveredTool].methane > 0 ||
                STRUCTURE_SPECS[hoveredTool].fertilizer > 0 ||
                STRUCTURE_SPECS[hoveredTool].biochar > 0) && (
                <div className="border-t border-[#1a1a1a] pt-1.5 flex flex-col gap-0.5">
                  <span className="text-[#E056FD] font-bold text-[8px] tracking-widest uppercase">🌱 MASS YIELD</span>
                  {STRUCTURE_SPECS[hoveredTool].calories > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span>NUTRITION:</span>
                      <span className="text-[#FFD700]">+{STRUCTURE_SPECS[hoveredTool].calories} kcal/d</span>
                    </div>
                  )}
                  {STRUCTURE_SPECS[hoveredTool].methane > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span>BIOGAS (CH4):</span>
                      <span className="text-[#FF003C]">+{STRUCTURE_SPECS[hoveredTool].methane} m³/d</span>
                    </div>
                  )}
                  {STRUCTURE_SPECS[hoveredTool].fertilizer > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span>DIGESTATE:</span>
                      <span className="text-[#39FF14]">+{STRUCTURE_SPECS[hoveredTool].fertilizer} L/d</span>
                    </div>
                  )}
                  {STRUCTURE_SPECS[hoveredTool].biochar > 0 && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span>CARBON FIXED:</span>
                      <span className="text-white">+{STRUCTURE_SPECS[hoveredTool].biochar} kg/d</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Touch Drawer Sheet */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex flex-col justify-end">
          <div className="bg-[#0c0c0c] border-t-2 border-[#E056FD] max-h-[82vh] p-4 flex flex-col gap-3 font-mono shadow-[0_-10px_30px_rgba(224,86,253,0.2)]">
            <div className="flex items-center justify-between border-b border-[#333] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#FF003C] animate-pulse" />
                <h2 className="text-xs font-bold text-[#E056FD] uppercase tracking-wider">
                  MOBILE MODULE PALETTE
                </h2>
              </div>
              <button
                onClick={() => setMobilePanel('NONE')}
                className="p-1.5 border border-[#444] text-gray-400 hover:text-white hover:border-[#FF003C]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Category Filter Pills for touch ergonomics */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[9px] scrollbar-none">
              {(['ALL', 'POWER', 'WATER', 'FOOD', 'HABITAT'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 border whitespace-nowrap font-bold transition-all ${
                    activeCategory === cat
                      ? 'border-[#FF003C] bg-[#FF003C]/15 text-[#FF003C]'
                      : 'border-[#333] text-gray-400 bg-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of touch-sized modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-[46vh] pr-1">
              {filteredTools.map((tool) => {
                const isSelected = selectedTool === tool.type;
                const spec = STRUCTURE_SPECS[tool.type];
                return (
                  <button
                    key={tool.type}
                    onClick={() => setSelectedTool(tool.type)}
                    className={`flex flex-col p-2.5 border text-left transition-all ${
                      isSelected
                        ? 'border-[#FF003C] bg-[#FF003C]/15 text-white shadow-[0_0_12px_rgba(255,0,60,0.3)]'
                        : 'border-[#222] bg-black text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <span className={isSelected ? 'text-[#FF003C]' : 'text-[#E056FD]'}>
                          {tool.icon}
                        </span>
                        <span>{tool.label}</span>
                      </div>
                      {isSelected && <Check size={14} className="text-[#39FF14]" />}
                    </div>

                    <span className="text-[10px] text-gray-400 mb-1.5">{tool.desc}</span>

                    {/* Inline Touch Specifications */}
                    <div className="pt-1.5 border-t border-[#222] flex flex-wrap gap-x-3 gap-y-0.5 text-[9px]">
                      <span className="text-[#39FF14] font-bold">COST: {spec.cost} CR</span>
                      {spec.powerGen > 0 && <span className="text-[#00F3FF]">+{spec.powerGen} kWh</span>}
                      {spec.powerDraw > 0 && <span className="text-[#FF003C]">-{spec.powerDraw} kWh</span>}
                      {spec.waterGen > 0 && <span className="text-[#00A8FF]">+{spec.waterGen} Gal</span>}
                      {spec.waterDraw > 0 && <span className="text-[#FFD700]">-{spec.waterDraw} Gal</span>}
                      {spec.calories > 0 && <span className="text-[#FFD700]">+{spec.calories} kcal</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile Done Action */}
            <div className="pt-2 border-t border-[#333] flex items-center justify-between">
              <span className="text-[10px] text-gray-400">
                ACTIVE: <strong className="text-[#FF003C]">{selectedTool}</strong>
              </span>
              <button
                onClick={() => setMobilePanel('NONE')}
                className="px-4 py-2 border-2 border-[#FF003C] bg-[#FF003C] text-black font-bold text-xs uppercase tracking-wider"
              >
                SELECT & TAP TO PLACE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
