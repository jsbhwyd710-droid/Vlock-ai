import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  RotateCcw, 
  Play, 
  Code2, 
  Download, 
  Trash2, 
  Eye, 
  Plus, 
  Sparkles, 
  Layers, 
  Check, 
  X, 
  ExternalLink,
  Copy,
  Gamepad2,
  Video,
  Image as ImageIcon,
  Smartphone,
  Calendar,
  Cpu
} from 'lucide-react';
import { ActiveTab, BuildHistoryRecord, WebProject } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { generatePubgBattleRoyaleHtml, generateSpaceShooterHtml, generateCyberRunnerHtml } from '../services/gameEngine';
import { READY_INTERACTIVE_APPS } from '../services/readyInteractiveApps';

const INITIAL_HISTORY: BuildHistoryRecord[] = [
  {
    id: 'build_pubg_v2',
    title: 'PUBG Battle Royale 2D Full Game',
    type: 'game',
    timestamp: 'منذ ساعتين • 2 hours ago',
    version: 'v2.4.0',
    prompt: 'Build a top-down battle royale game with 15 AI bots, safe zone shrinking, air drops, weapon pickups, and full physics canvas.',
    modelEngine: 'Gemini 9 Ultra + Game Synth Engine',
    status: 'published',
    previewUrl: 'https://pubg-royale.omnicraft.site',
    fileSize: '48.2 KB',
    htmlContent: generatePubgBattleRoyaleHtml('PUBG Battle Royale 2D', {
      playerSpeed: 3,
      difficulty: 'normal',
      soundEnabled: true,
      lives: 3,
      gravity: 0.5,
      enemySpeed: 2,
      themeColor: '#6366f1',
    }),
  },
  {
    id: 'build_space_v1',
    title: 'Space Galaxy Fighter Arcade',
    type: 'game',
    timestamp: 'منذ 5 ساعات • 5 hours ago',
    version: 'v1.8.0',
    prompt: 'Create retro arcade galaxy fighter game with laser upgrades, shield powerups, boss wave, and high score board.',
    modelEngine: 'Claude 3.7 Sonnet Coding Engine',
    status: 'published',
    previewUrl: 'https://galaxy-fighter.omnicraft.site',
    fileSize: '36.5 KB',
    htmlContent: generateSpaceShooterHtml('Space Galaxy Fighter', {
      playerSpeed: 3,
      difficulty: 'normal',
      soundEnabled: true,
      lives: 3,
      gravity: 0.5,
      enemySpeed: 2,
      themeColor: '#6366f1',
    }),
  },
  {
    id: 'build_store_v3',
    title: 'Nexus SaaS E-Commerce Web App',
    type: 'app',
    timestamp: 'أمس • Yesterday',
    version: 'v3.0.0',
    prompt: 'Build modern high-conversion e-commerce storefront with live shopping cart, price filters, dark mode, and checkout drawer.',
    modelEngine: 'ChatGPT-4o + Tailwind CSS',
    status: 'published',
    previewUrl: 'https://nexus-store.omnicraft.site',
    fileSize: '62.8 KB',
    htmlContent: READY_INTERACTIVE_APPS[0]?.htmlCode || '',
  },
  {
    id: 'build_video_v1',
    title: 'Cinematic Cyberpunk City 4K 60FPS',
    type: 'video',
    timestamp: 'منذ يومين • 2 days ago',
    version: 'v1.0.0',
    prompt: 'Generate cinematic 4K 60fps drone shot flying through futuristic neon Tokyo under rain with reflections.',
    modelEngine: 'Google Veo 3 Ultra',
    status: 'published',
    previewUrl: 'https://veo3-cinema.omnicraft.site',
    fileSize: '18.4 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'build_photo_v1',
    title: 'Futuristic Mecha Samurai in Cherry Blossom 8K',
    type: 'photo',
    timestamp: 'منذ 3 أيام • 3 days ago',
    version: 'v1.2.0',
    prompt: 'Hyper-detailed 8K photographic portrait of mecha cyber samurai standing beneath blooming cherry trees in rain, volumetric lighting.',
    modelEngine: 'Nano Banana 4 8K Ultra',
    status: 'published',
    previewUrl: 'https://nano-photos.omnicraft.site',
    fileSize: '6.8 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
  },
];

interface BuildHistoryHubProps {
  onRestoreProject: (project: WebProject) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
}

export const BuildHistoryHub: React.FC<BuildHistoryHubProps> = ({
  onRestoreProject,
  onNavigateToTab,
}) => {
  const { isRTL } = useLanguage();
  const [historyItems, setHistoryItems] = useState<BuildHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('omnicraft_build_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_HISTORY;
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'app' | 'game' | 'video' | 'photo'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<BuildHistoryRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('omnicraft_build_history', JSON.stringify(historyItems));
    } catch {}
  }, [historyItems]);

  const filteredItems = historyItems.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.modelEngine && item.modelEngine.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCopyCode = (item: BuildHistoryRecord) => {
    if (item.htmlContent) {
      navigator.clipboard.writeText(item.htmlContent);
      setCopiedId(item.id);
      setNotification(isRTL ? 'تم نسخ كود المشروع بنجاح!' : 'Source code copied to clipboard!');
      setTimeout(() => {
        setCopiedId(null);
        setNotification(null);
      }, 2500);
    }
  };

  const handleDownloadCode = (item: BuildHistoryRecord) => {
    if (!item.htmlContent) return;
    const blob = new Blob([item.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${item.version}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setNotification(isRTL ? 'جاري تحميل ملف الكود...' : 'Downloading code file...');
    setTimeout(() => setNotification(null), 2500);
  };

  const handleRestore = (item: BuildHistoryRecord) => {
    if (item.htmlContent) {
      onRestoreProject({
        id: item.id,
        name: item.title,
        prompt: item.prompt,
        htmlCode: item.htmlContent,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        currentVersion: item.version,
        subdomain: item.id.replace(/[^a-z0-9]/g, '-'),
        publishedUrl: item.previewUrl || `https://${item.id}.omnicraft.site`,
        isPublished: true,
      });
      setNotification(isRTL ? `تم استعادة مشروع (${item.title}) إلى الاستوديو!` : `Restored ${item.title} to builder!`);
      setTimeout(() => {
        onNavigateToTab(item.type === 'game' ? 'games' : 'builder');
      }, 1000);
    }
  };

  const handleDelete = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    setNotification(isRTL ? 'تم حذف النسخة من السجل.' : 'Item removed from history.');
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <History className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {isRTL ? 'سجل البناء والمشاريع السابقة 📜' : 'Build History & Saved Projects 📜'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isRTL
                ? 'استعرض جميع النسخ والتطبيقات والألعاب والفيديوهات والصور التي تم إنشاؤها سابقاً. يمكنك استرجاع أي كود، تشغيله، أو تحميله بنقرة واحدة.'
                : 'Browse all previously generated applications, games, videos, and photos. Restore any build to the builder, play it, or export the source code instantly.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToTab('builder')}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isRTL ? 'بناء مشروع جديد' : 'New Build'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'all', label: isRTL ? 'الكل' : 'All', count: historyItems.length },
            { id: 'app', label: isRTL ? 'تطبيقات' : 'Apps', icon: Code2, count: historyItems.filter((i) => i.type === 'app').length },
            { id: 'game', label: isRTL ? 'ألعاب' : 'Games', icon: Gamepad2, count: historyItems.filter((i) => i.type === 'game').length },
            { id: 'video', label: isRTL ? 'فيديوهات' : 'Videos', icon: Video, count: historyItems.filter((i) => i.type === 'video').length },
            { id: 'photo', label: isRTL ? 'صور' : 'Photos', icon: ImageIcon, count: historyItems.filter((i) => i.type === 'photo').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute top-2.5 left-3 rtl:left-auto rtl:right-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'بحث في السجل والمشاريع...' : 'Search history...'}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid of Builds */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 space-y-3">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">
            {isRTL ? 'لا توجد مشاريع سابقة في هذا التصنيف' : 'No history found in this category'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {isRTL ? 'ابدأ بصناعة تطبيق أو لعبة جديدة لتسجيلها تلقائياً في سجل البناء.' : 'Start building an app or game to see your automatic history records here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 space-y-4 transition-all hover:shadow-xl flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-slate-800 text-indigo-400">
                      {item.type === 'game' ? (
                        <Gamepad2 className="w-4 h-4" />
                      ) : item.type === 'video' ? (
                        <Video className="w-4 h-4" />
                      ) : item.type === 'photo' ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <Code2 className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="font-mono text-emerald-400 font-bold">{item.version}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {item.status.toUpperCase()}
                  </span>
                </div>

                {/* Prompt & Description */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 font-mono text-[11px]">
                  "{item.prompt}"
                </p>

                {/* Engine & Details */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-indigo-400" />
                    <span className="truncate max-w-[170px]">{item.modelEngine || 'AI Model'}</span>
                  </div>
                  {item.fileSize && <span className="font-mono text-[10px] text-slate-500">{item.fileSize}</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1">
                  {item.htmlContent && (
                    <button
                      onClick={() => setSelectedPreview(item)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      title="تشغيل وتجربة فورية"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                    </button>
                  )}

                  {item.htmlContent && (
                    <button
                      onClick={() => handleCopyCode(item)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      title="نسخ كود المشروع"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {item.htmlContent && (
                    <button
                      onClick={() => handleDownloadCode(item)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      title="تحميل ملف الكود HTML"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="حذف من السجل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {item.htmlContent ? (
                  <button
                    onClick={() => handleRestore(item)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{isRTL ? 'استعادة' : 'Restore'}</span>
                  </button>
                ) : (
                  <a
                    href={item.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{isRTL ? 'عرض' : 'View'}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Full Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-2 sm:p-6">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 mb-2 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-sm text-white">{selectedPreview.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300">
                {selectedPreview.version}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleRestore(selectedPreview);
                  setSelectedPreview(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRTL ? 'استعادة في الاستوديو' : 'Restore to Studio'}</span>
              </button>

              <button
                onClick={() => setSelectedPreview(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <iframe
              srcDoc={selectedPreview.htmlContent}
              title={selectedPreview.title}
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
