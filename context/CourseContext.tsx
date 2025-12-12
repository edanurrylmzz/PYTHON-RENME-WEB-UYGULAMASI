import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress } from '../types';

interface CourseContextType {
  progress: UserProgress;
  completeLesson: (id: number) => void;
  completeQuiz: (id: number) => void;
  saveCode: (key: string, code: string) => void;
}

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedQuizzes: [],
  currentLessonId: 1,
  codeCache: {}
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('pyMasterProgress');
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem('pyMasterProgress', JSON.stringify(progress));
  }, [progress]);

  const completeLesson = (id: number) => {
    if (!progress.completedLessons.includes(id)) {
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, id],
        currentLessonId: Math.min(id + 1, 30) // Unlock next
      }));
    }
  };

  const completeQuiz = (id: number) => {
    if (!progress.completedQuizzes.includes(id)) {
      setProgress(prev => ({
        ...prev,
        completedQuizzes: [...prev.completedQuizzes, id]
      }));
    }
  };

  const saveCode = (key: string, code: string) => {
    setProgress(prev => ({
      ...prev,
      codeCache: { ...prev.codeCache, [key]: code }
    }));
  };

  return (
    <CourseContext.Provider value={{ progress, completeLesson, completeQuiz, saveCode }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error("useCourse must be used within a CourseProvider");
  return context;
};