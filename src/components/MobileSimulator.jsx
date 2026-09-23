import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Bell, CheckCircle, Navigation, 
  Clock, ShieldCheck, User, Check, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function MobileSimulator({ 
  donors, 
  activeDonorId, 
  setActiveDonorId, 
  activeEmergency, 
  onRespond 
}) {
  const activeDonor = donors.find(d => d.id === activeDonorId) || donors[0] || null;
  const [showScreening, setShowScreening] = useState(false);
  
  const [screeningAnswers, setScreeningAnswers] = useState({
    donatedIn56Days: false,
    feelingWell: true,
    canReachInTime: true
  });

  const [etaTimer, setEtaTimer] = useState(activeDonor?.etaMins || 7);

  useEffect(() => {
    if (activeDonor) {
      setEtaTimer(activeDonor.etaMins || 7);
    }
  }, [activeDonorId, activeDonor]);

  const handleAcceptClick = () => {
    setShowScreening(true);
  };

  const handleOpenDirections = () => {
    if (!activeDonor) return;
    const lat = activeDonor.lat || 13.0650;
    const lng = activeDonor.lng || 80.2450;
    window.open(`https://www.google.com/maps/dir/?api=1&origin=13.0600,80.2400&destination=${lat},${lng}&travelmode=driving`, '_blank');
  };

  const handleFinalSubmitAccept = () => {
    setShowScreening(false);
    
    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch (e) {
      console.log(e);
    }

    handleOpenDirections();

    onRespond({
      donorId: activeDonor.id,
      action: 'ACCEPT',
      emergencyId: activeEmergency?.id,
      screening: screeningAnswers
    });
  };

  const handleDecline = () => {
    onRespond({
      donorId: activeDonor.id,
      action: 'DECLINE',
      emergencyId: activeEmergency?.id
    });
  };

  const isAccepted = activeDonor?.status === 'ACCEPTED';
  const isDeclined = activeDonor?.status === 'DECLINED';
  const matchPct = activeDonor?.matchResult?.scorePct || 96.2;

  return (
    <div className="flex flex-col items-center justify-start w-full h-full">
      
      {/* Device Header Selector */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Smartphone className="w-4 h-4 text-sky-400" />
          <span>VOLUNTEER DEVICE</span>
        </div>

        <select
          value={activeDonorId}
          onChange={(e) => setActiveDonorId(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-sky-400 max-w-[200px] truncate"
        >
          {donors.map(d => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.bloodGroup}) - {d.status}
            </option>
          ))}
        </select>
      </div>

      {/* Smartphone Frame */}
      <div className="relative w-full max-w-sm h-[700px] rounded-[36px] medical-phone p-3 flex flex-col justify-between shadow-2xl border-4 border-slate-800 overflow-hidden">
        
        {/* Top Notch & Status Bar */}
        <div className="relative z-30 pt-1 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>9:41 AM</span>
          <div className="w-20 h-3.5 bg-slate-950 rounded-full border border-slate-800" />
          <span>5G</span>
        </div>

        {/* Screen Content */}
        <div className="relative z-20 flex-1 my-3 overflow-y-auto px-1 flex flex-col justify-between">
          
          {activeDonor ? (
            <div className="space-y-3.5">
              
              {/* Volunteer Profile Header */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {activeDonor.avatar ? (
                      <img src={activeDonor.avatar} alt={activeDonor.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{activeDonor.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <span className="text-rose-400 font-bold">{activeDonor.bloodGroup}</span>
                      <span>•</span>
                      <span>{activeDonor.totalDonations} Donations</span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[9px] text-slate-400 block">REST WINDOW</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {activeDonor.daysSinceLastDonation}d Clear
                  </span>
                </div>
              </div>

              {/* Main Alert View */}
              {isAccepted ? (
                /* ACCEPTED DISPATCH VIEW */
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 shadow space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-5 h-5" />
                  </div>

                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 inline-block mb-1">
                      DISPATCH CONFIRMED & EN ROUTE
                    </span>
                    <h4 className="text-sm font-bold text-white">Responder Dispatched</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      City General ER medical team logged your ETA.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-around font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block">ESTIMATED ETA</span>
                      <span className="text-lg font-bold text-emerald-400">{etaTimer} MINS</span>
                    </div>
                    <div className="h-6 w-px bg-slate-800" />
                    <div>
                      <span className="text-[9px] text-slate-400 block">DISTANCE</span>
                      <span className="text-lg font-bold text-sky-400">{activeDonor.distanceKm || 1.2} KM</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-left space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>PASS ID:</span>
                      <span className="text-rose-400 font-bold">#PASS-8891</span>
                    </div>
                    <p className="text-slate-300 font-sans">City General ER Priority Entrance</p>
                  </div>

                  <button
                    onClick={handleOpenDirections}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>OPEN GOOGLE MAPS NAVIGATION</span>
                  </button>

                  <button
                    onClick={handleDecline}
                    className="text-xs text-slate-400 hover:text-slate-200 underline pt-1 block mx-auto"
                  >
                    Cancel Dispatch Response
                  </button>
                </div>
              ) : isDeclined ? (
                /* DECLINED STATE */
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <X className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Request Declined</h4>
                  <p className="text-[11px] text-slate-400">
                    System re-allocated dispatch to next candidate.
                  </p>
                  <button
                    onClick={handleAcceptClick}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
                  >
                    Change to Accept
                  </button>
                </div>
              ) : (
                /* INCOMING ALERT CARD */
                <div className="p-4 rounded-xl medical-card-active border border-rose-500/40 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-500/40">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        EMERGENCY BLOOD REQUEST
                      </h4>
                      <p className="text-[11px] text-slate-400">City General Trauma Center</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block">AI MATCH SCORE</span>
                      <span className="text-base font-bold text-sky-400">{matchPct}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block">TYPE NEEDED</span>
                      <span className="text-base font-bold text-rose-400">
                        {activeEmergency?.bloodGroup || activeDonor.bloodGroup}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[9px] block">ESTIMATED ETA</span>
                      <span className="font-bold text-white flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-sky-400" />
                        {activeDonor.etaMins || 7} mins
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[9px] block">DISTANCE</span>
                      <span className="font-bold text-white flex items-center justify-center gap-1">
                        <Navigation className="w-3 h-3 text-rose-400" />
                        {activeDonor.distanceKm || 1.2} km
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-200">
                    <p className="font-bold">Patient: {activeEmergency?.patientId || "PAT-9942 (ICU Ward B)"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleDecline}
                      className="py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700"
                    >
                      Decline
                    </button>

                    <button
                      onClick={handleAcceptClick}
                      className="py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1 border border-emerald-400/40"
                    >
                      <Check className="w-4 h-4" />
                      ACCEPT DISPATCH
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              No donor profile selected.
            </div>
          )}

        </div>

        <div className="relative z-30 pb-1 flex justify-center">
          <div className="w-24 h-1 bg-slate-700 rounded-full" />
        </div>

      </div>

      {/* Pre-Screening Questionnaire Modal */}
      {showScreening && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="medical-card max-w-sm w-full rounded-xl p-5 border border-slate-700 text-slate-200">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-700 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Donor Medical Pre-Screening</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <p className="font-semibold mb-1.5 text-slate-300">1. Donated blood in the last 56 days?</p>
                <div className="flex gap-2 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setScreeningAnswers({ ...screeningAnswers, donatedIn56Days: false })}
                    className={`flex-1 py-1 rounded border font-bold ${!screeningAnswers.donatedIn56Days ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                  >
                    NO (Cleared)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreeningAnswers({ ...screeningAnswers, donatedIn56Days: true })}
                    className={`flex-1 py-1 rounded border font-bold ${screeningAnswers.donatedIn56Days ? 'bg-rose-950 text-rose-400 border-rose-500/50' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                  >
                    YES
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <p className="font-semibold mb-1.5 text-slate-300">2. Feeling healthy and symptom-free?</p>
                <div className="flex gap-2 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setScreeningAnswers({ ...screeningAnswers, feelingWell: true })}
                    className={`flex-1 py-1 rounded border font-bold ${screeningAnswers.feelingWell ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                  >
                    YES (Healthy)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreeningAnswers({ ...screeningAnswers, feelingWell: false })}
                    className={`flex-1 py-1 rounded border font-bold ${!screeningAnswers.feelingWell ? 'bg-rose-950 text-rose-400 border-rose-500/50' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                  >
                    NO
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowScreening(false)}
                className="w-1/3 py-2 rounded bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmitAccept}
                className="w-2/3 py-2 rounded bg-emerald-600 text-white font-bold text-xs shadow border border-emerald-400/40"
              >
                CONFIRM DISPATCH
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
