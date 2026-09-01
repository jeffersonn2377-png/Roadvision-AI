import React, { useState, useEffect } from 'react';
import { consentAPI } from '../services/api';
import { ShieldCheck, Send, X, AlertCircle, CheckCircle2, UserCheck, MapPin, DollarSign, FileText } from 'lucide-react';

export default function ConsentDispatchModal({ isOpen, onClose, damageRecord, onDispatchSuccess }) {
  const [officers, setOfficers] = useState([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [notes, setNotes] = useState('');
  const [urgency, setUrgency] = useState('HIGH');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchOfficers();
      setNotes('');
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  const fetchOfficers = async () => {
    try {
      const data = await consentAPI.getOfficers();
      setOfficers(data);
      if (data.length > 0) {
        setSelectedOfficerId(data[0].id.toString());
      }
    } catch (e) {
      console.error('Failed to load consent officers', e);
    }
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!damageRecord) return;
    if (!selectedOfficerId) {
      setError('Please select a Consent Officer.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await consentAPI.dispatchToOfficer({
        damage_id: damageRecord.id,
        consent_officer_id: parseInt(selectedOfficerId, 10),
        dispatch_notes: notes,
        urgency: urgency
      });

      setSuccessMsg(res.message);
      if (onDispatchSuccess) {
        onDispatchSuccess(res);
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to dispatch to Consent Officer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !damageRecord) return null;

  const selectedOfficer = officers.find(o => o.id.toString() === selectedOfficerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0D1322] border border-cyan-500/40 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-extrabold text-white text-lg flex items-center space-x-2">
                <span>Dispatch Road Details to Consent Officer</span>
                <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-2 py-0.5 rounded font-mono font-semibold border border-cyan-500/40">OFFICIAL SANCTION</span>
              </h3>
              <p className="text-xs text-slate-400">Transmit location GPS, damage inspection photo, AI metrics & repair estimate for sign-off</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleDispatch} className="p-6 space-y-6">

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Road Summary Packet Preview */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">DISPATCH INSPECTION PACKET SUMMARY</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500">Road Location</p>
                <p className="font-semibold text-white truncate">{damageRecord.road_name}</p>
                <p className="text-[11px] text-slate-400 truncate">{damageRecord.formatted_address || `${damageRecord.latitude}, ${damageRecord.longitude}`}</p>
              </div>
              <div>
                <p className="text-slate-500">Defect & Severity</p>
                <p className="font-semibold text-rose-400">{damageRecord.damage_type} ({damageRecord.severity_score}/100)</p>
                <p className="text-[11px] text-slate-400">Confidence: {Math.round((damageRecord.confidence || 0.9) * 100)}%</p>
              </div>
              <div>
                <p className="text-slate-500">Priority Score</p>
                <p className="font-semibold text-cyan-300 font-['Outfit'] text-sm">{damageRecord.priority_score} / 100 ({damageRecord.priority_level})</p>
              </div>
              <div>
                <p className="text-slate-500">Est. Repair Budget</p>
                <p className="font-semibold text-emerald-400">₹{Math.round(damageRecord.estimated_cost_min || 0).toLocaleString()} – ₹{Math.round(damageRecord.estimated_cost_max || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Officer Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 font-['Outfit']">
              Select Designated Consent Officer:
            </label>
            <select
              value={selectedOfficerId}
              onChange={(e) => setSelectedOfficerId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500"
            >
              {officers.map((officer) => (
                <option key={officer.id} value={officer.id}>
                  {officer.name} — {officer.title} ({officer.department})
                </option>
              ))}
            </select>
            {selectedOfficer && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs text-slate-400 space-y-1">
                <p><strong className="text-slate-200">Email:</strong> {selectedOfficer.email} | <strong className="text-slate-200">Phone:</strong> {selectedOfficer.phone || 'N/A'}</p>
                <p><strong className="text-slate-200">Jurisdiction:</strong> {selectedOfficer.jurisdiction_district}</p>
              </div>
            )}
          </div>

          {/* Urgency & Field Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Dispatch Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="CRITICAL">🔴 CRITICAL (Immediate Hazard)</option>
                <option value="HIGH">🟠 HIGH (Priority Maintenance)</option>
                <option value="MEDIUM">🟡 MEDIUM (Scheduled Repair)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Engineering Notes for Officer</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Needs immediate asphalt filling clearance before heavy monsoon rain."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-['Outfit'] font-bold text-xs text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'DISPATCHING DATA...' : 'TRANSMIT ROAD DETAILS & REQUEST CONSENT'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
