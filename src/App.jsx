import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import ConfigScreen from './components/ConfigScreen';
import ScannerView from './components/ScannerView';
import KanbanBoard from './components/KanbanBoard';
import MagicEditor from './components/MagicEditor';
import ProfileForm from './components/ProfileForm';
import RoadmapView from './components/RoadmapView';
import ProtectedRoute from './components/ProtectedRoute';
import { useSync } from './services/dbSync';
import { Sparkles } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from './auth';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from './store/slices/profileSlice';

// ── Check if user has completed onboarding (at least one AI key set) ─────────
const useHasKeys = () => {
  const { geminiKey, anthropicKey } = useSelector((state) => state.config);
  return !!(geminiKey || anthropicKey);
};

// ── Onboarding gate: redirect to /config if no keys yet ─────────────────────
const OnboardingGate = ({ children }) => {
  const hasKeys = useHasKeys();
  if (!hasKeys) return <Navigate to="/config" replace />;
  return children;
};

// ── After first sign-in with no keys: land on ConfigScreen ──────────────────
const SmartRoot = () => {
  const hasKeys = useHasKeys();
  // Once keys exist, go to scanner; otherwise stay on config
  return <Navigate to={hasKeys ? '/scanner' : '/config'} replace />;
};

// ── Sidebar Layout Wrapper ────────────────────────────────────────────────────
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
    <div className="flex flex-col md:flex-row min-h-screen bg-obsidian-900 border-l border-slate-800/10">
      <nav className="md:hidden flex gap-1 overflow-x-auto border-b border-slate-800/50 bg-obsidian-900 px-3 py-2 sticky top-0 z-40">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
              location.pathname === item.path ? 'bg-violet-glow/10 text-violet-glow' : 'text-slate-500'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <aside className="hidden md:flex w-64 border-r border-slate-800/50 bg-obsidian-900 flex flex-col p-6 sticky top-0 h-screen">
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
        <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center gap-3 text-sm text-slate-400">
          <UserButton afterSignOutUrl="/" />
          <span>Account</span>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

// ── Landing Page (unauthenticated) ─────────────────────────────────────────
const LandingPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian-900 text-center p-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-violet-glow/20 via-obsidian-900/80 to-obsidian-900" />
    <div className="relative z-10">
      <h1 className="text-6xl font-black text-white tracking-tighter mb-4">
        JPA_<span className="text-violet-glow italic">ASSISTANT</span>
      </h1>
      <p className="text-xl text-slate-400 mb-8 max-w-lg mx-auto">
        Your Personal AI Career Companion. Map your trajectory and bridge your skill gaps.
      </p>
      <div className="bg-violet-glow/10 hover:bg-violet-glow/20 border border-violet-glow/50 text-violet-glow font-bold py-3 px-8 rounded-full transition-all cursor-pointer">
        <SignInButton mode="modal" />
      </div>
    </div>
  </div>
);

// ── Sync Clerk user profile into Redux ──────────────────────────────────────
const UserSyncProvider = ({ children }) => {
  const { user } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(updateProfile({
        firstName: user.firstName,
        email: user.primaryEmailAddress?.emailAddress,
      }));
    }
  }, [user, dispatch]);

  return <>{children}</>;
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => (
  <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
    <div className="mb-8 shrink-0">
      <h1 className="text-3xl font-black tracking-tighter text-white mb-2">Career Dashboard</h1>
      <p className="text-slate-400">Map your trajectory and identify critical skill gaps.</p>
    </div>
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
      <div className="overflow-y-auto pr-2 custom-scrollbar">
        <ProfileForm />
      </div>
      <div className="overflow-y-auto pl-2 custom-scrollbar border-t lg:border-t-0 lg:border-l border-slate-700/50 pt-8 lg:pt-0">
        <RoadmapView />
      </div>
    </div>
  </div>
);

// ── App Root ──────────────────────────────────────────────────────────────────
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

      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <UserSyncProvider>
          <Routes>
            {/* Smart root: land on scanner (if configured) or config (if first time) */}
            <Route path="/" element={<SmartRoot />} />

            {/* ConfigScreen is the onboarding / settings page */}
            <Route path="/config" element={<ConfigScreen />} />

            {/* Protected routes — all wrapped in OnboardingGate + SidebarLayout */}
            <Route path="/scanner" element={
              <OnboardingGate>
                <SidebarLayout><ScannerView /></SidebarLayout>
              </OnboardingGate>
            } />

            <Route path="/dashboard" element={
              <OnboardingGate>
                <SidebarLayout><Dashboard /></SidebarLayout>
              </OnboardingGate>
            } />

            <Route path="/kanban" element={
              <OnboardingGate>
                <SidebarLayout><KanbanBoard /></SidebarLayout>
              </OnboardingGate>
            } />

            <Route path="/cv-lab" element={
              <OnboardingGate>
                <SidebarLayout><MagicEditor /></SidebarLayout>
              </OnboardingGate>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UserSyncProvider>
      </SignedIn>
    </div>
  );
}

export default App;
