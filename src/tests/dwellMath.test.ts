import { describe, it, expect } from 'vitest';
import { calculateResonanceBoost } from '../hooks/useDwellEngine';

describe('Dwell Resonance Mathematical Engine', () => {
  it('confers 0 resonance for holds under 1.0 second (a tap is worth nothing)', () => {
    const resultSubSecond = calculateResonanceBoost(0.85);
    expect(resultSubSecond.boost).toBe(0);
    expect(resultSubSecond.explanation).toContain('Under 1 second');

    const resultMicroHold = calculateResonanceBoost(0.2);
    expect(resultMicroHold.boost).toBe(0);
  });

  it('calculates accurate resonance boost for deliberate holds >= 1.0 second', () => {
    // 2 seconds: round((2 - 1) * 2.2) = round(2.2) = 2
    const result2s = calculateResonanceBoost(2.0);
    expect(result2s.boost).toBe(2);

    // 3 seconds: round((3 - 1) * 2.2) = round(4.4) = 4
    const result3s = calculateResonanceBoost(3.0);
    expect(result3s.boost).toBe(4);

    // 5 seconds: round((5 - 1) * 2.2) = round(8.8) = 9
    const result5s = calculateResonanceBoost(5.0);
    expect(result5s.boost).toBe(9);

    // 10 seconds: round((10 - 1) * 2.2) = round(19.8) = 20
    const result10s = calculateResonanceBoost(10.0);
    expect(result10s.boost).toBe(20);
  });

  it('enforces the per-hold ceiling of +30 resonance points', () => {
    const result15s = calculateResonanceBoost(15.0);
    expect(result15s.boost).toBe(30);
    expect(result15s.explanation).toContain('Per-hold ceiling reached');

    const result60s = calculateResonanceBoost(60.0);
    expect(result60s.boost).toBe(30);
  });

  it('enforces the lifetime cap of +40 resonance points per user to prevent farming', () => {
    // If user already contributed 35 points, even a 10s hold (+20) can only give remaining 5 points
    const resultRestricted = calculateResonanceBoost(10.0, 35);
    expect(resultRestricted.boost).toBe(5);

    // If user already contributed 40 points, no more resonance is conferred
    const resultCapped = calculateResonanceBoost(10.0, 40);
    expect(resultCapped.boost).toBe(0);
    expect(resultCapped.explanation).toContain('Lifetime resonance cap');
  });
});
