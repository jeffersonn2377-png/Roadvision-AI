import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, PlayCircle, Cpu, User, LogOut, Activity, MapPin } from 'lucide-react';

export default function Navbar({ onStartJudgeDemo }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const stored = localStorage.getItem('roadvision_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {}
    }
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('roadvision_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform border border-cyan-400/40">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-['Outfit'] font-extrabold text-xl tracking-wider text-white">ROADVISION</span>
              <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded font-mono font-semibold border border-cyan-500/40">AI</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block -mt-1">Smart Infrastructure HUD</span>
          </div>
        </Link>

        {/* Center Live HUD Status */}
        <div className="hidden lg:flex items-center space-x-4 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800 text-xs">
          <div className="flex items-center space-x-2 border-r border-slate-800 pr-4">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-300 font-mono">Engine: <span className="text-cyan-400 font-semibold">DemoDetector v1.0</span></span>
          </div>
          <div className="flex items-center space-x-2 border-r border-slate-800 pr-4">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-mono">SQLite DB: <span className="text-emerald-400 font-semibold">CONNECTED</span></span>
          </div>
          <div className="text-slate-400 font-mono">{time}</div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          
          {/* PROMINENT JUDGE DEMO BUTTON */}
          <button
            onClick={onStartJudgeDemo}
            className="relative group overflow-hidden rounded-xl p-[2px] focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-xl animate-pulse"></span>
            <div className="relative px-4 py-2 bg-slate-950 rounded-[10px] transition duration-200 group-hover:bg-opacity-80 flex items-center space-x-2">
              <span className="text-base">🎯</span>
              <span className="font-['Outfit'] font-bold text-sm text-cyan-300 tracking-wide uppercase">START JUDGE DEMO</span>
            </div>
          </button>

          {/* User Account / Auth */}
          {user ? (
            <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-white">{user.user_name || 'Engineer Admin'}</p>
                <p className="text-[10px] text-slate-400 font-mono">{user.user_email || 'admin@roadvision.ai'}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
            >
              Sign In
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}
