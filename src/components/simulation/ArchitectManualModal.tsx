import React, { useState } from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { Button } from '../common/Button';
import {
  HelpCircle,
  X,
  Zap,
  Droplets,
  Flame,
  Home,
  Sun,
  Battery,
  CloudRain,
  Sprout,
  Building,
  Beef,
  Sparkles,
  Layers,
  Activity,
  Compass,
  FileCode2,
  Film,
  Camera,
  Hammer,
  Trash2,
  Orbit,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const ArchitectManualModal: React.FC = () => {
  const { isHelpModalOpen, setHelpModalOpen } = useHomesteadStore();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CONTROLS' | 'MODULES' | 'ENERGY'>('OVERVIEW');

  if (!isHelpModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-mono select-none">
      <div className="max-w-4xl w-full border-2 border-[#E056FD] bg-[#07010a] p-4 sm:p-6 shadow-[0_0_40px_rgba(224,86,253,0.3)] flex flex-col gap-4 max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-[#E056FD]/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FF003C] animate-pulse" />
            <h2 className="text-xs sm:text-base font-black text-white tracking-widest uppercase flex items-center gap-2">
              <HelpCircle size={18} className="text-[#E056FD]" />
              HOMESTEAD ARCHITECT // SYSTEM INTEL MANUAL
            </h2>
          </div>
          <button
            onClick={() => setHelpModalOpen(false)}
            className="p-1 border border-[#333] hover:border-[#FF003C] text-gray-400 hover:text-white transition-all"
            title="Close Manual"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 border-b border-[#222] pb-2 text-[10px] sm:text-xs overflow-x-auto scrollbar-none">
          {[
            { id: 'OVERVIEW', label: '1. CORE DIRECTIVE', icon: <Compass size={12} /> },
            { id: 'CONTROLS', label: '2. COMMAND & INTERFACE', icon: <FileCode2 size={12} /> },
            { id: 'MODULES', label: '3. STRUCTURE MATRIX (10)', icon: <Layers size={12} /> },
            { id: 'ENERGY', label: '4. POWER & BIO-LOOPS', icon: <Zap size={12} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border whitespace-nowrap font-bold transition-all ${
                activeTab === tab.id
                  ? 'border-[#FF003C] bg-[#FF003C]/15 text-[#FF003C] shadow-[0_0_10px_rgba(255,0,60,0.25)]'
                  : 'border-[#222] bg-black text-gray-400 hover:border-[#E056FD] hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body Container */}
        <div className="overflow-y-auto max-h-[60vh] pr-2 space-y-4 text-xs scrollbar-thin">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4 text-gray-300">
              <div className="p-3 bg-black border border-[#FF003C]/40 flex flex-col gap-2">
                <span className="text-xs font-black text-[#FF003C] uppercase tracking-wider flex items-center gap-2">
                  <Activity size={14} /> WHAT IS HOMESTEAD 3D SIMULATOR?
                </span>
                <p className="text-[11px] leading-relaxed text-gray-300">
                  HOMESTEAD 3D SIMULATOR is a precision, off-grid bio-energetic spatial engineering suite. It models the thermodynamic balance, hydrological loops, electrical microgrid, and caloric food production required to sustain an autonomous human habitat without external municipal utilities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <div className="p-3 bg-black border border-[#00F3FF]/40 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-[#00F3FF] uppercase tracking-wider">
                    ⚡ ELECTRICAL MICROGRID
                  </span>
                  <p className="text-[10px] text-gray-400">
                    Tracks real-time photovoltaic generation, chemical battery storage capacity, and base load draws. Simulates weather-driven solar drops and heating demand spikes.
                  </p>
                </div>

                <div className="p-3 bg-black border border-[#005588] flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-[#00F3FF] uppercase tracking-wider">
                    💧 HYDROLOGICAL MATRIX
                  </span>
                  <p className="text-[10px] text-gray-400">
                    Balances atmospheric rainwater cistern storage against pressurized deep-well groundwater extraction and crop/human consumption rates.
                  </p>
                </div>

                <div className="p-3 bg-black border border-[#E056FD]/40 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-[#E056FD] uppercase tracking-wider">
                    🌱 BIO-REGENERATIVE LOOPS
                  </span>
                  <p className="text-[10px] text-gray-400">
                    Closes the nutrient cycle: Cattle manure fuels anaerobic Methane Digesters for cooking gas and liquid fertilizer, while Biochar pyrolyzers fix carbon and boost crop yields by +25%.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#0a0010] border border-[#E056FD]/30 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[#E056FD] uppercase tracking-widest">
                  CRISIS STRESS VERIFICATION
                </span>
                <p className="text-[10px] text-gray-400">
                  Test your homestead against automated 14-Day Blackout tests and 30-Day Drought scenarios to pinpoint grid bottlenecks before they cause life-support failure.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CONTROLS & INTERFACE */}
          {activeTab === 'CONTROLS' && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[#E056FD] uppercase tracking-widest block">
                SYSTEM BUTTONS & INTERFACE TOOLS DIRECTORY
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#39FF14] font-bold">
                    <Hammer size={13} />
                    <span>BUILD MODE</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Sets cursor to placement mode. Tap or Left-Click on any voxel grid coordinate to deploy the selected infrastructure module.
                  </p>
                </div>

                <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#FF003C] font-bold">
                    <Trash2 size={13} />
                    <span>DEMOLISH MODE</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Sets cursor to demolition mode. Tap or Right-Click on any placed module to instantly deconstruct it and reclaim the grid voxel.
                  </p>
                </div>

                <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#00F3FF] font-bold">
                    <Orbit size={13} />
                    <span>ORBIT CAMERA</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Enables free 3D isometric rotation. Drag with 1 finger or mouse to rotate and tilt the view. 2-finger pinch or scroll wheel to zoom.
                  </p>
                </div>

                <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#00F3FF] font-bold">
                    <FileCode2 size={13} />
                    <span>[B] BLUEPRINT VIEW</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Toggles architectural wireframe drafting mode. Renders translucent holographic frames and dimensional boundary footprints for spatial planning.
                  </p>
                </div>

                <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#39FF14] font-bold">
                    <Zap size={13} />
                    <span>[E] ENERGY GRID OVERLAY</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Activates real-time power distribution heatmaps and pulsing power flow lines from energy generators to storage banks and consumers.
                  </p>
                </div>

                <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#E056FD] font-bold">
                    <CloudRain size={13} />
                    <span>[C] WEATHER CYCLE</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Cycles between CLEAR, DOWNPOUR, BLIZZARD, and ACID STORM. Each weather type alters solar yield, water catchment, and thermal demand.
                  </p>
                </div>

                <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#FF003C] font-bold">
                    <Camera size={13} />
                    <span>[X] SNAPSHOT</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Captures a high-resolution frame of the current 3D viewport and logs it into your evolution timeline with instant telemetry stats.
                  </p>
                </div>

                <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#E056FD] font-bold">
                    <Film size={13} />
                    <span>[T] TIME-LAPSE VIEWER</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Opens the interactive historical timeline player. Scrub through snapshots, animate playback at 1x/2x/4x, or export frames as images.
                  </p>
                </div>

                <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#FF003C] font-bold">
                    <AlertTriangle size={13} />
                    <span>BLACKOUT & DROUGHT TESTS</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Launches simulated stress crises (14-Day Blackout or 30-Day Drought) to compute days survived and identify system bottlenecks.
                  </p>
                </div>

                <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-gray-300 font-bold">
                    <RotateCcw size={13} />
                    <span>CLEAR & RESET CAM</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Clear wipes all placed voxels to start fresh. Reset Cam immediately centers the viewport back to standard isometric framing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRUCTURE MATRIX */}
          {activeTab === 'MODULES' && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[#E056FD] uppercase tracking-widest block">
                INFRASTRUCTURE SPECIFICATIONS & CAPACITIES (10 MODULES)
              </span>

              <div className="space-y-2">
                {[
                  {
                    name: 'Homestead Cabin',
                    type: 'CABIN',
                    icon: <Home size={14} className="text-[#FF003C]" />,
                    cost: '5,000 CR',
                    specs: 'Power Draw: -8 kWh/d | Water Draw: -40 Gal/d | Residents: 2 Humans',
                    desc: 'Central habitation shelter. Houses homesteaders and provides environmental conditioning, lighting, and communication base load.',
                  },
                  {
                    name: 'Solar Photovoltaic Array',
                    type: 'SOLAR-ARRAY',
                    icon: <Sun size={14} className="text-[#00F3FF]" />,
                    cost: '1,200 CR',
                    specs: 'Power Gen: +15 kWh/d | Weather Sensitive (Clouds -30%, Snow -50%)',
                    desc: 'High-efficiency monocrystalline solar panels with angled sun tracking. Primary clean energy generator for the microgrid.',
                  },
                  {
                    name: 'Battery Storage Bank',
                    type: 'BATTERY-BANK',
                    icon: <Battery size={14} className="text-[#E056FD]" />,
                    cost: '2,000 CR',
                    specs: 'Storage Cap: +15 kWh | Parasitic Draw: -0.5 kWh/d',
                    desc: 'Lithium iron phosphate (LiFePO4) energy buffer. Essential for storing excess solar energy to power the homestead at night and through storm blackouts.',
                  },
                  {
                    name: 'Rain Harvesting Cistern',
                    type: 'RAIN-CISTERN',
                    icon: <CloudRain size={14} className="text-[#00A8FF]" />,
                    cost: '400 CR',
                    specs: 'Reservoir Cap: +500 Gal | Base Supply: +25 Gal/d (Boosted in Rain +35%)',
                    desc: 'Gravity-fed atmospheric collection tank with sediment filtration. Captures rainwater runoff to buffer irrigation and potable reserves.',
                  },
                  {
                    name: 'Deep Aquifer Well Pump',
                    type: 'WELL-PUMP',
                    icon: <Droplets size={14} className="text-[#00F3FF]" />,
                    cost: '3,500 CR',
                    specs: 'Water Supply: +150 Gal/d | Continuous Draw: -3 kWh/d',
                    desc: 'Electric submersible well pump tapping deep groundwater aquifers. Provides reliable high-volume water supply regardless of surface drought.',
                  },
                  {
                    name: 'Raised Garden Bed',
                    type: 'RAISED-BED',
                    icon: <Sprout size={14} className="text-[#39FF14]" />,
                    cost: '100 CR',
                    specs: 'Nutrition: +800 kcal/d | Water Draw: -4 Gal/d | Biochar Boost: +25%',
                    desc: 'Intensive organic polyculture bed (tubers, greens, legumes). Low capital cost entry point for dietary self-sufficiency.',
                  },
                  {
                    name: 'Automated Greenhouse',
                    type: 'GREENHOUSE',
                    icon: <Building size={14} className="text-[#00F3FF]" />,
                    cost: '1,500 CR',
                    specs: 'Nutrition: +3,500 kcal/d | Power Draw: -2 kWh/d | Water Draw: -15 Gal/d',
                    desc: 'Climate-controlled hydroponic growing dome. Shielded against frost and storms to guarantee continuous high-yield food crops year-round.',
                  },
                  {
                    name: 'Pastured Cattle Paddock',
                    type: 'COW-PASTURE',
                    icon: <Beef size={14} className="text-[#FFD700]" />,
                    cost: '2,500 CR',
                    specs: 'Nutrition: +5,000 kcal/d | Water Draw: -30 Gal/d | Yields Bio-Manure',
                    desc: 'Rotational livestock grazing enclosure. Supplies dense animal protein (dairy/beef) and organic manure feedstock for methane digesters.',
                  },
                  {
                    name: 'Anaerobic Methane Digester',
                    type: 'METHANE-DIGESTER',
                    icon: <Flame size={14} className="text-[#FF003C]" />,
                    cost: '1,800 CR',
                    specs: 'Biogas (CH4): +1.8 m³/d | Bio-Fertilizer: +25 L/d | Power Draw: -1 kWh/d',
                    desc: 'Biochemical reactor converting manure and food waste into combustible methane gas for cooking/heating and nutrient-rich liquid fertilizer.',
                  },
                  {
                    name: 'Pyrolysis Biochar Retort',
                    type: 'BIOCHAR-RETORT',
                    icon: <Sparkles size={14} className="text-[#39FF14]" />,
                    cost: '600 CR',
                    specs: 'Biochar: +12 kg/d | Multiplier: +25% Crop Nutrition across all beds',
                    desc: 'Oxygen-deprived biomass pyrolysis chamber. Produces porous biochar soil amendment that permanently fixes carbon and boosts soil fertility.',
                  },
                ].map((mod) => (
                  <div key={mod.type} className="p-2.5 bg-black border border-[#222] flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-white">
                        {mod.icon}
                        <span>{mod.name}</span>
                        <span className="text-[9px] text-gray-500">[{mod.type}]</span>
                      </div>
                      <span className="text-[10px] text-[#39FF14] font-bold">{mod.cost}</span>
                    </div>
                    <div className="text-[9px] text-[#00F3FF]">{mod.specs}</div>
                    <p className="text-[10px] text-gray-400">{mod.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ENERGY & BIO-LOOPS */}
          {activeTab === 'ENERGY' && (
            <div className="space-y-4 text-gray-300">
              <div className="p-3 bg-black border border-[#00F3FF]/40 flex flex-col gap-2">
                <span className="text-xs font-black text-[#00F3FF] uppercase tracking-wider flex items-center gap-2">
                  <Zap size={14} /> ENERGY ROUTING & OVERLAY VISUALIZATION
                </span>
                <p className="text-[11px] leading-relaxed text-gray-300">
                  When the <strong>Energy Grid Overlay [E]</strong> is active, the simulator color-codes ground voxels and calculates real-time power distribution:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[10px] text-gray-400">
                  <li><strong className="text-[#00F3FF]">Generators (Cyan/Green Glow):</strong> Solar Arrays and Methane Digesters produce positive electrical and thermal wattage.</li>
                  <li><strong className="text-[#E056FD]">Storage Buffers (Violet Pulse):</strong> Battery banks absorb surplus generation during daylight hours and discharge to consumers under load.</li>
                  <li><strong className="text-[#FF9900]">Consumers (Amber Conduits):</strong> Cabins, Well Pumps, and Greenhouses draw energy continuously.</li>
                  <li><strong className="text-[#39FF14]">Animated Flow Pulses:</strong> Glowing energy conduits illustrate real-time wattage transfers between producers, battery nodes, and active loads.</li>
                </ul>
              </div>

              <div className="p-3 bg-black border border-[#E056FD]/40 flex flex-col gap-2">
                <span className="text-xs font-black text-[#E056FD] uppercase tracking-wider flex items-center gap-2">
                  <Flame size={14} /> THE CLOSED-LOOP HOMESTEAD EQUATION
                </span>
                <p className="text-[10px] text-gray-300">
                  A 100% sustainable homestead achieves positive net power (Gen &gt; Draw), positive net water (Supply &gt; Demand), and delivers &gt;6,000 kcal/day for 2 adult humans:
                </p>
                <div className="p-2 bg-[#111] border border-[#333] text-[9px] text-[#39FF14] font-mono">
                  [Solar + Methane] &gt; [Cabin + Well + Greenhouse] ➔ POSITIVE MICROGRID<br />
                  [Rain + Well Pump] &gt; [Human + Crops + Cattle] ➔ POSITIVE WATER MATRIX<br />
                  [Cattle Manure] ➔ [Methane Digester] ➔ [Cooking Gas + Fertilizer] ➔ [Crops] ➔ BIO-LOOP CLOSED
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#333] pt-3 flex items-center justify-between">
          <span className="text-[10px] text-gray-500">
            PRESS <strong className="text-[#E056FD]">[H]</strong> OR CLICK TO CLOSE
          </span>
          <Button variant="primary" onClick={() => setHelpModalOpen(false)}>
            Close Architect Manual
          </Button>
        </div>
      </div>
    </div>
  );
};
