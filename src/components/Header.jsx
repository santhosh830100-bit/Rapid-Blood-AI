import React from 'react';
import { ShieldAlert, Users, RefreshCw, Volume2, VolumeX, MapPin, Search } from 'lucide-react';

export default function Header({ 
  systemStats, 
  onTriggerPreset, 
  soundEnabled, 
  setSoundEnabled,
  isConnected 
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#050C0A]/95 border-b border-emerald-500/20 px-4 lg:px-8 py-3.5 backdrop-blur-md shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Brand Logo matching reference navbar */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <span className="font-extrabold text-lg">R</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                  RapidBlood <span className="text-emerald-400">AI</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 rounded-full">
                  AI DISPATCH
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Emergency Blood Response Coordinator</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A1813] border border-emerald-500/30 text-xs font-mono text-emerald-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>Chennai, IN</span>
          </div>
        </div>

        {/* Action Preset Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end overflow-x-auto">
          <button
            onClick={() => onTriggerPreset('MASS_CASUALTY')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-500/40 transition-all shadow-md"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Mass Casualty Preset</span>
          </button>

          <button
            onClick={() => onTriggerPreset('SWARM_50')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A1813] hover:bg-[#0E221B] text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulate Donors</span>
          </button>

          <button
            onClick={() => onTriggerPreset('RESET')}
            className="p-2 rounded-xl bg-[#0A1813] hover:bg-[#0E221B] text-slate-400 border border-slate-700 transition-all"
            title="Reset State"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled 
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' 
                : 'bg-[#0A1813] text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Disable Alert Sound' : 'Enable Alert Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}
