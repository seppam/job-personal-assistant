import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { aiRouter } from '../services/aiRouter';
import { Target, Loader2, Compass, CheckCircle2 } from 'lucide-react';

const RoadmapView = () => {
  const profile = useSelector((state) => state.profile);
  const targetJD = useSelector((state) => state.cv.targetJD);
  
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!profile.currentRole || !targetJD) {
      setError('Please fill in your current role and ensure you have a Target JD set in the CV Lab.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await aiRouter.generateCareerRoadmap(profile, targetJD);
      setMilestones(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate roadmap. Please check your AI connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-obsidian-800/40 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-violet-glow" />
            Gemma 4 Career Roadmap
          </h2>
          <p className="text-sm text-slate-400 mt-1">Discover your critical skill gaps and how to bridge them.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 bg-violet-glow/20 hover:bg-violet-glow/30 text-violet-glow border border-violet-glow/50 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
          {loading ? 'Analyzing Gaps...' : 'Generate Roadmap'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {milestones.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-700 before:to-transparent"
        >
          {milestones.map((milestone, index) => (
            <motion.div key={index} variants={itemVariants} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-obsidian-900 bg-obsidian-800 text-slate-500 group-[.is-active]:text-violet-glow group-[.is-active]:border-violet-glow/30 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-700/50 bg-obsidian-900/50 shadow-xl group-[.is-active]:bg-obsidian-800/80 group-[.is-active]:border-violet-glow/20 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white text-base">{milestone.title}</h3>
                  <span className="text-xs font-mono text-violet-glow bg-violet-glow/10 px-2 py-0.5 rounded-full">
                    {milestone.estimatedWeeks} wks
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{milestone.description}</p>
                <div className="bg-obsidian-900 p-3 rounded-lg border border-slate-700/30">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Suggested Project</div>
                  <div className="text-sm text-slate-300">{milestone.suggestedProject}</div>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>
      )}
      
      {!loading && milestones.length === 0 && !error && (
        <div className="text-center p-12 border border-dashed border-slate-700/50 rounded-xl bg-obsidian-900/30">
          <Compass className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Ready to level up? Generate your roadmap to see your 5 core milestones.</p>
        </div>
      )}
    </div>
  );
};

export default RoadmapView;
