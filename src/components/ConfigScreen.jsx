import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setKeys, setInitialized } from '../store/slices/configSlice';
import { useNavigate } from 'react-router-dom';
import { Shield, Database, Cpu, Zap, ExternalLink } from 'lucide-react';

const ConfigScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { geminiKey, anthropicKey, mongoUri, atlasAppId, atlasApiKey, envLocks } = useSelector((state) => state.config);

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

    if (newKeys.geminiKey || newKeys.anthropicKey) {
      dispatch(setInitialized(true));
      navigate('/scanner');
    } else {
      alert('You need at least one AI key (Gemini or Claude) to continue. Head to the links below to get a free API key!');
    }
  };

  const hasMinimumAI = !!(geminiKey || anthropicKey);

  return (
    <div className="min-h-screen bg-obsidian-900 text-slate-100 p-6 font-sans flex items-center justify-center">
      <div className="max-w-2xl w-full">

        {/* ── Header ── */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-violet-glow/10 rounded-2xl border border-violet-glow/20 mb-5">
            <Shield className="w-9 h-9 text-violet-glow" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
            Welcome! Let's get you set up 🔧
          </h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            Add your own API keys to power the AI features. Everything stays on your device — we never store your keys on any server.
          </p>
        </header>

        {/* ── Form ── */}
        <form onSubmit={handleSave} className="space-y-8">

          {/* AI Keys Section */}
          <div className="bg-obsidian-800/40 border border-slate-700/30 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 mb-5">
              <Cpu className="w-4 h-4 text-violet-glow" />
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
                AI Provider — Choose at Least One
              </h2>
            </div>

            {/* Gemini */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Google Gemini API Key
              </label>
              <div className="relative">
                <input
                  name="geminiKey"
                  type="password"
                  autoComplete="off"
                  defaultValue={geminiKey}
                  placeholder="e.g. AIzaSy..."
                  disabled={envLocks.geminiKey}
                  className={`w-full bg-obsidian-900/60 border border-slate-700/50 rounded-xl p-4 pr-20 text-sm text-violet-glow focus:ring-1 focus:ring-violet-glow/50 outline-none transition-all placeholder:text-slate-600 ${envLocks.geminiKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                {!envLocks.geminiKey && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-wide">Gemini</span>
                )}
              </div>
              {envLocks.geminiKey ? (
                <p className="text-[10px] text-tertiary-gold italic mt-1">Locked via .env file.</p>
              ) : (
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-500">
                  <span>Free tier available at</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-glow hover:underline flex items-center gap-0.5"
                  >
                    aistudio.google.com <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Claude */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Anthropic Claude API Key <span className="text-slate-600 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <input
                  name="anthropicKey"
                  type="password"
                  autoComplete="off"
                  defaultValue={anthropicKey}
                  placeholder="sk-ant-..."
                  disabled={envLocks.anthropicKey}
                  className={`w-full bg-obsidian-900/60 border border-slate-700/50 rounded-xl p-4 pr-20 text-sm text-slate-200 focus:ring-1 focus:ring-violet-glow/50 outline-none transition-all placeholder:text-slate-600 ${envLocks.anthropicKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                {!envLocks.anthropicKey && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-wide">Claude</span>
                )}
              </div>
              {envLocks.anthropicKey ? (
                <p className="text-[10px] text-tertiary-gold italic mt-1">Locked via .env file.</p>
              ) : (
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-500">
                  <span>Get a key at</span>
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-glow hover:underline flex items-center gap-0.5"
                  >
                    console.anthropic.com <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Database Section */}
          <div className="bg-obsidian-800/40 border border-slate-700/30 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 mb-5">
              <Database className="w-4 h-4 text-tertiary-gold" />
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Cloud Storage <span className="text-slate-600 font-normal">(optional — works offline without)</span>
              </h2>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-300 mb-2">
                MongoDB Atlas Connection URI
              </label>
              <input
                name="mongoUri"
                type="text"
                autoComplete="off"
                defaultValue={mongoUri}
                placeholder="mongodb+srv://username:password@..."
                disabled={envLocks.mongoUri}
                className={`w-full bg-obsidian-900/60 border border-slate-700/50 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-tertiary-gold/50 outline-none transition-all placeholder:text-slate-600 ${envLocks.mongoUri ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {envLocks.mongoUri ? (
                <p className="text-[10px] text-tertiary-gold italic mt-1">Locked via .env file.</p>
              ) : (
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-500">
                  <span>Free tier at</span>
                  <a
                    href="https://www.mongodb.com/atlas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-glow hover:underline flex items-center gap-0.5"
                  >
                    mongodb.com/atlas <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Atlas App ID</label>
                <input
                  name="atlasAppId"
                  defaultValue={atlasAppId}
                  placeholder="app-xxxxxxxx"
                  disabled={envLocks.atlasAppId}
                  className={`bg-obsidian-900/60 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-200 outline-none focus:border-slate-500 transition-all placeholder:text-slate-600 ${envLocks.atlasAppId ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Data API Key</label>
                <input
                  name="atlasApiKey"
                  type="password"
                  autoComplete="off"
                  defaultValue={atlasApiKey}
                  placeholder="••••••••"
                  disabled={envLocks.atlasApiKey}
                  className={`bg-obsidian-900/60 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-200 outline-none focus:border-slate-500 transition-all placeholder:text-slate-600 ${envLocks.atlasApiKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div className="flex items-start gap-1.5 mt-4 text-[10px] text-slate-600 leading-relaxed">
              <span>💡 All keys are stored locally in your browser. The app works fully offline without cloud sync.</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-violet-glow to-violet-muted text-obsidian-900 font-black py-4 rounded-xl overflow-hidden active:scale-95 transition-all shadow-xl shadow-violet-glow/10"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Zap className="w-5 h-5 relative z-10" />
              <span className="relative z-10 uppercase tracking-[0.2em] text-sm">Save &amp; Launch</span>
            </button>
            <p className="mt-3 text-center text-[9px] text-slate-600 uppercase tracking-widest">
              🔒 Your keys never leave your browser
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigScreen;
