import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'J / ↓', desc: 'Navigate to next thought in feed' },
    { key: 'K / ↑', desc: 'Navigate to previous thought' },
    { key: 'Space', desc: 'Hold to dwell on active thought (release to confer resonance)' },
    { key: 'N', desc: 'Compose and file a new thought into the void' },
    { key: '/', desc: 'Focus discovery search omnibar' },
    { key: 'M', desc: 'Toggle ambient Web Audio synthesis' },
    { key: '?', desc: 'Open / close this shortcuts guide' },
    { key: 'Esc', desc: 'Close any active modal or drawer' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h2 id="shortcuts-title" className="font-display font-bold text-lg">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close shortcuts modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-white/5 my-4">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-body">{item.desc}</span>
              <kbd className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20 font-mono text-[11px] text-cyan-300 shadow-xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            Got It (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
