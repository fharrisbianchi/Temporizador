import React from 'react';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  isMuted: boolean;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  onMute,
  isMuted
}) => {
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 30) return <Volume className="w-5 h-5" />;
    if (volume < 70) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  return (
    <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-3 border border-gray-600">
      <button
        onClick={onMute}
        className="w-10 h-10 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95"
      >
        {getVolumeIcon()}
      </button>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-blue-300 text-xs font-semibold">VOL</span>
          <span className="text-white text-sm font-mono">{isMuted ? '00' : volume.toString().padStart(2, '0')}</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${isMuted ? 0 : volume}%, #4b5563 ${isMuted ? 0 : volume}%, #4b5563 100%)`
          }}
        />
        
        <div className="flex justify-between mt-1">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-2 rounded-full ${
                !isMuted && volume > i * 10 ? 'bg-blue-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};