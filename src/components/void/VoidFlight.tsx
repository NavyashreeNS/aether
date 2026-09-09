import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronUp, ChevronDown, Compass, Sparkles, Layers } from 'lucide-react';
import { Echo, User } from '../../types';
import { DwellButton } from '../common/DwellButton';

interface VoidFlightProps {
  echoes: Echo[];
  currentUser: User;
  activeHoldingId: string | null;
  holdProgress: number;
  holdingSeconds: number;
  isCaught: boolean;
  onStartHold: (echoId: string) => void;
  onReleaseHold: (userHoldSeconds: number) => void;
  onCancelHold: () => void;
}

export const VoidFlight: React.FC<VoidFlightProps> = ({
  echoes,
  currentUser,
  activeHoldingId,
  holdProgress,
  holdingSeconds,
  isCaught,
  onStartHold,
  onReleaseHold,
  onCancelHold
}) => {
  const [depth, setDepth] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(15); // initial coast speed
  const [isAutoCruising, setIsAutoCruising] = useState<boolean>(true);

  const depthRef = useRef(0);
  const velocityRef = useRef(15);
  const isCaughtRef = useRef(false);
  isCaughtRef.current = isCaught;

  const dragStartRef = useRef<{ y: number; time: number } | null>(null);

  // Flight Physics Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(50, now - lastTime) / 1000;
      lastTime = now;

      if (!isCaughtRef.current) {
        // Apply friction when not auto cruising
        if (!isAutoCruising) {
          velocityRef.current *= 0.96;
        }

        depthRef.current = Math.max(0, depthRef.current + velocityRef.current * dt * 40);
        setDepth(depthRef.current);
        setVelocity(velocityRef.current);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isAutoCruising]);

  // Wheel Throttle Event Handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (isCaught) return;
    const delta = e.deltaY;
    velocityRef.current = Math.max(-20, Math.min(120, velocityRef.current + delta * 0.15));
  };

  // Pointer drag for touch / mouse
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isCaught) return;
    dragStartRef.current = { y: e.clientY, time: performance.now() };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current || isCaught) return;
    const dy = dragStartRef.current.y - e.clientY;
    velocityRef.current = Math.max(-20, Math.min(120, velocityRef.current + dy * 0.05));
    dragStartRef.current.y = e.clientY;
  };

  const handlePointerUp = () => {
    dragStartRef.current = null;
  };

  // Visible echoes in the frustum (-300m behind to +2800m ahead)
  const visibleEchoes = echoes.filter((e) => {
    const relZ = e.depth - depth;
    return relZ > -300 && relZ < 2800;
  });

  const milestoneKm = Math.floor(depth / 5000) * 5;

  return (
    <div
      className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-[#030305] select-none touch-none cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="region"
      aria-label="3D Void Flight Tunnel"
    >
      {/* Dynamic Cosmic Nebula Background */}
      <div
        className="absolute inset-[-20%] pointer-events-none opacity-40 mix-blend-screen transition-opacity duration-1000"
        style={{
          background:
            'radial-gradient(40% 40% at 30% 30%, rgba(96, 78, 214, 0.25), transparent 70%), radial-gradient(35% 35% at 70% 70%, rgba(0, 134, 168, 0.2), transparent 70%), radial-gradient(50% 50% at 50% 50%, rgba(255, 77, 157, 0.1), transparent 75%)',
          transform: `translate3d(0, ${-(depth % 10000) * 0.02}px, 0)`
        }}
      />

      {/* Speed Lines / Starlight Tunnel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 150px 180px, #5EE7FF, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 300px 90px, #8B7CFF, rgba(0,0,0,0))',
          backgroundSize: '350px 350px',
          transform: `translate3d(0, 0, ${velocity * 2}px)`
        }}
      />

      {/* Central Spotlight when an echo is caught */}
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none transition-all duration-700 ${
          isCaught ? 'opacity-80 scale-100 bg-cyan-500/15 blur-3xl' : 'opacity-0 scale-50'
        }`}
      />

      {/* 3D Perspective Stage */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        <div className="relative w-full h-full transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
          {visibleEchoes.map((echo) => {
            const relZ = echo.depth - depth;
            // CSS perspective projection math
            const scale = Math.max(0.15, 1200 / (1200 + Math.max(0, relZ)));
            const isNear = relZ >= 0 && relZ <= 600;
            const blur = relZ > 600 ? Math.min(12, ((relZ - 600) / 1200) * 10) : 0;
            const opacity = Math.max(0, Math.min(1, (2400 - relZ) / 800));

            // Jitter offset along X and Y axes
            const xOffset = Math.sin(echo.index * 1.7) * 220;
            const yOffset = Math.cos(echo.index * 2.3) * 120;

            const isHolding = activeHoldingId === echo.id;

            return (
              <div
                key={echo.id}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-75"
                style={{
                  transform: `translate3d(${xOffset}px, ${yOffset}px, ${-relZ}px)`,
                  opacity,
                  filter: `blur(${blur}px)`,
                  zIndex: Math.floor(3000 - relZ)
                }}
              >
                <div
                  className={`w-[340px] sm:w-[420px] rounded-3xl p-6 border backdrop-blur-2xl transition-all duration-300 ${
                    isHolding
                      ? 'bg-slate-900/95 border-cyan-400 shadow-[0_0_50px_rgba(94,231,255,0.4)] scale-105'
                      : isNear
                      ? 'bg-slate-900/80 border-white/20 shadow-2xl'
                      : 'bg-slate-900/40 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">{echo.author}</span>
                      <span>{echo.place}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {(echo.depth / 1000).toFixed(1)} km
                    </span>
                  </div>

                  <p className="font-display font-medium text-base sm:text-lg text-slate-100 leading-snug mb-4 line-clamp-3">
                    {echo.text}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <DwellButton
                      echoId={echo.id}
                      resonance={echo.currentResonance}
                      userHoldSeconds={echo.userHoldSeconds}
                      userHeld={echo.userHeld}
                      isActive={isHolding}
                      holdProgress={holdProgress}
                      holdingSeconds={holdingSeconds}
                      isCaught={isCaught}
                      onStartHold={onStartHold}
                      onReleaseHold={onReleaseHold}
                      onCancelHold={onCancelHold}
                    />

                    <span className="text-[10px] font-mono text-slate-400">
                      {Math.round(relZ)}m away
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flight HUD Overlay */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none">
        {/* Left Flight telemetry */}
        <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-md font-mono text-xs text-slate-300 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>DEPTH: {(depth / 1000).toFixed(2)} KM</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            VELOCITY: {velocity.toFixed(0)} M/S
          </div>
          <div className="text-slate-400 text-[11px]">
            VISIBLE ECHOES: {visibleEchoes.length}
          </div>
        </div>

        {/* Right Cruise Controls */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsAutoCruising(!isAutoCruising)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-cyan-400/40 text-xs font-mono text-slate-200 transition-colors shadow-lg cursor-pointer"
          >
            {isAutoCruising ? <Pause className="w-3.5 h-3.5 text-cyan-300" /> : <Play className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isAutoCruising ? 'Auto-Cruise ON' : 'Coasting'}</span>
          </button>

          {/* Speed accelerator buttons */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => { velocityRef.current = Math.min(120, velocityRef.current + 15); }}
              aria-label="Accelerate flight speed"
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => { velocityRef.current = Math.max(0, velocityRef.current - 15); }}
              aria-label="Decelerate flight speed"
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Flight Control Bottom Instruction Banner */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-xs font-mono text-slate-400 pointer-events-none flex items-center gap-3">
        <span>Scroll wheel or drag thumb to throttle</span>
        <span>•</span>
        <span className="text-cyan-300 font-medium">Hold card to catch &amp; dwell</span>
      </div>
    </div>
  );
};
