import { Echo, User, CommunitySpace, LedgerState, Poll, NotificationItem } from '../types';
import { INITIAL_USER, INITIAL_SPACES, getInitialEchoes, INITIAL_POLL, INITIAL_NOTIFICATIONS } from './corpusData';

const KEYS = {
  USER: 'dwell_v2_user',
  ECHOES: 'dwell_v2_echoes',
  SPACES: 'dwell_v2_spaces',
  LEDGER: 'dwell_v2_ledger',
  POLL: 'dwell_v2_poll',
  NOTIFICATIONS: 'dwell_v2_notifications',
  THEME: 'dwell_v2_theme',
  SOUND: 'dwell_v2_sound'
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Graceful silent degradation in private browsing
  }
}

export const StorageService = {
  getUser(): User {
    return safeGet<User>(KEYS.USER, INITIAL_USER);
  },
  saveUser(user: User): void {
    safeSet(KEYS.USER, user);
  },

  getEchoes(): Echo[] {
    const saved = safeGet<Echo[] | null>(KEYS.ECHOES, null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    const initial = getInitialEchoes();
    safeSet(KEYS.ECHOES, initial);
    return initial;
  },
  saveEchoes(echoes: Echo[]): void {
    safeSet(KEYS.ECHOES, echoes);
  },

  getSpaces(): CommunitySpace[] {
    return safeGet<CommunitySpace[]>(KEYS.SPACES, INITIAL_SPACES);
  },
  saveSpaces(spaces: CommunitySpace[]): void {
    safeSet(KEYS.SPACES, spaces);
  },

  getLedger(): LedgerState {
    return safeGet<LedgerState>(KEYS.LEDGER, {
      airborneSeconds: 420,
      thoughtsPassed: 18,
      thoughtsHeld: 4,
      secondsGiven: 48,
      resonanceContributed: 64,
      heldEchoIds: [],
      savedEchoIds: [],
      followingHandles: ['@sable_ng', '@oyinda']
    });
  },
  saveLedger(ledger: LedgerState): void {
    safeSet(KEYS.LEDGER, ledger);
  },

  getPoll(): Poll {
    return safeGet<Poll>(KEYS.POLL, INITIAL_POLL);
  },
  savePoll(poll: Poll): void {
    safeSet(KEYS.POLL, poll);
  },

  getNotifications(): NotificationItem[] {
    return safeGet<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  saveNotifications(notifs: NotificationItem[]): void {
    safeSet(KEYS.NOTIFICATIONS, notifs);
  },

  getSoundEnabled(): boolean {
    return safeGet<boolean>(KEYS.SOUND, true);
  },
  saveSoundEnabled(enabled: boolean): void {
    safeSet(KEYS.SOUND, enabled);
  },

  clearAllTraces(): void {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  }
};
