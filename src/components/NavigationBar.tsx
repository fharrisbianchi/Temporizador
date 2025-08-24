import React from 'react';
import { ArrowLeft, Home, Settings, Clock } from 'lucide-react';

interface NavigationBarProps {
  currentView: 'timer' | 'settings' | 'home';
  onNavigate: (view: 'timer' | 'settings' | 'home') => void;
  onBack: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentView,
  onNavigate,
  onBack
}) => {
  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-600">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
          <span className="text-green-400 text-sm font-mono tracking-wider">
            {currentView === 'timer' ? 'TIMER MODE' : 
             currentView === 'settings' ? 'SETTINGS' : 'HOME'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onNavigate('home')}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 ${
            currentView === 'home' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          <Home className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onNavigate('timer')}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 ${
            currentView === 'timer' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          <Clock className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onNavigate('settings')}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 ${
            currentView === 'settings' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};