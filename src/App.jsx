import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import ConfigScreen from './components/ConfigScreen';
import ScannerView from './components/ScannerView';
import KanbanBoard from './components/KanbanBoard';
import MagicEditor from './components/MagicEditor';
import ProtectedRoute from './components/ProtectedRoute';
import { useSync } from './services/dbSync';
import { Sparkles, Info } from 'lucide-react';

// Sidebar Layout Wrapper
const SidebarLayout = ({ children }) => {
  const location = useLocation();
  const navItems = [
    { label: 'Scanner', path: '/scanner' },
    { label: 'Pipeline', path: '/kanban' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'CV Lab', path: '/cv-lab' },
    { label: 'Settings', path: '/config' },
  ];

  return (
    <div className="flex min-h-screen bg-obsidian-900 border-l border-slate-800/10">
      <aside className="w-64 border-r border-slate-800/50 bg-obsidian-900 flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-violet-glow tracking-tighter italic">JPA_ASSISTANT</h2>
          <div className="text-[10px] text-slate-600 font-mono tracking-widest">KINETIC_CORE_v1.0</div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === item.path 
                ? 'bg-violet-glow/10 text-violet-glow border-l-2 border-violet-glow' 
                : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const DashboardPlaceholder = () => (
  <div className="p-8 text-violet-glow font-bold">
    <h1 className="text-3xl mb-4 text-white font-black tracking-tighter">System Health</h1>
    <div className="p-6 bg-obsidian-800/40 border border-slate-700/50 rounded-2xl max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
        <span className="text-xs uppercase tracking-widest font-bold">All Agents Standing By</span>
      </div>
      <p className="text-sm text-slate-400 font-medium">Kinetic Archive protocols active. Monitoring for job opportunities and scan requests.</p>
    </div>
  </div>
);

function App() {
  useSync();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (e) => {
      setToast(e.detail);
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener('ai-toast', handleToast);
    return () => window.removeEventListener('ai-toast', handleToast);
  }, []);

  return (
    <div className="min-h-screen bg-obsidian-900 text-slate-200">
      {/* Dynamic System Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-300">
          <div className="bg-violet-glow/10 backdrop-blur-xl border border-violet-glow/30 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-violet-glow" />
            <span className="text-xs font-black uppercase tracking-widest text-violet-glow">{toast}</span>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/config" element={<ConfigScreen />} />

        <Route path="/" element={<Navigate to="/scanner" replace />} />

        {/* Wrap Protected Routes in SidebarLayout */}
        <Route path="/scanner" element={
          <ProtectedRoute>
            <SidebarLayout><ScannerView /></SidebarLayout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <SidebarLayout><DashboardPlaceholder /></SidebarLayout>
          </ProtectedRoute>
        } />

        <Route path="/kanban" element={
          <ProtectedRoute>
            <SidebarLayout><KanbanBoard /></SidebarLayout>
          </ProtectedRoute>
        } />

        <Route path="/cv-lab" element={
          <ProtectedRoute>
            <SidebarLayout><MagicEditor /></SidebarLayout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/scanner" replace />} />
      </Routes>
    </div>
  );
}

export default App;
