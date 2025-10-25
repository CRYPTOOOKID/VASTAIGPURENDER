import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface VerticalTimerBarProps {
  startFrame: number;
  duration: number;
}

export const VerticalTimerBar: React.FC<VerticalTimerBarProps> = ({ startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  // Calculate seconds remaining
  const secondsRemaining = Math.max(0, 8 - Math.floor(relativeFrame / fps));
  
  // Calculate progress (0 to 1)
  const progress = Math.max(0, Math.min(1, 1 - (relativeFrame / duration)));
  
  // Color transition: Green -> Yellow -> Red
  // Green when > 3 seconds, Yellow at ~3 seconds, Red when < 3
  const isLowTime = secondsRemaining <= 3;
  const isCritical = secondsRemaining <= 1;
  
  const barColor = isCritical 
    ? '#FF0000' // Red
    : isLowTime 
    ? `hsl(${interpolate(secondsRemaining, [1, 3], [0, 60])}, 100%, 50%)` // Red to Yellow
    : '#00FF88'; // Green

  // Pulsing effect when low on time
  const pulseIntensity = isLowTime ? Math.sin(relativeFrame * 0.4) * 0.15 + 1 : 1;
  
  // Shake effect when critical
  const shakeX = isCritical ? Math.sin(relativeFrame * 0.8) * 3 : 0;
  const shakeY = isCritical ? Math.cos(relativeFrame * 1.2) * 3 : 0;

  // Glow intensity
  const glowSize = isLowTime ? 20 + Math.sin(relativeFrame * 0.3) * 10 : 10;

  // Warning stripes animation
  const stripeOffset = (relativeFrame * 2) % 40;

  if (relativeFrame < 0 || relativeFrame > duration) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 20,
        height: '100%',
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Container */}
      <div
        style={{
          position: 'relative',
          width: 50,
          height: '90%',
          background: 'linear-gradient(180deg, rgba(10, 10, 30, 0.95), rgba(20, 20, 50, 0.98))',
          borderRadius: 20,
          border: `3px solid ${barColor}40`,
          padding: 6,
          boxShadow: `
            0 0 40px rgba(0, 0, 0, 0.9),
            inset 0 2px 25px rgba(100, 200, 255, 0.2),
            0 0 ${glowSize * 2}px ${barColor},
            inset 0 0 15px ${barColor}30
          `,
          backdropFilter: 'blur(15px)',
        }}
      >
        {/* Background grid/lines */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            right: 8,
            bottom: 8,
            borderRadius: 8,
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 38px,
              rgba(255, 255, 255, 0.1) 38px,
              rgba(255, 255, 255, 0.1) 40px
            )`,
          }}
        />

        {/* Fill container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 8,
            overflow: 'hidden',
            background: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Warning stripes when low time */}
          {isLowTime && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255, 255, 0, 0.1) 10px,
                  rgba(255, 255, 0, 0.1) 20px
                )`,
                transform: `translateY(${stripeOffset}px)`,
              }}
            />
          )}

          {/* Main fill bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${progress * 100}%`,
              background: `linear-gradient(
                180deg,
                ${barColor},
                ${barColor}ee 30%,
                ${barColor}dd 70%,
                ${barColor}bb
              )`,
              boxShadow: `
                inset 0 6px 30px rgba(255, 255, 255, 0.5),
                inset 0 -6px 15px rgba(0, 0, 0, 0.4),
                0 0 ${glowSize * 3}px ${barColor},
                inset 0 0 20px ${barColor}60
              `,
              transform: `scaleY(${pulseIntensity})`,
              transformOrigin: 'bottom',
              transition: 'background 0.3s ease',
              borderRadius: '0 0 8px 8px',
            }}
          />

          {/* Enhanced shine effect on top of bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${progress * 100}%`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 20%, transparent 40%)',
              pointerEvents: 'none',
              borderRadius: '0 0 8px 8px',
            }}
          />
          
          {/* Glass reflection effect */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 2,
              width: 8,
              height: `${progress * 100}%`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 50%)',
              borderRadius: '0 0 0 8px',
              pointerEvents: 'none',
            }}
          />

          {/* Animated highlight moving up */}
          <div
            style={{
              position: 'absolute',
              bottom: `${(relativeFrame % 60) * 2}%`,
              left: 0,
              right: 0,
              height: 40,
              background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)',
              opacity: progress > 0 ? 1 : 0,
              filter: 'blur(8px)',
            }}
          />
        </div>

        {/* Removed time display - keeping only visual bar */}

        {/* Segments indicator */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            right: 8,
            bottom: 8,
            borderRadius: 8,
            pointerEvents: 'none',
          }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${(i * 100) / 7}%`,
                height: 2,
                background: 'rgba(255, 255, 255, 0.2)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Label - Rotated */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -80,
          transform: 'translateX(-50%) rotate(-90deg)',
          transformOrigin: 'center',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 12,
          color: barColor,
          textAlign: 'center',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          textShadow: `0 0 10px ${barColor}`,
          animation: isLowTime ? 'blink 0.5s infinite' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {isLowTime ? '⚠ HURRY ⚠' : 'TIME'}
      </div>

      {/* Warning particles when critical */}
      {isCritical && Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const distance = 60 + Math.sin((relativeFrame + i * 10) * 0.1) * 20;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#FF0000',
              transform: `translate(
                calc(-50% + ${Math.cos(angle) * distance}px),
                calc(-50% + ${Math.sin(angle) * distance}px)
              )`,
              opacity: interpolate((relativeFrame + i * 5) % 30, [0, 15, 30], [0, 1, 0]),
              boxShadow: '0 0 10px #FF0000',
            }}
          />
        );
      })}

      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        `}
      </style>
    </div>
  );
};

