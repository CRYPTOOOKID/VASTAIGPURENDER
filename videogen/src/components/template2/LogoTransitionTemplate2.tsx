import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, staticFile, Audio } from 'remotion';

export const LogoTransitionTemplate2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = 1 * fps; // 1 second

  // Circular wipe expansion from center - MAXES OUT to fill screen
  const circleScale = interpolate(
    frame,
    [0, totalFrames * 0.5, totalFrames],
    [0, 2, 15],  // Goes from 0 to 15x to completely cover screen
    { extrapolateRight: 'clamp' }
  );

  // Logo zoom and spin - grows then disappears as circle maxes out
  const logoScale = interpolate(
    frame,
    [0, totalFrames * 0.3, totalFrames * 0.6, totalFrames],
    [0, 1.5, 2, 0]  // Grows big then disappears
  );

  const logoRotation = interpolate(
    frame,
    [0, totalFrames * 0.7],
    [0, 1080]  // 3 full rotations - faster spin
  );

  const logoOpacity = interpolate(
    frame,
    [0, totalFrames * 0.2, totalFrames * 0.5, totalFrames * 0.7],
    [0, 1, 1, 0]  // Disappears before circle maxes out
  );

  // Motion blur trails - increases as it zooms
  const blurIntensity = interpolate(
    frame,
    [0, totalFrames * 0.3, totalFrames * 0.6],
    [0, 20, 0]  // Heavy blur during rotation
  );

  // Liquid morphing circles
  const morphCircles = Array.from({ length: 5 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 5;
    const distance = interpolate(
      frame,
      [0, totalFrames * 0.5, totalFrames],
      [0, 200, 400]
    );
    const scale = interpolate(
      frame,
      [0, totalFrames * 0.3, totalFrames],
      [0, 1, 0.5]
    );
    const opacity = interpolate(
      frame,
      [0, totalFrames * 0.3, totalFrames * 0.7, totalFrames],
      [0, 0.8, 0.5, 0]
    );

    return {
      x: Math.cos(angle + frame * 0.1) * distance,
      y: Math.sin(angle + frame * 0.1) * distance,
      scale,
      opacity,
    };
  });

  // Energy lines/streaks
  const energyLines = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 12;
    const length = interpolate(
      frame,
      [totalFrames * 0.2, totalFrames * 0.8],
      [0, 300],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const opacity = interpolate(
      frame,
      [totalFrames * 0.2, totalFrames * 0.4, totalFrames * 0.7, totalFrames],
      [0, 1, 0.6, 0]
    );

    return {
      angle,
      length,
      opacity,
      rotation: angle * (180 / Math.PI),
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

      {/* Enhanced galaxy background matching Template2 */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at 50% 50%, #1a0a3e 0%, #0a0520 40%, #000000 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Deep space gradient layers */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `radial-gradient(ellipse at 30% 20%, rgba(75, 0, 130, 0.3) 0%, transparent 50%),
                         radial-gradient(ellipse at 70% 80%, rgba(25, 25, 112, 0.3) 0%, transparent 50%)`,
          }}
        />
      </div>
      
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Stars */}
        {Array.from({ length: 100 }).map((_, i) => {
          const xPos = (i * 87) % 100;
          const yPos = (i * 43) % 100;
          const twinkle = 0.3 + Math.sin((frame + i * 10) * 0.05) * 0.7;
          const size = 1 + (i % 3);
          
          return (
            <div
              key={`star-${i}`}
              style={{
                position: 'absolute',
                left: `${xPos}%`,
                top: `${yPos}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: '#fff',
                opacity: twinkle,
                boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`,
              }}
            />
          );
        })}

        {/* Moving particles */}
        {Array.from({ length: 30 }).map((_, i) => {
          const xPos = ((i * 67 + frame * 0.3) % 110) - 5;
          const yPos = ((i * 53 + frame * 0.2) % 110) - 5;
          const size = 3 + (i % 4) * 2;
          const opacity = 0.2 + Math.sin((frame + i * 20) * 0.03) * 0.3;
          
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
              }}
            />
          );
        })}

        {/* Nebula clouds */}
        {Array.from({ length: 3 }).map((_, i) => {
          const xOffset = Math.sin((frame + i * 100) * 0.005) * 10;
          const yOffset = Math.cos((frame + i * 80) * 0.004) * 15;
          const scale = 1 + Math.sin((frame + i * 50) * 0.008) * 0.2;
          const colors = [
            'rgba(100, 50, 200, 0.3)',
            'rgba(50, 100, 200, 0.3)',
            'rgba(200, 50, 150, 0.3)',
          ];
          const positions = [
            { x: 20 + xOffset, y: 30 + yOffset },
            { x: 70 + xOffset, y: 20 + yOffset },
            { x: 50 + xOffset, y: 70 + yOffset },
          ];
          
          return (
            <div
              key={`nebula-${i}`}
              style={{
                position: 'absolute',
                left: `${positions[i].x}%`,
                top: `${positions[i].y}%`,
                width: 500,
                height: 500,
                borderRadius: '50%',
                background: colors[i],
                filter: 'blur(100px)',
                transform: `scale(${scale})`,
                opacity: 0.5,
              }}
            />
          );
        })}

        {/* Overlay gradient */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
          }}
        />
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
        {/* Liquid morphing circles - Matching starfield purple/dark tones */}
        {morphCircles.map((circle, i) => (
          <div
            key={`morph-${i}`}
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(100, 50, 200, 0.5), rgba(50, 100, 200, 0.4))',
              transform: `translate(${circle.x}px, ${circle.y}px) scale(${circle.scale})`,
              opacity: circle.opacity,
              filter: 'blur(20px)',
            }}
          />
        ))}

        {/* Energy streak lines - Matching starfield subtle purple tones */}
        {energyLines.map((line, i) => (
          <div
            key={`line-${i}`}
            style={{
              position: 'absolute',
              width: line.length,
              height: 4,
              background: 'linear-gradient(90deg, transparent, rgba(150, 100, 255, 0.7), transparent)',
              transformOrigin: 'left center',
              transform: `rotate(${line.rotation}deg)`,
              opacity: line.opacity,
              boxShadow: '0 0 10px rgba(150, 100, 255, 0.5)',
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* Expanding circular wipe - FILLS THE SCREEN - Matching starfield colors */}
        <div
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26, 10, 46, 0.98), rgba(22, 33, 62, 0.98))',
            transform: `scale(${circleScale})`,
            opacity: interpolate(
              frame,
              [0, totalFrames * 0.2, totalFrames * 0.8, totalFrames],
              [0, 1, 1, 1]  // Stays visible to cover screen
            ),
            boxShadow: '0 0 60px rgba(100, 50, 200, 0.5), inset 0 0 100px rgba(255, 255, 255, 0.1)',
            border: '8px solid rgba(100, 50, 200, 0.4)',
          }}
        />

        {/* Secondary expanding ring with border */}
        <div
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '6px solid rgba(255, 255, 255, 0.9)',
            transform: `scale(${circleScale * 0.9})`,
            opacity: interpolate(
              frame,
              [0, totalFrames * 0.2, totalFrames * 0.6, totalFrames],
              [0, 1, 0.8, 0.3]
            ),
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.8)',
          }}
        />

        {/* Logo with motion blur and zoom */}
        <div
          style={{
            position: 'relative',
            transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
            opacity: logoOpacity,
            filter: `blur(${blurIntensity}px) drop-shadow(0 0 30px rgba(100, 200, 255, 0.8))`,
          }}
        >
          <Img
            src={staticFile('logo final.png')}
            style={{
              width: 250,
              height: 250,
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Glow pulse behind logo */}
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100, 200, 255, 0.6), transparent 60%)',
            transform: `scale(${logoScale})`,
            opacity: logoOpacity * 0.6,
            filter: 'blur(40px)',
          }}
        />

        {/* Flash effect at peak */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(100, 200, 255, 0.3), transparent 50%)',
            opacity: interpolate(
              frame,
              [totalFrames * 0.45, totalFrames * 0.5, totalFrames * 0.55],
              [0, 1, 0]
            ),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

