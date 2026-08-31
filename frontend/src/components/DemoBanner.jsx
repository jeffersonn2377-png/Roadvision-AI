import React from 'react';
import { AlertTriangle, Cpu } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs sm:text-sm text-amber-300 flex items-center justify-between no-print">
      <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
        <Cpu className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <span className="font-medium tracking-wide">
          <strong className="text-amber-400 uppercase tracking-wider font-bold mr-1">DEMO AI MODE —</strong>
          Detection results are simulated unless a trained YOLO model is configured.
        </span>
      </div>
    </div>
  );
}
