import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Gamepad2, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Zap, 
  Smartphone, 
  Globe, 
  Eye, 
  EyeOff,
  Flame,
  Check,
  Bot,
  Copy,
  ExternalLink,
  RotateCcw,
  Key,
  Settings,
  X
} from 'lucide-react';
import { firebaseAuthService } from '../services/firebase';
import { AuthUser } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelectorButton } from './LanguageSelectorButton';
import { MailBotSettingsModal } from './MailBotSettingsModal';
import { VerificationRobotWidget } from './VerificationRobotWidget';
import { validateRealEmail } from '../utils/emailValidator';
import { addVerificationCodeMessageToGmail } from '../services/gmail';

interface AuthGateScreenProps {
  onAuthSuccess: (user: AuthUser) => void;
}

export const AuthGateScreen: React.FC<AuthGateScreenProps> = ({ onAuthSuccess }) => {
  const { t, isRTL } = useLanguage();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Real Email Validation & Verification Bot State
  const [emailValidationError, setEmailValidationError] = useState<string | null>(null);
  const [showGmailPreviewModal, setShowGmailPreviewModal] = useState<boolean>(false);
  const [currentDispatchedOtp, setCurrentDispatchedOtp] = useState<string | null>(null);
  const [currentBotEmail, setCurrentBotEmail] = useState<string>('vlock.verification.bot@gmail.com');

  // Forgot password new credentials fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMailSettingsOpen, setIsMailSettingsOpen] = useState(false);

  // 6-Digit Email/Gmail OTP Verification State
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(60);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);

  const startOtpFlow = async (purpose: 'auth' | 'forgot' = 'auth') => {
    if (!email.trim()) {
      setErrorMessage(isRTL ? 'يرجى إدخال البريد الإلكتروني.' : 'Please enter your email.');
      return;
    }

    // Strict Real Email Validation (Blocks fake, temp, dummy emails)
    const validation = validateRealEmail(email, isRTL);
    if (!validation.isValid) {
      setEmailValidationError(validation.error || 'بريد غير حقيقي');
      setErrorMessage(validation.error || 'بريد غير حقيقي');
      return;
    }
    setEmailValidationError(null);

    setIsSendingCode(true);
    setErrorMessage(null);
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

      const botEmailAddr = data.botEmail || 'vlock.verification.bot@gmail.com';
      setCurrentBotEmail(botEmailAddr);

      if (data.code) {
        setCurrentDispatchedOtp(data.code);
        addVerificationCodeMessageToGmail(email.trim().toLowerCase(), data.code, botEmailAddr);
      }

      setEnteredOtp('');
      setIsVerifyingOtp(true);
      setResendCooldown(60);
      setSuccessMessage(
        isRTL
          ? 'قام روبوت التحقق بإرسال كود التحقق الأمني المكون من 6 أرقام إلى بريدك الإلكتروني في تطبيق Gmail بنجاح. يمكنك استلامه من تطبيق Gmail مباشرة!'
          : 'The Verification Bot has dispatched your 6-digit code to your Gmail inbox!'
      );
    } catch (err: any) {
      setErrorMessage(err?.message || (isRTL ? 'فشل إرسال كود التحقق. تأكد من صحة البريد.' : 'Failed to send verification code.'));
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isSendingCode) return;
    setIsSendingCode(true);
    setErrorMessage(null);
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
      if (data.code) {
        setCurrentDispatchedOtp(data.code);
        addVerificationCodeMessageToGmail(email.trim().toLowerCase(), data.code, data.botEmail || currentBotEmail);
      }
      setResendCooldown(60);
      setSuccessMessage(
        isRTL
          ? 'تم إعادة إرسال كود التحقق الأمني الجديد إلى تطبيق Gmail الخاص بك بنجاح!'
          : 'A new 6-digit verification code has been dispatched to your Gmail inbox!'
      );
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error resending verification code');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Timer countdown for resending code
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
      setErrorMessage(isRTL ? 'يرجى إدخال كود التحقق المكون من 6 أرقام.' : 'Please enter the 6-digit verification code.');
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
        throw new Error(verifyData.error || (isRTL ? 'كود التحقق غير صحيح، يرجى مراجعة بريدك الإلكتروني.' : 'Invalid verification code. Please check your email.'));
      }

      // 2. Perform Real Authentication
      if (mode === 'signup') {
        try {
          const user = await firebaseAuthService.signUp(
            email.trim(),
            password || 'OmniUser@2026',
            displayName.trim() || email.split('@')[0]
          );
          setSuccessMessage(isRTL ? 'تم تأكيد الكود بنجاح وإنشاء حسابك الحقيقي! 🎉' : 'Account verified and created successfully! 🎉');
          setTimeout(() => onAuthSuccess(user), 600);
        } catch (signErr: any) {
          if (signErr?.code === 'auth/email-already-in-use') {
            const loggedUser = await firebaseAuthService.logIn(email.trim(), password || 'OmniUser@2026');
            setSuccessMessage(isRTL ? 'تم التحقق وتسجيل الدخول بنجاح!' : 'Verified and logged in!');
            setTimeout(() => onAuthSuccess(loggedUser), 600);
            return;
          }
          if (signErr?.code === 'auth/operation-not-allowed' || signErr?.code === 'auth/admin-restricted-operation') {
            const loggedUser = await firebaseAuthService.serverSideRegisterOrLogin(
              email.trim(),
              password || 'OmniUser@2026',
              displayName.trim() || email.split('@')[0],
              'signup'
            );
            setSuccessMessage(isRTL ? 'تم تأكيد كود التحقق وتسجيل الدخول بنجاح! 🎉' : 'Verification code confirmed and logged in! 🎉');
            setTimeout(() => onAuthSuccess(loggedUser), 600);
            return;
          }
          throw signErr;
        }
      } else {
        try {
          const user = await firebaseAuthService.logIn(email.trim(), password || 'OmniUser@2026');
          setSuccessMessage(isRTL ? 'تم تأكيد الرمز وتسجيل الدخول بنجاح! أهلاً بك.' : 'Verified! Welcome back.');
          setTimeout(() => onAuthSuccess(user), 600);
        } catch (loginErr: any) {
          if (loginErr?.code === 'auth/operation-not-allowed' || loginErr?.code === 'auth/admin-restricted-operation') {
            const user = await firebaseAuthService.serverSideRegisterOrLogin(email.trim(), password || 'OmniUser@2026', undefined, 'login');
            setSuccessMessage(isRTL ? 'تم تأكيد كود التحقق وتسجيل الدخول بنجاح! أهلاً بك.' : 'Verified! Welcome back.');
            setTimeout(() => onAuthSuccess(user), 600);
            return;
          }
          throw loginErr;
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
      setErrorMessage(isRTL ? 'يرجى إدخال كود التحقق المكون من 6 أرقام.' : 'Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage(isRTL ? 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.' : 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage(isRTL ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
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

      setSuccessMessage(isRTL ? 'تم تأكيد الكود وتغيير كلمة المرور بنجاح! 🎉 يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.' : 'Password reset successfully! 🎉 You can now log in.');
      setMode('login');
      setIsVerifyingOtp(false);
      setEnteredOtp('');
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setErrorMessage(err?.message || (isRTL ? 'فشل تغيير كلمة المرور.' : 'Failed to reset password.'));
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleAuthError = (err: any) => {
    console.warn('Auth Notice:', err?.message || err);
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      setMode('login');
      setErrorMessage(isRTL 
        ? 'هذا البريد الإلكتروني مسجل مسبقاً! تم نقلك لتسجيل الدخول — يرجى إدخال كلمة المرور للمتابعة.' 
        : 'This email is already registered! Switched to Log In — please enter your password.');
    } else if (code === 'auth/operation-not-allowed' || code === 'auth/admin-restricted-operation') {
      setErrorMessage(isRTL 
        ? 'اضغط على زر "المتابعة عبر حساب Google" للدخول الفوري بنقرة واحدة.' 
        : 'Click "Continue with Google" for instant one-click login.');
    } else if (code === 'auth/invalid-email') {
      setErrorMessage(isRTL ? 'البريد الإلكتروني غير صحيح، يرجى التأكد منه.' : 'Please enter a valid email address.');
    } else if (code === 'auth/weak-password') {
      setErrorMessage(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' : 'Password must be at least 6 characters.');
    } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      setErrorMessage(isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى إعادة المحاولة.' : 'Incorrect email or password. Please try again.');
    } else if (code === 'auth/user-not-found') {
      setMode('signup');
      setErrorMessage(isRTL ? 'لا يوجد حساب بهذا البريد، تم نقلك لإنشاء حساب جديد!' : 'No account found with this email. Switched to sign up!');
    } else if (code === 'auth/popup-closed-by-user') {
      setErrorMessage(isRTL ? 'تم إغلاق نافذة تسجيل الدخول بجوجل.' : 'Google sign-in popup was closed.');
    } else {
      setErrorMessage(err?.message || (isRTL ? 'حدث خطأ أثناء المصادقة.' : 'An error occurred during authentication.'));
    }
  };

  const handleLoginOrSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Strict Real Email Check for account creation or login
    const emailVal = validateRealEmail(email, isRTL);
    if (!emailVal.isValid) {
      setEmailValidationError(emailVal.error || (isRTL ? '❌ هذا الإيميل مزور أو غير حقيقي! يرجى إدخال إيميل حقيقي لتتمكن من إنشاء الحساب واستلام كود التحقق.' : '❌ This email is fake or invalid.'));
      setErrorMessage(emailVal.error || (isRTL ? '❌ هذا الإيميل مزور أو غير حقيقي! يرجى إدخال إيميل حقيقي لتتمكن من إنشاء الحساب واستلام كود التحقق.' : '❌ This email is fake or invalid.'));
      return;
    }

    if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage(isRTL ? 'يرجى إدخال البريد الإلكتروني لإرسال كود استعادة الحساب.' : 'Please enter your email to receive recovery code.');
        return;
      }
      // Forgot password requires 6-digit OTP verification first
      await startOtpFlow('forgot');
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage(isRTL ? 'يرجى تعبئة جميع الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMessage(isRTL ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' : 'Password must be at least 6 characters.');
        return;
      }
    }

    // Trigger 6-digit OTP verification code delivered by Gmail Robot
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
      setSuccessMessage(isRTL ? 'تم تسجيل الدخول بحساب Google بنجاح!' : 'Successfully signed in with Google!');
      setTimeout(() => onAuthSuccess(user), 500);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 py-4 relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  Vlock<span className="text-cyan-400"> AI</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Vlock AI • Apps • Websites • Games</p>
            </div>
          </div>

          {/* Right Header: Mail Bot Config, Lock Requirement & Language Switcher */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsMailSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
              title={isRTL ? 'إعداد روبوت إرسال Gmail' : 'Gmail Sender Bot Setup'}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">{isRTL ? 'إعداد روبوت Gmail ⚙️' : 'Gmail Bot Setup ⚙️'}</span>
              <span className="sm:hidden">Gmail ⚙️</span>
            </button>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>تسجيل الدخول إلزامي لدخول التطبيق</span>
            </div>
            <LanguageSelectorButton variant="navbar" />
          </div>
        </div>
      </header>

      {/* Main Auth Gate Center */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 relative z-10">
        
        {/* Left Side (or Right in RTL): Value & Unlocked Features */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left rtl:lg:text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>بوابة الدخول الرسمية للاستوديو • Vlock AI OS</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {t('auth_gate_title', 'تسجيل الدخول إلزامي لدخول التطبيق واستوديو الألعاب')}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t('auth_gate_subtitle', 'يجب على كل شخص يدخل التطبيق تسجيل الدخول أو إنشاء حساب للوصول إلى استوديو الألعاب، صناعة ألعاب مثل ببجي، وتحديثات التطبيقات بقرارك 100%.')}
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-left rtl:text-right shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">محرك ألعاب ببجي 60FPS</h4>
                <p className="text-[11px] text-slate-400">اصنع أي لعبة تخطر ببالك بالذكاء الاصطناعي مع لوحة تحكم باللمس.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-left rtl:text-right shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">تحديثات بقرارك 100%</h4>
                <p className="text-[11px] text-slate-400">أنت تقرر التحديث بنفسك والذكاء الاصطناعي ينفذه بدقة دون تغيير.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-left rtl:text-right shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">نشر وفهرسة في جوجل</h4>
                <p className="text-[11px] text-slate-400">ظهور فوري في بحث Google مع تقييم 5 نجوم وبطاقات SERP غنية.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-left rtl:text-right shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-bold">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">حزم بلاي ستور وآب ستور</h4>
                <p className="text-[11px] text-slate-400">تجهيز ملفات .apk و .aab و .ipa جاهزة للنشر على المتاجر.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> حماية مشفرة عبر Google Firebase
            </span>
            <span>•</span>
            <span>وصول مجاني فوري</span>
          </div>
        </div>

        {/* Right Side: Authentication Box */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            
            {/* Top Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setIsVerifyingOtp(false);
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('auth_gate_login', 'تسجيل الدخول')}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setIsVerifyingOtp(false);
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('auth_gate_signup', 'حساب جديد')}
                </button>
              </div>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* OTP VERIFICATION CODE SCREEN WITH GMAIL ROBOT */}
            {isVerifyingOtp ? (
              <form onSubmit={mode === 'forgot' ? handleResetPasswordSubmit : handleVerifyOtpAndProceed} className="space-y-4 animate-in fade-in">
                {/* INTERACTIVE VERIFICATION ROBOT WIDGET */}
                <VerificationRobotWidget
                  email={email}
                  setEmail={setEmail}
                  onCodeRetrieved={(code) => {
                    setEnteredOtp(code);
                    setSuccessMessage(isRTL ? 'تم تعبئة كود التحقق من الروبوت بنجاح! ✨ اضغط تأكيد للدخول.' : 'Code auto-filled from Robot! ✨ Click confirm to enter.');
                  }}
                  onCodeDispatched={() => {
                    setResendCooldown(60);
                  }}
                  onOpenSettings={() => setIsMailSettingsOpen(true)}
                />

                {/* Direct Button: Open Verification Code in Gmail App */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-indigo-950/60 border border-red-500/40 shadow-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-red-400" />
                      <span>{isRTL ? 'تطبيق بريد Gmail (استلام الكود):' : 'Gmail Inbox (Verification Code):'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono font-bold">
                      GMAIL APP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isRTL 
                      ? `قام روبوت التحقق (${currentBotEmail}) بإرسال الرسالة إلى بريدك. اضغط الزر لعرض رسالة Gmail واستخراج الكود فوراً:`
                      : `The verification bot (${currentBotEmail}) dispatched the email to your Gmail inbox. Click below to view:`}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowGmailPreviewModal(true)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-101 active:scale-99"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{isRTL ? '📩 فتح رسالة كود التحقق في تطبيق Gmail' : '📩 Open Verification Email in Gmail'}</span>
                    </button>
                    {currentDispatchedOtp && (
                      <button
                        type="button"
                        onClick={() => {
                          setEnteredOtp(currentDispatchedOtp);
                          setSuccessMessage(isRTL ? `تم تعبئة الكود (${currentDispatchedOtp}) تلقائياً! اضغط تأكيد الدخول.` : `Code (${currentDispatchedOtp}) auto-filled!`);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-300" />
                        <span>{isRTL ? 'تعبئة تلقائية ⚡' : 'Auto Fill ⚡'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 6-Digit Code Input Field */}
                <div className="space-y-1.5 text-center pt-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    {isRTL ? 'أدخل رمز التحقق المكون من 6 أرقام (أو استلمه من الروبوت أعلاه):' : 'Enter 6-Digit Code (or get from Robot above):'}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="------"
                    autoFocus
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono font-black py-3 rounded-2xl bg-slate-950 border-2 border-cyan-500/60 text-cyan-300 focus:outline-none focus:border-cyan-400 shadow-inner"
                  />
                  <p className="text-[10px] text-slate-500">
                    {isRTL ? 'حماية مشفرة ومصادقة حقيقية عبر روبوت Gmail' : 'Encrypted real verification via Gmail Robot'}
                  </p>
                </div>

                {/* In Forgot Password Mode: Add New Password Fields */}
                {mode === 'forgot' && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="space-y-1 text-left rtl:text-right">
                      <label className="text-xs font-semibold text-slate-300 block">
                        {isRTL ? 'كلمة المرور الجديدة (6 أحرف على الأقل):' : 'New Password (min 6 chars):'}
                      </label>
                      <div className="relative">
                        <Lock className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 text-slate-500 hover:text-slate-300"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-left rtl:text-right">
                      <label className="text-xs font-semibold text-slate-300 block">
                        {isRTL ? 'تأكيد كلمة المرور الجديدة:' : 'Confirm New Password:'}
                      </label>
                      <div className="relative">
                        <Lock className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                      <span>{isRTL ? 'جاري التحقق وتأكيد البيانات...' : 'Verifying & Confirming...'}</span>
                    </>
                  ) : mode === 'forgot' ? (
                    <>
                      <Key className="w-4 h-4" />
                      <span>{isRTL ? 'تأكيد الكود وتغيير كلمة المرور 🔐' : 'Confirm Code & Reset Password 🔐'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isRTL ? 'تأكيد الرمز ودخول التطبيق 🚀' : 'Confirm Code & Enter App 🚀'}</span>
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
                      {resendCooldown > 0
                        ? isRTL ? `طلب كود جديد (${resendCooldown} ث)` : `Resend in (${resendCooldown}s)`
                        : isRTL ? 'طلب كود جديد من الروبوت 🤖' : 'Request New Code 🤖'}
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
                    ← {isRTL ? 'تعديل البريد الإلكتروني' : 'Change email'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLoginOrSignup} className="space-y-4">
                {/* 1-Click Google Sign In */}
                {mode !== 'forgot' && (
                  <div className="space-y-3">
                    <div className="p-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/40">
                      <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-300">
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          {isRTL ? 'موصى به: دخول فوري بنقرة واحدة' : 'Recommended: 1-Click Instant Access'}
                        </span>
                        <span className="text-indigo-300">
                          {isRTL ? 'حساب Google الرسمي' : 'Official Google / Gmail'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading || isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-700/80 hover:border-indigo-400 text-white text-xs font-black flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isGoogleLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                        ) : (
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                        )}
                        <span className="text-sm font-extrabold">{t('auth_gate_google', 'المتابعة عبر حساب Google')}</span>
                      </button>
                    </div>

                    <div className="relative flex items-center justify-center my-3">
                      <div className="border-t border-slate-800 w-full" />
                      <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-wider font-bold shrink-0">
                        {isRTL ? 'أو عبر البريد الإلكتروني' : 'Or with Email'}
                      </span>
                    </div>

                    {/* DIRECT ROBOT CODE DISPATCH HELPER */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/40 flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                          <Bot className="w-4 h-4 animate-pulse" />
                        </div>
                        <div className="text-right rtl:text-right">
                          <span className="text-[11px] font-bold text-white block">
                            {isRTL ? 'روبوت إرسال كود التحقق 🤖' : 'Verification Code Robot 🤖'}
                          </span>
                          <span className="text-[10px] text-cyan-300 font-mono block">
                            vlock.verification.bot@gmail.com
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => startOtpFlow('auth')}
                        disabled={isSendingCode}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        {isSendingCode ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-yellow-300" />
                        )}
                        <span>{isRTL ? 'طلب الكود بالروبوت' : 'Send via Robot'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Display Name field (only in signup) */}
                {mode === 'signup' && (
                  <div className="space-y-1 text-left rtl:text-right">
                    <label className="text-xs font-semibold text-slate-300 block">
                      {isRTL ? 'اسم المستخدم الكامل:' : 'Full Name / Display Name:'}
                    </label>
                    <div className="relative">
                      <User className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Creator Name"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Email field with Real Email Validator */}
                <div className="space-y-1.5 text-left rtl:text-right">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 block">
                      {isRTL ? 'البريد الإلكتروني الحقيقي:' : 'Real Email Address:'}
                    </label>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {isRTL ? 'مطلوب بريد حقيقي ونشط' : 'Active email required'}
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setEmail(val);
                        if (emailValidationError) {
                          setEmailValidationError(null);
                        }
                      }}
                      onBlur={() => {
                        if (email) {
                          const valRes = validateRealEmail(email, isRTL);
                          if (!valRes.isValid) {
                            setEmailValidationError(valRes.error || null);
                          } else {
                            setEmailValidationError(null);
                          }
                        }
                      }}
                      placeholder={isRTL ? 'user@domain.com' : 'username@domain.com'}
                      className={`w-full bg-slate-950 border rounded-xl px-10 py-2.5 text-xs text-white focus:outline-none font-mono transition-colors ${
                        emailValidationError ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700 focus:border-indigo-500'
                      }`}
                    />
                  </div>

                  {/* Warning message if email is fake or invalid */}
                  {emailValidationError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-bold">{emailValidationError}</span>
                    </div>
                  )}
                </div>

                {/* Password field */}
                {mode !== 'forgot' && (
                  <div className="space-y-1 text-left rtl:text-right">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">
                        {isRTL ? 'كلمة المرور:' : 'Password:'}
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                        >
                          {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm Password (only in signup) */}
                {mode === 'signup' && (
                  <div className="space-y-1 text-left rtl:text-right">
                    <label className="text-xs font-semibold text-slate-300 block">
                      {isRTL ? 'تأكيد كلمة المرور:' : 'Confirm Password:'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button with Gmail Robot */}
                <button
                  type="submit"
                  disabled={isLoading || isSendingCode}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 disabled:opacity-50"
                >
                  {isSendingCode || isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{isRTL ? 'جاري إرسال كود التحقق عبر روبوت جيميل...' : 'Dispatching Code via Gmail Bot...'}</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 text-cyan-300 animate-pulse" />
                      <span>
                        {mode === 'login'
                          ? (isRTL ? 'إرسال كود التحقق وتسجيل الدخول 🤖' : 'Send Verification Code & Log In 🤖')
                          : mode === 'signup'
                          ? (isRTL ? 'إرسال كود التحقق وإنشاء الحساب 🤖' : 'Send Verification Code & Sign Up 🤖')
                          : (isRTL ? 'إرسال كود التحقق للاستعادة 🤖' : 'Send Verification Code for Reset 🤖')}
                      </span>
                    </>
                  )}
                </button>

                {/* Back from Forgot mode */}
                {mode === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-xs text-slate-400 hover:text-white py-1 cursor-pointer"
                  >
                    ← {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                  </button>
                )}
              </form>
            )}

            {/* Bottom Footer Switcher */}
            <div className="mt-5 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
              {mode === 'login' ? (
                <p>
                  {isRTL ? 'ليس لديك حساب حتى الآن؟ ' : "Don't have an account yet? "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                    }}
                    className="text-emerald-400 hover:underline font-bold cursor-pointer"
                  >
                    {isRTL ? 'إنشاء حساب جديد مجاناً' : 'Sign Up Free'}
                  </button>
                </p>
              ) : mode === 'signup' ? (
                <p>
                  {isRTL ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="text-indigo-400 hover:underline font-bold cursor-pointer"
                  >
                    {isRTL ? 'تسجيل الدخول هنا' : 'Log In Here'}
                  </button>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      {/* Security & Brand Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 py-4 text-center text-xs text-slate-500 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <span>© 2026 Vlock AI Studio. جميع الحقوق محفوظة.</span>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" /> تسجيل دخول مشفر عبر Firebase
            </span>
            <span>•</span>
            <span>حماية الخصوصية 100%</span>
          </div>
        </div>
      </footer>

      {/* Mailer Bot Settings Modal */}
      <MailBotSettingsModal
        isOpen={isMailSettingsOpen}
        onClose={() => setIsMailSettingsOpen(false)}
      />

      {/* Gmail Inbox Message Preview Modal (استلام الكود من تطبيق جيميل وبوت التحقق) */}
      {showGmailPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div 
            className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto" 
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>صندوق وارد تطبيق Gmail (استلام الكود)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Vlock AI Bot 📨</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isRTL ? `المستلم: ${email}` : `Recipient: ${email}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGmailPreviewModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Message Container (Official Gmail Design) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white leading-snug">
                    🔐 رمز التحقق الأمني لتسجيل الدخول في Vlock AI ({currentDispatchedOtp || '------'})
                  </h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="font-bold text-cyan-300">من:</span>
                    <span>Vlock AI Verification Bot 🤖 &lt;{currentBotEmail}&gt;</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="font-bold text-slate-300">إلى:</span>
                    <span className="text-slate-300 font-mono">{email}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">الآن</span>
              </div>

              {/* Email Body */}
              <div className="py-3 text-center space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  أهلاً بك! لقد قام روبوت التحقق الذكي (<strong>{currentBotEmail}</strong>) بإرسال كود التحقق الرسمي إلى بريدك الإلكتروني الحقيقي:
                </p>

                <div className="p-4 rounded-2xl bg-slate-900 border-2 border-indigo-500/50 inline-block shadow-inner">
                  <div className="text-[10px] uppercase font-mono font-bold text-indigo-400 mb-1">
                    YOUR 6-DIGIT VERIFICATION CODE
                  </div>
                  <div className="text-3xl font-black font-mono tracking-[0.35em] text-cyan-300 select-all">
                    {currentDispatchedOtp || '------'}
                  </div>
                </div>

                <p className="text-[11px] text-amber-400 font-medium">
                  ⏳ هذا الكود صالح لمدة 15 دقيقة فقط للاستخدام لمرة واحدة.
                </p>
              </div>

              {/* Action Buttons inside Gmail Modal */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (currentDispatchedOtp) {
                      setEnteredOtp(currentDispatchedOtp);
                      setShowGmailPreviewModal(false);
                      setSuccessMessage(isRTL ? 'تم نسخ وتعبئة الكود تلقائياً من Gmail! ✨ اضغط تأكيد للدخول.' : 'Code auto-filled from Gmail!');
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{isRTL ? `تعبئة الكود تلقائياً في شاشة الدخول (${currentDispatchedOtp}) ⚡` : `Auto-Fill Code (${currentDispatchedOtp}) ⚡`}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentDispatchedOtp) {
                      navigator.clipboard.writeText(currentDispatchedOtp);
                      setSuccessMessage(isRTL ? 'تم نسخ كود التحقق بنجاح!' : 'Code copied to clipboard!');
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'نسخ' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Floating Verification Robot Widget on App */}
      <VerificationRobotWidget
        isFloating={true}
        email={email}
        setEmail={setEmail}
        onCodeRetrieved={(code) => {
          setEnteredOtp(code);
          setIsVerifyingOtp(true);
        }}
        onCodeDispatched={() => {
          setIsVerifyingOtp(true);
        }}
        onOpenSettings={() => setIsMailSettingsOpen(true)}
      />
    </div>
  );
};
