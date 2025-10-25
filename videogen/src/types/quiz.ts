// Type definitions for quiz data

export interface QuizQuestion {
  question_id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface QuizData {
  quiz: QuizQuestion[];
}

export interface QuizVideoProps {
  quizData: QuizData;
  audioFolder: string;
}









