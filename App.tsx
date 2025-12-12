import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CourseProvider } from './context/CourseContext';
import { Sidebar } from './components/Sidebar';
import { LessonView } from './components/LessonView';
import { Dashboard } from './pages/Dashboard';
import { Menu, X } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center flex-shrink-0 z-20">
            <span className="font-bold text-brand-600">PyMaster</span>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-600">
                {sidebarOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
        </div>

        <main className="flex-1 overflow-auto bg-slate-50">
            {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CourseProvider>
      <Router>
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/lesson/:id" element={<LessonView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
      </Router>
    </CourseProvider>
  );
};

export default App;