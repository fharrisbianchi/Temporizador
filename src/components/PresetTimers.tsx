import React from 'react';
import { Clock, Coffee, Utensils, Dumbbell, Moon } from 'lucide-react';

interface PresetTimersProps {
  onSelectPreset: (minutes: number, seconds: number) => void;
  isRunning: boolean;
}

export const PresetTimers: React.FC<PresetTimersProps> = ({ onSelectPreset, isRunning }) => {
  const presets = [
    { icon: Coffee, label: 'COFFEE', minutes: 3, seconds: 0, color: 'from-amber-500 to-amber-600' },
    { icon: Utensils, label: 'COOKING', minutes: 15, seconds: 0, color: 'from-orange-500 to-orange-600' },
    { icon: Dumbbell, label: 'WORKOUT', minutes: 1, seconds: 30, color: 'from-red-500 to-red-600' },
    { icon: Moon, label: 'POWER NAP', minutes: 20, seconds: 0, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {presets.map((preset, index) => {
        const Icon = preset.icon;
        return (
          <button
            key={index}
            onClick={() => onSelectPreset(preset.minutes, preset.seconds)}
            disabled={isRunning}
            className={`bg-gradient-to-b ${preset.color} hover:opacity-90 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-white rounded-lg p-3 flex flex-col items-center space-y-2 shadow-lg transition-all duration-150 active:scale-95`}
          >
            <Icon className="w-6 h-6" />
            <div className="text-center">
              <div className="text-xs font-semibold">{preset.label}</div>
              <div className="text-xs opacity-80">
                {preset.minutes}:{preset.seconds.toString().padStart(2, '0')}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};