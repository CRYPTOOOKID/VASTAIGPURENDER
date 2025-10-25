import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentQuestion, totalQuestions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsating glow effect
  const glowIntensity = Math.sin(frame * 0.1) * 5 + 15;

  return (
    <div
      style={{
        position: 'absolute',
        top: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 40,
      }}
    >
      {/* Question Counter with Circle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(30, 30, 60, 0.65))',
          padding: '12px 24px',
          borderRadius: '50px',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '"Press Start 2P", sans-serif',
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(245, 87, 108, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          {currentQuestion}
        </div>
        <div
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 18,
            fontWeight: '700',
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            letterSpacing: '0.5px',
          }}
        >
          of {totalQuestions} Questions
        </div>
      </div>

      {/* Star Progress Indicators */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isCompleted = index < currentQuestion;
          const isCurrent = index === currentQuestion - 1;
          
          // Spring animation for current star
          const starScale = isCurrent ? spring({
            frame: frame % 30,
            fps,
            config: {
              damping: 8,
              mass: 0.5,
              stiffness: 120,
            },
          }) : 1;

          // Rotation ONLY for current star (not completed stars)
          const rotation = isCurrent ? interpolate(
            frame,
            [0, 120],
            [0, 360],
            { extrapolateRight: 'extend' }
          ) : 0;

          return (
            <div
              key={index}
              style={{
                position: 'relative',
                transform: `scale(${isCurrent ? starScale * 1.3 : 1}) rotate(${rotation}deg)`,
                transition: 'all 0.3s ease',
              }}
            >
              {/* Star background glow */}
              {(isCompleted || isCurrent) && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: isCompleted 
                      ? 'radial-gradient(circle, rgba(255, 215, 0, 0.6), transparent)'
                      : 'radial-gradient(circle, rgba(240, 147, 251, 0.6), transparent)',
                    filter: `blur(${isCurrent ? glowIntensity : 8}px)`,
                  }}
                />
              )}
              
              {/* Star SVG */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                style={{
                  filter: (isCompleted || isCurrent) 
                    ? `drop-shadow(0 0 ${isCurrent ? glowIntensity : 8}px ${isCompleted ? '#FFD700' : '#f093fb'})`
                    : 'none',
                }}
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={isCompleted ? '#FFD700' : (isCurrent ? '#f093fb' : 'rgba(255, 255, 255, 0.2)')}
                  stroke={isCompleted || isCurrent ? '#fff' : 'rgba(255, 255, 255, 0.3)'}
                  strokeWidth="1.5"
                />
              </svg>

            </div>
          );
        })}
      </div>
    </div>
  );
};
