import React, { useState, useEffect } from 'react';
import { X, Mail, Key, ShieldCheck, Check, AlertCircle, Loader2, Bot, ExternalLink, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MailBotSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MailBotSettingsModal: React.FC<MailBotSettingsModalProps> = ({ isOpen, onClose }) => {
  const { isRTL } = useLanguage();
  const [gmailUser, setGmailUser] = useState('');
  const [gmailAppPassword, setGmailAppPassword] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [useCustomSmtp, setUseCustomSmtp] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ configured: boolean; senderEmail: string | null; provider: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/mail-bot/status');
      const data = await res.json();
      setStatus(data);
      if (data.senderEmail) {
        setGmailUser(data.senderEmail);
      }
    } catch {
      // ignore
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const body = useCustomSmtp
        ? { smtpHost, smtpPort, smtpUser, smtpPass }
        : { gmailUser, gmailAppPassword };

      const res = await fetch('/api/mail-bot/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save mail bot settings');
      }

      setMessage(isRTL ? 'تم حفظ وتفعيل إعدادات روبوت جيميل بنجاح!' : 'Gmail Bot settings saved successfully!');
      fetchStatus();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || (isRTL ? 'فشل حفظ الإعدادات' : 'Failed to save settings'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                {isRTL ? 'إعدادات روبوت إرسال Gmail 🤖' : 'Gmail Mailer Bot Settings 🤖'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isRTL ? 'ربط حسابك لإرسال الأكواد الحقيقية إلى بريد Gmail' : 'Connect sender account to deliver real Gmail codes'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Badge */}
        <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">{isRTL ? 'بريد روبوت التحقق:' : 'Verification Bot Email:'}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold font-mono">
            {status?.senderEmail || 'verification.bot@system.internal'}
          </span>
        </div>

        {/* Alert / Notices */}
        {message && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3.5">
          {!useCustomSmtp ? (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  {isRTL ? 'بريد Gmail المُرسِل (Sender Gmail):' : 'Sender Gmail Address:'}
                </label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={gmailUser}
                    onChange={(e) => setGmailUser(e.target.value)}
                    placeholder="bot-sender@domain.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    {isRTL ? 'كلمة مرور التطبيق (Google App Password - 16 حرفاً):' : 'Google App Password (16 characters):'}
                  </label>
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRTL ? 'إنشاء كلمة مرور ↗' : 'Generate App Password ↗'}</span>
                  </a>
                </div>
                <div className="relative">
                  <Key className="absolute top-3 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={gmailAppPassword}
                    onChange={(e) => setGmailAppPassword(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {isRTL
                    ? '💡 من حساب Google الخاص بك > الأمان > كلمات مرور التطبيقات (App Passwords) > أنشئ كلمة مرور جديدة والصقها هنا.'
                    : '💡 From your Google Account > Security > 2-Step Verification > App Passwords > Generate a 16-char password and paste here.'}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">SMTP Host</label>
                  <input
                    type="text"
                    required
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Port</label>
                  <input
                    type="text"
                    required
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    placeholder="587"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">SMTP User</label>
                <input
                  type="text"
                  required
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">SMTP Password</label>
                <input
                  type="password"
                  required
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between text-[11px] pt-1">
            <button
              type="button"
              onClick={() => setUseCustomSmtp(!useCustomSmtp)}
              className="text-indigo-400 hover:underline cursor-pointer"
            >
              {useCustomSmtp ? 'Switch to Gmail Direct' : 'Use Custom SMTP Relay'}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{isRTL ? 'جاري التحقق والحفظ...' : 'Testing & Saving...'}</span>
              </>
            ) : (
              <span>{isRTL ? 'حفظ وتفعيل روبوت Gmail 🤖' : 'Save & Activate Gmail Bot 🤖'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
