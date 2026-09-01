import React from 'react';

export default function StatusBadge({ type, value }) {
  const strVal = String(value || '').toUpperCase();

  let bgClass = 'bg-slate-800 text-slate-300 border-slate-700';

  if (type === 'severity' || type === 'priority' || type === 'risk') {
    if (strVal === 'CRITICAL' || (strVal === 'HIGH' && type === 'severity')) {
      bgClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    } else if (strVal === 'HIGH') {
      bgClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    } else if (strVal === 'MODERATE' || strVal === 'MEDIUM') {
      bgClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    } else if (strVal === 'MINOR' || strVal === 'LOW' || strVal === 'GOOD') {
      bgClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  } else if (type === 'status') {
    if (strVal === 'PENDING') {
      bgClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    } else if (strVal === 'ASSIGNED') {
      bgClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    } else if (strVal === 'IN PROGRESS') {
      bgClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    } else if (strVal === 'COMPLETED') {
      bgClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  } else if (type === 'consent') {
    if (strVal === 'PENDING_CONSENT') {
      bgClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
    } else if (strVal === 'APPROVED') {
      bgClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    } else if (strVal === 'REJECTED') {
      bgClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    } else {
      bgClass = 'bg-slate-800 text-slate-400 border-slate-700';
    }
  }

  const displayVal = type === 'consent'
    ? (strVal === 'PENDING_CONSENT' ? 'PENDING CONSENT' : strVal === 'APPROVED' ? 'CONSENT APPROVED' : strVal === 'REJECTED' ? 'CONSENT REJECTED' : 'DRAFT')
    : value;

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border tracking-wider uppercase inline-flex items-center space-x-1.5 ${bgClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span>{displayVal}</span>
    </span>
  );
}
