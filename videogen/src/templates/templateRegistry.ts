import React from 'react';
import { Template1 } from './Template1';
import { Template2 } from './Template2';
import { Template3 } from './Template3';
import { QuizVideoProps } from '../types/quiz';

export interface TemplateInfo {
  id: string;
  name: string;
  component: React.FC<QuizVideoProps>;
  description: string;
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'template1',
    name: 'Gradient Blobs',
    component: Template1,
    description: 'Modern gradient background with animated blobs and geometric shapes',
  },
  {
    id: 'template2',
    name: 'Starfield',
    component: Template2,
    description: 'Space-themed with twinkling stars, particles, and nebula clouds',
  },
  {
    id: 'template3',
    name: 'Cute Education',
    component: Template3,
    description: 'Cute and engaging design with difficulty badges, star progress, hourglass timer, and confetti celebrations',
  },
];

// Get a random template
export const getRandomTemplate = (): TemplateInfo => {
  const randomIndex = Math.floor(Math.random() * TEMPLATES.length);
  return TEMPLATES[randomIndex];
};

// Get template by ID
export const getTemplateById = (id: string): TemplateInfo | undefined => {
  return TEMPLATES.find((template) => template.id === id);
};

// Get seeded random template (consistent for same seed)
export const getSeededRandomTemplate = (seed: string): TemplateInfo => {
  // Simple hash function for consistent randomness
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % TEMPLATES.length;
  return TEMPLATES[index];
};

// List all template IDs
export const getAllTemplateIds = (): string[] => {
  return TEMPLATES.map((t) => t.id);
};

