import React, { useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface DwellButtonProps {
  echoId: string;
  resonance: number;
  userHoldSeconds: number;
  userHeld: boolean;
  isActive: boolean;
  holdProgress: number;
  holdingSeconds: number;
  isCaught: boolean;
  onStartHold: (echoId: string) => void;
  onReleaseHold: (currentContribution: number) => void;
  onCancelHold: () => void;
}

export const DwellButton: React.FC<DwellButtonProps> = ({
  echoId,
  resonance,
  userHoldSeconds,
  userHeld,
  isActive,
  holdProgress,
  holdingSeconds,
  isCaught,
  onStartHold,
  onReleaseHold,
  onCancelHold
}) => {
  const isHoldingThis = isActive;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  // Visual stroke offset for catch phase (320ms)
  const catchStrokeOffset = circumference - holdProgress * circumference;

  // Calculated live boost preview during hold
  const liveBoost = holdingSeconds >= 1.0 ? Math.min(30, Math.round((holdingSeconds - 1) * 2.2)) : 0;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onStartHold(echoId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    if (isHoldingThis) {
      onReleaseHold(userHoldSeconds);
    }
  };

  const handlePointerCancel = () => {
    if (isHoldingThis) {
      onCancelHold();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!isHoldingThis) {
        onStartHold(echoId);
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (isHoldingThis) {
        onReleaseHold(userHoldSeconds);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        role="button"
        tabIndex={0}
        aria-label={`Dwell on echo. Current resonance: ${resonance}. Press and hold to give time.`}
        aria-pressed={userHeld}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className={`group relative flex items-center gap-2.5 px-4 py-2 rounded-full font-mono text-xs transition-all select-none touch-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-cyanGlow/80 ${
          isHoldingThis
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_24px_rgba(94,231,255,0.35)] scale-105'
            : userHeld
            ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/40'
            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-white/20'
        }`}
      >
        {/* Animated Radial SVG Progress Ring */}
        <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
          <svg className="w-7 h-7 -rotate-90" viewBox="0 0 44 44">
            {/* Background circle track */}
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              className="opacity-20"
            />
            {/* Active hold progress ring */}
            {isHoldingThis && (
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="#5EE7FF"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={catchStrokeOffset}
                strokeLinecap="round"
                className="transition-all duration-75"
              />
            )}
          </svg>

          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isHoldingThis ? (
              <span className="text-[10px] font-bold font-mono text-cyan-300">
                {holdingSeconds > 0 ? `${holdingSeconds.toFixed(1)}s` : '●'}
              </span>
            ) : (
              <Sparkles className={`w-3.5 h-3.5 ${userHeld ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300 transition-colors'}`} />
            )}
          </span>
        </div>

        {/* Dynamic Button Text */}
        <div className="flex flex-col text-left">
          <span className="font-semibold tracking-wide">
            {isHoldingThis ? (
              isCaught ? (
                holdingSeconds < 1.0 ? (
                  <span className="text-amber-300">KEEP HOLDING...</span>
                ) : (
                  <span className="text-cyan-300">GIVING +{liveBoost}</span>
                )
              ) : (
                <span className="text-cyan-200">CATCHING...</span>
              )
            ) : userHeld ? (
              <span className="text-cyan-300 font-medium">RESONATING</span>
            ) : (
              <span>HOLD TO DWELL</span>
            )}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {isHoldingThis
              ? holdingSeconds >= 1.0
                ? `${holdingSeconds.toFixed(1)}s granted`
                : '1.0s minimum'
              : `${resonance} resonance`}
          </span>
        </div>
      </button>

      {/* Popover helper hint during hold */}
      {isHoldingThis && (
        <div
          role="status"
          aria-live="polite"
          className="absolute left-1/2 -top-10 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-900 border border-cyan-400/40 text-[11px] font-mono text-cyan-200 whitespace-nowrap shadow-xl z-50 pointer-events-none animate-bounce"
        >
          {holdingSeconds < 1.0 ? 'Hold > 1s to confer resonance' : `Release to transfer +${liveBoost} pts`}
        </div>
      )}
    </div>
  );
};
