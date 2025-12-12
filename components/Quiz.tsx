import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { useCourse } from '../context/CourseContext';

interface QuizProps {
  questions: QuizQuestion[];
  lessonId: number;
}

export const Quiz: React.FC<QuizProps> = ({ questions, lessonId }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { completeQuiz } = useCourse();

  const currentQ = questions[currentQIndex];

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
        // Quiz Finished
        completeQuiz(lessonId);
    }
  };

  const isFinished = isSubmitted && currentQIndex === questions.length - 1;

  if (isFinished) {
      return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Test Tamamlandı!</h3>
              <p className="text-slate-600 mb-6">
                  Toplam Skor: <span className="font-bold text-slate-900">{score} / {questions.length}</span>
              </p>
              <button 
                onClick={() => {
                    setCurrentQIndex(0);
                    setSelectedOption(null);
                    setIsSubmitted(false);
                    setScore(0);
                }}
                className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                  Tekrar Çöz
              </button>
          </div>
      )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <HelpCircle size={18} className="text-brand-500"/>
            Bölüm Testi
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-slate-200 rounded text-slate-600">
            Soru {currentQIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="p-6">
        <p className="text-lg text-slate-800 mb-6 font-medium">{currentQ.question}</p>
        
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
            
            if (isSubmitted) {
                if (idx === currentQ.correctIndex) {
                    btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                } else if (idx === selectedOption) {
                    btnClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                    btnClass += "border-slate-100 text-slate-400";
                }
            } else {
                if (selectedOption === idx) {
                    btnClass += "border-brand-500 bg-brand-50 text-brand-900";
                } else {
                    btnClass += "border-slate-200 hover:border-brand-300 hover:bg-slate-50";
                }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(idx)}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isSubmitted && idx === currentQ.correctIndex && <CheckCircle size={20} className="text-emerald-500"/>}
                    {isSubmitted && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle size={20} className="text-red-500"/>}
                </div>
              </button>
            );
          })}
        </div>

        {isSubmitted && (
            <div className={`mt-6 p-4 rounded-lg ${selectedOption === currentQ.correctIndex ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                <p className="font-semibold mb-1">
                    {selectedOption === currentQ.correctIndex ? "Doğru!" : "Yanlış!"}
                </p>
                <p className="text-sm opacity-90">{currentQ.explanation}</p>
            </div>
        )}

        <div className="mt-8 flex justify-end">
            {!isSubmitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    Kontrol Et
                </button>
            ) : (
                <button
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium flex items-center gap-2"
                >
                    {currentQIndex < questions.length - 1 ? "Sonraki Soru" : "Sonuçları Gör"}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};