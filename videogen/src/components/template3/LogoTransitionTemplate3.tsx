import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, staticFile, Audio } from 'remotion';

export const LogoTransitionTemplate3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = 1 * fps; // 1 second

  // Cute bouncy circle expansion
  const circleScale = interpolate(
    frame,
    [0, totalFrames * 0.4, totalFrames * 0.6, totalFrames],
    [0, 1.2, 1, 15],
    { extrapolateRight: 'clamp' }
  );

  // Logo bounce and spin - playful animation
  const logoScale = interpolate(
    frame,
    [0, totalFrames * 0.3, totalFrames * 0.5, totalFrames * 0.7, totalFrames],
    [0, 1.6, 1.4, 2, 0]
  );

  const logoRotation = interpolate(
    frame,
    [0, totalFrames * 0.6],
    [0, 360]
  );

  const logoOpacity = interpolate(
    frame,
    [0, totalFrames * 0.2, totalFrames * 0.5, totalFrames * 0.75],
    [0, 1, 1, 0]
  );

  // Cute bouncing stars
  const stars = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 12;
    const distance = interpolate(
      frame,
      [totalFrames * 0.2, totalFrames * 0.7],
      [0, 350],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const bounce = Math.sin((frame - i * 2) * 0.3) * 10;
    const opacity = interpolate(
      frame,
      [totalFrames * 0.2, totalFrames * 0.4, totalFrames * 0.7, totalFrames],
      [0, 1, 0.8, 0]
    );
    const rotation = frame * 5 + i * 30;

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance + bounce,
      opacity,
      rotation,
    };
  });

  // Confetti pieces
  const confetti = Array.from({ length: 30 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 30 + frame * 0.05;
    const distance = interpolate(
      frame,
      [totalFrames * 0.3, totalFrames],
      [100, 600]
    );
    const fallSpeed = (i % 5) * 2;
    const opacity = interpolate(
      frame,
      [totalFrames * 0.3, totalFrames * 0.5, totalFrames * 0.8, totalFrames],
      [0, 1, 0.7, 0]
    );

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance + fallSpeed * frame * 0.5,
      opacity,
      rotation: frame * 3 + i * 12,
      color: ['#FF69B4', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD'][i % 5],
    };
  });

  // Sparkle particles
  const sparkles = Array.from({ length: 20 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 20;
    const distance = interpolate(
      frame,
      [totalFrames * 0.15, totalFrames * 0.5],
      [50, 300],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const opacity = interpolate(
      frame,
      [totalFrames * 0.15, totalFrames * 0.3, totalFrames * 0.6],
      [0, 1, 0]
    );
    const scale = 1 + Math.sin(frame * 0.3 + i) * 0.3;

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity,
      scale,
    };
  });

  return (
    <AbsoluteFill>
      {/* Transition Sound Effect */}
      <Audio
        src={staticFile('transition.mp3')}
        startFrom={0}
        volume={0.8}
      />

      {/* Cute gradient background matching Template 3 */}
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
            background: `radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.4) 0%, transparent 70%)`,
            transform: `scale(${1 + Math.sin(frame * 0.1) * 0.2})`,
          }}
        />

        {/* Floating pastel bubbles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const xOffset = Math.sin((frame + i * 30) * 0.05) * 40;
          const yOffset = Math.cos((frame + i * 20) * 0.04) * 30;
          const scale = 1 + Math.sin((frame + i * 15) * 0.06) * 0.4;
          
          const positions = [
            { x: 15, y: 15 },
            { x: 85, y: 20 },
            { x: 50, y: 50 },
            { x: 25, y: 75 },
            { x: 75, y: 80 },
            { x: 40, y: 30 },
            { x: 60, y: 70 },
            { x: 80, y: 50 },
          ];
          
          const colors = [
            'rgba(255, 182, 193, 0.5)',
            'rgba(173, 216, 230, 0.5)',
            'rgba(255, 218, 185, 0.5)',
            'rgba(221, 160, 221, 0.5)',
            'rgba(152, 251, 152, 0.5)',
            'rgba(255, 240, 245, 0.5)',
            'rgba(255, 228, 196, 0.5)',
            'rgba(230, 230, 250, 0.5)',
          ];
          
          return (
            <div
              key={`bubble-${i}`}
              style={{
                position: 'absolute',
                left: `${positions[i].x + xOffset}%`,
                top: `${positions[i].y + yOffset}%`,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: colors[i],
                filter: 'blur(30px)',
                transform: `scale(${scale})`,
                opacity: 0.6,
              }}
            />
          );
        })}
      </div>

      {/* Transition content container */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Bouncing confetti */}
        {confetti.map((piece, i) => (
          <div
            key={`confetti-${i}`}
            style={{
              position: 'absolute',
              width: 12,
              height: 12,
              borderRadius: i % 2 === 0 ? '50%' : '20%',
              background: piece.color,
              transform: `translate(${piece.x}px, ${piece.y}px) rotate(${piece.rotation}deg)`,
              opacity: piece.opacity,
              boxShadow: `0 0 8px ${piece.color}`,
            }}
          />
        ))}

        {/* Sparkle effects */}
        {sparkles.map((sparkle, i) => (
          <div
            key={`sparkle-${i}`}
            style={{
              position: 'absolute',
              transform: `translate(${sparkle.x}px, ${sparkle.y}px) scale(${sparkle.scale})`,
              opacity: sparkle.opacity,
              fontSize: 44,
            }}
          >
            ✨
          </div>
        ))}

        {/* Bouncing stars */}
        {stars.map((star, i) => (
          <div
            key={`star-${i}`}
            style={{
              position: 'absolute',
              transform: `translate(${star.x}px, ${star.y}px) rotate(${star.rotation}deg)`,
              opacity: star.opacity,
              fontSize: 52,
              filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
            }}
          >
            ⭐
          </div>
        ))}

        {/* Expanding circular wipe - cute and smooth */}
        <div
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 192, 203, 0.95), rgba(255, 218, 224, 0.95))',
            transform: `scale(${circleScale})`,
            opacity: interpolate(
              frame,
              [0, totalFrames * 0.2, totalFrames * 0.8, totalFrames],
              [0, 1, 1, 1]
            ),
            boxShadow: '0 0 80px rgba(255, 192, 203, 0.8), inset 0 0 120px rgba(255, 255, 255, 0.4)',
            border: '8px solid rgba(255, 255, 255, 0.7)',
          }}
        />

        {/* Secondary cute ring with hearts */}
        <div
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '6px dashed rgba(255, 105, 180, 0.6)',
            transform: `scale(${circleScale * 0.85}) rotate(${frame * 2}deg)`,
            opacity: interpolate(
              frame,
              [0, totalFrames * 0.2, totalFrames * 0.6, totalFrames],
              [0, 1, 0.7, 0.2]
            ),
          }}
        />

        {/* Logo with cute bounce */}
        <div
          style={{
            position: 'relative',
            transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
            opacity: logoOpacity,
            filter: 'drop-shadow(0 10px 40px rgba(255, 105, 180, 0.6))',
          }}
        >
          <Img
            src={staticFile('logo final.png')}
            style={{
              width: 300,
              height: 300,
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Cute glow pulse behind logo */}
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 192, 203, 0.7), transparent 60%)',
            transform: `scale(${logoScale * 0.9})`,
            opacity: logoOpacity * 0.8,
            filter: 'blur(50px)',
          }}
        />

        {/* Fun floating emojis around */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 12;
          const distance = interpolate(
            frame,
            [totalFrames * 0.25, totalFrames * 0.6],
            [80, 250],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const opacity = interpolate(
            frame,
            [totalFrames * 0.25, totalFrames * 0.4, totalFrames * 0.65],
            [0, 1, 0]
          );
          const bounce = Math.sin((frame - i * 3) * 0.4) * 8;
          
          const emojis = ['🎉', '🎊', '🏆', '💡', '🎯', '📚', '🌟', '💫', '🎈', '🎪', '✨', '🚀'];
          const emoji = emojis[i % emojis.length];

          return (
            <div
              key={`emoji-${i}`}
              style={{
                position: 'absolute',
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + bounce}px)`,
                opacity,
                fontSize: 52,
                filter: 'drop-shadow(0 3px 8px rgba(255, 105, 180, 0.5))',
              }}
            >
              {emoji}
            </div>
          );
        })}

        {/* Flash effect at peak - softer for cute aesthetic */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5), transparent 60%)',
            opacity: interpolate(
              frame,
              [totalFrames * 0.45, totalFrames * 0.5, totalFrames * 0.58],
              [0, 0.8, 0]
            ),
          }}
        />

        {/* Cute text "Next Question!" */}
        {frame >= totalFrames * 0.3 && frame <= totalFrames * 0.7 && (
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              fontFamily: '"Fredoka", sans-serif',
              fontSize: 64,
              fontWeight: '700',
              color: '#FF69B4',
              textShadow: '0 6px 20px rgba(255, 105, 180, 0.5)',
              transform: `scale(${interpolate(
                frame,
                [totalFrames * 0.3, totalFrames * 0.4, totalFrames * 0.6, totalFrames * 0.7],
                [0, 1.2, 1, 0.8]
              )})`,
              opacity: interpolate(
                frame,
                [totalFrames * 0.3, totalFrames * 0.4, totalFrames * 0.6, totalFrames * 0.7],
                [0, 1, 1, 0]
              ),
            }}
          >
            ✨ Next Question! ✨
          </div>
        )}
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
        `}
      </style>
    </AbsoluteFill>
  );
};

