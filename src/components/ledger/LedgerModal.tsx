import React from 'react';
import { X, Clock, Eye, Sparkles, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { LedgerState } from '../../types';

interface LedgerModalProps {
  isOpen: boolean;
  ledger: LedgerState;
  onClose: () => void;
  onEraseTraces: () => void;
}

export const LedgerModal: React.FC<LedgerModalProps> = ({
  isOpen,
  ledger,
  onClose,
  onEraseTraces
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}m ${s.toString().padStart(2, '0')}s`;
  };

  const mindfulRatio = ledger.thoughtsPassed > 0
    ? ((ledger.thoughtsHeld / ledger.thoughtsPassed) * 100).toFixed(1)
    : '100.0';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ledger-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-6 sm:p-7 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 id="ledger-title" className="font-display font-bold text-lg">
                The Personal Attention Ledger
              </h2>
              <p className="text-xs text-slate-400 font-body">
                The metric platforms measure on you, handed back to you as your sovereign account.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close ledger"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Statement of Account */}
        <div className="my-6 space-y-4 font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <span className="text-[11px] text-slate-400 uppercase tracking-widest block">
              Live Session Balance
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block">TIME AIRBORNE</span>
                <span className="text-base font-bold text-cyan-300">{formatTime(ledger.airborneSeconds)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">THOUGHTS PASSED</span>
                <span className="text-base font-bold text-slate-300">{ledger.thoughtsPassed}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">THOUGHTS HELD</span>
                <span className="text-base font-bold text-purple-300">{ledger.thoughtsHeld}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">SECONDS GIVEN</span>
                <span className="text-base font-bold text-emerald-300">+{ledger.secondsGiven}s</span>
              </div>
            </div>
          </div>

          {/* Attention Quotient */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border border-cyan-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-cyan-300 block">Contemplative Ratio</span>
              <p className="text-[11px] text-slate-400 font-body">
                {ledger.thoughtsHeld} thoughts held out of {ledger.thoughtsPassed} encountered.
              </p>
            </div>
            <span className="font-display font-black text-2xl text-cyan-300">{mindfulRatio}%</span>
          </div>

          {/* Economic Rule Reminders */}
          <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 text-[11px] text-slate-400 space-y-1 font-body">
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-300">
              Invariant Economic Laws:
            </div>
            <p>• Tapping under 1 second confers 0 resonance — a tap cannot approve what it did not read.</p>
            <p>• Maximum +30 resonance per individual hold; lifetime cap of +40 to prevent farming.</p>
            <p>• Resonance ceiling clamped at 100.</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Erase all session traces and reset local storage?')) {
                onEraseTraces();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Erase My Traces</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs font-mono font-medium text-slate-200 transition-colors cursor-pointer"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
