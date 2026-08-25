/* NEW CODE ADDITIONS START: DEVICE CONTROLS */
import React from 'react';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { Button } from '../common/Button';
import { Sun, Battery, Sprout, Flame } from 'lucide-react';

export const VirtualJoystick: React.FC = () => {
  const { setSelectedTool } = useHomesteadStore();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 pointer-events-auto md:hidden font-mono select-none">
      <Button variant="secondary" onClick={() => setSelectedTool('SOLAR-ARRAY')}>
        <Sun size={14} />
      </Button>
      <Button variant="secondary" onClick={() => setSelectedTool('BATTERY-BANK')}>
        <Battery size={14} />
      </Button>
      <Button variant="secondary" onClick={() => setSelectedTool('RAISED-BED')}>
        <Sprout size={14} />
      </Button>
      <Button variant="secondary" onClick={() => setSelectedTool('METHANE-DIGESTER')}>
        <Flame size={14} />
      </Button>
    </div>
  );
};
/* NEW CODE ADDITIONS END: DEVICE CONTROLS */