import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile, Sequence } from 'remotion';
import { VerticalTimerBar } from './VerticalTimerBar';
import { GameProgressBar } from './GameProgressBar';

interface QuestionSceneProps {
  question: string;
  options: string[];
  answer: string;
  questionNumber: number;
  questionId: number;
  totalQuestions: number;
  audioFolder: string;
  questionDisplayDuration: number;
  optionsAndTimerDuration: number;
  answerRevealDuration: number;
}

export const QuestionSceneTemplate2: React.FC<QuestionSceneProps> = ({
  question,
  options,
  answer,
  questionNumber,
  questionId,
  totalQuestions,
  audioFolder,
  questionDisplayDuration,
  optionsAndTimerDuration,
  answerRevealDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing
  const questionPhaseEnd = questionDisplayDuration;
  const optionsPhaseEnd = questionPhaseEnd + optionsAndTimerDuration;
  const answerPhaseEnd = optionsPhaseEnd + answerRevealDuration;

  // Question entrance animation
  const questionEntrance = spring({
    frame,
    fps,
    config: {
      damping: 15,
      mass: 0.8,
      stiffness: 80,
    },
  });

  const questionGrow = interpolate(
    frame,
    [questionPhaseEnd - 15, questionPhaseEnd + 15],
    [1, 1.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const questionMoveUp = interpolate(
    frame,
    [questionPhaseEnd - 15, questionPhaseEnd + 15],
    [0, -180],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Options entrance with stagger effect
  const optionsEntrance = (index: number) => {
    const staggerDelay = index * 5;
    return spring({
      frame: frame - questionPhaseEnd - staggerDelay,
      fps,
      config: {
        damping: 12,
        mass: 0.5,
        stiffness: 100,
      },
    });
  };

  const pulse = frame < questionPhaseEnd ? 1 + Math.sin(frame * 0.1) * 0.03 : 1;

  // Determine which option is correct
  const correctIndex = options.indexOf(answer);

  // Answer reveal animation
  const answerGlow = interpolate(
    frame,
    [optionsPhaseEnd, optionsPhaseEnd + 10, optionsPhaseEnd + 20, optionsPhaseEnd + 30],
    [0, 30, 10, 30],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* Question-specific audio */}
      <Audio
        src={staticFile(`question_audios/question_${questionId}.mp3`)}
        volume={1.0}
      />

      <Audio
        src={staticFile('question displays.mp3')}
        volume={1.0}
      />

      <Sequence from={questionPhaseEnd}>
        <Audio
          src={staticFile('8 seconds counter.mp3')}
          volume={0.4}
        />
      </Sequence>

      <Sequence from={optionsPhaseEnd}>
        <Audio
          src={staticFile('ding.mp3')}
          volume={1.2}
        />
      </Sequence>

      {/* ENHANCED SPACE/GALAXY BACKGROUND */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at 50% 50%, #1a0a3e 0%, #0a0520 40%, #000000 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Deep space gradient layers for depth */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `radial-gradient(ellipse at 30% 20%, rgba(75, 0, 130, 0.3) 0%, transparent 50%),
                         radial-gradient(ellipse at 70% 80%, rgba(25, 25, 112, 0.3) 0%, transparent 50%)`,
          }}
        />

        {/* Distant stars (layer 1 - far away, tiny) - OPTIMIZED */}
        {Array.from({ length: 80 }).map((_, i) => {
          const xPos = (i * 73) % 100;
          const yPos = (i * 41) % 100;
          const twinkle = 0.3 + Math.sin((frame + i * 15) * 0.02) * 0.3;
          const size = 0.8 + (i % 2) * 0.4;
          
          return (
            <div
              key={`star-far-${i}`}
              style={{
                position: 'absolute',
                left: `${xPos}%`,
                top: `${yPos}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: i % 3 === 0 ? '#e6f2ff' : '#ffffff',
                opacity: twinkle,
                boxShadow: `0 0 ${size}px rgba(255, 255, 255, 0.5)`,
                willChange: 'opacity',
              }}
            />
          );
        })}

        {/* Medium stars (layer 2 - mid distance, colorful) - OPTIMIZED */}
        {Array.from({ length: 50 }).map((_, i) => {
          const xPos = (i * 87) % 100;
          const yPos = (i * 43) % 100;
          const twinkle = 0.5 + Math.sin((frame + i * 10) * 0.05) * 0.5;
          const size = 2 + (i % 3);
          const color = i % 4 === 0 ? '#b3d9ff' : i % 4 === 1 ? '#ffecb3' : '#ffffff';
          
          return (
            <div
              key={`star-mid-${i}`}
              style={{
                position: 'absolute',
                left: `${xPos}%`,
                top: `${yPos}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: color,
                opacity: twinkle,
                boxShadow: `0 0 ${size * 2}px ${color}dd`,
                willChange: 'opacity',
              }}
            />
          );
        })}

        {/* Moving particles - OPTIMIZED */}
        {Array.from({ length: 15 }).map((_, i) => {
          const xPos = ((i * 67 + frame * 0.2) % 110) - 5;
          const yPos = ((i * 53 + frame * 0.15) % 110) - 5;
          const size = 4 + (i % 3) * 2;
          const opacity = 0.3 + Math.sin((frame + i * 20) * 0.03) * 0.3;
          
          return (
            <div
              key={`particle-${i}`}
              style={{
                position: 'absolute',
                left: `${xPos}%`,
                top: `${yPos}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(100, 200, 255, 0.8), rgba(200, 100, 255, 0.3))',
                opacity,
                filter: 'blur(1px)',
                willChange: 'transform',
              }}
            />
          );
        })}

        {/* Galaxy nebula clouds - OPTIMIZED */}
        {Array.from({ length: 4 }).map((_, i) => {
          const xOffset = Math.sin((frame + i * 100) * 0.003) * 10;
          const yOffset = Math.cos((frame + i * 80) * 0.002) * 15;
          const scale = 1 + Math.sin((frame + i * 50) * 0.005) * 0.2;
          
          const colors = [
            'rgba(138, 43, 226, 0.35)',   // Blue-violet
            'rgba(75, 0, 130, 0.3)',      // Indigo
            'rgba(123, 104, 238, 0.3)',   // Medium slate blue
            'rgba(147, 112, 219, 0.3)',   // Medium purple
          ];
          
          const positions = [
            { x: 15 + xOffset, y: 25 + yOffset },
            { x: 75 + xOffset, y: 30 + yOffset },
            { x: 40 + xOffset, y: 65 + yOffset },
            { x: 60 + xOffset, y: 15 + yOffset },
          ];
          
          return (
            <div
              key={`nebula-${i}`}
              style={{
                position: 'absolute',
                left: `${positions[i].x}%`,
                top: `${positions[i].y}%`,
                width: 550,
                height: 550,
                borderRadius: '50%',
                background: colors[i],
                filter: 'blur(100px)',
                transform: `scale(${scale})`,
                opacity: 0.55,
                mixBlendMode: 'screen',
                willChange: 'transform',
              }}
            />
          );
        })}
        
        {/* Bright star clusters - OPTIMIZED */}
        {Array.from({ length: 5 }).map((_, i) => {
          const xPos = (i * 93 + 10) % 95;
          const yPos = (i * 71 + 15) % 90;
          const glow = 18 + Math.sin((frame + i * 20) * 0.03) * 6;
          
          return (
            <div
              key={`cluster-${i}`}
              style={{
                position: 'absolute',
                left: `${xPos}%`,
                top: `${yPos}%`,
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#ffffff',
                opacity: 0.9,
                boxShadow: `0 0 ${glow}px rgba(255, 255, 255, 0.9),
                            0 0 ${glow * 2}px rgba(200, 220, 255, 0.5)`,
                willChange: 'opacity',
              }}
            />
          );
        })}

        {/* Cosmic dust/Milky Way effect - OPTIMIZED */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '-10%',
            right: '-10%',
            height: '60%',
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(100, 100, 150, 0.06) 30%,
              rgba(120, 120, 180, 0.08) 50%,
              rgba(100, 100, 150, 0.06) 70%,
              transparent 100%
            )`,
            transform: `rotate(-15deg)`,
            filter: 'blur(35px)',
            opacity: 0.35,
          }}
        />
        
        {/* Shooting stars - OPTIMIZED (less frequent) */}
        {frame % 200 < 60 && (() => {
          const shootingFrame = frame % 200;
          const progress = shootingFrame / 60;
          const xStart = 20;
          const yStart = 15;
          const xEnd = xStart + 35;
          const yEnd = yStart + 25;
          const x = xStart + (xEnd - xStart) * progress;
          const y = yStart + (yEnd - yStart) * progress;
          const opacity = progress < 0.4 ? progress * 2.5 : (1 - progress) * 1.7;
          
          return shootingFrame < 60 ? (
            <div
              key={`shooting`}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: 50,
                height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
                transform: 'rotate(45deg)',
                opacity,
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.7)',
                willChange: 'transform, opacity',
              }}
            />
          ) : null;
        })()}

        {/* Overlay gradient for depth */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
          }}
        />
      </div>

      {/* Game Progress Bar */}
      <GameProgressBar currentQuestion={questionNumber} totalQuestions={totalQuestions} />

      {/* Question Display */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `
            translate(-50%, calc(-50% + ${questionMoveUp}px))
            scale(${questionEntrance * questionGrow * pulse})
          `,
          width: '85%',
          maxWidth: 1200,
          textAlign: 'center',
        }}
      >
        {/* Question header bar */}
        <div
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(100, 200, 255, 0.3), transparent)',
            height: 4,
            marginBottom: 20,
            borderRadius: 2,
            boxShadow: '0 0 20px rgba(100, 200, 255, 0.5)',
          }}
        />
        
        {/* Question box */}
        <div
          style={{
            position: 'relative',
            fontFamily: '"Orbitron", "DM Sans", sans-serif',
            fontSize: frame < questionPhaseEnd ? 64 : 38,
            fontWeight: '700',
            color: '#ffffff',
            textShadow: `
              0 4px 20px rgba(0, 0, 0, 0.9),
              0 0 30px rgba(100, 200, 255, 0.6),
              0 2px 10px rgba(100, 200, 255, 0.8)
            `,
            padding: '45px 55px',
            background: 'linear-gradient(135deg, rgba(10, 10, 30, 0.92), rgba(30, 10, 60, 0.92))',
            borderRadius: '30px',
            border: '3px solid rgba(100, 200, 255, 0.6)',
            backdropFilter: 'blur(25px)',
            boxShadow: `
              0 25px 70px rgba(0, 0, 0, 0.7),
              inset 0 2px 30px rgba(100, 200, 255, 0.15),
              0 0 40px rgba(100, 200, 255, 0.4)
            `,
            lineHeight: 1.6,
            letterSpacing: '0.5px',
          }}
        >
          {/* Corner accents */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
            <div
              key={corner}
              style={{
                position: 'absolute',
                width: 30,
                height: 30,
                ...(corner.includes('top') ? { top: -3 } : { bottom: -3 }),
                ...(corner.includes('left') ? { left: -3 } : { right: -3 }),
                border: '3px solid rgba(100, 200, 255, 0.9)',
                borderRadius: corner.includes('top') 
                  ? (corner.includes('left') ? '30px 0 0 0' : '0 30px 0 0')
                  : (corner.includes('left') ? '0 0 0 30px' : '0 0 30px 0'),
                ...(corner.includes('top') && { borderBottom: 'none' }),
                ...(corner.includes('bottom') && { borderTop: 'none' }),
                ...(corner.includes('left') && { borderRight: 'none' }),
                ...(corner.includes('right') && { borderLeft: 'none' }),
                boxShadow: `0 0 15px rgba(100, 200, 255, 0.6)`,
              }}
            />
          ))}
          
          {/* Question number badge */}
          <div
            style={{
              position: 'absolute',
              top: -25,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '8px 24px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: 20,
              border: '3px solid rgba(255, 255, 255, 0.4)',
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 16,
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              boxShadow: '0 5px 20px rgba(102, 126, 234, 0.6)',
              letterSpacing: '2px',
            }}
          >
            Q{questionNumber}
          </div>
          
          {question}
          
          {/* Animated glow on edges */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '30px',
              background: `linear-gradient(
                ${(frame * 2) % 360}deg,
                transparent 0%,
                rgba(100, 200, 255, 0.1) 50%,
                transparent 100%
              )`,
              pointerEvents: 'none',
            }}
          />
        </div>
        
        {/* Question footer bar */}
        <div
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(100, 200, 255, 0.3), transparent)',
            height: 4,
            marginTop: 20,
            borderRadius: 2,
            boxShadow: '0 0 20px rgba(100, 200, 255, 0.5)',
          }}
        />
      </div>

      {/* Options Display */}
      {frame >= questionPhaseEnd && frame < answerPhaseEnd && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            marginTop: '120px',
            width: '85%',
            maxWidth: 1200,
            display: 'flex',
            flexDirection: 'column',
            gap: 25,
            justifyContent: 'center',
          }}
        >
          {options.map((option, index) => {
            const entrance = optionsEntrance(index);
            const isCorrect = index === correctIndex;
            const showAnswer = frame >= optionsPhaseEnd;

            const slideY = (1 - entrance) * 100;
            
            const correctAnswerScale = showAnswer && isCorrect 
              ? spring({
                  frame: frame - optionsPhaseEnd,
                  fps,
                  config: {
                    damping: 10,
                    mass: 0.6,
                    stiffness: 150,
                  },
                })
              : 1;

            return (
              <div
                key={index}
                style={{
                  transform: `translateY(${slideY}px) scale(${entrance * (showAnswer && isCorrect ? correctAnswerScale * 1.08 : 1)})`,
                  opacity: entrance,
                  padding: '24px 40px',
                  width: '100%',
                  position: 'relative',
                  background: showAnswer && isCorrect
                    ? 'linear-gradient(135deg, #10b981, #34d399, #6ee7b7)'
                    : 'linear-gradient(135deg, rgba(10, 10, 30, 0.9), rgba(30, 10, 60, 0.9))',
                  borderRadius: '20px',
                  border: showAnswer && isCorrect
                    ? '4px solid #00ff88'
                    : '3px solid rgba(100, 200, 255, 0.5)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: showAnswer && isCorrect
                    ? `
                      0 0 ${answerGlow * 3}px rgba(0, 255, 136, 1),
                      0 0 ${answerGlow * 5}px rgba(0, 255, 136, 0.8),
                      0 20px 60px rgba(0, 0, 0, 0.6),
                      inset 0 2px 20px rgba(255, 255, 255, 0.3)
                    `
                    : `0 15px 50px rgba(0, 0, 0, 0.6), inset 0 2px 15px rgba(100, 200, 255, 0.1)`,
                }}
              >
                {/* Corner indicators */}
                {!showAnswer && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        width: 20,
                        height: 20,
                        borderTop: '3px solid rgba(100, 200, 255, 0.8)',
                        borderLeft: '3px solid rgba(100, 200, 255, 0.8)',
                        borderRadius: '20px 0 0 0',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 20,
                        height: 20,
                        borderTop: '3px solid rgba(100, 200, 255, 0.8)',
                        borderRight: '3px solid rgba(100, 200, 255, 0.8)',
                        borderRadius: '0 20px 0 0',
                      }}
                    />
                  </>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {/* Option letter badge */}
                  <div
                    style={{
                      width: 65,
                      height: 65,
                      borderRadius: '12px',
                      background: showAnswer && isCorrect
                        ? 'linear-gradient(135deg, #10b981, #34d399)'
                        : 'linear-gradient(135deg, #667eea, #764ba2)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontFamily: '"Orbitron", sans-serif',
                      fontSize: 32,
                      fontWeight: 'bold',
                      color: '#fff',
                      flexShrink: 0,
                      boxShadow: showAnswer && isCorrect
                        ? `0 0 25px rgba(16, 185, 129, 0.9), 0 5px 20px rgba(0, 0, 0, 0.4)`
                        : '0 5px 20px rgba(0, 0, 0, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.2)',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Badge shine effect */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: -50,
                        width: 30,
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        transform: `translateX(${(frame * 3) % 150}px)`,
                      }}
                    />
                    {String.fromCharCode(65 + index)}
                  </div>

                  {/* Option text */}
                  <div
                    style={{
                      fontFamily: '"Orbitron", "DM Sans", sans-serif',
                      fontSize: 26,
                      fontWeight: '600',
                      color: showAnswer && isCorrect ? '#000' : '#fff',
                      flex: 1,
                      textAlign: 'left',
                      textShadow: showAnswer && isCorrect
                        ? 'none'
                        : '2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 15px rgba(100, 200, 255, 0.3)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {option}
                  </div>

                  {/* Correct answer indicator */}
                  {showAnswer && isCorrect && (
                    <div
                      style={{
                        fontSize: 36,
                        animation: 'bounce 0.6s ease-in-out infinite',
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
                
                {/* Animated border glow for correct answer */}
                {showAnswer && isCorrect && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '20px',
                      background: `linear-gradient(
                        ${(frame * 5) % 360}deg,
                        transparent 0%,
                        rgba(0, 255, 136, 0.3) 50%,
                        transparent 100%
                      )`,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Vertical Timer Bar */}
      {frame >= questionPhaseEnd && frame < optionsPhaseEnd && (
        <VerticalTimerBar
          startFrame={questionPhaseEnd}
          duration={optionsAndTimerDuration}
        />
      )}

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=DM+Sans:wght@400;600;700;800&display=swap');
        `}
      </style>
    </AbsoluteFill>
  );
};

