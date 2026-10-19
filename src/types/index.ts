export type ActiveTab = 
  | 'builder' 
  | 'games' 
  | 'domains' 
  | 'stores' 
  | 'video' 
  | 'photo' 
  | 'chat' 
  | 'history' 
  | 'ai-connect' 
  | 'pricing' 
  | 'gmail' 
  | 'giveaway';

export interface BuildHistoryRecord {
  id: string;
  title: string;
  type: 'app' | 'game' | 'video' | 'photo';
  timestamp: string;
  version: string;
  prompt: string;
  codeSnippet?: string;
  previewUrl?: string;
  htmlContent?: string;
  thumbnailUrl?: string;
  modelEngine?: string;
  status: 'published' | 'draft' | 'archived';
  fileSize?: string;
}

export interface GiveawayItem {
  id: string;
  title: string;
  prize: string;
  value: string;
  participantsCount: number;
  endsInHours: number;
  badge: string;
  category: 'pro' | 'credits' | 'store' | 'domain' | 'ai';
  description: string;
  isEntered?: boolean;
}

export interface PromoCodeRecord {
  code: string;
  title: string;
  rewardType: 'credits' | 'plan';
  rewardValue: string | number;
  description: string;
  badge: string;
}

export type PlanType = 'free' | 'pro' | 'ultra';

export interface UserSubscription {
  plan: PlanType;
  billingCycle: 'monthly' | 'yearly';
  creditsRemaining: number;
  maxCredits: number;
  renewsAt: string;
  isPaid: boolean;
  currency: 'USD' | 'EUR' | 'GBP';
  priceMonthly: number;
  cardBrand?: string;
  cardLast4?: string;
  cardholderName?: string;
  transactionId?: string;
  authCode?: string;
}

export interface GameProject {
  id: string;
  title: string;
  genre: 'pubg' | 'shooter' | 'runner' | 'breaker' | 'flappy' | 'rpg' | 'zombie' | 'custom';
  version: string;
  gameHtml: string;
  settings: {
    playerSpeed: number;
    difficulty: 'easy' | 'normal' | 'hard' | 'insane';
    soundEnabled: boolean;
    lives: number;
    gravity: number;
    enemySpeed: number;
    themeColor: string;
  };
  features: string[];
  updatesHistory: AppUpdateRecord[];
  readyForPlayStore: boolean;
  readyForAppStore: boolean;
  isPublished?: boolean;
  publishedUrl?: string;
  unpublishedAt?: string;
  lastUpdated: string;
}

export type AiEngineTier = 'turbo' | 'pro' | 'gaming' | 'ultra' | 'mastermind';

export interface AiEngineSettings {
  tier: AiEngineTier;
  temperature: number;
  codeOptimization: 'high' | 'ultra';
  physicsEngine: 'realistic' | 'arcade';
  botIntelligence: 'smart' | 'expert' | 'tactical';
  soundSynthesis: boolean;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  plan?: PlanType;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  model?: string;
  imageUrl?: string;
  gameLauncher?: {
    prompt: string;
    genre?: string;
    suggestions?: { title: string; prompt: string; icon: string }[];
  };
}

export interface AppUpdateRecord {
  id: string;
  version: string;
  title: string;
  description: string;
  featureCategory: 'auth' | 'commerce' | 'ui' | 'theme' | 'analytics' | 'chat' | 'custom' | 'tool';
  author: string;
  authorType: 'owner' | 'contributor' | 'guest' | 'ai';
  appliedAt: string;
  diffSummary?: string;
  htmlCode: string;
}

export interface WebProject {
  id: string;
  name: string;
  prompt: string;
  htmlCode: string;
  subdomain: string;
  customDomain?: string;
  isPublished: boolean;
  publishedUrl: string;
  cleanAppUrl?: string;
  domainSuffix?: string;
  isWhiteLabel?: boolean;
  isSandbox?: boolean;
  allowPublicUpdates?: boolean;
  updatesHistory?: AppUpdateRecord[];
  currentVersion?: string;
  createdAt: string;
  lastUpdated: string;
}

export interface MobileStoreData {
  appName: string;
  bundleId: string;
  category: string;
  version: string;
  cleanAppUrl?: string;
  playStore: {
    title: string;
    shortDescription: string;
    fullDescription: string;
    category: string;
    contentRating: string;
    targetAndroidSdk: string;
  };
  appStore: {
    name: string;
    subtitle: string;
    primaryCategory: string;
    keywords: string;
    supportUrl: string;
    privacyPolicyUrl: string;
  };
  buildArtifacts: {
    androidApk: string;
    androidAab: string;
    iosIpa: string;
  };
  checklist: Array<{
    task: string;
    status: 'ready' | 'verified' | 'pending';
  }>;
}

export interface VideoScene {
  sceneNumber: number;
  duration: number;
  visualPrompt: string;
  cameraMovement: string;
  voiceover?: string;
  soundFx?: string;
  visualMoodColor: string;
  visualUrl?: string;
}

export interface VideoProject {
  title: string;
  synopsis: string;
  bgMusicVibe: string;
  soundFxTheme?: 'monkey_jungle' | 'supercar' | 'sci_fi' | 'nature_storm' | 'epic_cinema' | 'animals' | 'ocean' | 'custom';
  soundFxDescription?: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  scenes: VideoScene[];
}

export interface PhotoResult {
  id: string;
  prompt: string;
  enhancedPrompt: string;
  style: string;
  aspectRatio: string;
  lighting: string;
  cameraDetails: string;
  composition: string;
  colorPalette: string[];
  imageUrl: string;
  createdAt: string;
}
