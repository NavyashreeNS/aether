import React, { useState } from 'react';
import {
  MessageSquare,
  Repeat2,
  Bookmark,
  Share2,
  UserPlus,
  UserCheck,
  Check,
  MapPin,
  Clock,
  Layers
} from 'lucide-react';
import { Echo, User } from '../../types';
import { DwellButton } from '../common/DwellButton';
import { TetherThread } from './TetherThread';

interface EchoCardProps {
  echo: Echo;
  currentUser: User;
  activeHoldingId: string | null;
  holdProgress: number;
  holdingSeconds: number;
  isCaught: boolean;
  onStartHold: (echoId: string) => void;
  onReleaseHold: (userHoldSeconds: number) => void;
  onCancelHold: () => void;
  onToggleBookmark: (echoId: string) => void;
  onToggleRepost: (echoId: string) => void;
  onToggleFollow: (authorHandle: string) => void;
  onAddTether: (echoId: string, text: string) => void;
  onSelectTag: (tag: string) => void;
  onShare: (echo: Echo) => void;
}

export const EchoCard: React.FC<EchoCardProps> = ({
  echo,
  currentUser,
  activeHoldingId,
  holdProgress,
  holdingSeconds,
  isCaught,
  onStartHold,
  onReleaseHold,
  onCancelHold,
  onToggleBookmark,
  onToggleRepost,
  onToggleFollow,
  onAddTether,
  onSelectTag,
  onShare
}) => {
  const [showTethers, setShowTethers] = useState(false);
  const isHolding = activeHoldingId === echo.id;

  // Waveform heights computed deterministically from echo id
  const waveformBars = [40, 70, 95, 60, 85, 100, 55, 75, 45, 90, 65, 80, 50, 85, 60];

  return (
    <article
      role="article"
      aria-label={`Thought by ${echo.author}`}
      className={`group relative rounded-3xl p-6 sm:p-7 border backdrop-blur-xl transition-all duration-300 ${
        isHolding
          ? 'bg-slate-900/90 border-cyan-400/60 shadow-[0_0_40px_rgba(94,231,255,0.2)] scale-[1.01]'
          : echo.userHeld
          ? 'bg-slate-900/50 border-cyan-500/30'
          : 'bg-white/[0.03] hover:bg-white/[0.05] border-white/10 hover:border-white/20'
      }`}
    >
      {/* Specular hairline top glow */}
      <div
        className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Header: Author info, place, age, depth */}
      <header className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={echo.avatar}
            alt={echo.author}
            className="w-10 h-10 rounded-2xl object-cover border border-white/10 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-slate-100">{echo.author}</span>
              <span className="font-mono text-xs text-slate-500">{echo.handle}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {echo.place}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {echo.ageMinutes}m ago
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-300/80">
                <Layers className="w-3 h-3" />
                {(echo.depth / 1000).toFixed(1)} km
              </span>
            </div>
          </div>
        </div>

        {/* Follow Author Button */}
        <button
          type="button"
          onClick={() => onToggleFollow(echo.handle)}
          aria-label={echo.isAuthorFollowed ? `Unfollow ${echo.author}` : `Follow ${echo.author}`}
          className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
            echo.isAuthorFollowed
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
              : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10'
          }`}
        >
          {echo.isAuthorFollowed ? (
            <>
              <UserCheck className="w-3 h-3" />
              <span>Attuned</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3 h-3" />
              <span>Attune</span>
            </>
          )}
        </button>
      </header>

      {/* Thought Content Body */}
      <p className="font-display font-medium text-lg sm:text-xl text-slate-100 leading-snug tracking-tight mb-4 text-balance">
        {echo.text}
      </p>

      {/* Audio Waveform Visualization */}
      <div
        className="flex items-end gap-1.5 h-6 my-4 opacity-75 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        {waveformBars.map((height, i) => (
          <span
            key={i}
            className="flex-1 rounded-full transition-all duration-300"
            style={{
              height: `${isHolding ? Math.min(100, height + holdingSeconds * 5) : height}%`,
              backgroundColor: echo.color,
              opacity: isHolding ? 0.9 : 0.45
            }}
          />
        ))}
      </div>

      {/* Topic Tags */}
      {echo.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5" aria-label="Tags">
          {echo.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectTag(tag)}
              className="px-2.5 py-0.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 text-[11px] font-mono transition-colors border border-white/5 hover:border-cyan-400/30 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Footer Controls & Dwell Button */}
      <footer className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
        <DwellButton
          echoId={echo.id}
          resonance={echo.currentResonance}
          userHoldSeconds={echo.userHoldSeconds}
          userHeld={echo.userHeld}
          isActive={isHolding}
          holdProgress={holdProgress}
          holdingSeconds={holdingSeconds}
          isCaught={isCaught}
          onStartHold={onStartHold}
          onReleaseHold={onReleaseHold}
          onCancelHold={onCancelHold}
        />

        {/* Secondary Social Actions */}
        <div className="flex items-center gap-1 text-slate-400">
          {/* Tethers (Comments) */}
          <button
            type="button"
            onClick={() => setShowTethers(!showTethers)}
            aria-label={`${echo.tethers.length} tethered responses. Click to toggle discussion.`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
              showTethers ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{echo.tethers.length}</span>
          </button>

          {/* Repost / Amplify */}
          <button
            type="button"
            onClick={() => onToggleRepost(echo.id)}
            aria-label={`Amplify this thought. Currently ${echo.repostsCount} amplifications.`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
              echo.isReposted ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Repeat2 className="w-3.5 h-3.5" />
            <span>{echo.repostsCount}</span>
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={() => onToggleBookmark(echo.id)}
            aria-label={echo.isBookmarked ? 'Remove bookmark' : 'Bookmark thought'}
            className={`p-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
              echo.isBookmarked ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => onShare(echo)}
            aria-label="Share thought"
            className="p-1.5 rounded-xl text-xs font-mono hover:bg-white/5 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

      {/* Tether Thread Expanded Drawer */}
      {showTethers && (
        <TetherThread
          echoId={echo.id}
          tethers={echo.tethers}
          currentUser={currentUser}
          onAddTether={onAddTether}
        />
      )}
    </article>
  );
};
