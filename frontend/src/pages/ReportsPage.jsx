import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { FileText, Download, Printer, RotateCw, Shield, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await reportsAPI.getConditionReport();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    window.location.href = reportsAPI.getCSVUrl();
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 text-cyan-400 font-mono text-sm">
          <RotateCw className="w-5 h-5 animate-spin" />
          <span>GENERATING EXECUTIVE REPORT...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 no-print">
        <div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white flex items-center space-x-3">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Executive Infrastructure Reports</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-400">
            Generate formal municipal road condition audits, export CSV data, or print report layouts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 font-semibold text-xs hover:bg-slate-800 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Official Printable Report Container */}
      <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-8 glass-card">
        
        {/* Report Official Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-['Outfit'] text-2xl font-extrabold text-white tracking-wide">
                ROADVISION AI MUNICIPAL ROAD CONDITION AUDIT
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Generated: {data?.generated_at}
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <p>System Ref: RVA-2026-AUDIT</p>
            <p className="text-emerald-400 font-bold">STATUS: AUDITED</p>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-mono">Total Roads Scanned</p>
            <p className="font-['Outfit'] text-2xl font-bold text-white">{data?.total_roads_scanned_km} km</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-mono">Total Defects Found</p>
            <p className="font-['Outfit'] text-2xl font-bold text-cyan-400">{data?.total_damage_detected}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30">
            <p className="text-[10px] text-rose-400 uppercase font-mono">Critical Priority Issues</p>
            <p className="font-['Outfit'] text-2xl font-bold text-rose-400">{data?.critical_issues}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30">
            <p className="text-[10px] text-cyan-400 uppercase font-mono">Est. Total Repair Cost</p>
            <p className="font-['Outfit'] text-2xl font-bold text-cyan-300">{data?.estimated_total_cost}</p>
          </div>
        </div>

        {/* Top Priority Roads Table */}
        <div className="space-y-3">
          <h3 className="font-['Outfit'] text-base font-bold text-white border-b border-slate-800 pb-2">
            Top Priority Dispatch Candidates
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Road Corridor</th>
                  <th className="p-3">Defect Class</th>
                  <th className="p-3">Traffic</th>
                  <th className="p-3">Priority Score</th>
                  <th className="p-3">Priority Level</th>
                  <th className="p-3 text-right">Est Repair Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {data?.top_priority_roads.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-3 font-mono font-bold text-cyan-400">#{idx + 1}</td>
                    <td className="p-3 font-semibold text-white">{item.road}</td>
                    <td className="p-3">{item.damage_type}</td>
                    <td className="p-3">{item.traffic}</td>
                    <td className="p-3 font-bold font-mono text-cyan-300">{item.priority}/100</td>
                    <td className="p-3">
                      <StatusBadge type="priority" value={item.priority_level} />
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-400">{item.cost_range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Footer Disclaimer */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
          <p>{data?.official_disclaimer}</p>
          <p className="text-[10px] mt-1">Certified Software Prototype — ROADVISION AI Engine v1.0</p>
        </div>

      </div>

    </div>
  );
}
