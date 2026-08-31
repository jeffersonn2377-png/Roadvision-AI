import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Eye, MapPin, Gauge, ListOrdered, TrendingUp, Cpu, CheckCircle2, Play, Sparkles } from 'lucide-react';

export default function LandingPage({ onStartJudgeDemo }) {
  const pipelineSteps = [
    { name: 'DETECT', desc: 'AI visual scanning of images & videos.', icon: Eye, color: 'text-cyan-400', border: 'border-cyan-500/40' },
    { name: 'LOCATE', desc: 'Geospatial mapping via browser/GPS.', icon: MapPin, color: 'text-blue-400', border: 'border-blue-500/40' },
    { name: 'ASSESS', desc: 'Severity (0-100) & risk evaluation.', icon: Gauge, color: 'text-amber-400', border: 'border-amber-500/40' },
    { name: 'PRIORITIZE', desc: 'Multi-factor weighted ranking.', icon: ListOrdered, color: 'text-purple-400', border: 'border-purple-500/40' },
    { name: 'PREDICT', desc: '30-day health deterioration model.', icon: TrendingUp, color: 'text-emerald-400', border: 'border-emerald-500/40' },
    { name: 'PREVENT', desc: 'Optimized dispatch & maintenance.', icon: CheckCircle2, color: 'text-rose-400', border: 'border-rose-500/40' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-cyan-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SMART CITY INFRASTRUCTURE PLATFORM</span>
          </div>

          <h1 className="font-['Outfit'] text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            ROADVISION <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="font-['Outfit'] text-xl sm:text-2xl text-cyan-200/90 font-medium max-w-3xl mx-auto">
            "From Road Images to Intelligent Maintenance Decisions."
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            An AI-powered platform that detects road damage, maps its location, evaluates severity, predicts deterioration and prioritizes road repairs.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-['Outfit'] font-bold text-white hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={onStartJudgeDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 border border-cyan-500/50 text-cyan-300 font-['Outfit'] font-bold hover:bg-cyan-500/10 transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-current" />
              <span>Try Judge Demo</span>
            </button>
          </div>

          {/* Hardware-Free Highlight Badge */}
          <div className="pt-8 flex items-center justify-center">
            <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center space-x-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span><strong>100% Software Prototype:</strong> Runs using uploaded road media & software GPS (No ESP32/Hardware needed).</span>
            </div>
          </div>

        </div>
      </section>

      {/* Visual Pipeline Section */}
      <section className="py-16 px-4 bg-slate-950 border-y border-slate-800">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-white">
              End-to-End Maintenance Intelligence Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Transforming raw road images into actionable municipal dispatch decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl bg-slate-900 border ${step.border} text-center space-y-3 relative group hover:scale-[1.02] transition-transform`}
                >
                  <div className={`w-10 h-10 mx-auto rounded-lg bg-slate-950 flex items-center justify-center ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-['Outfit'] font-bold text-sm tracking-wide text-white">{step.name}</div>
                  <p className="text-[11px] text-slate-400 leading-tight">{step.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
