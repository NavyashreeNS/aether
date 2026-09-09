import React, { useState } from 'react';
import { X, Sparkles, Send, Layers, Tag, Eye } from 'lucide-react';
import { User, CommunitySpace } from '../../types';

interface ComposeModalProps {
  isOpen: boolean;
  currentUser: User;
  spaces: CommunitySpace[];
  onClose: () => void;
  onSubmitEcho: (data: {
    text: string;
    place: string;
    tags: string[];
    spaceId: string;
    depthKm: number;
  }) => void;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  currentUser,
  spaces,
  onClose,
  onSubmitEcho
}) => {
  const [text, setText] = useState('');
  const [place, setPlace] = useState(currentUser.location.split(',')[0]);
  const [selectedSpaceId, setSelectedSpaceId] = useState(spaces[0]?.id || 'slow-tech');
  const [tagsInput, setTagsInput] = useState('#SlowTech, #Philosophy');
  const [depthKm, setDepthKm] = useState(1.8);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const maxChars = 280;
  const charsRemaining = maxChars - text.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || text.length > maxChars) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    onSubmitEcho({
      text: text.trim(),
      place: place.trim() || 'Unknown Void',
      tags,
      spaceId: selectedSpaceId,
      depthKm
    });

    setText('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compose-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-6 sm:p-7 text-slate-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="compose-title" className="font-display font-bold text-lg">
                File a Thought into the Void
              </h2>
              <p className="text-xs text-slate-400 font-body">
                Your echo will occupy a permanent depth coordinate in the infinite timeline.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close compose modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 my-5">
          
          {/* Author bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2">
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-lg object-cover border border-cyan-400/40"
              />
              <span className="text-slate-200 font-semibold">{currentUser.handle}</span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="place-input" className="text-slate-500">Origin:</label>
              <input
                id="place-input"
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="City, Void"
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400/40"
              />
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What thought is worth giving someone seconds of stillness? Write with intention..."
              rows={4}
              maxLength={maxChars}
              className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-100 placeholder-slate-500 font-display text-base leading-relaxed focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
              required
            />
            <span
              className={`absolute bottom-3 right-3 text-[11px] font-mono ${
                charsRemaining < 30 ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              {charsRemaining} left
            </span>
          </div>

          {/* Community Space Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block">Anchor to Community Space:</label>
            <select
              value={selectedSpaceId}
              onChange={(e) => setSelectedSpaceId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400/40 cursor-pointer"
            >
              {spaces.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900">
                  {s.icon} {s.name} ({s.topics.slice(0, 2).join(' ')})
                </option>
              ))}
            </select>
          </div>

          {/* Topic Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Topic Tags (comma separated):</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#SlowTech, #Philosophy, #Design"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400/40"
            />
          </div>

          {/* Spatial Depth Slider */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Spatial Placement Depth:</span>
              </span>
              <span className="text-cyan-300 font-bold">{depthKm.toFixed(1)} km</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20.0"
              step="0.1"
              value={depthKm}
              onChange={(e) => setDepthKm(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[10px] font-mono text-slate-500">
              Corresponds to ~{Math.round(Math.pow(depthKm, 1.4) * 6)} minutes into the retroactive timeline.
            </p>
          </div>

          {/* Preview Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Hide Card Preview' : 'Preview Echo Card'}</span>
            </button>
          </div>

          {/* Live Preview */}
          {showPreview && text.trim() && (
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-400/30 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{currentUser.name} • {place}</span>
                <span className="text-cyan-300">{depthKm.toFixed(1)} km</span>
              </div>
              <p className="font-display text-base text-slate-100">{text}</p>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-30 text-slate-950 font-mono font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>File into Void</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
