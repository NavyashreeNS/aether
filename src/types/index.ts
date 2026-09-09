export type ThemeMode = 'void' | 'midnight' | 'cyberpunk' | 'paper';

export type ViewMode = 'stream' | 'void' | 'discover' | 'spaces' | 'profile' | 'ledger';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'gold' | 'silver' | 'bronze' | 'special';
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  echoesCount: number;
  secondsDwelled: number;
  resonanceGiven: number;
  badges: Badge[];
}

export interface Tether {
  id: string;
  echoId: string;
  author: string;
  handle: string;
  avatar: string;
  text: string;
  timestamp: string;
  resonance: number;
}

export interface Echo {
  id: string;
  index: number;
  author: string;
  handle: string;
  avatar: string;
  place: string;
  text: string;
  depth: number; // in meters (z)
  ageMinutes: number;
  baselineResonance: number;
  currentResonance: number;
  heldSeconds: number;
  userHoldSeconds: number;
  userHeld: boolean;
  color: string;
  tags: string[];
  spaceId?: string;
  tethers: Tether[];
  bookmarksCount: number;
  repostsCount: number;
  isBookmarked?: boolean;
  isReposted?: boolean;
  isAuthorFollowed?: boolean;
}

export interface CommunitySpace {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  membersCount: number;
  echoCount: number;
  topics: string[];
  isJoined: boolean;
  featuredQuote: string;
}

export interface LedgerState {
  airborneSeconds: number;
  thoughtsPassed: number;
  thoughtsHeld: number;
  secondsGiven: number;
  resonanceContributed: number;
  heldEchoIds: string[];
  savedEchoIds: string[];
  followingHandles: string[];
}

export interface NotificationItem {
  id: string;
  type: 'dwell' | 'tether' | 'follow' | 'repost';
  actor: {
    name: string;
    handle: string;
    avatar: string;
  };
  echoId?: string;
  echoSnippet?: string;
  message: string;
  dwellSeconds?: number;
  timestamp: string;
  read: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  userVotedId?: string;
}
