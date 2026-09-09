import React from 'react';
import { BarChart3, CheckCircle2, HelpCircle } from 'lucide-react';
import { Poll } from '../../types';

interface DailyPollProps {
  poll: Poll;
  onVote: (optionId: string) => void;
}

export const DailyPoll: React.FC<DailyPollProps> = ({ poll, onVote }) => {
  const hasVoted = Boolean(poll.userVotedId);

  return (
    <article
      aria-labelledby="poll-question"
      className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/20 via-slate-900/40 to-slate-900/60 border border-purple-500/20 backdrop-blur-xl shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
          <BarChart3 className="w-4 h-4" />
        </span>
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple-300">
          Community Sentiment Inquiry
        </span>
        <span className="text-[10px] text-slate-500 font-mono ml-auto">
          {poll.totalVotes.toLocaleString()} votes cast
        </span>
      </div>

      <h3 id="poll-question" className="font-display font-semibold text-base sm:text-lg text-slate-100 mb-1">
        {poll.question}
      </h3>
      <p className="text-xs text-slate-400 font-body mb-5">{poll.description}</p>

      {/* Poll Options */}
      <div className="space-y-2.5" role="radiogroup" aria-labelledby="poll-question">
        {poll.options.map((option) => {
          const isSelected = poll.userVotedId === option.id;
          const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;

          return (
            <button
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              disabled={hasVoted}
              onClick={() => onVote(option.id)}
              className={`relative w-full text-left p-3.5 rounded-2xl border transition-all overflow-hidden cursor-pointer ${
                isSelected
                  ? 'border-purple-400/60 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(139,124,255,0.2)]'
                  : hasVoted
                  ? 'border-white/5 bg-white/[0.02] text-slate-300'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-400/40 text-slate-200'
              }`}
            >
              {/* Animated fill bar when voted */}
              {hasVoted && (
                <div
                  className="absolute inset-y-0 left-0 bg-purple-500/20 transition-all duration-700 pointer-events-none rounded-xl"
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />}
                  <span className="font-body text-slate-200">{option.text}</span>
                </div>
                {hasVoted && (
                  <span className="font-bold text-purple-300 shrink-0">{percentage}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {hasVoted && (
        <p className="mt-3 text-[11px] font-mono text-purple-300/80 text-center">
          ✓ Your perspective has been anchored into the inquiry ledger.
        </p>
      )}
    </article>
  );
};
