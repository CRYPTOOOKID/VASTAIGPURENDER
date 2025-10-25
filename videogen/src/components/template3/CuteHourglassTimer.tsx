import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

interface CuteHourglassTimerProps {
  startFrame: number;
  duration: number;
}

export const CuteHourglassTimer: React.FC<CuteHourglassTimerProps> = ({ 
  startFrame, 
  duration 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = frame - startFrame;
  const progress = Math.min(elapsed / duration, 1);
  const remaining = Math.max(duration - elapsed, 0);
  const secondsRemaining = Math.ceil(remaining / fps);

  // Entrance animation
  const entrance = spring({
    frame: elapsed,
    fps,
    config: {
      damping: 10,
      mass: 0.5,
      stiffness: 100,
    },
  });

  // Optimized pulse animation - only when needed and smoother
  const pulse = useMemo(() => {
    if (secondsRemaining <= 3) {
      return 1 + Math.sin(frame * 0.2) * 0.08;
    }
    return 1;
  }, [frame, secondsRemaining]);

  // Urgency color and emoji - memoized for performance
  const urgency = useMemo(() => {
    if (secondsRemaining <= 2) return { 
      color: '#EF4444', 
      bgColor: 'rgba(239, 68, 68, 0.2)',
      emoji: '🔥',
      message: 'Hurry!'
    };
    if (secondsRemaining <= 4) return { 
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.2)',
      emoji: '⚡',
      message: 'Quick!'
    };
    if (secondsRemaining <= 6) return { 
      color: '#FBBF24',
      bgColor: 'rgba(251, 191, 36, 0.2)',
      emoji: '⏰',
      message: 'Think!'
    };
    return { 
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.2)',
      emoji: '💭',
      message: 'Time'
    };
  }, [secondsRemaining]);

  // Circle progress
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      style={{
        position: 'absolute',
        top: 120,
        right: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 15,
        zIndex: 20,
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* Timer Container */}
      <div
        style={{
          position: 'relative',
          width: 180,
          height: 180,
          transform: `scale(${pulse})`,
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${urgency.bgColor} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />

        {/* Outer decorative ring - removed rotation for performance */}
        <svg
          width="180"
          height="180"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <circle
            cx="90"
            cy="90"
            r="85"
            fill="none"
            stroke={urgency.color}
            strokeWidth="2"
            strokeDasharray="8 8"
            opacity="0.3"
          />
        </svg>

        {/* Main circular progress */}
        <svg
          width="180"
          height="180"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)',
          }}
        >
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r="60"
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="12"
          />
          
          {/* Progress circle - removed CSS transition for smooth Remotion rendering */}
          <circle
            cx="90"
            cy="90"
            r="60"
            fill="none"
            stroke={urgency.color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 ${secondsRemaining <= 3 ? 12 : 6}px ${urgency.color})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {/* Time number */}
          <div
            style={{
              fontFamily: '"Fredoka", sans-serif',
              fontSize: 72,
              fontWeight: '700',
              color: urgency.color,
              textShadow: `0 3px 12px ${urgency.color}66`,
              lineHeight: 1,
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
            }}
          >
            {secondsRemaining}
          </div>
          
          {/* Seconds text */}
          <div
            style={{
              fontFamily: '"Fredoka", sans-serif',
              fontSize: 24,
              fontWeight: '600',
              color: urgency.color,
              opacity: 0.8,
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
            }}
          >
            sec
          </div>
        </div>

        {/* Floating emoji indicator - simplified animation */}
        <div
          style={{
            position: 'absolute',
            top: -15,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 48,
            filter: 'drop-shadow(0 3px 8px rgba(0, 0, 0, 0.3))',
          }}
        >
          {urgency.emoji}
        </div>

        {/* Simplified urgency waves - only when critical */}
        {secondsRemaining <= 3 && (
          <>
            {[0, 1].map((i) => {
              const waveProgress = ((frame * 0.05 + i * 0.5) % 1);
              const waveOpacity = Math.max(0, 0.4 - waveProgress * 0.4);
              const waveScale = 1 + waveProgress * 0.6;
              
              return (
                <div
                  key={`wave-${i}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${waveScale})`,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    border: `3px solid ${urgency.color}`,
                    opacity: waveOpacity,
                    pointerEvents: 'none',
                  }}
                />
              );
            })}
          </>
        )}
      </div>

      {/* Message badge */}
      <div
        style={{
          fontFamily: '"Fredoka", sans-serif',
          fontSize: 26,
          fontWeight: '700',
          color: '#fff',
          background: urgency.color,
          padding: '12px 28px',
          borderRadius: '24px',
          boxShadow: `0 6px 20px ${urgency.color}66`,
          border: '3px solid rgba(255, 255, 255, 0.3)',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
        }}
      >
        {urgency.message}
      </div>
    </div>
  );
};
