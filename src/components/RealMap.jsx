import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Center on Chennai City Hub (T. Nagar / Apollo / Rajiv Gandhi GH Region)
const CHENNAI_HOSPITAL_COORDS = [13.0600, 80.2400];

export function RealMap({ donors, activeEmergency, onSelectDonor }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const polylinesGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: CHENNAI_HOSPITAL_COORDS,
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });

      // Standard OpenStreetMap tiles (matching reference screenshot)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
      polylinesGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    map.setView(CHENNAI_HOSPITAL_COORDS, 13);
    const markersGroup = markersGroupRef.current;
    const polylinesGroup = polylinesGroupRef.current;

    markersGroup.clearLayers();
    polylinesGroup.clearLayers();

    // 1. Hospital Emergency Teardrop Marker Pin (Red)
    const createTeardropPin = (color, label, pulse = false) => {
      return L.divIcon({
        className: 'custom-teardrop-pin',
        html: `
          <div style="position: relative; width: 34px; height: 42px; display: flex; align-items: center; justify-content: center;">
            <svg width="34" height="42" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.4));">
              <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="7" fill="#FFFFFF" opacity="0.25"/>
            </svg>
            <span style="position: absolute; top: 7px; color: #FFFFFF; font-weight: 800; font-size: 11px; font-family: sans-serif; text-shadow: 0 1px 2px rgba(0,0,0,0.6);">
              ${label}
            </span>
          </div>
        `,
        iconSize: [34, 42],
        iconAnchor: [17, 42],
        popupAnchor: [0, -38]
      });
    };

    // Add Hospital Marker
    const hospitalMarker = L.marker(CHENNAI_HOSPITAL_COORDS, {
      icon: createTeardropPin('#EF4444', 'ER')
    }).bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <h4 style="margin:0 0 4px; font-size:13px; font-weight:800; color:#EF4444;">
          Apollo ER Trauma Hub (Chennai)
        </h4>
        <p style="margin:0; font-size:11px; color:#94A3B8;">
          Central Emergency Blood Coordination Station
        </p>
      </div>
    `);
    markersGroup.addLayer(hospitalMarker);

    // 2. Add Donor Teardrop Markers (Bright Green & Yellow matching screenshot)
    donors.forEach((donor) => {
      const isAccepted = donor.status === 'ACCEPTED';
      const isNotified = donor.status === 'NOTIFIED';
      const pinColor = isAccepted ? '#10B981' : isNotified ? '#F59E0B' : '#059669';

      const donorMarker = L.marker([donor.lat, donor.lng], {
        icon: createTeardropPin(pinColor, donor.bloodGroup)
      }).bindPopup(`
        <div style="font-family: sans-serif; min-width:150px; padding:2px;">
          <h4 style="margin:0 0 2px; font-size:13px; font-weight:700; color:#F8FAFC;">
            ${donor.name}
          </h4>
          <p style="margin:0 0 4px; font-size:11px; color:#34D399; font-weight:600;">
            Blood Type: ${donor.bloodGroup}
          </p>
          <div style="font-size:11px; color:#94A3B8; line-height:1.4;">
            <div>Distance: ${donor.distanceKm || 2.1} km</div>
            <div>ETA: ~${donor.etaMins || 6} mins</div>
            <div style="color:${isAccepted ? '#10B981' : isNotified ? '#F59E0B' : '#94A3B8'}; font-weight:700; margin-top:2px;">
              Status: ${donor.status}
            </div>
            <div style="margin-top:8px;">
              <a href="https://www.google.com/maps/dir/?api=1&origin=13.0600,80.2400&destination=${donor.lat},${donor.lng}&travelmode=driving" target="_blank" rel="noopener noreferrer" style="display:inline-block; width:100%; box-sizing:border-box; text-align:center; padding:6px 8px; background:#10B981; color:#022C22; font-weight:800; border-radius:6px; font-size:10px; text-decoration:none;">
                🗺️ Open Google Maps Route
              </a>
            </div>
          </div>
        </div>
      `);

      donorMarker.on('click', () => {
        if (onSelectDonor) onSelectDonor(donor);
      });

      markersGroup.addLayer(donorMarker);

      // Route polyline for accepted donor
      if (isAccepted) {
        const polyline = L.polyline([[donor.lat, donor.lng], CHENNAI_HOSPITAL_COORDS], {
          color: '#10B981',
          weight: 4,
          opacity: 0.9,
          dashArray: '8, 8'
        });
        polylinesGroup.addLayer(polyline);
      }
    });

  }, [donors, activeEmergency, onSelectDonor]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-emerald-500/20 shadow-xl">
      
      {/* Top-Right Alert Banner Overlay (matching reference screenshot) */}
      <div className="absolute top-3 right-3 z-[1000] bg-rose-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-500/40 text-[11px] font-bold text-rose-200 shadow-lg flex items-center gap-1.5">
        <span>⚠️ Emergency Transit Routes Highlighted</span>
      </div>

      {/* Main Leaflet Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />

      {/* Floating Map Legend (matching bottom-left box from reference screenshot) */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-[#07130F]/90 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/30 text-xs text-slate-200 font-sans shadow-2xl space-y-1.5 min-w-[150px]">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 border-b border-emerald-500/20 pb-1">
          MAP LEGEND
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium">
          <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block border border-white/40" />
          <span>Available Donor</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium">
          <span className="w-3 h-3 rounded-full bg-[#F59E0B] inline-block border border-white/40" />
          <span>Notified / Pending</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium">
          <span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block border border-white/40" />
          <span>Hospital HQ</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium">
          <span className="w-3 h-1 bg-[#10B981] inline-block rounded-full" />
          <span>Accepted Route</span>
        </div>
      </div>

    </div>
  );
}
