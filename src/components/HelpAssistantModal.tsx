import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Video, 
  Image as ImageIcon, 
  MessageSquare, 
  CreditCard, 
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Mail
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HelpAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab, initialPrompt?: string) => void;
}

export const HelpAssistantModal: React.FC<HelpAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string>('website');
  const [userIdea, setUserIdea] = useState<string>('');

  if (!isOpen) return null;

  const quickGoals = [
    {
      id: 'website',
      tab: 'builder' as ActiveTab,
      title: 'Build a Website / Web App',
      icon: Globe,
      desc: 'Create an interactive website, SaaS landing page, or store, then get a 100% FREE custom URL!',
      examplePrompt: 'Modern SaaS landing page for an AI accounting tool with dark mode, interactive pricing calculator, and testimonial slider',
    },
    {
      id: 'store',
      tab: 'stores' as ActiveTab,
      title: 'Publish to Google Play & App Store',
      icon: Smartphone,
      desc: 'Turn your idea into ready-to-publish Android (.aab/.apk) & iOS (.ipa) bundles with metadata.',
      examplePrompt: 'A fitness workout planner and calorie tracker mobile app with daily streak counter and clean minimal UI',
    },
    {
      id: 'video',
      tab: 'video' as ActiveTab,
      title: 'Create AI Videos & Storyboards',
      icon: Video,
      desc: 'Generate viral promo videos, motion scenes, voiceover narrations, and cinematic camera shots.',
      examplePrompt: 'Cinematic 30-second teaser trailer for a futuristic electric sports car gliding through neon rainy cityscapes',
    },
    {
      id: 'photo',
      tab: 'photo' as ActiveTab,
      title: 'Generate 8K AI Photos & Art',
      icon: ImageIcon,
      desc: 'Create photorealistic portraits, commercial product photography, landscapes, and 3D renders.',
      examplePrompt: 'Luxury espresso coffee machine in a minimalist marble kitchen, morning sunlight streaming through window, 85mm lens',
    },
    {
      id: 'chat',
      tab: 'chat' as ActiveTab,
      title: 'Chat with Gemini AI',
      icon: MessageSquare,
      desc: 'Ask anything, write complex code, get business strategy, and receive instant expert answers.',
      examplePrompt: 'Give me a step-by-step launch checklist for my startup and review my technical architecture',
    },
    {
      id: 'gmail',
      tab: 'gmail' as ActiveTab,
      title: 'Gmail Workspace Hub',
      icon: Mail,
      desc: 'Read, search, organize, and compose emails with official Google Workspace security and AI smart drafts.',
      examplePrompt: '',
    },
    {
      id: 'sandbox',
      tab: 'builder' as ActiveTab,
      title: 'Work with "The Fake One" Sandbox',
      icon: Lightbulb,
      desc: 'Test updates, break components, and experiment safely in the sandbox replica without affecting the live app.',
      examplePrompt: 'A futuristic interactive game and dashboard for the sandbox playground',
    },
    {
      id: 'pricing',
      tab: 'pricing' as ActiveTab,
      title: 'Real Card Subscriptions',
      icon: CreditCard,
      desc: 'Subscribe with a real Visa, Mastercard, or major card. Fast bank authorization with 256-bit encryption.',
      examplePrompt: '',
    },
  ];

  const currentGoalData = quickGoals.find((g) => g.id === selectedGoal) || quickGoals[0];

  const handleLaunch = () => {
    const finalPrompt = userIdea.trim() || currentGoalData.examplePrompt;
    onNavigate(currentGoalData.tab, finalPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                OmniCraft AI Assistant For Anyone
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Beginner Friendly
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                You don't need any coding or design skills. Just tell AI what you want to create!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step 1: Goal Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
              Step 1: Choose What You Want To Build
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {quickGoals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold mb-1">{goal.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{goal.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: What is your idea? */}
          {currentGoalData.id !== 'pricing' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Step 2: Describe Your Idea in Plain English
                </label>
                <button
                  onClick={() => setUserIdea(currentGoalData.examplePrompt)}
                  className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  Use Example Idea
                </button>
              </div>

              <textarea
                value={userIdea}
                onChange={(e) => setUserIdea(e.target.value)}
                placeholder={currentGoalData.examplePrompt}
                rows={3}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          {/* Quick FAQ info box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              How OmniCraft AI handles everything for you:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <strong>Free Custom URLs:</strong> Instant subdomain or connect your own domain without hosting fees.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <strong>Store Deployment:</strong> Automatically generates icons, manifests, and .apk/.aab/.ipa files.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <strong>Media Studio:</strong> AI video director and 8K photo synthesis ready in seconds.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <strong>Gemini Power:</strong> Built with state-of-the-art Google Gemini AI intelligence.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLaunch}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all"
          >
            <span>Launch with AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
