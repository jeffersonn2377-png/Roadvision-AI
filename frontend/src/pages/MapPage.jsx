import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { damagesAPI, maintenanceAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ConsentDispatchModal from '../components/ConsentDispatchModal';
import { MapPin, Filter, Search, RotateCw, Wrench, Eye, ShieldCheck, Compass } from 'lucide-react';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

const createCustomIcon = (severityCategory, consentStatus) => {
  let color = '#10B981'; // green minor
  if (severityCategory === 'CRITICAL') color = '#F43F5E';
  else if (severityCategory === 'HIGH') color = '#F59E0B';
  else if (severityCategory === 'MODERATE') color = '#EAB308';

  const isApproved = consentStatus === 'APPROVED';

  const svgMarker = `
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="${color}" stroke="#0B0F19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="${isApproved ? '#06b6d4' : '#ffffff'}"></circle>
    </svg>
  `;

  return L.divIcon({
    html: svgMarker,
    className: 'custom-map-pin',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
  });
};

export default function MapPage() {
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchRoad, setSearchRoad] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterConsent, setFilterConsent] = useState('ALL');

  // Consent Dispatch Modal state
  const [selectedDamageForConsent, setSelectedDamageForConsent] = useState(null);

  const fetchMapMarkers = async () => {
    setLoading(true);
    try {
      const data = await damagesAPI.getMapMarkers();
      setMarkers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapMarkers();
  }, []);

  const filteredMarkers = markers.filter((m) => {
    if (searchRoad && !m.road.toLowerCase().includes(searchRoad.toLowerCase()) && !m.formatted_address.toLowerCase().includes(searchRoad.toLowerCase())) return false;
    if (filterType !== 'ALL' && m.damage_type !== filterType) return false;
    if (filterSeverity !== 'ALL' && m.severity_category !== filterSeverity) return false;
    if (filterConsent !== 'ALL' && m.consent_status !== filterConsent) return false;
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <span>Interactive Road Damage & Consent GIS Map</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-400">
            Geospatial map with GPS accuracy overlays & direct Consent Officer dispatch triggers.
          </p>
        </div>
        <button
          onClick={fetchMapMarkers}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors self-start sm:self-auto"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Search Road / Address</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchRoad}
              onChange={(e) => setSearchRoad(e.target.value)}
              placeholder="Filter by road or address..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Damage Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="ALL">All Damage Types</option>
            <option value="Pothole">Potholes</option>
            <option value="Crack">Cracks</option>
            <option value="Broken Road Edge">Broken Road Edge</option>
            <option value="Surface Deterioration">Surface Deterioration</option>
            <option value="Damaged Road Marking">Damaged Marking</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Severity Category</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="ALL">All Severity Levels</option>
            <option value="CRITICAL">Critical (81-100)</option>
            <option value="HIGH">High (61-80)</option>
            <option value="MODERATE">Moderate (31-60)</option>
            <option value="MINOR">Minor (0-30)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Consent Status</label>
          <select
            value={filterConsent}
            onChange={(e) => setFilterConsent(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="ALL">All Consent Statuses</option>
            <option value="APPROVED">Consent Approved</option>
            <option value="PENDING_CONSENT">Pending Consent</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950">
        {!loading && (
          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredMarkers.map((m) => (
              <React.Fragment key={m.id}>
                {/* GPS Precision Accuracy Circle */}
                <Circle
                  center={[m.latitude, m.longitude]}
                  radius={(m.gps_accuracy || 5) * 10}
                  pathOptions={{ color: m.consent_status === 'APPROVED' ? '#06b6d4' : '#f43f5e', fillColor: '#06b6d4', fillOpacity: 0.15 }}
                />

                <Marker
                  position={[m.latitude, m.longitude]}
                  icon={createCustomIcon(m.severity_category, m.consent_status)}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-3 space-y-2 text-slate-900 max-w-xs">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="font-bold text-xs text-cyan-700">Inspection ID #{m.id}</span>
                        <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded text-cyan-800">
                          {m.consent_status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">{m.road}</h4>
                      <p className="text-[11px] text-slate-600 font-semibold">{m.formatted_address}</p>

                      <div className="text-xs space-y-1 bg-slate-50 p-2 rounded border">
                        <p>Defect: <strong>{m.damage_type}</strong></p>
                        <p>Severity Score: <strong className="text-rose-700">{m.severity_score}/100</strong></p>
                        <p>Priority Score: <strong className="text-cyan-800">{m.priority_score}/100</strong></p>
                        <p>GPS Precision: <strong>±{m.gps_accuracy}m ({m.location_source_type})</strong></p>
                        {m.official_consent_code && (
                          <p className="text-[10px] font-mono font-bold text-cyan-700">CODE: {m.official_consent_code}</p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 border-t">
                        <button
                          onClick={() => navigate(`/damages/${m.id}`)}
                          className="px-2.5 py-1.5 rounded bg-slate-800 text-white text-[10px] font-semibold hover:bg-slate-700"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => setSelectedDamageForConsent(m)}
                          className="px-2.5 py-1.5 rounded bg-cyan-600 text-white text-[10px] font-bold hover:bg-cyan-500 flex items-center space-x-1"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Dispatch Consent</span>
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Consent Officer Dispatch Modal */}
      {selectedDamageForConsent && (
        <ConsentDispatchModal
          isOpen={!!selectedDamageForConsent}
          onClose={() => setSelectedDamageForConsent(null)}
          damageRecord={selectedDamageForConsent}
          onDispatchSuccess={() => {
            fetchMapMarkers();
            setSelectedDamageForConsent(null);
          }}
        />
      )}

    </div>
  );
}
