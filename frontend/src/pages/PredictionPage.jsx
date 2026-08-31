import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle2, RotateCw, Cpu, ShieldAlert } from 'lucide-react';

export default function PredictionPage() {
  const [selectedRoad, setSelectedRoad] = useState('MG Road');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPrediction = async (road) => {
    setLoading(true);
    try {
      const res = await analyticsAPI.getPrediction(road);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction(selectedRoad);
  }, [selectedRoad]);

  // Combine historical + projected points for Recharts visualization
  const combinedPoints = [
    ...(data?.historical_points || []).map(p => ({ month: p.month, health: p.health, type: 'Historical' })),
    ...(data?.projected_points || []).map(p => ({ month: p.month, predicted_health: p.health, type: 'Projected' }))
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <span>AI Predictive Maintenance Engine</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-400">
            Trend decay model projecting 30-day road deterioration and preventive maintenance actions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedRoad}
            onChange={(e) => setSelectedRoad(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
          >
            <option value="MG Road">MG Road</option>
            <option value="Anna Nagar 2nd Avenue">Anna Nagar 2nd Avenue</option>
            <option value="Outer Ring Road">Outer Ring Road</option>
            <option value="Central Avenue">Central Avenue</option>
          </select>

          <button
            onClick={() => fetchPrediction(selectedRoad)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mandatory Prototype Prediction Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium font-mono">PROTOTYPE PREDICTION — BASED ON HISTORICAL TREND DATA</span>
        </div>
        <span className="text-[10px] text-slate-400">Linear Decay Regression Model</span>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Current Health */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <p className="text-xs text-slate-400 font-semibold uppercase">Current Road Health</p>
          <p className="font-['Outfit'] text-4xl font-extrabold text-white">{data?.current_health} <span className="text-sm font-normal text-slate-500">/ 100</span></p>
          <p className="text-[11px] text-slate-400">Based on June survey audit</p>
        </div>

        {/* Projected 30-Day Health */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-2">
          <p className="text-xs text-rose-400 font-semibold uppercase">Projected 30-Day Health</p>
          <p className="font-['Outfit'] text-4xl font-extrabold text-rose-400">{data?.predicted_30d_health} <span className="text-sm font-normal text-slate-500">/ 100</span></p>
          <p className="text-[11px] text-rose-400 font-mono">Monthly Decay: -{data?.decay_rate_per_month} pts/mo</p>
        </div>

        {/* Projected Risk Level */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2">
          <p className="text-xs text-amber-400 font-semibold uppercase">Deterioration Risk Level</p>
          <div className="pt-1">
            <StatusBadge type="risk" value={data?.risk_level} />
          </div>
          <p className="text-[11px] text-slate-400 pt-2">Requires preventive action</p>
        </div>

      </div>

      {/* AI Preventive Action Plan Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
        <h3 className="font-['Outfit'] text-base font-bold text-cyan-300 flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <span>AI Preventive Maintenance Action Plan</span>
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          "{data?.recommendation}"
        </p>
      </div>

      {/* Recharts Deterioration & Projection Graph */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="font-['Outfit'] text-base font-bold text-white">
          Historical Deterioration vs 30/60/90-Day Projection
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1F293D', borderRadius: '0.75rem' }} />
              <Legend />
              <Line name="Historical Audit" type="monotone" dataKey="health" stroke="#06B6D4" strokeWidth={3} dot={{ r: 5 }} />
              <Line name="Projected Decay" type="monotone" dataKey="predicted_health" stroke="#F43F5E" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
