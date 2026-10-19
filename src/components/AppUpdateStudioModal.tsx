import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Layers, 
  History, 
  CheckCircle2, 
  Wand2, 
  Globe, 
  Lock, 
  Sun, 
  ShoppingCart, 
  MessageSquare, 
  Clock, 
  Activity, 
  Star, 
  Trello, 
  Mail, 
  ArrowRight, 
  RotateCcw, 
  Users, 
  ShieldCheck, 
  Loader2, 
  Share2, 
  Code,
  Sliders,
  Check
} from 'lucide-react';
import { FEATURE_MODULES, FeatureModule, injectFeatureIntoHtml } from '../services/featureModules';
import { api } from '../services/api';
import { AppUpdateRecord, WebProject } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AppUpdateStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: WebProject;
  onUpdateAppHtml: (newHtml: string, updateRecord: AppUpdateRecord) => void;
  guestName: string;
}

export const AppUpdateStudioModal: React.FC<AppUpdateStudioModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  onUpdateAppHtml,
  guestName,
}) => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ai-order' | 'modules' | 'custom' | 'manual' | 'history'>('ai-order');
  
  // AI Order State (القرار للشخص 100% والـ AI ينفذ فقط)
  const [aiUserCommand, setAiUserCommand] = useState('');
  const [isApplyingAiUpdate, setIsApplyingAiUpdate] = useState(false);

  // Custom Feature States
  const [customFeatureTitle, setCustomFeatureTitle] = useState('');
  const [customFeatureDesc, setCustomFeatureDesc] = useState('');
  const [placement, setPlacement] = useState<'top' | 'hero' | 'body-end' | 'floating'>('body-end');
  const [contributorName, setContributorName] = useState(guestName || 'Community Creator');
  const [isDeveloping, setIsDeveloping] = useState(false);

  // Manual Direct Code State (100% User Decisions, Zero AI Intervention)
  const [manualSnippetTitle, setManualSnippetTitle] = useState('');
  const [manualSnippet, setManualSnippet] = useState('');
  
  // Feedback & Success
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [justInjectedId, setJustInjectedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Execute Human-Decided AI Update Command
  const handleExecuteAiUpdate = async (commandToRun?: string) => {
    const cmd = commandToRun || aiUserCommand;
    if (!cmd.trim() || isApplyingAiUpdate) return;

    setIsApplyingAiUpdate(true);
    try {
      const res = await api.appUserUpdate({
        currentHtml: currentProject.htmlCode,
        userUpdateCommand: cmd.trim(),
        authorName: contributorName || guestName || 'Creator',
        authorType: 'owner',
      });

      const nextMinor = updates.length + 1;
      const newVersion = `v1.${nextMinor}.0`;

      const record: AppUpdateRecord = {
        id: `upd_${Date.now()}`,
        version: newVersion,
        title: cmd.trim().slice(0, 35),
        description: cmd.trim(),
        featureCategory: 'custom',
        author: contributorName || guestName || 'Creator',
        authorType: 'owner',
        appliedAt: new Date().toISOString(),
        diffSummary: res.diffSummary || `Applied human-directed update: "${cmd.trim()}"`,
        htmlCode: res.updatedHtml,
      };

      setUpdates([record, ...updates]);
      onUpdateAppHtml(res.updatedHtml, record);
      setAiUserCommand('');
      setSuccessNotice(`⚡ تم تنفيذ قرارك بنجاح! تم ترقية التطبيق إلى ${newVersion} (${record.title})`);
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setIsApplyingAiUpdate(false);
    }
  };

  // Local update history
  const [updates, setUpdates] = useState<AppUpdateRecord[]>(
    currentProject.updatesHistory && currentProject.updatesHistory.length > 0
      ? currentProject.updatesHistory
      : [
          {
            id: 'upd_init',
            version: 'v1.0.0',
            title: 'Initial App Architecture',
            description: 'Core responsive SaaS layout with Tailwind CSS and guest collaboration mode',
            featureCategory: 'ui',
            author: 'Founding Engineer',
            authorType: 'owner',
            appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            diffSummary: 'Created initial application structure and styling',
            htmlCode: currentProject.htmlCode,
          },
          {
            id: 'upd_domain',
            version: 'v1.1.0',
            title: 'White-Label .com Domain Support',
            description: 'Removed creator website name from live links and enabled .com suffix',
            featureCategory: 'tool',
            author: 'Guest Collaborator',
            authorType: 'guest',
            appliedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            diffSummary: 'Added support for clean .com custom domain URLs and live routing',
            htmlCode: currentProject.htmlCode,
          }
        ]
  );

  if (!isOpen) return null;

  const currentVersion = updates[0]?.version || currentProject.currentVersion || 'v1.1.0';

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lock': return <Lock className="w-4 h-4" />;
      case 'Sun': return <Sun className="w-4 h-4" />;
      case 'ShoppingCart': return <ShoppingCart className="w-4 h-4" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'Star': return <Star className="w-4 h-4" />;
      case 'Trello': return <Trello className="w-4 h-4" />;
      case 'Mail': return <Mail className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // 1-Click Feature Injection
  const handleInjectModule = async (module: FeatureModule) => {
    setJustInjectedId(module.id);
    const newHtml = injectFeatureIntoHtml(currentProject.htmlCode, module.codeSnippet, module.placement);
    
    const nextMinor = updates.length + 1;
    const newVersion = `v1.${nextMinor}.0`;
    
    const record: AppUpdateRecord = {
      id: `upd_${Date.now()}`,
      version: newVersion,
      title: `Added ${module.name}`,
      description: module.description,
      featureCategory: module.category,
      author: contributorName,
      authorType: 'contributor',
      appliedAt: new Date().toISOString(),
      diffSummary: `Injected pre-built module: ${module.name} into ${module.placement}`,
      htmlCode: newHtml,
    };

    // Sync with backend API
    api.submitAppUpdate(currentProject.subdomain, {
      title: record.title,
      description: record.description,
      featureCategory: record.featureCategory,
      author: record.author,
      authorType: record.authorType,
      htmlCode: newHtml,
    }).catch(console.warn);

    setUpdates([record, ...updates]);
    onUpdateAppHtml(newHtml, record);

    setSuccessNotice(`Feature "${module.name}" added to app! Version updated to ${newVersion}.`);
    setTimeout(() => {
      setJustInjectedId(null);
    }, 1500);
    setTimeout(() => {
      setSuccessNotice(null);
    }, 4000);
  };

  // AI-Driven Custom Feature Development
  const handleDevelopCustomFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFeatureTitle.trim()) return;

    setIsDeveloping(true);
    setSuccessNotice(null);

    try {
      const result = await api.developAndInjectFeature({
        currentHtml: currentProject.htmlCode,
        featureTitle: customFeatureTitle.trim(),
        featureDescription: customFeatureDesc.trim() || `Add interactive ${customFeatureTitle} feature with clean Tailwind CSS and JavaScript.`,
        authorName: contributorName,
        authorType: 'contributor',
        placement,
      });

      const nextMinor = updates.length + 1;
      const newVersion = `v1.${nextMinor}.0`;

      const record: AppUpdateRecord = {
        id: `upd_${Date.now()}`,
        version: newVersion,
        title: customFeatureTitle.trim(),
        description: customFeatureDesc.trim() || 'Custom developed feature component',
        featureCategory: 'custom',
        author: contributorName,
        authorType: 'contributor',
        appliedAt: new Date().toISOString(),
        diffSummary: result.diffSummary || `Developed & merged ${customFeatureTitle}`,
        htmlCode: result.enhancedHtml,
      };

      // Sync with backend API
      api.submitAppUpdate(currentProject.subdomain, {
        title: record.title,
        description: record.description,
        featureCategory: record.featureCategory,
        author: record.author,
        authorType: record.authorType,
        htmlCode: result.enhancedHtml,
      }).catch(console.warn);

      setUpdates([record, ...updates]);
      onUpdateAppHtml(result.enhancedHtml, record);

      setSuccessNotice(`Custom feature "${customFeatureTitle}" developed & added! Version ${newVersion} is now live.`);
      setCustomFeatureTitle('');
      setCustomFeatureDesc('');
    } catch (err: any) {
      console.error(err);
      alert('Failed to develop feature: ' + err.message);
    } finally {
      setIsDeveloping(false);
    }
  };

  // Rollback or Restore previous version
  const handleRestoreVersion = (record: AppUpdateRecord) => {
    if (confirm(`Restore application back to ${record.version} (${record.title})?`)) {
      onUpdateAppHtml(record.htmlCode, record);
      setSuccessNotice(`App rolled back to ${record.version}.`);
      setTimeout(() => setSuccessNotice(null), 3500);
    }
  };

  // Direct Manual Code Injection (100% User Decision)
  const handleInjectManualCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSnippet.trim()) return;

    const title = manualSnippetTitle.trim() || 'Custom User Feature';
    const nextMinor = updates.length + 1;
    const newVersion = `v1.${nextMinor}.0`;

    let newHtml = currentProject.htmlCode;
    if (placement === 'top') {
      newHtml = newHtml.replace('<body', `<body\n${manualSnippet}`);
    } else if (newHtml.includes('</body>')) {
      newHtml = newHtml.replace('</body>', `${manualSnippet}\n</body>`);
    } else {
      newHtml = `${newHtml}\n${manualSnippet}`;
    }

    const record: AppUpdateRecord = {
      id: `upd_${Date.now()}`,
      version: newVersion,
      title: title,
      description: 'Direct code authored manually by user (100% human decision)',
      featureCategory: 'custom',
      author: contributorName,
      authorType: 'contributor',
      appliedAt: new Date().toISOString(),
      diffSummary: `Manually added ${title} code`,
      htmlCode: newHtml,
    };

    setUpdates([record, ...updates]);
    onUpdateAppHtml(newHtml, record);
    setSuccessNotice(`Custom feature "${title}" applied directly! Version updated to ${newVersion}.`);
    setManualSnippet('');
    setManualSnippetTitle('');
    setActiveTab('history');
  };

  // Share collaboration link
  const handleCopyCollabLink = () => {
    const link = `${window.location.origin}/app/${currentProject.subdomain}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Glow decoration */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  App Feature & Update Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                  {currentVersion}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <Users className="w-2.5 h-2.5" /> Anyone Can Update
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Add updates, inject features, or develop anything further for <span className="text-white font-semibold">{currentProject.subdomain}.{currentProject.domainSuffix || 'com'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCollabLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              title="Share link so anyone can update this app"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Update Link'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Success Notification */}
        {successNotice && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/30 px-6 py-2.5 flex items-center gap-2.5 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Studio Subtabs */}
        <div className="px-6 pt-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('ai-order')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'ai-order'
                ? 'border-emerald-500 text-white bg-slate-800/60 rounded-t-xl'
                : 'border-transparent text-emerald-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>أمر الذكاء الاصطناعي (أنت تقرر وهو ينفذ)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
              قرارك 100%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'modules'
                ? 'border-indigo-500 text-white bg-slate-800/40 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>1-Click Feature Modules</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">
              {FEATURE_MODULES.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'custom'
                ? 'border-indigo-500 text-white bg-slate-800/40 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-pink-400" />
            <span>AI Code Synthesizer</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'manual'
                ? 'border-indigo-500 text-white bg-slate-800/40 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Direct Code (Manual)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'history'
                ? 'border-indigo-500 text-white bg-slate-800/40 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span>Updates Changelog ({updates.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 0: AI Human Order Update (الشخص يقرر والذكاء الاصطناعي ينفذ فقط) */}
          {activeTab === 'ai-order' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-indigo-950/70 to-slate-900 border-2 border-emerald-500/40 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
                      🤖⚡
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                        <span>أنت صاحب القرار 100% والذكاء الاصطناعي ينفذ أمرك بدقة</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          HUMAN-DECIDED
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300">
                        قول للذكاء الاصطناعي: "اعمل لي تحديث علشان..." وسيقوم الذكاء الاصطناعي بكتابة وتطبيق الكود فوراً دون أي اجتهاد عشوائي من طرفه.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 hidden sm:inline">
                    الإصدار الحالي: {currentVersion}
                  </span>
                </div>

                {/* Input Bar */}
                <div className="pt-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={aiUserCommand}
                      onChange={(e) => setAiUserCommand(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleExecuteAiUpdate()}
                      placeholder="اكتب أمر التحديث هنا (مثال: أضف نظام تسجيل دخول وحسابات، أضف شات محادثة، أضف متجر مع دفع فيزا...)"
                      className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
                    />
                    <button
                      onClick={() => handleExecuteAiUpdate()}
                      disabled={isApplyingAiUpdate || !aiUserCommand.trim()}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-white font-black text-xs shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shrink-0"
                    >
                      {isApplyingAiUpdate ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>الـ AI يبرمج تحديثك الآن...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-white animate-pulse" />
                          <span>تطبيق تحديثي بالذكاء الاصطناعي ⚡</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick 1-Click Update Ideas for the Person to Command */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    أفكار تحديث جاهزة يمكنك أن تأمر الذكاء الاصطناعي بتنفيذها بنقرة واحدة:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: '💬 إضافة شات محادثة ودعم فوري', cmd: 'أضف نافذة شات محادثة تفاعلية مع الذكاء الاصطناعي والدعم الفني في أسفل الصفحة' },
                      { label: '💳 متجر منتجات مع دفع بالفيزا كارد', cmd: 'أضف قسماً لمتجر المنتجات مع سلة تسوق وزر دفع ببطاقة الفيزا كارد' },
                      { label: '🔐 نظام تسجيل دخول وحسابات مستخدمين', cmd: 'أضف واجهة تسجيل دخول وإنشاء حساب مستخدم مع حماية وأمان' },
                      { label: '🌓 زر تبديل الوضع الليلي Dark Mode', cmd: 'أضف زر تبديل سلس بين الوضع الليلي والوضع الفاتح مع حفظ الاختيار' },
                      { label: '⭐ تقييمات وآراء العملاء 5 نجوم', cmd: 'أضف قسم شهادات وآراء العملاء مع تقييم 5 نجوم وعداد تفاعلي' },
                      { label: '📅 حجز مواعيد تفاعلي مع تقويم', cmd: 'أضف نظام حجز مواعيد تفاعلي مع اختيار اليوم والوقت وتأكيد الحجز' },
                      { label: '🎨 ألوان نيون سايبربانك وتصميم عصري', cmd: 'قم بتحديث التصميم بالكامل لألوان نيون سايبربانك مضيئة وتأثيرات زجاجية' },
                      { label: '📱 زر تحميل التطبيق ونشره على بلاي ستور', cmd: 'أضف بطاقات تحميل التطبيق من متجر Google Play Store و Apple App Store' },
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAiUserCommand(chip.cmd);
                          handleExecuteAiUpdate(chip.cmd);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-emerald-600/30 text-slate-300 hover:text-white border border-slate-800 hover:border-emerald-500/50 text-xs font-semibold cursor-pointer transition-all text-left rtl:text-right"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author Attribution */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>اسم الشخص صاحب القرار في التحديث:</span>
                  <input
                    type="text"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-bold w-40 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">
                  جميع التحديثات تُسجل باسم صاحب القرار في سجل التاريخ
                </span>
              </div>
            </div>
          )}

          {/* TAB 1: 1-Click Feature Modules */}
          {activeTab === 'modules' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">Select Features to Inject into this App</h3>
                  <p className="text-xs text-slate-400">
                    Anyone can select any feature below. It is instantly coded and merged into the application.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Contributing as:</span>
                  <input
                    type="text"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white w-36 font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FEATURE_MODULES.map((module) => {
                  const isJustAdded = justInjectedId === module.id;
                  return (
                    <div
                      key={module.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
                    >
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${module.color} text-white flex items-center justify-center shadow-md`}>
                              {getModuleIcon(module.icon)}
                            </div>
                            <span className="font-bold text-white text-xs">{module.name}</span>
                          </div>
                          {module.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {module.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {module.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px]">
                        <span className="text-slate-500 capitalize">
                          Placement: <strong className="text-slate-300">{module.placement}</strong>
                        </span>
                        <button
                          onClick={() => handleInjectModule(module)}
                          disabled={isJustAdded}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Injected!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Inject Feature</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Develop Custom Feature (Freeform AI Synthesis) */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/70 to-slate-900 border-2 border-indigo-500/40 space-y-2 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-black text-white">تحديث وتطوير التطبيق بقرارك أنت 100% (Human-Decided Updates)</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    القرار لك 100%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  أنت صاحب القرار وليس الذكاء الاصطناعي! اكتب أي شيء تريده في تطبيقك وسيقوم الذكاء الاصطناعي بتنفيذه بدقة بالغة وبناء الميزة فوراً دون أي اجتهاد أو تغيير لطلبك.
                </p>
              </div>

              {/* Preset Feature Prompts */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Feature Inspirations (Click to apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { title: 'Interactive ROI / Pricing Slider', desc: 'Add an interactive investment return calculator with a slider and instant monthly savings estimate.' },
                    { title: 'Multi-Step Booking Wizard', desc: 'Add a 3-step appointment scheduler with calendar dates and confirmation checkmark.' },
                    { title: 'Team Showcase with Modal Bio', desc: 'Add an executive team grid where clicking any member opens their detailed bio card.' },
                    { title: 'Audio Player with Waveform', desc: 'Add a modern floating ambient music player with play/pause and volume controls.' },
                    { title: 'Frequently Asked Questions (FAQ)', desc: 'Add an expandable accordion FAQ section with smooth dropdown animation.' },
                    { title: 'Customer Feedback & Bug Reporter', desc: 'Add a floating feedback button with screenshot attachment simulator and rating stars.' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCustomFeatureTitle(preset.title);
                        setCustomFeatureDesc(preset.desc);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-xs text-slate-300 hover:text-white transition-all cursor-pointer text-left"
                    >
                      + {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleDevelopCustomFeature} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Feature Name / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={customFeatureTitle}
                    onChange={(e) => setCustomFeatureTitle(e.target.value)}
                    placeholder="e.g. Loan Payment Calculator, Countdown Timer, Dark Mode Switch"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Detailed Feature Behavior & Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={customFeatureDesc}
                    onChange={(e) => setCustomFeatureDesc(e.target.value)}
                    placeholder="Describe how the feature works, what inputs or buttons it has, and how it should behave..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                      Placement on Page
                    </label>
                    <select
                      value={placement}
                      onChange={(e: any) => setPlacement(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="body-end">Bottom of page (Before Footer)</option>
                      <option value="hero">Hero Section / Below Title</option>
                      <option value="top">Top Announcement Banner</option>
                      <option value="floating">Floating Widget Overlay</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                      Your Name / Contributor ID
                    </label>
                    <input
                      type="text"
                      value={contributorName}
                      onChange={(e) => setContributorName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isDeveloping || !customFeatureTitle.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDeveloping ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Developing & Merging Feature into Application...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Develop & Inject Feature Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Direct Manual Code Injection (100% User Control, Zero AI Intervention) */}
          {activeTab === 'manual' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Direct Human Control & Code Authoring</h3>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                    100% YOU DECIDE
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Write, paste, or tweak any HTML, JavaScript, or Tailwind CSS code. The system injects your exact code directly into the live application without altering your logic.
                </p>
              </div>

              <form onSubmit={handleInjectManualCode} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                      Feature / Update Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Custom Currency Converter / VIP Banner / Video Player"
                      value={manualSnippetTitle}
                      onChange={(e) => setManualSnippetTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                      Placement Inside Application
                    </label>
                    <select
                      value={placement}
                      onChange={(e: any) => setPlacement(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="body-end">Bottom of Page (Main Content Area)</option>
                      <option value="top">Top Header Announcement</option>
                      <option value="hero">Hero Banner Section</option>
                      <option value="floating">Floating Modal / Overlay</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Your Custom HTML / JS / CSS Code
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Tailwind CSS & vanilla JS supported</span>
                  </div>
                  <textarea
                    rows={12}
                    placeholder={`<div class="max-w-4xl mx-auto my-8 p-6 bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-xl">\n  <h3 class="text-xl font-bold text-white mb-2">My Custom Feature</h3>\n  <button onclick="alert('Feature working!')" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs">\n    Click Me\n  </button>\n</div>`}
                    value={manualSnippet}
                    onChange={(e) => setManualSnippet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!manualSnippet.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Code className="w-4 h-4" />
                  <span>Inject My Custom Code Directly into App Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: Updates History & Changelog */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Application Version History & Updates</h3>
                  <p className="text-xs text-slate-400">
                    Track every feature added by collaborators or guests. You can inspect or restore any past version.
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Total Releases: <strong className="text-white">{updates.length}</strong>
                </span>
              </div>

              <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
                {updates.map((update, index) => {
                  const isLatest = index === 0;
                  return (
                    <div key={update.id} className="relative group">
                      {/* Timeline dot */}
                      <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${
                        isLatest 
                          ? 'bg-indigo-500 border-indigo-300 ring-4 ring-indigo-500/20' 
                          : 'bg-slate-800 border-slate-600'
                      }`} />

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs">
                              {update.version}
                            </span>
                            <h4 className="font-bold text-white text-xs">{update.title}</h4>
                            {isLatest && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                                CURRENT LIVE
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(update.appliedAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {update.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                          <div className="flex items-center gap-2">
                            <span>Contributor:</span>
                            <span className="text-indigo-400 font-semibold">{update.author}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 capitalize">
                              {update.authorType}
                            </span>
                          </div>

                          {!isLatest && (
                            <button
                              onClick={() => handleRestoreVersion(update)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-400" />
                              <span>Restore this Version</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Updates deploy with live white-label URLs ({currentProject.subdomain}.{currentProject.domainSuffix || 'com'})</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer"
          >
            Done & View App
          </button>
        </div>
      </div>
    </div>
  );
};
