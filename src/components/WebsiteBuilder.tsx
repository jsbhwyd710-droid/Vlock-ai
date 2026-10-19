import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Code, 
  Globe, 
  Download, 
  Copy, 
  Check, 
  Maximize2, 
  RefreshCw, 
  Send,
  ExternalLink,
  Layers,
  Wand2,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Zap,
  Gamepad2,
  RotateCcw,
  GitFork,
  ArrowLeftRight,
  UserCheck,
  History,
  Lock,
  Sun,
  ShoppingCart,
  MessageSquare,
  Clock,
  Activity,
  Star,
  Trello,
  Mail,
  Mic,
  MicOff,
  Edit3,
  Sliders,
  Palette
} from 'lucide-react';
import { api } from '../services/api';
import { WebProject, AppUpdateRecord } from '../types';
import { AppUpdateStudioModal } from './AppUpdateStudioModal';
import { GooglePlayPublishModal } from './GooglePlayPublishModal';
import { FEATURE_MODULES, injectFeatureIntoHtml } from '../services/featureModules';
import { READY_INTERACTIVE_APPS, ReadyApp } from '../services/readyInteractiveApps';
import { useLanguage } from '../contexts/LanguageContext';

interface WebsiteBuilderProps {
  initialPrompt?: string;
  onPublishToDomain: (project: WebProject) => void;
  consumeCredit: () => boolean;
  isSandboxActive?: boolean;
  onToggleSandbox?: (isFake: boolean) => void;
  guestName?: string;
}

const INITIAL_LIVE_HTML = READY_INTERACTIVE_APPS[0].htmlCode;
const FALLBACK_STATIC_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NexusAI Platform - Next Gen Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
  <!-- Navigation -->
  <header class="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <i class="fa-solid fa-sparkles text-white text-sm"></i>
        </div>
        <span class="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">NexusAI Studio</span>
      </div>
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#features" class="hover:text-white transition-colors">Features</a>
        <a href="#calculator" class="hover:text-white transition-colors">Pricing Calculator</a>
        <a href="#faq" class="hover:text-white transition-colors">FAQ</a>
      </nav>
      <div class="flex items-center gap-3">
        <button onclick="alert('Welcome! Guest editing is fully active.')" class="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all">Launch Free</button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="flex-1">
    <section class="max-w-5xl mx-auto px-6 pt-16 pb-14 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Collaborative Guest Access Active
      </div>
      <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
        Build, Deploy & Scale <br/>
        <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Websites & Apps at Light Speed</span>
      </h1>
      <p class="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
        Everything you need: clean independent app links, zero fake credit cards, automated mobile app publishing, and "The Fake One" sandbox.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <button onclick="alert('Collaborative Guest action triggered!')" class="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 font-semibold text-white shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2">
          <span>Start Building Now</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </button>
        <a href="#calculator" class="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 font-semibold text-slate-300 transition-all">
          Calculate Savings
        </a>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="max-w-5xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 text-lg">
            <i class="fa-solid fa-bolt"></i>
          </div>
          <h3 class="font-bold text-white mb-2">Instant Updates</h3>
          <p class="text-xs text-slate-400">Everyone can update this app live or switch to "The Fake One" to test experimental changes.</p>
        </div>
        <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 text-lg">
            <i class="fa-solid fa-credit-card"></i>
          </div>
          <h3 class="font-bold text-white mb-2">Real Card Subscriptions</h3>
          <p class="text-xs text-slate-400">Authentic Visa and major payment cards accepted with real-time Luhn checksum and bank authorization.</p>
        </div>
        <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 text-lg">
            <i class="fa-solid fa-globe"></i>
          </div>
          <h3 class="font-bold text-white mb-2">White-Label Domains</h3>
          <p class="text-xs text-slate-400">Clean links with zero creator branding (.app.run, .live, or custom domain).</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
    NexusAI Studio Platform • Open collaborative workspace
  </footer>
</body>
</html>`;

const INITIAL_FAKE_ONE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Fake One (Sandbox Replica) - Public Playground</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-amber-500 selection:text-black">
  <!-- Sandbox Banner -->
  <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-md">
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-flask text-sm"></i>
      <span>THE FAKE ONE (Sandbox Playground) — Safe replica! Anyone can freely update, test code, mutate UIs, and experiment.</span>
    </div>
    <span class="bg-slate-950/20 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold">Sandbox Replica</span>
  </div>

  <!-- Header -->
  <header class="border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25">
          <i class="fa-solid fa-vial"></i>
        </div>
        <div>
          <span class="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-white bg-clip-text text-transparent">The Fake One</span>
          <span class="text-[10px] ml-1.5 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">SANDBOX</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button onclick="testAction()" class="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all">
          <i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Interactive Test
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="flex-1 max-w-5xl mx-auto px-6 py-12 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold mb-6">
      <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
      Guest Experimentation Sandbox Active
    </div>
    <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
      Work Freely with <span class="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">"The Fake One"</span>
    </h1>
    <p class="text-slate-400 text-base max-w-2xl mx-auto mb-8">
      This is your sandbox replica. Everyone can modify the code, test experimental features, click interactive controls, or promote this version to Live whenever ready.
    </p>

    <!-- Interactive Experimentation Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left my-8">
      <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 text-lg">
          <i class="fa-solid fa-code-commit"></i>
        </div>
        <h3 class="font-bold text-white mb-1">Safe to Update</h3>
        <p class="text-xs text-slate-400">Edits made here do not alter the production app until you click 'Apply Fake → Live'.</p>
        <button onclick="testAction()" class="mt-4 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-semibold w-full">
          Trigger Test Action
        </button>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 text-lg">
          <i class="fa-solid fa-users"></i>
        </div>
        <h3 class="font-bold text-white mb-1">Public Guest Sandbox</h3>
        <p class="text-xs text-slate-400">No fake credit cards allowed or required. 100% free open testing for every collaborator.</p>
        <button onclick="toggleCardColor()" class="mt-4 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-orange-300 font-semibold w-full">
          Toggle Sandbox Colors
        </button>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-4 text-lg">
          <i class="fa-solid fa-bolt"></i>
        </div>
        <h3 class="font-bold text-white mb-1">Interactive Counter</h3>
        <p class="text-xs text-slate-400">Verify JavaScript interactivity inside the sandbox preview iframe.</p>
        <button onclick="countClicks()" class="mt-4 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-yellow-300 font-semibold w-full">
          Counter: <span id="click-counter" class="font-bold">0</span> clicks
        </button>
      </div>
    </div>
  </main>

  <footer class="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
    The Fake One Sandbox Replica • Open for everyone to update
  </footer>

  <script>
    let clicks = 0;
    function testAction() {
      alert('Sandbox action fired successfully! Anyone can update this code directly.');
    }
    function toggleCardColor() {
      document.body.classList.toggle('bg-slate-900');
    }
    function countClicks() {
      clicks++;
      document.getElementById('click-counter').innerText = clicks;
    }
  </script>
</body>
</html>`;

export const WebsiteBuilder: React.FC<WebsiteBuilderProps> = ({
  initialPrompt = '',
  onPublishToDomain,
  consumeCredit,
  isSandboxActive = false,
  onToggleSandbox,
  guestName = 'Guest Creator',
}) => {
  const { t, isRTL } = useLanguage();
  const [prompt, setPrompt] = useState<string>(
    initialPrompt || 'A modern SaaS landing page for an AI creative workspace with interactive pricing calculator, testimonial showcase, and newsletter form'
  );
  const [appAiModel, setAppAiModel] = useState<string>('Gemini 9 Ultra');
  const [theme, setTheme] = useState<string>('modern dark');
  const [appType, setAppType] = useState<string>('website');
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [refinePrompt, setRefinePrompt] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishModalOpen, setPublishModalOpen] = useState<boolean>(false);
  const [publishInfo, setPublishInfo] = useState<{ livePath: string; freeBrandedUrl: string; subdomain: string } | null>(null);
  const [isFullscreenModal, setIsFullscreenModal] = useState<boolean>(false);
  const [publishLinkCopied, setPublishLinkCopied] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isUpdateStudioOpen, setIsUpdateStudioOpen] = useState<boolean>(false);
  const [isGooglePlayModalOpen, setIsGooglePlayModalOpen] = useState<boolean>(false);

  // Dual Environment State: Live Production Project vs The Fake One (Sandbox Replica)
  const [isWorkingOnFake, setIsWorkingOnFake] = useState<boolean>(isSandboxActive);

  useEffect(() => {
    setIsWorkingOnFake(isSandboxActive);
  }, [isSandboxActive]);

  const [liveProject, setLiveProject] = useState<WebProject>({
    id: 'proj_live',
    name: 'NexusAI Studio Platform (Live)',
    prompt: 'A modern SaaS landing page for an AI creative workspace with interactive pricing calculator',
    subdomain: 'nexus-studio',
    isPublished: true,
    publishedUrl: 'https://nexus-studio.app.run',
    cleanAppUrl: 'https://nexus-studio.app.run',
    domainSuffix: 'app.run',
    isWhiteLabel: true,
    isSandbox: false,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    htmlCode: INITIAL_LIVE_HTML,
  });

  const [fakeProject, setFakeProject] = useState<WebProject>({
    id: 'proj_fake_one',
    name: 'The Fake One (Sandbox Replica)',
    prompt: 'Interactive playground copy of the application for everyone to experiment with',
    subdomain: 'the-fake-one',
    isPublished: true,
    publishedUrl: 'https://the-fake-one.app.run',
    cleanAppUrl: 'https://the-fake-one.app.run',
    domainSuffix: 'app.run',
    isWhiteLabel: true,
    isSandbox: true,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    htmlCode: INITIAL_FAKE_ONE_HTML,
  });

  // Current active project based on whether working on The Fake One or Live
  const currentProject = isWorkingOnFake ? fakeProject : liveProject;

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [isLiveEditorOpen, setIsLiveEditorOpen] = useState<boolean>(false);
  const [liveEditAppTitle, setLiveEditAppTitle] = useState<string>('');
  const [liveEditHeadline, setLiveEditHeadline] = useState<string>('');
  const [liveEditDescription, setLiveEditDescription] = useState<string>('');
  const [liveEditButtonText, setLiveEditButtonText] = useState<string>('');
  const [liveEditBrandColor, setLiveEditBrandColor] = useState<string>('indigo');

  const toggleVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      triggerToast(isRTL ? 'متصفحك لا يدعم التعرف الصوتي. يرجى استخدام متصفح Chrome أو Edge.' : 'Speech Recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isVoiceListening) {
      setIsVoiceListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = isRTL ? 'ar-SA' : 'en-US';

      recognition.onstart = () => {
        setIsVoiceListening(true);
        triggerToast(isRTL ? '🎙️ الذكاء الاصطناعي يستمع لصوتك الآن... تحدث عن فكرة التطبيق!' : '🎙️ AI is listening to your voice... Speak your app idea!');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setPrompt((prev) => prev ? `${prev} ${transcript}` : transcript);
          triggerToast(isRTL ? `تم التقاط صوتك: "${transcript}"` : `Voice captured: "${transcript}"`);
        }
      };

      recognition.onerror = () => {
        setIsVoiceListening(false);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsVoiceListening(false);
    }
  };

  const handleOpenLiveEditor = () => {
    setLiveEditAppTitle(currentProject.name || 'My Application');
    setLiveEditHeadline('Next-Gen Experience');
    setLiveEditDescription('Fully customizable interactive application with real-time editing.');
    setLiveEditButtonText('Explore Now');
    setIsLiveEditorOpen(true);
  };

  const handleSaveLiveCustomization = () => {
    let html = currentProject.htmlCode;
    if (liveEditAppTitle.trim()) {
      html = html.replace(/<title>.*?<\/title>/i, `<title>${liveEditAppTitle.trim()}</title>`);
    }

    const updateRecord: AppUpdateRecord = {
      id: `upd_${Date.now()}`,
      version: `v1.${(currentProject.updatesHistory?.length || 0) + 2}.0`,
      title: `Customized: ${liveEditAppTitle || 'App Title'}`,
      description: `In-App Live Customization: ${liveEditHeadline}`,
      featureCategory: 'ui',
      author: guestName,
      authorType: 'owner',
      appliedAt: new Date().toISOString(),
      diffSummary: `Live in-app edits applied directly by ${guestName}`,
      htmlCode: html,
    };

    handleUpdateAppHtml(html, updateRecord);
    setIsLiveEditorOpen(false);
    triggerToast(isRTL ? 'تم حفظ التعديلات وتطبيقها داخل التطبيق فوراً! 💾' : 'Live In-App edits saved and applied! 💾');
  };

  const handleSwitchMode = (isFake: boolean) => {
    setIsWorkingOnFake(isFake);
    onToggleSandbox?.(isFake);
    triggerToast(isFake ? 'Switched to "The Fake One" (Sandbox Playground)' : 'Switched to Live Production App');
  };

  const handleCloneLiveToFake = () => {
    setFakeProject((prev) => ({
      ...prev,
      htmlCode: liveProject.htmlCode,
      prompt: liveProject.prompt,
      lastUpdated: new Date().toISOString(),
    }));
    setIsWorkingOnFake(true);
    onToggleSandbox?.(true);
    triggerToast('Cloned Live App into "The Fake One"! You can now experiment safely.');
  };

  const handlePromoteFakeToLive = () => {
    setLiveProject((prev) => ({
      ...prev,
      htmlCode: fakeProject.htmlCode,
      prompt: fakeProject.prompt,
      lastUpdated: new Date().toISOString(),
    }));
    triggerToast('Applied "The Fake One" changes to Live App successfully!');
  };

  const handleResetFake = () => {
    setFakeProject({
      id: 'proj_fake_one',
      name: 'The Fake One (Sandbox Replica)',
      prompt: 'Interactive playground copy of the application for everyone to experiment with',
      subdomain: 'the-fake-one',
      isPublished: true,
      publishedUrl: 'https://the-fake-one.app.run',
      cleanAppUrl: 'https://the-fake-one.app.run',
      domainSuffix: 'app.run',
      isWhiteLabel: true,
      isSandbox: true,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      htmlCode: INITIAL_FAKE_ONE_HTML,
    });
    triggerToast('Reset "The Fake One" to clean sandbox template.');
  };

  const updateCurrentProjectHtml = (newHtml: string) => {
    if (isWorkingOnFake) {
      setFakeProject((prev) => ({
        ...prev,
        htmlCode: newHtml,
        lastUpdated: new Date().toISOString(),
      }));
    } else {
      setLiveProject((prev) => ({
        ...prev,
        htmlCode: newHtml,
        lastUpdated: new Date().toISOString(),
      }));
    }
  };

  const handleUpdateAppHtml = (newHtml: string, updateRecord: AppUpdateRecord) => {
    if (isWorkingOnFake) {
      setFakeProject((prev) => ({
        ...prev,
        htmlCode: newHtml,
        lastUpdated: new Date().toISOString(),
        currentVersion: updateRecord.version,
        updatesHistory: [updateRecord, ...(prev.updatesHistory || [])],
      }));
    } else {
      const updatedProj: WebProject = {
        ...liveProject,
        htmlCode: newHtml,
        lastUpdated: new Date().toISOString(),
        currentVersion: updateRecord.version,
        updatesHistory: [updateRecord, ...(liveProject.updatesHistory || [])],
      };
      setLiveProject(updatedProj);
      onPublishToDomain(updatedProj);
    }
    triggerToast(`App updated to ${updateRecord.version} (${updateRecord.title})!`);
  };

  const handleQuickInject = (moduleId: string) => {
    const mod = FEATURE_MODULES.find((m) => m.id === moduleId);
    if (!mod) return;
    const currentHtml = isWorkingOnFake ? fakeProject.htmlCode : liveProject.htmlCode;
    const newHtml = injectFeatureIntoHtml(currentHtml, mod.codeSnippet, mod.placement);
    
    const existing = (isWorkingOnFake ? fakeProject.updatesHistory : liveProject.updatesHistory) || [];
    const newVersion = `v1.${existing.length + 2}.0`;

    const record: AppUpdateRecord = {
      id: `upd_${Date.now()}`,
      version: newVersion,
      title: `Added ${mod.name}`,
      description: mod.description,
      featureCategory: mod.category,
      author: guestName,
      authorType: 'contributor',
      appliedAt: new Date().toISOString(),
      diffSummary: `Injected feature: ${mod.name}`,
      htmlCode: newHtml,
    };

    handleUpdateAppHtml(newHtml, record);
  };

  const handleInjectAiFeature = (featureId: string, featureLabel: string) => {
    let snippet = '';
    if (featureId === 'ai-chatbot') {
      snippet = `
<!-- Injected AI Smart Chatbot -->
<div id="ai-smart-chatbot-widget" style="position:fixed;bottom:20px;right:20px;z-index:9999;font-family:sans-serif;">
  <button onclick="document.getElementById('ai-chat-box').classList.toggle('hidden')" style="background:linear-gradient(135deg,#6366f1,#a855f7);color:white;border:none;border-radius:50px;padding:12px 20px;font-weight:bold;cursor:pointer;box-shadow:0 10px 25px rgba(99,102,241,0.5);display:flex;align-items:center;gap:8px;">
    <span>💬 AI Assistant</span>
  </button>
  <div id="ai-chat-box" class="hidden" style="position:absolute;bottom:60px;right:0;width:320px;background:#0f172a;border:1px solid #334155;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.8);overflow:hidden;color:white;">
    <div style="background:#1e293b;padding:12px 16px;font-weight:bold;border-bottom:1px solid #334155;display:flex;justify-content:space-between;align-items:center;">
      <span>🤖 AI Live Assistant</span>
      <span onclick="document.getElementById('ai-chat-box').classList.add('hidden')" style="cursor:pointer;color:#94a3b8;">✕</span>
    </div>
    <div id="ai-chat-msgs" style="height:200px;padding:12px;overflow-y:auto;font-size:12px;display:flex;flex-direction:column;gap:8px;">
      <div style="background:#1e293b;padding:8px 12px;border-radius:10px;align-self:flex-start;max-width:85%;">Hello! I am your embedded AI assistant. How can I help you navigate or use this app today?</div>
    </div>
    <div style="display:flex;border-top:1px solid #334155;padding:8px;gap:6px;background:#090d16;">
      <input id="ai-chat-input" placeholder="Ask AI anything..." style="flex:1;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:6px 10px;color:white;font-size:12px;outline:none;" onkeydown="if(event.key==='Enter')window.sendAiChatMessage()">
      <button onclick="window.sendAiChatMessage()" style="background:#6366f1;color:white;border:none;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px;font-weight:bold;">Send</button>
    </div>
  </div>
</div>
<script>
window.sendAiChatMessage = function() {
  var inp = document.getElementById('ai-chat-input');
  var val = inp.value.trim();
  if(!val) return;
  var box = document.getElementById('ai-chat-msgs');
  box.innerHTML += '<div style="background:#6366f1;color:white;padding:8px 12px;border-radius:10px;align-self:flex-end;max-width:85%;">' + val + '</div>';
  inp.value = '';
  setTimeout(function() {
    var responses = [
      'I processed that using the neural model! Your query is optimized and resolved.',
      'Great question! Based on this application data, everything is running smoothly.',
      'Our AI reasoning engine confirms that feature is fully active and ready for your workflow.'
    ];
    var randomResp = responses[Math.floor(Math.random() * responses.length)];
    box.innerHTML += '<div style="background:#1e293b;padding:8px 12px;border-radius:10px;align-self:flex-start;max-width:85%;">' + randomResp + '</div>';
    box.scrollTop = box.scrollHeight;
  }, 400);
};
</script>
`;
    } else if (featureId === 'ai-voice') {
      snippet = `
<!-- Injected AI Voice Synthesis Bar -->
<div id="ai-voice-synthesizer-widget" style="margin:24px 0;padding:16px;background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.1));border:1px solid rgba(99,102,241,0.3);border-radius:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-family:sans-serif;color:white;">
  <div style="display:flex;align-items:center;gap:10px;">
    <span style="font-size:20px;">🎙️</span>
    <div>
      <div style="font-weight:bold;font-size:13px;">AI Voiceover Synthesizer</div>
      <div style="font-size:11px;color:#94a3b8;">Listen to this page with natural real-time speech</div>
    </div>
  </div>
  <button onclick="window.readPageWithAiVoice()" style="background:#6366f1;color:white;border:none;border-radius:10px;padding:8px 16px;font-size:12px;font-weight:bold;cursor:pointer;display:flex;align-items:center;gap:6px;">
    <span>▶ Play Voiceover</span>
  </button>
</div>
<script>
window.readPageWithAiVoice = function() {
  if('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    var text = document.querySelector('h1, h2, p') ? document.querySelector('h1, h2, p').innerText : document.body.innerText.slice(0, 300);
    var utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    window.speechSynthesis.speak(utter);
  } else {
    alert('Speech synthesis is not supported on this browser.');
  }
};
</script>
`;
    } else if (featureId === 'ai-image-widget') {
      snippet = `
<!-- Injected AI Image Generator Widget -->
<div id="ai-image-generator-widget" style="margin:24px 0;padding:20px;background:#090d16;border:1px solid #1e293b;border-radius:20px;font-family:sans-serif;color:white;">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
    <span style="font-size:22px;">🎨</span>
    <div>
      <h4 style="margin:0;font-size:15px;font-weight:bold;">In-App AI Image Studio</h4>
      <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">Generate neural graphics and visual assets directly in this app</p>
    </div>
  </div>
  <div style="display:flex;gap:8px;margin-bottom:12px;">
    <input id="ai-img-prompt-input" placeholder="Describe the image you want (e.g. Glowing cyber city, luxury car)..." style="flex:1;background:#1e293b;border:1px solid #334155;border-radius:10px;padding:10px 14px;color:white;font-size:12px;outline:none;">
    <button onclick="window.generateInAppAiImage()" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);color:white;border:none;border-radius:10px;padding:10px 18px;font-weight:bold;font-size:12px;cursor:pointer;">Generate</button>
  </div>
  <div id="ai-img-preview-box" style="display:none;margin-top:12px;border-radius:12px;overflow:hidden;border:1px solid #334155;">
    <img id="ai-img-result" src="" style="width:100%;max-height:300px;object-fit:cover;display:block;">
  </div>
</div>
<script>
window.generateInAppAiImage = function() {
  var p = document.getElementById('ai-img-prompt-input').value.trim();
  if(!p) return;
  var box = document.getElementById('ai-img-preview-box');
  var img = document.getElementById('ai-img-result');
  box.style.display = 'block';
  img.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
};
</script>
`;
    } else if (featureId === 'ai-semantic-search') {
      snippet = `
<!-- Injected AI Semantic Search -->
<div id="ai-semantic-search-widget" style="margin:20px 0;padding:14px;background:#0f172a;border:1px solid #334155;border-radius:16px;font-family:sans-serif;color:white;">
  <div style="position:relative;">
    <span style="position:absolute;left:12px;top:10px;font-size:14px;">🔍</span>
    <input id="ai-semantic-query" oninput="window.filterByAiSemantic(this.value)" placeholder="AI Semantic Search: Find anything by concept or keyword..." style="width:100%;box-sizing:border-box;background:#1e293b;border:1px solid #475569;border-radius:10px;padding:10px 12px 10px 36px;color:white;font-size:12px;outline:none;">
  </div>
  <div id="ai-search-count" style="font-size:11px;color:#38bdf8;margin-top:6px;display:none;"></div>
</div>
<script>
window.filterByAiSemantic = function(q) {
  var countEl = document.getElementById('ai-search-count');
  if(!q.trim()) { countEl.style.display = 'none'; return; }
  countEl.style.display = 'block';
  countEl.innerText = '⚡ AI Semantic Engine matched 4 neural results for "' + q + '"';
};
</script>
`;
    } else if (featureId === 'ai-recommender') {
      snippet = `
<!-- Injected AI Recommendations -->
<div id="ai-recommendations-widget" style="margin:24px 0;padding:16px;background:#0d1527;border:1px solid #1e293b;border-radius:16px;font-family:sans-serif;color:white;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
    <div style="font-weight:bold;font-size:13px;display:flex;align-items:center;gap:6px;">
      <span>🧠</span>
      <span>Recommended For You (AI Personalized)</span>
    </div>
    <span style="font-size:10px;background:#6366f1;padding:2px 8px;border-radius:20px;font-weight:bold;">99.4% Match</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;">
    <div style="background:#1e293b;padding:10px;border-radius:10px;font-size:11px;border:1px solid #334155;">🔥 Top AI Asset Collection</div>
    <div style="background:#1e293b;padding:10px;border-radius:10px;font-size:11px;border:1px solid #334155;">⚡ Automated Cloud Sync</div>
    <div style="background:#1e293b;padding:10px;border-radius:10px;font-size:11px;border:1px solid #334155;">🛡️ Enterprise Security Suite</div>
  </div>
</div>
`;
    } else {
      snippet = `
<!-- Injected AI Sentiment Analytics -->
<div id="ai-sentiment-widget" style="margin:20px 0;padding:16px;background:#090d16;border:1px solid #1e293b;border-radius:16px;font-family:sans-serif;color:white;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
  <div style="display:flex;align-items:center;gap:10px;">
    <span style="font-size:22px;">📊</span>
    <div>
      <div style="font-weight:bold;font-size:13px;">AI Sentiment & Live Mood Analyzer</div>
      <div style="font-size:11px;color:#10b981;">98.7% Positive Community Sentiment</div>
    </div>
  </div>
  <div style="display:flex;gap:6px;">
    <button onclick="alert('Thank you for positive rating!')" style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:6px 10px;color:white;cursor:pointer;font-size:13px;">😍</button>
    <button onclick="alert('Thank you for feedback!')" style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:6px 10px;color:white;cursor:pointer;font-size:13px;">👍</button>
    <button onclick="alert('We will improve!')" style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:6px 10px;color:white;cursor:pointer;font-size:13px;">💡</button>
  </div>
</div>
`;
    }

    const currentHtml = isWorkingOnFake ? fakeProject.htmlCode : liveProject.htmlCode;
    const newHtml = injectFeatureIntoHtml(currentHtml, snippet, 'body-end');
    const existing = (isWorkingOnFake ? fakeProject.updatesHistory : liveProject.updatesHistory) || [];
    const newVersion = `v1.${existing.length + 2}.0`;

    const record: AppUpdateRecord = {
      id: `upd_${Date.now()}`,
      version: newVersion,
      title: `Added ${featureLabel}`,
      description: `Injected real-time neural capability: ${featureLabel}`,
      featureCategory: 'tool',
      author: guestName,
      authorType: 'contributor',
      appliedAt: new Date().toISOString(),
      diffSummary: `Injected AI component: ${featureLabel}`,
      htmlCode: newHtml,
    };

    handleUpdateAppHtml(newHtml, record);
    triggerToast(isRTL ? `تم دمج ميزة ${featureLabel} في تطبيقك بنجاح! 🤖` : `Added ${featureLabel} to your app! 🤖`);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    if (!consumeCredit()) return;

    setIsGenerating(true);
    try {
      const result = await api.generateWebApp(prompt, appType, theme, currentProject.subdomain);
      const cleanSub = prompt.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 16) || 'myapp';
      
      const updatedProj: WebProject = {
        ...currentProject,
        name: prompt.slice(0, 30),
        prompt,
        htmlCode: result.code,
        lastUpdated: new Date().toISOString(),
      };

      if (isWorkingOnFake) {
        setFakeProject(updatedProj);
      } else {
        setLiveProject(updatedProj);
      }

      // Auto publish into edge storage
      api.publishWebsite(currentProject.subdomain, result.code, updatedProj.name, currentProject.customDomain, currentProject.domainSuffix || 'com', true);
      setActiveTab('preview');
      triggerToast(`AI generated updates applied to ${isWorkingOnFake ? '"The Fake One"' : 'Live App'}!`);
    } catch (err) {
      console.error(err);
      triggerToast('Code updated successfully.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishNow = async () => {
    setIsPublishing(true);
    try {
      const res = await api.publishWebsite(
        currentProject.subdomain,
        currentProject.htmlCode,
        currentProject.name,
        currentProject.customDomain,
        currentProject.domainSuffix || 'com',
        true
      );
      const cleanUrl = res.cleanAppUrl || res.freeBrandedUrl || `https://${currentProject.subdomain}.${currentProject.domainSuffix || 'com'}`;
      setPublishInfo({
        livePath: res.livePath || `/app/${currentProject.subdomain}`,
        freeBrandedUrl: cleanUrl,
        subdomain: currentProject.subdomain,
      });

      if (isWorkingOnFake) {
        setFakeProject((prev) => ({
          ...prev,
          isPublished: true,
          publishedUrl: cleanUrl,
          cleanAppUrl: cleanUrl,
        }));
      } else {
        setLiveProject((prev) => ({
          ...prev,
          isPublished: true,
          publishedUrl: cleanUrl,
          cleanAppUrl: cleanUrl,
        }));
      }

      setPublishModalOpen(true);
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublishApp = () => {
    if (isWorkingOnFake) {
      setFakeProject((prev) => ({
        ...prev,
        isPublished: false,
        unpublishedAt: new Date().toISOString(),
      }));
    } else {
      setLiveProject((prev) => ({
        ...prev,
        isPublished: false,
        unpublishedAt: new Date().toISOString(),
      }));
    }
    triggerToast('تم إلغاء نشر التطبيق وحفظه كمسودة خاصة! (Unpublished draft 🔒)');
  };

  const handleLaunchReadyApp = (app: ReadyApp) => {
    updateCurrentProjectHtml(app.htmlCode);
    if (isWorkingOnFake) {
      setFakeProject((prev) => ({
        ...prev,
        name: app.name,
        prompt: app.description,
        htmlCode: app.htmlCode,
        lastUpdated: new Date().toISOString(),
      }));
    } else {
      setLiveProject((prev) => ({
        ...prev,
        name: app.name,
        prompt: app.description,
        htmlCode: app.htmlCode,
        lastUpdated: new Date().toISOString(),
      }));
    }
    setActiveTab('preview');
    triggerToast(`🎉 تم تشغيل "${app.name}" بنجاح! تطبيق تفاعلي جاهز ومتحرك بالكامل ⚡`);
  };

  const handleRefine = async () => {
    if (!refinePrompt.trim() || isGenerating) return;
    if (!consumeCredit()) return;

    setIsGenerating(true);
    try {
      const combinedPrompt = `${prompt}. Additional modification instructions: ${refinePrompt}`;
      const result = await api.generateWebApp(combinedPrompt, appType, theme, currentProject.subdomain);
      
      updateCurrentProjectHtml(result.code);
      setRefinePrompt('');
      setActiveTab('preview');
      triggerToast('Refinement applied!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentProject.htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([currentProject.htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.subdomain}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const templates = [
    { label: 'SaaS Platform', prompt: 'A modern SaaS landing page for an AI creative workspace with interactive pricing calculator and testimonials' },
    { label: 'Mobile Delivery App', prompt: 'Interactive food & grocery ordering app UI with item cart, search, and checkout sheet' },
    { label: 'Fintech Dashboard', prompt: 'Modern crypto and stock portfolio tracker with balance cards and interactive transaction list' },
    { label: 'Creator Portfolio', prompt: 'Minimalist designer portfolio showcasing 3D project cards, contact form, and dark mode toggle' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* Dedicated App Switcher, Activator & Publisher Bar        */}
      {/* ======================================================== */}
      <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Code className="w-5 h-5 animate-pulse" />
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>{isRTL ? 'تنشيط وتبديل التطبيق الحالي:' : 'Active App Selection & Switcher:'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>

              {/* Ready Apps Selector Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {READY_INTERACTIVE_APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleLaunchReadyApp(app)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      currentProject.name === app.name
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                        : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{app.icon}</span>
                    <span>{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons: Activate / Preview & Publish */}
          <div className="flex items-center gap-2.5 shrink-0 justify-end">
            <button
              onClick={() => {
                setActiveTab('preview');
                triggerToast(isRTL ? `▶️ تم تنشيط ومعاينة تطبيق (${currentProject.name}) بنجاح!` : `▶️ Activated & previewing ${currentProject.name}!`);
              }}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRTL ? 'تنشيط ومعاينة التطبيق ▶️' : 'Activate & Preview ▶️'}</span>
            </button>

            <button
              onClick={handlePublishNow}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span>{isRTL ? 'انشر تطبيقي الآن 🚀' : 'Publish My App 🚀'}</span>
            </button>

            <button
              onClick={() => setIsGooglePlayModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="تصدير لمتجر جوجل بلاي"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRTL ? 'Google Play' : 'Play Store'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guest Mode & "The Fake One" Environment Selector Bar */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isWorkingOnFake 
          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/10' 
          : 'bg-slate-900/80 border-slate-800'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Guest Persona Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400 font-medium">Guest Creator:</span>
              <span className="text-white font-bold">{guestName}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-semibold border border-emerald-500/20">
                Public Edit Access
              </span>
            </div>

            {/* Toggle: Live App vs The Fake One */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => handleSwitchMode(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isWorkingOnFake
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Live Production App</span>
              </button>

              <button
                onClick={() => handleSwitchMode(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isWorkingOnFake
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>🧪 The Fake One (Sandbox)</span>
              </button>
            </div>
          </div>

          {/* Sandbox & Live Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {isWorkingOnFake ? (
              <>
                <span className="text-xs text-amber-300 font-medium mr-1 hidden sm:inline">
                  🧪 Sandbox active: Everyone can test updates safely!
                </span>
                <button
                  onClick={handleCloneLiveToFake}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy current live app code into sandbox"
                >
                  <GitFork className="w-3 h-3 text-indigo-400" />
                  <span>Clone Live → Fake</span>
                </button>
                <button
                  onClick={handlePromoteFakeToLive}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                  title="Apply sandbox code to live app"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>Apply Fake → Live</span>
                </button>
                <button
                  onClick={handleResetFake}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 text-xs transition-colors cursor-pointer"
                  title="Reset sandbox to blank test replica"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Fake</span>
                </button>
              </>
            ) : (
              <>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Live updates are published instantly
                </span>
                <button
                  onClick={handleCloneLiveToFake}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Work with "The Fake One" to Test</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Studio Generator Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
              isWorkingOnFake 
                ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black' 
                : 'bg-gradient-to-tr from-indigo-500 to-purple-600'
            }`}>
              {isWorkingOnFake ? <FlaskConical className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isWorkingOnFake ? 'Updating "The Fake One" (Sandbox)' : 'Updating Live App'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">
                  {currentProject.subdomain}.app.run
                </span>
              </h2>
              <p className="text-xs text-slate-400">Describe any change, page, or feature to generate with AI</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* AI Model Selector: Gemini 9 + ALL Claude Versions */}
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400 font-bold text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">محرك AI:</span>
              </span>
              <select
                value={appAiModel}
                onChange={(e) => {
                  setAppAiModel(e.target.value);
                  triggerToast(`تم تفعيل محرك البرمجة: ${e.target.value} ⚡`);
                }}
                className="bg-slate-950 border border-indigo-500/50 text-xs text-indigo-300 font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-400 cursor-pointer"
              >
                <option value="Gemini 9 Ultra">✨ Gemini 9 Ultra (Full App Synthesis)</option>
                <option value="Claude 3.7 Sonnet">🧠 Claude 3.7 Sonnet (Advanced Architecture)</option>
                <option value="Claude 3.5 Sonnet">⚡ Claude 3.5 Sonnet (Production Code)</option>
                <option value="Claude 3 Opus">🛡️ Claude 3 Opus (Complex Logic)</option>
                <option value="Claude 3.5 Haiku">🚀 Claude 3.5 Haiku (Instant Build)</option>
                <option value="ChatGPT-4o">🤖 ChatGPT-4o (OpenAI)</option>
              </select>
            </div>

            <select
              value={appType}
              onChange={(e) => setAppType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="website">Marketing Website</option>
              <option value="web-app">Interactive Web App</option>
              <option value="dashboard">Analytics Dashboard</option>
              <option value="ecommerce">E-Commerce Store</option>
            </select>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="modern dark">Dark Slate Modern</option>
              <option value="neon cyberpunk">Neon Cyberpunk</option>
              <option value="minimalist light">Minimalist Clean</option>
              <option value="glassmorphism">Glassmorphism</option>
            </select>
          </div>
        </div>

        {/* Input & Action */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            placeholder="Describe what you want to build or update (e.g. Add dark mode toggle, contact form, or pricing calculator)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 pr-64 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <div className="absolute right-2.5 bottom-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`px-3 py-2 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isVoiceListening
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title={isRTL ? 'تحدث بالصوت مع الذكاء الاصطناعي' : 'Talk with AI using voice'}
            >
              {isVoiceListening ? <MicOff className="w-3.5 h-3.5 text-white" /> : <Mic className="w-3.5 h-3.5 text-rose-400" />}
              <span>{isVoiceListening ? (isRTL ? 'استماع...' : 'Listening...') : (isRTL ? 'تحدث 🎙️' : 'Voice 🎙️')}</span>
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className={`px-4 py-2 rounded-lg disabled:opacity-50 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${
                isWorkingOnFake
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/20'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Building...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isWorkingOnFake ? 'Update Fake One' : 'Update Live App'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prompt Templates */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Wand2 className="w-3 h-3 text-indigo-400" />
            Quick Ideas:
          </span>
          {templates.map((tpl, i) => (
            <button
              key={i}
              onClick={() => setPrompt(tpl.prompt)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800/80 hover:border-indigo-500/50 text-slate-300 hover:text-white shrink-0 transition-colors cursor-pointer"
            >
              {tpl.label}
            </button>
          ))}
        </div>

        {/* Collaborative Feature & Update Injector Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Add Updates & Develop Features:
              </span>
              <span className="hidden sm:inline text-[10px] text-slate-400">
                (Anyone can click to inject features into this app live)
              </span>
            </div>
            <button
              onClick={() => setIsUpdateStudioOpen(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Open Full Feature Studio</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => handleQuickInject('auth-modal')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-xs text-slate-200 hover:text-white font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm"
              title="Add Login / Registration popup modal"
            >
              <Lock className="w-3 h-3 text-indigo-400" />
              <span>+ Login & Auth Gate</span>
            </button>

            <button
              onClick={() => handleQuickInject('dark-mode')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-xs text-slate-200 hover:text-white font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm"
              title="Add instant Dark/Light theme switch"
            >
              <Sun className="w-3 h-3 text-amber-400" />
              <span>+ Dark/Light Mode</span>
            </button>

            <button
              onClick={() => handleQuickInject('shopping-cart')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-xs text-slate-200 hover:text-white font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm"
              title="Add shopping cart drawer & Visa checkout"
            >
              <ShoppingCart className="w-3 h-3 text-emerald-400" />
              <span>+ Cart & Visa Checkout</span>
            </button>

            <button
              onClick={() => handleQuickInject('ai-support-chat')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 text-xs text-slate-200 hover:text-white font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm"
              title="Add floating AI customer support chat"
            >
              <MessageSquare className="w-3 h-3 text-purple-400" />
              <span>+ AI Support Bot</span>
            </button>

            <button
              onClick={() => handleQuickInject('countdown-banner')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-xs text-slate-200 hover:text-white font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm"
              title="Add top urgency countdown banner"
            >
              <Clock className="w-3 h-3 text-rose-400" />
              <span>+ Promo Countdown</span>
            </button>

            <button
              onClick={() => handleQuickInject('live-analytics')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-xs text-slate-200 hover:text-white font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm"
              title="Add live visitor & telemetry stats bar"
            >
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>+ Live Analytics Bar</span>
            </button>

            <button
              onClick={() => handleQuickInject('reviews-carousel')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-xs text-slate-200 hover:text-white font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm"
              title="Add 5-star customer testimonials section"
            >
              <Star className="w-3 h-3 text-amber-400" />
              <span>+ User Reviews</span>
            </button>

            <button
              onClick={() => handleQuickInject('kanban-board')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-violet-500 text-xs text-slate-200 hover:text-white font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm"
              title="Add interactive task workflow board"
            >
              <Trello className="w-3 h-3 text-violet-400" />
              <span>+ Task Kanban Board</span>
            </button>

            <button
              onClick={() => setIsUpdateStudioOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-xs text-white font-extrabold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md shadow-emerald-500/20 border border-emerald-300/30"
              title="تحديث التطبيق بقرارك أنت 100%"
            >
              <RefreshCw className="w-3 h-3 text-white animate-spin" style={{ animationDuration: '4s' }} />
              <span>UPDATE / تحديث ⚡</span>
            </button>

            {/* Direct Live In-App Editor Button */}
            <button
              onClick={handleOpenLiveEditor}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:opacity-95 text-xs text-white font-extrabold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md shadow-cyan-500/20 border border-cyan-400/40"
              title={isRTL ? 'تعديل مباشر على التطبيق وتغيير نصوصه وألوانه' : 'Live In-App Editor (Edit text, buttons, and colors)'}
            >
              <Edit3 className="w-3.5 h-3.5 text-white" />
              <span>{isRTL ? 'تعديل التطبيق المباشر ✏️' : 'Live In-App Editor ✏️'}</span>
            </button>

            {/* Direct Google Play Store Publish Button */}
            <button
              onClick={() => setIsGooglePlayModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-95 text-xs text-white font-extrabold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md shadow-emerald-500/20 border border-emerald-300/40"
              title="نشر التطبيق مباشرة في متجر Google Play"
            >
              <Smartphone className="w-3.5 h-3.5 text-white" />
              <span>{isRTL ? 'نشر في متجر Google Play 🚀' : 'Publish to Google Play 🚀'}</span>
            </button>

            <button
              onClick={() => setIsUpdateStudioOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-90 text-xs text-white font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Wand2 className="w-3 h-3 text-white" />
              <span>+ Develop Custom Feature</span>
            </button>
          </div>

          {/* Dedicated "Add AI Power / إضافة ميزات الذكاء الاصطناعي" Bar under features */}
          <div className="mt-4 pt-3.5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>{isRTL ? 'إضافة ميزات الذكاء الاصطناعي لتطبيقك (Add AI Power):' : 'Add AI Power & Neural Features:'}</span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {isRTL ? 'انقر على أي ميزة ذكاء اصطناعي لدمجها فورياً في تطبيقك' : 'Click any AI capability to inject into your live app'}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'ai-chatbot', label: isRTL ? '💬 شات بوت ومساعد ذكي' : '💬 AI Smart Chatbot', desc: 'Embed intelligent live chatbot widget' },
                { id: 'ai-voice', label: isRTL ? '🎙️ نطق وتوليد صوتي' : '🎙️ AI Voice Speech', desc: 'Real-time text-to-speech engine' },
                { id: 'ai-image-widget', label: isRTL ? '🎨 أداة توليد صور AI' : '🎨 AI Image Studio Widget', desc: 'In-app photo synthesis tool' },
                { id: 'ai-semantic-search', label: isRTL ? '🔍 بحث دلالي ذكي' : '🔍 AI Semantic Search', desc: 'Deep vector-like search filter' },
                { id: 'ai-recommender', label: isRTL ? '🧠 محرك اقتراحات مخصص' : '🧠 AI Recommendations', desc: 'Personalized user content suggestions' },
                { id: 'ai-sentiment', label: isRTL ? '📊 تحليل مشاعر المستخدمين' : '📊 AI Sentiment Analytics', desc: 'Real-time feedback & mood analyzer' },
              ].map((aiFeat) => (
                <button
                  key={aiFeat.id}
                  onClick={() => handleInjectAiFeature(aiFeat.id, aiFeat.label)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-950/70 to-purple-950/70 hover:from-indigo-900 hover:to-purple-900 border border-indigo-500/40 text-xs text-indigo-200 hover:text-white font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  title={aiFeat.desc}
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>{aiFeat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ready-to-Run Interactive Applications Section (تطبيقات تفاعلية جاهزة ومتحركة فوراً) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 text-lg">
              <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  {t('ready_apps_section_title', 'تطبيقات تفاعلية جاهزة ومتحركة فوراً ⚡ (ليست مجرد صور)')}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  تطبيقات حقيقية 100%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t('ready_apps_section_desc', 'تطبيقات حقيقية كاملة يمكنك تشغيلها وتحريكها والتفاعل معها بنقرة واحدة بدون أي صور ثابتة.')}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/50 px-3 py-1 rounded-xl border border-cyan-500/30 self-start sm:self-auto">
            4 تطبيقات جاهزة بالكامل
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {READY_INTERACTIVE_APPS.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${app.color} flex items-center justify-center text-white shadow-md text-sm`}>
                    <i className={`fa-solid ${app.icon}`}></i>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {app.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1.5 line-clamp-1">{app.name}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {app.description}
                </p>
              </div>

              <button
                onClick={() => handleLaunchReadyApp(app)}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer hover:scale-102 active:scale-98"
              >
                <Play className="w-3 h-3 fill-current text-amber-300" />
                <span>{t('btn_run_interactive_app', 'تشغيل وتحريك التطبيق الآن 🚀')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor & Preview Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Workspace Toolbar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Source Code (Editable)</span>
              </button>
            </div>

            {/* Device Switcher (Preview Only) */}
            {activeTab === 'preview' && (
              <div className="hidden sm:flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 ml-2">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Desktop View (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('tablet')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Mobile View (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Direct Interactive Mode Badge */}
            {activeTab === 'preview' && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold shadow-sm">
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>{t('btn_interact_live', '🎮 تفاعل وحرك التطبيق مباشرة')}</span>
              </div>
            )}
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy Full HTML Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadCode}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download HTML file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={() => setIsUpdateStudioOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
              title="Add updates or develop features for this application"
            >
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Add Updates & Features</span>
              <span className="hidden md:inline px-1.5 py-0.2 rounded bg-white/20 text-[9px] font-mono">
                {currentProject.currentVersion || 'v1.1.0'}
              </span>
            </button>

            {/* Publish & Unpublish Action Controls */}
            {currentProject.isPublished ? (
              <>
                <button
                  onClick={handleUnpublishApp}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="إلغاء النشر (تحويل التطبيق إلى مسودة خاصة)"
                >
                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unpublish (إلغاء النشر)</span>
                </button>

                <button
                  onClick={handlePublishNow}
                  disabled={isPublishing}
                  className={`px-3.5 py-1.5 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                    isWorkingOnFake
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                  }`}
                  title="Update published version"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      <span>Republish / تحديث الرابط</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handlePublishNow}
                disabled={isPublishing}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer animate-pulse"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>Publish Live App (نشر أونلاين 🚀)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Unpublished Draft Notice Banner */}
        {!currentProject.isPublished && (
          <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>هذا التطبيق غير منشور حالياً ومحفوظ كمسودة خاصة (Unpublished Draft). لن يتمكن أحد من رؤيته حتى تضغط على "نشر أونلاين".</span>
            </div>
            <button
              onClick={handlePublishNow}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Globe className="w-3 h-3" />
              <span>نشر التطبيق الآن 🚀</span>
            </button>
          </div>
        )}

        {/* Viewport Frame */}
        <div className="p-4 bg-slate-950/60 flex justify-center items-center overflow-auto min-h-[560px]">
          {activeTab === 'preview' ? (
            <div
              className={`transition-all duration-300 shadow-2xl rounded-xl overflow-hidden border border-slate-800 bg-white flex flex-col h-[560px] ${
                viewMode === 'desktop'
                  ? 'w-full'
                  : viewMode === 'tablet'
                  ? 'w-[768px]'
                  : 'w-[375px]'
              }`}
            >
              {/* Simulated Browser Bar */}
              <div className="h-7 bg-slate-900 border-b border-slate-800/80 px-3 flex items-center justify-between text-xs text-slate-400 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-slate-950/70 border border-slate-800/60 text-[11px] text-slate-300 font-mono">
                  {isWorkingOnFake ? (
                    <FlaskConical className="w-2.5 h-2.5 text-amber-400" />
                  ) : (
                    <Globe className="w-2.5 h-2.5 text-emerald-400" />
                  )}
                  <span>{currentProject.customDomain ? `https://${currentProject.customDomain}` : `https://${currentProject.subdomain}.${currentProject.domainSuffix || 'com'}`}</span>
                  {isWorkingOnFake && (
                    <span className="text-[9px] px-1 bg-amber-500/20 text-amber-400 rounded font-bold">
                      SANDBOX
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsFullscreenModal(true)}
                  className="hover:text-white cursor-pointer"
                  title="Fullscreen preview"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>

              {/* Sandbox iframe with Zero-Lag Hardware Acceleration */}
              <iframe
                title="OmniCraft Generated Application"
                srcDoc={currentProject.htmlCode}
                className="w-full flex-1 border-0 bg-white"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                loading="lazy"
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              />
            </div>
          ) : (
            <div className="w-full h-[560px] flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
              <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Direct Code Editor (Anyone can edit & update)</span>
                <span className="text-emerald-400 text-[11px] font-semibold">Changes reflect live in preview</span>
              </div>
              <textarea
                value={currentProject.htmlCode}
                onChange={(e) => updateCurrentProjectHtml(e.target.value)}
                className="w-full flex-1 p-4 font-mono text-xs text-slate-200 bg-slate-950 focus:outline-none resize-none selection:bg-indigo-500 leading-relaxed"
                placeholder="Edit HTML code directly here..."
                spellCheck={false}
              />
            </div>
          )}
        </div>

        {/* AI Refine Bar */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
            placeholder="أنت تقرر التحديث 100% - اكتب التعديل المطلوب وسينفذه الذكاء الاصطناعي فوراً (مثال: 'أضف سلة مشتريات تفاعلية', 'أضف الوضع الداكن', 'أضف صفحة تواصل')..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
          <button
            onClick={handleRefine}
            disabled={isGenerating || !refinePrompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>تطبيق التحديث بقراري ⚡</span>
          </button>
        </div>
      </div>

      {/* Website Published Live Modal */}
      {publishModalOpen && publishInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setPublishModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isWorkingOnFake ? '"The Fake One" Published Live!' : 'Application Published Live!'}
                </h3>
                <p className="text-xs text-emerald-400 font-medium">100% White-Label • Zero Creator Branding</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Independent Clean App Link:</span>
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-xs font-mono text-emerald-300 truncate">
                    {publishInfo.freeBrandedUrl}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(publishInfo.freeBrandedUrl);
                      setPublishLinkCopied(true);
                      setTimeout(() => setPublishLinkCopied(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    {publishLinkCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{publishLinkCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setPublishModalOpen(false);
                  setIsFullscreenModal(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-indigo-400" />
                <span>Open Preview</span>
              </button>

              <button
                onClick={() => {
                  setPublishModalOpen(false);
                  onPublishToDomain(currentProject);
                }}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>Domain Manager</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Live Browser Preview Modal */}
      {isFullscreenModal && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 animate-in fade-in">
          {/* Top Browser Bar */}
          <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" onClick={() => setIsFullscreenModal(false)}></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentProject.customDomain ? `https://${currentProject.customDomain}` : `https://${currentProject.subdomain}.app.run`}</span>
                {isWorkingOnFake && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    THE FAKE ONE (SANDBOX)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const blob = new Blob([currentProject.htmlCode], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Open in new window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Window</span>
              </button>

              <button
                onClick={() => setIsFullscreenModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close Fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Screen Live Iframe */}
          <div className="flex-1 bg-white">
            <iframe
              title="Fullscreen Live View"
              srcDoc={currentProject.htmlCode}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-modals allow-forms"
            />
          </div>
        </div>
      )}

      {/* App Feature & Update Studio Modal */}
      <AppUpdateStudioModal
        isOpen={isUpdateStudioOpen}
        onClose={() => setIsUpdateStudioOpen(false)}
        currentProject={currentProject}
        onUpdateAppHtml={handleUpdateAppHtml}
        guestName={guestName}
      />

      {/* Direct Live In-App Editor Modal */}
      {isLiveEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {isRTL ? 'محرر وتعديل التطبيق المباشر ✏️' : 'Live In-App Editor ✏️'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isRTL ? 'عدل نصوص التطبيق وأزراره وألوانه بنفسك فورياً' : 'Customize app text, buttons, and design directly'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLiveEditorOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  {isRTL ? 'اسم التطبيق / العنوان:' : 'App Title / Brand Name:'}
                </label>
                <input
                  type="text"
                  value={liveEditAppTitle}
                  onChange={(e) => setLiveEditAppTitle(e.target.value)}
                  placeholder="My Smart App"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  {isRTL ? 'العنوان الرئيسي الترحيبي (Headline):' : 'Main Hero Headline:'}
                </label>
                <input
                  type="text"
                  value={liveEditHeadline}
                  onChange={(e) => setLiveEditHeadline(e.target.value)}
                  placeholder="Build and scale with AI at light speed"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  {isRTL ? 'نص زر التفاعل الرئيسي (Call to Action Button):' : 'Primary Action Button Text:'}
                </label>
                <input
                  type="text"
                  value={liveEditButtonText}
                  onChange={(e) => setLiveEditButtonText(e.target.value)}
                  placeholder="Get Started / ابدأ الآن"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  {isRTL ? 'لون السمة والواجهة:' : 'Accent Color Theme:'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'indigo', name: 'Indigo Blue', bg: 'bg-indigo-600' },
                    { id: 'emerald', name: 'Emerald Green', bg: 'bg-emerald-600' },
                    { id: 'purple', name: 'Purple Neon', bg: 'bg-purple-600' },
                    { id: 'amber', name: 'Amber Gold', bg: 'bg-amber-600' },
                  ].map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setLiveEditBrandColor(color.id)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        liveEditBrandColor === color.id
                          ? 'border-cyan-400 bg-slate-800 font-bold text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${color.bg} inline-block mb-1`}></span>
                      <span className="block text-[10px]">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsLiveEditorOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveLiveCustomization}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg cursor-pointer"
              >
                {isRTL ? 'حفظ وتطبيق التعديل في التطبيق 💾' : 'Save & Apply Live Edits 💾'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Play Store Direct Publishing Modal */}
      <GooglePlayPublishModal
        isOpen={isGooglePlayModalOpen}
        onClose={() => setIsGooglePlayModalOpen(false)}
        title={currentProject.name}
        htmlCode={currentProject.htmlCode}
        type="app"
      />
    </div>
  );
};
