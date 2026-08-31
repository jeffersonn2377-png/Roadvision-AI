import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Activity,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ScanLine,
  ArrowRight,
  TrendingUp,
  RotateCw,
  Cpu
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const summary = await dashboardAPI.getSummary();
      setData(summary);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to ROADVISION AI backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 text-cyan-400 font-mono text-sm">
          <RotateCw className="w-5 h-5 animate-spin" />
          <span>CONNECTING TO ROADVISION AI ENGINE...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white">
            Smart City Infrastructure Dashboard
          </h1>
          <p className="text-xs lg:text-sm text-slate-400">
            Real-time municipal road network health monitoring & dispatch analytics.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchSummary}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Refresh Data"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <Link
            to="/scanner"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-['Outfit'] font-bold text-white text-xs hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 flex items-center space-x-2"
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan New Road Media</span>
          </Link>
        </div>
      </div>

      {/* Dynamic AI Recommendation Highlight Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/40 space-y-2">
        <div className="flex items-center justify-between text-xs text-cyan-400 font-mono font-bold uppercase tracking-wider">
          <span className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>TOP PRIORITY AI DISPATCH RECOMMENDATION</span>
          </span>
          <span className="bg-cyan-500/20 px-2 py-0.5 rounded text-[10px]">DYNAMIC REASONING</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          "{data?.top_recommendation}"
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Scanned Km */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[11px] text-slate-400 font-medium">Roads Scanned</p>
          <p className="font-['Outfit'] text-2xl font-bold text-white">{data?.roads_scanned_km} km</p>
          <p className="text-[10px] text-emerald-400 font-mono">100% Survey Coverage</p>
        </div>

        {/* Total Damage */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
          <p className="text-[11px] text-slate-400 font-medium">Damage Detected</p>
          <p className="font-['Outfit'] text-2xl font-bold text-cyan-400">{data?.total_damage_count}</p>
          <p className="text-[10px] text-slate-400 font-mono">Across 10 Corridors</p>
        </div>

        {/* Critical */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-1">
          <p className="text-[11px] text-rose-400 font-medium">Critical</p>
          <p className="font-['Outfit'] text-2xl font-bold text-rose-400">{data?.critical_count}</p>
          <p className="text-[10px] text-rose-400 font-mono">Immediate Action</p>
        </div>

        {/* Moderate */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1">
          <p className="text-[11px] text-amber-400 font-medium">Moderate</p>
          <p className="font-['Outfit'] text-2xl font-bold text-amber-400">{data?.moderate_count}</p>
          <p className="text-[10px] text-amber-400 font-mono">Scheduled Patching</p>
        </div>

        {/* Minor */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-1">
          <p className="text-[11px] text-emerald-400 font-medium">Minor</p>
          <p className="font-['Outfit'] text-2xl font-bold text-emerald-400">{data?.minor_count}</p>
          <p className="text-[10px] text-emerald-400 font-mono">Routine Monitor</p>
        </div>

        {/* Repair Cost */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-1">
          <p className="text-[11px] text-cyan-400 font-medium">Est. Repair Cost</p>
          <p className="font-['Outfit'] text-2xl font-bold text-cyan-300">₹{data?.estimated_total_cost_lakh} Lakh</p>
          <p className="text-[10px] text-slate-400 font-mono">Model Estimate</p>
        </div>

      </div>

      {/* Middle Grid: Overall Road Health Gauge & Damage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Road Health Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-['Outfit'] text-base font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Overall Road Health</span>
            </h3>
            <StatusBadge type="severity" value={data?.health_status} />
          </div>

          <div className="text-center py-4 space-y-2">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-slate-800 border-t-cyan-400 border-r-cyan-500 border-b-blue-500 flex items-center justify-center">
                <span className="font-['Outfit'] text-4xl font-extrabold text-white">{data?.overall_road_health}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">Score out of 100</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Optimal Network Target:</span>
              <span className="text-emerald-400 font-semibold">85+</span>
            </div>
            <div className="flex justify-between">
              <span>Current Status:</span>
              <span className="text-cyan-400 font-semibold">{data?.health_status} Condition</span>
            </div>
          </div>
        </div>

        {/* Damage Distribution Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-['Outfit'] text-base font-bold text-white">Damage Distribution</h3>
            <p className="text-xs text-slate-400">Breakdown by AI detected defect classification</p>
          </div>

          <div className="space-y-4">
            {Object.entries(data?.damage_distribution || {}).map(([label, count]) => {
              const total = data?.total_damage_count || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{label}</span>
                    <span className="text-cyan-400 font-mono">{count} defects ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent AI Detections Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-['Outfit'] text-base font-bold text-white">Recent AI Road Detections</h3>
            <p className="text-xs text-slate-400">Live feed from SQLite database REST API</p>
          </div>
          <Link
            to="/priority"
            className="text-xs font-semibold text-cyan-400 hover:underline flex items-center space-x-1"
          >
            <span>View All In Priority Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Road Name</th>
                <th className="p-3">Damage Defect</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Priority Score</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {data?.recent_detections.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono text-cyan-400">#{item.id}</td>
                  <td className="p-3 font-semibold text-white">{item.road_name}</td>
                  <td className="p-3">{item.damage_type}</td>
                  <td className="p-3 font-mono">{Math.round(item.confidence * 100)}%</td>
                  <td className="p-3">
                    <StatusBadge type="severity" value={item.risk_level} />
                  </td>
                  <td className="p-3 font-bold font-mono text-cyan-300">{item.priority_score}/100</td>
                  <td className="p-3">
                    <StatusBadge type="status" value={item.status} />
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/damages/${item.id}`}
                      className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-semibold text-cyan-400 hover:bg-cyan-500/10 border border-slate-700"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
