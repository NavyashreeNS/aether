import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, Echo, User, CommunitySpace, LedgerState, Poll, NotificationItem } from './types';
import { StorageService } from './services/storageService';
import { Sound } from './services/soundService';
import { useTheme } from './hooks/useTheme';
import { useDwellEngine, DwellResult } from './hooks/useDwellEngine';
import { useKeyboardNav } from './hooks/useKeyboardNav';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ShortcutsModal } from './components/layout/ShortcutsModal';

import { FeedStream } from './components/feed/FeedStream';
import { VoidFlight } from './components/void/VoidFlight';
import { DiscoveryView } from './components/discovery/DiscoveryView';
import { SpacesView } from './components/spaces/SpacesView';
import { ProfileView } from './components/profile/ProfileView';

import { ComposeModal } from './components/compose/ComposeModal';
import { LedgerModal } from './components/ledger/LedgerModal';
import { NotificationsDrawer } from './components/notifications/NotificationsDrawer';
import { Toast, ToastProps } from './components/common/Toast';

export function App() {
  const { theme, setTheme } = useTheme();

  // Core domain state loaded from StorageService
  const [viewMode, setViewMode] = useState<ViewMode>('stream');
  const [echoes, setEchoes] = useState<Echo[]>(() => StorageService.getEchoes());
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getUser());
  const [spaces, setSpaces] = useState<CommunitySpace[]>(() => StorageService.getSpaces());
  const [ledger, setLedger] = useState<LedgerState>(() => StorageService.getLedger());
  const [poll, setPoll] = useState<Poll>(() => StorageService.getPoll());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => StorageService.getSoundEnabled());

  // UI Modals state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Active Toast notifications
  const [toasts, setToasts] = useState<Array<Omit<ToastProps, 'onClose'>>>([]);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Airborne Session Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLedger((prev) => {
        const next = { ...prev, airborneSeconds: prev.airborneSeconds + 1 };
        StorageService.saveLedger(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync state to storage
  useEffect(() => {
    StorageService.saveEchoes(echoes);
  }, [echoes]);

  useEffect(() => {
    StorageService.saveUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    StorageService.saveSpaces(spaces);
  }, [spaces]);

  useEffect(() => {
    StorageService.savePoll(poll);
  }, [poll]);

  useEffect(() => {
    StorageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    Sound.enabled = soundEnabled;
    StorageService.saveSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // Dwell Engine Hook
  const handleDwellComplete = useCallback(
    (echoId: string, result: DwellResult) => {
      setEchoes((prev) =>
        prev.map((e) => {
          if (e.id === echoId) {
            const newResonance = Math.min(100, e.currentResonance + result.boostGiven);
            const userHoldSeconds = e.userHoldSeconds + result.seconds;
            return {
              ...e,
              currentResonance: newResonance,
              userHoldSeconds,
              userHeld: e.userHeld || result.boostGiven > 0,
              heldSeconds: e.heldSeconds + result.seconds
            };
          }
          return e;
        })
      );

      // Update Ledger
      setLedger((prev) => {
        const heldEchoIds = prev.heldEchoIds.includes(echoId)
          ? prev.heldEchoIds
          : [...prev.heldEchoIds, echoId];
        const next = {
          ...prev,
          secondsGiven: prev.secondsGiven + Math.round(result.seconds),
          resonanceContributed: prev.resonanceContributed + result.boostGiven,
          thoughtsHeld: heldEchoIds.length,
          heldEchoIds
        };
        StorageService.saveLedger(next);
        return next;
      });

      // Update Current User profile stats
      setCurrentUser((prev) => ({
        ...prev,
        secondsDwelled: prev.secondsDwelled + Math.round(result.seconds),
        resonanceGiven: prev.resonanceGiven + result.boostGiven
      }));

      // Feedback Toast
      if (result.boostGiven > 0) {
        addToast(result.message, 'success');
      } else {
        addToast(result.message, 'warning');
      }
    },
    [addToast]
  );

  const {
    activeEchoId,
    holdProgress,
    holdingSeconds,
    isCaught,
    startHold,
    releaseHold,
    cancelHold
  } = useDwellEngine(handleDwellComplete);

  // Social Interaction Handlers
  const handleToggleBookmark = useCallback(
    (echoId: string) => {
      setEchoes((prev) =>
        prev.map((e) => {
          if (e.id === echoId) {
            const isBookmarked = !e.isBookmarked;
            addToast(isBookmarked ? 'Thought saved to constellations' : 'Removed from bookmarks', 'info');
            return {
              ...e,
              isBookmarked,
              bookmarksCount: e.bookmarksCount + (isBookmarked ? 1 : -1)
            };
          }
          return e;
        })
      );
    },
    [addToast]
  );

  const handleToggleRepost = useCallback(
    (echoId: string) => {
      setEchoes((prev) =>
        prev.map((e) => {
          if (e.id === echoId) {
            const isReposted = !e.isReposted;
            addToast(isReposted ? 'Thought amplified across frequencies' : 'Amplification undone', 'info');
            return {
              ...e,
              isReposted,
              repostsCount: e.repostsCount + (isReposted ? 1 : -1)
            };
          }
          return e;
        })
      );
    },
    [addToast]
  );

  const handleToggleFollow = useCallback(
    (authorHandle: string) => {
      setEchoes((prev) =>
        prev.map((e) => {
          if (e.handle === authorHandle) {
            const isAuthorFollowed = !e.isAuthorFollowed;
            addToast(isAuthorFollowed ? `Attuned to frequency of ${e.author}` : `Detuned from ${e.author}`, 'info');
            return {
              ...e,
              isAuthorFollowed
            };
          }
          return e;
        })
      );
    },
    [addToast]
  );

  const handleAddTether = useCallback(
    (echoId: string, text: string) => {
      const newTether = {
        id: `teth_${Date.now()}`,
        echoId,
        author: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        text,
        timestamp: 'Just now',
        resonance: 4
      };

      setEchoes((prev) =>
        prev.map((e) => {
          if (e.id === echoId) {
            return {
              ...e,
              tethers: [...e.tethers, newTether]
            };
          }
          return e;
        })
      );

      addToast('Mindful answer tethered into constellation', 'success');
    },
    [currentUser, addToast]
  );

  const handleSubmitEcho = useCallback(
    (data: { text: string; place: string; tags: string[]; spaceId: string; depthKm: number }) => {
      const depth = Math.round(data.depthKm * 1000);
      const newEcho: Echo = {
        id: `echo_usr_${Date.now()}`,
        index: echoes.length,
        author: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        place: data.place,
        text: data.text,
        depth,
        ageMinutes: 0,
        baselineResonance: 1,
        currentResonance: 1,
        heldSeconds: 0,
        userHoldSeconds: 0,
        userHeld: false,
        color: '#5EE7FF',
        tags: data.tags,
        spaceId: data.spaceId,
        tethers: [],
        bookmarksCount: 0,
        repostsCount: 0,
        isBookmarked: false,
        isReposted: false,
        isAuthorFollowed: false
      };

      setEchoes((prev) => [newEcho, ...prev]);
      setCurrentUser((prev) => ({
        ...prev,
        echoesCount: prev.echoesCount + 1
      }));

      setViewMode('stream');
      addToast(`Thought filed into void at coordinate ${data.depthKm.toFixed(1)} km`, 'success');
    },
    [currentUser, echoes.length, addToast]
  );

  const handleToggleJoinSpace = useCallback(
    (spaceId: string) => {
      setSpaces((prev) =>
        prev.map((s) => {
          if (s.id === spaceId) {
            const isJoined = !s.isJoined;
            addToast(isJoined ? `Joined ${s.name}` : `Left ${s.name}`, 'info');
            return {
              ...s,
              isJoined,
              membersCount: s.membersCount + (isJoined ? 1 : -1)
            };
          }
          return s;
        })
      );
    },
    [addToast]
  );

  const handleVotePoll = useCallback(
    (optionId: string) => {
      setPoll((prev) => {
        if (prev.userVotedId) return prev;
        const nextOptions = prev.options.map((opt) =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        addToast('Your perspective was anchored into the ledger', 'success');
        return {
          ...prev,
          options: nextOptions,
          totalVotes: prev.totalVotes + 1,
          userVotedId: optionId
        };
      });
    },
    [addToast]
  );

  const handleShare = useCallback(
    async (echo: Echo) => {
      const shareData = {
        title: `Dwell — A thought by ${echo.author}`,
        text: `"${echo.text}" — Hold to dwell and confer resonance.`,
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          addToast('Shared via device dialog', 'success');
          return;
        } catch {
          // fallback to clipboard
        }
      }

      try {
        await navigator.clipboard.writeText(`"${echo.text}" — ${echo.author} on Dwell (${window.location.href})`);
        addToast('Permalink copied to clipboard', 'success');
      } catch {
        addToast('Sharing link prepared', 'info');
      }
    },
    [addToast]
  );

  const handleEraseTraces = useCallback(() => {
    StorageService.clearAllTraces();
    setEchoes(StorageService.getEchoes());
    setCurrentUser(StorageService.getUser());
    setLedger(StorageService.getLedger());
    setSpaces(StorageService.getSpaces());
    setPoll(StorageService.getPoll());
    addToast('All local traces cleanly erased. Starting anew.', 'info');
  }, [addToast]);

  const handleMarkAllNotifsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  }, [addToast]);

  const handleUpdateUser = useCallback(
    (updated: Partial<User>) => {
      setCurrentUser((prev) => ({ ...prev, ...updated }));
      addToast('Profile updated successfully', 'success');
    },
    [addToast]
  );

  // Accessible Keyboard Navigation
  useKeyboardNav({
    onCompose: () => setIsComposeOpen(true),
    onHelp: () => setIsShortcutsOpen((prev) => !prev),
    onEscape: () => {
      setIsComposeOpen(false);
      setIsLedgerOpen(false);
      setIsShortcutsOpen(false);
      setIsNotifsOpen(false);
      cancelHold();
    },
    onToggleSound: () => setSoundEnabled((prev) => !prev),
    onSearch: () => setViewMode('discover')
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] text-slate-100 font-body selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Universal Sticky Glassmorphic Navbar */}
      <Navbar
        currentView={viewMode}
        onSelectView={setViewMode}
        currentUser={currentUser}
        theme={theme}
        onSelectTheme={setTheme}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        unreadNotifsCount={unreadCount}
        onOpenNotifications={() => setIsNotifsOpen(true)}
        onOpenCompose={() => setIsComposeOpen(true)}
        onOpenLedger={() => setIsLedgerOpen(true)}
      />

      {/* Main View Switcher */}
      <div className="flex-1 flex flex-col">
        {viewMode === 'stream' && (
          <FeedStream
            echoes={echoes}
            currentUser={currentUser}
            poll={poll}
            activeHoldingId={activeEchoId}
            holdProgress={holdProgress}
            holdingSeconds={holdingSeconds}
            isCaught={isCaught}
            onStartHold={startHold}
            onReleaseHold={releaseHold}
            onCancelHold={cancelHold}
            onToggleBookmark={handleToggleBookmark}
            onToggleRepost={handleToggleRepost}
            onToggleFollow={handleToggleFollow}
            onAddTether={handleAddTether}
            onVotePoll={handleVotePoll}
            onShare={handleShare}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />
        )}

        {viewMode === 'void' && (
          <VoidFlight
            echoes={echoes}
            currentUser={currentUser}
            activeHoldingId={activeEchoId}
            holdProgress={holdProgress}
            holdingSeconds={holdingSeconds}
            isCaught={isCaught}
            onStartHold={startHold}
            onReleaseHold={releaseHold}
            onCancelHold={cancelHold}
          />
        )}

        {viewMode === 'discover' && (
          <DiscoveryView
            echoes={echoes}
            currentUser={currentUser}
            activeHoldingId={activeEchoId}
            holdProgress={holdProgress}
            holdingSeconds={holdingSeconds}
            isCaught={isCaught}
            onStartHold={startHold}
            onReleaseHold={releaseHold}
            onCancelHold={cancelHold}
            onToggleBookmark={handleToggleBookmark}
            onToggleRepost={handleToggleRepost}
            onToggleFollow={handleToggleFollow}
            onAddTether={handleAddTether}
            onShare={handleShare}
          />
        )}

        {viewMode === 'spaces' && (
          <SpacesView
            spaces={spaces}
            echoes={echoes}
            currentUser={currentUser}
            onToggleJoinSpace={handleToggleJoinSpace}
            activeHoldingId={activeEchoId}
            holdProgress={holdProgress}
            holdingSeconds={holdingSeconds}
            isCaught={isCaught}
            onStartHold={startHold}
            onReleaseHold={releaseHold}
            onCancelHold={cancelHold}
            onToggleBookmark={handleToggleBookmark}
            onToggleRepost={handleToggleRepost}
            onToggleFollow={handleToggleFollow}
            onAddTether={handleAddTether}
            onShare={handleShare}
          />
        )}

        {viewMode === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            echoes={echoes}
            onUpdateUser={handleUpdateUser}
            activeHoldingId={activeEchoId}
            holdProgress={holdProgress}
            holdingSeconds={holdingSeconds}
            isCaught={isCaught}
            onStartHold={startHold}
            onReleaseHold={releaseHold}
            onCancelHold={cancelHold}
            onToggleBookmark={handleToggleBookmark}
            onToggleRepost={handleToggleRepost}
            onToggleFollow={handleToggleFollow}
            onAddTether={handleAddTether}
            onShare={handleShare}
          />
        )}
      </div>

      {/* Semantic Accessible Footer */}
      <Footer
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        airborneSeconds={ledger.airborneSeconds}
        thoughtsHeld={ledger.thoughtsHeld}
      />

      {/* Global Modals & Drawers */}
      <ComposeModal
        isOpen={isComposeOpen}
        currentUser={currentUser}
        spaces={spaces}
        onClose={() => setIsComposeOpen(false)}
        onSubmitEcho={handleSubmitEcho}
      />

      <LedgerModal
        isOpen={isLedgerOpen}
        ledger={ledger}
        onClose={() => setIsLedgerOpen(false)}
        onEraseTraces={handleEraseTraces}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <NotificationsDrawer
        isOpen={isNotifsOpen}
        notifications={notifications}
        onClose={() => setIsNotifsOpen(false)}
        onMarkAllAsRead={handleMarkAllNotifsRead}
      />

      {/* Floating Toast Alerts Stack */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
}
export default App;
