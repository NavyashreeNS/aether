import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, Sparkles, SlidersHorizontal, Search } from 'lucide-react';
import { Echo, User, Poll } from '../../types';
import { EchoCard } from './EchoCard';
import { DailyPoll } from './DailyPoll';

interface FeedStreamProps {
  echoes: Echo[];
  currentUser: User;
  poll: Poll;
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
  onVotePoll: (optionId: string) => void;
  onShare: (echo: Echo) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const FeedStream: React.FC<FeedStreamProps> = ({
  echoes,
  currentUser,
  poll,
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
  onVotePoll,
  onShare,
  selectedTag,
  onSelectTag
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'resonated' | 'recent' | 'depth' | 'held'>('resonated');

  const topics = [
    '#All',
    '#SlowTech',
    '#Philosophy',
    '#DigitalMinimalism',
    '#AttentionEconomy',
    '#Design',
    '#Silence',
    '#Memory'
  ];

  const filteredEchoes = useMemo(() => {
    let result = [...echoes];

    if (selectedTag && selectedTag !== '#All') {
      result = result.filter((e) => e.tags.includes(selectedTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.text.toLowerCase().includes(q) ||
          e.author.toLowerCase().includes(q) ||
          e.handle.toLowerCase().includes(q) ||
          e.place.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'resonated':
        result.sort((a, b) => b.currentResonance - a.currentResonance);
        break;
      case 'recent':
        result.sort((a, b) => a.ageMinutes - b.ageMinutes);
        break;
      case 'depth':
        result.sort((a, b) => b.depth - a.depth);
        break;
      case 'held':
        result.sort((a, b) => (b.userHeld ? 1 : 0) - (a.userHeld ? 1 : 0));
        break;
    }

    return result;
  }, [echoes, selectedTag, searchQuery, sortBy]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8" role="main">
      
      {/* Mindful Stream Hero Intro */}
      <section className="text-center py-6 border-b border-white/5 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Attention Counter-Revolution</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
          You cannot like a thought. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            You can only stay with it.
          </span>
        </h1>
        <p className="text-sm text-slate-400 font-body max-w-xl mx-auto">
          Engagement is not a 40ms tap. Hold a thought still and it inherits the seconds you gave it.
        </p>
      </section>

      {/* Discovery & Filter Controls Bar */}
      <div className="space-y-4">
        {/* Search Omnibar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search echoes by text, author, location, or tag... (Press / to focus)"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm font-body text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-inner"
          />
        </div>

        {/* Topic Pills Carousel & Sort Select */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {topics.map((tag) => {
              const isActive = (selectedTag === null && tag === '#All') || selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectTag(tag === '#All' ? null : tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400/50 cursor-pointer"
            >
              <option value="resonated">Highest Resonance</option>
              <option value="recent">Most Recent</option>
              <option value="depth">Deepest into Void</option>
              <option value="held">My Held Thoughts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Daily Poll Inquiry Widget */}
      <DailyPoll poll={poll} onVote={onVotePoll} />

      {/* Feed Stream List */}
      <section
        role="feed"
        aria-label="Mindful Echo Stream"
        className="space-y-6"
      >
        {filteredEchoes.length > 0 ? (
          filteredEchoes.map((echo) => (
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
              onSelectTag={(t) => onSelectTag(t)}
              onShare={onShare}
            />
          ))
        ) : (
          <div className="py-16 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
            <p className="font-mono text-sm text-slate-400 mb-2">No echoes located in this frequency.</p>
            <button
              onClick={() => { setSearchQuery(''); onSelectTag(null); }}
              className="px-4 py-2 rounded-xl bg-white/10 text-xs font-mono text-cyan-300 hover:bg-white/15 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};
