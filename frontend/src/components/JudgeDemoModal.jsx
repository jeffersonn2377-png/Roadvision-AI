import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoAPI } from '../services/api';
import { CheckCircle2, Play, Cpu, MapPin, Calculator, ShieldAlert, DollarSign, Database, ArrowRight, X, ShieldCheck } from 'lucide-react';

export default function JudgeDemoModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [demoResult, setDemoResult] = useState(null);

  const steps = [
    { title: 'Image Ingestion & EXIF GPS', icon: Cpu, desc: 'Simulating EXIF photo scan input (MG Road Expressway).' },
    { title: 'AI Visual Detection', icon: ShieldAlert, desc: 'Engine v2.0 running neural inference: Pothole detected (94% confidence).' },
    { title: 'Reverse Geocoding', icon: MapPin, desc: 'OSM Address lookup: MG Road, Central Infrastructure District (±4.5m accuracy).' },
    { title: 'Multi-Factor Priority', icon: Calculator, desc: 'Weighted algorithm: Severity (35%) + Area (30%) + Traffic (20%) + Importance (15%).' },
    { title: 'Cost Estimation', icon: DollarSign, desc: 'Engineering repair cost model: ₹3,800 – ₹4,600.' },
    { title: 'Consent Officer Dispatch', icon: ShieldCheck, desc: 'Dispatching details to Consent Officer Er. Rajesh Sharma & approving code CONSENT-2026-9821.' }
  ];

  const handleStartRun = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setDemoResult(null);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    try {
      const res = await demoAPI.runJudgeDemo();
      setDemoResult(res);
      setCurrentStep(steps.length);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-[#0B0F19] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl shadow-cyan-500/20 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl">
            🎯
          </div>
          <div>
            <h2 className="font-['Outfit'] text-xl font-bold text-white flex items-center space-x-2">
              <span>JUDGE DEMO AUTOMATED WORKFLOW</span>
              <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-cyan-500/40">
                REST API v2.0
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Demonstrating full ROADVISION AI pipeline: EXIF GPS, Reverse Geocoding, Priority, & Consent Officer Approval.
            </p>
          </div>
        </div>

        {/* Workflow Steps Indicator */}
        <div className="space-y-3 mb-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = currentStep > idx || demoResult !== null;
            const isCurrent = currentStep === idx && isRunning;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                  isCurrent
                    ? 'bg-cyan-500/10 border-cyan-500/60 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                    : isDone
                    ? 'bg-slate-900/80 border-emerald-500/40'
                    : 'bg-slate-950 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isCurrent
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isCurrent ? 'text-cyan-300' : isDone ? 'text-emerald-300' : 'text-slate-400'}`}>
                      Step {idx + 1}: {step.title}
                    </p>
                    <p className="text-[11px] text-slate-400">{step.desc}</p>
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-mono text-cyan-400 animate-ping">PROCESSING...</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Result Summary Box if Completed */}
        {demoResult && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 mb-6 space-y-2 text-xs">
            <div className="flex items-center justify-between text-emerald-400 font-semibold font-['Outfit'] text-sm">
              <span>✅ PIPELINE & CONSENT SANCTION SUCCESSFUL</span>
              <span className="font-mono text-cyan-300">CODE: {demoResult.official_consent_code}</span>
            </div>
            <p className="text-slate-300 italic">"{demoResult.ai_recommendation}"</p>
          </div>
        )}

        {/* Modal Controls */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
          {!demoResult ? (
            <button
              onClick={handleStartRun}
              disabled={isRunning}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-['Outfit'] font-bold text-white text-sm hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? 'RUNNING PIPELINE...' : 'EXECUTE DEMO PIPELINE'}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/consent-officers');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300 hover:border-cyan-500/50"
              >
                View Consent Portal
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/map');
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 flex items-center space-x-1"
              >
                <span>View On Interactive Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
