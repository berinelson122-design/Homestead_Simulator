import React from 'react';
import { useUniversalInput } from './hooks/useUniversalInput';
import { Navbar } from './components/layout/Navbar';
import { Scanlines } from './components/layout/Scanlines';
import { Watermark } from './components/layout/Watermark';
import { ObjectPalette } from './components/viewport/ObjectPalette';
import { Viewport3D } from './components/viewport/Viewport3D';
import { TelemetryPanel } from './components/simulation/TelemetryPanel';
import { StressTestModal } from './components/simulation/StressTestModal';
import { ControlSettings } from './components/UI/ControlSettings';
import { VirtualJoystick } from './components/UI/VirtualJoystick';

export const App: React.FC = () => {
  useUniversalInput();

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-mono flex flex-col select-none">
      <Scanlines />
      <Navbar />

      <main className="flex-1 flex overflow-hidden relative">
        <ObjectPalette />
        <Viewport3D />
        <TelemetryPanel />
      </main>

      <StressTestModal />
      <VirtualJoystick />
      
      <div className="fixed bottom-4 left-4 z-40 hidden lg:block">
        <ControlSettings />
      </div>

      <Watermark />
    </div>
  );
};

export default App;