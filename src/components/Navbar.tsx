import React, { useState } from 'react';
import { 
  Sparkles, 
  Globe, 
  Smartphone, 
  Video, 
  Image as ImageIcon, 
  MessageSquare, 
  CreditCard, 
  HelpCircle, 
  Zap, 
  Code2,
  Gamepad2,
  UserCheck,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
  RefreshCw,
  Search,
  Mail,
  Gift,
  History,
  Wand2
} from 'lucide-react';
import { ActiveTab, UserSubscription, AuthUser } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelectorButton } from './LanguageSelectorButton';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  subscription: UserSubscription;
  openUpgradeModal: () => void;
  openHelpModal: () => void;
  openUpdateStudio?: () => void;
  openGooglePublishModal?: () => void;
  isSandboxActive?: boolean;
  onToggleSandbox?: (isFake: boolean) => void;
  guestName?: string;
  onUpdateGuestName?: (name: string) => void;
  currentUser?: AuthUser | null;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  subscription,
  openUpgradeModal,
  openHelpModal,
  openUpdateStudio,
  openGooglePublishModal,
  isSandboxActive = false,
  onToggleSandbox,
  guestName = 'Guest Creator',
  onUpdateGuestName,
  currentUser = null,
  openAuthModal,
  onSignOut,
}) => {
  const { t, isRTL } = useLanguage();
  const [showGuestMenu, setShowGuestMenu] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [tempGuestName, setTempGuestName] = useState<string>(guestName);

  const navItems = [
    { id: 'games' as ActiveTab, label: t('nav_games', 'Game Studio'), icon: Gamepad2, badge: 'GAMES' },
    { id: 'builder' as ActiveTab, label: t('nav_builder', 'Web & App Builder'), icon: Code2 },
    { id: 'chat' as ActiveTab, label: isRTL ? 'شات الذكاء 💬' : 'AI Chat 💬', icon: MessageSquare, badge: 'AI' },
    { id: 'ai-connect' as ActiveTab, label: isRTL ? 'ربط الذكاء 🤖' : 'AI Connect 🤖', icon: Wand2, badge: 'API' },
    { id: 'history' as ActiveTab, label: isRTL ? 'سجل البناء 📜' : 'Build History 📜', icon: History },
    { id: 'video' as ActiveTab, label: t('nav_video', 'AI Video'), icon: Video },
    { id: 'photo' as ActiveTab, label: t('nav_photo', 'AI Photo'), icon: ImageIcon },
    { id: 'stores' as ActiveTab, label: t('nav_stores', 'Play & App Store'), icon: Smartphone },
    { id: 'giveaway' as ActiveTab, label: isRTL ? 'الجوائز والكودات 🎁' : 'Giveaways & Codes 🎁', icon: Gift, badge: 'GIFT' },
    { id: 'gmail' as ActiveTab, label: t('nav_gmail', 'Gmail Hub'), icon: Mail, badge: 'GMAIL' },
    { id: 'domains' as ActiveTab, label: t('nav_domains', 'Free Custom URLs'), icon: Globe, badge: 'FREE' },
    { id: 'pricing' as ActiveTab, label: t('nav_pricing', 'Plans & Pricing'), icon: CreditCard, isHighlight: true },
  ];

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateGuestName && tempGuestName.trim()) {
      onUpdateGuestName(tempGuestName.trim());
      setShowGuestMenu(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('games')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  Vlock<span className="text-cyan-400"> AI</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Vlock AI • Apps • Websites • Games</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions & Guest Workspace Hub */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dedicated Language Selector Button */}
            <LanguageSelectorButton variant="navbar" />

            {/* Quick Google Publish / Indexing Button */}
            {openGooglePublishModal && (
              <button
                onClick={openGooglePublishModal}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 border border-blue-500/40 text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-blue-400"
                title="نشر اللعبة أو التطبيق في بحث جوجل (Google Search)"
              >
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden xl:inline">{t('btn_publish_google', 'نشر في جوجل 🔍')}</span>
              </button>
            )}

            {/* Dedicated UPDATE Button */}
            {openUpdateStudio && (
              <button
                onClick={openUpdateStudio}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-extrabold text-xs border border-emerald-400/50 shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="UPDATE - تحديث اللعبة والتطبيق بقرارك 100%"
              >
                <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '4s' }} />
                <span>{t('btn_update', 'UPDATE')}</span>
              </button>
            )}

            {/* Guest Persona & Fake Sandbox Hub */}
            <div className="relative">
              <button
                onClick={() => setShowGuestMenu(!showGuestMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all shadow-sm cursor-pointer"
                title="Guest Mode & Sandbox Settings"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="hidden sm:inline font-mono text-[11px]">{guestName}</span>
                {isSandboxActive ? (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                    THE FAKE ONE
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                    LIVE
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Guest Menu Popover */}
              {showGuestMenu && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-3.5 text-xs" dir={isRTL ? 'rtl' : 'ltr'}>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Collaborator Workspace</h4>
                        <p className="text-[10px] text-blue-400">Public & Sandbox Studio</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {subscription.isPaid ? 'Subscribed' : 'Starter'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Collaborate on the Live App and "The Fake One" sandbox. Subscribe with a real Visa card to unlock unlimited AI builds and exports.
                  </p>

                  {/* Switch Workspace */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Active Workspace Environment:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          onToggleSandbox?.(false);
                          setShowGuestMenu(false);
                        }}
                        className={`p-2 rounded-xl text-left rtl:text-right border transition-all cursor-pointer ${
                          !isSandboxActive
                            ? 'bg-emerald-600/20 border-emerald-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-emerald-400" />
                          <span>Live App</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Production project</span>
                      </button>

                      <button
                        onClick={() => {
                          onToggleSandbox?.(true);
                          setShowGuestMenu(false);
                        }}
                        className={`p-2 rounded-xl text-left rtl:text-right border transition-all cursor-pointer ${
                          isSandboxActive
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <FlaskConical className="w-3 h-3 text-amber-400" />
                          <span>The Fake One</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Sandbox playground</span>
                      </button>
                    </div>
                  </div>

                  {/* Change Persona Name */}
                  <form onSubmit={handleSaveName} className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-slate-400 block">
                      Guest Persona Name:
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={tempGuestName}
                        onChange={(e) => setTempGuestName(e.target.value)}
                        placeholder="Guest Creator"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        Set
                      </button>
                    </div>
                  </form>

                  {/* Policy Footer */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-blue-400">
                      <ShieldCheck className="w-3 h-3" /> Real Visa Card Verified
                    </span>
                    <button
                      onClick={() => {
                        setShowGuestMenu(false);
                        openUpgradeModal();
                      }}
                      className="text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      Subscribe with Card →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help Button */}
            <button
              onClick={openHelpModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-all cursor-pointer"
              title="AI Guide & Help for Anyone"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Help</span>
            </button>

            {/* Credits Counter (Unlimited/Auto-refilling) */}
            <div 
              onClick={openUpgradeModal}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 font-mono cursor-pointer hover:border-slate-700"
              title="Credits (Auto-refilling)"
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>{subscription.plan !== 'free' ? 'Unlimited' : `${subscription.creditsRemaining}/${subscription.maxCredits}`}</span>
            </div>

            {/* User Plan Badge */}
            <div
              onClick={openUpgradeModal}
              className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                subscription.plan === 'ultra'
                  ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/40 hover:border-purple-400'
                  : subscription.plan === 'pro'
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-500/40 hover:border-blue-400'
                  : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${subscription.plan !== 'free' ? 'bg-blue-400 animate-pulse' : 'bg-slate-400'}`}></span>
              <span className="uppercase text-[11px] tracking-wider">
                {subscription.plan === 'ultra' 
                  ? 'Studio Ultra' 
                  : subscription.plan === 'pro' 
                  ? `Pro • ${subscription.cardBrand || 'Card'}` 
                  : 'Starter Tier'}
              </span>
            </div>

            {/* Upgrade CTA Button ("زر الاشتراكي") */}
            {subscription.plan === 'free' && (
              <button
                onClick={openUpgradeModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer hover:scale-102"
              >
                <CreditCard className="w-3.5 h-3.5 text-blue-200" />
                <span>{isRTL ? 'الاشتراك (Visa)' : 'Subscribe (Visa)'}</span>
              </button>
            )}

            {/* Authentication Buttons / User Account Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      className="w-6 h-6 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                      {(currentUser.displayName || currentUser.email || 'U')[0]}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate hidden md:inline">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* User Profile Popover */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-3 text-xs" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="border-b border-slate-800 pb-2.5 px-1">
                      <p className="font-bold text-white truncate">{currentUser.displayName || 'Omni Creator'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Signed in via Firebase</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab('gmail');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left rtl:text-right cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-red-400" />
                        <span>Gmail Studio Hub</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab('pricing');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left rtl:text-right cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Subscription & Plan</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab('domains');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left rtl:text-right cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        <span>My Clean Domains (.com)</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-2 px-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onSignOut();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-left rtl:text-right font-medium cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-400" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-800/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-900/60'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
