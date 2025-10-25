import React from 'react';
import { AbsoluteFill, Sequence, staticFile, Video as RemotionVideo } from 'remotion';
import { QuestionSceneTemplate3 } from '../components/template3/QuestionSceneTemplate3';
import { LogoTransitionTemplate3 } from '../components/template3/LogoTransitionTemplate3';
import { FRAMES, TOTAL_QUESTION_DURATION } from '../config/timing';
import { QuizVideoProps } from '../types/quiz';

export const Template3: React.FC<QuizVideoProps> = ({ quizData, audioFolder }) => {
  const questions = quizData.quiz;

  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Intro Video */}
      <Sequence from={currentFrame} durationInFrames={FRAMES.INTRO}>
        <AbsoluteFill>
          <RemotionVideo 
            src={staticFile('intro.mp4')} 
            onError={() => {}}
            delayRenderTimeoutInMilliseconds={30000}
            delayRenderRetries={1}
          />
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
              <QuestionSceneTemplate3
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
              <LogoTransitionTemplate3 />
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
          <RemotionVideo 
            src={staticFile('outro.mp4')} 
            onError={() => {}}
            delayRenderTimeoutInMilliseconds={30000}
            delayRenderRetries={1}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

