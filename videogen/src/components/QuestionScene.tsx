import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile, Sequence } from 'remotion';
import { BombTimer } from './BombTimer';
import { ProgressBar } from './ProgressBar';

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

export const QuestionScene: React.FC<QuestionSceneProps> = ({
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

  // Question entrance animation - zooms in and scales up
  const questionEntrance = spring({
    frame,
    fps,
    config: {
      damping: 15,
      mass: 0.8,
      stiffness: 80,
    },
  });

  // Question grows when options appear (instead of shrinking)
  const questionGrow = interpolate(
    frame,
    [questionPhaseEnd - 15, questionPhaseEnd + 15],
    [1, 1.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Question moves up when options appear
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

  // Pulsating effect for question text - only when question is alone (before options appear)
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

  // 3D tilt effect based on mouse position (simulated)
  const tiltX = Math.sin(frame * 0.02) * 2;
  const tiltY = Math.cos(frame * 0.03) * 2;

  return (
    <AbsoluteFill>
      {/* Question-specific audio - plays exactly when question appears */}
      <Audio
        src={staticFile(`question_audios/question_${questionId}.mp3`)}
        volume={1.0}
      />

      {/* Question display sound when question first appears */}
      <Audio
        src={staticFile('question displays.mp3')}
        volume={1.0}
      />

      {/* 8 seconds counter - plays when options are visible, synced with bomb timer */}
      <Sequence from={questionPhaseEnd}>
        <Audio
          src={staticFile('8 seconds counter.mp3')}
          volume={0.4}
        />
      </Sequence>

      {/* Ding sound when correct answer is revealed with neon effects */}
      <Sequence from={optionsPhaseEnd}>
        <Audio
          src={staticFile('ding.mp3')}
          volume={1.2}
        />
      </Sequence>

      {/* Modern Animated Background with Gradient Mesh */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient blobs */}
        {Array.from({ length: 5 }).map((_, i) => {
          const xOffset = Math.sin((frame + i * 60) * 0.01) * 30;
          const yOffset = Math.cos((frame + i * 40) * 0.008) * 40;
          const scale = 1 + Math.sin((frame + i * 30) * 0.015) * 0.3;
          const positions = [
            { x: 10 + xOffset, y: 20 + yOffset },
            { x: 80 + xOffset, y: 10 + yOffset },
            { x: 50 + xOffset, y: 50 + yOffset },
            { x: 20 + xOffset, y: 80 + yOffset },
            { x: 75 + xOffset, y: 70 + yOffset },
          ];
          const colors = [
            'rgba(102, 126, 234, 0.4)',
            'rgba(118, 75, 162, 0.4)',
            'rgba(240, 147, 251, 0.4)',
            'rgba(79, 172, 254, 0.4)',
            'rgba(0, 242, 254, 0.4)',
          ];
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${positions[i].x}%`,
                top: `${positions[i].y}%`,
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: colors[i],
                filter: 'blur(80px)',
                transform: `scale(${scale})`,
                opacity: 0.6,
              }}
            />
          );
        })}

        {/* Modern geometric shapes floating */}
        {Array.from({ length: 15 }).map((_, i) => {
          const xPos = (i * 67 + frame * 0.2) % 110;
          const yPos = (i * 43 + Math.sin(frame * 0.02 + i) * 5) % 110;
          const rotation = (frame + i * 20) * 0.5;
          const size = 30 + (i % 5) * 15;
          const shapes = ['50%', '0%', '30%'];
          const shapeType = shapes[i % 3];
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${xPos}%`,
                top: `${yPos}%`,
                width: size,
                height: size,
                borderRadius: shapeType,
                background: `rgba(255, 255, 255, ${0.05 + (i % 3) * 0.05})`,
                border: '2px solid rgba(255, 255, 255, 0.2)',
                transform: `rotate(${rotation}deg)`,
                backdropFilter: 'blur(2px)',
              }}
            />
          );
        })}

        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            opacity: 0.4,
          }}
        />
        
        {/* Overlay for depth */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
          }}
        />
      </div>

      {/* Progress Bar */}
      <ProgressBar currentQuestion={questionNumber} totalQuestions={totalQuestions} />

      {/* Question Display */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `
            translate(-50%, calc(-50% + ${questionMoveUp}px))
            scale(${questionEntrance * questionGrow * pulse})
            perspective(1000px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
          `,
          width: '90%',
          maxWidth: 1400,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: frame < questionPhaseEnd ? 72 : 42,
            fontWeight: '800',
            color: '#ffffff',
            textShadow: `
              0 4px 20px rgba(0, 0, 0, 0.8),
              0 0 40px rgba(255, 255, 255, 0.3),
              0 0 60px rgba(138, 43, 226, 0.4)
            `,
            padding: '50px 60px',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.65), rgba(30, 30, 60, 0.6))',
            borderRadius: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: `
              0 20px 60px rgba(0, 0, 0, 0.5),
              inset 0 2px 40px rgba(255, 255, 255, 0.1),
              0 0 80px rgba(138, 43, 226, 0.3)
            `,
            lineHeight: 1.5,
            letterSpacing: '0.5px',
            transition: 'all 0.3s ease',
          }}
        >
          {question}
        </div>
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

            // Slide in from bottom with bounce
            const slideY = (1 - entrance) * 100;
            
            // Pop-up animation for correct answer
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
                  padding: '28px 45px',
                  width: '100%',
                  position: 'relative',
                  background: showAnswer && isCorrect
                    ? 'linear-gradient(135deg, #10b981, #34d399, #6ee7b7)'
                    : 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(30, 30, 60, 0.65))',
                  borderRadius: '25px',
                  border: showAnswer && isCorrect
                    ? '6px solid #00ff88'
                    : '4px solid rgba(255, 255, 255, 0.25)',
                  cursor: 'pointer',
                  transition: showAnswer && isCorrect ? 'none' : 'all 0.3s ease',
                  backdropFilter: 'blur(15px)',
                  boxShadow: showAnswer && isCorrect
                    ? `
                      0 0 ${answerGlow * 3}px rgba(0, 255, 136, 1),
                      0 0 ${answerGlow * 5}px rgba(0, 255, 136, 0.8),
                      0 0 ${answerGlow * 7}px rgba(0, 255, 136, 0.6),
                      0 15px 50px rgba(0, 0, 0, 0.6),
                      inset 0 0 30px rgba(255, 255, 255, 0.4),
                      inset 0 0 ${answerGlow}px rgba(0, 255, 136, 0.5)
                    `
                    : '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 2px 20px rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Neon glow edge effect for correct answer */}
                {showAnswer && isCorrect && (
                  <>
                    {/* Outer neon glow ring */}
                    <div
                      style={{
                        position: 'absolute',
                        top: -4,
                        left: -4,
                        right: -4,
                        bottom: -4,
                        borderRadius: '25px',
                        background: 'transparent',
                        border: `3px solid rgba(0, 255, 136, ${0.6 + Math.sin(frame * 0.3) * 0.3})`,
                        boxShadow: `
                          0 0 ${answerGlow * 2}px rgba(0, 255, 136, 0.8),
                          inset 0 0 ${answerGlow}px rgba(0, 255, 136, 0.4)
                        `,
                        pointerEvents: 'none',
                        animation: 'neonPulse 0.8s ease-in-out infinite',
                      }}
                    />
                    
                    {/* Inner bright edge highlight */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '25px',
                        background: `linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.3) 0%, 
                          transparent 50%, 
                          rgba(0, 255, 136, 0.2) 100%)`,
                        pointerEvents: 'none',
                      }}
                    />
                    
                    {/* Corner sparkles */}
                    {[0, 1, 2, 3].map((corner) => (
                      <div
                        key={corner}
                        style={{
                          position: 'absolute',
                          width: 20,
                          height: 20,
                          ...(corner === 0 && { top: -10, left: -10 }),
                          ...(corner === 1 && { top: -10, right: -10 }),
                          ...(corner === 2 && { bottom: -10, left: -10 }),
                          ...(corner === 3 && { bottom: -10, right: -10 }),
                          opacity: interpolate(
                            (frame + corner * 5) % 30,
                            [0, 15, 30],
                            [0, 1, 0]
                          ),
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            background: 'radial-gradient(circle, rgba(0, 255, 136, 1), transparent)',
                            borderRadius: '50%',
                            boxShadow: '0 0 15px rgba(0, 255, 136, 1)',
                          }}
                        />
                      </div>
                    ))}
                  </>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
                  {/* Option letter badge */}
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: '50%',
                      background: showAnswer && isCorrect
                        ? 'linear-gradient(135deg, #10b981, #34d399)'
                        : 'linear-gradient(135deg, #f093fb, #f5576c)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontFamily: '"Press Start 2P", sans-serif',
                      fontSize: 28,
                      fontWeight: 'bold',
                      color: '#fff',
                      flexShrink: 0,
                      boxShadow: showAnswer && isCorrect
                        ? '0 0 25px rgba(16, 185, 129, 0.9), 0 5px 20px rgba(0, 0, 0, 0.4)'
                        : '0 5px 20px rgba(0, 0, 0, 0.4)',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>

                  {/* Option text */}
                  <div
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 28,
                      fontWeight: '700',
                      color: showAnswer && isCorrect ? '#000' : '#fff',
                      flex: 1,
                      textAlign: 'left',
                      textShadow: showAnswer && isCorrect
                        ? 'none'
                        : '2px 2px 6px rgba(0, 0, 0, 0.9)',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {option}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timer Display */}
      {frame >= questionPhaseEnd && frame < optionsPhaseEnd && (
        <BombTimer
          startFrame={questionPhaseEnd}
          duration={optionsAndTimerDuration}
        />
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }

          @keyframes neonPulse {
            0%, 100% { 
              opacity: 1;
              filter: brightness(1);
            }
            50% { 
              opacity: 0.8;
              filter: brightness(1.3);
            }
          }

          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=DM+Sans:wght@400;600;700;800&display=swap');
        `}
      </style>
    </AbsoluteFill>
  );
};
