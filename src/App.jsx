import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Header from './components/Header';
import { HospitalView } from './components/HospitalView';
import { MobileSimulator } from './components/MobileSimulator';

// Initialize Socket.IO connection
const SOCKET_URL = import.meta.env.VITE_API_URL || window.location.origin;
const socket = io(SOCKET_URL, {
  reconnectionAttempts: 10,
  transports: ['websocket', 'polling']
});

export default function App() {
  const [donors, setDonors] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Selected active donor for mobile simulator view
  const [activeDonorId, setActiveDonorId] = useState('donor-101');

  // Audio synthesizer sound effect generator for alerts
  const playAlertSound = (type = 'EMERGENCY') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'EMERGENCY') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'ACCEPT') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (err) {
      console.log('Audio Context error:', err);
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('⚡ Connected to RapidBlood AI Socket server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Socket server');
      setIsConnected(false);
    });

    socket.on('state:sync', (data) => {
      setDonors(data.donors || []);
      setEmergencies(data.emergencies || []);
      setSystemStats(data.systemStats || null);
    });

    socket.on('donor:response-updated', ({ donor, action }) => {
      if (action === 'ACCEPT') {
        playAlertSound('ACCEPT');
        if (donor && donor.lat && donor.lng) {
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=13.0600,80.2400&destination=${donor.lat},${donor.lng}&travelmode=driving`;
          window.open(mapsUrl, '_blank');
        }
      }
    });

    // Fallback REST fetch on mount
    fetch(`${SOCKET_URL}/api/state`)
      .then(res => res.json())
      .then(data => {
        setDonors(data.donors || []);
        setEmergencies(data.emergencies || []);
        setSystemStats(data.systemStats || null);
      })
      .catch(err => console.error('REST fetch state fallback failed:', err));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('state:sync');
      socket.off('donor:response-updated');
    };
  }, []);

  const handleCreateEmergency = (formData) => {
    playAlertSound('EMERGENCY');
    socket.emit('create:emergency', formData);
  };

  const handleDonorResponse = (responsePayload) => {
    socket.emit('donor:respond', responsePayload);
  };

  const handleTriggerPreset = (presetKey) => {
    playAlertSound('EMERGENCY');
    socket.emit('preset:trigger', { presetKey });
  };

  const handleSelectDonorForSimulator = (donor) => {
    setActiveDonorId(donor.id);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Navigation Header */}
      <Header
        systemStats={systemStats}
        onTriggerPreset={handleTriggerPreset}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        isConnected={isConnected}
      />

      {/* Main Dual View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Hospital Command Center View (7 cols on lg) */}
        <section className="lg:col-span-8 w-full">
          <HospitalView
            emergencies={emergencies}
            donors={donors}
            onCreateEmergency={handleCreateEmergency}
            onSelectDonorForSimulator={handleSelectDonorForSimulator}
          />
        </section>

        {/* Right Panel: Mobile Simulator View (4 cols on lg) */}
        <section className="lg:col-span-4 w-full sticky top-24">
          <MobileSimulator
            donors={donors}
            activeDonorId={activeDonorId}
            setActiveDonorId={setActiveDonorId}
            activeEmergency={emergencies[0]}
            onRespond={handleDonorResponse}
          />
        </section>

      </main>

      {/* Footer System Telemetry Status */}
      <footer className="w-full border-t border-slate-900 bg-[#06090E] py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Antigravity Intelligent Blood Response Engine • Real-time Socket.IO Sync Active</span>
        </div>
        <span className="font-mono text-slate-600">Built for Rapid Blood Emergency Dispatch</span>
      </footer>

    </div>
  );
}
