import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, staticFile, Audio } from 'remotion';

export const LogoTransition: React.FC = () => {
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
      {/* Transition Sound Effect - Full audio at 80% volume */}
      <Audio
        src={staticFile('transition.mp3')}
        startFrom={0}
        volume={0.8}     // 80% volume - plays full mp3, can spill over
      />

      {/* Same gradient background as QuestionScene */}
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
        {/* Liquid morphing circles */}
        {morphCircles.map((circle, i) => (
          <div
            key={`morph-${i}`}
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.6), rgba(79, 172, 254, 0.6))',
              transform: `translate(${circle.x}px, ${circle.y}px) scale(${circle.scale})`,
              opacity: circle.opacity,
              filter: 'blur(20px)',
            }}
          />
        ))}

        {/* Energy streak lines */}
        {energyLines.map((line, i) => (
          <div
            key={`line-${i}`}
            style={{
              position: 'absolute',
              width: line.length,
              height: 4,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
              transformOrigin: 'left center',
              transform: `rotate(${line.rotation}deg)`,
              opacity: line.opacity,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* Expanding circular wipe - FILLS THE SCREEN */}
        <div
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(240, 147, 251, 0.95), rgba(79, 172, 254, 0.95))',
            transform: `scale(${circleScale})`,
            opacity: interpolate(
              frame,
              [0, totalFrames * 0.2, totalFrames * 0.8, totalFrames],
              [0, 1, 1, 1]  // Stays visible to cover screen
            ),
            boxShadow: '0 0 60px rgba(240, 147, 251, 0.8), inset 0 0 100px rgba(255, 255, 255, 0.3)',
            border: '8px solid rgba(255, 255, 255, 0.6)',
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
            filter: `blur(${blurIntensity}px) drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))`,
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
            background: 'radial-gradient(circle, rgba(240, 147, 251, 0.6), transparent 60%)',
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
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent 50%)',
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
