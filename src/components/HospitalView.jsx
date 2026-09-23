import React, { useState } from 'react';
import { 
  PlusCircle, Search, Clock, MapPin, CheckCircle2, 
  XCircle, Send, Award, Info, HeartHandshake, Filter, Navigation
} from 'lucide-react';
import { RealMap } from './RealMap';

const BLOOD_GROUPS = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export function HospitalView({ 
  emergencies, 
  donors, 
  onCreateEmergency, 
  onSelectDonorForSimulator 
}) {
  const [bloodGroup, setBloodGroup] = useState('O-');
  const [unitsRequired, setUnitsRequired] = useState(3);
  const [urgencyLevel, setUrgencyLevel] = useState('CRITICAL');
  const [patientId, setPatientId] = useState('PAT-9942 (Apollo Chennai)');

  const activeEmergency = emergencies[0] || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateEmergency({
      bloodGroup,
      unitsRequired,
      urgencyLevel,
      patientId
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* 1. Header Banner & Search Intake Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Form: Search & Intake Panel (Matching Reference Form Style) */}
        <div className="xl:col-span-5 parkwise-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-emerald-500/20 pb-3">
              <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Emergency Search & Intake</h2>
                <p className="text-xs text-slate-400">Configure dispatch parameters</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Blood Group Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Blood Group Required
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => {
                    const isSelected = bloodGroup === bg;
                    return (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setBloodGroup(bg)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold' 
                            : 'bg-[#07130F] hover:bg-[#0E221B] text-slate-300 border border-emerald-500/20'
                        }`}
                      >
                        {bg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Units & Urgency inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Units Needed
                  </label>
                  <div className="flex items-center rounded-xl bg-[#07130F] border border-emerald-500/25 p-1">
                    <button
                      type="button"
                      onClick={() => setUnitsRequired(Math.max(1, unitsRequired - 1))}
                      className="w-8 h-8 rounded-lg bg-[#0E221B] hover:bg-[#142E25] text-slate-200 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-mono font-bold text-sm text-emerald-400">
                      {unitsRequired} <span className="text-[10px] text-slate-400 font-normal">Units</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setUnitsRequired(Math.min(20, unitsRequired + 1))}
                      className="w-8 h-8 rounded-lg bg-[#0E221B] hover:bg-[#142E25] text-slate-200 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Urgency Classification
                  </label>
                  <select
                    value={urgencyLevel}
                    onChange={(e) => setUrgencyLevel(e.target.value)}
                    className="w-full h-10 rounded-xl parkwise-input px-3 text-xs font-bold text-slate-200"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate)</option>
                    <option value="HIGH">HIGH (Under 30m)</option>
                    <option value="NORMAL">NORMAL (Scheduled)</option>
                  </select>
                </div>
              </div>

              {/* Patient ID */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Patient Ward Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="e.g. PAT-9942 (T Nagar ER)"
                    className="w-full h-10 rounded-xl parkwise-input pl-9 pr-3 text-xs text-slate-200 font-mono"
                  />
                  <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Full Width Green Action Button matching screenshot */}
              <button
                type="submit"
                className="w-full py-3 parkwise-btn text-xs tracking-wide shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                <Search className="w-4 h-4" />
                <span>FIND & DISPATCH MATCHES</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Map Canvas Panel matching layout from reference screenshot */}
        <div className="xl:col-span-7 parkwise-card p-4 flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h2 className="text-xl font-extrabold text-white">Find Nearby Donors</h2>
              <p className="text-xs text-slate-400">Explore active blood donors on the interactive map</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              Chennai Region
            </span>
          </div>

          <div className="flex-1 w-full rounded-2xl overflow-hidden relative">
            <RealMap
              donors={donors}
              activeEmergency={activeEmergency}
              onSelectDonor={onSelectDonorForSimulator}
            />
          </div>
        </div>

      </div>

      {/* 2. Candidate Cards List matching "Parking Locations (15)" from screenshot */}
      <div className="parkwise-card p-6">
        <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white">
              Matched Donors Pool ({donors.length})
            </h3>
            <p className="text-xs text-slate-400">Ranked by Antigravity AI Match Engine (Proximity, Reliability & Rest Window)</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              Available
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#07130F] text-slate-300 border border-slate-700">
              Eligible (56+ days rest)
            </span>
          </div>
        </div>

        {/* Grid list of candidate cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {donors.map((donor, idx) => {
            const match = donor.matchResult || { scorePct: 92, eligible: donor.daysSinceLastDonation >= 56 };
            const isAccepted = donor.status === 'ACCEPTED';
            const isNotified = donor.status === 'NOTIFIED';
            const isIneligible = !match.eligible;

            return (
              <div
                key={donor.id}
                onClick={() => onSelectDonorForSimulator && onSelectDonorForSimulator(donor)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isAccepted
                    ? 'bg-emerald-950/60 border-emerald-500/70 shadow-lg'
                    : isNotified
                    ? 'bg-amber-950/40 border-amber-500/50 hover:border-amber-400'
                    : isIneligible
                    ? 'bg-[#07130F]/40 border-slate-800 opacity-40'
                    : 'bg-[#07130F] border-emerald-500/20 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0E221B] text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                      #{idx + 1}
                    </span>
                    <span className="font-extrabold text-sm text-white">{donor.name}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-lg text-xs font-extrabold bg-emerald-500 text-slate-950">
                    {donor.bloodGroup}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Distance:</span>
                    <span className="font-bold text-white">{donor.distanceKm || 2.1} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Arrival ETA:</span>
                    <span className="font-bold text-emerald-400">~{donor.etaMins || 6} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rest Window:</span>
                    <span className="font-bold text-slate-200">{donor.daysSinceLastDonation} days clear</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20 text-xs">
                  <span className="font-mono text-emerald-400 font-bold">
                    AI SCORE: {isIneligible ? '0.0%' : `${match.scorePct || 92}%`}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isAccepted
                      ? 'bg-emerald-500 text-slate-950'
                      : isNotified
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-[#0E221B] text-slate-400'
                  }`}>
                    {donor.status}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const lat = donor.lat || 13.0650;
                    const lng = donor.lng || 80.2450;
                    window.open(`https://www.google.com/maps/dir/?api=1&origin=13.0600,80.2400&destination=${lat},${lng}&travelmode=driving`, '_blank');
                  }}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all mt-1 ${
                    isAccepted
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-md'
                      : 'bg-[#0E221B] hover:bg-[#153328] text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5 text-current" />
                  <span>{isAccepted ? '🗺️ OPEN GOOGLE MAPS DIRECTIONS' : 'Directions on Google Maps'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
