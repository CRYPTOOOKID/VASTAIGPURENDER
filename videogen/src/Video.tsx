import React from 'react';
import { getTemplateById } from './templates/templateRegistry';
import { QuizData } from './types/quiz';

export interface VideoProps {
  quizData: QuizData;
  audioFolder: string;
  templateId: string;
}

export const QuizVideo: React.FC<VideoProps> = ({ quizData, audioFolder, templateId }) => {
  const templateInfo = getTemplateById(templateId);
  
  if (!templateInfo) {
    throw new Error(`Template with ID "${templateId}" not found`);
  }

  const TemplateComponent = templateInfo.component;

  return <TemplateComponent quizData={quizData} audioFolder={audioFolder} />;
};
