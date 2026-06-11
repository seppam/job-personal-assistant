import React from 'react';
import { useDispatch } from 'react-redux';
import { clearRateLimit } from '../store/slices/configSlice';
import { RefreshCw, ZapOff, ShieldAlert } from 'lucide-react';

const SystemCoolingOverlay = () => {
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-md bg-obsidian-900/60 transition-all animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-amber-950/20 border border-amber-500/30 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden">
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 bg-linear-to-b from-amber-500/5 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full border border-amber-500/20 mb-8">
            <ZapOff className="w-12 h-12 text-amber-500 animate-pulse" />
          </div>

          <h2 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">System Cooling Down</h2>
          <p className="text-amber-200/70 text-sm leading-relaxed mb-10 font-medium">
            Your API limit has been reached. The Kinetic Core is currently throttling to prevent circuit fatigue.
          </p>

          <button 
            onClick={() => dispatch(clearRateLimit())}
            className="w-full flex items-center justify-center gap-3 bg-amber-500 text-amber-950 font-black py-4 rounded-2xl hover:bg-amber-400 active:scale-[0.98] transition-all shadow-xl shadow-amber-500/20"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="uppercase tracking-widest text-sm">Initiate Manual Retry</span>
          </button>

          <p className="mt-6 text-[10px] text-amber-500/40 uppercase tracking-[0.3em] font-mono">
            Safety Protocol Active // Rate_Limit_429
          </p>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/20 rounded-tl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/20 rounded-br-3xl"></div>
      </div>
    </div>
  );
};

export default SystemCoolingOverlay;
