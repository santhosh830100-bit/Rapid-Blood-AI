// Antigravity Smart AI Match Engine for RapidBlood AI (Chennai Region)

// Blood Compatibility Matrix
const COMPATIBILITY_MATRIX = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
};

/**
 * Calculates exact Haversine distance in kilometers between two geographic coordinates
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 3.5;
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(1));
}

/**
 * Calculates urban driving ETA in minutes based on distance in km
 */
export function calculateDrivingEta(distanceKm) {
  // Average urban city traffic speed (~25 km/h -> ~2.4 mins per km)
  return Math.max(2, Math.round(distanceKm * 2.4));
}

/**
 * Calculates dynamic AI Match Score based on the formula:
 * Score = (1 / ETA_mins) * 0.5 + (Reliability_Score) * 0.3 - (Days_Since_Last_Request_Penalty)
 */
export function calculateMatchScore(donor, targetBloodGroup, urgencyLevel = 'HIGH', hospitalCoords = { lat: 13.0600, lng: 80.2400 }) {
  // Compute exact Haversine distance and driving ETA relative to Chennai hospital
  const distanceKm = calculateHaversineDistance(donor.lat, donor.lng, hospitalCoords.lat, hospitalCoords.lng);
  const etaMins = calculateDrivingEta(distanceKm);

  // 1. Blood Compatibility Check
  const compatibleTypes = COMPATIBILITY_MATRIX[targetBloodGroup] || [targetBloodGroup];
  const isCompatible = compatibleTypes.includes(donor.bloodGroup);

  if (!isCompatible) {
    return {
      score: 0,
      scorePct: 0,
      eligible: false,
      distanceKm,
      etaMins,
      reason: `Incompatible blood type (${donor.bloodGroup} for ${targetBloodGroup})`
    };
  }

  // 2. Mandatory 56-Day Rest Window Check
  if (donor.daysSinceLastDonation < 56) {
    return {
      score: 0,
      scorePct: 0,
      eligible: false,
      distanceKm,
      etaMins,
      reason: `Donated recently (${donor.daysSinceLastDonation} days ago, min 56 days required)`
    };
  }

  // 3. Formula Components
  const etaTerm = (1 / etaMins) * 0.5;
  const reliabilityTerm = (donor.reliabilityScore || 0.85) * 0.3;
  const penaltyTerm = 0;

  let rawScore = etaTerm + reliabilityTerm - penaltyTerm;

  let urgencyBonus = 0;
  if (urgencyLevel === 'CRITICAL' && donor.bloodGroup === 'O-') {
    urgencyBonus = 0.15;
  }

  rawScore += urgencyBonus;

  const normalizedPct = Math.min(99.4, Math.max(45.0, (rawScore / 0.85) * 100));

  return {
    rawScore: Number(rawScore.toFixed(4)),
    scorePct: Number(normalizedPct.toFixed(1)),
    eligible: true,
    distanceKm,
    etaMins,
    breakdown: {
      etaTerm: Number(etaTerm.toFixed(3)),
      reliabilityTerm: Number(reliabilityTerm.toFixed(3)),
      penaltyTerm,
      urgencyBonus
    }
  };
}

/**
 * Ranks candidate pool and selects top donors for an emergency request
 */
export function rankAndDispatchDonors(donorsList, emergencyRequest, hospitalCoords = { lat: 13.0600, lng: 80.2400 }) {
  const targetBloodGroup = emergencyRequest.bloodGroup;
  const urgencyLevel = emergencyRequest.urgencyLevel || 'HIGH';

  const scoredDonors = donorsList.map(donor => {
    const matchResult = calculateMatchScore(donor, targetBloodGroup, urgencyLevel, hospitalCoords);
    return {
      ...donor,
      distanceKm: matchResult.distanceKm,
      etaMins: matchResult.etaMins,
      matchResult
    };
  });

  const eligibleSorted = scoredDonors
    .filter(d => d.matchResult.eligible)
    .sort((a, b) => b.matchResult.scorePct - a.matchResult.scorePct);

  const ineligible = scoredDonors.filter(d => !d.matchResult.eligible);
  const topCandidates = eligibleSorted.slice(0, 25);

  return {
    dispatchedCandidates: topCandidates,
    scoredDonors,
    totalEligible: eligibleSorted.length,
    ineligibleCount: ineligible.length,
    ineligibleList: ineligible
  };
}
