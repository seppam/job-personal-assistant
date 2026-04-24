import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setKeys, setInitialized } from '../store/slices/configSlice';
import { useNavigate } from 'react-router-dom';
import { Shield, Database, Cpu, Zap, Info } from 'lucide-react';

const ConfigScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { geminiKey, anthropicKey, mongoUri, atlasAppId, atlasApiKey } = useSelector((state) => state.config);

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newKeys = {
      geminiKey: formData.get('geminiKey'),
      anthropicKey: formData.get('anthropicKey'),
      mongoUri: formData.get('mongoUri'),
      atlasAppId: formData.get('atlasAppId'),
      atlasApiKey: formData.get('atlasApiKey'),
    };
    
    dispatch(setKeys(newKeys));
    
    // Auto-unlock if at least one AI key exists
    if (newKeys.geminiKey || newKeys.anthropicKey) {
      dispatch(setInitialized(true));
      navigate('/scanner');
    } else {
      alert('Initialization Blocked: At least one AI Core (Gemini or Claude) is required.');
    }
  };

  const hasMinimumAI = geminiKey || anthropicKey;

  return (
    <div className="min-h-screen bg-obsidian-900 text-slate-100 p-8 font-sans flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-violet-glow/10 rounded-2xl border border-violet-glow/20 mb-6">
            <Shield className="w-10 h-10 text-violet-glow animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 underline decoration-violet-glow/30 underline-offset-8">GATEWAY_PROTOCOL</h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-mono">System Initialization Required</p>
        </header>

        <form onSubmit={handleSave} className="space-y-6 bg-obsidian-800/40 border border-slate-700/30 p-10 rounded-2xl backdrop-blur-xl shadow-2xl">
          <div className="space-y-8">
            {/* AI Cores Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-violet-glow" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Compute Cores (Min. 1 Required)</h3>
              </div>
              
              <div className="grid gap-4">
                <div className="group relative">
                  <input
                    name="geminiKey"
                    type="password"
                    defaultValue={geminiKey}
                    placeholder="Google Gemini API Key"
                    className="w-full bg-obsidian-900/50 border border-slate-700/50 rounded-xl p-4 text-sm text-violet-glow focus:ring-1 focus:ring-violet-glow/50 outline-none transition-all placeholder:text-slate-700"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold uppercase">Flash / Pro</div>
                </div>

                <div className="group relative">
                  <input
                    name="anthropicKey"
                    type="password"
                    defaultValue={anthropicKey}
                    placeholder="Anthropic Claude API Key"
                    className="w-full bg-obsidian-900/50 border border-slate-700/50 rounded-xl p-4 text-sm text-violet-glow focus:ring-1 focus:ring-violet-glow/50 outline-none transition-all placeholder:text-slate-700"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold uppercase">Opus / Haiku</div>
                </div>
              </div>
            </div>

            {/* Persistence Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-tertiary-gold" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cloud Persistence (Optional)</h3>
              </div>
              
              <input
                name="mongoUri"
                type="text"
                defaultValue={mongoUri}
                placeholder="MongoDB Connection URI"
                className="w-full bg-obsidian-900/50 border border-slate-700/50 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-tertiary-gold/50 outline-none transition-all placeholder:text-slate-700"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="atlasAppId"
                  defaultValue={atlasAppId}
                  placeholder="App ID"
                  className="bg-obsidian-900/50 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-300 outline-none focus:border-slate-500"
                />
                <input
                  name="atlasApiKey"
                  type="password"
                  defaultValue={atlasApiKey}
                  placeholder="Data API Key"
                  className="bg-obsidian-900/50 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-300 outline-none focus:border-slate-500"
                />
              </div>
              <div className="flex items-center gap-2 text-[9px] text-slate-600 italic">
                <Info className="w-3 h-3" />
                Leave empty for Local-Only mode. System uses LocalStorage by default.
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-violet-glow to-violet-muted text-obsidian-900 font-black py-4 rounded-xl overflow-hidden active:scale-95 transition-all shadow-xl shadow-violet-glow/10"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Zap className="w-5 h-5 relative z-10" />
              <span className="relative z-10 uppercase tracking-[0.2em] text-sm">Initialize Kinetic Core</span>
            </button>
            <p className="mt-4 text-center text-[9px] text-slate-600 uppercase tracking-widest">
              Authored Credentials Remain Private and Encrypted In Session
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigScreen;
