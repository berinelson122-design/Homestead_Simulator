import React, { useRef, useEffect, useState } from 'react';
import { useResourceLogStore } from '../../store/useResourceLogStore';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { Button } from '../common/Button';
import {
  Activity,
  Zap,
  Droplets,
  Flame,
  X,
  TrendingUp,
  Clock,
  RotateCcw,
  BarChart3,
} from 'lucide-react';

export const ResourceLogPanel: React.FC = () => {
  const {
    logPoints,
    isLogPanelOpen,
    selectedMetricGroup,
    setSelectedMetricGroup,
    setLogPanelOpen,
    generateHistory,
  } = useResourceLogStore();

  const { metrics } = useHomesteadStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Synchronize history when metrics change significantly
  useEffect(() => {
    generateHistory(metrics);
  }, [metrics.totalPowerGen, metrics.totalPowerDraw, metrics.totalWaterGen, metrics.totalWaterDraw, metrics.totalCalories]);

  // Procedural Canvas Line Chart Rendering Loop
  useEffect(() => {
    if (!canvasRef.current || !isLogPanelOpen || logPoints.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const padding = { top: 30, right: 25, bottom: 40, left: 55 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Determine active series based on selectedMetricGroup
    interface SeriesConfig {
      name: string;
      color: string;
      glowColor: string;
      key: keyof typeof logPoints[0];
      unit: string;
    }

    let seriesList: SeriesConfig[] = [];
    if (selectedMetricGroup === 'ENERGY') {
      seriesList = [
        { name: 'Power Gen', color: '#39FF14', glowColor: 'rgba(57, 255, 20, 0.4)', key: 'powerGen', unit: 'kWh/d' },
        { name: 'Power Draw', color: '#FF003C', glowColor: 'rgba(255, 0, 60, 0.4)', key: 'powerDraw', unit: 'kWh/d' },
        { name: 'Net Power', color: '#00F3FF', glowColor: 'rgba(0, 243, 255, 0.4)', key: 'netPower', unit: 'kWh/d' },
      ];
    } else if (selectedMetricGroup === 'WATER') {
      seriesList = [
        { name: 'Water Supply', color: '#00F3FF', glowColor: 'rgba(0, 243, 255, 0.4)', key: 'waterGen', unit: 'Gal/d' },
        { name: 'Water Draw', color: '#FF9900', glowColor: 'rgba(255, 153, 0, 0.4)', key: 'waterDraw', unit: 'Gal/d' },
        { name: 'Net Water', color: '#0066FF', glowColor: 'rgba(0, 102, 255, 0.4)', key: 'netWater', unit: 'Gal/d' },
      ];
    } else {
      seriesList = [
        { name: 'Calories', color: '#FFD700', glowColor: 'rgba(255, 215, 0, 0.4)', key: 'calories', unit: 'kcal/d' },
        { name: 'Biogas (CH4)', color: '#FF003C', glowColor: 'rgba(255, 0, 60, 0.4)', key: 'methane', unit: 'm³/d' },
        { name: 'Fertilizer', color: '#39FF14', glowColor: 'rgba(57, 255, 20, 0.4)', key: 'fertilizer', unit: 'L/d' },
        { name: 'Biochar', color: '#E056FD', glowColor: 'rgba(224, 86, 253, 0.4)', key: 'biochar', unit: 'kg/d' },
      ];
    }

    // Compute min & max bounds across all active series
    let minVal = 0;
    let maxVal = 10;
    seriesList.forEach((s) => {
      logPoints.forEach((p) => {
        const v = Number(p[s.key]);
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
      });
    });

    // Add 15% headroom
    maxVal = maxVal === minVal ? maxVal + 10 : maxVal * 1.15;
    if (minVal < 0) minVal = minVal * 1.15;

    const valRange = maxVal - minVal || 1;

    // Coordinate conversion helpers
    const getX = (index: number) => padding.left + (index / (logPoints.length - 1)) * chartW;
    const getY = (val: number) => padding.top + chartH - ((val - minVal) / valRange) * chartH;

    // Draw Grid Lines & Ticks
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    const ySteps = 5;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= ySteps; i++) {
      const v = minVal + (i / ySteps) * (maxVal - minVal);
      const y = getY(v);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();

      const label = v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(v % 1 === 0 ? 0 : 1);
      ctx.fillText(label, padding.left - 8, y);
    }

    // Zero baseline line if minVal < 0
    if (minVal < 0 && maxVal > 0) {
      const zeroY = getY(0);
      ctx.strokeStyle = '#333333';
      ctx.setLineDash([]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padding.left, zeroY);
      ctx.lineTo(padding.left + chartW, zeroY);
      ctx.stroke();
    }

    // X Axis Minute Labels
    ctx.setLineDash([]);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xIntervals = [0, 15, 30, 45, 60];
    xIntervals.forEach((m) => {
      const idx = 60 - m;
      if (idx >= 0 && idx < logPoints.length) {
        const x = getX(idx);
        ctx.strokeStyle = '#222222';
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, padding.top + chartH);
        ctx.stroke();

        ctx.fillStyle = m === 0 ? '#39FF14' : '#555555';
        const txt = m === 0 ? 'LIVE (NOW)' : `T-${m}m`;
        ctx.fillText(txt, x, padding.top + chartH + 8);
      }
    });

    // Draw Series Lines with Gradient Fill
    seriesList.forEach((s) => {
      // 1. Draw Area Fill
      const zeroY = Math.min(padding.top + chartH, Math.max(padding.top, getY(0)));
      ctx.beginPath();
      logPoints.forEach((p, idx) => {
        const x = getX(idx);
        const y = getY(Number(p[s.key]));
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(getX(logPoints.length - 1), zeroY);
      ctx.lineTo(getX(0), zeroY);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      grad.addColorStop(0, s.glowColor);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fill();

      // 2. Draw Stroke Line
      ctx.beginPath();
      logPoints.forEach((p, idx) => {
        const x = getX(idx);
        const y = getY(Number(p[s.key]));
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset
    });

    // Interactive Hover Cursor Line & Intersections
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < logPoints.length) {
      const curX = getX(hoverIndex);
      ctx.strokeStyle = '#E056FD';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(curX, padding.top);
      ctx.lineTo(curX, padding.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw point rings
      const curPoint = logPoints[hoverIndex];
      seriesList.forEach((s) => {
        const curY = getY(Number(curPoint[s.key]));
        ctx.beginPath();
        ctx.arc(curX, curY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  }, [logPoints, isLogPanelOpen, selectedMetricGroup, hoverIndex]);

  if (!isLogPanelOpen) return null;

  // Compute Quick Stats
  const activeLog = logPoints[hoverIndex !== null ? hoverIndex : logPoints.length - 1] || logPoints[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || logPoints.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const paddingLeft = 55;
    const chartW = rect.width - 55 - 25;

    const ratio = Math.max(0, Math.min(1, (x - paddingLeft) / chartW));
    const idx = Math.round(ratio * (logPoints.length - 1));
    setHoverIndex(idx);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-mono select-none">
      <div className="max-w-5xl w-full border-2 border-[#00F3FF] bg-[#050b14] p-4 sm:p-6 shadow-[0_0_40px_rgba(0,243,255,0.25)] flex flex-col gap-4 max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#00F3FF]/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00F3FF] animate-pulse" />
            <h2 className="text-xs sm:text-base font-black text-white tracking-widest uppercase flex items-center gap-2">
              <BarChart3 size={18} className="text-[#00F3FF]" />
              RESOURCE CONSUMPTION LOG // 60-MINUTE HISTORICAL TELEMETRY
            </h2>
          </div>
          <button
            onClick={() => setLogPanelOpen(false)}
            className="p-1 border border-[#333] hover:border-[#FF003C] text-gray-400 hover:text-white transition-all"
            title="Close Log Panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Metric Group Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
            <button
              onClick={() => setSelectedMetricGroup('ENERGY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border font-bold transition-all ${
                selectedMetricGroup === 'ENERGY'
                  ? 'border-[#39FF14] bg-[#39FF14]/15 text-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                  : 'border-[#222] bg-black text-gray-400 hover:border-[#39FF14]'
              }`}
            >
              <Zap size={12} />
              <span>⚡ ELECTRICAL POWER (kWh)</span>
            </button>

            <button
              onClick={() => setSelectedMetricGroup('WATER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border font-bold transition-all ${
                selectedMetricGroup === 'WATER'
                  ? 'border-[#00F3FF] bg-[#00F3FF]/15 text-[#00F3FF] shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                  : 'border-[#222] bg-black text-gray-400 hover:border-[#00F3FF]'
              }`}
            >
              <Droplets size={12} />
              <span>💧 HYDRO MATRIX (Gal)</span>
            </button>

            <button
              onClick={() => setSelectedMetricGroup('BIOMASS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border font-bold transition-all ${
                selectedMetricGroup === 'BIOMASS'
                  ? 'border-[#E056FD] bg-[#E056FD]/15 text-[#E056FD] shadow-[0_0_10px_rgba(224,86,253,0.3)]'
                  : 'border-[#222] bg-black text-gray-400 hover:border-[#E056FD]'
              }`}
            >
              <Flame size={12} />
              <span>🌱 BIOMASS &amp; GAS</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <Clock size={12} className="text-[#00F3FF]" />
            <span>TIMEFRAME: <strong>LAST 60 MINUTES</strong></span>
            <button
              onClick={() => generateHistory(metrics)}
              className="p-1 border border-[#333] hover:border-[#00F3FF] text-gray-400 hover:text-white"
              title="Resample Telemetry History"
            >
              <RotateCcw size={11} />
            </button>
          </div>
        </div>

        {/* Canvas Line Chart Stage */}
        <div className="relative w-full h-64 sm:h-80 bg-black border border-[#222] overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIndex(null)}
            className="w-full h-full cursor-crosshair"
          />

          {/* Real-time Hover Scrubber Overlay Tooltip */}
          {hoverIndex !== null && activeLog && (
            <div className="absolute top-2 right-2 bg-black/90 border border-[#E056FD] p-2.5 text-[10px] flex flex-col gap-1 backdrop-blur-md shadow-[0_0_15px_rgba(224,86,253,0.3)] pointer-events-none">
              <div className="flex items-center justify-between border-b border-[#333] pb-1 text-[#E056FD] font-bold">
                <span>{activeLog.minuteAgo === 0 ? 'LIVE TELEMETRY' : `TIMESTAMP: T-${activeLog.minuteAgo} MIN`}</span>
                <span>{new Date(activeLog.timestamp).toLocaleTimeString()}</span>
              </div>

              {selectedMetricGroup === 'ENERGY' && (
                <div className="space-y-0.5">
                  <div className="flex justify-between gap-4 text-gray-300">
                    <span className="text-[#39FF14]">Generation:</span>
                    <span className="font-bold">+{activeLog.powerGen} kWh/d</span>
                  </div>
                  <div className="flex justify-between gap-4 text-gray-300">
                    <span className="text-[#FF003C]">Draw Load:</span>
                    <span className="font-bold">-{activeLog.powerDraw} kWh/d</span>
                  </div>
                  <div className="flex justify-between gap-4 text-white border-t border-[#222] pt-0.5">
                    <span className="text-[#00F3FF]">Net Power:</span>
                    <span className={`font-bold ${activeLog.netPower >= 0 ? 'text-[#39FF14]' : 'text-[#FF003C]'}`}>
                      {activeLog.netPower > 0 ? `+${activeLog.netPower}` : activeLog.netPower} kWh/d
                    </span>
                  </div>
                </div>
              )}

              {selectedMetricGroup === 'WATER' && (
                <div className="space-y-0.5">
                  <div className="flex justify-between gap-4 text-gray-300">
                    <span className="text-[#00F3FF]">Supply Rate:</span>
                    <span className="font-bold">+{activeLog.waterGen} Gal/d</span>
                  </div>
                  <div className="flex justify-between gap-4 text-gray-300">
                    <span className="text-[#FF9900]">Demand Rate:</span>
                    <span className="font-bold">-{activeLog.waterDraw} Gal/d</span>
                  </div>
                  <div className="flex justify-between gap-4 text-white border-t border-[#222] pt-0.5">
                    <span className="text-[#0066FF]">Net Buffer:</span>
                    <span className={`font-bold ${activeLog.netWater >= 0 ? 'text-[#00F3FF]' : 'text-[#FF003C]'}`}>
                      {activeLog.netWater > 0 ? `+${activeLog.netWater}` : activeLog.netWater} Gal/d
                    </span>
                  </div>
                </div>
              )}

              {selectedMetricGroup === 'BIOMASS' && (
                <div className="space-y-0.5">
                  <div className="flex justify-between gap-4 text-gray-300">
                    <span className="text-[#FFD700]">Calories:</span>
                    <span className="font-bold">+{activeLog.calories} kcal/d</span>
                  </div>
                  <div className="flex justify-between gap-4 text-gray-300">
                    <span className="text-[#FF003C]">Biogas CH4:</span>
                    <span className="font-bold">+{activeLog.methane} m³/d</span>
                  </div>
                  <div className="flex justify-between gap-4 text-gray-300">
                    <span className="text-[#39FF14]">Digestate:</span>
                    <span className="font-bold">+{activeLog.fertilizer} L/d</span>
                  </div>
                  <div className="flex justify-between gap-4 text-gray-300">
                    <span className="text-[#E056FD]">Biochar:</span>
                    <span className="font-bold">+{activeLog.biochar} kg/d</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
          <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-0.5">
            <span className="text-gray-500 uppercase">CURRENT 60M STATUS</span>
            <span className="text-xs font-bold text-[#39FF14]">STABLE CYCLING</span>
          </div>

          <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-0.5">
            <span className="text-gray-500 uppercase">60M PEAK GENERATION</span>
            <span className="text-xs font-bold text-[#00F3FF]">
              {selectedMetricGroup === 'ENERGY'
                ? `+${Math.max(...logPoints.map((p) => p.powerGen))} kWh/d`
                : selectedMetricGroup === 'WATER'
                ? `+${Math.max(...logPoints.map((p) => p.waterGen))} Gal/d`
                : `+${Math.max(...logPoints.map((p) => p.calories))} kcal/d`}
            </span>
          </div>

          <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-0.5">
            <span className="text-gray-500 uppercase">60M PEAK DEMAND LOAD</span>
            <span className="text-xs font-bold text-[#FF003C]">
              {selectedMetricGroup === 'ENERGY'
                ? `-${Math.max(...logPoints.map((p) => p.powerDraw))} kWh/d`
                : selectedMetricGroup === 'WATER'
                ? `-${Math.max(...logPoints.map((p) => p.waterDraw))} Gal/d`
                : `${metrics.totalMethane} m³/d CH4`}
            </span>
          </div>

          <div className="p-2.5 bg-black border border-[#222] flex flex-col gap-0.5">
            <span className="text-gray-500 uppercase">NET MICROGRID EFFICIENCY</span>
            <span className="text-xs font-bold text-[#E056FD] flex items-center gap-1">
              <TrendingUp size={12} />
              <span>{metrics.sustainabilityScore}% RATING</span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#333] pt-3 flex items-center justify-between">
          <span className="text-[10px] text-gray-500">
            PROCEED WITH SPATIAL EXPANSION // TELEMETRY BUFFER ACTIVE
          </span>
          <Button variant="primary" onClick={() => setLogPanelOpen(false)}>
            Close Telemetry Log
          </Button>
        </div>
      </div>
    </div>
  );
};
