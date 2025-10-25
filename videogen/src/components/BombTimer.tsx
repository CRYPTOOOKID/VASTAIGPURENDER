import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface BombTimerProps {
  startFrame: number;
  duration: number;
}

export const BombTimer: React.FC<BombTimerProps> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  // Calculate seconds remaining
  const secondsRemaining = Math.max(0, 8 - Math.floor(relativeFrame / fps));
  
  // Pulse animation - gets faster as time runs out
  const pulseSpeed = interpolate(relativeFrame, [0, duration], [1, 3]);
  const pulse = Math.sin((relativeFrame * pulseSpeed) / 10) * 0.1 + 1;
  
  // Shake animation - intensifies as timer runs down
  const shakeIntensity = interpolate(relativeFrame, [0, duration * 0.7, duration], [0, 0, 20]);
  const shakeX = Math.sin(relativeFrame * 0.5) * shakeIntensity;
  const shakeY = Math.cos(relativeFrame * 0.7) * shakeIntensity;
  
  // Spring animation for entrance
  const entrance = spring({
    frame: relativeFrame,
    fps,
    config: {
      damping: 12,
      mass: 0.5,
      stiffness: 100,
    },
  });

  // Color transition from green to red
  const warningColor = interpolate(
    relativeFrame,
    [0, duration * 0.5, duration * 0.8, duration],
    [120, 60, 30, 0] // Hue values: green -> yellow -> orange -> red
  );

  // Glow effect intensity
  const glowIntensity = interpolate(
    relativeFrame,
    [duration * 0.8, duration],
    [10, 30],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Spark animations
  const sparks = Array.from({ length: 8 }).map((_, i) => {
    const sparkAngle = (i * Math.PI * 2) / 8;
    const sparkDistance = interpolate(
      (relativeFrame + i * 3) % 30,
      [0, 15, 30],
      [0, 40, 0]
    );
    return {
      x: Math.cos(sparkAngle) * sparkDistance,
      y: Math.sin(sparkAngle) * sparkDistance,
      opacity: interpolate(
        (relativeFrame + i * 3) % 30,
        [0, 15, 30],
        [0, 1, 0]
      ),
    };
  });

  // Blast animation when timer reaches 0
  const isBlasting = secondsRemaining === 0;
  const blastParticles = Array.from({ length: 20 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 20;
    const blastDistance = interpolate(
      relativeFrame,
      [duration - 10, duration],
      [0, 150]
    );
    const blastOpacity = interpolate(
      relativeFrame,
      [duration - 10, duration - 5, duration],
      [0, 1, 0]
    );
    return {
      x: Math.cos(angle) * blastDistance,
      y: Math.sin(angle) * blastDistance,
      opacity: blastOpacity,
      rotation: (angle * 180 / Math.PI) + (relativeFrame * 20),
    };
  });

  const blastScale = interpolate(
    relativeFrame,
    [duration - 10, duration - 5, duration],
    [1, 2.5, 0.5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const bombOpacity = interpolate(
    relativeFrame,
    [duration - 10, duration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (relativeFrame < 0 || relativeFrame > duration) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        right: 80,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        zIndex: 100,
      }}
    >
      {/* Blast particles when timer hits 0 */}
      {isBlasting && blastParticles.map((particle, i) => (
        <div
          key={`blast-${i}`}
          style={{
            position: 'absolute',
            width: 15,
            height: 15,
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${particle.x}px), calc(-50% + ${particle.y}px)) rotate(${particle.rotation}deg)`,
            opacity: particle.opacity,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `hsl(${warningColor}, 100%, 60%)`,
              borderRadius: i % 3 === 0 ? '50%' : '0%',
              boxShadow: `0 0 15px hsl(${warningColor}, 100%, 50%)`,
            }}
          />
        </div>
      ))}

      {/* Flash effect during blast */}
      {isBlasting && (
        <div
          style={{
            position: 'absolute',
            width: 300,
            height: 300,
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${blastScale})`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 100, 0, 0.8), rgba(255, 200, 0, 0.4), transparent)',
            opacity: interpolate(
              relativeFrame,
              [duration - 10, duration - 5, duration],
              [0, 0.9, 0]
            ),
            filter: 'blur(10px)',
          }}
        />
      )}

      {/* Bomb Container */}
      <div
        style={{
          position: 'relative',
          transform: `scale(${entrance * pulse * (isBlasting ? blastScale : 1)})`,
          filter: `drop-shadow(0 0 ${glowIntensity}px hsl(${warningColor}, 100%, 50%))`,
          opacity: bombOpacity,
        }}
      >
        {/* Sparks */}
        {secondsRemaining <= 3 && sparks.map((spark, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: `hsl(${warningColor}, 100%, 60%)`,
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${spark.x}px), calc(-50% + ${spark.y}px))`,
              opacity: spark.opacity,
              boxShadow: `0 0 10px hsl(${warningColor}, 100%, 50%)`,
            }}
          />
        ))}

        {/* Bomb Body */}
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, #2a2a2a, #000000)`,
            border: `4px solid hsl(${warningColor}, 100%, 50%)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            boxShadow: `
              inset 0 0 30px rgba(0, 0, 0, 0.8),
              0 0 ${glowIntensity * 2}px hsl(${warningColor}, 100%, 50%)
            `,
          }}
        >
          {/* Fuse/Wick */}
          <div
            style={{
              position: 'absolute',
              top: -40,
              left: '50%',
              width: 4,
              height: 40,
              background: 'linear-gradient(to bottom, #8B4513, #654321)',
              transform: 'translateX(-50%) rotate(-5deg)',
              borderRadius: '2px',
            }}
          />
          
          {/* Fuse Fire */}
          {secondsRemaining <= 5 && (
            <div
              style={{
                position: 'absolute',
                top: -50,
                left: '50%',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: `radial-gradient(circle, hsl(${warningColor}, 100%, 60%), transparent)`,
                transform: `translateX(-50%) scale(${1 + Math.sin(relativeFrame * 0.5) * 0.3})`,
                filter: 'blur(2px)',
                boxShadow: `0 0 20px hsl(${warningColor}, 100%, 50%)`,
              }}
            />
          )}

          {/* Timer Display */}
          <div
            style={{
              fontFamily: '"Press Start 2P", "Courier New", monospace',
              fontSize: 72,
              fontWeight: 'bold',
              color: `hsl(${warningColor}, 100%, 60%)`,
              textShadow: `
                0 0 20px hsl(${warningColor}, 100%, 50%),
                0 0 40px hsl(${warningColor}, 100%, 40%),
                2px 2px 4px rgba(0, 0, 0, 0.8)
              `,
              letterSpacing: '2px',
            }}
          >
            {secondsRemaining}
          </div>

          {/* Warning Text */}
          <div
            style={{
              position: 'absolute',
              bottom: -60,
              fontFamily: '"Press Start 2P", sans-serif',
              fontSize: 16,
              color: `hsl(${warningColor}, 100%, 60%)`,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              animation: secondsRemaining <= 3 ? 'blink 0.5s infinite' : 'none',
              textShadow: `0 0 10px hsl(${warningColor}, 100%, 50%)`,
            }}
          >
            {secondsRemaining <= 3 ? '⚠ HURRY! ⚠' : 'Time to Crack!'}
          </div>
        </div>
      </div>

      {/* CSS Animation for blinking */}
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
};
