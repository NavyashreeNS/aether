import React, { useState } from 'react';
import {
  User as UserIcon,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Award,
  Layers,
  Bookmark,
  HeartHandshake,
  Edit3,
  CheckCircle2
} from 'lucide-react';
import { User, Echo, Badge } from '../../types';
import { EchoCard } from '../feed/EchoCard';
import { EditProfileModal } from './EditProfileModal';

interface ProfileViewProps {
  currentUser: User;
  echoes: Echo[];
  onUpdateUser: (updatedUser: Partial<User>) => void;
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

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  echoes,
  onUpdateUser,
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
  const [activeTab, setActiveTab] = useState<'my-echoes' | 'held' | 'bookmarks'>('my-echoes');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const myEchoes = echoes.filter((e) => e.handle === currentUser.handle || e.author === 'sable.ng');
  const heldEchoes = echoes.filter((e) => e.userHeld || e.currentResonance > e.baselineResonance);
  const bookmarkedEchoes = echoes.filter((e) => e.isBookmarked);

  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8" role="main">
      
      {/* Profile Card Header */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Glow ambient sphere */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(94,231,255,0.2)]"
              />
              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-bold shadow-md"
                title="Verified Citizen"
              >
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
                {currentUser.name}
              </h1>
              <div className="flex items-center gap-2 font-mono text-sm text-cyan-300">
                <span>{currentUser.handle}</span>
                <span>•</span>
                <span className="text-slate-400 text-xs">First Citizen</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {currentUser.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Joined {currentUser.joinedDate}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-mono transition-colors cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Bio */}
        <p className="font-body text-sm text-slate-300 leading-relaxed max-w-2xl mt-4">
          {currentUser.bio}
        </p>

        {/* Mindful Attention Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/5 font-mono text-center">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Time Dwelled</span>
            <span className="font-bold text-lg text-cyan-300">{formatSeconds(currentUser.secondsDwelled)}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Resonance Conferred</span>
            <span className="font-bold text-lg text-purple-300">+{currentUser.resonanceGiven} pts</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Attuned Network</span>
            <span className="font-bold text-lg text-emerald-300">{currentUser.followersCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Attention Ratio</span>
            <span className="font-bold text-lg text-amber-300">94.8%</span>
          </div>
        </div>
      </section>

      {/* Verifiable Badges Grid */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Verifiable Platform Credentials &amp; Badges</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentUser.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-400/40 transition-all flex items-start gap-3"
            >
              <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/5">
                {badge.icon}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-slate-100">{badge.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-body leading-tight">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Profile Activity Tabs */}
      <div className="border-b border-white/10 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'my-echoes'}
            onClick={() => setActiveTab('my-echoes')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
              activeTab === 'my-echoes'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Filed Echoes ({myEchoes.length})
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'held'}
            onClick={() => setActiveTab('held')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
              activeTab === 'held'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Held Thoughts ({heldEchoes.length})
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'bookmarks'}
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Saved Constellations ({bookmarkedEchoes.length})
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {activeTab === 'my-echoes' && (
          myEchoes.map((echo) => (
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
          ))
        )}

        {activeTab === 'held' && (
          heldEchoes.map((echo) => (
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
          ))
        )}

        {activeTab === 'bookmarks' && (
          bookmarkedEchoes.length > 0 ? (
            bookmarkedEchoes.map((echo) => (
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
            ))
          ) : (
            <div className="py-12 text-center rounded-3xl border border-dashed border-white/10">
              <Bookmark className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <p className="text-xs font-mono text-slate-400">No saved constellations yet.</p>
            </div>
          )
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        currentUser={currentUser}
        onClose={() => setIsEditOpen(false)}
        onSave={onUpdateUser}
      />
    </main>
  );
};
