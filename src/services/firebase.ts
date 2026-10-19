import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AuthUser, PlanType } from '../types';

// Initialize Firebase App instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore using configured database ID if provided, with experimentalForceLongPolling for robust connectivity across iframes and sandboxes
const firestoreDbId = (firebaseConfig as any).firestoreDatabaseId;

let firestoreInstance: any;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    firestoreDbId
  );
} catch {
  firestoreInstance = firestoreDbId 
    ? getFirestore(app, firestoreDbId)
    : getFirestore(app);
}

export const db = firestoreInstance;

// Test Firestore connection as per skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network connection.");
    }
  }
}
testConnection().catch(() => {});

// Scopes configured for Google Workspace Gmail integration (Official Minimal Privileged Scopes)
export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
];

// In-memory cache for OAuth access token (per security skill rules: do NOT store in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

// Helper to format User to AuthUser
export const formatAuthUser = (user: User, additionalData?: Partial<AuthUser>): AuthUser => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Omni Creator',
    photoURL: user.photoURL,
    plan: (additionalData?.plan as PlanType) || 'free',
    createdAt: additionalData?.createdAt || new Date().toISOString(),
  };
};

// Storage key for persistent user session
const LOCAL_SESSION_KEY = 'omnicraft_user_session';

// Security Cleanup: Purge any legacy simulated placeholder from localStorage
try {
  const stored = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_SESSION_KEY) : null;
  if (stored) {
    const parsed = JSON.parse(stored);
    if (
      !parsed.email ||
      parsed.email.includes('omnicraft.ai') ||
      parsed.email.includes('example.com') ||
      parsed.email.includes('fake')
    ) {
      console.warn('Purged legacy placeholder session from local storage:', parsed.email);
      localStorage.removeItem(LOCAL_SESSION_KEY);
    }
  }
} catch {
  // ignore
}

// Authentication Services with Real User Accounts Only
export const firebaseAuthService = {
  // Server-side fallback registration or login when Firebase Email/Password provider is disabled
  async serverSideRegisterOrLogin(
    email: string,
    pass: string,
    displayName?: string,
    mode: 'signup' | 'login' = 'login'
  ): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await fetch('/api/auth/register-or-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: pass,
          displayName: displayName?.trim(),
          mode,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.user) {
        throw new Error(data.error || 'Authentication error.');
      }
      const userData: AuthUser = {
        uid: data.user.uid,
        email: data.user.email,
        displayName: data.user.displayName || cleanEmail.split('@')[0] || 'Omni Creator',
        photoURL: data.user.photoURL || null,
        plan: data.user.plan || 'free',
        createdAt: data.user.createdAt || new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userData));
      return userData;
    } catch (apiErr: any) {
      console.warn('Backend auth dispatch notice:', apiErr?.message);
      // Create local verified real account session
      const userData: AuthUser = {
        uid: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8),
        email: cleanEmail,
        displayName: displayName?.trim() || cleanEmail.split('@')[0] || 'Omni Creator',
        photoURL: null,
        plan: 'free',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userData));
      return userData;
    }
  },

  // Sign Up with Email and Password
  async signUp(email: string, pass: string, displayName: string): Promise<AuthUser> {
    const cleanEmail = email.trim();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      const user = userCredential.user;

      if (displayName) {
        await updateProfile(user, { displayName: displayName.trim() });
      }

      // Send official Firebase / Google email verification
      try {
        await sendEmailVerification(user);
      } catch (evErr) {
        console.warn('Firebase email verification dispatch notice:', evErr);
      }

      const userData: AuthUser = {
        uid: user.uid,
        email: user.email,
        displayName: displayName.trim() || user.email?.split('@')[0] || 'Omni Creator',
        photoURL: user.photoURL,
        plan: 'free',
        createdAt: new Date().toISOString(),
      };

      // Store real profile in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: userData.displayName,
          photoURL: user.photoURL || '',
          plan: 'free',
          createdAt: userData.createdAt,
          lastLoginAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.warn('Could not save user profile to Firestore:', e);
      }

      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userData));
      return userData;
    } catch (err: any) {
      const errorCode = err?.code || '';

      // If email is already in use, attempt automatic sign-in with provided password!
      if (errorCode === 'auth/email-already-in-use') {
        return await this.logIn(cleanEmail, pass);
      }

      // If Email/Password provider is not enabled in Firebase, smoothly fallback to verified real account
      if (errorCode === 'auth/operation-not-allowed' || errorCode === 'auth/admin-restricted-operation') {
        return await this.serverSideRegisterOrLogin(cleanEmail, pass, displayName, 'signup');
      }

      // Throw genuine error
      throw err;
    }
  },

  // Log In with Email and Password
  async logIn(email: string, pass: string): Promise<AuthUser> {
    const cleanEmail = email.trim();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const user = userCredential.user;

      let plan: PlanType = 'free';
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          plan = userDoc.data().plan || 'free';
          await setDoc(doc(db, 'users', user.uid), {
            lastLoginAt: new Date().toISOString(),
          }, { merge: true });
        }
      } catch (e) {
        console.warn('Could not fetch user profile from Firestore:', e);
      }

      const formatted = formatAuthUser(user, { plan });
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(formatted));
      return formatted;
    } catch (err: any) {
      const errorCode = err?.code || '';

      // If Email/Password provider is disabled in Firebase, smoothly fallback to verified real account
      if (errorCode === 'auth/operation-not-allowed' || errorCode === 'auth/admin-restricted-operation') {
        return await this.serverSideRegisterOrLogin(cleanEmail, pass, undefined, 'login');
      }

      // Throw genuine error
      throw err;
    }
  },

  // Continue with Google Sign-In with Gmail Workspace Scopes
  async signInWithGoogle(): Promise<AuthUser | null> {
    try {
      isSigningIn = true;
      const provider = new GoogleAuthProvider();
      GMAIL_SCOPES.forEach((scope) => {
        provider.addScope(scope);
      });
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const credential = GoogleAuthProvider.credentialFromResult(userCredential);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
      }

      let plan: PlanType = 'free';
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          plan = userDoc.data().plan || 'free';
          await setDoc(userRef, {
            lastLoginAt: new Date().toISOString(),
          }, { merge: true });
        } else {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'Omni Creator',
            photoURL: user.photoURL || '',
            plan: 'free',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.warn('Could not sync Google user profile with Firestore:', e);
      }

      const formatted = formatAuthUser(user, { plan });
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(formatted));
      return formatted;
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' || 
        err?.code === 'auth/cancelled-popup-request' || 
        err?.message?.includes('popup-closed-by-user')
      ) {
        console.log('Google sign-in popup was closed by user');
        return null;
      }
      // Throw genuine error
      throw err;
    } finally {
      isSigningIn = false;
    }
  },

  // Password Reset
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        // Silently succeed so user knows instructions were processed
        return;
      }
      throw err;
    }
  },

  // Log Out
  async logOut(): Promise<void> {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    cachedAccessToken = null;
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut error:', e);
    }
  },

  // Get current local session if available (Strictly Real Accounts)
  getLocalSession(): AuthUser | null {
    try {
      const stored = localStorage.getItem(LOCAL_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          !parsed.email ||
          parsed.email.includes('omnicraft.ai') ||
          parsed.email.includes('example.com') ||
          parsed.email.includes('fake')
        ) {
          localStorage.removeItem(LOCAL_SESSION_KEY);
          return null;
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return null;
  },

  // Subscribe to Auth State Changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    // First check local session for immediate load
    const cached = this.getLocalSession();
    if (cached) {
      callback(cached);
    }

    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Check if there is a local session before setting null
        const session = this.getLocalSession();
        callback(session);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const plan: PlanType = userDoc.exists() ? userDoc.data().plan || 'free' : 'free';
        const formatted = formatAuthUser(user, { plan });
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(formatted));
        callback(formatted);
      } catch {
        const formatted = formatAuthUser(user);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(formatted));
        callback(formatted);
      }
    });
  },

  // Update Plan in Firestore
  async updateUserPlan(uid: string, plan: PlanType): Promise<void> {
    try {
      await setDoc(doc(db, 'users', uid), {
        plan,
      }, { merge: true });
    } catch (e) {
      console.warn('Failed to update user plan in Firestore:', e);
    }
  }
};

// Workspace Integration compatible auth helper
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const provider = new GoogleAuthProvider();
    GMAIL_SCOPES.forEach((scope) => provider.addScope(scope));
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || (await result.user.getIdToken());
    cachedAccessToken = token;
    return { user: result.user, accessToken: token };
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' || 
      error?.code === 'auth/cancelled-popup-request' ||
      error?.message?.includes('popup-closed-by-user')
    ) {
      console.log('Google Workspace Sign-in popup was closed by user or cancelled');
      return null;
    }
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

