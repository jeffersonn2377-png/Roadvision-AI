import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locationAPI } from '../services/api';
import { MapPin, Check, X, RefreshCw, Compass, AlertCircle } from 'lucide-react';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapClickHandler({ onSelectCoords }) {
  useMapEvents({
    click(e) {
      onSelectCoords(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerModal({ isOpen, onClose, initialLat = 12.9716, initialLng = 77.5946, onConfirmLocation }) {
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng });
  const [loading, setLoading] = useState(false);
  const [geocoded, setGeocoded] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setPosition({ lat: initialLat, lng: initialLng });
      fetchAddress(initialLat, initialLng);
    }
  }, [isOpen, initialLat, initialLng]);

  const fetchAddress = async (lat, lng) => {
    setLoading(true);
    try {
      const data = await locationAPI.reverseGeocode(lat, lng);
      setGeocoded(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCoords = (lat, lng) => {
    const roundedLat = Math.round(lat * 1000000) / 1000000;
    const roundedLng = Math.round(lng * 1000000) / 1000000;
    setPosition({ lat: roundedLat, lng: roundedLng });
    fetchAddress(roundedLat, roundedLng);
  };

  const handleConfirm = () => {
    if (onConfirmLocation && geocoded) {
      onConfirmLocation({
        latitude: position.lat,
        longitude: position.lng,
        roadName: geocoded.road_name,
        formattedAddress: geocoded.formatted_address,
        district: geocoded.district,
        landmark: geocoded.landmark,
        accuracyMeters: geocoded.accuracy_meters || 5.0,
        sourceType: 'MAP_PINPOINT'
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0D1322] border border-cyan-500/30 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-0">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-white text-base">Pinpoint High-Accuracy Road Location</h3>
              <p className="text-xs text-slate-400">Click anywhere on the map or drag the marker to pinpoint exact pothole coordinates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Leaflet High Zoom Map Container */}
        <div className="relative h-80 w-full bg-slate-950">
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[position.lat, position.lng]} icon={customIcon} />
            <MapClickHandler onSelectCoords={handleSelectCoords} />
          </MapContainer>

          {/* Map Overlay Badge */}
          <div className="absolute bottom-3 left-3 z-[400] bg-slate-950/90 border border-cyan-500/40 backdrop-blur px-3 py-1.5 rounded-xl text-[11px] text-cyan-300 font-mono flex items-center space-x-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Lat: {position.lat}, Lng: {position.lng}</span>
          </div>
        </div>

        {/* Address & Landmark Readout Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-cyan-400">GEOLOCATION REVERSE LOOKUP</span>
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
            </div>
            {geocoded ? (
              <div>
                <p className="font-['Outfit'] font-bold text-white text-sm">{geocoded.road_name}</p>
                <p className="text-xs text-slate-300">{geocoded.formatted_address}</p>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1 font-mono">
                  <span>District: <strong className="text-slate-200">{geocoded.district}</strong></span>
                  <span>Landmark: <strong className="text-slate-200">{geocoded.landmark}</strong></span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Fetching detailed street address...</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!geocoded}
              className="px-5 py-2 rounded-xl bg-cyan-500 font-['Outfit'] font-bold text-xs text-slate-950 hover:bg-cyan-400 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>CONFIRM THIS LOCATION</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
