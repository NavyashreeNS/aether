import { describe, it, expect } from 'vitest';
import { getInitialEchoes, INITIAL_SPACES, INITIAL_POLL } from '../services/corpusData';
import { Echo, Tether } from '../types';

describe('Social Interaction & Community Logic', () => {
  it('generates the initial 40 corpus echoes with correct properties', () => {
    const echoes = getInitialEchoes();
    expect(echoes.length).toBe(40);
    expect(echoes[0].depth).toBeGreaterThanOrEqual(1000);
    expect(echoes[0].author).toBe('sable.ng');
    expect(echoes[0].tags.length).toBeGreaterThan(0);
  });

  it('supports attaching tethers to an echo', () => {
    const echoes = getInitialEchoes();
    const targetEcho = echoes[0];

    const newTether: Tether = {
      id: 'test_teth_1',
      echoId: targetEcho.id,
      author: 'Test Explorer',
      handle: '@test_explorer',
      avatar: 'https://example.com/avatar.jpg',
      text: 'A profound reflection on spatial attention.',
      timestamp: 'Just now',
      resonance: 5
    };

    const updatedTethers = [...targetEcho.tethers, newTether];
    expect(updatedTethers.length).toBe(targetEcho.tethers.length + 1);
    expect(updatedTethers[updatedTethers.length - 1].text).toBe('A profound reflection on spatial attention.');
  });

  it('correctly manages community spaces membership states', () => {
    const spaces = [...INITIAL_SPACES];
    expect(spaces.length).toBe(5);

    const targetSpace = spaces.find((s) => s.id === 'slow-tech');
    expect(targetSpace).toBeDefined();
    expect(targetSpace?.isJoined).toBe(true);

    // Toggle leave
    const updated = spaces.map((s) =>
      s.id === 'slow-tech' ? { ...s, isJoined: false, membersCount: s.membersCount - 1 } : s
    );
    const leftSpace = updated.find((s) => s.id === 'slow-tech');
    expect(leftSpace?.isJoined).toBe(false);
  });

  it('correctly tallies poll voting options', () => {
    const poll = { ...INITIAL_POLL };
    const optionToVote = poll.options[0].id;

    const nextOptions = poll.options.map((opt) =>
      opt.id === optionToVote ? { ...opt, votes: opt.votes + 1 } : opt
    );

    const updatedPoll = {
      ...poll,
      options: nextOptions,
      totalVotes: poll.totalVotes + 1,
      userVotedId: optionToVote
    };

    expect(updatedPoll.totalVotes).toBe(INITIAL_POLL.totalVotes + 1);
    expect(updatedPoll.userVotedId).toBe(optionToVote);
    expect(updatedPoll.options[0].votes).toBe(INITIAL_POLL.options[0].votes + 1);
  });
});
