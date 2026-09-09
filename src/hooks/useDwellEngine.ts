import { useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sound } from '../services/soundService';

export interface DwellResult {
  seconds: number;
  boostGiven: number;
  message: string;
}

export function calculateResonanceBoost(seconds: number, currentContribution: number = 0): { boost: number; explanation: string } {
  if (seconds < 1.0) {
    return {
      boost: 0,
      explanation: 'Under 1 second: A tap costs nothing and conveys nothing.'
    };
  }

  // 14.6s reaches +30 per-hold ceiling
  const rawBoost = Math.round(Math.max(0, seconds - 1) * 2.2);
  const perHoldClamped = Math.min(30, Math.max(1, rawBoost));

  // Max 40 lifetime contribution from one user to prevent farming
  const remainingAllowance = Math.max(0, 40 - currentContribution);
  const finalBoost = Math.min(perHoldClamped, remainingAllowance);

  let explanation = `+${finalBoost} resonance conferred for ${seconds.toFixed(1)}s of deliberate presence.`;
  if (remainingAllowance === 0) {
    explanation = 'Lifetime resonance cap (40 pts) reached for this echo.';
  } else if (perHoldClamped >= 30) {
    explanation += ' (Per-hold ceiling reached)';
  }

  return { boost: finalBoost, explanation };
}

export function useDwellEngine(onDwellComplete: (echoId: string, result: DwellResult) => void) {
  const [activeEchoId, setActiveEchoId] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState<number>(0); // 0 to 1 for initial 320ms catch
  const [holdingSeconds, setHoldingSeconds] = useState<number>(0);
  const [isCaught, setIsCaught] = useState<boolean>(false);

  const holdStartRef = useRef<number>(0);
  const holdTimerRef = useRef<number | null>(null);
  const secondTickRef = useRef<number>(0);

  const startHold = useCallback((echoId: string) => {
    setActiveEchoId(echoId);
    holdStartRef.current = Date.now();
    secondTickRef.current = 0;
    setHoldProgress(0);
    setHoldingSeconds(0);
    setIsCaught(false);

    Sound.playHoldStart();

    const HOLD_CATCH_MS = 320;
    const interval = 16; // 60fps update

    holdTimerRef.current = window.setInterval(() => {
      const elapsedMs = Date.now() - holdStartRef.current;
      const progress = Math.min(1, elapsedMs / HOLD_CATCH_MS);
      setHoldProgress(progress);

      if (progress >= 1) {
        setIsCaught(true);
        const dwellSeconds = (elapsedMs - HOLD_CATCH_MS) / 1000;
        setHoldingSeconds(dwellSeconds);

        const currentSec = Math.floor(dwellSeconds);
        if (currentSec > secondTickRef.current) {
          secondTickRef.current = currentSec;
          Sound.playSecondTick(currentSec);
        }
      }
    }, interval);
  }, []);

  const releaseHold = useCallback((currentContribution: number = 0) => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (!activeEchoId) return;

    const totalElapsedMs = Date.now() - holdStartRef.current;
    const HOLD_CATCH_MS = 320;

    let dwellSeconds = 0;
    if (totalElapsedMs > HOLD_CATCH_MS) {
      dwellSeconds = (totalElapsedMs - HOLD_CATCH_MS) / 1000;
    }

    const { boost, explanation } = calculateResonanceBoost(dwellSeconds, currentContribution);

    if (boost > 0) {
      Sound.playResonanceChime(dwellSeconds);

      try {
        confetti({
          particleCount: Math.min(60, 20 + boost * 2),
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#5EE7FF', '#8B7CFF', '#4FFFC4', '#FFB454']
        });
      } catch {}
    }

    onDwellComplete(activeEchoId, {
      seconds: dwellSeconds,
      boostGiven: boost,
      message: explanation
    });

    setActiveEchoId(null);
    setHoldProgress(0);
    setHoldingSeconds(0);
    setIsCaught(false);
  }, [activeEchoId, onDwellComplete]);

  const cancelHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setActiveEchoId(null);
    setHoldProgress(0);
    setHoldingSeconds(0);
    setIsCaught(false);
  }, []);

  return {
    activeEchoId,
    holdProgress,
    holdingSeconds,
    isCaught,
    startHold,
    releaseHold,
    cancelHold
  };
}
