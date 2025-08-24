import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Plus, Minus } from 'lucide-react';
import { NavigationBar } from './components/NavigationBar';
import { VolumeControl } from './components/VolumeControl';
import { TimerDisplay } from './components/TimerDisplay';
import { PresetTimers } from './components/PresetTimers';
import { useAudio } from './hooks/useAudio';

function App() {
  // Timer state
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // UI state
  const [currentView, setCurrentView] = useState<'timer' | 'settings' | 'home'>('timer');
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['timer']);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { playBeep, playCompletionSound, playClickSound, playWarningSound } = useAudio();

  // Navigation functions
  const handleNavigate = (view: 'timer' | 'settings' | 'home') => {
    setNavigationHistory(prev => [...prev, view]);
    setCurrentView(view);
    playClickSound(isMuted ? 0 : volume / 100 * 0.05);
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      setNavigationHistory(newHistory);
      setCurrentView(newHistory[newHistory.length - 1] as any);
      playClickSound(isMuted ? 0 : volume / 100 * 0.05);
    }
  };

  // Volume functions
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
    playBeep(500, 50, newVolume / 100 * 0.05);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    playClickSound(isMuted ? volume / 100 * 0.05 : 0);
  };

  // Timer functions
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            if (!isMuted) {
              playCompletionSound(volume / 100 * 0.1);
            }
            return 0;
          }
          // Warning beep at 10 seconds
          if (prev === 11 && !isMuted) {
            playWarningSound(volume / 100 * 0.08);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, isMuted, volume, playCompletionSound, playWarningSound]);

  const startTimer = () => {
    if (timeLeft === 0 && (minutes > 0 || seconds > 0)) {
      setTimeLeft(minutes * 60 + seconds);
    }
    setIsRunning(true);
    setIsCompleted(false);
    if (!isMuted) playClickSound(volume / 100 * 0.05);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (!isMuted) playWarningSound(volume / 100 * 0.08);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsCompleted(false);
    if (!isMuted) playWarningSound(volume / 100 * 0.08);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(minutes * 60 + seconds);
    setIsCompleted(false);
    if (!isMuted) playClickSound(volume / 100 * 0.05);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustMinutes = (increment: boolean) => {
    if (!isRunning) {
      setMinutes(prev => Math.max(0, Math.min(59, prev + (increment ? 1 : -1))));
      if (!isMuted) playBeep(500, 50, volume / 100 * 0.05);
    }
  };

  const adjustSeconds = (increment: boolean) => {
    if (!isRunning) {
      setSeconds(prev => Math.max(0, Math.min(59, prev + (increment ? 1 : -1))));
      if (!isMuted) playBeep(500, 50, volume / 100 * 0.05);
    }
  };

  const handlePresetSelect = (presetMinutes: number, presetSeconds: number) => {
    if (!isRunning) {
      setMinutes(presetMinutes);
      setSeconds(presetSeconds);
      setTimeLeft(0);
      setIsCompleted(false);
      if (!isMuted) playClickSound(volume / 100 * 0.05);
    }
  };

  const displayTime = timeLeft > 0 ? formatTime(timeLeft) : formatTime(minutes * 60 + seconds);

  const renderTimerView = () => (
    <>
      <TimerDisplay
        displayTime={displayTime}
        isRunning={isRunning}
        isCompleted={isCompleted}
        timeLeft={timeLeft}
      />

      <PresetTimers onSelectPreset={handlePresetSelect} isRunning={isRunning} />

      {/* Time Adjustment Controls */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="text-center mb-3">
            <div className="text-blue-300 text-sm font-semibold tracking-wide">MINUTES</div>
            <div className="text-2xl font-mono text-white mt-1">{minutes.toString().padStart(2, '0')}</div>
          </div>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => adjustMinutes(false)}
              disabled={isRunning}
              className="w-10 h-10 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => adjustMinutes(true)}
              disabled={isRunning}
              className="w-10 h-10 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="text-center mb-3">
            <div className="text-blue-300 text-sm font-semibold tracking-wide">SECONDS</div>
            <div className="text-2xl font-mono text-white mt-1">{seconds.toString().padStart(2, '0')}</div>
          </div>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => adjustSeconds(false)}
              disabled={isRunning}
              className="w-10 h-10 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => adjustSeconds(true)}
              disabled={isRunning}
              className="w-10 h-10 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          disabled={!isRunning && minutes === 0 && seconds === 0}
          className="w-16 h-16 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95"
        >
          {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>

        <button
          onClick={stopTimer}
          className="w-16 h-16 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95"
        >
          <Square className="w-8 h-8" />
        </button>

        <button
          onClick={resetTimer}
          className="w-16 h-16 bg-gradient-to-b from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95"
        >
          <RotateCcw className="w-8 h-8" />
        </button>
      </div>
    </>
  );

  const renderSettingsView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-6 border border-gray-600">
        <h3 className="text-blue-300 text-lg font-semibold mb-4 tracking-wide">AUDIO SETTINGS</h3>
        <VolumeControl
          volume={volume}
          onVolumeChange={handleVolumeChange}
          onMute={handleMute}
          isMuted={isMuted}
        />
      </div>

      <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-6 border border-gray-600">
        <h3 className="text-blue-300 text-lg font-semibold mb-4 tracking-wide">SYSTEM INFO</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Model:</span>
            <span className="font-mono">DIGITAL-TIMER-2024</span>
          </div>
          <div className="flex justify-between">
            <span>Version:</span>
            <span className="font-mono">v2.1.0</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-400">● ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHomeView = () => (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-8 border border-gray-600">
        <h2 className="text-3xl font-bold text-white mb-4">DIGITAL TIMER</h2>
        <p className="text-gray-300 mb-6">Advanced automotive-style timer system</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleNavigate('timer')}
            className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-lg p-4 shadow-lg transition-all duration-150 active:scale-95"
          >
            <div className="text-lg font-semibold">TIMER</div>
            <div className="text-sm opacity-80">Set countdown timer</div>
          </button>
          
          <button
            onClick={() => handleNavigate('settings')}
            className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-lg p-4 shadow-lg transition-all duration-150 active:scale-95"
          >
            <div className="text-lg font-semibold">SETTINGS</div>
            <div className="text-sm opacity-80">Audio & system</div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Radio Frame */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
          
          <NavigationBar
            currentView={currentView}
            onNavigate={handleNavigate}
            onBack={handleBack}
          />

          {/* Main Content */}
          {currentView === 'timer' && renderTimerView()}
          {currentView === 'settings' && renderSettingsView()}
          {currentView === 'home' && renderHomeView()}

          {/* Volume Control - Always visible */}
          <VolumeControl
            volume={volume}
            onVolumeChange={handleVolumeChange}
            onMute={handleMute}
            isMuted={isMuted}
          />

          {/* Bottom Status Bar */}
          <div className="mt-6 pt-4 border-t border-gray-600 flex justify-between items-center text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>SYSTEM READY</span>
            </div>
            <div className="font-mono">DIGITAL-TIMER</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;