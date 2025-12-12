import React from 'react';
import { NavLink } from 'react-router-dom';
import { lessons } from '../data';
import { useCourse } from '../context/CourseContext';
import { CheckCircle, Lock, PlayCircle, BookOpen } from 'lucide-react';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { progress } = useCourse();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-slate-100 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:block border-r border-slate-700`}
    >
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-yellow-400 rounded-lg"></div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-white">PyMaster</h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <NavLink
            to="/"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${
                isActive ? 'bg-slate-800 border-r-4 border-brand-500' : ''
              }`
            }
          >
            <BookOpen size={20} className="text-brand-500" />
            <span className="font-medium">Genel Bakış</span>
          </NavLink>

          <div className="mt-6 px-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Dersler
          </div>

          <div className="space-y-1">
            {lessons.map((lesson) => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              const isLocked = lesson.id > progress.currentLessonId && !isCompleted;
              
              return (
                <NavLink
                  key={lesson.id}
                  to={isLocked ? '#' : `/lesson/${lesson.id}`}
                  onClick={() => !isLocked && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-6 py-3 text-sm transition-colors ${
                      isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 cursor-pointer'
                    } ${isActive ? 'bg-slate-800 text-brand-400 font-medium' : 'text-slate-300'}`
                  }
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-xs font-mono text-slate-500 w-5">{lesson.id}.</span>
                    <span className="truncate w-40">{lesson.title}</span>
                  </div>
                  {isCompleted ? (
                    <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                  ) : isLocked ? (
                    <Lock size={16} className="text-slate-600 flex-shrink-0" />
                  ) : (
                    <PlayCircle size={16} className="text-brand-500 flex-shrink-0" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-700 bg-slate-900">
           <div className="text-xs text-slate-400 text-center">
             v1.0.0 • React & Pyodide
           </div>
        </div>
      </div>
    </aside>
  );
};