import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

interface StarProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

export const StarProgressBar: React.FC<StarProgressBarProps> = ({ 
  currentQuestion, 
  totalQuestions 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = (currentQuestion / totalQuestions) * 100;

  // Create star positions along the path
  const stars = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 50,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '85%',
        maxWidth: 1200,
        zIndex: 10,
      }}
    >
      {/* Decorative label */}
      <div
        style={{
          position: 'absolute',
          top: -50,
          left: 0,
          fontFamily: '"Fredoka", sans-serif',
          fontSize: 26,
          fontWeight: '600',
          color: '#8B5CF6',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 34 }}>🎯</span>
        Progress: {currentQuestion}/{totalQuestions}
      </div>

      {/* Progress path background */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 32,
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.4))',
          borderRadius: '50px',
          border: '4px solid rgba(139, 92, 246, 0.3)',
          overflow: 'hidden',
          boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.1), 0 4px 15px rgba(139, 92, 246, 0.2)',
        }}
      >
        {/* Animated fill */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #F59E0B)',
            borderRadius: '50px',
            boxShadow: 'inset 0 2px 10px rgba(255, 255, 255, 0.4)',
            transition: 'width 0.5s ease',
          }}
        >
          {/* Shimmer effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `-${100 - progress}%`,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              transform: `translateX(${(frame % 60) * 3}%)`,
            }}
          />
        </div>
      </div>

      {/* Star markers */}
      <div
        style={{
          position: 'absolute',
          top: -8,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        {stars.map((starNum) => {
          const isCompleted = starNum < currentQuestion;
          const isCurrent = starNum === currentQuestion;
          
          // Bounce animation for current star
          const bounce = isCurrent
            ? spring({
                frame: frame % 30,
                fps,
                config: {
                  damping: 8,
                  mass: 0.3,
                  stiffness: 200,
                },
              })
            : 1;

          // Rotation animation for current star
          const rotation = isCurrent ? frame * 3 : 0;
          
          // Scale and glow
          const scale = isCurrent 
            ? 1.4 + Math.sin(frame * 0.15) * 0.1 
            : isCompleted 
              ? 1.2 
              : 0.9;

          return (
            <div
              key={starNum}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `scale(${bounce})`,
              }}
            >
              {/* Star */}
              <div
                style={{
                  fontSize: 48,
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  filter: isCurrent || isCompleted
                    ? `drop-shadow(0 0 10px ${isCurrent ? '#FFD700' : '#FFA500'})`
                    : 'grayscale(1) opacity(0.4)',
                  transition: 'all 0.3s ease',
                }}
              >
                {isCompleted || isCurrent ? '⭐' : '☆'}
              </div>
              
              {/* Question number */}
              <div
                style={{
                  marginTop: -10,
                  fontFamily: '"Fredoka", sans-serif',
                  fontSize: 18,
                  fontWeight: '700',
                  color: isCurrent ? '#8B5CF6' : isCompleted ? '#10B981' : '#999',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  border: `2px solid ${isCurrent ? '#8B5CF6' : isCompleted ? '#10B981' : '#ddd'}`,
                }}
              >
                {starNum}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cute milestone indicators every 5 questions */}
      {[5, 10, 15].map((milestone) => {
        const milestoneProgress = (milestone / totalQuestions) * 100;
        const isPassed = currentQuestion > milestone;
        const isCurrent = currentQuestion === milestone;
        
        if (milestone > totalQuestions) return null;
        
        return (
          <div
            key={milestone}
            style={{
              position: 'absolute',
              top: -75,
              left: `calc(${milestoneProgress}% - 24px)`,
              fontSize: 44,
              transform: `scale(${isCurrent ? 1 + Math.sin(frame * 0.2) * 0.1 : 1})`,
              filter: isPassed || isCurrent 
                ? 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3))' 
                : 'grayscale(1) opacity(0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            {milestone === 5 && '🎈'}
            {milestone === 10 && '🎊'}
            {milestone === 15 && '🏆'}
          </div>
        );
      })}
    </div>
  );
};

