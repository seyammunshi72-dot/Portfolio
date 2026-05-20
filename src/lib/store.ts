import { create } from 'zustand';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface SiteSettings {
  screenText: string;
  enableTypingAnimation?: boolean;
  screenTextSize: number;
  screenTextColor: string;
  screenBgColor: string;
  screenGlowStrength: number;
  screenFontFamily: string;
  screenPaddingPx: number;
  portalPosX: number;
  portalPosY: number;
  portalPosZ: number;
  portalScale: number;
  portalWidth: number;
  portalHeight: number;
  portalBorderRadius?: number;
  screenPhotoUrl: string;
  screenImageContrast: number;
  screenImageBrightness: number;
  screenImageSepia: number;
  screenImageHue: number;
  screenImageBlur: number;
  cameraPositionX: number;
  cameraPositionY: number;
  cameraPositionZ: number;
  heroText: string;
  aboutText: string;
}

const defaultSettings: SiteSettings = {
  screenText: '<p>HI I AM</p><p><span style="font-size: 80px">SEYAM</span></p><p>A PROFESSIONAL VIDEO EDITOR</p><p>============================</p><p><br></p><p>INITIALIZING WORKSPACE...</p><p>LOADING VIDEO FILES...</p><p>RENDER ENGINE READY...</p>',
  enableTypingAnimation: false,
  screenTextSize: 48,
  screenTextColor: '#33FF33',
  screenBgColor: '#030A03',
  screenGlowStrength: 15,
  screenFontFamily: 'monospace',
  screenPaddingPx: 32,
  portalPosX: -0.002,
  portalPosY: 0.048,
  portalPosZ: 0.485,
  portalScale: 0.00085,
  portalWidth: 800,
  portalHeight: 600,
  portalBorderRadius: 80,
  screenPhotoUrl: '',
  screenImageContrast: 1.0,
  screenImageBrightness: 1.0,
  screenImageSepia: 0,
  screenImageHue: 0,
  screenImageBlur: 0,
  cameraPositionX: -0.2,
  cameraPositionY: 0.52,
  cameraPositionZ: -4,
  heroText: 'Frontend Developer & 3D Web Enthusiast',
  aboutText: "I'm a passionate video editor with 5+ years of experience crafting compelling visual stories for brands, creators and agencies. My focus is on rhythm, pacing, and emotional resonance.",
};

interface AppState {
  user: User | null;
  authInitialized: boolean;
  settings: SiteSettings;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  applyPreview: (newSettings: Partial<SiteSettings>) => void;
}

export const useStore = create<AppState>((set, get) => {
  // Listen for auth changes
  onAuthStateChanged(auth, (user) => {
    set({ user, authInitialized: true });
  });

  // Listen for settings changes
  const settingsDoc = doc(db, 'settings', 'site');
  onSnapshot(settingsDoc, (docSnap) => {
    if (docSnap.exists()) {
      set({ settings: { ...defaultSettings, ...(docSnap.data() as Partial<SiteSettings>) } });
    } else {
      // Initialize if it doesn't exist (only if logged in as admin maybe? we just leave default in state for now)
      set({ settings: defaultSettings });
    }
  });

  return {
    user: null,
    authInitialized: false,
    settings: defaultSettings,
    login: async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (err) {
        console.error('Login error', err);
      }
    },
    logout: async () => {
      await signOut(auth);
    },
    updateSettings: async (newSettings) => {
      const current = get().settings;
      const updated = { ...current, ...newSettings };
      
      // Clean undefined values for Firestore
      Object.keys(updated).forEach(key => {
        if (updated[key as keyof SiteSettings] === undefined) {
          delete updated[key as keyof SiteSettings];
        }
      });
      
      try {
        await setDoc(settingsDoc, updated);
        set({ settings: updated });
      } catch (e) {
        console.error("Firestore save error:", e);
        throw e;
      }
    },
    applyPreview: (newSettings) => {
      const current = get().settings;
      const updated = { ...current, ...newSettings };
      set({ settings: updated });
    }
  };
});
