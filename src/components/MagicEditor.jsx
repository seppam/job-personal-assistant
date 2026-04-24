import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import CVDocument from './pdf/CVDocument';
import debounce from 'lodash.debounce';
import { 
  updatePersonal, 
  addExperience, 
  updateExperience, 
  removeExperience, 
  updateSkills, 
  setTargetJD 
} from '../store/slices/cvSlice';
import { aiRouter } from '../services/aiRouter';
import ModelSelector from './ModelSelector';
import SystemCoolingOverlay from './SystemCoolingOverlay';
import { useKeyCheck } from '../hooks/useKeyCheck';
import { 
  User, Briefcase, Award, Sparkles, Wand2, Download, 
  ChevronRight, Brain, AlertCircle, Loader2, Key
} from 'lucide-react';

const MagicEditor = () => {
  const dispatch = useDispatch();
  const cv = useSelector((state) => state.cv);
  const isRateLimited = useSelector((state) => state.config.isRateLimited);
  const { hasAnthropic, hasGemini } = useKeyCheck();
  
  const [theme, setTheme] = useState('tech');
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const debouncedUpdatePersonal = useCallback(
    debounce((data) => dispatch(updatePersonal(data)), 500),
    [dispatch]
  );

  const debouncedUpdateExperience = useCallback(
    debounce((id, data) => dispatch(updateExperience({ id, data })), 500),
    [dispatch]
  );

  const handleAiTailor = async () => {
    if (!cv.targetJD || isRateLimited) return;
    setAiLoading(true);
    try {
      const cvText = JSON.stringify(cv);
      const result = await aiRouter.analyzeCV(cvText, cv.targetJD);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePolish = async (sectionId, content) => {
    if (isRateLimited) return;
    setAiLoading(true);
    try {
      const polished = await aiRouter.polishSection(content, cv.targetJD);
      if (sectionId === 'summary') {
        dispatch(updatePersonal({ summary: polished }));
      } else {
        dispatch(updateExperience({ id: sectionId, data: { bullets: polished } }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const pdfDoc = useMemo(() => <CVDocument data={cv} theme={theme} />, [cv, theme]);

  return (
    <div className="flex flex-col h-screen bg-obsidian-900 border-l border-slate-800/10 overflow-hidden relative">
      {isRateLimited && <SystemCoolingOverlay />}
      
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-obsidian-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-black text-white tracking-widest uppercase">CV_LAB</h1>
          <div className="flex bg-obsidian-800/80 p-1 rounded-lg border border-slate-700/50">
            <button 
              onClick={() => setTheme('tech')}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${theme === 'tech' ? 'bg-violet-glow text-obsidian-900' : 'text-slate-500'}`}
            >Tech/MD</button>
            <button 
              onClick={() => setTheme('classic')}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${theme === 'classic' ? 'bg-violet-glow text-obsidian-900' : 'text-slate-500'}`}
            >Classic</button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ModelSelector />
          <button 
            onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
            className="flex items-center gap-2 bg-obsidian-800 text-violet-glow px-4 py-2 rounded-lg border border-violet-glow/30 text-xs font-bold hover:bg-violet-glow/10 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Tailoring Assistant
          </button>
          <PDFDownloadLink document={pdfDoc} fileName="resume-polished.pdf">
            {({ loading }) => (
              <button className="flex items-center gap-2 bg-violet-glow text-obsidian-900 px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-all">
                <Download className="w-4 h-4" />
                {loading ? 'Preparing...' : 'Export PDF'}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Input Form */}
        <div className="w-1/2 overflow-y-auto border-r border-slate-800/50 p-8 space-y-12 custom-scrollbar">
          {/* Personal Info */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-violet-glow" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Biological Identification</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input 
                defaultValue={cv.personal.name}
                onChange={(e) => debouncedUpdatePersonal({ name: e.target.value })}
                placeholder="Full Name" 
                className="bg-obsidian-800/50 border border-slate-700/30 p-3 rounded-lg text-sm text-white focus:border-violet-glow/50 outline-none" 
              />
              <input 
                defaultValue={cv.personal.email}
                onChange={(e) => debouncedUpdatePersonal({ email: e.target.value })}
                placeholder="Email Identity" 
                className="bg-obsidian-800/50 border border-slate-700/30 p-3 rounded-lg text-sm text-white focus:border-violet-glow/50 outline-none" 
              />
              <textarea 
                defaultValue={cv.personal.summary}
                onChange={(e) => debouncedUpdatePersonal({ summary: e.target.value })}
                placeholder="Professional Signal (Summary)..." 
                className="col-span-2 bg-obsidian-800/50 border border-slate-700/30 p-3 rounded-lg text-sm text-white h-24 focus:border-violet-glow/50 outline-none resize-none overflow-hidden" 
              />
              <button 
                onClick={() => handlePolish('summary', cv.personal.summary)}
                disabled={!hasGemini && !hasAnthropic}
                className="col-span-2 flex items-center justify-center gap-2 text-[10px] uppercase font-black text-violet-glow hover:text-white transition-opacity disabled:opacity-20"
              >
                {!hasAnthropic && hasGemini && <span className="text-slate-500 font-normal mr-2">[Gemini Fallback Active]</span>}
                <Wand2 className="w-3 h-3" /> AI Refine Summary
              </button>
            </div>
          </section>

          {/* Experience */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-violet-glow" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Career Trajectory</h2>
              </div>
              <button 
                onClick={() => dispatch(addExperience())}
                className="text-[10px] font-black underline text-slate-500 hover:text-violet-glow"
              >+ ADD ENTRY</button>
            </div>
            
            <div className="space-y-6">
              {cv.experience.map((exp) => (
                <div key={exp.id} className="bg-obsidian-800/30 border border-slate-700/20 p-6 rounded-xl relative group">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input 
                      defaultValue={exp.role}
                      onChange={(e) => debouncedUpdateExperience(exp.id, { role: e.target.value })}
                      placeholder="Role" 
                      className="bg-obsidian-900 border border-slate-700/30 p-2 rounded text-sm text-white" 
                    />
                    <input 
                      defaultValue={exp.company}
                      onChange={(e) => debouncedUpdateExperience(exp.id, { company: e.target.value })}
                      placeholder="Company" 
                      className="bg-obsidian-900 border border-slate-700/30 p-2 rounded text-sm text-white" 
                    />
                    <textarea 
                      defaultValue={exp.bullets}
                      onChange={(e) => debouncedUpdateExperience(exp.id, { bullets: e.target.value })}
                      placeholder="Impact Statements (Bullet points)..." 
                      className="col-span-2 bg-obsidian-900 border border-slate-700/30 p-2 rounded text-xs text-slate-300 h-32 outline-none focus:border-violet-glow/40 transition-all font-mono" 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => handlePolish(exp.id, exp.bullets)}
                      disabled={!hasGemini && !hasAnthropic}
                      className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400 hover:text-violet-glow disabled:opacity-20 transition-all"
                    >
                      <Sparkles className="w-3 h-3 text-violet-glow" /> 
                      Tailor this section
                      {!hasAnthropic && <span className="text-[8px] text-slate-600 font-normal ml-2 tracking-tighter">(Gemini Fallback)</span>}
                    </button>
                    <button 
                      onClick={() => dispatch(removeExperience(exp.id))}
                      className="text-[10px] text-red-900/50 hover:text-red-500 font-bold uppercase transition-colors"
                    >Terminate Entry</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-5 h-5 text-violet-glow" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Technical Arsenal</h2>
            </div>
            <input 
              defaultValue={cv.skills.join(', ')}
              onChange={(e) => dispatch(updateSkills(e.target.value.split(',').map(s => s.trim())))}
              placeholder="React, TypeScript, AWS, Core Principles..." 
              className="w-full bg-obsidian-800/50 border border-slate-700/30 p-3 rounded-lg text-sm text-white focus:border-violet-glow/50 outline-none" 
            />
          </section>
        </div>

        {/* Right: PDF Preview */}
        <div className="w-1/2 bg-slate-100/5 p-4 flex flex-col">
          <div className="flex-1 rounded-xl overflow-hidden border border-slate-800/50 shadow-2xl relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-violet-glow/20 to-transparent z-10"></div>
            <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: 'none' }}>
              {pdfDoc}
            </PDFViewer>
          </div>
        </div>

        {/* AI Tailoring Panel */}
        {isAIPanelOpen && (
          <div className="fixed top-16 right-0 w-96 h-[calc(100vh-64px)] bg-obsidian-900 border-l border-slate-700/50 shadow-2xl z-20 flex flex-col p-6 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-violet-glow">Tailoring Intelligence</h3>
              <button 
                onClick={() => setIsAIPanelOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Job Description</label>
                <textarea 
                  value={cv.targetJD}
                  onChange={(e) => dispatch(setTargetJD(e.target.value))}
                  placeholder="Paste JD here to scan for gaps..."
                  className="w-full h-48 bg-obsidian-800 border border-slate-700/30 rounded-lg p-3 text-xs text-white outline-none focus:border-violet-glow/40"
                />
              </div>

              <button 
                disabled={aiLoading || !cv.targetJD || isRateLimited}
                onClick={handleAiTailor}
                className="w-full flex items-center justify-center gap-2 bg-violet-glow/10 text-violet-glow border border-violet-glow/30 py-3 rounded-lg font-black text-[10px] uppercase hover:bg-violet-glow hover:text-obsidian-900 transition-all disabled:opacity-20"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                {aiLoading ? 'Synthesizing...' : 'Calculate Gap Analysis'}
              </button>

              {analysis && (
                <div className="space-y-6 mt-8 animate-in fade-in duration-500">
                  <div className="p-4 bg-violet-glow/5 border border-violet-glow/20 rounded-xl">
                    <div className="text-[10px] font-black text-violet-glow uppercase mb-1">Match Potential</div>
                    <div className="text-3xl font-black text-white">{analysis.matchScore}%</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Identified Gaps</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.gaps.map((gap, i) => (
                        <span key={i} className="px-2 py-1 bg-red-900/20 text-red-400 text-[10px] font-bold rounded border border-red-900/30">{gap}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Preparation Strategy</div>
                    <p className="text-xs text-slate-400 italic leading-relaxed">{analysis.preppMode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MagicEditor;
