import React from 'react';
import { AbsoluteFill, Sequence, staticFile, Video as RemotionVideo } from 'remotion';
import { QuestionScene } from '../components/QuestionScene';
import { LogoTransition } from '../components/LogoTransition';
import { FRAMES, TOTAL_QUESTION_DURATION } from '../config/timing';
import { QuizVideoProps } from '../types/quiz';

export const Template1: React.FC<QuizVideoProps> = ({ quizData, audioFolder }) => {
  const questions = quizData.quiz;

  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Intro Video */}
      <Sequence from={currentFrame} durationInFrames={FRAMES.INTRO}>
        <AbsoluteFill>
          <RemotionVideo src={staticFile('intro.mp4')} onError={() => {}} />
        </AbsoluteFill>
      </Sequence>

      {/* Questions Loop */}
      {questions.map((question, index) => {
        currentFrame = FRAMES.INTRO + (index * TOTAL_QUESTION_DURATION);

        return (
          <React.Fragment key={index}>
            {/* Question Scene */}
            <Sequence
              from={currentFrame}
              durationInFrames={TOTAL_QUESTION_DURATION - FRAMES.LOGO_TRANSITION}
            >
              <QuestionScene
                question={question.question}
                options={question.options}
                answer={question.answer}
                questionNumber={index + 1}
                questionId={question.question_id}
                totalQuestions={questions.length}
                audioFolder={audioFolder}
                questionDisplayDuration={FRAMES.QUESTION_DISPLAY}
                optionsAndTimerDuration={FRAMES.OPTIONS_TIMER}
                answerRevealDuration={FRAMES.ANSWER_REVEAL}
              />
            </Sequence>

            {/* Logo Transition after each question */}
            <Sequence
              from={currentFrame + TOTAL_QUESTION_DURATION - FRAMES.LOGO_TRANSITION}
              durationInFrames={FRAMES.LOGO_TRANSITION}
            >
              <LogoTransition />
            </Sequence>
          </React.Fragment>
        );
      })}

      {/* Outro Video */}
      <Sequence
        from={FRAMES.INTRO + (questions.length * TOTAL_QUESTION_DURATION)}
        durationInFrames={FRAMES.OUTRO}
      >
        <AbsoluteFill>
          <RemotionVideo src={staticFile('outro.mp4')} onError={() => {}} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};









