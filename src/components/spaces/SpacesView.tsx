import React, { useState } from 'react';
import { Users, UserCheck, UserPlus, Sparkles, MessageSquare, Quote } from 'lucide-react';
import { CommunitySpace, Echo, User } from '../../types';
import { EchoCard } from '../feed/EchoCard';

interface SpacesViewProps {
  spaces: CommunitySpace[];
  echoes: Echo[];
  currentUser: User;
  onToggleJoinSpace: (spaceId: string) => void;
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
  onShare: (echo: Echo) => void;
}

export const SpacesView: React.FC<SpacesViewProps> = ({
  spaces,
  echoes,
  currentUser,
  onToggleJoinSpace,
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
  onShare
}) => {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  const selectedSpace = spaces.find((s) => s.id === selectedSpaceId);

  const spaceEchoes = selectedSpaceId
    ? echoes.filter((e) => e.spaceId === selectedSpaceId)
    : [];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8" role="main">
      
      {/* Header */}
      <section className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono">
          <Users className="w-3.5 h-3.5" />
          <span>Community &amp; Guilds</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
          Spaces of Deliberate Fellowship
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-body max-w-lg mx-auto">
          Gather with peers committed to anti-dopamine architectures, cognitive clarity, and craft.
        </p>
      </section>

      {/* Grid of Community Spaces */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5" aria-label="Community Spaces">
        {spaces.map((space) => {
          const isSelected = selectedSpaceId === space.id;

          return (
            <div
              key={space.id}
              className={`p-6 rounded-3xl border backdrop-blur-xl transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-amber-400/50 shadow-[0_0_30px_rgba(255,180,84,0.15)] ring-1 ring-amber-400/30'
                  : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/10'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2.5 rounded-2xl bg-white/5 border border-white/10">
                      {space.icon}
                    </span>
                    <div>
                      <h2 className="font-display font-bold text-lg text-slate-100">
                        {space.name}
                      </h2>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span>{space.membersCount.toLocaleString()} members</span>
                        <span>•</span>
                        <span>{space.echoCount} thoughts</span>
                      </div>
                    </div>
                  </div>

                  {/* Join / Leave Space */}
                  <button
                    type="button"
                    onClick={() => onToggleJoinSpace(space.id)}
                    aria-label={space.isJoined ? `Leave ${space.name}` : `Join ${space.name}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                      space.isJoined
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200'
                    }`}
                  >
                    {space.isJoined ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Joined</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Join Space</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 font-body leading-relaxed mb-4">
                  {space.description}
                </p>

                {/* Featured Quote in space */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 italic flex items-start gap-2 mb-4">
                  <Quote className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span>"{space.featuredQuote}"</span>
                </div>
              </div>

              {/* Topics and View feed toggle */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {space.topics.slice(0, 2).map((t) => (
                    <span key={t} className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSpaceId(isSelected ? null : space.id)}
                  className="text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{isSelected ? 'Close Space Feed' : 'View Space Echoes →'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Filtered Space Echoes Feed */}
      {selectedSpace && (
        <section className="pt-6 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span>{selectedSpace.icon}</span>
              <span>{selectedSpace.name} Feed</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {spaceEchoes.length} echoes anchored
            </span>
          </div>

          <div className="space-y-6">
            {spaceEchoes.map((echo) => (
              <EchoCard
                key={echo.id}
                echo={echo}
                currentUser={currentUser}
                activeHoldingId={activeHoldingId}
                holdProgress={holdProgress}
                holdingSeconds={holdingSeconds}
                isCaught={isCaught}
                onStartHold={onStartHold}
                onReleaseHold={onReleaseHold}
                onCancelHold={onCancelHold}
                onToggleBookmark={onToggleBookmark}
                onToggleRepost={onToggleRepost}
                onToggleFollow={onToggleFollow}
                onAddTether={onAddTether}
                onSelectTag={() => {}}
                onShare={onShare}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
