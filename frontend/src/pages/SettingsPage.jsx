import React, { useState } from 'react';
import { demoAPI } from '../services/api';
import { Settings, Cpu, Database, Save, RotateCcw, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SettingsPage() {
  const [aiMode, setAiMode] = useState('demo');
  const [costMultiplier, setCostMultiplier] = useState(1.0);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetDemoData = async () => {
    if (!window.confirm('Are you sure you want to reset and re-seed the demo database? All newly uploaded records will be reset.')) {
      return;
    }
    setIsResetting(true);
    setMessage('');
    try {
      const res = await demoAPI.resetDemo();
      setMessage(res.message);
    } catch (e) {
      setMessage('Failed to reset database.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white flex items-center space-x-3">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>System Settings & Configuration</span>
        </h1>
        <p className="text-xs lg:text-sm text-slate-400">
          Manage AI detection model weights, cost estimation formulas, and database seeding.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* AI Model Configuration Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="font-['Outfit'] text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>AI Detection Engine Selection</span>
        </h3>

        <div className="space-y-3">
          <label className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="ai_mode"
              value="demo"
              checked={aiMode === 'demo'}
              onChange={() => setAiMode('demo')}
              className="mt-1 accent-cyan-500"
            />
            <div>
              <p className="text-xs font-bold text-cyan-300">DemoDetector v1.0 (Active Simulator)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Software prototype engine returning structured bounding boxes, confidence %, and area metrics without requiring PyTorch/GPU.
              </p>
            </div>
          </label>

          <label className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 cursor-pointer opacity-60">
            <input
              type="radio"
              name="ai_mode"
              value="yolo"
              checked={aiMode === 'yolo'}
              onChange={() => setAiMode('yolo')}
              className="mt-1"
            />
            <div>
              <p className="text-xs font-bold text-slate-300">YOLODetector (Trained PyTorch Model Placeholder)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Modular slot to drop in trained YOLOv8 / YOLOv9 weights (.pt / .onnx). Currently unconfigured.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Cost Multiplier Configuration Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="font-['Outfit'] text-base font-bold text-white border-b border-slate-800 pb-3">
          Repair Cost Formula Multiplier
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Inflation / Regional Cost Index Multiplier</span>
            <span className="text-cyan-400 font-mono">{costMultiplier}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={costMultiplier}
            onChange={(e) => setCostMultiplier(parseFloat(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <p className="text-[11px] text-slate-400">
            Adjusts min & max INR (₹) estimates for material & labor cost variations across municipal zones.
          </p>
        </div>
      </div>

      {/* Database Reset Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-4">
        <h3 className="font-['Outfit'] text-base font-bold text-rose-400 flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Database className="w-4 h-4 text-rose-400" />
          <span>Demo Database Reset & Re-Seed</span>
        </h3>

        <p className="text-xs text-slate-400">
          Resets SQLite database tables and populates fresh sample records (20+ damage records, 10 roads, historical history, maintenance tickets).
        </p>

        <button
          onClick={handleResetDemoData}
          disabled={isResetting}
          className="px-5 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 font-['Outfit'] font-bold text-rose-300 text-xs hover:bg-rose-500/30 flex items-center space-x-2 disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isResetting ? 'Resetting Database...' : 'Reset Demo Database To Factory Seed'}</span>
        </button>
      </div>

    </div>
  );
}
