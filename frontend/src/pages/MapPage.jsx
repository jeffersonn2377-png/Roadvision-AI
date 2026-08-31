import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { damagesAPI, maintenanceAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { MapPin, Filter, Search, RotateCw, Wrench, Eye } from 'lucide-react';

// Leaflet dynamic import check for React SPA
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Leaflet marker icons with colored pins
const createCustomIcon = (severityCategory) => {
  let color = '#10B981'; // green minor
  if (severityCategory === 'CRITICAL') color = '#F43F5E'; // red
  else if (severityCategory === 'HIGH') color = '#F59E0B'; // amber
  else if (severityCategory === 'MODERATE') color = '#EAB308'; // yellow

  const svgMarker = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="#0B0F19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
    </svg>
  `;

  return L.divIcon({
    html: svgMarker,
    className: 'custom-map-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
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
  const [filterPriority, setFilterPriority] = useState('ALL');

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

  const handleDispatchMaintenance = async (damageId) => {
    try {
      await maintenanceAPI.update(damageId, { status: 'Assigned', notes: 'Dispatched from Interactive Damage Map popup.' });
      alert(`Damage Record #${damageId} dispatched to Maintenance Team!`);
      fetchMapMarkers();
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered markers list
  const filteredMarkers = markers.filter((m) => {
    if (searchRoad && !m.road.toLowerCase().includes(searchRoad.toLowerCase())) return false;
    if (filterType !== 'ALL' && m.damage_type !== filterType) return false;
    if (filterSeverity !== 'ALL' && m.severity_category !== filterSeverity) return false;
    if (filterPriority !== 'ALL' && m.priority_level !== filterPriority) return false;
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <span>Interactive Damage Map</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-400">
            Geospatial openstreetmap view of all defect records fetched live from SQLite database.
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
          <label className="block text-[11px] text-slate-400 mb-1">Search Road</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchRoad}
              onChange={(e) => setSearchRoad(e.target.value)}
              placeholder="Filter road name..."
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
          <label className="block text-[11px] text-slate-400 mb-1">Priority Rank</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="ALL">All Priority Levels</option>
            <option value="CRITICAL">Critical Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Map Box */}
      <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950">
        {!loading && (
          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredMarkers.map((m) => (
              <Marker
                key={m.id}
                position={[m.latitude, m.longitude]}
                icon={createCustomIcon(m.severity_category)}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 space-y-2 text-slate-900 max-w-xs">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-bold text-xs text-cyan-700">ID #{m.id}</span>
                      <span className="text-[10px] font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                        {m.priority_level}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{m.road}</h4>
                    
                    <div className="text-xs space-y-1">
                      <p>Defect: <strong>{m.damage_type}</strong> ({m.confidence})</p>
                      <p>Severity Score: <strong>{m.severity_score}/100</strong></p>
                      <p>Priority Score: <strong>{m.priority_score}/100</strong></p>
                      <p>Traffic Volume: <strong>{m.traffic}</strong></p>
                      <p>Est Cost: <strong className="text-emerald-700">{m.cost_range}</strong></p>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2 border-t">
                      <button
                        onClick={() => navigate(`/damages/${m.id}`)}
                        className="px-2.5 py-1 rounded bg-slate-800 text-white text-[10px] font-semibold hover:bg-slate-700"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDispatchMaintenance(m.id)}
                        className="px-2.5 py-1 rounded bg-cyan-600 text-white text-[10px] font-bold hover:bg-cyan-500"
                      >
                        Dispatch Repair
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

    </div>
  );
}
