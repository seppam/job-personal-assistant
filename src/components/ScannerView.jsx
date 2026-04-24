import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { aiRouter } from '../services/aiRouter';
import { addJob } from '../store/slices/jobsSlice';
import ModelSelector from './ModelSelector';
import SystemCoolingOverlay from './SystemCoolingOverlay';
import { AlertTriangle, ShieldCheck, Search, Loader2, ExternalLink, PlusCircle, CheckCircle2, Key, Info } from 'lucide-react';

const ScannerView = () => {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.config);
  const isRateLimited = useSelector((state) => state.config.isRateLimited);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    aiRouter.init(config);
  }, [config]);

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!input) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setIsTracked(false);

    try {
      let textToScan = input;
      if (input.startsWith('http')) {
        textToScan = await aiRouter.extractTextFromUrl(input);
      }

      const scanResult = await aiRouter.scanJob(textToScan);
      setResult(scanResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderError = () => {
    if (!error) return null;

    if (error === 'RATE_LIMIT_EXCEEDED') return null; // Handled by global overlay

    if (error.startsWith('KEY_REQUIRED')) {
      return (
        <div className="bg-red-950/20 border border-red-900/40 text-red-400 p-6 rounded-xl mb-8 flex items-start gap-4">
          <Key className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg mb-1">Key Required</h3>
            <p className="text-sm opacity-80">The selected model requires an active API key. System fallback failed or no keys available.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-red-950/20 border border-red-900/40 text-red-400 p-4 rounded-lg mb-8 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm">{error === 'EXTRACTION_FAILED' ? 'Could not extract text from link. Please use Copy-Paste method.' : error}</p>
      </div>
    );
  };

  const handleTrack = () => {
    if (!result) return;
    dispatch(addJob({
      title: 'Scanned Application',
      company: 'Extracted Job',
      score: result.score,
      link: input.startsWith('http') ? input : '',
      verdict: result.verdict
    }));
    setIsTracked(true);
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'Legit': return 'text-green-400 border-green-900/40 bg-green-950/20';
      case 'Suspicious': return 'text-amber-400 border-amber-900/40 bg-amber-950/20';
      case 'High Risk': return 'text-red-400 border-red-900/40 bg-red-950/20';
      default: return 'text-slate-400 border-slate-700 bg-obsidian-800';
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 text-slate-100 p-8 relative">
      {isRateLimited && <SystemCoolingOverlay />}
      
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-violet-glow mb-2 flex items-center gap-3">
              <Search className="w-8 h-8" />
              Job Discovery Scanner
            </h1>
            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">
              Verihire Core v2.0 | Threat Detection Agent
            </p>
          </div>
          <ModelSelector />
        </header>

        <section className="bg-obsidian-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md mb-8">
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                Target URL or Job Description
                {(!config.geminiKey && !config.anthropicKey) && (
                  <span className="text-red-500 flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3 h-3" /> NO AI CORES ACTIVE
                  </span>
                )}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste Job LinkedIn/Indeed URL or full text here..."
                className="w-full h-32 bg-obsidian-900 border border-slate-700/50 rounded-lg p-4 text-sm focus:outline-none focus:border-violet-glow/50 transition-all resize-none"
              />
            </div>
            <button
              disabled={loading || !input || isRateLimited}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-violet-glow text-obsidian-900 font-black py-3 rounded-lg hover:opacity-90 disabled:opacity-20 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {loading ? 'ANALYZING THREATS...' : 'INITIATE SCAN'}
            </button>
          </form>
        </section>

        {renderError()}

        {result && (
          <div className={`border rounded-xl p-8 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 ${getVerdictColor(result.verdict)}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Analysis Verdict</div>
                <h2 className="text-4xl font-extrabold tracking-tighter uppercase">{result.verdict}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 w-32 bg-obsidian-900/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-current transition-all duration-1000" 
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-bold">{result.score}% Trust Score</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleTrack}
                  disabled={isTracked}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
                    isTracked 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default' 
                    : 'bg-violet-glow text-obsidian-900 hover:scale-105 active:scale-95 shadow-lg shadow-violet-glow/20'
                  }`}
                >
                  {isTracked ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  {isTracked ? 'Tracked in Pipeline' : 'Track this Job'}
                </button>
              </div>
            </div>

            <hr className="my-8 opacity-10 border-current" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Detection Flags</h3>
                <ul className="space-y-2">
                  {result.flags?.map((flag, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {flag}
                    </li>
                  )) || <span className="text-xs opacity-50 italic">No flags reported.</span>}
                </ul>
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Agent Recommendation</h3>
                <p className="text-sm leading-relaxed">{result.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerView;
