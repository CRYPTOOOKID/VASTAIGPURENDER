import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface GameProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

export const GameProgressBar: React.FC<GameProgressBarProps> = ({ currentQuestion, totalQuestions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate level progress
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  
  // XP bar fill animation
  const xpFill = interpolate(
    frame % 90,
    [0, 30, 90],
    [0, 2, 0],
    { extrapolateRight: 'clamp' }
  );

  // Particle effects
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const particleFrame = (frame + i * 8) % 60;
    const xPos = (currentQuestion / totalQuestions) * 100;
    const yOffset = interpolate(particleFrame, [0, 30, 60], [0, -40, -80]);
    const opacity = interpolate(particleFrame, [0, 20, 60], [0, 1, 0]);
    const scale = interpolate(particleFrame, [0, 20, 60], [0.5, 1.2, 0.3]);
    
    return {
      x: xPos + (i - 6) * 3,
      y: yOffset,
      opacity,
      scale,
      rotation: particleFrame * 6,
    };
  });

  // Level indicator pulse
  const levelPulse = 1 + Math.sin(frame * 0.08) * 0.08;

  // Combo streak effect
  const streakGlow = 5 + Math.sin(frame * 0.15) * 3;

  return (
    <div
      style={{
        position: 'absolute',
        top: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: 1200,
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(10, 10, 30, 0.95), rgba(30, 10, 60, 0.95))',
          borderRadius: 25,
          padding: '20px 30px',
          border: '3px solid rgba(100, 200, 255, 0.5)',
          backdropFilter: 'blur(20px)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.6),
            inset 0 2px 20px rgba(100, 200, 255, 0.2),
            0 0 ${streakGlow * 2}px rgba(100, 200, 255, 0.4)
          `,
        }}
      >
        {/* Decorative top line accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, 
              transparent,
              rgba(100, 200, 255, 0.3) 20%,
              rgba(100, 200, 255, 0.6) 50%,
              rgba(100, 200, 255, 0.3) 80%,
              transparent
            )`,
            borderRadius: '25px 25px 0 0',
          }}
        />
        
        {/* Top row: Level and stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
          }}
        >
          {/* Level badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 15,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 70,
                height: 70,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `
                  0 0 20px rgba(102, 126, 234, 0.6),
                  inset 0 2px 10px rgba(255, 255, 255, 0.3)
                `,
                transform: `scale(${levelPulse})`,
              }}
            >
              <div
                style={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: '#fff',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                }}
              >
                {currentQuestion}
              </div>
            </div>

            {/* Level text */}
            <div>
              <div
                style={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Question
              </div>
              <div
                style={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: '#fff',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                }}
              >
                Level {currentQuestion} / {totalQuestions}
              </div>
            </div>
          </div>

          {/* Stats panel */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              alignItems: 'center',
            }}
          >
            {/* Streak indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: 'linear-gradient(135deg, rgba(255, 200, 0, 0.2), rgba(255, 150, 0, 0.2))',
                borderRadius: 15,
                border: '2px solid rgba(255, 200, 0, 0.5)',
                boxShadow: `0 0 ${streakGlow}px rgba(255, 200, 0, 0.5)`,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                }}
              >
                🔥
              </div>
              <div
                style={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#FFD700',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                }}
              >
                {currentQuestion}x
              </div>
            </div>

            {/* Score/XP */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: 'linear-gradient(135deg, rgba(100, 200, 255, 0.2), rgba(80, 150, 255, 0.2))',
                borderRadius: 15,
                border: '2px solid rgba(100, 200, 255, 0.5)',
              }}
            >
              <div
                style={{
                  fontSize: 24,
                }}
              >
                ⭐
              </div>
              <div
                style={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#64C8FF',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                }}
              >
                {currentQuestion * 100} XP
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 35,
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 20,
            overflow: 'hidden',
            border: '2px solid rgba(100, 200, 255, 0.3)',
            boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Grid lines */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent ${100 / totalQuestions}%,
                rgba(255, 255, 255, 0.1) ${100 / totalQuestions}%,
                rgba(255, 255, 255, 0.1) calc(${100 / totalQuestions}% + 1px)
              )`,
            }}
          />

          {/* Animated background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 20px,
                rgba(100, 200, 255, 0.1) 20px,
                rgba(100, 200, 255, 0.1) 40px
              )`,
              transform: `translateX(${-(frame % 40)}px)`,
            }}
          />

          {/* Progress fill with enhanced gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${progressPercentage}%`,
              background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe, #667eea)',
              backgroundSize: '300% 100%',
              backgroundPosition: `${-(frame % 300)}px 0`,
              boxShadow: `
                inset 0 3px 15px rgba(255, 255, 255, 0.5),
                inset 0 -2px 10px rgba(0, 0, 0, 0.3),
                0 0 25px rgba(102, 126, 234, 0.8),
                inset 0 0 30px rgba(255, 255, 255, 0.2)
              `,
              transition: 'width 0.5s ease-out',
              borderRadius: '20px',
            }}
          />

          {/* Shine effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${progressPercentage}%`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
            }}
          />

          {/* Progress edge glow */}
          <div
            style={{
              position: 'absolute',
              top: -5,
              bottom: -5,
              left: `${progressPercentage}%`,
              width: 10,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent)',
              filter: 'blur(6px)',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Particles at progress edge */}
          {currentQuestion > 0 && particles.map((particle, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: '50%',
                transform: `translate(-50%, calc(-50% + ${particle.y}px)) scale(${particle.scale}) rotate(${particle.rotation}deg)`,
                opacity: particle.opacity,
                width: 8,
                height: 8,
                borderRadius: i % 2 === 0 ? '50%' : '0%',
                background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#64C8FF' : '#f093fb',
                boxShadow: `0 0 10px ${i % 3 === 0 ? '#FFD700' : '#64C8FF'}`,
              }}
            />
          ))}

          {/* Percentage text */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 16,
              fontWeight: 'bold',
              color: '#fff',
              textShadow: `
                0 2px 8px rgba(0, 0, 0, 0.9),
                0 0 10px rgba(100, 200, 255, 0.8)
              `,
              letterSpacing: '1px',
            }}
          >
            {Math.round(progressPercentage)}% COMPLETE
          </div>
        </div>

        {/* Milestone indicators removed - keeping progress bar cleaner */}
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        `}
      </style>
    </div>
  );
};

