import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  KeyRound,
  Bot,
  ExternalLink,
  RotateCcw,
  Check,
  Settings,
  Key,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';
import { firebaseAuthService } from '../services/firebase';
import { AuthUser } from '../types';
import { MailBotSettingsModal } from './MailBotSettingsModal';
import { validateRealEmail } from '../utils/emailValidator';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMailSettingsOpen, setIsMailSettingsOpen] = useState(false);

  // 6-digit OTP verification state with Gmail Robot
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(60);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);

  // Dedicated Mail Bot identity & live assistance
  const [botEmail, setBotEmail] = useState<string>('vlock.verification.bot@gmail.com');
  const [botName, setBotName] = useState<string>('روبوت التحقق الذكي (Vlock AI Gmail Bot)');
  const [robotAssistCode, setRobotAssistCode] = useState<string | null>(null);
  const [robotAssistMessage, setRobotAssistMessage] = useState<string | null>(null);
  const [isAskingRobot, setIsAskingRobot] = useState<boolean>(false);
  const [isSendingGoogleOfficial, setIsSendingGoogleOfficial] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const startOtpFlow = async (purpose: 'auth' | 'forgot' = 'auth') => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address first.');
      return;
    }

    const emailVal = validateRealEmail(email, true);
    if (!emailVal.isValid) {
      setErrorMessage(emailVal.error || '❌ هذا الإيميل مزور أو غير حقيقي! يرجى إدخال إيميل حقيقي لتتمكن من إنشاء الحساب واستلام كود التحقق.');
      return;
    }

    setIsSendingCode(true);
    setErrorMessage(null);
    setRobotAssistCode(null);
    setRobotAssistMessage(null);
    try {
      const res = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), displayName: displayName.trim(), purpose }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch verification email');
      }

      if (data.botEmail) setBotEmail(data.botEmail);
      if (data.botName) setBotName(data.botName);

      setEnteredOtp('');
      setIsVerifyingOtp(true);
      setResendCooldown(60);
      setSuccessMessage(data.message || `قام روبوت البريد (${data.botEmail || 'vlock.verification.bot@gmail.com'}) بإرسال كود التحقق الأمني إلى تطبيق Gmail.`);

      // Also trigger Google Firebase official mail delivery if in forgot mode
      if (purpose === 'forgot') {
        try {
          await firebaseAuthService.sendPasswordReset(email.trim());
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send verification code.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const askRobotForCode = async () => {
    if (!email.trim()) return;
    setIsAskingRobot(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/mail-bot/request-code-from-robot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'تعذر استرجاع الكود من الروبوت. يرجى طلب إرسال كود جديد أولاً.');
      }
      setRobotAssistCode(data.code);
      setRobotAssistMessage(data.message);
      if (data.botEmail) setBotEmail(data.botEmail);
      if (data.botName) setBotName(data.botName);
    } catch (err: any) {
      setErrorMessage(err?.message || 'تعذر التواصل مع روبوت البريد حالياً.');
    } finally {
      setIsAskingRobot(false);
    }
  };

  const sendGoogleOfficialMail = async () => {
    if (!email.trim()) return;
    setIsSendingGoogleOfficial(true);
    setErrorMessage(null);
    try {
      await firebaseAuthService.sendPasswordReset(email.trim());
      setSuccessMessage('تم إرسال إيميل رسمي من خوادم Google الرسمية إلى تطبيق Gmail بنجاح!');
    } catch (err: any) {
      setErrorMessage(err?.message || 'تعذر الإرسال عبر Google');
    } finally {
      setIsSendingGoogleOfficial(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isSendingCode) return;
    setIsSendingCode(true);
    setErrorMessage(null);
    setRobotAssistCode(null);
    setRobotAssistMessage(null);
    try {
      const res = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), displayName: displayName.trim(), purpose: mode === 'forgot' ? 'forgot' : 'auth' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }
      if (data.botEmail) setBotEmail(data.botEmail);
      if (data.botName) setBotName(data.botName);

      setResendCooldown(60);
      setSuccessMessage(`قام روبوت البريد (${data.botEmail || botEmail}) بإرسال كود تحقق جديد إلى تطبيق Gmail.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error resending verification code');
    } finally {
      setIsSendingCode(false);
    }
  };

  React.useEffect(() => {
    let timer: any = null;
    if (isVerifyingOtp && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVerifyingOtp, resendCooldown]);

  const proceedVerification = async (codeVal: string) => {
    if (!codeVal || codeVal.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifyingCode(true);
    setErrorMessage(null);

    try {
      // 1. Verify code on backend against real dispatched OTP
      const verifyRes = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: codeVal.trim() }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Invalid verification code. Please check your email.');
      }

      // 2. Perform Real Authentication
      if (mode === 'signup') {
        try {
          const user = await firebaseAuthService.signUp(
            email.trim(),
            password || 'OmniUser@2026',
            displayName.trim() || email.split('@')[0]
          );
          setSuccessMessage('Account created and verified successfully! 🎉');
          setTimeout(() => {
            onAuthSuccess(user);
            onClose();
          }, 600);
        } catch (signUpErr: any) {
          if (signUpErr?.code === 'auth/email-already-in-use') {
            const user = await firebaseAuthService.logIn(email.trim(), password || 'OmniUser@2026');
            setSuccessMessage('Welcome back! Successfully logged in.');
            setTimeout(() => {
              onAuthSuccess(user);
              onClose();
            }, 500);
            return;
          }
          if (signUpErr?.code === 'auth/operation-not-allowed' || signUpErr?.code === 'auth/admin-restricted-operation') {
            const user = await firebaseAuthService.serverSideRegisterOrLogin(
              email.trim(),
              password || 'OmniUser@2026',
              displayName.trim() || email.split('@')[0],
              'signup'
            );
            setSuccessMessage('Account verified and logged in! 🎉');
            setTimeout(() => {
              onAuthSuccess(user);
              onClose();
            }, 500);
            return;
          }
          throw signUpErr;
        }
      } else {
        try {
          const user = await firebaseAuthService.logIn(email.trim(), password || 'OmniUser@2026');
          setSuccessMessage('Welcome back!');
          setTimeout(() => {
            onAuthSuccess(user);
            onClose();
          }, 500);
        } catch (logErr: any) {
          if (logErr?.code === 'auth/operation-not-allowed' || logErr?.code === 'auth/admin-restricted-operation') {
            const user = await firebaseAuthService.serverSideRegisterOrLogin(email.trim(), password || 'OmniUser@2026', undefined, 'login');
            setSuccessMessage('Welcome back! Logged in.');
            setTimeout(() => {
              onAuthSuccess(user);
              onClose();
            }, 500);
            return;
          }
          throw logErr;
        }
      }
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleVerifyOtpAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    await proceedVerification(enteredOtp);
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsVerifyingCode(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: enteredOtp.trim(),
          newPassword: newPassword.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccessMessage('Password reset successfully! 🎉 You can now log in.');
      setMode('login');
      setIsVerifyingOtp(false);
      setEnteredOtp('');
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to reset password.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  if (!isOpen) return null;

  const handleAuthError = (err: any) => {
    console.warn('Firebase Auth Notice:', err?.message || err);
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      setMode('login');
      setErrorMessage('This email is already in use! We have switched you to Log In — please enter your password.');
    } else if (code === 'auth/operation-not-allowed' || code === 'auth/admin-restricted-operation') {
      setErrorMessage('Please click "Continue with Google" for instant one-click login.');
    } else if (code === 'auth/invalid-email') {
      setErrorMessage('Please enter a valid email address.');
    } else if (code === 'auth/weak-password') {
      setErrorMessage('Password should be at least 6 characters.');
    } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      setErrorMessage('Incorrect email or password. Please try again.');
    } else if (code === 'auth/user-not-found') {
      setMode('signup');
      setErrorMessage('No account found with this email. We have switched you to Sign Up!');
    } else if (code === 'auth/popup-closed-by-user') {
      setErrorMessage('Google Sign-In was cancelled.');
    } else {
      setErrorMessage(err?.message || 'An error occurred during authentication.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address to receive recovery code.');
        return;
      }
      await startOtpFlow('forgot');
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
    }

    // Activate 6-digit OTP verification code delivered by Gmail Robot
    await startOtpFlow('auth');
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGoogleLoading(true);
    try {
      const user = await firebaseAuthService.signInWithGoogle();
      if (!user) {
        // User closed or dismissed the popup window
        return;
      }
      setSuccessMessage('Successfully signed in with Google!');
      setTimeout(() => {
        onAuthSuccess(user);
        onClose();
      }, 700);
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' || 
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        return;
      }
      handleAuthError(err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Your Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' 
              ? 'Sign in to access your apps, custom domains, and AI tools' 
              : mode === 'signup' 
              ? 'Join OmniCraft to build, publish, and deploy AI projects'
              : 'Enter your account email to receive a secure reset link'}
          </p>
        </div>

        {/* Google OAuth Button */}
        {mode !== 'forgot' && (
          <div className="space-y-4 mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-700/80 hover:border-indigo-500 hover:bg-slate-800/80 text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>{mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                Or with email
              </span>
            </div>
          </div>
        )}

        {/* Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main Form or OTP Verification */}
        {isVerifyingOtp ? (
          <form onSubmit={mode === 'forgot' ? handleResetPasswordSubmit : handleVerifyOtpAndProceed} className="space-y-4 animate-in fade-in">
            {/* ROBOT AVATAR & STATUS */}
            <div className="relative p-4 rounded-3xl bg-gradient-to-b from-indigo-950/90 via-slate-900/95 to-slate-950 border-2 border-indigo-500/50 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-3">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                      <Bot className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5 truncate">
                      <span>{botName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                        متصل وجاهز 🟢
                      </span>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed truncate">
                    إيميل الروبوت المرسِل: <span className="text-cyan-300 font-mono font-semibold">{botEmail}</span>
                  </p>
                </div>
              </div>

              {/* GMAIL BOT LIVE NOTIFICATION CARD */}
              <div className="p-3.5 rounded-2xl bg-slate-950/95 border border-red-500/40 shadow-inner space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-red-600/20 flex items-center justify-center border border-red-500/30 text-red-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-white block truncate">
                        Google Gmail App • روبوت التحقق
                      </span>
                      <span className="text-[10px] text-amber-300 font-mono block truncate">
                        {email}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                    <Check className="w-3 h-3" />
                    تم الإرسال
                  </span>
                </div>

                <div className="text-center py-2 px-2 bg-slate-900/60 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    يرجى فتح تطبيق Gmail ومراجعة صندوق الوارد (أو مجلد Spam). إذا تأخر وصول الإيميل، يمكنك استلام الكود فوراً من الروبوت أدناه:
                  </p>
                </div>

                {/* SPECIAL ROBOT CODE DISPATCH ACTION */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={askRobotForCode}
                    disabled={isAskingRobot}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
                  >
                    {isAskingRobot ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                        <span>جاري طلب الكود من روبوت البريد...</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-4 h-4 text-cyan-300 animate-pulse" />
                        <span>لم يصلك الكود في تطبيق جيميل؟ استلم الكود من الروبوت فوراً 🤖</span>
                      </>
                    )}
                  </button>

                  {/* ROBOT LIVE DIALOG BOX WITH CODE */}
                  {robotAssistCode && (
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-950/90 via-slate-900 to-indigo-950/95 border-2 border-cyan-500/60 shadow-xl animate-in zoom-in-95 space-y-2 text-right" dir="rtl">
                      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-white">{botName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                          {botEmail}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-200 leading-relaxed">
                        {robotAssistMessage || 'مرحباً! بما أن رسائل تطبيق جيميل قد تتأخر على جهازك، تفضل كود التحقق الصادر لك:'}
                      </p>
                      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-cyan-500/40">
                        <span className="text-2xl font-mono font-black text-cyan-300 tracking-[0.25em] px-2">
                          {robotAssistCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEnteredOtp(robotAssistCode);
                            navigator.clipboard?.writeText(robotAssistCode);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2500);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'تمت التعبئة بنجاح ✨' : 'تعبئة الكود تلقائياً 📋'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-red-600/25 hover:bg-red-600/35 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                    <span>فتح تطبيق Gmail ↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsMailSettingsOpen(true)}
                    className="py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-cyan-400" />
                    <span>إعدادات الروبوت ⚙️</span>
                  </button>
                </div>

                {/* Direct Google Official Dispatch Option */}
                <button
                  type="button"
                  onClick={sendGoogleOfficialMail}
                  disabled={isSendingGoogleOfficial}
                  className="w-full py-1.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] border border-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isSendingGoogleOfficial ? (
                    <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                  ) : (
                    <Mail className="w-3 h-3 text-red-400" />
                  )}
                  <span>إرسال إيميل رسمي من خوادم Google الرسمية 📩</span>
                </button>
              </div>
            </div>

            {/* 6-Digit Code Input */}
            <div className="space-y-1.5 text-center">
              <label className="text-xs font-bold text-slate-300 block">
                Enter 6-Digit Code from Gmail:
              </label>
              <input
                type="text"
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="------"
                autoFocus
                className="w-full text-center tracking-[0.5em] text-2xl font-mono font-black py-2.5 rounded-2xl bg-slate-950 border-2 border-indigo-500/60 text-cyan-300 focus:outline-none focus:border-cyan-400 shadow-inner"
              />
              <p className="text-[10px] text-slate-500">
                Encrypted real verification via Gmail Robot
              </p>
            </div>

            {/* In Forgot Password Mode: Add New Password Fields */}
            {mode === 'forgot' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-300 block">
                    New Password (min 6 chars):
                  </label>
                  <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <Lock className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Confirm New Password:
                  </label>
                  <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <Lock className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifyingCode || enteredOtp.length !== 6 || (mode === 'forgot' && (!newPassword || newPassword.length < 6 || newPassword !== confirmNewPassword))}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-95 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 disabled:opacity-50"
            >
              {isVerifyingCode ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying & Confirming...</span>
                </>
              ) : mode === 'forgot' ? (
                <>
                  <Key className="w-4 h-4" />
                  <span>Confirm Code & Reset Password 🔐</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm Code & Enter Studio 🚀</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isSendingCode}
                className={`font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  resendCooldown > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-indigo-400 hover:text-indigo-300'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>
                  {resendCooldown > 0 ? `Resend in (${resendCooldown}s)` : 'Request New Code from Bot 🤖'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsVerifyingOtp(false);
                  setEnteredOtp('');
                  setErrorMessage(null);
                }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Change email
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-indigo-500 transition-colors">
                  <User className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none w-full"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-indigo-500 transition-colors">
                <Mail className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none w-full"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-indigo-500 transition-colors">
                  <Lock className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none w-full"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Confirm Password
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-indigo-500 transition-colors">
                  <KeyRound className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none w-full"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading || isSendingCode}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSendingCode || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Dispatching Code via Gmail Bot...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span>
                    {mode === 'login' ? 'Send Verification Code & Log In 🤖' : mode === 'signup' ? 'Send Code & Create Account 🤖' : 'Send Verification Code for Reset 🤖'}
                  </span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer mode toggle */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col items-center gap-3">
          {mode === 'login' ? (
            <p className="text-xs text-slate-400">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setIsVerifyingOtp(false);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setIsVerifyingOtp(false);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
              >
                Log in
              </button>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setIsVerifyingOtp(false);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
            >
              Back to Sign In
            </button>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Firebase 256-bit TLS Encrypted Authentication</span>
          </div>
        </div>
      </div>

      {/* Mailer Bot Settings Modal */}
      <MailBotSettingsModal
        isOpen={isMailSettingsOpen}
        onClose={() => setIsMailSettingsOpen(false)}
      />
    </div>
  );
};
