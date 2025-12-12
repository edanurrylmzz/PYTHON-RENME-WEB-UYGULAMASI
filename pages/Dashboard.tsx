import React from 'react';
import { useCourse } from '../context/CourseContext';
import { lessons } from '../data';
import { Link } from 'react-router-dom';
import { Trophy, Flame, Book, Activity, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { progress } = useCourse();

  const completedCount = progress.completedLessons.length;
  const totalLessons = lessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Determine current active lesson
  const currentLesson = lessons.find(l => l.id === progress.currentLessonId) || lessons[0];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl mb-10 relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Hoş geldin, Pythonist! 👋</h1>
            <p className="text-indigo-100 text-lg max-w-2xl">Python öğrenme yolculuğuna kaldığın yerden devam et. Bugün yeni şeyler öğrenmek için harika bir gün.</p>
            
            <div className="mt-8 flex gap-4">
                 <Link 
                    to={`/lesson/${currentLesson.id}`}
                    className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors shadow-lg inline-flex items-center gap-2"
                >
                    Derse Devam Et <ArrowRight size={18} />
                </Link>
            </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10">
            <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <Book size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Tamamlanan Ders</p>
                <p className="text-2xl font-bold text-slate-900">{completedCount} / {totalLessons}</p>
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <Trophy size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Test Skoru</p>
                <p className="text-2xl font-bold text-slate-900">{progress.completedQuizzes.length * 10} XP</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                <Flame size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Seri (Streak)</p>
                <p className="text-2xl font-bold text-slate-900">3 Gün</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Activity size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Genel İlerleme</p>
                <p className="text-2xl font-bold text-slate-900">%{progressPercent}</p>
            </div>
        </div>
      </div>

      {/* Course Map / List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Müfredat</h2>
          </div>
          <div className="p-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {lessons.map((lesson) => {
                       const isCompleted = progress.completedLessons.includes(lesson.id);
                       const isLocked = lesson.id > progress.currentLessonId && !isCompleted;

                       return (
                           <Link 
                                to={isLocked ? "#" : `/lesson/${lesson.id}`}
                                key={lesson.id} 
                                className={`block p-5 rounded-lg border-2 transition-all ${
                                    isCompleted 
                                    ? 'border-emerald-200 bg-emerald-50 hover:border-emerald-300' 
                                    : isLocked 
                                        ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                                        : 'border-white bg-white shadow-md hover:shadow-lg hover:border-brand-200'
                                }`}
                           >
                               <div className="flex justify-between items-start mb-3">
                                   <span className={`text-xs font-bold px-2 py-1 rounded ${isCompleted ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                                       DERS {lesson.id}
                                   </span>
                                   {isCompleted && <Trophy size={16} className="text-emerald-500" />}
                               </div>
                               <h3 className="font-bold text-slate-800 mb-2">{lesson.title}</h3>
                               <p className="text-sm text-slate-500 line-clamp-2">{lesson.description}</p>
                           </Link>
                       )
                  })}
              </div>
          </div>
      </div>
    </div>
  );
};