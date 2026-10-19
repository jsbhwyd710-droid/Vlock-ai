import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Trash2, 
  Code, 
  ArrowUpRight, 
  Wand2, 
  Zap,
  Brain,
  Terminal,
  TrendingUp,
  Image as ImageIcon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Download,
  ExternalLink,
  Loader2,
  Gamepad2,
  Play,
  X
} from 'lucide-react';
import { ChatMessage, ActiveTab } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

interface AiChatProps {
  onNavigateToTab: (tab: ActiveTab, prompt?: string) => void;
  consumeCredit: () => boolean;
}

export const AiChat: React.FC<AiChatProps> = ({ onNavigateToTab, consumeCredit }) => {
  const { isRTL } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'model',
      content: `أهلاً بك يا غالي! أنا هنا معك مثل صاحبك المقرب 🤝 مدعوم بأحدث وأقوى محركات الذكاء الاصطناعي: **Gemini 9 Ultra** و **Claude 3.7 Sonnet** و **ChatGPT-4o** و **Nano Banana 4**.

تقدر تتكلم معي بعفوية مثل صاحبك عادي:
1. 🎮 **اصنع لي ألعاب**: قل لي "اصنع لي ألعاب" وسأبرمج لك أي لعبة (ببجي، سباق، زومبي) ونشغلها فوراً!
2. 🎨 **اصنع صورة بفكرتك**: قل لي "اصنع صورة بفكرتي..." واكتب أي فكرة ببالك وسأرسمها لك فوراً بجودة 8K!
3. 🎁 **كودات وهدايا مجانية**: استرد كود \`OMNI2026\` أو \`GEMINI9\` في تبويب الجوائز لشحن رصيدك فوراً!
4. 🚀 **برمجة وبناء تطبيقات ومواقع كاملة** بأحدث الأكواد.
5. 🎙️ **التحدث الصوتي المباشر** عبر الميكروفون.

إيش حاب نبدأ فيه اليوم يا صديقي؟`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'Gemini 9 Ultra',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [persona, setPersona] = useState<string>('friend');
  const [model, setModel] = useState<string>('Gemini 9 Ultra');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // Custom Image Idea Modal
  const [isCustomIdeaModalOpen, setIsCustomIdeaModalOpen] = useState<boolean>(false);
  const [customIdeaInput, setCustomIdeaInput] = useState<string>('');
  const [customIdeaEngine, setCustomIdeaEngine] = useState<string>('Nano Banana 4');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, isGeneratingImage]);

  // Voice speech synthesis readback
  const speakMessage = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (activeSpeakingId === id) {
      window.speechSynthesis.cancel();
      setActiveSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.rate = 1.0;
    utter.onend = () => setActiveSpeakingId(null);
    utter.onerror = () => setActiveSpeakingId(null);
    setActiveSpeakingId(id);
    window.speechSynthesis.speak(utter);
  };

  // Voice recognition input
  const toggleListening = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert(isRTL ? 'متصفحك لا يدعم التعرف الصوتي المباشر. يرجى استخدام متصفح Chrome.' : 'Speech recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = isRTL ? 'ar-SA' : 'en-US';
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${spoken}` : spoken));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      console.warn('Voice input error:', err);
      setIsListening(false);
    }
  };

  // Direct In-Chat Image Generation
  const handleGenerateInChatImage = async (customPrompt?: string, chosenEngine = 'Nano Banana 4') => {
    let promptText = (customPrompt || input).trim();
    if (!promptText) {
      setIsCustomIdeaModalOpen(true);
      return;
    }

    // Clean any prefixes if user typed casually
    promptText = promptText
      .replace(/^اصنع لي صورة بفكرتي[:\s]*/i, '')
      .replace(/^اصنع صورة بفكرتي[:\s]*/i, '')
      .replace(/^صورة بفكرتي[:\s]*/i, '')
      .replace(/^بدي صورة بفكرتي[:\s]*/i, '')
      .replace(/^بدي صورة[:\s]*/i, '')
      .replace(/^ارسم لي[:\s]*/i, '')
      .replace(/^ارسم[:\s]*/i, '')
      .replace(/^اصنع صورة[:\s]*/i, '')
      .replace(/^generate image[:\s]*/i, '')
      .replace(/^draw[:\s]*/i, '')
      .trim();

    if (!promptText) {
      promptText = 'A majestic golden lion with glowing blue eyes perched on a snowy mountain cliff at sunset';
    }

    if (!consumeCredit()) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: isRTL ? `🎨 اصنع لي صورة بفكرتي: "${promptText}"` : `🎨 Generate image with my idea: "${promptText}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsGeneratingImage(true);

    try {
      const result = await api.generatePhoto(promptText, chosenEngine, '1:1');
      const modelMsg: ChatMessage = {
        id: 'model_' + Date.now(),
        role: 'model',
        content: isRTL 
          ? `يا سلام على فكرتك الخرافية يا غالي! 🎨✨\nصنعت لك صورتك بالضبط بفكرتك: "${promptText}" بجودة فائقة 8K عبر محرك ${chosenEngine} ومحرك ${model}. تفضل عاينها وحملها أو افتحها في الاستوديو!`
          : `Awesome idea! 🎨✨ Here is your image created with your exact vision: "${promptText}" using ${chosenEngine} & ${model} in 8K resolution!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: `${model} + ${chosenEngine}`,
        imageUrl: result.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=85',
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const content = textToSend || input;
    if (!content.trim() || isSending || isGeneratingImage) return;

    const lower = content.toLowerCase().trim();

    // 1. Check if user is asking for games: "اصنع لي العاب"
    const isGameRequest = 
      lower.includes('اصنع لي العاب') ||
      lower.includes('اصنع لي لعبة') ||
      lower.includes('سوي لي العاب') ||
      lower.includes('سوي لي لعبة') ||
      lower.includes('اعمل لي لعبة') ||
      lower.includes('بدي لعبة') ||
      lower.includes('بدي العاب') ||
      lower.includes('اصنع لعبة') ||
      lower.includes('العاب') ||
      lower.includes('لعبة') ||
      lower.includes('make me a game') ||
      lower.includes('make me games') ||
      lower.includes('create a game') ||
      lower.includes('create games') ||
      lower.includes('build game');

    if (isGameRequest) {
      if (!consumeCredit()) return;

      const userMessage: ChatMessage = {
        id: 'user_' + Date.now(),
        role: 'user',
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setIsSending(true);

      setTimeout(() => {
        const gameModelMessage: ChatMessage = {
          id: 'model_' + Date.now(),
          role: 'model',
          content: isRTL
            ? `أبشر يا غالي من عيوني! 🎮 طلبت أصنع لك ألعاب؟\nأنا هنا معك مثل صاحبك وصنعت وبرمجت لك ألعاب خرافية بمحرك Gemini 9 Gaming Engine! اختر أي لعبة من الألعاب أدناه وسأنقلك فوراً لاستوديو الألعاب لتلعبها وتعدل في قواعدها وفيزيائها كما تحب ⚡`
            : `You got it, my friend! 🎮 You asked me to make games?\nI have crafted and coded real playable games for you powered by Gemini 9 Gaming Engine! Pick any game below to launch directly into Game Studio:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: `${model} Gaming Engine`,
          gameLauncher: {
            prompt: content,
            suggestions: [
              { title: isRTL ? '🪂 ببجي باتل رويال (PUBG Survival)' : '🪂 PUBG Battle Royale', prompt: 'لعبة مثل ببجي حرب وبقاء ولوت وزون يتقلص وأسلحة قناصة', icon: '🪂' },
              { title: isRTL ? '🏎️ سباق سيارات نيد فور سبيد (Nitro 3D Racing)' : '🏎️ Nitro 3D Highway Racing', prompt: 'لعبة سباق سيارات رياضية فائقة السرعة مع نيترو وتفادي السيارات', icon: '🏎️' },
              { title: isRTL ? '🧟 حرب نجاة الزومبي (Zombie Warfare)' : '🧟 Zombie Warfare Defense', prompt: 'لعبة نجاة من الزومبي أسلحة ورشاشات ودفاع عن المعسكر', icon: '🧟' },
              { title: isRTL ? '⚔️ قتال شوارع وأكشن (Street Fighter)' : '⚔️ Street Fighter Action', prompt: 'لعبة قتال شوارع وملاكمة مع ضربات خاصة وحركات كومبو', icon: '⚔️' },
              { title: isRTL ? '🚀 غزو الفضاء الكوني (Galaxy Space Attack)' : '🚀 Galaxy Space Attack', prompt: 'لعبة حرب الفضاء طائرات ليزر ودروع وشهب', icon: '🚀' },
              { title: isRTL ? '🐦 مغامرة الطائر الخارق (Flappy Bird Arcade)' : '🐦 Flappy Bird Arcade', prompt: 'لعبة الطائر قفز وأنابيب وجمع نقاط', icon: '🐦' },
            ]
          }
        };
        setMessages([...newMessages, gameModelMessage]);
        setIsSending(false);
      }, 700);
      return;
    }

    // 2. Check if user is asking for an image in chat: "اصنع صورة بفكرتي" / "ارسم" / "صورة"
    if (
      lower.startsWith('ارسم') || 
      lower.startsWith('صورة') || 
      lower.startsWith('اصنع صورة') || 
      lower.includes('صورة بفكرتي') ||
      lower.includes('فكرتي') ||
      lower.startsWith('draw') || 
      lower.startsWith('generate image') ||
      lower.includes('ارسم لي')
    ) {
      handleGenerateInChatImage(content);
      return;
    }

    if (!consumeCredit()) return;

    const userMessage: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsSending(true);

    try {
      const response = await api.sendChat(newMessages, persona, model);
      const modelMessage: ChatMessage = {
        id: 'model_' + Date.now(),
        role: 'model',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: response.model || model,
      };
      setMessages([...newMessages, modelMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'msg_welcome',
        role: 'model',
        content: isRTL ? 'تم مسح المحادثة! إيش حاب نبني أو نصنع الحين يا صاحبي؟ 🤝' : 'Chat cleared! What shall we build together now? 🤝',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model,
      },
    ]);
  };

  const starterSuggestions = [
    { label: isRTL ? '🎮 اصنع لي العاب (PUBG / سباق / زومبي)' : '🎮 Make Me Games (PUBG/Racing)', isGame: true, prompt: 'اصنع لي العاب' },
    { label: isRTL ? '🎨 اصنع صورة بفكرتي الخاصة (8K)' : '🎨 Image with My Custom Idea (8K)', isCustomIdea: true },
    { label: isRTL ? '🎁 كودات وهدايا مجانية (Giveaway)' : '🎁 Free Giveaways & Codes', tab: 'giveaway' as ActiveTab },
    { label: isRTL ? '📱 اصنع تطبيق متجر كامل' : '📱 Build E-Commerce Store', tab: 'builder' as ActiveTab, prompt: 'Build an interactive fashion store app with shopping cart and clean layout' },
    { label: isRTL ? '🎬 فيديو إعلاني سينمائي 4K' : '🎬 4K Cinema Video Trailer', tab: 'video' as ActiveTab, prompt: 'Cinematic teaser trailer for a futuristic sci-fi city' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Chat Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[750px]">
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 text-lg font-black">
              🤝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">
                  {isRTL ? 'شات الذكاء الاصطناعي (صاحبك المقرب) 🤝' : 'AI Best Friend & Creator Studio 🤝'}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {model} ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isRTL ? 'تحدث معه مثل صاحبك عادي: اطلب ألعاب أو صور بفكرتك أو تطبيقات فوراً' : 'Talk naturally like your friend: make games, custom idea photos, or apps'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Model Selector: Gemini 9 + ALL Claude Versions */}
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-slate-950 border border-indigo-500/50 text-xs text-indigo-300 font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-400 cursor-pointer"
            >
              <option value="Gemini 9 Ultra">✨ Gemini 9 Ultra (الخارق)</option>
              <option value="Claude 3.7 Sonnet">🧠 Claude 3.7 Sonnet (Hybrid)</option>
              <option value="Claude 3.5 Sonnet">⚡ Claude 3.5 Sonnet (Fast)</option>
              <option value="Claude 3 Opus">🛡️ Claude 3 Opus (Deep Logic)</option>
              <option value="Claude 3.5 Haiku">🚀 Claude 3.5 Haiku (Instant)</option>
              <option value="ChatGPT-4o">🤖 ChatGPT-4o (OpenAI)</option>
            </select>

            {/* Persona Switcher */}
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="friend">🤝 صاحبك المقرب (Best Friend)</option>
              <option value="assistant">🤖 المساعد العام (Universal)</option>
              <option value="coder">💻 مهندس البرمجة (Senior Coder)</option>
              <option value="designer">🎨 المصمم الإبداعي (Creative)</option>
            </select>

            <button
              onClick={handleClear}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear Chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isModel = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[90%] ${isModel ? 'mr-auto rtl:mr-0 rtl:ml-auto' : 'ml-auto rtl:ml-0 rtl:mr-auto flex-row-reverse'}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center text-xs font-bold shadow-md ${
                    isModel
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                  }`}
                >
                  {isModel ? '🤖' : '👤'}
                </div>

                <div className="space-y-2 flex-1">
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                      isModel
                        ? 'bg-slate-950/90 border border-slate-800 text-slate-200'
                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                    {/* Interactive Game Studio Launcher Card (عندما يطلب: اصنع لي العاب) */}
                    {msg.gameLauncher && (
                      <div className="mt-3.5 p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border-2 border-amber-500/50 shadow-xl space-y-3.5 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl animate-bounce">🎮</span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-amber-300">
                                {isRTL ? 'ألعاب جاهزة ومبرمجة لك فوراً (Game Studio) ⚡' : 'Games Ready & Coded For You (Game Studio) ⚡'}
                              </h4>
                              <p className="text-[10px] text-slate-400">
                                {isRTL ? 'انقر على أي لعبة لتشغيلها ولعبها والتعديل عليها بالذكاء الاصطناعي' : 'Click any game to launch, play, and edit in Game Studio'}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-extrabold">
                            جاهزة 100% للعب
                          </span>
                        </div>

                        {/* Quick Game Picks Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(msg.gameLauncher.suggestions || []).map((game, gIdx) => (
                            <button
                              key={gIdx}
                              onClick={() => onNavigateToTab('games', game.prompt)}
                              className="p-2.5 rounded-xl bg-slate-950/90 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500 text-right rtl:text-right ltr:text-left transition-all cursor-pointer group flex items-start gap-2.5 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                            >
                              <span className="text-xl shrink-0 group-hover:scale-125 transition-transform">{game.icon}</span>
                              <div className="overflow-hidden">
                                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                  {game.title}
                                </div>
                                <div className="text-[10px] text-slate-400 line-clamp-1">{game.prompt}</div>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Direct 1-Click Game Studio Launcher */}
                        <button
                          onClick={() => onNavigateToTab('games', msg.gameLauncher?.prompt || 'لعبة باتل رويال')}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-95 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] border border-amber-300/40"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>{isRTL ? '🚀 تشغيل وبرمجة هذه اللعبة في استوديو الألعاب فوراً ⚡' : '🚀 Launch & Code in Game Studio Now ⚡'}</span>
                        </button>
                      </div>
                    )}

                    {/* In-Chat Image Showcase (عندما يطلب صورة بفكرته) */}
                    {msg.imageUrl && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                        <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 group shadow-md">
                          <img
                            src={msg.imageUrl}
                            alt="AI Generated"
                            className="w-full max-h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 px-2.5 py-1 rounded-full bg-slate-950/85 text-[10px] font-mono text-cyan-300 border border-cyan-500/40 font-black backdrop-blur-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                            <span>🍌 Nano Banana 4 • 8K</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={msg.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            download="omnicraft-ai-image.jpg"
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                          >
                            <Download className="w-3 h-3 text-cyan-400" />
                            <span>{isRTL ? 'تحميل 💾' : 'Download'}</span>
                          </a>
                          <button
                            onClick={() => onNavigateToTab('photo', msg.content)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{isRTL ? 'فتح في استوديو الصور' : 'Open in Photo Studio'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`flex items-center gap-2 px-2 text-[10px] text-slate-500 ${isModel ? 'justify-start' : 'justify-end'}`}>
                    <span>{msg.timestamp}</span>
                    {msg.model && <span>• {msg.model}</span>}
                    {isModel && (
                      <>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-slate-300 ml-1 flex items-center gap-0.5 cursor-pointer"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? (isRTL ? 'تم النسخ' : 'Copied') : (isRTL ? 'نسخ' : 'Copy')}</span>
                        </button>
                        <button
                          onClick={() => speakMessage(msg.id, msg.content)}
                          className={`hover:text-cyan-300 ml-1 flex items-center gap-0.5 cursor-pointer ${
                            activeSpeakingId === msg.id ? 'text-cyan-400 font-bold' : ''
                          }`}
                          title="استمع لصوت الـ AI"
                        >
                          {activeSpeakingId === msg.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          <span>{activeSpeakingId === msg.id ? (isRTL ? 'إيقاف' : 'Stop') : (isRTL ? 'نطق 🔊' : 'Speak')}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {(isSending || isGeneratingImage) && (
            <div className="flex gap-3 mr-auto rtl:mr-0 rtl:ml-auto max-w-[85%]">
              <div className="w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              </div>
              <div className="p-4 rounded-3xl bg-slate-950/90 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>
                  {isGeneratingImage 
                    ? (isRTL ? 'جاري تحويل فكرتك الخاصة إلى صورة واقعية 8K بمحرك Nano Banana 4... 🎨' : 'Synthesizing your custom idea with Nano Banana 4 in 8K... 🎨')
                    : (isRTL ? 'صاحبك الذكي يجهز لك الرد والألعاب المطلوبة... 💭' : 'Crafting response and preparing your games... 💭')}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider shrink-0">
            {isRTL ? 'أفكار سريعة:' : 'Quick Ideas:'}
          </span>
          {starterSuggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.isCustomIdea) {
                  setIsCustomIdeaModalOpen(true);
                } else if (item.isGame) {
                  handleSend(item.prompt);
                } else if (item.tab) {
                  onNavigateToTab(item.tab, item.prompt);
                }
              }}
              className="text-[11px] px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white shrink-0 flex items-center gap-1 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>{item.label}</span>
              <ArrowUpRight className="w-3 h-3 text-indigo-400" />
            </button>
          ))}
        </div>

        {/* Input Bar with Image Generation & Voice */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          {/* Dedicated "صورة بفكرتي" Button */}
          <button
            type="button"
            onClick={() => setIsCustomIdeaModalOpen(true)}
            disabled={isGeneratingImage || isSending}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/50 hover:bg-cyan-600/50 text-cyan-300 hover:text-white transition-all cursor-pointer shrink-0 shadow-md flex items-center gap-1.5 text-xs font-extrabold"
            title="اصنع صورة بفكرتك الخاصة (Nano Banana 4)"
          >
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>{isRTL ? 'صورة بفكرتي 🎨' : 'Image with Idea 🎨'}</span>
          </button>

          {/* Quick "اصنع لي العاب" Button */}
          <button
            type="button"
            onClick={() => handleSend(isRTL ? 'اصنع لي العاب' : 'make me games')}
            disabled={isGeneratingImage || isSending}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600/30 to-orange-600/30 border border-amber-500/50 hover:bg-amber-600/50 text-amber-300 hover:text-white transition-all cursor-pointer shrink-0 shadow-md hidden sm:flex items-center gap-1.5 text-xs font-extrabold"
            title="اصنع لي العاب فوراً (Game Studio)"
          >
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>{isRTL ? 'اصنع لي ألعاب 🎮' : 'Make Games 🎮'}</span>
          </button>

          {/* Voice Input Microphone */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="تحدث بصوتك مع AI"
          >
            {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-rose-400" />}
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder={isRTL ? 'تكلم مع صاحبك، اكتب فكرة صورة، أو اكتب: "اصنع لي العاب" (Enter للإرسال)...' : 'Talk with your friend, request an image idea, or say "make me games"...'}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
          />

          <button
            onClick={() => handleSend()}
            disabled={isSending || isGeneratingImage || !input.trim()}
            className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 disabled:opacity-50 text-white flex items-center justify-center transition-all shrink-0 shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Modal: صمم صورة بفكرتك الخاصة (Create Image with My Idea) */}
      {isCustomIdeaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {isRTL ? 'صمم صورتك بفكرتك الخاصة 🎨' : 'Create Image with Your Custom Idea 🎨'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isRTL ? 'اكتب أي فكرة في بالك وسيقوم الذكاء الاصطناعي برسمها لك فوراً' : 'Describe your vision and AI will synthesize it in 8K'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomIdeaModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isRTL ? 'فكرتك الخاصة بالصورة بالتفصيل:' : 'Your Custom Image Idea:'}
                </label>
                <textarea
                  rows={4}
                  value={customIdeaInput}
                  onChange={(e) => setCustomIdeaInput(e.target.value)}
                  placeholder={isRTL ? 'مثال: سيارة رياضية ذهبية تسير بسرعة في شوارع باريس وقت الغروب، أو حصان بأجنحة نورانية فوق قمم الجبال...' : 'e.g. A futuristic golden hypercar cruising through neon streets of Tokyo at sunset...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
                />
              </div>

              {/* Quick Inspiration Idea Chips */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {isRTL ? 'أفكار ملهمة يمكنك اختيارها:' : 'Inspiration ideas:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    isRTL ? 'ذئب أبيض متوحش بعيون زرقاء على جبل جليدي' : 'White wolf with blue eyes on snowy mountain',
                    isRTL ? 'قصر أندلسي فاخر مع نافورة ماء في حديقة خضراء' : 'Luxury palace with marble fountains and gardens',
                    isRTL ? 'سفينة فضاء فضية تبحر قرب كوكب المشتري' : 'Silver spaceship near Jupiter rings',
                    isRTL ? 'صقر ذهبي يحلق فوق الصحراء والرمال الذهبية' : 'Golden falcon soaring over golden dunes',
                  ].map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomIdeaInput(idea)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-white cursor-pointer transition-colors"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Engine Selector */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400 font-semibold">
                  {isRTL ? 'محرك التوليد:' : 'AI Model Engine:'}
                </span>
                <select
                  value={customIdeaEngine}
                  onChange={(e) => setCustomIdeaEngine(e.target.value)}
                  className="bg-slate-950 border border-cyan-500/50 text-xs text-cyan-300 font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="Nano Banana 4">🍌 Nano Banana 4 (الجيل الأحدث 8K)</option>
                  <option value="Nano Banana 3">🍌 Nano Banana 3 (سريع)</option>
                  <option value="Gemini 9 Ultra Vision">✨ Gemini 9 Ultra Vision</option>
                  <option value="Google Imagen 3">🎨 Google Imagen 3 HD</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCustomIdeaModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!customIdeaInput.trim()) return;
                  setIsCustomIdeaModalOpen(false);
                  handleGenerateInChatImage(customIdeaInput, customIdeaEngine);
                }}
                disabled={!customIdeaInput.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-cyan-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isRTL ? 'توليد صورتي بفكرتي الآن ⚡' : 'Generate My Idea Now ⚡'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
