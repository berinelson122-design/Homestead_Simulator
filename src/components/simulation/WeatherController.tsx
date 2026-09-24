import React, { useEffect } from 'react';
import { useWeatherStore } from '../../store/useWeatherStore';
import { WeatherType } from '../../types';
import { Sun, CloudRain, Snowflake, Zap, Wind, Thermometer, RefreshCw } from 'lucide-react';

interface WeatherOption {
  type: WeatherType;
  label: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}

const WEATHER_OPTIONS: WeatherOption[] = [
  {
    type: 'CLEAR',
    label: 'CLEAR',
    sub: '100% NOMINAL',
    icon: <Sun size={13} />,
    color: '#00F3FF',
  },
  {
    type: 'RAIN',
    label: 'DOWNPOUR',
    sub: '+35% WATER / -30% SOLAR',
    icon: <CloudRain size={13} />,
    color: '#00A8FF',
  },
  {
    type: 'SNOW',
    label: 'BLIZZARD',
    sub: '-50% SOLAR / +4 kWh HEAT',
    icon: <Snowflake size={13} />,
    color: '#E0E8FF',
  },
  {
    type: 'ACID_STORM',
    label: 'ACID STORM',
    sub: '+0.8m³ CH4 / HIGH WEAR',
    icon: <Zap size={13} />,
    color: '#FF003C',
  },
];

export const WeatherController: React.FC = () => {
  const {
    current,
    setWeather,
    cycleNextWeather,
    windSpeed,
    temperatureC,
    autoCycle,
    toggleAutoCycle,
    cycleIntervalSec,
  } = useWeatherStore();

  // Auto-cycle effect
  useEffect(() => {
    if (!autoCycle) return;
    const interval = setInterval(() => {
      cycleNextWeather();
    }, cycleIntervalSec * 1000);
    return () => clearInterval(interval);
  }, [autoCycle, cycleIntervalSec, cycleNextWeather]);

  return (
    <div className="border border-[#333] bg-[#050505]/95 backdrop-blur-md p-3 font-mono text-xs shadow-[0_0_15px_rgba(0,0,0,0.8)] flex flex-col gap-2.5">
      {/* Header & Live Sensors */}
      <div className="flex items-center justify-between border-b border-[#222] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#E056FD] animate-pulse" />
          <span className="text-[10px] font-bold text-[#E056FD] tracking-widest uppercase">
            ATMOSPHERIC SIMULATOR
          </span>
        </div>
        <button
          onClick={toggleAutoCycle}
          title="Toggle Auto Weather Rotation"
          className={`flex items-center gap-1 text-[9px] px-2 py-0.5 border transition-all ${
            autoCycle
              ? 'border-[#39FF14] text-[#39FF14] bg-[#39FF14]/10'
              : 'border-[#444] text-gray-400 hover:border-[#E056FD]'
          }`}
        >
          <RefreshCw size={10} className={autoCycle ? 'animate-spin' : ''} />
          <span>AUTO-CYCLE {autoCycle ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Environmental Telemetry */}
      <div className="grid grid-cols-2 gap-2 text-[10px] bg-black p-2 border border-[#222]">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Thermometer size={12} className="text-[#FF003C]" />
          <span>TEMP:</span>
          <span className={`font-bold ${temperatureC <= 0 ? 'text-[#00F3FF]' : 'text-white'}`}>
            {temperatureC > 0 ? `+${temperatureC}` : temperatureC}°C
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <Wind size={12} className="text-[#00F3FF]" />
          <span>WIND:</span>
          <span className="font-bold text-white">{windSpeed} km/h</span>
        </div>
      </div>

      {/* Weather Selector Grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {WEATHER_OPTIONS.map((opt) => {
          const isActive = current === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => setWeather(opt.type)}
              className={`flex flex-col p-2 text-left border transition-all cursor-pointer ${
                isActive
                  ? 'border-[#FF003C] bg-[#FF003C]/10 text-white shadow-[0_0_10px_rgba(255,0,60,0.25)]'
                  : 'border-[#222] bg-black text-gray-400 hover:border-[#E056FD] hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={isActive ? 'text-[#FF003C]' : 'text-[#E056FD]'}>
                  {opt.icon}
                </span>
                <span className="text-[9px] font-black tracking-wider">{opt.label}</span>
              </div>
              <span className="text-[8px] text-gray-500 truncate leading-tight">
                {opt.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
