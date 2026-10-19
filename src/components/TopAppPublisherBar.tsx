import React, { useState } from 'react';
import { 
  Rocket, 
  Gamepad2, 
  Smartphone, 
  Globe, 
  Play, 
  Sparkles, 
  ChevronDown, 
  Check, 
  ExternalLink, 
  Plus, 
  Layers, 
  Share2, 
  Copy, 
  CheckCircle2, 
  X,
  Code2,
  Wand2,
  Sliders,
  ShieldCheck,
  Search
} from 'lucide-react';
import { ActiveTab, WebProject } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  generatePubgBattleRoyaleHtml, 
  generateSpaceShooterHtml, 
  generateCyberRunnerHtml, 
  generateBrickBreakerHtml, 
  generateFlappyBirdHtml,
  GameSettings
} from '../services/gameEngine';
import { READY_INTERACTIVE_APPS } from '../services/readyInteractiveApps';

export interface PublishedAppItem {
  id: string;
  name: string;
  category: 'game' | 'app';
  icon: string;
  subdomain: string;
  publishedUrl: string;
  description: string;
  version: string;
  badge: string;
  getHtml: () => string;
}

const DEFAULT_GAME_SETTINGS: GameSettings = {
  playerSpeed: 3,
  difficulty: 'normal',
  soundEnabled: true,
  lives: 3,
  gravity: 0.5,
  enemySpeed: 2,
  themeColor: '#6366f1',
};

const DEFAULT_GAMES_APPS: PublishedAppItem[] = [
  {
    id: 'pubg-2d',
    name: 'PUBG Battle Royale 2D',
    category: 'game',
    icon: '🪂',
    subdomain: 'pubg-royale',
    publishedUrl: 'https://pubg-royale.omnicraft.site',
    description: 'لعبة باتل رويال حماسية كاملة مع الأسلحة، الدروب الجوي، زون الأمان، والمنافسين الأذكياء.',
    version: 'v2.4.0',
    badge: 'TOP GAME 🎮',
    getHtml: () => generatePubgBattleRoyaleHtml('PUBG Battle Royale 2D', DEFAULT_GAME_SETTINGS),
  },
  {
    id: 'space-fighter',
    name: 'Space Galaxy Fighter',
    category: 'game',
    icon: '🚀',
    subdomain: 'galaxy-fighter',
    publishedUrl: 'https://galaxy-fighter.omnicraft.site',
    description: 'لعبة معارك فضائية وحروب مجرات كلاسيكية مع ترقيات الدرع والمدافع الليزرية.',
    version: 'v1.8.0',
    badge: 'POPULAR ⭐',
    getHtml: () => generateSpaceShooterHtml('Space Galaxy Fighter', DEFAULT_GAME_SETTINGS),
  },
  {
    id: 'cyber-runner',
    name: 'Cyber Runner 2077',
    category: 'game',
    icon: '🏃',
    subdomain: 'cyber-runner',
    publishedUrl: 'https://cyber-runner.omnicraft.site',
    description: 'لعبة ركض سايبربانك ثلاثية الأبعاد بسرعة فائقة مع قفز وتفادي العوائق وتجميع النقاط.',
    version: 'v2.1.0',
    badge: 'FAST PACED ⚡',
    getHtml: () => generateCyberRunnerHtml('Cyber Runner 2077', DEFAULT_GAME_SETTINGS),
  },
  {
    id: 'brick-breaker',
    name: 'Neon Brick Breaker',
    category: 'game',
    icon: '🧱',
    subdomain: 'neon-bricks',
    publishedUrl: 'https://neon-bricks.omnicraft.site',
    description: 'لعبة تكسير الكرات النيون مع فيزياء ارتداد واقعية ومستويات متقدمة.',
    version: 'v1.5.0',
    badge: 'RETRO 👾',
    getHtml: () => generateBrickBreakerHtml('Neon Brick Breaker', DEFAULT_GAME_SETTINGS),
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Cyber Bird',
    category: 'game',
    icon: '🐦',
    subdomain: 'cyber-bird',
    publishedUrl: 'https://cyber-bird.omnicraft.site',
    description: 'لعبة الطائر الكلاسيكية بأسلوب سايبر نيون وتحدي الجاذبية والمواسير الصوتية.',
    version: 'v1.2.0',
    badge: 'ADDICTIVE 🎯',
    getHtml: () => generateFlappyBirdHtml('Flappy Cyber Bird', DEFAULT_GAME_SETTINGS),
  },
  {
    id: 'nexus-store',
    name: 'Nexus SaaS Store App',
    category: 'app',
    icon: '📱',
    subdomain: 'nexus-store',
    publishedUrl: 'https://nexus-store.omnicraft.site',
    description: 'تطبيق متجر تجاري إلكتروني متكامل مع سلة تسوق، فلترة المنتجات، وحساب الفاتورة.',
    version: 'v3.0.0',
    badge: 'E-COMMERCE 🛒',
    getHtml: () => READY_INTERACTIVE_APPS[0]?.htmlCode || '',
  },
  {
    id: 'kanban-task',
    name: 'Kanban Task Manager',
    category: 'app',
    icon: '💼',
    subdomain: 'task-flow',
    publishedUrl: 'https://task-flow.omnicraft.site',
    description: 'تطبيق تفاعلي لإدارة المهام والمشاريع بنظام كانبان وسحب وإفلات وحفظ تلقائي.',
    version: 'v2.2.0',
    badge: 'PRODUCTIVITY 📋',
    getHtml: () => READY_INTERACTIVE_APPS[1]?.htmlCode || '',
  },
  {
    id: 'crypto-finance',
    name: 'Crypto Finance Hub',
    category: 'app',
    icon: '📊',
    subdomain: 'finance-tracker',
    publishedUrl: 'https://finance-tracker.omnicraft.site',
    description: 'تطبيق مالي لحساب المصاريف والأرباح وتتبع أسعار العملات مع رسوم بيانية حية.',
    version: 'v2.5.0',
    badge: 'FINANCE 💎',
    getHtml: () => READY_INTERACTIVE_APPS[2]?.htmlCode || '',
  },
];

interface TopAppPublisherBarProps {
  onSelectAppToPlay?: (app: PublishedAppItem) => void;
  onSelectAppToPublish?: (app: PublishedAppItem) => void;
  onOpenUpdateModal?: () => void;
  onNavigateToTab?: (tab: ActiveTab) => void;
}

export const TopAppPublisherBar: React.FC<TopAppPublisherBarProps> = ({
  onSelectAppToPlay,
  onSelectAppToPublish,
  onOpenUpdateModal,
  onNavigateToTab,
}) => {
  const { isRTL } = useLanguage();
  const [selectedApp, setSelectedApp] = useState<PublishedAppItem>(DEFAULT_GAMES_APPS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customSubdomainInput, setCustomSubdomainInput] = useState(selectedApp.subdomain);

  const handleSelectApp = (app: PublishedAppItem) => {
    setSelectedApp(app);
    setCustomSubdomainInput(app.subdomain);
    setIsDropdownOpen(false);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(selectedApp.publishedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenPlay = () => {
    if (onSelectAppToPlay) {
      onSelectAppToPlay(selectedApp);
    }
    setIsPlayModalOpen(true);
  };

  const handleOpenPublish = () => {
    if (onSelectAppToPublish) {
      onSelectAppToPublish(selectedApp);
    }
    setIsPublishModalOpen(true);
  };

  return (
    <div 
      className="w-full bg-slate-900/95 border-b border-indigo-500/30 backdrop-blur-md z-30 py-2 px-3 sm:px-6 relative text-xs"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left Section: Active App & Selector */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shrink-0 font-bold">
            <Rocket className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline">{isRTL ? 'التطبيق النشط:' : 'Active App:'}</span>
          </div>

          {/* Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              <span className="text-base">{selectedApp.icon}</span>
              <span className="font-extrabold max-w-[130px] sm:max-w-[200px] truncate">{selectedApp.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                {selectedApp.badge}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full mt-1.5 left-0 rtl:left-auto rtl:right-0 w-72 sm:w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 flex items-center justify-between">
                  <span>{isRTL ? 'اختر التطبيق أو اللعبة المنشورة:' : 'Choose Published App or Game:'}</span>
                  <span className="text-emerald-400 font-mono">8 Available</span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                  {DEFAULT_GAMES_APPS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectApp(item)}
                      className={`w-full p-2 rounded-xl flex items-center justify-between text-left rtl:text-right transition-all cursor-pointer ${
                        selectedApp.id === item.id
                          ? 'bg-indigo-600/30 text-white border border-indigo-500/50'
                          : 'hover:bg-slate-900 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-lg shrink-0">{item.icon}</span>
                        <div className="overflow-hidden">
                          <div className="font-bold text-xs truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">{item.subdomain}.omnicraft.site</div>
                        </div>
                      </div>
                      {selectedApp.id === item.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="pt-1.5 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (onNavigateToTab) onNavigateToTab('builder');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'اصنع تطبيقك الخاص الجديد الآن 🪄' : 'Build Your Own New App Now 🪄'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Live Link Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="truncate max-w-[180px]">{selectedApp.subdomain}.omnicraft.site</span>
          </div>
        </div>

        {/* Right Section: Action Buttons (Publish, Play, Edit) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Play / Launch Button */}
          <button
            onClick={handleOpenPlay}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            title="تجربة وتشغيل اللعبة أو التطبيق فوراً"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRTL ? 'تشغيل وتجربة ▶️' : 'Play / Launch ▶️'}</span>
          </button>

          {/* Dedicated Publish Button Requested By User ("اضيف زر عشان تنشر هذاك التطبيق وتختار") */}
          <button
            onClick={handleOpenPublish}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-xs transition-all shadow-md shadow-indigo-600/30 cursor-pointer hover:scale-105 active:scale-95"
            title="نشر هذا التطبيق على الإنترنت أو في متجر جوجل بلاي"
          >
            <Rocket className="w-3.5 h-3.5 fill-current text-amber-300" />
            <span>{isRTL ? 'انشر هذا التطبيق 🚀' : 'Publish This App 🚀'}</span>
          </button>

          {/* Quick Copy Link Button */}
          <button
            onClick={handleCopyUrl}
            className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer shrink-0"
            title="نسخ رابط التطبيق المنشور"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ======================================================= */}
      {/* 1. Dedicated App Publishing Modal */}
      {/* ======================================================= */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 relative">
            <button
              onClick={() => setIsPublishModalOpen(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <span className="text-3xl p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30">{selectedApp.icon}</span>
              <div>
                <h3 className="text-base font-black text-white">
                  {isRTL ? `نشر تطبيق: ${selectedApp.name}` : `Publish: ${selectedApp.name}`}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRTL ? 'اختر طريقة النشر المجانية الفورية لتطبيقك أو لعبتك' : 'Choose instant free publishing method for your app or game'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: Free Custom URL Subdomain */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 transition-all space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-xs">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>{isRTL ? '1. نشر فوري عبر رابط مجاني مدى الحياة' : '1. Free Custom Subdomain (Instant)'}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">مجاني 100%</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customSubdomainInput}
                    onChange={(e) => setCustomSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    placeholder="my-cool-game"
                  />
                  <span className="text-xs font-mono text-slate-400">.omnicraft.site</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-emerald-400 font-mono">
                    ✓ https://{customSubdomainInput || selectedApp.subdomain}.omnicraft.site
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://${customSubdomainInput || selectedApp.subdomain}.omnicraft.site`);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copiedLink ? (isRTL ? 'تم النسخ!' : 'Copied!') : (isRTL ? 'تأكيد الرابط' : 'Confirm URL')}
                  </button>
                </div>
              </div>

              {/* Option 2: Google Play Store Export */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500 transition-all flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white text-xs">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>{isRTL ? '2. حزمة متجر Google Play (.AAB / .APK)' : '2. Google Play Store Package (.AAB)'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isRTL ? 'تصدير حزمة أندرويد الموقعة مع شهادة النشر لرفعها في كونسول جوجل' : 'Signed Android App Bundle ready to upload to Play Console'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsPublishModalOpen(false);
                    if (onNavigateToTab) onNavigateToTab('stores');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 text-xs font-bold shrink-0 transition-all cursor-pointer"
                >
                  {isRTL ? 'تصدير للمتجر' : 'Export'}
                </button>
              </div>

              {/* Option 3: Google Search Indexing */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500 transition-all flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white text-xs">
                    <Search className="w-4 h-4 text-blue-400" />
                    <span>{isRTL ? '3. النشر في محرك بحث جوجل (Google Search)' : '3. Google Search Indexing'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isRTL ? 'أرشفة فورية لظهور تطبيقك عند البحث في جوجل بالاسم' : 'Instant SEO sitemap submission to appear on Google'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsPublishModalOpen(false);
                    if (onNavigateToTab) onNavigateToTab('domains');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/40 text-xs font-bold shrink-0 transition-all cursor-pointer"
                >
                  {isRTL ? 'أرشفة جوجل' : 'Index'}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setIsPublishModalOpen(false);
                alert(isRTL ? `🎉 تم نشر وتحديث رابط (${selectedApp.name}) بنجاح!` : `🎉 Successfully published ${selectedApp.name}!`);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              {isRTL ? 'تأكيد نشر التطبيق الآن مجاناً 🚀' : 'Confirm & Publish App Now 🚀'}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 2. Interactive Play / Launch Modal */}
      {/* ======================================================= */}
      {isPlayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-2 sm:p-6">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 mb-2 shadow-xl">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{selectedApp.icon}</span>
              <div>
                <div className="font-extrabold text-sm text-white">{selectedApp.name}</div>
                <div className="text-[11px] text-emerald-400 font-mono">{selectedApp.publishedUrl}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsPlayModalOpen(false);
                  setIsPublishModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>{isRTL ? 'نشر اللعبة' : 'Publish'}</span>
              </button>

              <button
                onClick={() => setIsPlayModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <iframe
              srcDoc={selectedApp.getHtml()}
              title={selectedApp.name}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; gamepad; focus"
              sandbox="allow-scripts allow-same-origin allow-modals"
            />
          </div>
        </div>
      )}
    </div>
  );
};
