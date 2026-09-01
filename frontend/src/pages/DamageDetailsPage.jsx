import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { damagesAPI, maintenanceAPI } from '../services/api';
import BoundingBoxCanvas from '../components/BoundingBoxCanvas';
import StatusBadge from '../components/StatusBadge';
import ConsentDispatchModal from '../components/ConsentDispatchModal';
import { ArrowLeft, MapPin, Gauge, ShieldAlert, DollarSign, Wrench, CheckCircle2, RotateCw, ShieldCheck, Compass, FileText } from 'lucide-react';

export default function DamageDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await damagesAPI.getDetail(id);
      setRecord(data);
    } catch (e) {
      setError('Damage record not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleDispatch = async () => {
    try {
      await maintenanceAPI.update(id, { status: 'Assigned', notes: 'Dispatched from Damage Detail Page.' });
      alert('Maintenance dispatched successfully!');
      fetchDetail();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 text-cyan-400 font-mono text-sm">
          <RotateCw className="w-5 h-5 animate-spin" />
          <span>LOADING RECORD DETAILS...</span>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="p-8 space-y-4">
        <p className="text-rose-400">{error || 'Record not found.'}</p>
        <Link to="/priority" className="text-xs text-cyan-400 hover:underline">
          Back to Priority Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Back Button & Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="flex items-center space-x-2 font-mono text-xs text-cyan-400 font-bold">
          <span>DAMAGE INSPECTION RECORD #{record.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Canvas Overlay & Geolocation Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="font-['Outfit'] text-base font-bold text-white flex items-center justify-between">
              <span>AI Bounding Box Visualization</span>
              <span className="text-xs font-mono text-cyan-400">HIGH-PRECISION CV CANVAS</span>
            </h3>

            <BoundingBoxCanvas
              imageUrl={`http://localhost:8000/uploads/${record.image_path}`}
              boundingBox={record.bounding_box}
              damageType={record.damage_type}
              confidence={record.confidence}
              severityScore={record.severity_score}
            />
          </div>

          {/* Reverse Geocoded Location Metadata */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <span className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Geospatial Address & Accuracy</span>
              </span>
              <span>±{record.gps_accuracy || 5}m Precision</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <p className="font-['Outfit'] font-bold text-white text-sm">{record.road_name}</p>
              <p className="text-slate-300 font-semibold">{record.formatted_address || record.road_name}</p>
              <div className="grid grid-cols-2 gap-2 text-slate-400 pt-2 border-t border-slate-800 font-mono">
                <p>District: <strong className="text-slate-200">{record.district || 'Central Zone'}</strong></p>
                <p>Landmark: <strong className="text-slate-200">{record.landmark || 'Near Public Corridor'}</strong></p>
                <p>Latitude: <strong className="text-slate-200">{record.latitude}</strong></p>
                <p>Longitude: <strong className="text-slate-200">{record.longitude}</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Official Consent Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            
            <div className="border-b border-slate-800 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-['Outfit'] text-xl font-bold text-white">{record.road_name}</h2>
                <StatusBadge type="status" value={record.status} />
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge type="consent" value={record.consent_status} />
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase">Defect Class</p>
                <p className="font-['Outfit'] font-bold text-sm text-cyan-400">{record.damage_type}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase">AI Confidence</p>
                <p className="font-['Outfit'] font-bold text-sm text-white">{Math.round(record.confidence * 100)}%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase">Severity Score</p>
                <p className="font-['Outfit'] font-bold text-sm text-rose-400">{record.severity_score}/100</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase">Damage Area</p>
                <p className="font-['Outfit'] font-bold text-sm text-white">{record.damage_area} m²</p>
              </div>
            </div>

            {/* Priority Score Banner */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-['Outfit'] font-bold text-cyan-300">PRIORITY RANKING SCORE</span>
                <StatusBadge type="priority" value={record.priority_level} />
              </div>
              <p className="font-['Outfit'] text-3xl font-extrabold text-cyan-300">
                {record.priority_score} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </p>
              <p className="text-xs text-slate-300">
                Est. Cost: <strong className="text-emerald-400">₹{Math.round(record.estimated_cost_min).toLocaleString('en-IN')} – ₹{Math.round(record.estimated_cost_max).toLocaleString('en-IN')}</strong>
              </p>
            </div>

            {/* Official Consent Approval Card */}
            {record.consent_status === 'APPROVED' ? (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center space-x-1.5 font-['Outfit']">
                    <ShieldCheck className="w-4 h-4" />
                    <span>CONSENT OFFICER APPROVED</span>
                  </span>
                  <span className="font-mono text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">SANCTIONED</span>
                </div>
                <p className="text-slate-300 font-mono font-bold">OFFICIAL CODE: {record.official_consent_code}</p>
                {record.officer_notes && (
                  <p className="text-slate-400 italic font-mono text-[11px] pt-1">"{record.officer_notes}"</p>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsConsentModalOpen(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-['Outfit'] font-bold text-white text-xs hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>DISPATCH TO CONSENT OFFICER FOR APPROVAL</span>
              </button>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center space-x-3">
              <button
                onClick={handleDispatch}
                className="w-full py-3 rounded-xl bg-slate-800 border border-slate-700 font-['Outfit'] font-bold text-cyan-300 text-xs hover:bg-slate-700 flex items-center justify-center space-x-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Dispatch Maintenance Ticket</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Consent Officer Dispatch Modal */}
      {record && (
        <ConsentDispatchModal
          isOpen={isConsentModalOpen}
          onClose={() => setIsConsentModalOpen(false)}
          damageRecord={record}
          onDispatchSuccess={() => {
            fetchDetail();
          }}
        />
      )}

    </div>
  );
}
