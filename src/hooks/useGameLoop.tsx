import { useEffect, useRef } from 'react';

export const useGameLoop = (callback: (delta: number) => void, active: boolean = true) => {
  const reqIdRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      prevTimeRef.current = null;
      return;
    }

    const loop = (time: number) => {
      if (prevTimeRef.current !== null) {
        const delta = (time - prevTimeRef.current) / 1000;
        callback(delta);
      }
      prevTimeRef.current = time;
      reqIdRef.current = requestAnimationFrame(loop);
    };

    reqIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, [callback, active]);
};