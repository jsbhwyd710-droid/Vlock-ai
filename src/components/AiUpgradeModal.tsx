import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Gamepad2, 
  Sliders, 
  Volume2, 
  Check, 
  Bot, 
  Code2, 
  Gauge, 
  Layers
} from 'lucide-react';
import { AiEngineSettings, AiEngineTier } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AiUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AiEngineSettings;
  onSaveSettings: (settings: AiEngineSettings) => void;
}

export const AiUpgradeModal: React.FC<AiUpgradeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const { isRTL, t } = useLanguage();
  const [tier, setTier] = useState<AiEngineTier>(settings.tier || 'gaming');
  const [temperature, setTemperature] = useState<number>(settings.temperature ?? 0.7);
  const [physicsEngine, setPhysicsEngine] = useState<'realistic' | 'arcade'>(settings.physicsEngine || 'realistic');
  const [botIntelligence, setBotIntelligence] = useState<'smart' | 'expert' | 'tactical'>(settings.botIntelligence || 'tactical');
  const [soundSynthesis, setSoundSynthesis] = useState<boolean>(settings.soundSynthesis ?? true);
  const [codeOptimization, setCodeOptimization] = useState<'high' | 'ultra'>(settings.codeOptimization || 'ultra');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      tier,
      temperature,
      physicsEngine,
      botIntelligence,
      soundSynthesis,
      codeOptimization,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100">
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                {t('ai_upgrade_title', 'ترقية محرك الذكاء الاصطناعي (AI Studio Engine)')}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                PRO ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t('ai_upgrade_desc', 'تحكم بمستوى ذكاء الـ AI، خوارزميات الفيزياء، وتوليد الأكواد المعقدة')}
            </p>
          </div>
        </div>

        {/* AI Tier Selector Cards */}
        <div className="space-y-4 mb-6">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>اختر مستوى ذكاء المحرك (AI Model Engine Tier):</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {/* Turbo Tier */}
            <div
              onClick={() => setTier('turbo')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                tier === 'turbo'
                  ? 'bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">⚡</span>
                {tier === 'turbo' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </div>
              <h4 className="text-[11px] font-bold text-white">Turbo Flash</h4>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">
                استجابة فورية فائقة السرعة بدون انتظار.
              </p>
            </div>

            {/* Pro Reasoning Tier */}
            <div
              onClick={() => setTier('pro')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                tier === 'pro'
                  ? 'bg-purple-950/80 border-purple-500 shadow-md shadow-purple-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">🧠</span>
                {tier === 'pro' && <Check className="w-3.5 h-3.5 text-purple-400" />}
              </div>
              <h4 className="text-[11px] font-bold text-white">Deep Pro</h4>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">
                تفكير معماري عميق وأكواد نظيفة.
              </p>
            </div>

            {/* Gaming Studio AI Tier */}
            <div
              onClick={() => setTier('gaming')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                tier === 'gaming'
                  ? 'bg-amber-950/80 border-amber-500 shadow-md shadow-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">🎮</span>
                {tier === 'gaming' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <h4 className="text-[11px] font-bold text-white">Gaming AI</h4>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">
                ألعاب ببجي والقتال 60FPS وصوتيات حية.
              </p>
            </div>

            {/* Ultra Thinker 3.8 */}
            <div
              onClick={() => setTier('ultra')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                tier === 'ultra'
                  ? 'bg-emerald-950/80 border-emerald-500 shadow-md shadow-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">🚀</span>
                {tier === 'ultra' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <h4 className="text-[11px] font-bold text-white">Ultra 3.8</h4>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">
                قدرة تحليلية مضاعفة للأكواد الكبيرة.
              </p>
            </div>

            {/* Mastermind AI 4.0 */}
            <div
              onClick={() => setTier('mastermind')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                tier === 'mastermind'
                  ? 'bg-rose-950/80 border-rose-500 shadow-md shadow-rose-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">👑</span>
                {tier === 'mastermind' && <Check className="w-3.5 h-3.5 text-rose-400" />}
              </div>
              <h4 className="text-[11px] font-bold text-white">Mastermind 4.0</h4>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">
                أعلى مستوى ذكاء خارق مع دقة كاملة.
              </p>
            </div>
          </div>
        </div>

        {/* Advanced AI Tuning Controls */}
        <div className="space-y-4 bg-slate-950/60 border border-slate-800 p-4 rounded-2xl mb-6">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>ضبط خوارزميات الذكاء الاصطناعي (AI Deep Settings)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Physics Engine */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block font-semibold">محاكاة الفيزياء (Physics Engine):</label>
              <select
                value={physicsEngine}
                onChange={(e) => setPhysicsEngine(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="realistic">واقعي Realistic (احتكاك، جاذبية، وارتداد)</option>
                <option value="arcade">أركيد Arcade (سريع وانسيابي 60FPS)</option>
              </select>
            </div>

            {/* Bot AI Intelligence */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block font-semibold">ذكاء البوتات (Bot AI Tactical IQ):</label>
              <select
                value={botIntelligence}
                onChange={(e) => setBotIntelligence(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="tactical">تكتيكي Tactical (احتماء ومناورة وهجوم)</option>
                <option value="expert">خبير Expert (دقة تصويب عالية وسرعة استجابة)</option>
                <option value="smart">ذكي متوازن Smart Balanced</option>
              </select>
            </div>

            {/* Code Optimization */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block font-semibold">تحسين الكود البرمجي (Optimization):</label>
              <select
                value={codeOptimization}
                onChange={(e) => setCodeOptimization(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ultra">Ultra Clean (بدون أي أخطاء، كود احترافي نقي)</option>
                <option value="high">High Performance (معدل إطارات أقصى)</option>
              </select>
            </div>

            {/* Sound Synth */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block font-semibold">توليد الأصوات بالذكاء (Web Audio Synth):</label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSoundSynthesis(!soundSynthesis)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    soundSynthesis 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{soundSynthesis ? 'مفعّل (أصوات إطلاق وانفجار)' : 'معطل'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-all"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all hover:scale-102"
          >
            <Sparkles className="w-4 h-4" />
            <span>حفظ وتطبيق ترقية الذكاء الاصطناعي ⚡</span>
          </button>
        </div>
      </div>
    </div>
  );
};
