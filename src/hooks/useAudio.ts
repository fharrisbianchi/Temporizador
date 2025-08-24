import { useRef, useCallback } from 'react';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playBeep = useCallback((frequency: number = 800, duration: number = 200, volume: number = 0.1) => {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  }, [initAudioContext]);

  const playCompletionSound = useCallback((volume: number = 0.1) => {
    playBeep(800, 300, volume);
    setTimeout(() => playBeep(1000, 300, volume), 400);
    setTimeout(() => playBeep(800, 300, volume), 800);
  }, [playBeep]);

  const playClickSound = useCallback((volume: number = 0.05) => {
    playBeep(600, 100, volume);
  }, [playBeep]);

  const playWarningSound = useCallback((volume: number = 0.08) => {
    playBeep(400, 150, volume);
  }, [playBeep]);

  return {
    playBeep,
    playCompletionSound,
    playClickSound,
    playWarningSound
  };
};