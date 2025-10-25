import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile, Sequence } from 'remotion';
import { CuteHourglassTimer } from './CuteHourglassTimer';
import { StarProgressBar } from './StarProgressBar';
import { DifficultyBadges } from './DifficultyBadges';
import { ConfettiCelebration } from './ConfettiCelebration';

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

export const QuestionSceneTemplate3: React.FC<QuestionSceneProps> = ({
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

  // Determine difficulty based on question number (15 questions split into 3 groups of 5)
  const getDifficulty = (qNum: number): 'easy' | 'medium' | 'hard' => {
    if (qNum <= 5) return 'easy';
    if (qNum <= 10) return 'medium';
    return 'hard';
  };

  const difficulty = getDifficulty(questionNumber);

  // Question entrance animation - bouncy and cute
  const questionEntrance = spring({
    frame,
    fps,
    config: {
      damping: 10,
      mass: 0.5,
      stiffness: 120,
    },
  });

  // Question card scale and position animation
  const questionScale = interpolate(
    frame,
    [0, 20, 40],
    [0.5, 1.1, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const questionMoveUp = interpolate(
    frame,
    [questionPhaseEnd - 15, questionPhaseEnd + 15],
    [0, -150],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const questionShrink = interpolate(
    frame,
    [questionPhaseEnd - 15, questionPhaseEnd + 15],
    [1, 0.75],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Cute wiggle animation for question - only during display phase
  const wiggle = frame < questionPhaseEnd 
    ? Math.sin(frame * 0.15) * 2 
    : 0;

  // Options entrance with smooth fade and slide - optimized for rendering
  const optionsEntrance = (index: number) => {
    const staggerDelay = index * 3; // Reduced stagger for faster loading
    const localFrame = frame - questionPhaseEnd - staggerDelay;
    
    return interpolate(
      localFrame,
      [0, 15], // Faster transition (15 frames instead of 20)
      [0, 1],
      { 
        extrapolateLeft: 'clamp', 
        extrapolateRight: 'clamp',
      }
    );
  };

  // Determine which option is correct
  const correctIndex = options.indexOf(answer);

  // Answer reveal animation with celebration
  const answerRevealSpring = spring({
    frame: frame - optionsPhaseEnd,
    fps,
    config: {
      damping: 8,
      mass: 0.3,
      stiffness: 180,
    },
  });

  // Sparkle animation for correct answer
  const sparkleIntensity = interpolate(
    frame,
    [optionsPhaseEnd, optionsPhaseEnd + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* Audio sequences - same as before */}
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

      {/* Beautiful gradient background with floating elements */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #FFE5F1 0%, #FFF4E6 25%, #E0F2FE 50%, #F3E8FF 75%, #FFE5F1 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient overlay */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.01) * 20}% ${50 + Math.cos(frame * 0.015) * 20}%, rgba(255, 182, 193, 0.3) 0%, transparent 50%)`,
          }}
        />

        {/* Floating educational and fun emojis */}
        {Array.from({ length: 30 }).map((_, i) => {
          const xPos = (i * 73 + frame * 0.2) % 110;
          const yPos = (15 + i * 31 + Math.sin(frame * 0.01 + i) * 12) % 110;
          const size = 38 + (i % 6) * 16;
          const rotation = frame * 0.25 + i * 40;
          const opacity = 0.12 + (i % 4) * 0.08;
          const floatOffset = Math.sin(frame * 0.02 + i * 0.5) * 8;
          
          const shapes = [
            '⭐', '🌟', '✨', '💫', '🎯', 
            '📚', '💡', '🏆', '🎓', '🎪',
            '🎨', '🎭', '🎸', '🎮', '🧩',
            '🚀', '🌈', '🎈', '🎊', '🎉',
            '💝', '🌸', '🦋', '🐝', '🌺',
            '☀️', '🌙', '⚡', '🔥', '💎'
          ];
          const shape = shapes[i % shapes.length];
          
          return (
            <div
              key={`float-${i}`}
              style={{
                position: 'absolute',
                left: `${xPos}%`,
                top: `${yPos}%`,
                fontSize: size,
                opacity,
                transform: `rotate(${rotation}deg) translateY(${floatOffset}px)`,
                filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15))',
              }}
            >
              {shape}
            </div>
          );
        })}

        {/* Soft floating clouds */}
        {Array.from({ length: 8 }).map((_, i) => {
          const xPos = (i * 120 + frame * 0.15) % 120;
          const yPos = 10 + (i * 12) % 80;
          const size = 80 + (i % 3) * 40;
          
          return (
            <div
              key={`cloud-${i}`}
              style={{
                position: 'absolute',
                left: `${xPos}%`,
                top: `${yPos}%`,
                width: size,
                height: size * 0.6,
                background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                boxShadow: `
                  ${size * 0.5}px 0 0 rgba(255, 255, 255, 0.4),
                  -${size * 0.5}px 0 0 rgba(255, 255, 255, 0.4)
                `,
              }}
            />
          );
        })}

        {/* Subtle gradient orbs */}
        {Array.from({ length: 5 }).map((_, i) => {
          const xOffset = Math.sin((frame + i * 100) * 0.005) * 30;
          const yOffset = Math.cos((frame + i * 80) * 0.004) * 25;
          const scale = 1 + Math.sin((frame + i * 50) * 0.008) * 0.3;
          
          const positions = [
            { x: 10 + xOffset, y: 20 + yOffset },
            { x: 80 + xOffset, y: 30 + yOffset },
            { x: 50 + xOffset, y: 60 + yOffset },
            { x: 20 + xOffset, y: 80 + yOffset },
            { x: 90 + xOffset, y: 70 + yOffset },
          ];
          
          const colors = [
            'rgba(255, 182, 193, 0.3)',
            'rgba(173, 216, 230, 0.3)',
            'rgba(255, 218, 185, 0.3)',
            'rgba(221, 160, 221, 0.3)',
            'rgba(152, 251, 152, 0.3)',
          ];
          
          return (
            <div
              key={`orb-${i}`}
              style={{
                position: 'absolute',
                left: `${positions[i].x}%`,
                top: `${positions[i].y}%`,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: colors[i],
                filter: 'blur(40px)',
                transform: `scale(${scale})`,
                opacity: 0.6,
              }}
            />
          );
        })}
      </div>

      {/* Difficulty Badges at the top */}
      <DifficultyBadges 
        currentDifficulty={difficulty}
        questionNumber={questionNumber}
      />

      {/* Star Progress Bar */}
      <StarProgressBar 
        currentQuestion={questionNumber} 
        totalQuestions={totalQuestions} 
      />

      {/* Question Display - Cute card design */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `
            translate3d(-50%, calc(-50% + ${questionMoveUp}px), 0)
            scale(${questionEntrance * questionScale * questionShrink})
            rotate(${wiggle}deg)
          `,
          width: '88%',
          maxWidth: 1300,
          textAlign: 'center',
          willChange: frame < optionsPhaseEnd ? 'transform' : 'auto',
        }}
      >
        <div
          style={{
            fontFamily: '"Fredoka", "Comic Sans MS", sans-serif',
            fontSize: frame < questionPhaseEnd ? 72 : 44,
            fontWeight: '600',
            color: '#2D1B4E',
            padding: '50px 65px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 250, 0.95) 100%)',
            borderRadius: '40px',
            border: '6px solid rgba(255, 105, 180, 0.3)',
            boxShadow: `
              0 20px 50px rgba(255, 105, 180, 0.25),
              0 10px 30px rgba(138, 43, 226, 0.15),
              inset 0 -3px 20px rgba(255, 182, 193, 0.2)
            `,
            lineHeight: 1.6,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Cute decoration corners */}
          <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            fontSize: 48,
            opacity: 0.6,
          }}>🌟</div>
          <div style={{
            position: 'absolute',
            top: 20,
            right: 20,
            fontSize: 48,
            opacity: 0.6,
          }}>🌟</div>
          
          <div style={{
            position: 'relative',
            zIndex: 1,
          }}>
            {question}
          </div>
        </div>
      </div>

      {/* Options Display - Cute pill buttons */}
      {frame >= questionPhaseEnd && frame < answerPhaseEnd && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            marginTop: '140px',
            width: '82%',
            maxWidth: 1100,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            justifyContent: 'center',
          }}
        >
          {options.map((option, index) => {
            const entrance = optionsEntrance(index);
            const isCorrect = index === correctIndex;
            const showAnswer = frame >= optionsPhaseEnd;

            // Smooth fade and slight slide from bottom - optimized
            const slideY = (1 - entrance) * 20; // Reduced distance for smoother animation
            
            const correctAnswerScale = showAnswer && isCorrect ? answerRevealSpring : 1;
            const popAnimation = showAnswer && isCorrect 
              ? Math.sin((frame - optionsPhaseEnd) * 0.3) * 5 
              : 0;

            const optionEmojis = ['🎯', '🎪', '🎨', '🎭'];
            
            // Pre-calculate transform for better performance
            const finalScale = entrance * (showAnswer && isCorrect ? correctAnswerScale * 1.12 : 1);
            const finalY = slideY + popAnimation;

            return (
              <div
                key={index}
                style={{
                  transform: `translate3d(0, ${finalY}px, 0) scale(${finalScale})`,
                  opacity: entrance,
                  willChange: entrance < 1 ? 'transform, opacity' : 'auto',
                  padding: '28px 48px',
                  width: '100%',
                  position: 'relative',
                  background: showAnswer && isCorrect
                    ? 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 250, 250, 0.95))',
                  borderRadius: '70px',
                  border: showAnswer && isCorrect
                    ? '6px solid #FFD700'
                    : '5px solid rgba(255, 105, 180, 0.3)',
                  boxShadow: showAnswer && isCorrect
                    ? `
                      0 0 ${30 + sparkleIntensity * 40}px rgba(255, 215, 0, 0.8),
                      0 0 ${60 + sparkleIntensity * 80}px rgba(255, 215, 0, 0.6),
                      0 20px 50px rgba(255, 165, 0, 0.4)
                    `
                    : `
                      0 12px 35px rgba(138, 43, 226, 0.15),
                      0 5px 15px rgba(255, 105, 180, 0.1)
                    `,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: showAnswer && isCorrect
                        ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                        : 'linear-gradient(135deg, #FF69B4, #FF1493)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontFamily: '"Fredoka", sans-serif',
                      fontSize: 42,
                      fontWeight: 'bold',
                      color: '#fff',
                      flexShrink: 0,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                      border: '4px solid rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    {showAnswer && isCorrect ? '✓' : String.fromCharCode(65 + index)}
                  </div>

                  <div style={{ fontSize: 38, opacity: 0.7, flexShrink: 0 }}>
                    {optionEmojis[index]}
                  </div>

                  <div
                    style={{
                      fontFamily: '"Fredoka", sans-serif',
                      fontSize: 26,
                      fontWeight: '600',
                      color: showAnswer && isCorrect ? '#2D1B4E' : '#2D1B4E',
                      flex: 1,
                      textAlign: 'left',
                      letterSpacing: '0.3px',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                    }}
                  >
                    {option}
                  </div>

                  {showAnswer && isCorrect && (
                    <div style={{ fontSize: 52, flexShrink: 0 }}>
                      🎉
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cute Hourglass Timer */}
      {frame >= questionPhaseEnd && frame < optionsPhaseEnd && (
        <CuteHourglassTimer
          startFrame={questionPhaseEnd}
          duration={optionsAndTimerDuration}
        />
      )}

      {/* Confetti Celebration on Answer Reveal */}
      {frame >= optionsPhaseEnd && (
        <ConfettiCelebration 
          startFrame={optionsPhaseEnd}
        />
      )}

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
        `}
      </style>
    </AbsoluteFill>
  );
};
