import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanLine,
  MapPin,
  ListOrdered,
  BarChart3,
  TrendingUp,
  Wrench,
  FileText,
  Settings,
  Home,
  Sliders,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { label: 'Landing Page', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Road Scanner', path: '/scanner', icon: ScanLine, highlight: true },
    { label: 'Damage Map', path: '/map', icon: MapPin },
    { label: 'Priority Queue', path: '/priority', icon: ListOrdered },
    { label: 'Consent Officers', path: '/consent-officers', icon: ShieldCheck, highlightBadge: 'NEW' },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Prediction Engine', path: '/prediction', icon: TrendingUp },
    { label: 'Maintenance Portal', path: '/maintenance', icon: Wrench },
    { label: 'Reports & Export', path: '/reports', icon: FileText },
    { label: 'System Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-slate-800 shrink-0 min-h-[calc(100vh-65px)] p-4 no-print hidden md:block">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
          Navigation Portal
        </p>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`
              }
            >
              <Icon className={`w-4 h-4 ${item.highlight || item.highlightBadge ? 'text-cyan-400' : ''}`} />
              <span>{item.label}</span>
              {item.highlight && (
                <span className="ml-auto bg-cyan-500/20 text-cyan-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                  AI
                </span>
              )}
              {item.highlightBadge && (
                <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                  {item.highlightBadge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 p-3 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Precision Geocoding</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          EXIF GPS extraction, Osm reverse lookup, & direct Consent Officer sanctioning.
        </p>
      </div>
    </aside>
  );
}
