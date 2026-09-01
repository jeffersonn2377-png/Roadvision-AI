import React, { useState, useEffect } from 'react';
import { consentAPI } from '../services/api';
import BoundingBoxCanvas from '../components/BoundingBoxCanvas';
import StatusBadge from '../components/StatusBadge';
import {
  ShieldCheck,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Compass,
  AlertTriangle,
  Plus,
  Printer,
  ChevronRight,
  Filter,
  Check,
  X,
  Sparkles
} from 'lucide-react';

export default function ConsentOfficerPage() {
  const [requests, setRequests] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Selected Request for Review Modal
  const [activeRequest, setActiveRequest] = useState(null);
  const [dossier, setDossier] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Add Officer Modal
  const [isAddOfficerOpen, setIsAddOfficerOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    title: '',
    department: '',
    email: '',
    phone: '',
    jurisdiction_district: 'Central Infrastructure District'
  });

  useEffect(() => {
    fetchData();
  }, [selectedStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqData, offData] = await Promise.all([
        consentAPI.getConsentRequests(selectedStatus === 'ALL' ? {} : { status: selectedStatus }),
        consentAPI.getOfficers()
      ]);
      setRequests(reqData);
      setOfficers(offData);
    } catch (e) {
      console.error('Error fetching consent data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = async (record) => {
    setActiveRequest(record);
    setReviewNotes('');
    setFeedbackMsg('');
    try {
      const dossierData = await consentAPI.getDossier(record.id);
      setDossier(dossierData);
    } catch (e) {
      console.error('Failed to load dossier', e);
    }
  };

  const handleReviewAction = async (statusChoice) => {
    if (!activeRequest) return;
    setReviewing(true);
    setFeedbackMsg('');
    try {
      const res = await consentAPI.reviewRequest(activeRequest.id, {
        status: statusChoice,
        officer_notes: reviewNotes
      });
      setFeedbackMsg(res.message);
      fetchData();
      setTimeout(() => {
        setActiveRequest(null);
      }, 1500);
    } catch (e) {
      setFeedbackMsg('Failed to process consent decision.');
    } finally {
      setReviewing(false);
    }
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    try {
      await consentAPI.createOfficer(newOfficer);
      setIsAddOfficerOpen(false);
      fetchData();
      setNewOfficer({
        name: '',
        title: '',
        department: '',
        email: '',
        phone: '',
        jurisdiction_district: 'Central Infrastructure District'
      });
    } catch (e) {
      alert('Failed to register new consent officer.');
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white flex items-center space-x-3">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
            <span>Consent Officer & Infrastructure Approval Portal</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Official municipal review platform for road repair dispatches, GPS verification, & digital consent sign-off.
          </p>
        </div>

        <button
          onClick={() => setIsAddOfficerOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 hover:border-cyan-500/50 flex items-center space-x-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Register Consent Officer</span>
        </button>
      </div>

      {/* Consent Officers Directory Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {officers.map((officer) => (
          <div key={officer.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl"></div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-['Outfit']">
                {officer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-['Outfit'] font-bold text-sm text-white">{officer.name}</p>
                <p className="text-[11px] text-cyan-400 font-semibold">{officer.title}</p>
              </div>
            </div>
            <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800/80">
              <p className="truncate"><strong className="text-slate-300">Dept:</strong> {officer.department}</p>
              <p className="truncate"><strong className="text-slate-300">District:</strong> {officer.jurisdiction_district}</p>
              <p className="text-[10px] font-mono text-slate-500">{officer.email}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-2xl border border-slate-800 text-xs">
        <div className="flex space-x-2">
          {['ALL', 'PENDING_CONSENT', 'APPROVED', 'REJECTED'].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setSelectedStatus(statusKey)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                selectedStatus === statusKey
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {statusKey === 'ALL' ? 'All Requests' : statusKey.replace('_', ' ')}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-slate-400 pr-3">
          Showing {requests.length} records
        </span>
      </div>

      {/* Consent Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <StatusBadge type="consent" value={item.consent_status} />
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                  Priority #{item.priority_score}
                </span>
              </div>

              <div>
                <h3 className="font-['Outfit'] font-bold text-white text-base truncate">{item.road_name}</h3>
                <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{item.formatted_address || `${item.latitude}, ${item.longitude}`}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Defect Type</span>
                  <span className="font-semibold text-rose-400">{item.damage_type}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Est. Repair Budget</span>
                  <span className="font-semibold text-emerald-400">₹{Math.round(item.estimated_cost_min || 0).toLocaleString()}</span>
                </div>
              </div>

              {item.official_consent_code && (
                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">OFFICIAL CODE:</span>
                  <span className="font-mono font-bold text-cyan-300">{item.official_consent_code}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => handleOpenReview(item)}
              className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <FileText className="w-4 h-4" />
              <span>Review Road Dossier & Sign-Off</span>
            </button>

          </div>
        ))}
      </div>

      {/* REVIEW & SIGN-OFF MODAL */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0D1322] border border-cyan-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-7 h-7 text-cyan-400" />
                <div>
                  <h2 className="font-['Outfit'] font-extrabold text-white text-xl">Official Road Repair Consent Review</h2>
                  <p className="text-xs text-slate-400">Inspection ID #{activeRequest.id} — {activeRequest.road_name}</p>
                </div>
              </div>
              <button onClick={() => setActiveRequest(null)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedbackMsg && (
              <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-sm font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {/* Dossier Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Visual AI Inspection Bounding Box */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">1. AI Damage Detection Evidence</h3>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <BoundingBoxCanvas
                    imageUrl={`http://localhost:8000/uploads/${activeRequest.image_path}`}
                    boundingBox={activeRequest.bounding_box ? JSON.parse(activeRequest.bounding_box) : null}
                    damageType={activeRequest.damage_type}
                    confidence={activeRequest.confidence}
                    severityScore={activeRequest.severity_score}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Severity Score</span>
                    <span className="font-bold text-rose-400">{activeRequest.severity_score} / 100</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Area Risk</span>
                    <span className="font-bold text-white">{activeRequest.damage_area} m²</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Precise Location & Officer Sign-off */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">2. Geospatial Location Details</h3>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <p><strong className="text-cyan-400 font-semibold">Street Address:</strong> {activeRequest.formatted_address || activeRequest.road_name}</p>
                  <p><strong className="text-cyan-400 font-semibold">District:</strong> {activeRequest.district || 'Central District'}</p>
                  <p><strong className="text-cyan-400 font-semibold">Landmark:</strong> {activeRequest.landmark || 'Near Transit Corridor'}</p>
                  <p className="font-mono text-slate-400 pt-1">
                    GPS: <strong className="text-white">{activeRequest.latitude}, {activeRequest.longitude}</strong> (Accuracy: ±{activeRequest.gps_accuracy || 5}m)
                  </p>
                </div>

                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pt-2">3. Officer Decision & Remarks</h3>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter official sign-off notes, traffic diversion guidelines, or approval conditions..."
                  className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-cyan-500"
                />

                {/* Decision Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleReviewAction('REJECTED')}
                    disabled={reviewing}
                    className="py-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 font-['Outfit'] font-bold text-xs hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>REJECT DISPATCH</span>
                  </button>

                  <button
                    onClick={() => handleReviewAction('APPROVED')}
                    disabled={reviewing}
                    className="py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-['Outfit'] font-extrabold text-xs hover:from-cyan-400 hover:to-emerald-400 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>GRANT CONSENT & ISSUE CODE</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* REGISTER OFFICER MODAL */}
      {isAddOfficerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0D1322] border border-cyan-500/30 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-['Outfit'] font-bold text-white text-base">Register New Consent Officer</h3>
              <button onClick={() => setIsAddOfficerOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateOfficer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newOfficer.name}
                  onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                  placeholder="e.g. Er. Suresh Kumar"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Official Title</label>
                <input
                  type="text"
                  required
                  value={newOfficer.title}
                  onChange={(e) => setNewOfficer({ ...newOfficer, title: e.target.value })}
                  placeholder="e.g. Superintending Engineer"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={newOfficer.department}
                  onChange={(e) => setNewOfficer({ ...newOfficer, department: e.target.value })}
                  placeholder="e.g. State Highway Authority"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newOfficer.email}
                  onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                  placeholder="suresh.kumar@highways.gov.in"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Jurisdiction District</label>
                <input
                  type="text"
                  required
                  value={newOfficer.jurisdiction_district}
                  onChange={(e) => setNewOfficer({ ...newOfficer, jurisdiction_district: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold font-['Outfit'] hover:bg-cyan-400 mt-2"
              >
                SAVE OFFICER RECORD
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
