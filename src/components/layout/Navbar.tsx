import React, { useState } from 'react';
import {
  Compass,
  Radio,
  Search,
  Users,
  Clock,
  User as UserIcon,
  PlusCircle,
  Volume2,
  VolumeX,
  Palette,
  Bell,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { ViewMode, ThemeMode, User, NotificationItem } from '../../types';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  currentUser: User;
  theme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onOpenCompose: () => void;
  onOpenLedger: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  currentUser,
  theme,
  onSelectTheme,
  soundEnabled,
  onToggleSound,
  unreadNotifsCount,
  onOpenNotifications,
  onOpenCompose,
  onOpenLedger
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const themes: { id: ThemeMode; label: string; bg: string }[] = [
    { id: 'void', label: 'Deep Void (OLED)', bg: 'bg-[#030305]' },
    { id: 'midnight', label: 'Cosmic Midnight', bg: 'bg-[#0b0c1e]' },
    { id: 'cyberpunk', label: 'Cyberpunk Glow', bg: 'bg-[#0d131f]' },
    { id: 'paper', label: 'Mindful Paper (Light)', bg: 'bg-[#f5f5f7]' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectView('stream')}
            className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyanGlow/70 rounded-xl p-1"
            aria-label="Dwell Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(94,231,255,0.25)] group-hover:scale-105 transition-transform">
              <span className="text-cyan-300 font-mono font-bold text-sm">⧖</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                DWELL
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-1">
                Time As Resonance
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Primary Navigation Tabs */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10">
          <button
            onClick={() => onSelectView('stream')}
            aria-current={currentView === 'stream' ? 'page' : undefined}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
              currentView === 'stream'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Stream</span>
          </button>

          <button
            onClick={() => onSelectView('void')}
            aria-current={currentView === 'void' ? 'page' : undefined}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
              currentView === 'void'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Void Flight</span>
          </button>

          <button
            onClick={() => onSelectView('discover')}
            aria-current={currentView === 'discover' ? 'page' : undefined}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
              currentView === 'discover'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Discover</span>
          </button>

          <button
            onClick={() => onSelectView('spaces')}
            aria-current={currentView === 'spaces' ? 'page' : undefined}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
              currentView === 'spaces'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Spaces</span>
          </button>

          <button
            onClick={onOpenLedger}
            aria-label="Open Attention Ledger"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Ledger</span>
          </button>
        </nav>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute ambient audio' : 'Unmute ambient audio'}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Toggle Audio (M key)"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Theme Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              aria-label="Select color theme"
              aria-expanded={themeDropdownOpen}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Palette className="w-4 h-4" />
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/5 mb-1">
                  Color Themes
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTheme(t.id);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
                      theme === t.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className={`w-3 h-3 rounded-full border border-white/20 ${t.bg}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label={`Notifications, ${unreadNotifsCount} unread`}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 font-mono font-bold text-[9px] flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar Link */}
          <button
            type="button"
            onClick={() => onSelectView('profile')}
            aria-label="View user profile"
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-cyanGlow/80"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40"
            />
          </button>

          {/* Compose New Echo Button */}
          <button
            type="button"
            onClick={onOpenCompose}
            aria-label="Compose and file a new thought into the void"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs shadow-[0_0_20px_rgba(94,231,255,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File Thought</span>
          </button>

          {/* Mobile Navigation Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl p-4 space-y-2 animate-in slide-in-from-top-2">
          <button
            onClick={() => { onSelectView('stream'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs ${
              currentView === 'stream' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Mindful Stream</span>
          </button>

          <button
            onClick={() => { onSelectView('void'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs ${
              currentView === 'void' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>3D Void Flight</span>
          </button>

          <button
            onClick={() => { onSelectView('discover'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs ${
              currentView === 'discover' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Discover & Search</span>
          </button>

          <button
            onClick={() => { onSelectView('spaces'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs ${
              currentView === 'spaces' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Community Spaces</span>
          </button>

          <button
            onClick={() => { onOpenLedger(); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs text-slate-300 hover:bg-white/5"
          >
            <Clock className="w-4 h-4" />
            <span>Attention Ledger</span>
          </button>

          <button
            onClick={() => { onOpenCompose(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-bold text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File a Thought</span>
          </button>
        </div>
      )}
    </header>
  );
};
