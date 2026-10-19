import React, { useState } from 'react';
import { 
  Bot, 
  Mail, 
  Check, 
  Copy, 
  ExternalLink, 
  Settings, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  KeyRound, 
  X, 
  Zap,
  Send,
  HelpCircle
} from 'lucide-react';
import { firebaseAuthService } from '../services/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { validateRealEmail } from '../utils/emailValidator';

interface VerificationRobotWidgetProps {
  email: string;
  setEmail?: (email: string) => void;
  onCodeRetrieved?: (code: string) => void;
  onCodeDispatched?: () => void;
  onOpenSettings?: () => void;
  isFloating?: boolean;
}

export const VerificationRobotWidget: React.FC<VerificationRobotWidgetProps> = ({
  email,
  setEmail,
  onCodeRetrieved,
  onCodeDispatched,
  onOpenSettings,
  isFloating = false,
}) => {
  const { isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(!isFloating);
  const [targetEmail, setTargetEmail] = useState(email || '');
  const [botEmail, setBotEmail] = useState('vlock.verification.bot@gmail.com');
  const [botName, setBotName] = useState(isRTL ? 'روبوت التحقق الذكي (Vlock AI Gmail Bot)' : 'Vlock AI Gmail Verification Bot');
  const [isSending, setIsSending] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [isGoogleSending, setIsGoogleSending] = useState(false);
  const [retrievedCode, setRetrievedCode] = useState<string | null>(null);
  const [robotMessage, setRobotMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync external email if prop changes
  React.useEffect(() => {
    if (email) {
      setTargetEmail(email);
    }
  }, [email]);

  const handleSendCode = async () => {
    const cleanEmail = targetEmail.trim();
    if (!cleanEmail) {
      setFeedback({
        type: 'error',
        text: isRTL ? 'يرجى إدخال البريد الإلكتروني أولاً.' : 'Please enter target email address first.',
      });
      return;
    }

    // Strict real email validation
    const validation = validateRealEmail(cleanEmail, isRTL);
    if (!validation.isValid) {
      setFeedback({
        type: 'error',
        text: validation.error || (isRTL ? '❌ هذا الإيميل مزور أو غير حقيقي! يرجى إدخال إيميل حقيقي لاستلام كود التحقق.' : '❌ This email is fake or invalid. Please enter a real email.'),
      });
      return;
    }

    if (setEmail) setEmail(cleanEmail);
    setIsSending(true);
    setFeedback(null);
    setRetrievedCode(null);

    try {
      const res = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch verification code');
      }

      if (data.botEmail) setBotEmail(data.botEmail);
      if (data.botName) setBotName(data.botName);

      setFeedback({
        type: 'success',
        text: isRTL 
          ? `قام روبوت البريد (${data.botEmail || botEmail}) بإرسال كود التحقق الأمني بنجاح إلى بريدك في Gmail!` 
          : `Robot (${data.botEmail || botEmail}) successfully dispatched 6-digit OTP code to your Gmail!`,
      });

      if (onCodeDispatched) {
        onCodeDispatched();
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err?.message || (isRTL ? 'فشل إرسال الكود عبر الروبوت.' : 'Robot failed to dispatch code.'),
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleRetrieveCodeFromRobot = async () => {
    const cleanEmail = targetEmail.trim();
    if (!cleanEmail) {
      setFeedback({
        type: 'error',
        text: isRTL ? 'يرجى إدخال البريد الإلكتروني.' : 'Please enter email address.',
      });
      return;
    }

    setIsRetrieving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/mail-bot/request-code-from-robot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isRTL ? 'لا يوجد كود نشط. يرجى إرسال الكود أولاً.' : 'No active code. Please dispatch code first.'));
      }

      setRetrievedCode(data.code);
      setRobotMessage(data.message);
      if (data.botEmail) setBotEmail(data.botEmail);

      setFeedback({
        type: 'success',
        text: isRTL ? 'تم استلام كود التحقق من الروبوت بنجاح! 🤖' : 'Code retrieved directly from Robot! 🤖',
      });

      if (onCodeRetrieved) {
        onCodeRetrieved(data.code);
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err?.message || (isRTL ? 'تعذر استلام الكود من الروبوت حالياً.' : 'Could not retrieve code from robot.'),
      });
    } finally {
      setIsRetrieving(false);
    }
  };

  const handleSendGoogleOfficial = async () => {
    const cleanEmail = targetEmail.trim();
    if (!cleanEmail) return;

    setIsGoogleSending(true);
    setFeedback(null);

    try {
      await firebaseAuthService.sendPasswordReset(cleanEmail);
      setFeedback({
        type: 'success',
        text: isRTL 
          ? 'تم إرسال إيميل رسمي من خوادم Google الرسمية إلى تطبيق Gmail بنجاح!' 
          : 'Official Google email dispatched to your Gmail inbox successfully!',
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err?.message || (isRTL ? 'تعذر الإرسال عبر خوادم Google' : 'Google dispatch error'),
      });
    } finally {
      setIsGoogleSending(false);
    }
  };

  const copyCode = () => {
    if (!retrievedCode) return;
    navigator.clipboard?.writeText(retrievedCode);
    setCopied(true);
    if (onCodeRetrieved) {
      onCodeRetrieved(retrievedCode);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  // If floating and minimized
  if (isFloating && !isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 p-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 hover:scale-105 transition-all shadow-2xl shadow-cyan-500/30 text-white flex items-center gap-2.5 border-2 border-cyan-400/50 cursor-pointer animate-bounce"
        title={isRTL ? 'روبوت إرسال أكواد التحقق' : 'Verification Code Robot'}
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <div className="text-left rtl:text-right hidden sm:block">
          <span className="text-[11px] font-black block leading-none">
            {isRTL ? 'روبوت إرسال الكود 🤖' : 'Mailer Robot 🤖'}
          </span>
          <span className="text-[9px] text-cyan-200 block mt-0.5">
            {isRTL ? 'متصل وجاهز' : 'Ready to Send'}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-b from-indigo-950/95 via-slate-900/98 to-slate-950 border-2 border-cyan-500/50 shadow-2xl p-4 sm:p-5 overflow-hidden transition-all ${
        isFloating ? 'fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 w-full max-w-sm sm:max-w-md' : 'w-full'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">{botName}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                {isRTL ? 'متصل 🟢' : 'Online 🟢'}
              </span>
            </div>
            <p className="text-[11px] text-cyan-300 font-mono flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>{botEmail}</span>
            </p>
          </div>
        </div>

        {isFloating && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Robot Description */}
      <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-3">
        <p className="text-xs text-slate-300 leading-relaxed">
          {isRTL
            ? '🤖 أنا روبوت إرسال أكواد التحقق! وظيفتي إرسال كود التحقق الأمني المكون من 6 أرقام إلى بريد Gmail الخاص بك أو تقديمه لك فوراً إذا تأخر البريد.'
            : '🤖 I am the Automated Verification Robot! I dispatch official 6-digit OTP verification codes to your Gmail and provide instant delivery.'}
        </p>
      </div>

      {/* Target Email Input */}
      <div className="space-y-1 mb-3">
        <label className="text-[11px] font-bold text-slate-300 block">
          {isRTL ? 'البريد الإلكتروني المستلم:' : 'Recipient Email Address:'}
        </label>
        <div className="relative flex items-center bg-slate-950 border border-slate-700/80 focus-within:border-cyan-400 rounded-xl px-3 py-2 transition-colors">
          <Mail className="w-4 h-4 text-slate-500 mr-2 rtl:mr-0 rtl:ml-2 shrink-0" />
          <input
            type="email"
            value={targetEmail}
            onChange={(e) => {
              setTargetEmail(e.target.value);
              if (setEmail) setEmail(e.target.value);
            }}
            placeholder={isRTL ? 'example@email.com' : 'name@example.com'}
            className="bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none w-full font-medium"
          />
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-2.5 rounded-xl mb-3 text-xs flex items-start gap-2 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <span className="leading-snug">{feedback.text}</span>
        </div>
      )}

      {/* PRIMARY ACTION 1: DISPATCH CODE VIA ROBOT */}
      <div className="space-y-2 mb-3">
        <button
          type="button"
          onClick={handleSendCode}
          disabled={isSending || isRetrieving}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] disabled:opacity-50"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
              <span>{isRTL ? 'جاري إرسال الكود عبر الروبوت...' : 'Robot Dispatching Code...'}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-cyan-300" />
              <span>
                {isRTL ? 'إرسال كود التحقق عبر الروبوت إلى Gmail 🚀' : 'Send Verification Code via Robot to Gmail 🚀'}
              </span>
            </>
          )}
        </button>

        {/* PRIMARY ACTION 2: GET CODE DIRECTLY FROM ROBOT */}
        <button
          type="button"
          onClick={handleRetrieveCodeFromRobot}
          disabled={isRetrieving || isSending}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border-2 border-cyan-500/40 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          {isRetrieving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
              <span>{isRTL ? 'جاري استرجاع الكود من الروبوت...' : 'Fetching Code from Robot...'}</span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>
                {isRTL ? 'لم يصلك الكود في جيميل؟ استلم الكود من الروبوت فوراً ⚡' : 'Didn\'t get code in Gmail? Get code from Robot ⚡'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* RETRIEVED CODE BOX WITH 1-CLICK COPY & FILL */}
      {retrievedCode && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/90 via-slate-900 to-indigo-950/95 border-2 border-cyan-400 shadow-2xl mb-3 animate-in zoom-in-95 space-y-2">
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>{isRTL ? 'كود التحقق الصادر لك من الروبوت:' : 'Verification Code from Robot:'}</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-500/40">
              {botEmail}
            </span>
          </div>

          <p className="text-[11px] text-slate-200 leading-relaxed">
            {robotMessage || (isRTL ? 'بما أن الإيميل قد يتأخر في تطبيق Gmail، تفضل كود التحقق الخاص بك:' : 'Here is your 6-digit OTP code:')}
          </p>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-cyan-500/50">
            <span className="text-2xl font-mono font-black text-cyan-300 tracking-[0.3em] px-2">
              {retrievedCode}
            </span>
            <button
              type="button"
              onClick={copyCode}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isRTL ? 'تمت التعبئة ✨' : 'Applied ✨') : (isRTL ? 'تعبئة ونسخ الكود' : 'Copy & Fill')}</span>
            </button>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-red-400" />
          <span>{isRTL ? 'فتح Gmail ↗' : 'Open Gmail ↗'}</span>
        </a>

        <button
          type="button"
          onClick={handleSendGoogleOfficial}
          disabled={isGoogleSending}
          className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {isGoogleSending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          ) : (
            <Mail className="w-3.5 h-3.5 text-red-400" />
          )}
          <span>{isRTL ? 'إيميل Google رسمي' : 'Official Google'}</span>
        </button>
      </div>

      {onOpenSettings && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
          >
            <Settings className="w-3 h-3 text-cyan-400" />
            <span>{isRTL ? 'تخصيص إعدادات روبوت جيميل ⚙️' : 'Configure Mail Robot Settings ⚙️'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
