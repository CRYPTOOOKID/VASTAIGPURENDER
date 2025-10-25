import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

interface DifficultyBadgesProps {
  currentDifficulty: 'easy' | 'medium' | 'hard';
  questionNumber: number;
}

export const DifficultyBadges: React.FC<DifficultyBadgesProps> = ({ 
  currentDifficulty, 
  questionNumber 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badges = [
    { 
      level: 'easy' as const, 
      label: 'Easy', 
      emoji: '🌱', 
      color: '#10B981', 
      bgColor: 'rgba(16, 185, 129, 0.15)',
      range: '1-5'
    },
    { 
      level: 'medium' as const, 
      label: 'Medium', 
      emoji: '🔥', 
      color: '#3B82F6', 
      bgColor: 'rgba(59, 130, 246, 0.15)',
      range: '6-10'
    },
    { 
      level: 'hard' as const, 
      label: 'Hard', 
      emoji: '⚡', 
      color: '#8B5CF6', 
      bgColor: 'rgba(139, 92, 246, 0.15)',
      range: '11-15'
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 20,
        zIndex: 10,
      }}
    >
      {badges.map((badge, index) => {
        const isActive = badge.level === currentDifficulty;
        
        // Bounce animation when active
        const bounce = spring({
          frame: frame - (index * 5),
          fps,
          config: {
            damping: 10,
            mass: 0.5,
            stiffness: 100,
          },
        });

        // Scale up when active - stays popped out without pulsing
        const scale = isActive 
          ? 1.1
          : 0.9;

        // Glow intensity when active - static glow
        const glowIntensity = isActive 
          ? 25
          : 0;

        return (
          <div
            key={badge.level}
            style={{
              padding: '16px 36px',
              background: isActive 
                ? `linear-gradient(135deg, ${badge.color}, ${badge.color}dd)`
                : 'rgba(255, 255, 255, 0.6)',
              border: isActive 
                ? `5px solid ${badge.color}` 
                : '4px solid rgba(200, 200, 200, 0.4)',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              transform: `scale(${bounce * scale})`,
              boxShadow: isActive
                ? `
                  0 8px 25px ${badge.bgColor},
                  0 0 ${glowIntensity}px ${badge.color}88,
                  inset 0 2px 10px rgba(255, 255, 255, 0.3)
                `
                : '0 4px 15px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ 
              fontSize: 38,
              filter: isActive ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' : 'none',
            }}>
              {badge.emoji}
            </div>
            <div style={{
              fontFamily: '"Fredoka", sans-serif',
              fontSize: 32,
              fontWeight: '700',
              color: isActive ? '#fff' : '#666',
              textShadow: isActive ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
            }}>
              {badge.label}
            </div>
            {isActive && (
              <div style={{
                fontSize: 22,
                fontFamily: '"Fredoka", sans-serif',
                fontWeight: '600',
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '5px 14px',
                borderRadius: '14px',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
              }}>
                Q{questionNumber}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

