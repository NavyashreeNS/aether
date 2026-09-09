import { describe, it, expect } from 'vitest';
import { StorageService } from '../services/storageService';

describe('Storage Resiliency & Accessibility Settings', () => {
  it('provides safe fallbacks for user profile when storage is empty', () => {
    const user = StorageService.getUser();
    expect(user).toBeDefined();
    expect(user.handle).toBe('@navyashree');
    expect(user.badges.length).toBe(4);
  });

  it('provides safe fallbacks for ledger metrics', () => {
    const ledger = StorageService.getLedger();
    expect(ledger).toBeDefined();
    expect(ledger.airborneSeconds).toBeGreaterThan(0);
  });

  it('preserves badges schema with valid tiers', () => {
    const user = StorageService.getUser();
    user.badges.forEach((badge) => {
      expect(['gold', 'silver', 'bronze', 'special']).toContain(badge.tier);
      expect(badge.name.length).toBeGreaterThan(0);
      expect(badge.description.length).toBeGreaterThan(0);
    });
  });
});
