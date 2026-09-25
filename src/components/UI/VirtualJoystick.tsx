/* NEW CODE ADDITIONS START: DEVICE CONTROLS */
import React from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { useTimelapseStore } from '../../store/useTimelapseStore';
import { useSeasonStore } from '../../store/useSeasonStore';
import { useResourceLogStore } from '../../store/useResourceLogStore';
import {
  Hammer,
  Trash2,
  Orbit,
  RotateCcw,
  Boxes,
  Camera,
  Film,
  Sun,
  Battery,
  Sprout,
  Flame,
  FileCode2,
  Zap,
  HelpCircle,
  BarChart3,
  Compass,
} from 'lucide-react';

export const VirtualJoystick: React.FC = () => {
  const {
    selectedTool,
    setSelectedTool,
    interactionMode,
    setInteractionMode,
    toggleMobilePanel,
    resetCamera,
    isBlueprintMode,
    toggleBlueprintMode,
    isEnergyOverlayMode,
    toggleEnergyOverlayMode,
    setHelpModalOpen,
  } = useHomesteadStore();

  const { triggerManualCapture, setViewerOpen, isViewerOpen } = useTimelapseStore();
  const { nextSeason, currentSeason } = useSeasonStore();
  const { toggleLogPanel, isLogPanelOpen } = useResourceLogStore();

  return (
    <div className="fixed bottom-2 inset-x-2 z-40 lg:hidden font-mono select-none pointer-events-auto flex flex-col gap-1.5 max-w-lg mx-auto">
      {/* Upper Quick Mode & Visualization Toolbar */}
      <div className="flex items-center justify-between bg-black/90 border border-[#333] p-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        {/* Interaction Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#111] p-0.5 border border-[#222]">
          <button
            onClick={() => setInteractionMode('BUILD')}
            className={`flex items-center gap-1 px-2 py-1 text-[9px] font-bold transition-all ${
              interactionMode === 'BUILD'
                ? 'bg-[#FF003C] text-black shadow-[0_0_8px_#FF003C]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Hammer size={11} />
            <span>BUILD</span>
          </button>

          <button
            onClick={() => setInteractionMode('DEMOLISH')}
            className={`flex items-center gap-1 px-2 py-1 text-[9px] font-bold transition-all ${
              interactionMode === 'DEMOLISH'
                ? 'bg-[#FF003C] text-black shadow-[0_0_8px_#FF003C]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trash2 size={11} />
            <span>DEMOLISH</span>
          </button>

          <button
            onClick={() => setInteractionMode('ORBIT')}
            className={`flex items-center gap-1 px-2 py-1 text-[9px] font-bold transition-all ${
              interactionMode === 'ORBIT'
                ? 'bg-[#00F3FF] text-black shadow-[0_0_8px_#00F3FF]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Orbit size={11} />
            <span>ORBIT</span>
          </button>
        </div>

        {/* Blueprint, Energy Grid, Season, & Log Toggles */}
        <div className="flex items-center gap-1">
          {/* Season cycle button */}
          <button
            onClick={nextSeason}
            className="p-1.5 border border-[#39FF14] bg-[#39FF14]/15 text-[#39FF14] text-[9px] font-bold"
            title={`Current Season: ${currentSeason}. Tap to Cycle.`}
          >
            <Compass size={12} />
          </button>

          {/* Resource Log Toggle */}
          <button
            onClick={toggleLogPanel}
            className={`p-1.5 border text-xs font-bold transition-all ${
              isLogPanelOpen
                ? 'border-[#00F3FF] bg-[#00F3FF]/20 text-[#00F3FF]'
                : 'border-[#333] bg-[#111] text-[#00F3FF]'
            }`}
            title="Open 60-Minute Resource Log"
          >
            <BarChart3 size={12} />
          </button>

          {/* Blueprint Mode Toggle */}
          <button
            onClick={toggleBlueprintMode}
            className={`p-1.5 border text-xs font-bold transition-all ${
              isBlueprintMode
                ? 'border-[#00F3FF] bg-[#00F3FF]/20 text-[#00F3FF]'
                : 'border-[#333] bg-[#111] text-gray-400'
            }`}
            title="Toggle Blueprint Wireframes"
          >
            <FileCode2 size={12} />
          </button>

          {/* Energy Grid Toggle */}
          <button
            onClick={toggleEnergyOverlayMode}
            className={`p-1.5 border text-xs font-bold transition-all ${
              isEnergyOverlayMode
                ? 'border-[#39FF14] bg-[#39FF14]/20 text-[#39FF14]'
                : 'border-[#333] bg-[#111] text-gray-400'
            }`}
            title="Toggle Power Flow Conduits"
          >
            <Zap size={12} />
          </button>

          {/* Intel Guide */}
          <button
            onClick={() => setHelpModalOpen(true)}
            className="p-1.5 border border-[#E056FD] bg-[#E056FD]/15 text-[#E056FD]"
            title="Open System Intel Manual"
          >
            <HelpCircle size={12} />
          </button>

          <button
            onClick={resetCamera}
            title="Reset 3D Camera View"
            className="p-1.5 border border-[#333] hover:border-[#E056FD] bg-[#111] text-[#E056FD]"
          >
            <RotateCcw size={12} />
          </button>

          <button
            onClick={triggerManualCapture}
            title="Snapshot Viewport"
            className="p-1.5 border border-[#FF003C] bg-[#FF003C]/15 text-[#FF003C]"
          >
            <Camera size={12} />
          </button>
        </div>
      </div>

      {/* Lower Quick Voxel Module Selection & Status Dock */}
      <div className="flex items-center justify-between bg-black/90 border border-[#333] p-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        {/* Active Module / Trigger Palette Drawer */}
        <button
          onClick={() => toggleMobilePanel('PALETTE')}
          className="flex items-center gap-1.5 px-2 py-1.5 border border-[#E056FD] bg-[#E056FD]/15 text-[#E056FD] text-[10px] font-bold"
        >
          <Boxes size={13} />
          <span className="truncate max-w-[110px]">{selectedTool}</span>
        </button>

        {/* Quick Common Voxel Selectors */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedTool('SOLAR-ARRAY')}
            className={`p-1.5 border text-xs ${
              selectedTool === 'SOLAR-ARRAY'
                ? 'border-[#00F3FF] bg-[#00F3FF]/20 text-[#00F3FF]'
                : 'border-[#222] bg-[#111] text-gray-400'
            }`}
          >
            <Sun size={12} />
          </button>
          <button
            onClick={() => setSelectedTool('BATTERY-BANK')}
            className={`p-1.5 border text-xs ${
              selectedTool === 'BATTERY-BANK'
                ? 'border-[#E056FD] bg-[#E056FD]/20 text-[#E056FD]'
                : 'border-[#222] bg-[#111] text-gray-400'
            }`}
          >
            <Battery size={12} />
          </button>
          <button
            onClick={() => setSelectedTool('RAISED-BED')}
            className={`p-1.5 border text-xs ${
              selectedTool === 'RAISED-BED'
                ? 'border-[#39FF14] bg-[#39FF14]/20 text-[#39FF14]'
                : 'border-[#222] bg-[#111] text-gray-400'
            }`}
          >
            <Sprout size={12} />
          </button>
          <button
            onClick={() => setSelectedTool('METHANE-DIGESTER')}
            className={`p-1.5 border text-xs ${
              selectedTool === 'METHANE-DIGESTER'
                ? 'border-[#FF003C] bg-[#FF003C]/20 text-[#FF003C]'
                : 'border-[#222] bg-[#111] text-gray-400'
            }`}
          >
            <Flame size={12} />
          </button>
        </div>

        {/* Mobile Evolution History Trigger */}
        <button
          onClick={() => setViewerOpen(!isViewerOpen)}
          className="flex items-center gap-1 p-1.5 border border-[#333] hover:border-[#E056FD] bg-[#111] text-gray-300"
          title="Open Timelapse Viewer"
        >
          <Film size={12} className="text-[#E056FD]" />
        </button>
      </div>
    </div>
  );
};
/* NEW CODE ADDITIONS END: DEVICE CONTROLS */
