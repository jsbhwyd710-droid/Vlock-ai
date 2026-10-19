import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Gamepad2, 
  Code2, 
  Smartphone, 
  Gift, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Globe
} from 'lucide-react';
import { ActiveTab, AuthUser, UserSubscription } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface WelcomeBannerProps {
  currentUser: AuthUser | null;
  subscription: UserSubscription;
  onNavigateToTab: (tab: ActiveTab) => void;
  openUpgradeModal: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  currentUser,
  subscription,
  onNavigateToTab,
  openUpgradeModal,
}) => {
  const { isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(() => {
    try {
      const closed = localStorage.getItem('omnicraft_welcome_dismissed');
      return closed !== 'true';
    } catch {
      return true;
    }
  });

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('omnicraft_welcome_dismissed', 'true');
    } catch {}
  };

  if (!isVisible) return null;

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Creator';

  return (
    <div 
      className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border-b border-indigo-500/30 p-4 sm:p-5 relative overflow-hidden text-xs animate-in fade-in slide-in-from-top-3"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        {/* Welcome Greeting & Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                {isRTL ? `👋 مرحباً بك يا ${displayName} في منصة OmniCraft Studio!` : `👋 Welcome, ${displayName}, to OmniCraft Studio Platform!`}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                {subscription.plan.toUpperCase()} TIER
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {isRTL
                ? 'استوديو شامل ومتكامل لبناء ونشر الألعاب، وتطوير مواقع الويب وتطبيقات المتاجر بدون أي خبرة برمجية. يمكنك نشر أي تطبيق فوراً أو اللعب به بنقرة واحدة!'
                : 'Your complete AI creative workspace. Build, play, and publish full applications & games in minutes with zero coding required.'}
            </p>

            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 flex-wrap">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isRTL ? 'حساب موثق ومفعل' : 'Verified Real Account'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <Gift className="w-3.5 h-3.5" />
                <span>{isRTL ? 'كود الهدية: OMNI2026 (+10,000 نقطة)' : 'Gift Code: OMNI2026 (+10k credits)'}</span>
              </span>
              <span>•</span>
              <span className="font-mono text-cyan-300">
                {subscription.creditsRemaining} {isRTL ? 'نقطة متاحة' : 'Credits Available'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar shrink-0 justify-end">
          <button
            onClick={() => onNavigateToTab('games')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-700 hover:border-indigo-400 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isRTL ? 'استوديو الألعاب' : 'Game Studio'}</span>
          </button>

          <button
            onClick={() => onNavigateToTab('builder')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-700 hover:border-indigo-400 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isRTL ? 'بناء التطبيقات' : 'App Builder'}</span>
          </button>

          <button
            onClick={() => onNavigateToTab('giveaway')}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-black border border-amber-500/40 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRTL ? 'الجوائز والكودات 🎁' : 'Giveaways 🎁'}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="إخفاء رسالة الترحيب"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
