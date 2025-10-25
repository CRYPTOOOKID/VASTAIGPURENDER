// Centralized timing configuration for all templates
// All templates MUST use these values to ensure consistency

export const TIMING = {
  FPS: 30,
  INTRO_DURATION: 4, // seconds
  QUESTION_DISPLAY: 5, // seconds
  OPTIONS_TIMER: 8, // seconds
  ANSWER_REVEAL: 2, // seconds
  LOGO_TRANSITION: 1, // second
  OUTRO_DURATION: 5, // seconds
};

// Convert to frames
export const FRAMES = {
  FPS: TIMING.FPS,
  INTRO: TIMING.INTRO_DURATION * TIMING.FPS,
  QUESTION_DISPLAY: TIMING.QUESTION_DISPLAY * TIMING.FPS,
  OPTIONS_TIMER: TIMING.OPTIONS_TIMER * TIMING.FPS,
  ANSWER_REVEAL: TIMING.ANSWER_REVEAL * TIMING.FPS,
  LOGO_TRANSITION: TIMING.LOGO_TRANSITION * TIMING.FPS,
  OUTRO: TIMING.OUTRO_DURATION * TIMING.FPS,
};

// Total duration per question
export const TOTAL_QUESTION_DURATION =
  FRAMES.QUESTION_DISPLAY +
  FRAMES.OPTIONS_TIMER +
  FRAMES.ANSWER_REVEAL +
  FRAMES.LOGO_TRANSITION;

// Calculate total video duration
export const calculateTotalDuration = (questionCount: number): number => {
  return FRAMES.INTRO + (TOTAL_QUESTION_DURATION * questionCount) + FRAMES.OUTRO;
};









