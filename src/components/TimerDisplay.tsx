import React from 'react';

interface TimerDisplayProps {
  displayTime: string;
  isRunning: boolean;
  isCompleted: boolean;
  timeLeft: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  displayTime,
  isRunning,
  isCompleted,
  timeLeft
}) => {
  return (
    <div className={`bg-black rounded-lg p-8 mb-8 border-2 ${
      isCompleted ? 'border-red-500 animate-pulse' : 'border-gray-600'
    } shadow-inner relative overflow-hidden`}>
      
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse"></div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-green-400/10"
            style={{ top: `${12.5 * (i + 1)}%` }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        <div className={`text-6xl md:text-7xl font-mono tracking-wider mb-4 transition-all duration-300 ${
          isCompleted ? 'text-red-400 animate-pulse' : 
          timeLeft > 0 && timeLeft <= 10 ? 'text-yellow-400 animate-pulse' : 'text-green-400'
        } drop-shadow-2xl`}
        style={{
          textShadow: isCompleted 
            ? '0 0 20px #ef4444, 0 0 40px #ef4444' 
            : timeLeft > 0 && timeLeft <= 10
            ? '0 0 20px #facc15, 0 0 40px #facc15'
            : '0 0 20px #22c55e, 0 0 40px #22c55e'
        }}>
          {displayTime}
        </div>
        
        <div className="flex justify-center items-center space-x-4 text-sm">
          <div className={`px-3 py-1 rounded-full transition-all duration-300 ${
            isRunning ? 'bg-green-900 text-green-300 animate-pulse' : 'bg-gray-700 text-gray-400'
          }`}>
            {isRunning ? '● RUNNING' : '○ STOPPED'}
          </div>
          
          <div className="text-blue-300 font-mono tracking-wider">DIGITAL TIMER</div>
          
          {isCompleted && (
            <div className="bg-red-900 text-red-300 px-3 py-1 rounded-full animate-pulse">
              ⚠ TIME'S UP!
            </div>
          )}
        </div>

        {/* Progress bar */}
        {timeLeft > 0 && (
          <div className="mt-4 w-full bg-gray-800 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-1000 ease-linear"
              style={{ 
                width: `${((timeLeft / (timeLeft + 1)) * 100)}%`,
                boxShadow: '0 0 10px currentColor'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};