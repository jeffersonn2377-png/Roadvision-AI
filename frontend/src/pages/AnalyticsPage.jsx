import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, RotateCw, PieChart as PieIcon, Activity } from 'lucide-react';

const COLORS = ['#06B6D4', '#3B82F6', '#F59E0B', '#F43F5E', '#8B5CF6'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await analyticsAPI.getSummary();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 text-cyan-400 font-mono text-sm">
          <RotateCw className="w-5 h-5 animate-spin" />
          <span>LOADING ANALYTICS API DATA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Infrastructure Analytics & Health Trends</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-400">
            Interactive Recharts visualizations computed dynamically from SQLite backend data.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid 1: Damage by Type & Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Damage by Type (Bar Chart) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="font-['Outfit'] text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Damage Defects by Classification</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.damage_by_type}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" />
                <XAxis dataKey="type" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1F293D', borderRadius: '0.75rem' }}
                  labelStyle={{ color: '#06B6D4' }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution (Donut Chart) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="font-['Outfit'] text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <PieIcon className="w-4 h-4 text-cyan-400" />
            <span>Severity Level Distribution</span>
          </h3>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.severity_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.severity_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1F293D', borderRadius: '0.75rem' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid 2: Road Health Trend & Damage Growth Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Road Health Trend (Line Chart) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="font-['Outfit'] text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>6-Month Network Health Trend (Index 0-100)</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.road_health_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1F293D', borderRadius: '0.75rem' }}
                />
                <Line type="monotone" dataKey="health" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Damage Growth Timeline (Line Chart) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="font-['Outfit'] text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <span>Cumulative Damage Growth Timeline</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.damage_growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1F293D', borderRadius: '0.75rem' }}
                />
                <Line type="monotone" dataKey="new_damages" stroke="#F43F5E" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
