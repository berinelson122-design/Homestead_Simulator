import React from 'react';

export const Watermark: React.FC = () => {
  return (
    <div className="fixed bottom-24 lg:bottom-3 right-3 sm:right-4 flex flex-col items-end pointer-events-none z-[1000] opacity-40">
      <span className="text-[9px] sm:text-[10px] text-[#E056FD] font-bold tracking-tighter font-mono">
        ARCHITECT // VOID_WEAVER
      </span>
      <span className="text-[7px] sm:text-[8px] text-white opacity-50 tracking-widest font-mono">
        HOMESTEAD 3D SIMULATOR v1.0
      </span>
    </div>
  );
};