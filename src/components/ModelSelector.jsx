import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPreferredModel } from '../store/slices/configSlice';
import { Cpu, Zap, Brain, Sparkles } from 'lucide-react';

const ModelSelector = () => {
  const dispatch = useDispatch();
  const { preferredModel, geminiKey, anthropicKey } = useSelector((state) => state.config);

  const models = [
    { id: 'gemini-2.5-flash', name: 'Gemini Flash', icon: Zap, key: geminiKey, provider: 'Google' },
    { id: 'gemini-2.5-pro', name: 'Gemini Pro', icon: Brain, key: geminiKey, provider: 'Google' },
    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', icon: Sparkles, key: geminiKey, provider: 'Google' },
    { id: 'claude-3-opus-20240229', name: 'Claude Opus', icon: Sparkles, key: anthropicKey, provider: 'Anthropic' },
  ];

  return (
    <div className="flex bg-obsidian-900/60 p-1 rounded-xl border border-slate-700/30 backdrop-blur-sm self-end">
      {models.map((model) => {
        const Icon = model.icon;
        const isActive = preferredModel === model.id;
        const hasKey = !!model.key;

        return (
          <button
            key={model.id}
            onClick={() => dispatch(setPreferredModel(model.id))}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              isActive 
                ? 'bg-violet-glow text-obsidian-900 shadow-lg shadow-violet-glow/20' 
                : 'text-slate-500 hover:text-slate-300'
            } ${!hasKey ? 'opacity-50 grayscale' : ''}`}
            title={!hasKey ? `Missing ${model.provider} API Key` : `${model.name} Active`}
          >
            <Icon className="w-3 h-3" />
            <span className="hidden sm:inline">{model.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ModelSelector;
