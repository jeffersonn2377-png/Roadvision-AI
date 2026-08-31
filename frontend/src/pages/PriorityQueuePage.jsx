import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { priorityAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { ListOrdered, Search, Cpu, ArrowRight, RotateCw, Calculator, Sliders, CheckCircle2 } from 'lucide-react';

export default function PriorityQueuePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  // Custom Priority Calculator state
  const [showCalc, setShowCalc] = useState(false);
  const [calcSev, setCalcSev] = useState(85);
  const [calcArea, setCalcArea] = useState(2.5);
  const [calcTraffic, setCalcTraffic] = useState('HIGH');
  const [calcImportance, setCalcImportance] = useState('Highway');
  const [calcResult, setCalcResult] = useState(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await priorityAPI.getQueue();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleCalculateCustom = async () => {
    try {
      const res = await priorityAPI.calculate({
        severity_score: calcSev,
        damage_area: calcArea,
        traffic_level: calcTraffic,
        road_importance: calcImportance
      });
      setCalcResult(res);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredQueue = (data?.queue || []).filter((item) => {
    if (search && !item.road.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== 'ALL' && item.damage_type !== filterType) return false;
    if (filterPriority !== 'ALL' && item.priority_level !== filterPriority) return false;
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white flex items-center space-x-3">
            <ListOrdered className="w-6 h-6 text-cyan-400" />
            <span>Intelligent Repair Priority Queue</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-400">
            Multi-factor weighted ranking: Severity (35%) + Area Risk (30%) + Traffic Volume (20%) + Road Importance (15%).
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCalc(!showCalc)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/10 flex items-center space-x-2"
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>{showCalc ? 'Close Calculator' : 'Interactive Priority Calculator'}</span>
          </button>
          <button
            onClick={fetchQueue}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dynamic AI Recommendation Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/40 space-y-2 shadow-xl shadow-cyan-500/10">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span>DYNAMIC AI REPAIR RECOMMENDATION ENGINE</span>
        </div>
        <p className="text-sm sm:text-base text-slate-100 font-semibold leading-relaxed">
          "{data?.ai_recommendation}"
        </p>
      </div>

      {/* Interactive Custom Priority Calculator Panel */}
      {showCalc && (
        <div className="p-6 rounded-2xl bg-slate-900/95 border border-cyan-500/50 space-y-4">
          <h3 className="font-['Outfit'] text-base font-bold text-cyan-300 flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>Interactive Priority Formula Sandbox</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Severity Score (35%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={calcSev}
                onChange={(e) => setCalcSev(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Damage Area $m^2$ (30%)</label>
              <input
                type="number"
                step="0.1"
                value={calcArea}
                onChange={(e) => setCalcArea(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Traffic Level (20%)</label>
              <select
                value={calcTraffic}
                onChange={(e) => setCalcTraffic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="HIGH">HIGH (100 pts)</option>
                <option value="MEDIUM">MEDIUM (60 pts)</option>
                <option value="LOW">LOW (30 pts)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Road Importance (15%)</label>
              <select
                value={calcImportance}
                onChange={(e) => setCalcImportance(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="Highway">Highway (100 pts)</option>
                <option value="Arterial">Arterial (85 pts)</option>
                <option value="Collector">Collector (60 pts)</option>
                <option value="Local">Local (35 pts)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleCalculateCustom}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
            >
              Calculate Priority Score
            </button>
            {calcResult && (
              <div className="text-right">
                <span className="font-['Outfit'] font-extrabold text-2xl text-cyan-300">
                  {calcResult.priority_score} / 100
                </span>
                <span className="ml-2 text-xs uppercase text-slate-400 font-mono">[{calcResult.priority_level}]</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Search Road Name</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search e.g. MG Road..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Filter Defect Class</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="ALL">All Damage Types</option>
            <option value="Pothole">Pothole</option>
            <option value="Crack">Crack</option>
            <option value="Broken Road Edge">Broken Road Edge</option>
            <option value="Surface Deterioration">Surface Deterioration</option>
            <option value="Damaged Road Marking">Damaged Marking</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Filter Priority Rank</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          >
            <option value="ALL">All Priority Levels</option>
            <option value="CRITICAL">Critical (81-100)</option>
            <option value="HIGH">High (61-80)</option>
            <option value="MEDIUM">Medium (41-60)</option>
            <option value="LOW">Low (0-40)</option>
          </select>
        </div>
      </div>

      {/* Queue Cards List */}
      <div className="space-y-4">
        {filteredQueue.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 font-['Outfit'] font-extrabold text-cyan-400 flex items-center justify-center text-sm shrink-0">
                #{item.rank}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-['Outfit'] font-bold text-base text-white">{item.road}</h3>
                  <StatusBadge type="priority" value={item.priority_level} />
                </div>
                <p className="text-xs text-slate-400">
                  Defect: <span className="text-cyan-300 font-semibold">{item.damage_type}</span> | Traffic: <span className="text-slate-200">{item.traffic_level}</span> | Importance: <span className="text-slate-200">{item.road_importance}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Est. Repair Cost: <span className="text-emerald-400 font-semibold">{item.estimated_cost}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 self-end md:self-auto">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-mono">PRIORITY SCORE</p>
                <p className="font-['Outfit'] font-extrabold text-2xl text-cyan-300">{item.priority_score}<span className="text-xs font-normal text-slate-500">/100</span></p>
              </div>

              <Link
                to={`/damages/${item.id}`}
                className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/10"
              >
                Inspect Details
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
