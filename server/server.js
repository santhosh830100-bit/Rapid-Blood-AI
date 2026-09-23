import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialDonors } from './mock_donors.js';
import { rankAndDispatchDonors, calculateHaversineDistance, calculateDrivingEta } from './ai_engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static assets from Vite dist folder in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Chennai Hospital HQ Coordinates
const CHENNAI_HOSPITAL_COORDS = { lat: 13.0600, lng: 80.2400 };

// Initialize donor list with computed distanceKm and etaMins
let donors = initialDonors.map(d => {
  const distanceKm = calculateHaversineDistance(d.lat, d.lng, CHENNAI_HOSPITAL_COORDS.lat, CHENNAI_HOSPITAL_COORDS.lng);
  const etaMins = calculateDrivingEta(distanceKm);
  return {
    ...d,
    distanceKm,
    etaMins
  };
});

let emergencies = [
  {
    id: "EMG-7082",
    bloodGroup: "O-",
    unitsRequired: 4,
    unitsConfirmed: 1,
    urgencyLevel: "CRITICAL",
    patientId: "PAT-9942 (Apollo Chennai ICU)",
    hospitalName: "Apollo ER Trauma Hub (Chennai)",
    createdAt: new Date().toISOString(),
    status: "DISPATCHED",
    targetEtaMins: 12,
    notifiedCount: 18,
    matchedDonors: []
  }
];

function initializeEmergencyMatches() {
  emergencies.forEach(emg => {
    const { dispatchedCandidates } = rankAndDispatchDonors(donors, emg, CHENNAI_HOSPITAL_COORDS);
    emg.matchedDonors = dispatchedCandidates;
    dispatchedCandidates.forEach(cand => {
      const donorRef = donors.find(d => d.id === cand.id);
      if (donorRef && donorRef.status === 'AVAILABLE') {
        donorRef.status = 'NOTIFIED';
      }
    });
  });
}

initializeEmergencyMatches();

function broadcastState() {
  io.emit('state:sync', {
    donors,
    emergencies,
    systemStats: getSystemStats()
  });
}

function getSystemStats() {
  const activeEmg = emergencies.filter(e => e.status !== 'FULFILLED');
  const confirmedUnits = emergencies.reduce((acc, e) => acc + (e.unitsConfirmed || 0), 0);
  const totalUnitsNeeded = emergencies.reduce((acc, e) => acc + (e.unitsRequired || 0), 0);
  const activeNotified = donors.filter(d => d.status === 'NOTIFIED').length;
  const activeAccepted = donors.filter(d => d.status === 'ACCEPTED').length;

  return {
    activeEmergenciesCount: activeEmg.length,
    totalUnitsNeeded,
    confirmedUnits,
    activeNotified,
    activeAccepted,
    totalDonorsCount: donors.length,
    aiAccuracyScore: '99.4%'
  };
}

// REST Endpoints
app.get('/api/state', (req, res) => {
  res.json({
    donors,
    emergencies,
    systemStats: getSystemStats()
  });
});

app.post('/api/emergencies', (req, res) => {
  const { bloodGroup, unitsRequired, urgencyLevel, patientId, notes } = req.body;

  const newId = `EMG-${Math.floor(1000 + Math.random() * 9000)}`;
  const newEmergency = {
    id: newId,
    bloodGroup: bloodGroup || 'O-',
    unitsRequired: Number(unitsRequired) || 2,
    unitsConfirmed: 0,
    urgencyLevel: urgencyLevel || 'CRITICAL',
    patientId: patientId || `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
    hospitalName: "Apollo ER Trauma Hub (Chennai)",
    createdAt: new Date().toISOString(),
    status: "DISPATCHED",
    targetEtaMins: urgencyLevel === 'CRITICAL' ? 8 : 15,
    notes: notes || 'Urgent blood request triggered'
  };

  const { dispatchedCandidates } = rankAndDispatchDonors(donors, newEmergency, CHENNAI_HOSPITAL_COORDS);
  newEmergency.matchedDonors = dispatchedCandidates;
  newEmergency.notifiedCount = dispatchedCandidates.length;

  dispatchedCandidates.forEach(cand => {
    const donorRef = donors.find(d => d.id === cand.id);
    if (donorRef && donorRef.status === 'AVAILABLE') {
      donorRef.status = 'NOTIFIED';
      donorRef.currentEmergencyId = newId;
    }
  });

  emergencies.unshift(newEmergency);
  broadcastState();

  res.status(201).json({
    success: true,
    emergency: newEmergency,
    matchedCandidatesCount: dispatchedCandidates.length
  });
});

app.post('/api/donors/:id/respond', (req, res) => {
  const { id } = req.params;
  const { action, emergencyId, screening } = req.body;

  const donor = donors.find(d => d.id === id);
  if (!donor) {
    return res.status(404).json({ error: 'Donor not found' });
  }

  const targetEmg = emergencies.find(e => e.id === (emergencyId || donor.currentEmergencyId || emergencies[0]?.id));

  if (action === 'ACCEPT') {
    donor.status = 'ACCEPTED';
    if (targetEmg) {
      targetEmg.unitsConfirmed = (targetEmg.unitsConfirmed || 0) + 1;
      if (targetEmg.unitsConfirmed >= targetEmg.unitsRequired) {
        targetEmg.status = 'FULFILLED';
      } else {
        targetEmg.status = 'PARTIALLY_FULFILLED';
      }
    }
  } else if (action === 'DECLINE') {
    donor.status = 'DECLINED';
  }

  donor.screeningResponse = screening;
  broadcastState();

  res.json({
    success: true,
    donor,
    emergency: targetEmg
  });
});

app.post('/api/presets/:presetKey', (req, res) => {
  const { presetKey } = req.params;

  if (presetKey === 'MASS_CASUALTY') {
    const newEmg = {
      id: `EMG-MASS-${Math.floor(100 + Math.random() * 900)}`,
      bloodGroup: "O-",
      unitsRequired: 12,
      unitsConfirmed: 2,
      urgencyLevel: "CRITICAL",
      patientId: "MASS CASUALTY EVENT - Mount Road Accident ER",
      hospitalName: "Apollo ER Trauma Hub (Chennai)",
      createdAt: new Date().toISOString(),
      status: "DISPATCHED",
      targetEtaMins: 6,
      notifiedCount: 25
    };

    const { dispatchedCandidates } = rankAndDispatchDonors(donors, newEmg, CHENNAI_HOSPITAL_COORDS);
    newEmg.matchedDonors = dispatchedCandidates;

    dispatchedCandidates.forEach(cand => {
      const d = donors.find(x => x.id === cand.id);
      if (d) {
        d.status = 'NOTIFIED';
        d.currentEmergencyId = newEmg.id;
      }
    });

    emergencies.unshift(newEmg);
  } else if (presetKey === 'SWARM_50') {
    // Spawn donors in Chennai
    for (let i = 1; i <= 8; i++) {
      const lat = 13.0600 + (Math.random() - 0.5) * 0.05;
      const lng = 80.2400 + (Math.random() - 0.5) * 0.05;
      const distanceKm = calculateHaversineDistance(lat, lng, CHENNAI_HOSPITAL_COORDS.lat, CHENNAI_HOSPITAL_COORDS.lng);
      const etaMins = calculateDrivingEta(distanceKm);

      donors.push({
        id: `donor-sim-${Date.now()}-${i}`,
        name: `Chennai Donor #${i}`,
        bloodGroup: ['O-', 'O+', 'A+', 'B+'][i % 4],
        phone: `+91 98400 ${1000 + i}`,
        reliabilityScore: 0.95,
        daysSinceLastDonation: 90,
        lat,
        lng,
        distanceKm,
        etaMins,
        status: "NOTIFIED",
        totalDonations: 7,
        gender: i % 2 === 0 ? "Female" : "Male",
        age: 25 + i,
        verifiedMedical: true
      });
    }
  } else if (presetKey === 'RESET') {
    donors = initialDonors.map(d => {
      const distanceKm = calculateHaversineDistance(d.lat, d.lng, CHENNAI_HOSPITAL_COORDS.lat, CHENNAI_HOSPITAL_COORDS.lng);
      const etaMins = calculateDrivingEta(distanceKm);
      return {
        ...d,
        distanceKm,
        etaMins
      };
    });

    emergencies = [];
    const defaultEmg = {
      id: "EMG-7082",
      bloodGroup: "O-",
      unitsRequired: 4,
      unitsConfirmed: 1,
      urgencyLevel: "CRITICAL",
      patientId: "PAT-9942 (Apollo Chennai ICU)",
      hospitalName: "Apollo ER Trauma Hub (Chennai)",
      createdAt: new Date().toISOString(),
      status: "DISPATCHED",
      targetEtaMins: 12,
      notifiedCount: 18
    };
    const { dispatchedCandidates } = rankAndDispatchDonors(donors, defaultEmg, CHENNAI_HOSPITAL_COORDS);
    defaultEmg.matchedDonors = dispatchedCandidates;
    emergencies.push(defaultEmg);
  }

  broadcastState();
  res.json({ success: true, presetKey });
});

// Socket.IO Events
io.on('connection', (socket) => {
  socket.emit('state:sync', {
    donors,
    emergencies,
    systemStats: getSystemStats()
  });

  socket.on('create:emergency', (data) => {
    const newId = `EMG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEmergency = {
      id: newId,
      bloodGroup: data.bloodGroup || 'O-',
      unitsRequired: Number(data.unitsRequired) || 2,
      unitsConfirmed: 0,
      urgencyLevel: data.urgencyLevel || 'CRITICAL',
      patientId: data.patientId || `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalName: "Apollo ER Trauma Hub (Chennai)",
      createdAt: new Date().toISOString(),
      status: "DISPATCHED",
      targetEtaMins: data.urgencyLevel === 'CRITICAL' ? 7 : 12
    };

    const { dispatchedCandidates } = rankAndDispatchDonors(donors, newEmergency, CHENNAI_HOSPITAL_COORDS);
    newEmergency.matchedDonors = dispatchedCandidates;
    newEmergency.notifiedCount = dispatchedCandidates.length;

    dispatchedCandidates.forEach(cand => {
      const d = donors.find(x => x.id === cand.id);
      if (d && d.status === 'AVAILABLE') {
        d.status = 'NOTIFIED';
        d.currentEmergencyId = newId;
      }
    });

    emergencies.unshift(newEmergency);
    broadcastState();
  });

  socket.on('donor:respond', ({ donorId, action, emergencyId, screening }) => {
    const donor = donors.find(d => d.id === donorId);
    if (!donor) return;

    const targetEmg = emergencies.find(e => e.id === (emergencyId || donor.currentEmergencyId || emergencies[0]?.id));

    if (action === 'ACCEPT') {
      donor.status = 'ACCEPTED';
      if (targetEmg) {
        targetEmg.unitsConfirmed = (targetEmg.unitsConfirmed || 0) + 1;
        if (targetEmg.unitsConfirmed >= targetEmg.unitsRequired) {
          targetEmg.status = 'FULFILLED';
        } else {
          targetEmg.status = 'PARTIALLY_FULFILLED';
        }
      }
    } else if (action === 'DECLINE') {
      donor.status = 'DECLINED';
    }

    if (screening) {
      donor.screeningResponse = screening;
    }

    broadcastState();
    io.emit('donor:response-updated', {
      donor,
      emergency: targetEmg,
      action
    });
  });

  socket.on('preset:trigger', ({ presetKey }) => {
    if (presetKey === 'MASS_CASUALTY') {
      const newEmg = {
        id: `EMG-MASS-${Math.floor(100 + Math.random() * 900)}`,
        bloodGroup: "O-",
        unitsRequired: 12,
        unitsConfirmed: 2,
        urgencyLevel: "CRITICAL",
        patientId: "MASS CASUALTY EVENT - Mount Road ER",
        hospitalName: "Apollo ER Trauma Hub (Chennai)",
        createdAt: new Date().toISOString(),
        status: "DISPATCHED",
        targetEtaMins: 5,
        notifiedCount: 25
      };

      const { dispatchedCandidates } = rankAndDispatchDonors(donors, newEmg, CHENNAI_HOSPITAL_COORDS);
      newEmg.matchedDonors = dispatchedCandidates;

      dispatchedCandidates.forEach(cand => {
        const d = donors.find(x => x.id === cand.id);
        if (d) {
          d.status = 'NOTIFIED';
          d.currentEmergencyId = newEmg.id;
        }
      });

      emergencies.unshift(newEmg);
    } else if (presetKey === 'SWARM_50') {
      for (let i = 1; i <= 8; i++) {
        const lat = 13.0600 + (Math.random() - 0.5) * 0.05;
        const lng = 80.2400 + (Math.random() - 0.5) * 0.05;
        const distanceKm = calculateHaversineDistance(lat, lng, CHENNAI_HOSPITAL_COORDS.lat, CHENNAI_HOSPITAL_COORDS.lng);
        const etaMins = calculateDrivingEta(distanceKm);

        donors.push({
          id: `donor-sim-${Date.now()}-${i}`,
          name: `Chennai Donor #${i}`,
          bloodGroup: ['O-', 'O+', 'A+', 'B+'][i % 4],
          phone: `+91 98400 ${1000 + i}`,
          reliabilityScore: 0.96,
          daysSinceLastDonation: 95,
          lat,
          lng,
          distanceKm,
          etaMins,
          status: "NOTIFIED",
          totalDonations: 8,
          gender: i % 2 === 0 ? "Female" : "Male",
          age: 26 + i,
          verifiedMedical: true
        });
      }
    } else if (presetKey === 'RESET') {
      donors = initialDonors.map(d => {
        const distanceKm = calculateHaversineDistance(d.lat, d.lng, CHENNAI_HOSPITAL_COORDS.lat, CHENNAI_HOSPITAL_COORDS.lng);
        const etaMins = calculateDrivingEta(distanceKm);
        return {
          ...d,
          distanceKm,
          etaMins
        };
      });

      emergencies = [];
      const defaultEmg = {
        id: "EMG-7082",
        bloodGroup: "O-",
        unitsRequired: 4,
        unitsConfirmed: 1,
        urgencyLevel: "CRITICAL",
        patientId: "PAT-9942 (Apollo Chennai ICU)",
        hospitalName: "Apollo ER Trauma Hub (Chennai)",
        createdAt: new Date().toISOString(),
        status: "DISPATCHED",
        targetEtaMins: 12,
        notifiedCount: 18
      };
      const { dispatchedCandidates } = rankAndDispatchDonors(donors, defaultEmg, CHENNAI_HOSPITAL_COORDS);
      defaultEmg.matchedDonors = dispatchedCandidates;
      emergencies.push(defaultEmg);
    }

    broadcastState();
  });
});

// SPA Fallback: send index.html for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 RapidBlood AI Server running on http://localhost:${PORT}`);
});
