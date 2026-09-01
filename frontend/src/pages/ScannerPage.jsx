import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scannerAPI, locationAPI } from '../services/api';
import BoundingBoxCanvas from '../components/BoundingBoxCanvas';
import StatusBadge from '../components/StatusBadge';
import LocationPickerModal from '../components/LocationPickerModal';
import ConsentDispatchModal from '../components/ConsentDispatchModal';
import {
  Upload,
  ImageIcon,
  MapPin,
  Compass,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Cpu,
  ShieldCheck,
  Send,
  Navigation
} from 'lucide-react';

export default function ScannerPage() {
  const navigate = useNavigate();

  // Input states
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [exifBadge, setExifBadge] = useState(null);
  
  // Location states
  const [locationMode, setLocationMode] = useState('demo'); // 'browser' | 'manual' | 'demo' | 'map_pin' | 'exif'
  const [roadName, setRoadName] = useState('MG Road Expressway');
  const [latitude, setLatitude] = useState(12.9716);
  const [longitude, setLongitude] = useState(77.5946);
  const [formattedAddress, setFormattedAddress] = useState('MG Road, Ward 4, Bengaluru 560001');
  const [district, setDistrict] = useState('Central Infrastructure District');
  const [landmark, setLandmark] = useState('Near Metro Pillar 142');
  const [gpsAccuracy, setGpsAccuracy] = useState(5.0);
  const [locationSourceType, setLocationSourceType] = useState('REVERSE_GEOCODED');

  const [trafficLevel, setTrafficLevel] = useState('HIGH');
  const [roadImportance, setRoadImportance] = useState('Arterial');

  // Modals
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  // Processing & Result states
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const demoLocations = [
    { name: 'MG Road Expressway', lat: 12.9716, lng: 77.5946, addr: 'MG Road, Central Infrastructure District, Ward 4' },
    { name: 'Anna Nagar 2nd Avenue', lat: 13.0850, lng: 80.2101, addr: 'Anna Nagar 2nd Avenue, North Zone, Chennai 600040' },
    { name: 'Central Avenue Corridor', lat: 12.9784, lng: 77.6408, addr: 'Central Avenue, Indiranagar Ward 82' },
    { name: 'Outer Ring Road Highway', lat: 13.0123, lng: 77.5900, addr: 'Outer Ring Road, High Speed Transit Corridor' },
  ];

  const presets = [
    { key: 'pothole', label: 'Pothole Defect', img: '/uploads/sample_pothole_1.jpg' },
    { key: 'crack', label: 'Structural Crack', img: '/uploads/sample_crack_1.jpg' },
    { key: 'edge', label: 'Edge Collapse', img: '/uploads/sample_edge_1.jpg' },
    { key: 'surface', label: 'Surface Deterioration', img: '/uploads/sample_surface_1.jpg' },
    { key: 'marking', label: 'Faded Road Marking', img: '/uploads/sample_marking_1.jpg' }
  ];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit.');
      return;
    }

    setSelectedFile(file);
    setSelectedPreset(null);
    setError('');
    setExifBadge(null);

    const url = URL.createObjectURL(file);
    setFilePreview(url);

    // Run EXIF extraction for image files
    if (file.type.startsWith('image/')) {
      try {
        const exifData = await locationAPI.extractExif(file);
        if (exifData.success && exifData.exif_gps) {
          const lat = exifData.exif_gps.latitude;
          const lng = exifData.exif_gps.longitude;
          setLatitude(lat);
          setLongitude(lng);
          setGpsAccuracy(exifData.exif_gps.accuracy_meters || 4.5);
          setLocationSourceType('EXIF_GPS');
          setLocationMode('exif');

          if (exifData.geocoded) {
            setRoadName(exifData.geocoded.road_name);
            setFormattedAddress(exifData.geocoded.formatted_address);
            setDistrict(exifData.geocoded.district);
            setLandmark(exifData.geocoded.landmark);
          }

          setExifBadge({
            lat,
            lng,
            accuracy: exifData.exif_gps.accuracy_meters,
            source: 'EXIF GPS Metadata'
          });
        }
      } catch (err) {
        console.log('No EXIF GPS tags found in file');
      }
    }
  };

  const handlePresetSelect = (presetKey) => {
    setSelectedPreset(presetKey);
    setSelectedFile(null);
    setFilePreview(null);
    setExifBadge(null);
    setError('');
  };

  const handleSelectDemoLocation = (loc) => {
    setRoadName(loc.name);
    setLatitude(loc.lat);
    setLongitude(loc.lng);
    setFormattedAddress(loc.addr);
    setLocationMode('demo');
    setLocationSourceType('REVERSE_GEOCODED');
  };

  const handleGetBrowserLocation = () => {
    if (!navigator.geolocation) {
      setError('Browser Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Math.round(pos.coords.latitude * 1000000) / 1000000;
        const lng = Math.round(pos.coords.longitude * 1000000) / 1000000;
        setLatitude(lat);
        setLongitude(lng);
        setGpsAccuracy(pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 6.0);
        setLocationSourceType('HIGH_ACCURACY_DEVICE_GPS');
        setLocationMode('browser');

        try {
          const geo = await locationAPI.reverseGeocode(lat, lng);
          setRoadName(geo.road_name);
          setFormattedAddress(geo.formatted_address);
          setDistrict(geo.district);
          setLandmark(geo.landmark);
        } catch (e) {}
      },
      (err) => {
        setError('Location permission denied. Please select location manually or on map.');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleConfirmMapLocation = (locData) => {
    setLatitude(locData.latitude);
    setLongitude(locData.longitude);
    setRoadName(locData.roadName);
    setFormattedAddress(locData.formattedAddress);
    setDistrict(locData.district);
    setLandmark(locData.landmark);
    setGpsAccuracy(locData.accuracyMeters);
    setLocationSourceType('MAP_PINPOINT');
    setLocationMode('map_pin');
  };

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    if (!selectedFile && !selectedPreset) {
      setError('Please select an image/video file or pick a preset sample.');
      return;
    }

    setError('');
    setStatus('uploading');

    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    if (selectedPreset) {
      formData.append('sample_preset', selectedPreset);
    }
    formData.append('road_name', roadName);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('formatted_address', formattedAddress);
    formData.append('district', district);
    formData.append('landmark', landmark);
    formData.append('gps_accuracy', gpsAccuracy);
    formData.append('location_source_type', locationSourceType);
    formData.append('traffic_level', trafficLevel);
    formData.append('road_importance', roadImportance);

    try {
      await new Promise((r) => setTimeout(r, 300));
      setStatus('processing');
      await new Promise((r) => setTimeout(r, 300));
      setStatus('ai_detection');

      const res = await scannerAPI.uploadScan(formData);
      
      await new Promise((r) => setTimeout(r, 200));
      setAnalysisResult(res);
      setStatus('complete');
    } catch (err) {
      setError(err.response?.data?.detail || 'AI analysis failed. Please verify backend execution.');
      setStatus('idle');
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white flex items-center space-x-3">
          <span>AI Road Scanner & High-Precision Inspection</span>
          <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2.5 py-1 rounded font-mono font-bold border border-cyan-500/40">
            ENGINE v2.0
          </span>
        </h1>
        <p className="text-xs lg:text-sm text-slate-400">
          Upload road media with automatic EXIF GPS extraction & map pinpoint geocoding for instant Consent Officer dispatch.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <form onSubmit={handleRunAnalysis} className="space-y-6">
            
            {/* Media Upload Area */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <label className="block font-['Outfit'] text-sm font-bold text-white">
                1. Select Road Image or Video
              </label>

              {/* Preset Quick Loader Gallery */}
              <div className="space-y-2">
                <p className="text-xs text-slate-400">Quick Test Preset Samples:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handlePresetSelect(p.key)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center space-x-2 ${
                        selectedPreset === p.key
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag & Drop File Upload Zone */}
              <div className="relative border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 text-center space-y-3 bg-slate-950/60 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Click or drag & drop road image / video</p>
                  <p className="text-[11px] text-slate-400 mt-1">Extracts embedded EXIF GPS tags from camera photos automatically</p>
                </div>
                {selectedFile && (
                  <p className="text-xs font-mono text-cyan-400 font-semibold truncate">
                    Selected File: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>

              {/* EXIF GPS Extraction Alert Badge */}
              {exifBadge && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 text-xs text-cyan-300 flex items-center justify-between animate-fadeIn font-mono">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span>EXIF GPS EXTRACTED FROM PHOTO: <strong>{exifBadge.lat}, {exifBadge.lng}</strong></span>
                  </div>
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded font-bold border border-cyan-500/40">±{exifBadge.accuracy}m</span>
                </div>
              )}

            </div>

            {/* Location Selector & Reverse Geocoding */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="font-['Outfit'] text-sm font-bold text-white">
                  2. Geospatial Location & Reverse Geocoding
                </label>

                <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setLocationMode('demo')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      locationMode === 'demo' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Preset
                  </button>
                  <button
                    type="button"
                    onClick={handleGetBrowserLocation}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      locationMode === 'browser' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Device GPS
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMapPickerOpen(true)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      locationMode === 'map_pin' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-cyan-400'
                    }`}
                  >
                    🗺️ Map Pin
                  </button>
                </div>
              </div>

              {/* Demo Location Buttons */}
              {locationMode === 'demo' && (
                <div className="grid grid-cols-2 gap-2">
                  {demoLocations.map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => handleSelectDemoLocation(loc)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        roadName === loc.name
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <p className="font-semibold text-white">{loc.name}</p>
                      <p className="text-[10px] font-mono text-slate-400 truncate">{loc.addr}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Road / Street Name</label>
                  <input
                    type="text"
                    value={roadName}
                    onChange={(e) => setRoadName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Formatted Reverse Geocoded Address Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>REVERSE GEOCODED STREET ADDRESS</span>
                  <span className="text-cyan-400 font-semibold">Accurate ±{gpsAccuracy}m</span>
                </div>
                <p className="text-xs text-slate-200 font-semibold">{formattedAddress}</p>
              </div>

              {/* Traffic & Importance Factors */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Traffic Level (20% Weight)</label>
                  <select
                    value={trafficLevel}
                    onChange={(e) => setTrafficLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="HIGH">HIGH (Dense Commercial)</option>
                    <option value="MEDIUM">MEDIUM (Moderate Transit)</option>
                    <option value="LOW">LOW (Quiet Residential)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Road Importance (15% Weight)</label>
                  <select
                    value={roadImportance}
                    onChange={(e) => setRoadImportance(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="Highway">Expressway / Highway</option>
                    <option value="Arterial">Arterial Main Road</option>
                    <option value="Collector">Collector Road</option>
                    <option value="Local">Local Street</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Run Button */}
            <button
              type="submit"
              disabled={status !== 'idle' && status !== 'complete'}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 font-['Outfit'] font-extrabold text-white text-base hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <Cpu className="w-5 h-5" />
              <span>
                {status === 'idle' || status === 'complete'
                  ? 'ANALYZE ROAD INSPECTION MEDIA WITH AI'
                  : `PROCESSING (${status.toUpperCase()})...`}
              </span>
            </button>

          </form>

        </div>

        {/* Right Column: AI Bounding Box & Consent Dispatch Action (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="font-['Outfit'] text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span>AI Visual Detection Canvas</span>
              <span className="text-xs font-mono text-cyan-400">
                {analysisResult ? 'ANALYSIS COMPLETE' : 'AWAITING INPUT'}
              </span>
            </h3>

            {/* Canvas Bounding Box Display */}
            {analysisResult ? (
              <BoundingBoxCanvas
                imageUrl={`http://localhost:8000/uploads/${analysisResult.record.image_path}`}
                boundingBox={analysisResult.bounding_box_dict}
                damageType={analysisResult.record.damage_type}
                confidence={analysisResult.record.confidence}
                severityScore={analysisResult.record.severity_score}
              />
            ) : filePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-800">
                <img src={filePreview} alt="Preview" className="w-full h-auto object-cover max-h-[300px]" />
              </div>
            ) : (
              <div className="h-64 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-2 text-slate-500">
                <ImageIcon className="w-10 h-10 stroke-1" />
                <p className="text-xs">No media loaded yet. Select a file or preset sample to inspect AI bounding box.</p>
              </div>
            )}

            {/* Result Structured Cards */}
            {analysisResult && (
              <div className="space-y-4 pt-2">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Damage Defect</p>
                    <p className="font-['Outfit'] font-bold text-sm text-cyan-400">{analysisResult.record.damage_type}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] text-slate-400">AI Confidence</p>
                    <p className="font-['Outfit'] font-bold text-sm text-white">
                      {Math.round(analysisResult.record.confidence * 100)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Severity Score</p>
                    <p className="font-['Outfit'] font-bold text-sm text-rose-400">{analysisResult.record.severity_score}/100</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Damage Area</p>
                    <p className="font-['Outfit'] font-bold text-sm text-white">{analysisResult.record.damage_area} m²</p>
                  </div>
                </div>

                {/* Priority Breakdown Card */}
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-cyan-300 font-['Outfit']">MAIN INNOVATION PRIORITY SCORE</span>
                    <StatusBadge type="priority" value={analysisResult.record.priority_level} />
                  </div>
                  <p className="font-['Outfit'] text-3xl font-extrabold text-cyan-300">
                    {analysisResult.record.priority_score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                  </p>
                  <p className="text-xs text-slate-300">
                    Estimated Cost Range: <strong className="text-emerald-400">₹{intFmt(analysisResult.record.estimated_cost_min)} – ₹{intFmt(analysisResult.record.estimated_cost_max)}</strong>
                  </p>
                </div>

                {/* DIRECT CONSENT OFFICER DISPATCH BUTTON */}
                <button
                  onClick={() => setIsConsentModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 font-['Outfit'] font-extrabold text-white text-xs hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>DISPATCH ROAD DETAILS TO CONSENT OFFICER</span>
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => navigate('/priority')}
                    className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-400 hover:bg-slate-700"
                  >
                    View In Priority Queue
                  </button>
                  <button
                    onClick={() => navigate('/map')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
                  >
                    View On Damage Map
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Map Location Picker Modal */}
      <LocationPickerModal
        isOpen={isMapPickerOpen}
        onClose={() => setIsMapPickerOpen(false)}
        initialLat={latitude}
        initialLng={longitude}
        onConfirmLocation={handleConfirmMapLocation}
      />

      {/* Consent Officer Dispatch Modal */}
      {analysisResult && (
        <ConsentDispatchModal
          isOpen={isConsentModalOpen}
          onClose={() => setIsConsentModalOpen(false)}
          damageRecord={analysisResult.record}
          onDispatchSuccess={() => {
            navigate('/consent-officers');
          }}
        />
      )}

    </div>
  );
}

function intFmt(val) {
  return Math.round(val || 0).toLocaleString('en-IN');
}
