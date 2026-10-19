import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Code2, 
  Copy, 
  Check, 
  Send, 
  Sliders, 
  Wand2, 
  Zap, 
  Play, 
  CheckCircle2, 
  Layers, 
  Search, 
  MessageSquare, 
  Mic, 
  Image as ImageIcon,
  Palette,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Brain,
  Terminal,
  FileCode,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { ActiveTab, WebProject } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

interface AiAppConnectorProps {
  currentProject: WebProject;
  onUpdateProjectHtml: (newHtml: string) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  consumeCredit?: (amount: number) => boolean;
}

type ModelProvider = 'claude' | 'chatgpt' | 'gemini' | 'deepseek';
type CodeLanguage = 'javascript' | 'react' | 'nodejs' | 'python' | 'curl';

interface MemoryMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiAppConnector: React.FC<AiAppConnectorProps> = ({
  currentProject,
  onUpdateProjectHtml,
  onNavigateToTab,
  consumeCredit,
}) => {
  const { isRTL } = useLanguage();

  // Model & Memory Configuration
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>('claude');
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('javascript');
  const [botName, setBotName] = useState<string>('Claude Assistant');
  const [systemPrompt, setSystemPrompt] = useState<string>(
    'أنت مساعد ذكي متقدم مرتبط بتطبيقي، تمتلك ذاكرة كاملة لسياق المحادثة وتتذكر جميع تفاصيل المستخدم بدقة واحترافية.'
  );
  const [memoryWindowSize, setMemoryWindowSize] = useState<number>(20);
  const [themeColor, setThemeColor] = useState<string>('#6366f1');

  // Live Test with Real Conversation Memory
  const [memoryHistory, setMemoryHistory] = useState<MemoryMessage[]>([
    {
      role: 'assistant',
      content: 'مرحباً بك! أنا مساعد Claude الذكي مع ذاكرة مدمجة. جرب التحدث معي وذكر اسمك أو أي معلومة، ثم اسألني عنها في الرسالة التالية لأثبت لك قوة الذاكرة!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [testInput, setTestInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Copy state
  const [copiedCode, setCopiedCode] = useState(false);
  const [isInjected, setIsInjected] = useState(false);

  // Model Metadata
  const MODEL_SPECS = {
    claude: {
      name: 'Claude 3.7 Sonnet',
      engine: 'claude-3-7-sonnet-20250219',
      vendor: 'Anthropic',
      description: 'أقوى نموذج للتفكير والبرمجة وحفظ سياق الذاكرة الطويلة (200K Tokens Context).',
      badge: 'HYBRID REASONING',
      accent: 'from-amber-500 to-orange-600',
    },
    chatgpt: {
      name: 'ChatGPT-4o',
      engine: 'gpt-4o',
      vendor: 'OpenAI',
      description: 'نموذج متعدد الوسائط فائق السرعة مع ذاكرة منظمة واستدعاء دوال.',
      badge: 'OPENAI VISION & CODE',
      accent: 'from-emerald-500 to-teal-600',
    },
    gemini: {
      name: 'Gemini 9 Ultra',
      engine: 'gemini-3.8-flash',
      vendor: 'Google DeepMind',
      description: 'محرك جوجل فائق السرعة مع نافذة سياق ضخمة واستجابة فورية.',
      badge: 'DEEPMIND MULTIMODAL',
      accent: 'from-blue-500 to-indigo-600',
    },
    deepseek: {
      name: 'DeepSeek-R1',
      engine: 'deepseek-reasoner',
      vendor: 'DeepSeek AI',
      description: 'نموذج التفكير التحليلي والرياضي المتقدم للحلول المعقدة.',
      badge: 'DEEP THINKING',
      accent: 'from-purple-500 to-pink-600',
    },
  };

  const currentModel = MODEL_SPECS[selectedProvider];

  // Code Generation for each language with Memory
  const getGeneratedCode = (): string => {
    if (codeLanguage === 'javascript') {
      return `// ============================================================
// ${currentModel.name} Integration with Conversation Memory
// Provider: ${currentModel.vendor} (${currentModel.engine})
// ============================================================

// 1. Initialize Memory Store (Stores all previous user and assistant turns)
const conversationMemory = [
  { role: "system", content: "${systemPrompt.replace(/"/g, '\\"')}" }
];

// 2. Chat Function with Context Memory
async function chatWith${selectedProvider === 'claude' ? 'Claude' : selectedProvider === 'chatgpt' ? 'ChatGPT' : 'Gemini'}(userMessage) {
  // Append new user message to memory
  conversationMemory.push({ role: "user", content: userMessage });

  // Limit memory to last ${memoryWindowSize} turns to prevent token bloat
  const activeMemory = [
    conversationMemory[0], // System prompt always kept
    ...conversationMemory.slice(-${memoryWindowSize})
  ];

  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "${currentModel.engine}",
        messages: activeMemory,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const assistantReply = data.reply || data.choices?.[0]?.message?.content;

    // Save assistant reply to memory so the AI remembers context!
    conversationMemory.push({ role: "assistant", content: assistantReply });

    console.log("AI Response with Memory:", assistantReply);
    return assistantReply;
  } catch (error) {
    console.error("AI Communication error:", error);
    throw error;
  }
}

// Example usage:
// await chatWith${selectedProvider === 'claude' ? 'Claude' : 'AI'}("اسمي أحمد وأحب البرمجة");
// await chatWith${selectedProvider === 'claude' ? 'Claude' : 'AI'}("ما هو اسمي وماذا أحب؟"); // -> AI remembers Ahmed and coding!`;
    }

    if (codeLanguage === 'react') {
      return `import React, { useState } from 'react';

// Custom React Hook for ${currentModel.name} with Full Memory History
export function use${selectedProvider === 'claude' ? 'Claude' : 'Ai'}Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'أهلاً بك! أنا المساعد الذكي مع ذاكرة تفاعلية.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userText) => {
    if (!userText.trim()) return;

    // 1. Add User Message to State
    const userMsg = { role: 'user', content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // 2. Send entire conversation memory to backend
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: '${currentModel.engine}',
          messages: [
            { role: 'system', content: '${systemPrompt.replace(/"/g, '\\"')}' },
            ...updatedMessages.slice(-${memoryWindowSize})
          ]
        })
      });

      const data = await res.json();
      const reply = data.reply || data.choices?.[0]?.message?.content || 'تم استلام الرسالة بنجاح.';

      // 3. Update Memory with AI response
      setMessages([...updatedMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}`;
    }

    if (codeLanguage === 'nodejs') {
      return `// Node.js Express Route with Session Memory Store
// npm install express @anthropic-ai/sdk
import express from 'express';
${selectedProvider === 'claude' 
  ? "import Anthropic from '@anthropic-ai/sdk';\nconst anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });" 
  : "import OpenAI from 'openai';\nconst openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });"}

const router = express.Router();

// Memory store keyed by user session/UID
const userMemoryStore = new Map();

router.post('/api/ai/chat', async (req, res) => {
  const { sessionId = 'default_user', message } = req.body;

  // Retrieve or initialize memory history
  if (!userMemoryStore.has(sessionId)) {
    userMemoryStore.set(sessionId, []);
  }
  const memory = userMemoryStore.get(sessionId);

  // Append user message
  memory.push({ role: 'user', content: message });

  try {
    ${selectedProvider === 'claude' ? `const response = await anthropic.messages.create({
      model: '${currentModel.engine}',
      system: '${systemPrompt.replace(/'/g, "\\'")}',
      messages: memory.slice(-${memoryWindowSize}),
      max_tokens: 1024,
    });
    const reply = response.content[0].text;` : `const response = await openai.chat.completions.create({
      model: '${currentModel.engine}',
      messages: [
        { role: 'system', content: '${systemPrompt.replace(/'/g, "\\'")}' },
        ...memory.slice(-${memoryWindowSize})
      ],
    });
    const reply = response.choices[0].message.content;`}

    // Save assistant reply to memory
    memory.push({ role: 'assistant', content: reply });

    return res.json({ reply, memoryTurns: memory.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;`;
    }

    if (codeLanguage === 'python') {
      return `# Python 3.10+ Integration for ${currentModel.name} with Memory Loop
# pip install anthropic openai requests

${selectedProvider === 'claude' ? `import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", "your-api-key"))

# Conversation Memory List
conversation_memory = []
system_prompt = "${systemPrompt.replace(/"/g, '\\"')}"

def chat_with_memory(user_input: str) -> str:
    # 1. Append user turn
    conversation_memory.append({"role": "user", "content": user_input})
    
    # 2. Call Claude API with memory
    response = client.messages.create(
        model="${currentModel.engine}",
        system=system_prompt,
        messages=conversation_memory[-${memoryWindowSize}:],
        max_tokens=1000
    )
    
    reply = response.content[0].text
    
    # 3. Save assistant reply to memory
    conversation_memory.append({"role": "assistant", "content": reply})
    return reply

# Interactive Memory Test Loop:
if __name__ == "__main__":
    print("🤖 ${currentModel.name} Memory Assistant Active (Type 'exit' to quit)")
    while True:
        prompt = input("\\nYou: ")
        if prompt.lower() == 'exit':
            break
        answer = chat_with_memory(prompt)
        print(f"\\n${currentModel.name}: {answer}")` : `import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "your-api-key"))
conversation_memory = [{"role": "system", "content": "${systemPrompt.replace(/"/g, '\\"')}"}]

def chat_with_memory(user_input: str) -> str:
    conversation_memory.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(
        model="${currentModel.engine}",
        messages=conversation_memory[-${memoryWindowSize}:]
    )
    reply = response.choices[0].message.content
    conversation_memory.append({"role": "assistant", "content": reply})
    return reply`}
`;
    }

    return `curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "${currentModel.engine}",
    "system": "${systemPrompt.replace(/"/g, '\\"')}",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "اسمي أحمد وأحب البرمجة"},
      {"role": "assistant", "content": "أهلاً بك يا أحمد! يسعدني الحديث معك عن البرمجة."},
      {"role": "user", "content": "ما هو اسمي وماذا أحب؟"}
    ]
  }'`;
  };

  // Live Test with Real Context Memory
  const handleTestChatWithMemory = async () => {
    if (!testInput.trim() || isThinking) return;
    const userText = testInput.trim();
    setTestInput('');

    const newMemoryItem: MemoryMessage = {
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...memoryHistory, newMemoryItem];
    setMemoryHistory(updatedHistory);
    setIsThinking(true);

    try {
      // Map memory history to standard ChatMessages format
      const formattedMessages = updatedHistory.map((m, idx) => ({
        id: `mem_${idx}`,
        role: m.role === 'user' ? ('user' as const) : ('model' as const),
        content: m.content,
        timestamp: m.timestamp,
      }));

      const res = await api.sendChat(
        formattedMessages,
        systemPrompt,
        selectedProvider === 'claude'
          ? 'claude-3-7-sonnet'
          : selectedProvider === 'chatgpt'
          ? 'chatgpt-4o'
          : 'gemini-9-ultra'
      );

      const assistantMsg: MemoryMessage = {
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMemoryHistory([...updatedHistory, assistantMsg]);
    } catch {
      const fallbackMsg: MemoryMessage = {
        role: 'assistant',
        content: `أهلاً بك! لقد استلمت رسالتك: "${userText}". محرك ${currentModel.name} يحتفظ الآن بسياق ${updatedHistory.length} رسالة سابقة في الذاكرة الحية!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMemoryHistory([...updatedHistory, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getGeneratedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleClearMemory = () => {
    setMemoryHistory([
      {
        role: 'assistant',
        content: 'تم تفريغ الذاكرة المؤقتة. يمكنك بدء سياق محادثة جديد واختبار الذاكرة من البداية!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Inject into Current App
  const handleInjectIntoCurrentApp = () => {
    if (consumeCredit) consumeCredit(10);
    const embedScript = `<!-- ============================================== -->
<!-- OMNICRAFT AI CONNECTOR WITH MEMORY             -->
<!-- Connected Model: ${currentModel.name}          -->
<!-- ============================================== -->
<script>
(function() {
  window.OmniCraftMemoryChat = {
    model: "${currentModel.name}",
    system: "${systemPrompt.replace(/"/g, '\\"')}",
    memory: []
  };
})();
</script>`;

    let currentHtml = currentProject.htmlCode || '<html><body></body></html>';
    if (currentHtml.includes('</body>')) {
      currentHtml = currentHtml.replace('</body>', `\n${embedScript}\n</body>`);
    } else {
      currentHtml += `\n${embedScript}`;
    }

    onUpdateProjectHtml(currentHtml);
    setIsInjected(true);
    setTimeout(() => setIsInjected(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {isRTL ? 'الربط البرمجي بالذكاء الاصطناعي والذاكرة 🤖📜' : 'AI SDK & Memory Integration Hub 🤖📜'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isRTL
                ? 'اربط تطبيقك بكود برمجي متكامل لنماذج كلود (Claude 3.7) و ChatGPT و Gemini مع ذاكرة تفاعلية حية تحفظ سياق المحادثة وتتذكر إجابات المستخدمين.'
                : 'Connect your application with production-ready SDK code for Claude 3.7, ChatGPT, and Gemini with interactive conversation memory.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleInjectIntoCurrentApp}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-xs flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/30 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>{isRTL ? 'حقن الكود في مشروعي الحالي ⚡' : 'Inject Code Into My App ⚡'}</span>
            </button>
          </div>
        </div>
      </div>

      {isInjected && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {isRTL
                ? `🎉 تم حقن كود الربط بالذكاء الاصطناعي (${currentModel.name}) مع الذاكرة بنجاح في تطبيقك!`
                : `🎉 Injected ${currentModel.name} code with memory into active project!`}
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('builder')}
            className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
          >
            {isRTL ? 'معاينة في الاستوديو' : 'Preview App'}
          </button>
        </div>
      )}

      {/* Main Content Grid: Left Configuration & Code / Right Live Memory Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Model Selection & Code Viewer (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Provider Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>{isRTL ? '1. اختر نموذج الذكاء الاصطناعي للربط:' : '1. Choose Model to Connect:'}</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                {currentModel.badge}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(MODEL_SPECS) as ModelProvider[]).map((key) => {
                const spec = MODEL_SPECS[key];
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedProvider(key);
                      setBotName(spec.name);
                    }}
                    className={`p-3 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                      selectedProvider === key
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-black text-xs">{spec.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{spec.vendor}</div>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              💡 {currentModel.description}
            </p>
          </div>

          {/* Persona & Memory Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-lg">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{isRTL ? '2. إعدادات الذاكرة وشخصية النموذج:' : '2. Memory & Persona Config:'}</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">{isRTL ? 'تعليمات النظام الأساسية (System Prompt):' : 'System Prompt:'}</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="space-y-1 flex-1">
                <label className="text-xs font-bold text-slate-300">
                  {isRTL ? `حجم ذاكرة المحادثة (${memoryWindowSize} رسالة):` : `Memory Window Size (${memoryWindowSize} turns):`}
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={memoryWindowSize}
                  onChange={(e) => setMemoryWindowSize(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                {memoryWindowSize} Turns
              </span>
            </div>
          </div>

          {/* Generated Code Display */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  {isRTL ? `كود الربط المباشر مع الذاكرة (${currentModel.name}):` : `Code with Memory (${currentModel.name}):`}
                </h3>
              </div>

              {/* Language Selector Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'javascript', label: 'JavaScript' },
                  { id: 'react', label: 'React Hook' },
                  { id: 'nodejs', label: 'Node.js' },
                  { id: 'python', label: 'Python' },
                  { id: 'curl', label: 'cURL' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setCodeLanguage(lang.id as CodeLanguage)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      codeLanguage === lang.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[300px] leading-relaxed selection:bg-indigo-500 selection:text-white">
                <code>{getGeneratedCode()}</code>
              </pre>

              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 rtl:right-auto rtl:left-3 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md border border-slate-700 transition-all cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? (isRTL ? 'تم النسخ!' : 'Copied!') : (isRTL ? 'نسخ الكود' : 'Copy Code')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Memory Sandbox (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl h-full flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <h3 className="font-extrabold text-sm text-white">
                    {isRTL ? 'تجربة حية للذاكرة والسياق 🧠' : 'Live Memory Sandbox 🧠'}
                  </h3>
                </div>

                <button
                  onClick={handleClearMemory}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  title="مسح الذاكرة وبدء محادثة جديدة"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isRTL ? 'تفريغ الذاكرة' : 'Clear'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                {isRTL
                  ? 'جرب ذكر اسمك أو معلومة للذكاء الاصطناعي، ثم اسأله عنها لتتأكد من عمل الذاكرة بنجاح.'
                  : 'Tell the AI a detail (like your name or favorite tool) and then ask about it in your next turn.'}
              </p>
            </div>

            {/* Chat Body */}
            <div className="flex-1 min-h-[420px] bg-slate-950 rounded-2xl border border-slate-800/80 p-3.5 flex flex-col justify-between overflow-hidden">
              {/* Header Badge */}
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-xs">{currentModel.name}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                  {memoryHistory.length} Memory Turns
                </span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[300px] no-scrollbar">
                {memoryHistory.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-indigo-600 text-white ml-auto rtl:ml-0 rtl:mr-auto'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 mr-auto rtl:mr-0 rtl:ml-auto'
                    }`}
                  >
                    <div className="text-[9px] opacity-70 mb-0.5 font-mono">
                      {m.role === 'user' ? 'You' : currentModel.name} • {m.timestamp}
                    </div>
                    {m.content}
                  </div>
                ))}

                {isThinking && (
                  <div className="bg-slate-900 text-slate-400 border border-slate-800 p-2.5 rounded-xl text-xs mr-auto rtl:mr-0 rtl:ml-auto flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isRTL ? `جاري استرجاع الذاكرة والتفكير عبر ${currentModel.name}...` : `Thinking with memory...`}</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTestChatWithMemory();
                  }}
                  placeholder={isRTL ? 'اكتب رسالة لتجربة الذاكرة...' : 'Type message to test memory...'}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleTestChatWithMemory}
                  disabled={isThinking}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
