export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  description: string;
  starterCode: string;
  solutionCode: string;
  hint: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'doc' | 'blog';
}

export interface LevelContent {
  difficulty: Difficulty;
  title: string;
  theory: string; // Markdown or HTML string
  examples: { title: string; code: string; explanation: string }[];
  task: Task;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: {
    easy: LevelContent;
    medium: LevelContent;
    hard: LevelContent;
  };
  quiz: QuizQuestion[];
  resources: Resource[];
  videoUrl?: string; // Youtube Embed ID
}

export interface UserProgress {
  completedLessons: number[]; // Array of lesson IDs
  completedQuizzes: number[];
  currentLessonId: number;
  codeCache: Record<string, string>; // Store user code per lesson/task
}