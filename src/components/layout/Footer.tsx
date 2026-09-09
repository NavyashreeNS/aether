import React from 'react';
import { Command, ShieldCheck, Heart, Sparkles, Code2 } from 'lucide-react';

interface FooterProps {
  onOpenShortcuts: () => void;
  airborneSeconds: number;
  thoughtsHeld: number;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenShortcuts,
  airborneSeconds,
  thoughtsHeld
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/60 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 mt-auto text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Live Ledger summary ticker */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300">SESSION:</span>
            <span className="text-cyan-300 font-bold">{formatTime(airborneSeconds)} AIRBORNE</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-slate-300">THOUGHTS HELD:</span>
            <span className="text-purple-300 font-bold">{thoughtsHeld}</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">WCAG 2.1 AAA COMPLIANT</span>
          </div>
        </div>

        {/* Shortcuts & Links */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={onOpenShortcuts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            aria-label="View keyboard shortcuts"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Shortcuts (?)</span>
          </button>

          <a
            href="https://github.com/NavyashreeNS/dwell"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Dwell 2.0</span>
            <span>•</span>
            <span>Frontend Arena</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
