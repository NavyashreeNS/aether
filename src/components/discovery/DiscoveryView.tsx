import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, Sparkles, Flame, Clock, Compass, Hash } from 'lucide-react';
import { Echo, User } from '../../types';
import { EchoCard } from '../feed/EchoCard';

interface DiscoveryViewProps {
  echoes: Echo[];
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
  onShare: (echo: Echo) => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  echoes,
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
  onShare
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'deepest' | 'recent'>('trending');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Compute trending topic stats
  const topicStats = useMemo(() => {
    const map: Record<string, number> = {};
    echoes.forEach((e) => {
      e.tags.forEach((tag) => {
        map[tag] = (map[tag] || 0) + 1;
      });
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [echoes]);

  const filteredEchoes = useMemo(() => {
    let list = [...echoes];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.text.toLowerCase().includes(q) ||
          e.author.toLowerCase().includes(q) ||
          e.handle.toLowerCase().includes(q) ||
          e.place.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedTag) {
      list = list.filter((e) => e.tags.includes(selectedTag));
    }

    if (activeTab === 'trending') {
      list.sort((a, b) => b.currentResonance - a.currentResonance);
    } else if (activeTab === 'deepest') {
      list.sort((a, b) => b.depth - a.depth);
    } else {
      list.sort((a, b) => a.ageMinutes - b.ageMinutes);
    }

    return list;
  }, [echoes, query, selectedTag, activeTab]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8" role="main">
      
      {/* Search Header */}
      <section className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Void Discovery</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-white tracking-tight">
          Explore the Contemplative Commons
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-body max-w-lg mx-auto">
          Uncover high-resonance echoes across coordinates, frequencies, and philosophical topics.
        </p>

        {/* Big Search Omnibar */}
        <div className="relative max-w-2xl mx-auto pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, authors, cities, or tags..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-sm font-body text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20 transition-all shadow-xl"
          />
        </div>
      </section>

      {/* Trending Topics Grid */}
      <section className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Trending Contemplative Frequencies</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {topicStats.map(([tag, count]) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-xs'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <Hash className="w-3 h-3 text-emerald-400" />
                <span>{tag}</span>
                <span className="text-[10px] text-slate-500 font-bold">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Discovery View Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'trending'}
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              activeTab === 'trending'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Highest Resonance</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'deepest'}
            onClick={() => setActiveTab('deepest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              activeTab === 'deepest'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Deepest in Void</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'recent'}
            onClick={() => setActiveTab('recent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              activeTab === 'recent'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recently Filed</span>
          </button>
        </div>

        <span className="text-xs font-mono text-slate-500">
          {filteredEchoes.length} echoes matched
        </span>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {filteredEchoes.map((echo) => (
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
            onSelectTag={(t) => setSelectedTag(t)}
            onShare={onShare}
          />
        ))}
      </div>
    </main>
  );
};
