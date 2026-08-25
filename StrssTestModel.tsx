import React from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { Button } from '../common/Button';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export const StressTestModal: React.FC = () => {
  const { stressResult, isModalOpen, closeModal } = useHomesteadStore();

  if (!isModalOpen || !stressResult) return null;

  const passed = stressResult.failureDay === null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 font-mono select-none">
      <div className="max-w-xl w-full border-2 border-[#E056FD] bg-[#0a0010] p-6 shadow-[0_0_40px_rgba(224,86,253,0.3)] flex flex-col gap-4">
        <div className="flex justify-between items-start border-b border-[#E056FD]/30 pb-3">
          <div className="flex items-center gap-2">
            {passed ? (
              <CheckCircle2 className="text-[#39FF14]" size={20} />
            ) : (
              <ShieldAlert className="text-[#FF003C]" size={20} />
            )}
            <h2 className="text-lg font-black text-white uppercase tracking-wider">
              {stressResult.scenarioName} // STRESS SIMULATION
            </h2>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 border ${passed ? 'border-[#39FF14] text-[#39FF14]' : 'border-[#FF003C] text-[#FF003C]'}`}>
            {passed ? 'SYSTEM STABLE' : 'CRITICAL BREACH'}
          </span>
        </div>

        <div className="text-xs">
          <span className="text-gray-500 uppercase">IDENTIFIED BOTTLENECK:</span>
          <p className="text-sm font-bold text-white mt-0.5">{stressResult.bottleneck}</p>
        </div>

        {/* DAY BY DAY RUNTIME LOG */}
        <div className="h-44 bg-black border border-[#333] p-3 overflow-y-auto text-xs text-gray-300 flex flex-col gap-1.5">
          {stressResult.log.map((entry, idx) => (
            <div key={idx} className="border-b border-white/5 pb-1">
              <span className="text-[#E056FD] mr-1">&gt;</span>
              {entry}
            </div>
          ))}
        </div>

        <Button variant="primary" onClick={closeModal} className="w-full py-3 mt-2">
          Acknowledge Telemetry
        </Button>
      </div>
    </div>
  );
};