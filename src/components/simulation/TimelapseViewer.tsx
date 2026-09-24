import React, { useEffect, useRef } from 'react';
import { useTimelapseStore } from '../../store/useTimelapseStore';
import { Button } from '../common/Button';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Camera,
  Trash2,
  Download,
  Clock,
  Activity,
  Zap,
  Droplets,
  Flame,
  X,
  Layers,
} from 'lucide-react';

export const TimelapseViewer: React.FC = () => {
  const {
    snapshots,
    isViewerOpen,
    playbackIndex,
    isPlaying,
    playbackSpeed,
    isAutoCaptureEnabled,
    setViewerOpen,
    setPlaybackIndex,
    setIsPlaying,
    setPlaybackSpeed,
    triggerManualCapture,
    deleteSnapshot,
    clearSnapshots,
    toggleAutoCapture,
  } = useTimelapseStore();

  const playTimerRef = useRef<number | null>(null);

  // Playback loop
  useEffect(() => {
    if (!isPlaying || snapshots.length === 0) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      return;
    }

    const intervalMs = Math.max(150, Math.floor(1000 / playbackSpeed));
    playTimerRef.current = window.setInterval(() => {
      const nextIdx = (playbackIndex + 1) % snapshots.length;
      setPlaybackIndex(nextIdx);
    }, intervalMs);

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, playbackIndex, playbackSpeed, snapshots.length, setPlaybackIndex]);

  if (!isViewerOpen) return null;

  const currentFrame = snapshots[playbackIndex] || null;

  const handleDownload = () => {
    if (!currentFrame) return;
    const a = document.createElement('a');
    a.href = currentFrame.dataUrl;
    a.download = `homestead-frame-${playbackIndex + 1}-${Date.now()}.jpg`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-mono select-none">
      <div className="max-w-4xl w-full border-2 border-[#E056FD] bg-[#07010a] p-4 sm:p-6 shadow-[0_0_40px_rgba(224,86,253,0.3)] flex flex-col gap-4 max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#E056FD]/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FF003C] animate-ping" />
            <h2 className="text-sm sm:text-base font-black text-white tracking-widest uppercase">
              TIMELAPSE // HOMESTEAD EVOLUTION RECORDER
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-400">
              FRAME {snapshots.length > 0 ? playbackIndex + 1 : 0} / {snapshots.length}
            </span>
            <button
              onClick={() => setViewerOpen(false)}
              className="text-gray-400 hover:text-white border border-[#333] hover:border-[#FF003C] p-1 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main Frame Stage */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[260px] sm:min-h-[340px] bg-black border border-[#222] overflow-hidden">
          {currentFrame ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={currentFrame.dataUrl}
                alt={`Homestead Evolution Snapshot ${playbackIndex + 1}`}
                className="max-h-[380px] w-auto object-contain border border-[#111]"
              />

              {/* HUD Overlay Stats on Snapshot */}
              <div className="absolute top-3 left-3 bg-black/85 border border-[#E056FD]/40 p-2 text-[10px] flex flex-col gap-1 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#E056FD] font-bold">
                  <Clock size={11} />
                  <span>{new Date(currentFrame.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Layers size={11} className="text-[#00F3FF]" />
                  <span>MODULES: {currentFrame.structureCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] px-1 py-0.2 border border-[#FF003C] text-[#FF003C] font-bold">
                    {currentFrame.weather}
                  </span>
                </div>
              </div>

              {/* HUD Overlay Metrics */}
              <div className="absolute top-3 right-3 bg-black/85 border border-[#333] p-2 text-[10px] flex flex-col gap-1 backdrop-blur-sm text-right">
                <div className="flex items-center justify-end gap-1.5 text-gray-400">
                  <span>SUSTAINABILITY:</span>
                  <span
                    className={`font-bold ${
                      currentFrame.sustainabilityScore >= 70 ? 'text-[#39FF14]' : 'text-[#FF003C]'
                    }`}
                  >
                    {currentFrame.sustainabilityScore}%
                  </span>
                  <Activity size={10} className="text-[#39FF14]" />
                </div>
                <div className="flex items-center justify-end gap-1.5 text-gray-400">
                  <span>NET POWER:</span>
                  <span className="text-[#00F3FF] font-bold">
                    {currentFrame.netPower > 0 ? `+${currentFrame.netPower}` : currentFrame.netPower} kWh/d
                  </span>
                  <Zap size={10} className="text-[#00F3FF]" />
                </div>
                <div className="flex items-center justify-end gap-1.5 text-gray-400">
                  <span>NET WATER:</span>
                  <span className="text-[#00A8FF] font-bold">
                    {currentFrame.netWater > 0 ? `+${currentFrame.netWater}` : currentFrame.netWater} Gal/d
                  </span>
                  <Droplets size={10} className="text-[#00A8FF]" />
                </div>
                <div className="flex items-center justify-end gap-1.5 text-gray-400">
                  <span>CALORIES:</span>
                  <span className="text-[#FFD700] font-bold">{currentFrame.totalCalories} kcal</span>
                  <Flame size={10} className="text-[#FFD700]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
              <Camera size={36} className="text-[#E056FD] animate-pulse" />
              <span className="text-xs text-gray-400 uppercase tracking-widest">
                NO TIME-LAPSE SNAPSHOTS RECORDED YET
              </span>
              <p className="text-[10px] text-gray-600 max-w-sm">
                Place or configure modules in the 3D viewport, adjust environmental weather, or click below to capture your first baseline frame.
              </p>
              <Button variant="danger" onClick={triggerManualCapture} className="mt-2">
                Capture Initial Snapshot
              </Button>
            </div>
          )}
        </div>

        {/* Timeline Scrubber & Playback Controls */}
        <div className="flex flex-col gap-2.5 bg-black p-3 border border-[#333]">
          {/* Timeline Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-gray-500 font-bold min-w-[50px]">
              00:00
            </span>
            <input
              type="range"
              min={0}
              max={Math.max(0, snapshots.length - 1)}
              value={playbackIndex}
              onChange={(e) => setPlaybackIndex(parseInt(e.target.value, 10))}
              disabled={snapshots.length <= 1}
              className="flex-1 accent-[#FF003C] cursor-pointer h-1.5 bg-[#222]"
            />
            <span className="text-[9px] text-gray-500 font-bold min-w-[50px] text-right">
              {snapshots.length > 0
                ? new Date(snapshots[snapshots.length - 1].timestamp).toLocaleTimeString()
                : 'LIVE'}
            </span>
          </div>

          {/* Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1a1a1a]">
            {/* Playback Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPlaybackIndex(playbackIndex - 1)}
                disabled={playbackIndex <= 0}
                className="p-1.5 border border-[#333] hover:border-[#E056FD] text-gray-300 disabled:opacity-30 disabled:hover:border-[#333]"
                title="Previous Frame"
              >
                <SkipBack size={14} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={snapshots.length <= 1}
                className={`flex items-center gap-1 px-3 py-1.5 border text-xs font-bold transition-all ${
                  isPlaying
                    ? 'border-[#39FF14] text-[#39FF14] bg-[#39FF14]/10'
                    : 'border-[#FF003C] text-[#FF003C] hover:bg-[#FF003C]/10'
                } disabled:opacity-30`}
                title={isPlaying ? 'Pause Time-Lapse' : 'Play Time-Lapse'}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>
              <button
                onClick={() => setPlaybackIndex(playbackIndex + 1)}
                disabled={playbackIndex >= snapshots.length - 1}
                className="p-1.5 border border-[#333] hover:border-[#E056FD] text-gray-300 disabled:opacity-30 disabled:hover:border-[#333]"
                title="Next Frame"
              >
                <SkipForward size={14} />
              </button>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 ml-2 border-l border-[#333] pl-2">
                {[1, 2, 4].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`text-[9px] px-1.5 py-0.5 border ${
                      playbackSpeed === speed
                        ? 'border-[#E056FD] text-[#E056FD] bg-[#E056FD]/10'
                        : 'border-[#222] text-gray-500 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAutoCapture}
                className={`text-[9px] px-2 py-1 border transition-all ${
                  isAutoCaptureEnabled
                    ? 'border-[#39FF14] text-[#39FF14]'
                    : 'border-[#444] text-gray-500'
                }`}
              >
                AUTO-CAPTURE {isAutoCaptureEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={triggerManualCapture}
                className="flex items-center gap-1 px-2.5 py-1 border border-[#FF003C] text-[#FF003C] hover:bg-[#FF003C]/10 text-xs font-bold transition-all"
                title="Capture Current Viewport Snapshot"
              >
                <Camera size={12} />
                <span>SNAP</span>
              </button>
              {currentFrame && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1 border border-[#00F3FF] text-[#00F3FF] hover:bg-[#00F3FF]/10 text-xs font-bold transition-all"
                  title="Export Current Frame"
                >
                  <Download size={12} />
                  <span>EXPORT</span>
                </button>
              )}
              {currentFrame && (
                <button
                  onClick={() => deleteSnapshot(currentFrame.id)}
                  className="p-1 border border-[#333] text-gray-500 hover:border-[#FF003C] hover:text-[#FF003C] transition-all"
                  title="Delete Snapshot"
                >
                  <Trash2 size={12} />
                </button>
              )}
              {snapshots.length > 0 && (
                <button
                  onClick={clearSnapshots}
                  className="text-[9px] text-gray-500 hover:text-[#FF003C] transition-all"
                >
                  CLEAR ALL
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Filmstrip */}
        {snapshots.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-h-20 scrollbar-thin">
            {snapshots.map((snap, idx) => (
              <button
                key={snap.id}
                onClick={() => setPlaybackIndex(idx)}
                className={`relative flex-shrink-0 w-20 h-14 border transition-all overflow-hidden ${
                  idx === playbackIndex
                    ? 'border-[#FF003C] ring-1 ring-[#FF003C]'
                    : 'border-[#222] opacity-60 hover:opacity-100 hover:border-[#E056FD]'
                }`}
              >
                <img
                  src={snap.dataUrl}
                  alt={`Thumb ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 bg-black/80 px-1 text-[7px] text-gray-300">
                  #{idx + 1}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
