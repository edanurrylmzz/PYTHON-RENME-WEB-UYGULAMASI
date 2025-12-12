import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown'; // Assuming environment has this, if not, simple render
import { lessons } from '../data';
import { Difficulty, Lesson } from '../types';
import { usePyodide } from '../hooks/usePyodide';
import { useCourse } from '../context/CourseContext';
import { Quiz } from './Quiz';
import { Play, RotateCcw, Lightbulb, Check, Video, ExternalLink, Code } from 'lucide-react';

const DifficultyTab: React.FC<{ 
    level: Difficulty; 
    current: Difficulty; 
    onClick: (d: Difficulty) => void;
    label: string;
    color: string; 
}> = ({ level, current, onClick, label, color }) => (
    <button
        onClick={() => onClick(level)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
            current === level 
            ? `border-${color}-500 text-${color}-600 bg-white` 
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
    >
        {label}
    </button>
);

export const LessonView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const lessonId = Number(id);
  const lesson = lessons.find(l => l.id === lessonId);
  
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'resources'>('learn');

  const { isReady, runPython } = usePyodide();
  const { saveCode, progress, completeLesson } = useCourse();

  // Reset state when lesson or difficulty changes
  useEffect(() => {
    if (lesson) {
        const savedCode = progress.codeCache[`${lessonId}-${difficulty}`];
        const starter = lesson.content[difficulty].task.starterCode;
        setCode(savedCode || starter);
        setOutput("");
        setShowHint(false);
        setActiveTab('learn');
    }
  }, [lessonId, difficulty, lesson]);

  if (!lesson) return <div className="p-10 text-center">Ders bulunamadı.</div>;

  const currentContent = lesson.content[difficulty];

  const handleRun = async () => {
    setOutput("Çalıştırılıyor...\n");
    await runPython(code, (text) => {
        setOutput(prev => prev === "Çalıştırılıyor...\n" ? text : prev + text);
    });
    // Simple heuristic: if code runs without error (checked inside hook) and contains something meaningful
    if (code.length > 10) {
        saveCode(`${lessonId}-${difficulty}`, code);
        // Mark lesson as complete if hard task is attempted or just visiting
        completeLesson(lessonId); 
    }
  };

  const handleReset = () => {
    setCode(currentContent.task.starterCode);
    setOutput("");
  };

  return (
    <div className="flex flex-col h-screen lg:flex-row overflow-hidden bg-slate-50">
      {/* LEFT COLUMN: Content */}
      <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-200 h-full">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
             <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm font-mono">
                <span>DERS {lesson.id}</span>
                <span>/</span>
                <span className="uppercase text-brand-600 font-bold">{difficulty}</span>
             </div>
             <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
        </div>

        {/* Tabs for Difficulty */}
        <div className="bg-slate-100 px-6 pt-2 border-b border-slate-200 flex gap-2 flex-shrink-0">
             <DifficultyTab level="easy" current={difficulty} onClick={setDifficulty} label="Kolay" color="emerald" />
             <DifficultyTab level="medium" current={difficulty} onClick={setDifficulty} label="Orta" color="yellow" />
             <DifficultyTab level="hard" current={difficulty} onClick={setDifficulty} label="Zor" color="red" />
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Mode Switcher */}
            <div className="flex gap-2 mb-4 bg-slate-200 p-1 rounded-lg w-max">
                <button 
                    onClick={() => setActiveTab('learn')}
                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${activeTab === 'learn' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    Konu & Görev
                </button>
                <button 
                    onClick={() => setActiveTab('resources')}
                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${activeTab === 'resources' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    Video & Kaynak
                </button>
                <button 
                    onClick={() => setActiveTab('quiz')}
                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${activeTab === 'quiz' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    Test ({lesson.quiz.length})
                </button>
            </div>

            {activeTab === 'learn' && (
                <>
                    {/* Theory Section */}
                    <div className="prose prose-slate max-w-none">
                        <div className="whitespace-pre-line leading-relaxed text-slate-700">
                           {currentContent.theory}
                        </div>
                    </div>

                    {/* Examples */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Code size={18} /> Örnekler
                        </h3>
                        {currentContent.examples.map((ex, idx) => (
                            <div key={idx} className="bg-slate-800 rounded-lg overflow-hidden text-sm">
                                <div className="bg-slate-900 px-4 py-2 text-slate-400 border-b border-slate-700 flex justify-between">
                                    <span>{ex.title}</span>
                                </div>
                                <pre className="p-4 text-emerald-400 font-mono overflow-x-auto">{ex.code}</pre>
                                <div className="bg-slate-100 p-3 text-slate-600 border-t border-slate-200">
                                    <span className="font-semibold text-xs uppercase text-slate-400 mr-2">Açıklama:</span>
                                    {ex.explanation}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Task Section */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <Check className="bg-blue-200 text-blue-700 rounded-full p-0.5" size={20} />
                            Sıra Sende: Görev
                        </h3>
                        <p className="text-blue-800 mb-4">{currentContent.task.description}</p>
                        
                        <div className="flex flex-col gap-3">
                            {showHint && (
                                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-yellow-800 text-sm flex gap-2">
                                    <Lightbulb size={16} className="mt-0.5 flex-shrink-0" />
                                    {currentContent.task.hint}
                                </div>
                            )}
                            <button 
                                onClick={() => setShowHint(!showHint)}
                                className="text-blue-600 text-sm font-medium hover:underline self-start flex items-center gap-1"
                            >
                                <Lightbulb size={14} />
                                {showHint ? 'İpucunu Gizle' : 'İpucu Göster'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'resources' && (
                <div className="space-y-6">
                    {/* Video */}
                    <div className="aspect-video w-full bg-slate-900 rounded-xl overflow-hidden shadow-lg">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src={`https://www.youtube.com/embed/${lesson.videoUrl || 'x7X9w_GIm1s'}`} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                    
                    {/* External Links */}
                    <div className="grid gap-3">
                        <h3 className="font-bold text-slate-900">Ek Kaynaklar</h3>
                        {lesson.resources.map((res, i) => (
                            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all group">
                                <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white">
                                    <ExternalLink size={20} className="text-brand-600"/>
                                </div>
                                <div>
                                    <h4 className="font-medium text-slate-900">{res.title}</h4>
                                    <span className="text-xs text-slate-500 capitalize">{res.type}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'quiz' && (
                <Quiz questions={lesson.quiz} lessonId={lesson.id} />
            )}
        </div>
      </div>

      {/* RIGHT COLUMN: Code Editor */}
      <div className="w-full lg:w-1/2 flex flex-col h-full bg-slate-900 text-white">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
            <span className="text-sm font-mono text-slate-400">main.py</span>
            <div className="flex gap-2">
                <button 
                    onClick={handleReset}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="Kodu Sıfırla"
                >
                    <RotateCcw size={18} />
                </button>
                <button
                    onClick={handleRun}
                    disabled={!isReady}
                    className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                >
                    <Play size={16} fill="currentColor" />
                    {isReady ? 'Çalıştır' : 'Yükleniyor...'}
                </button>
            </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 min-h-[300px]">
            <Editor
                height="100%"
                defaultLanguage="python"
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16 }
                }}
            />
        </div>

        {/* Terminal/Output */}
        <div className="h-1/3 min-h-[200px] border-t-4 border-slate-800 bg-[#0d1117] flex flex-col">
            <div className="px-4 py-2 bg-slate-800/50 text-xs font-mono text-slate-400 flex justify-between uppercase tracking-wider">
                <span>Terminal Çıktısı</span>
                <span onClick={() => setOutput('')} className="cursor-pointer hover:text-white">Temizle</span>
            </div>
            <pre className="flex-1 p-4 font-mono text-sm text-slate-300 overflow-auto whitespace-pre-wrap">
                {output || <span className="text-slate-600 italic">Çıktı bekleniyor... Kodunuzu çalıştırmak için "Çalıştır" butonuna basın.</span>}
            </pre>
        </div>
      </div>
    </div>
  );
};