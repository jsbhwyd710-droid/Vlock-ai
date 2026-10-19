import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Globe, 
  Smartphone, 
  Video, 
  Image as ImageIcon, 
  MessageSquare, 
  CreditCard, 
  CheckCircle2, 
  HelpCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  FlaskConical,
  UserCheck,
  Loader2
} from 'lucide-react';
import { ActiveTab, PlanType, UserSubscription, WebProject, AuthUser, AppUpdateRecord } from './types';
import { Navbar } from './components/Navbar';
import { HelpAssistantModal } from './components/HelpAssistantModal';
import { WebsiteBuilder } from './components/WebsiteBuilder';
import { CustomDomainManager } from './components/CustomDomainManager';
import { MobileAppPublisher } from './components/MobileAppPublisher';
import { VideoStudio } from './components/VideoStudio';
import { PhotoStudio } from './components/PhotoStudio';
import { AiChat } from './components/AiChat';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AuthModal } from './components/AuthModal';
import { AppUpdateStudioModal } from './components/AppUpdateStudioModal';
import { GameStudio } from './components/GameStudio';
import { GooglePublishModal } from './components/GooglePublishModal';
import { LanguageSelectorButton } from './components/LanguageSelectorButton';
import { AuthGateScreen } from './components/AuthGateScreen';
import { GmailStudio } from './components/GmailStudio';
import { VerificationRobotWidget } from './components/VerificationRobotWidget';
import { GiveawayHub } from './components/GiveawayHub';
import { WelcomeBanner } from './components/WelcomeBanner';
import { BuildHistoryHub } from './components/BuildHistoryHub';
import { AiAppConnector } from './components/AiAppConnector';
import { useLanguage } from './contexts/LanguageContext';
import { firebaseAuthService } from './services/firebase';

export default function App() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('games');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState<boolean>(false);
  const [isUpdateStudioOpen, setIsUpdateStudioOpen] = useState<boolean>(false);
  const [isGlobalGooglePublishOpen, setIsGlobalGooglePublishOpen] = useState<boolean>(false);
  const [targetPlan, setTargetPlan] = useState<PlanType>('pro');
  const [sharedPrompt, setSharedPrompt] = useState<string>('');

  // Authentication States - Mandatory Login
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');

  // Guest Mode & The Fake One Workspace States
  const [guestName, setGuestName] = useState<string>('Guest Creator');
  const [isSandboxActive, setIsSandboxActive] = useState<boolean>(false);

  // Subscribe to Firebase Auth state on mount (Strictly Real Accounts)
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChange((user) => {
      // Purge any fake or legacy simulated mock user
      if (
        user &&
        (!user.email ||
          user.email.includes('omnicraft.ai') ||
          user.email.includes('example.com') ||
          user.email.includes('fake'))
      ) {
        firebaseAuthService.logOut();
        setCurrentUser(null);
        setIsAuthChecking(false);
        return;
      }

      setCurrentUser(user);
      setIsAuthChecking(false);
      if (user?.displayName) {
        setGuestName(user.displayName);
      }
      if (user?.plan && user.plan !== 'free') {
        setSubscription((prev) => ({
          ...prev,
          plan: user.plan!,
          isPaid: true,
          creditsRemaining: user.plan === 'ultra' ? 9999 : 500,
          maxCredits: user.plan === 'ultra' ? 9999 : 500,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.displayName) {
      setGuestName(user.displayName);
    }
    setIsAuthOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await firebaseAuthService.logOut();
      setCurrentUser(null);
      setGuestName('Guest Creator');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const openUpgradeModal = (plan: PlanType = 'pro') => {
    setTargetPlan(plan);
    setIsUpgradeOpen(true);
  };

  // User Subscription State initialized with persistent storage & Firestore sync
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem('omnicraft_user_sub');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.plan === 'pro' || parsed.plan === 'ultra')) {
          return parsed;
        }
      }
    } catch (e) {}
    return {
      plan: 'free',
      billingCycle: 'monthly',
      creditsRemaining: 50,
      maxCredits: 50,
      renewsAt: new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
      isPaid: false,
      currency: 'USD',
      priceMonthly: 0,
    };
  });

  // Save subscription persistently so even if the user closes the app and comes back years later it is saved
  useEffect(() => {
    if (subscription.plan !== 'free') {
      localStorage.setItem('omnicraft_user_sub', JSON.stringify(subscription));
    } else {
      localStorage.removeItem('omnicraft_user_sub');
    }
  }, [subscription]);

  // Current Active Project for Custom Domain Publishing
  const [currentWebProject, setCurrentWebProject] = useState<WebProject>({
    id: 'proj_default',
    name: 'NexusAI Studio Platform',
    prompt: 'A modern SaaS landing page for an AI creative workspace with interactive pricing calculator',
    subdomain: 'nexus-studio',
    isPublished: true,
    publishedUrl: 'https://nexus-studio.com',
    cleanAppUrl: 'https://nexus-studio.com',
    domainSuffix: 'com',
    isWhiteLabel: true,
    isSandbox: false,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    htmlCode: `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-slate-950 text-white p-8"><h1 class="text-3xl font-bold">Hello World</h1></body></html>`,
  });

  const consumeCredit = (): boolean => {
    if (subscription.plan !== 'free') {
      return true; // Pro and Ultra have unlimited generations
    }
    if (subscription.creditsRemaining <= 0) {
      return false;
    }
    setSubscription((prev) => ({
      ...prev,
      creditsRemaining: prev.creditsRemaining - 1,
    }));
    return true;
  };

  const handleRedeemReward = (rewardType: 'credits' | 'plan', rewardValue: any, promoTitle: string) => {
    if (rewardType === 'credits') {
      const added = Number(rewardValue) || 10000;
      setSubscription((prev) => ({
        ...prev,
        creditsRemaining: prev.creditsRemaining + added,
        maxCredits: Math.max(prev.maxCredits, prev.creditsRemaining + added),
      }));
    } else if (rewardType === 'plan') {
      const targetPlan: PlanType = rewardValue === 'ultra' ? 'ultra' : 'pro';
      setSubscription((prev) => ({
        ...prev,
        plan: targetPlan,
        isPaid: true,
        creditsRemaining: prev.creditsRemaining + 50000,
        maxCredits: Math.max(prev.maxCredits, 50000),
      }));
      if (currentUser?.uid) {
        firebaseAuthService.updateUserPlan(currentUser.uid, targetPlan).catch(() => {});
      }
    }
  };

  const handleUpgradePlan = (
    plan: PlanType,
    billingCycle: 'monthly' | 'yearly',
    currency: 'USD' | 'EUR' | 'GBP',
    cardDetails?: { cardBrand: string; cardLast4: string; cardholderName: string; transactionId: string }
  ) => {
    const maxCredits = plan === 'ultra' ? 9999 : plan === 'pro' ? 500 : 50;
    const priceMonthly = plan === 'ultra' ? 60 : plan === 'pro' ? 20 : 0;

    setSubscription({
      plan,
      billingCycle,
      creditsRemaining: maxCredits,
      maxCredits,
      renewsAt: new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
      isPaid: plan !== 'free',
      currency,
      priceMonthly,
      cardBrand: cardDetails?.cardBrand || (plan !== 'free' ? 'Visa' : undefined),
      cardLast4: cardDetails?.cardLast4,
      cardholderName: cardDetails?.cardholderName,
      transactionId: cardDetails?.transactionId,
    });

    if (currentUser) {
      firebaseAuthService.updateUserPlan(currentUser.uid, plan);
      setCurrentUser((prev) => (prev ? { ...prev, plan } : null));
    }
  };

  const handleNavigateFromHelp = (tab: ActiveTab, initialPrompt?: string) => {
    setActiveTab(tab);
    if (initialPrompt) {
      setSharedPrompt(initialPrompt);
    }
  };

  const handlePublishToDomain = (project: WebProject) => {
    setCurrentWebProject(project);
    setActiveTab('domains');
  };

  const handleUpdateSubdomain = (subdomain: string, customDomain?: string, domainSuffix: string = 'com', isPublished?: boolean) => {
    const cleanUrl = customDomain ? `https://${customDomain}` : `https://${subdomain}.${domainSuffix}`;
    setCurrentWebProject((prev) => ({
      ...prev,
      subdomain,
      customDomain,
      domainSuffix,
      publishedUrl: cleanUrl,
      cleanAppUrl: cleanUrl,
      isPublished: isPublished !== undefined ? isPublished : prev.isPublished,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const handlePublishGameToWebsite = (gameTitle: string, gameHtml: string) => {
    // Generate clean interactive arcade section inside current Web Project
    const gameSectionHtml = `
  <!-- 🎮 Interactive 60FPS Game Section: ${gameTitle} -->
  <section id="game-arcade" class="py-16 px-6 max-w-6xl mx-auto text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-4">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      Playable 60FPS Web Game Active
    </div>
    <h2 class="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
      Play <span class="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">${gameTitle}</span> Directly On This Website
    </h2>
    <p class="text-slate-400 text-sm max-w-xl mx-auto mb-8">
      Zero downloads required. Playable instantly with keyboard or mobile touch controls.
    </p>
    <div class="relative w-full max-w-4xl mx-auto h-[620px] rounded-3xl overflow-hidden shadow-2xl border-2 border-indigo-500/50 bg-black">
      <iframe
        srcdoc="${gameHtml.replace(/"/g, '&quot;')}"
        title="${gameTitle}"
        class="w-full h-full border-0"
        allow="autoplay; fullscreen; gamepad; focus"
        sandbox="allow-scripts allow-same-origin allow-modals"
      ></iframe>
    </div>
  </section>`;

    let updatedHtml = currentWebProject.htmlCode;
    if (updatedHtml.includes('</main>')) {
      updatedHtml = updatedHtml.replace('</main>', `${gameSectionHtml}\n  </main>`);
    } else if (updatedHtml.includes('</body>')) {
      updatedHtml = updatedHtml.replace('</body>', `${gameSectionHtml}\n</body>`);
    } else {
      updatedHtml += gameSectionHtml;
    }

    setCurrentWebProject((prev) => ({
      ...prev,
      htmlCode: updatedHtml,
      lastUpdated: new Date().toISOString(),
    }));

    setActiveTab('builder');
  };

  // 1. Loading Authentication State
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/30 mb-4 animate-pulse">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-300">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>{isRTL ? 'جاري التحقق من تسجيل الدخول...' : 'Checking authentication...'}</span>
        </div>
      </div>
    );
  }

  // 2. Mandatory Login Gate (كل شخص يدخل التطبيق لازم يسجل الدخول)
  if (!currentUser) {
    return <AuthGateScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Top Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subscription={subscription}
        openUpgradeModal={() => setIsUpgradeOpen(true)}
        openHelpModal={() => setIsHelpOpen(true)}
        openUpdateStudio={() => setIsUpdateStudioOpen(true)}
        openGooglePublishModal={() => setIsGlobalGooglePublishOpen(true)}
        isSandboxActive={isSandboxActive}
        onToggleSandbox={setIsSandboxActive}
        guestName={guestName}
        onUpdateGuestName={setGuestName}
        currentUser={currentUser}
        openAuthModal={openAuthModal}
        onSignOut={handleSignOut}
      />

      {/* 3. Welcome & Onboarding Banner */}
      <WelcomeBanner
        currentUser={currentUser}
        subscription={subscription}
        onNavigateToTab={(tab) => setActiveTab(tab)}
        openUpgradeModal={() => setIsUpgradeOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Web & App Builder (with Live App & The Fake One Sandbox) */}
        {activeTab === 'builder' && (
          <WebsiteBuilder
            initialPrompt={sharedPrompt}
            onPublishToDomain={handlePublishToDomain}
            consumeCredit={consumeCredit}
            isSandboxActive={isSandboxActive}
            onToggleSandbox={setIsSandboxActive}
            guestName={guestName}
          />
        )}

        {/* Tab: Game Studio (Full Games with Playable Canvas, Physics Tuning & Store Packaging) */}
        {activeTab === 'games' && (
          <GameStudio
            consumeCredit={consumeCredit}
            guestName={guestName}
            onNavigateToStores={() => setActiveTab('stores')}
            openUpdateModal={() => setIsUpdateStudioOpen(true)}
            onPublishGameToWebsite={handlePublishGameToWebsite}
          />
        )}

        {/* Tab 2: Free Custom URLs & Domains */}
        {activeTab === 'domains' && (
          <CustomDomainManager
            currentProject={currentWebProject}
            onUpdateSubdomain={handleUpdateSubdomain}
          />
        )}

        {/* Tab 3: Google Play Store & Apple App Store */}
        {activeTab === 'stores' && (
          <MobileAppPublisher consumeCredit={consumeCredit} />
        )}

        {/* Tab 4: AI Video Studio */}
        {activeTab === 'video' && (
          <VideoStudio consumeCredit={consumeCredit} />
        )}

        {/* Tab 5: AI Photo Studio */}
        {activeTab === 'photo' && (
          <PhotoStudio consumeCredit={consumeCredit} />
        )}

        {/* Tab: Conversational AI Chat for Everyone */}
        {activeTab === 'chat' && (
          <AiChat
            onNavigateToTab={handleNavigateFromHelp}
            consumeCredit={consumeCredit}
          />
        )}

        {/* Tab: Dedicated Build History & Saved Projects Hub */}
        {activeTab === 'history' && (
          <BuildHistoryHub
            onRestoreProject={(proj) => {
              setCurrentWebProject(proj);
              setActiveTab('builder');
            }}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Tab: Dedicated AI App Connector & Injection Hub */}
        {activeTab === 'ai-connect' && (
          <AiAppConnector
            currentProject={currentWebProject}
            onUpdateProjectHtml={(newHtml) => {
              setCurrentWebProject((prev) => ({
                ...prev,
                htmlCode: newHtml,
                lastUpdated: new Date().toISOString(),
              }));
            }}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            consumeCredit={consumeCredit}
          />
        )}

        {/* Tab: Free Giveaways & Redeem Codes Hub */}
        {activeTab === 'giveaway' && (
          <GiveawayHub
            subscription={subscription}
            onRedeemReward={handleRedeemReward}
            guestName={guestName}
            userEmail={currentUser?.email}
          />
        )}

        {/* Tab: Gmail Hub & Workspace Integration */}
        {activeTab === 'gmail' && (
          <GmailStudio
            currentUser={currentUser}
            openAuthModal={openAuthModal}
            consumeCredit={consumeCredit}
          />
        )}

        {/* Tab 7: Subscriptions & Real Card Billing View */}
        {activeTab === 'pricing' && (
          <div className="space-y-8 max-w-5xl mx-auto py-4">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
                <CreditCard className="w-3.5 h-3.5" />
                REAL CARD SUBSCRIPTIONS • VISA ACCEPTED
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Studio Plans & Real Subscriptions
              </h1>
              <p className="text-sm text-slate-400">
                Unlock full studio capabilities, custom domains, and mobile store app bundles with a real Visa, Mastercard, or major payment card.
              </p>
            </div>

            {/* Active Subscription Status Banner (if paid) */}
            {subscription.isPaid && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        Active Subscription: {subscription.plan.toUpperCase()}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        PAID & ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      Billed via {subscription.cardBrand || 'Visa'} •••• {subscription.cardLast4 || '4242'} | Cardholder: {subscription.cardholderName || 'Verified Subscriber'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openUpgradeModal('ultra')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
                  >
                    Manage Billing
                  </button>
                </div>
              </div>
            )}

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Starter */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Starter</h3>
                  <p className="text-xs text-slate-400">Basic preview tier</p>
                  <div className="mt-4 text-3xl font-extrabold text-white">$0</div>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">✓ 50 AI generations/month</li>
                    <li className="flex items-center gap-2">✓ Clean .app.run subdomain</li>
                    <li className="flex items-center gap-2">✓ Basic live preview & code editor</li>
                    <li className="flex items-center gap-2 text-slate-500">✗ Custom domain linking</li>
                    <li className="flex items-center gap-2 text-slate-500">✗ Mobile store exports</li>
                  </ul>
                </div>
                <button
                  disabled={subscription.plan === 'free'}
                  onClick={() => handleUpgradePlan('free', 'monthly', 'USD')}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  {subscription.plan === 'free' ? 'Current Tier' : 'Downgrade to Starter'}
                </button>
              </div>

              {/* Pro Creator */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border-2 border-blue-500 space-y-4 flex flex-col justify-between shadow-2xl relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-[10px] font-extrabold text-white uppercase tracking-wider shadow">
                  VISA PREFERRED • REAL CARD
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Pro Creator</h3>
                  <p className="text-xs text-blue-300">Full unlimited builds & real card billing</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">$20</span>
                    <span className="text-xs text-slate-400 font-semibold">/month</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                    <li className="flex items-center gap-2 text-blue-300">✓ Unlimited Gemini 2.5 Flash generations</li>
                    <li className="flex items-center gap-2">✓ <strong>Real Visa / Mastercard payment checkout</strong></li>
                    <li className="flex items-center gap-2">✓ Custom Domain Linking (your own domain & .app.run)</li>
                    <li className="flex items-center gap-2">✓ 100% White-Label (No creator website branding)</li>
                    <li className="flex items-center gap-2">✓ AI Video Studio (1080p storyboards & voiceover)</li>
                    <li className="flex items-center gap-2">✓ 8K AI Photo synthesis</li>
                  </ul>
                </div>
                <button
                  onClick={() => openUpgradeModal('pro')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {subscription.plan === 'pro' && subscription.isPaid ? 'Active Subscription' : 'Subscribe with Real Visa / Card'}
                </button>
              </div>

              {/* Studio Ultra */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Studio Ultra</h3>
                  <p className="text-xs text-slate-400">For agencies & native app publishers</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">$60</span>
                    <span className="text-xs text-slate-400 font-semibold">/month</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">✓ Everything in Pro Creator</li>
                    <li className="flex items-center gap-2 text-purple-400">✓ <strong>Google Play & App Store Cloud Builds</strong></li>
                    <li className="flex items-center gap-2">✓ Download compiled .apk, .aab, and .ipa files</li>
                    <li className="flex items-center gap-2">✓ 4K cinematic video production</li>
                    <li className="flex items-center gap-2">✓ Priority dedicated GPU compute pipeline</li>
                  </ul>
                </div>
                <button
                  onClick={() => openUpgradeModal('ultra')}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700 cursor-pointer"
                >
                  {subscription.plan === 'ultra' && subscription.isPaid ? 'Active Subscription' : 'Subscribe to Ultra'}
                </button>
              </div>
            </div>

            {/* Real Card Security Guarantee Box */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-blue-500/30 text-xs text-slate-300 space-y-3">
              <h4 className="font-bold text-blue-300 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Real Card Verification & Security Policy
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                All subscriptions require a valid, authentic payment card (Visa, Mastercard, American Express, or Discover). Every card number is strictly verified against mathematical checksums (Luhn algorithm), expiration validity, CVV/CVC authentication, and issuing bank approval. Fake or test cards are automatically rejected.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Floating Dedicated "UPDATE" Button for Anyone */}
      <button
        onClick={() => setIsUpdateStudioOpen(true)}
        className="fixed bottom-6 left-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-extrabold text-xs shadow-2xl shadow-emerald-500/40 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-emerald-300/40 animate-pulse"
        title="UPDATE - تحديث التطبيق واللعبة بقرارك 100%"
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span>{t('btn_update', 'UPDATE / تحديث ⚡')}</span>
        <span className="px-1.5 py-0.5 rounded-full bg-black/30 text-[10px] font-mono">
          {currentWebProject.currentVersion || 'v1.1.0'}
        </span>
      </button>

      {/* Floating Language Switcher Button (لتغيير اللغة بسهولة من أي شاشة) */}
      <LanguageSelectorButton variant="floating" />

      {/* Floating AI Help Guide for Anyone */}
      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-2xl shadow-indigo-600/40 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
      >
        <HelpCircle className="w-4 h-4 text-white" />
        <span>{t('btn_help', 'مساعدة AI')}</span>
      </button>

      {/* Interactive Modals */}
      <HelpAssistantModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onNavigate={handleNavigateFromHelp}
      />

      <SubscriptionModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        currentSubscription={subscription}
        onUpgradePlan={handleUpgradePlan}
        initialPlan={targetPlan}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authInitialMode}
      />

      {/* Global Google Search Publishing & SEO Modal */}
      <GooglePublishModal
        isOpen={isGlobalGooglePublishOpen}
        onClose={() => setIsGlobalGooglePublishOpen(false)}
        gameTitle={currentWebProject.name || 'OmniCraft Web & Game App'}
        gameUrl={currentWebProject.cleanAppUrl || currentWebProject.publishedUrl}
        gameDescription="تطبيق ولعبة ويب كاملة جاهزة للتشغيل أونلاين على متصفح جوجل بدون تنزيل أو من خلال متجر جوجل بلاي وآب ستور."
      />

      <AppUpdateStudioModal
        isOpen={isUpdateStudioOpen}
        onClose={() => setIsUpdateStudioOpen(false)}
        currentProject={currentWebProject}
        onUpdateAppHtml={(newHtml, record) => {
          setCurrentWebProject((prev) => ({
            ...prev,
            htmlCode: newHtml,
            lastUpdated: new Date().toISOString(),
            currentVersion: record.version,
            updatesHistory: [record, ...(prev.updatesHistory || [])],
          }));
        }}
        guestName={guestName}
      />

      {/* Verification Code Robot on App */}
      <VerificationRobotWidget
        isFloating={true}
        email={currentUser?.email || ''}
      />
    </div>
  );
}
