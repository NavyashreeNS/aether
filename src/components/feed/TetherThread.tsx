import React, { useState } from 'react';
import { CornerDownRight, Send, Sparkles } from 'lucide-react';
import { Tether, User } from '../../types';

interface TetherThreadProps {
  echoId: string;
  tethers: Tether[];
  currentUser: User;
  onAddTether: (echoId: string, text: string) => void;
}

export const TetherThread: React.FC<TetherThreadProps> = ({
  echoId,
  tethers,
  currentUser,
  onAddTether
}) => {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsSubmitting(true);
    onAddTether(echoId, inputText.trim());
    setInputText('');
    setIsSubmitting(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
      {/* Existing Tethers */}
      {tethers.length > 0 && (
        <div className="space-y-3 pl-3 sm:pl-6 border-l-2 border-cyan-400/20">
          {tethers.map((tether) => (
            <div
              key={tether.id}
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <img
                    src={tether.avatar}
                    alt={tether.author}
                    className="w-5 h-5 rounded-full object-cover border border-cyan-400/30"
                  />
                  <span className="font-semibold text-slate-200">{tether.author}</span>
                  <span className="text-slate-500">{tether.handle}</span>
                </div>
                <span className="text-[10px] text-slate-500">{tether.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 font-body leading-relaxed pl-7">
                {tether.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Attach a Tether Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pl-3 sm:pl-6">
        <CornerDownRight className="w-4 h-4 text-cyan-400/60 shrink-0" />
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tether an answer... (stays in constellation with this thought)"
            maxLength={180}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-body text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim() || isSubmitting}
          aria-label="Submit tethered response"
          className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 disabled:opacity-30 text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tether</span>
        </button>
      </form>
    </div>
  );
};
