import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate, random } from 'remotion';

interface ConfettiCelebrationProps {
  startFrame: number;
}

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({ 
  startFrame 
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;

  // Only show for first 60 frames after answer reveal
  if (elapsed < 0 || elapsed > 60) return null;

  // Memoize confetti base properties to avoid recalculation
  const confettiBase = useMemo(() => {
    const confettiCount = 30; // Reduced from 50
    return Array.from({ length: confettiCount }, (_, i) => {
      const seed = i;
      return {
        startX: random(`x-${seed}`) * 100,
        startY: random(`y-${seed}`) * 40 - 20,
        velocityX: (random(`vx-${seed}`) - 0.5) * 8,
        velocityY: random(`vy-${seed}`) * 5 + 2,
        rotation: random(`rot-${seed}`) * 360,
        rotationSpeed: (random(`rotspeed-${seed}`) - 0.5) * 10,
        color: [
          '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
          '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
          '#FFD93D', '#6BCF7F', '#FF85A2', '#A8E6CF'
        ][Math.floor(random(`color-${seed}`) * 12)],
        shape: ['circle', 'square'][Math.floor(random(`shape-${seed}`) * 2)], // Removed triangle for performance
        size: 12 + random(`size-${seed}`) * 16,
      };
    });
  }, []);

  // Calculate dynamic properties based on current frame
  const confetti = confettiBase.map((base) => {
    const gravity = 0.15;
    const x = base.startX + base.velocityX * elapsed;
    const y = base.startY + base.velocityY * elapsed + 0.5 * gravity * elapsed * elapsed;
    const currentRotation = base.rotation + base.rotationSpeed * elapsed;
    const opacity = interpolate(elapsed, [0, 10, 50, 60], [0, 1, 1, 0]);

    return { ...base, x, y, currentRotation, opacity };
  });

  // Memoize sparkle base properties
  const sparkleBase = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => { // Reduced from 20
      const angle = (i / 12) * Math.PI * 2;
      const size = 28 + random(`sparkle-${i}`) * 20;
      return { angle, size };
    });
  }, []);

  // Calculate dynamic sparkle positions
  const sparkles = sparkleBase.map((base) => {
    const distance = elapsed * 8;
    const x = 50 + Math.cos(base.angle) * distance;
    const y = 50 + Math.sin(base.angle) * distance;
    const opacity = interpolate(elapsed, [0, 5, 20, 30], [0, 1, 0.5, 0]);
    return { x, y, opacity, size: base.size };
  });

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Confetti pieces - optimized rendering */}
      {confetti.map((piece, i) => {
        if (piece.y > 110) return null;

        return (
          <div
            key={`confetti-${i}`}
            style={{
              position: 'absolute',
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              width: piece.size,
              height: piece.size,
              background: piece.color,
              borderRadius: piece.shape === 'circle' ? '50%' : '0',
              transform: `rotate(${piece.currentRotation}deg)`,
              opacity: piece.opacity,
            }}
          />
        );
      })}

      {/* Sparkle bursts */}
      {elapsed < 30 && sparkles.map((sparkle, i) => (
        <div
          key={`sparkle-${i}`}
          style={{
            position: 'absolute',
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            fontSize: sparkle.size,
            opacity: sparkle.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        >
          ✨
        </div>
      ))}

      {/* Central burst emoji animation */}
      {elapsed < 40 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: interpolate(elapsed, [0, 10, 30, 40], [0, 150, 100, 0]),
            opacity: interpolate(elapsed, [0, 5, 30, 40], [0, 1, 0.6, 0]),
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
          }}
        >
          🎉
        </div>
      )}

      {/* Side burst emojis - reduced and simplified */}
      {elapsed < 35 && (
        <>
          {['🎊', '⭐', '🌟'].map((emoji, i) => { // Reduced from 5 to 3
            const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
            const distance = interpolate(elapsed, [5, 35], [0, 35]);
            const x = 50 + Math.cos(angle) * distance;
            const y = 50 + Math.sin(angle) * distance;
            const opacity = interpolate(elapsed, [5, 15, 30, 35], [0, 1, 0.8, 0]);

            return (
              <div
                key={`emoji-${i}`}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  fontSize: 64,
                  opacity: opacity,
                  transform: 'translate(-50%, -50%)',
                  filter: 'drop-shadow(0 3px 8px rgba(0, 0, 0, 0.25))',
                }}
              >
                {emoji}
              </div>
            );
          })}
        </>
      )}

    </div>
  );
};

