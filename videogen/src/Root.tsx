import React from 'react';
import { Composition } from 'remotion';
import { QuizVideo } from './Video';
import { calculateTotalDuration, FRAMES } from './config/timing';
import quizData from '../quiz jsons/Famous Business Rivalries.1.json';

export const RemotionRoot: React.FC = () => {
  // Use actual quiz data for preview
  const audioFolder = 'Famous Business Rivalries.1';
  const totalDuration = calculateTotalDuration(quizData.quiz.length);

  // Props for Template 1 - Gradient Blobs (Original)
  const template1Props = {
    quizData,
    audioFolder,
    templateId: 'template1',
  };

  // Props for Template 2 - Starfield (New)
  const template2Props = {
    quizData,
    audioFolder,
    templateId: 'template2',
  };

  // Props for Template 3 - Cute Education (Redesigned)
  const template3Props = {
    quizData,
    audioFolder,
    templateId: 'template3',
  };

  return (
    <>
      {/* Template 1: Gradient Blobs */}
      <Composition
        id="Template1-GradientBlobs"
        component={QuizVideo}
        durationInFrames={totalDuration}
        fps={FRAMES.FPS}
        width={1920}
        height={1080}
        defaultProps={template1Props}
      />

      {/* Template 2: Starfield */}
      <Composition
        id="Template2-Starfield"
        component={QuizVideo}
        durationInFrames={totalDuration}
        fps={FRAMES.FPS}
        width={1920}
        height={1080}
        defaultProps={template2Props}
      />

      {/* Template 3: Cute Education */}
      <Composition
        id="Template3-CuteEducation"
        component={QuizVideo}
        durationInFrames={totalDuration}
        fps={FRAMES.FPS}
        width={1920}
        height={1080}
        defaultProps={template3Props}
      />

      {/* Main composition for CLI rendering */}
      <Composition
        id="QuizVideo"
        component={QuizVideo}
        durationInFrames={totalDuration}
        fps={FRAMES.FPS}
        width={1920}
        height={1080}
        defaultProps={template1Props}
      />
    </>
  );
};
