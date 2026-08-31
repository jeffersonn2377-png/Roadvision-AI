import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scannerAPI } from '../services/api';
import BoundingBoxCanvas from '../components/BoundingBoxCanvas';
import StatusBadge from '../components/StatusBadge';
import {
  Upload,
  Image as ImageIcon,
  Film,
  MapPin,
  Compass,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  ArrowRight,
  Sparkles,
  Cpu
} from 'lucide-react';

export default function ScannerPage() {
  const navigate = useNavigate();

  // Input states
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  
  // Location states (Option 1: Browser, Option 2: Manual, Option 3: Predefined Demo)
  const [locationMode, setLocationMode] = useState('demo'); // 'browser' | 'manual' | 'demo'
  const [roadName, setRoadName] = useState('MG Road');
  const [latitude, setLatitude] = useState(12.9716);
  const [longitude, setLongitude] = useState(77.5946);
  const [trafficLevel, setTrafficLevel] = useState('HIGH');
  const [roadImportance, setRoadImportance] = useState('Arterial');

  // Processing & Result states
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'processing' | 'ai_detection' | 'complete'
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const demoLocations = [
    { name: 'MG Road Expressway', lat: 12.9716, lng: 77.5946 },
    { name: 'Anna Nagar 2nd Avenue', lat: 13.0850, lng: 80.2101 },
    { name: 'Central Avenue Corridor', lat: 12.9784, lng: 77.6408 },
    { name: 'Outer Ring Road Highway', lat: 13.0123, lng: 77.5900 },
  ];

  const presets = [
    { key: 'pothole', label: 'Pothole Defect', img: '/uploads/sample_pothole_1.jpg' },
    { key: 'crack', label: 'Structural Crack', img: '/uploads/sample_crack_1.jpg' },
    { key: 'edge', label: 'Edge Collapse', img: '/uploads/sample_edge_1.jpg' },
    { key: 'surface', label: 'Surface Deterioration', img: '/uploads/sample_surface_1.jpg' },
    { key: 'marking', label: 'Faded Road Marking', img: '/uploads/sample_marking_1.jpg' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit.');
      return;
    }

    setSelectedFile(file);
    setSelectedPreset(null);
    setError('');

    const url = URL.createObjectURL(file);
    setFilePreview(url);
  };

  const handlePresetSelect = (presetKey) => {
    setSelectedPreset(presetKey);
    setSelectedFile(null);
    setFilePreview(null);
    setError('');
  };

  const handleSelectDemoLocation = (loc) => {
    setRoadName(loc.name);
    setLatitude(loc.lat);
    setLongitude(loc.lng);
  };

  const handleGetBrowserLocation = () => {
    if (!navigator.geolocation) {
      setError('Browser Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(roundCoord(pos.coords.latitude));
        setLongitude(roundCoord(pos.coords.longitude));
        setRoadName('Current Browser Position');
        setLocationMode('browser');
      },
      (err) => {
        setError('Location permission denied. Please enter coordinates manually or use demo locations.');
      }
    );
  };

  const roundCoord = (val) => Math.round(val * 10000) / 10000;

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
    formData.append('location_source', locationMode === 'browser' ? 'Browser Geolocation' : locationMode === 'manual' ? 'Manual Coordinates' : 'Predefined Demo Location');
    formData.append('traffic_level', trafficLevel);
    formData.append('road_importance', roadImportance);

    try {
      await new Promise((r) => setTimeout(r, 400));
      setStatus('processing');
      await new Promise((r) => setTimeout(r, 400));
      setStatus('ai_detection');

      const res = await scannerAPI.uploadScan(formData);
      
      await new Promise((r) => setTimeout(r, 300));
      setAnalysisResult(res);
      setStatus('complete');
    } catch (err) {
      setError(err.response?.data?.detail || 'AI analysis failed. Please verify backend service execution.');
      setStatus('idle');
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white flex items-center space-x-3">
          <span>AI Road Scanner & Damage Inspection</span>
          <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2.5 py-1 rounded font-mono font-bold border border-cyan-500/40">
            DemoDetector v1.0
          </span>
        </h1>
        <p className="text-xs lg:text-sm text-slate-400">
          Upload road media or select a sample image to execute real-time AI damage classification & priority calculation.
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
                  <p className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, WEBP, MP4, MOV (Max 50MB)</p>
                </div>
                {selectedFile && (
                  <p className="text-xs font-mono text-cyan-400 font-semibold truncate">
                    Selected File: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>
            </div>

            {/* Location Selector */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-['Outfit'] text-sm font-bold text-white">
                  2. Software Location Assignment
                </label>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setLocationMode('demo')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      locationMode === 'demo' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Demo Preset
                  </button>
                  <button
                    type="button"
                    onClick={handleGetBrowserLocation}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      locationMode === 'browser' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Browser GPS
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationMode('manual')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                      locationMode === 'manual' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>

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
                      <p className="font-semibold">{loc.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{loc.lat}, {loc.lng}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Road Name</label>
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
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
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
                  <label className="block text-[11px] text-slate-400 mb-1">Road Classification (15% Weight)</label>
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
                  ? 'ANALYZE ROAD MEDIA WITH AI'
                  : `PROCESSING (${status.toUpperCase()})...`}
              </span>
            </button>

          </form>

        </div>

        {/* Right Column: AI Bounding Box Overlay & Calculation Breakdown (5 cols) */}
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

    </div>
  );
}

function intFmt(val) {
  return Math.round(val || 0).toLocaleString('en-IN');
}
