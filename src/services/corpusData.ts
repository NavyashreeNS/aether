import { Echo, CommunitySpace, User, Poll, NotificationItem } from '../types';

export const PALETTE = ['#5EE7FF', '#FF4D9D', '#FFB454', '#8B7CFF', '#4FFFC4'];

export const INITIAL_USER: User = {
  id: 'usr_navya',
  name: 'Navyashree N S',
  handle: '@navyashree',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Architecting mindful computing. Believing that human attention is sacred, not a currency to be harvested. First Citizen of Dwell.',
  location: 'Bengaluru, India',
  joinedDate: 'September 2024',
  followersCount: 1420,
  followingCount: 38,
  echoesCount: 14,
  secondsDwelled: 1840,
  resonanceGiven: 560,
  badges: [
    { id: 'b1', name: 'Code Champion', description: 'Awarded for extraordinary architecture and zero-compromise engineering.', icon: '⚡', tier: 'gold' },
    { id: 'b2', name: 'Deep Thinker', description: 'Dwelled on thoughts for over 1,000 deliberate seconds.', icon: '🪐', tier: 'special' },
    { id: 'b3', name: 'Slow Tech Pioneer', description: 'Founding architect of deliberate, calm interaction models.', icon: '🌱', tier: 'silver' },
    { id: 'b4', name: 'First Citizen', description: 'Original voyager in the infinite depth void.', icon: '🌌', tier: 'bronze' },
  ]
};

export const INITIAL_SPACES: CommunitySpace[] = [
  {
    id: 'slow-tech',
    name: 'Slow Tech Movement',
    slug: 'slow-tech',
    description: 'Rejecting dopamine loops. Engineering calm interfaces that respect human time and finite mortal hours.',
    icon: '⏳',
    color: '#5EE7FF',
    membersCount: 3840,
    echoCount: 420,
    topics: ['#SlowTech', '#DigitalWellbeing', '#Mindfulness', '#AttentionEconomy'],
    isJoined: true,
    featuredQuote: 'We call it a feed because something is being fattened, and it is not us.'
  },
  {
    id: 'generative-philosophy',
    name: 'Generative Philosophy',
    slug: 'generative-philosophy',
    description: 'Existential inquiries, memory preservation, consciousness, and what remains when screens go dark.',
    icon: '🏛️',
    color: '#8B7CFF',
    membersCount: 2910,
    echoCount: 312,
    topics: ['#Philosophy', '#Consciousness', '#Memory', '#Solitude'],
    isJoined: true,
    featuredQuote: 'Rain on a tin roof is the only content I have never once wanted to skip.'
  },
  {
    id: 'mindful-builders',
    name: 'Mindful Builders',
    slug: 'mindful-builders',
    description: 'Designers, systems programmers, and creators crafting high-craft tools without predatory friction.',
    icon: '🛠️',
    color: '#4FFFC4',
    membersCount: 4120,
    echoCount: 540,
    topics: ['#Design', '#Architecture', '#Craft', '#OpenSource'],
    isJoined: false,
    featuredQuote: 'If you have to hold a thought to hear it, maybe that was always the honest price.'
  },
  {
    id: 'digital-monks',
    name: 'Digital Monks',
    slug: 'digital-monks',
    description: 'Practicing digital minimalism, intentional boredom, and radical disengagement from automated urgency.',
    icon: '🕯️',
    color: '#FFB454',
    membersCount: 1890,
    echoCount: 198,
    topics: ['#DigitalMinimalism', '#Silence', '#Boredom', '#AnalogLife'],
    isJoined: false,
    featuredQuote: 'First real silence in six years: a lift with no signal, forty seconds, eighth floor.'
  },
  {
    id: 'cognitive-architecture',
    name: 'Cognitive Architecture',
    slug: 'cognitive-architecture',
    description: 'Understanding attention fragmentation, spatial timelines, and the physics of digital depth.',
    icon: '🧠',
    color: '#FF4D9D',
    membersCount: 2450,
    echoCount: 275,
    topics: ['#CognitiveScience', '#SpatialUI', '#Attention', '#FutureOfSocial'],
    isJoined: false,
    featuredQuote: 'Nobody is doomscrolling on purpose. That is the entire design.'
  }
];

export const RAW_ECHO_CORPUS = [
  { author: 'sable.ng', place: 'Lagos', text: 'I deleted the app that knew me best and my hands still find the shape of it in my pocket.', tags: ['#DigitalWellbeing', '#Memory', '#SlowTech'], spaceId: 'slow-tech', base: 48 },
  { author: 'oyinda', place: 'Ibadan', text: 'My grandmother measured a good day by how many people she fed. I measure mine in unread.', tags: ['#AttentionEconomy', '#Philosophy'], spaceId: 'generative-philosophy', base: 36 },
  { author: 'kirinwaves', place: 'Osaka', text: 'Nobody warns you that the algorithm learns your loneliness faster than your friends do.', tags: ['#FutureOfSocial', '#CognitiveScience'], spaceId: 'cognitive-architecture', base: 62 },
  { author: 'quietfloor', place: 'Tallinn', text: 'There is a version of me that exists only at 2am and only for strangers.', tags: ['#Solitude', '#Philosophy'], spaceId: 'generative-philosophy', base: 41 },
  { author: 'tanvi.raw', place: 'Pune', text: 'I miss being bored. Real boredom. The kind with a ceiling fan and no plan.', tags: ['#Boredom', '#DigitalMinimalism', '#SlowTech'], spaceId: 'digital-monks', base: 55 },
  { author: 'm.orozco', place: 'Bogotá', text: 'We call it a feed because something is being fattened, and it is not us.', tags: ['#SlowTech', '#AttentionEconomy'], spaceId: 'slow-tech', base: 74 },
  { author: 'lowbeam', place: 'Glasgow', text: 'Took the long way home just to have a thought nobody could reply to.', tags: ['#Solitude', '#Mindfulness'], spaceId: 'digital-monks', base: 29 },
  { author: 'aditi.k', place: 'Kochi', text: 'Rain on a tin roof is the only content I have never once wanted to skip.', tags: ['#Mindfulness', '#AnalogLife'], spaceId: 'digital-monks', base: 82 },
  { author: 'nine.volts', place: 'Detroit', text: 'I have four thousand photographs of the sky and cannot remember a single sunset.', tags: ['#Memory', '#DigitalWellbeing'], spaceId: 'slow-tech', base: 63 },
  { author: 'reya', place: 'Beirut', text: 'The scroll never ends because an ending would let you stand up.', tags: ['#AttentionEconomy', '#CognitiveScience'], spaceId: 'cognitive-architecture', base: 89 },
  { author: 'haltsign', place: 'Rotterdam', text: 'First real silence in six years: a lift with no signal, forty seconds, eighth floor.', tags: ['#Silence', '#DigitalMinimalism'], spaceId: 'digital-monks', base: 51 },
  { author: 'sofie.wren', place: 'Malmö', text: 'I want to be known slowly. Chapter by chapter. Not in a grid of squares.', tags: ['#Philosophy', '#SlowTech'], spaceId: 'generative-philosophy', base: 67 },
  { author: 'dev.null.ish', place: 'Austin', text: 'Everyone I love is currently inside a rectangle and I hate it here.', tags: ['#SlowTech', '#FutureOfSocial'], spaceId: 'slow-tech', base: 79 },
  { author: 'amara.t', place: 'Nairobi', text: 'Made tea, forgot it, made another. Grief is mostly small logistics.', tags: ['#Philosophy', '#Memory'], spaceId: 'generative-philosophy', base: 45 },
  { author: 'p.mahesh', place: 'Chennai', text: 'My attention is the only thing I own outright and I keep handing it over for free.', tags: ['#AttentionEconomy', '#SlowTech'], spaceId: 'slow-tech', base: 84 },
  { author: 'coilroom', place: 'Bengaluru', text: 'Somewhere in Bengaluru a man still repairs radios and does not know he is a monument.', tags: ['#Craft', '#AnalogLife'], spaceId: 'mindful-builders', base: 58 },
  { author: 'juno.b', place: 'Lisbon', text: 'Held my breath through the whole tunnel like I did at nine. Still works.', tags: ['#Mindfulness', '#Memory'], spaceId: 'generative-philosophy', base: 33 },
  { author: 'thewholeway', place: 'Vancouver', text: 'If you have to hold a thought to hear it, maybe that was always the honest price.', tags: ['#SlowTech', '#Design'], spaceId: 'mindful-builders', base: 91 },
  { author: 'mirrorless', place: 'Seoul', text: 'The best conversation I had this year left no screenshots behind.', tags: ['#DigitalMinimalism', '#Solitude'], spaceId: 'digital-monks', base: 76 },
  { author: 'dwell.zero', place: 'Void', text: 'Whatever you chase forward is travelling away from you at exactly the same speed.', tags: ['#SpatialUI', '#Philosophy'], spaceId: 'cognitive-architecture', base: 60 },
  { author: 'v.okonkwo', place: 'Enugu', text: 'Nine hours of screen time and not one thing I could describe to my mother.', tags: ['#AttentionEconomy', '#DigitalWellbeing'], spaceId: 'slow-tech', base: 88 },
  { author: 'slowbus', place: 'Bristol', text: 'The bus was late and for twenty minutes I was a person again.', tags: ['#SlowTech', '#Silence'], spaceId: 'digital-monks', base: 49 },
  { author: 'thumbroute', place: 'Manila', text: 'I know the shape of my thumb’s route better than my own street.', tags: ['#CognitiveScience', '#AttentionEconomy'], spaceId: 'cognitive-architecture', base: 70 },
  { author: 'no.weather', place: 'Reykjavik', text: 'Every app wants to be a place. None of them have weather.', tags: ['#Design', '#Architecture'], spaceId: 'mindful-builders', base: 66 },
  { author: 'archivist', place: 'Kraków', text: 'I archived the photos and the grief just changed folders.', tags: ['#Memory', '#Philosophy'], spaceId: 'generative-philosophy', base: 54 },
  { author: 'twoinakitchen', place: 'Cork', text: 'Turns out I do not want an audience. I want two people and a kitchen.', tags: ['#Solitude', '#DigitalMinimalism'], spaceId: 'digital-monks', base: 81 },
  { author: 'onpurpose', place: 'Montreal', text: 'My favourite writer stopped posting and I hope it was on purpose.', tags: ['#Silence', '#SlowTech'], spaceId: 'slow-tech', base: 64 },
  { author: 'fourthtime', place: 'Hyderabad', text: 'Read the same paragraph four times because a notification stood in the doorway.', tags: ['#AttentionEconomy', '#CognitiveScience'], spaceId: 'cognitive-architecture', base: 73 },
  { author: 'noreason', place: 'Belgrade', text: 'There is no algorithm for a friend who calls without a reason.', tags: ['#Philosophy', '#FutureOfSocial'], spaceId: 'generative-philosophy', base: 85 },
  { author: 'stacks.09', place: 'Ann Arbor', text: 'The library still smells like 2009 and nothing there is trying to keep me.', tags: ['#AnalogLife', '#Memory'], spaceId: 'digital-monks', base: 59 },
  { author: 'meta.habit', place: 'Tel Aviv', text: 'I built a habit tracker to fix the habit of building habit trackers.', tags: ['#Design', '#SlowTech'], spaceId: 'mindful-builders', base: 47 },
  { author: 'kerning', place: 'Zurich', text: 'Somebody’s whole personality is a font and honestly, respect.', tags: ['#Design', '#Craft'], spaceId: 'mindful-builders', base: 38 },
  { author: 'otherroom', place: 'Wellington', text: 'Left my phone in the other room and my hand went there anyway, twice.', tags: ['#CognitiveScience', '#DigitalWellbeing'], spaceId: 'cognitive-architecture', base: 69 },
  { author: 'finished.it', place: 'Porto', text: 'The most radical thing I did this month was finish a book.', tags: ['#AnalogLife', '#Mindfulness'], spaceId: 'digital-monks', base: 87 },
  { author: 'paidfeature', place: 'Singapore', text: 'Silence used to be free. Now it is a paid feature of expensive headphones.', tags: ['#SlowTech', '#AttentionEconomy'], spaceId: 'slow-tech', base: 92 },
  { author: 'wellfed', place: 'Trivandrum', text: 'I am tired of being interesting. I would like to be quiet and well fed.', tags: ['#Philosophy', '#Solitude'], spaceId: 'generative-philosophy', base: 78 },
  { author: 'bydesign', place: 'Warsaw', text: 'Nobody is doomscrolling on purpose. That is the entire design.', tags: ['#CognitiveScience', '#AttentionEconomy'], spaceId: 'cognitive-architecture', base: 95 },
  { author: 'ninetyseconds', place: 'Ahmedabad', text: 'Watched the kettle instead of my phone. It took ninety seconds. It was fine.', tags: ['#Mindfulness', '#Silence'], spaceId: 'digital-monks', base: 56 },
  { author: 'notmine', place: 'Athens', text: 'I have opinions I never actually chose, delivered fully formed at 1am.', tags: ['#Philosophy', '#FutureOfSocial'], spaceId: 'generative-philosophy', base: 68 },
  { author: 'landlord', place: 'Karachi', text: 'My attention span has a landlord and I have never seen his face.', tags: ['#AttentionEconomy', '#SlowTech'], spaceId: 'slow-tech', base: 83 }
];

export function getInitialEchoes(): Echo[] {
  return RAW_ECHO_CORPUS.map((item, index) => {
    const depth = 1000 + index * 540 + ((index * 37) % 80);
    const color = PALETTE[index % PALETTE.length];
    const initialTethers = index % 3 === 0 ? [
      {
        id: `teth_${index}_1`,
        echoId: `echo_${index}`,
        author: 'arun.deep',
        handle: '@arun_deep',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        text: 'Staying with this. The silence in between lines speaks louder than the words.',
        timestamp: '14m ago',
        resonance: 18
      }
    ] : [];

    return {
      id: `echo_${index}`,
      index,
      author: item.author,
      handle: `@${item.author.replace(/[^a-zA-Z0-9]/g, '_')}`,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (index * 133742) % 40000000}?w=100&auto=format&fit=crop&q=80`,
      place: item.place,
      text: item.text,
      depth,
      ageMinutes: Math.round(Math.pow(depth / 1000, 1.4) * 6),
      baselineResonance: item.base,
      currentResonance: item.base,
      heldSeconds: 0,
      userHoldSeconds: 0,
      userHeld: false,
      color,
      tags: item.tags,
      spaceId: item.spaceId,
      tethers: initialTethers,
      bookmarksCount: Math.floor(item.base * 0.4),
      repostsCount: Math.floor(item.base * 0.25),
      isBookmarked: false,
      isReposted: false,
      isAuthorFollowed: false
    };
  });
}

export const INITIAL_POLL: Poll = {
  id: 'poll_attention_2026',
  question: 'Does the 40ms instant "Like" button harm genuine human connection?',
  description: 'Contribute your perspective to our community inquiry on attention architecture.',
  options: [
    { id: 'opt_1', text: 'Yes — it substitutes genuine presence with frictionless dopamine', votes: 842 },
    { id: 'opt_2', text: 'Partially — it is convenient, but devalues thoughtful reading', votes: 319 },
    { id: 'opt_3', text: 'No — fast feedback loops are the natural evolution of web UI', votes: 87 }
  ],
  totalVotes: 1248
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'dwell',
    actor: {
      name: 'Eleni Vance',
      handle: '@eleni_v',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
    },
    message: 'dwelled on your thought for 14 deliberate seconds (+28 resonance)',
    dwellSeconds: 14,
    echoSnippet: 'We call it a feed because something is being fattened...',
    timestamp: '8m ago',
    read: false
  },
  {
    id: 'notif_2',
    type: 'tether',
    actor: {
      name: 'Kaelen Vance',
      handle: '@kaelen_v',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80'
    },
    message: 'tethered a deep answer to your thought',
    echoSnippet: 'Nobody warns you that the algorithm learns your loneliness...',
    timestamp: '42m ago',
    read: false
  },
  {
    id: 'notif_3',
    type: 'follow',
    actor: {
      name: 'Sofia Chen',
      handle: '@sofia_chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
    },
    message: 'began following your frequency in the Slow Tech Movement',
    timestamp: '2h ago',
    read: true
  }
];
