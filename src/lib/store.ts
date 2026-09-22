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
  // -- Projects --
  projects: any[];
  // -- About --
  aboutSubtitle: string;
  aboutHeading1: string;
  aboutHeading2: string;
  aboutHeading3: string;
  aboutText: string;
  aboutPhotoUrl: string;
  aboutPhotoSize: number;
  aboutCvUrl: string;
  aboutStat1Num: string;
  aboutStat1Text: string;
  aboutStat2Num: string;
  aboutStat2Text: string;
  aboutStat3Num: string;
  aboutStat3Text: string;
  aboutStat4Num: string;
  aboutStat4Text: string;
  // -- Footer & Social Links --
  footerTitle: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  behanceUrl?: string;
  footerLink1Text: string;
  footerLink1Url: string;
  footerLink2Text: string;
  footerLink2Url: string;
  footerLink3Text: string;
  footerLink3Url: string;
  footerLink4Text: string;
  footerLink4Url: string;
  reviews: any[];
  pricingPlans: any[];
  // -- Contact & Messaging --
  whatsappNumber?: string;
  contactEmail?: string;
  // -- Hero Video / GIF Mode --
  heroType?: 'video' | '3d';
  heroMediaType?: 'gif' | 'video';
  heroVideoUrl?: string;
  heroGifUrl?: string;
  heroPosterImage?: string;
  heroVideoFit?: 'cover' | 'contain' | 'fill-width' | 'framed' | 'fill-viewport';
  heroOverlayOpacity?: number;
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
  heroType: 'video',
  heroMediaType: 'gif',
  heroVideoUrl: '/hero-animation.gif',
  heroGifUrl: '/hero-animation.gif',
  heroPosterImage: '',
  heroVideoFit: 'cover',
  heroOverlayOpacity: 10,
  
  projects: [],
  
  reviews: [],
  
  pricingPlans: [
    {
      name: "Starter",
      description: "Perfect for short-form content and single platform creators.",
      price: "$199",
      features: [
        "Up to 3 short-form videos",
        "Basic color grading",
        "Standard sound design",
        "1 revision round",
        "48h turnaround"
      ],
      popular: false
    },
    {
      name: "Pro",
      description: "Ideal for YouTube creators and professional vloggers.",
      price: "$499",
      features: [
        "Up to 2 long-form videos (15m)",
        "Advanced color grading",
        "Premium sound design & mixing",
        "Motion graphics & text",
        "3 revision rounds",
        "Source files included"
      ],
      popular: true
    },
    {
      name: "Cinematic",
      description: "For documentaries, films, and high-end commercials.",
      price: "Custom",
      features: [
        "Feature-length/Complex narrative",
        "Cinema-grade color correction",
        "Full audio mastering",
        "Advanced visual effects",
        "Unlimited revisions",
        "Dedicated strategy call"
      ],
      popular: false
    }
  ],

  aboutSubtitle: 'About Me',
  aboutHeading1: 'STORYTELLER.',
  aboutHeading2: 'VISUAL ARTIST.',
  aboutHeading3: 'PROBLEM SOLVER.',
  aboutText: "Hey, what's up? My name is Seyam and I've been working as a video editor for almost two years. My focus is always to deliver engaging videos with rhythm, narrative and retention.",
  aboutPhotoUrl: '',
  aboutPhotoSize: 100,
  aboutCvUrl: '#',
  aboutStat1Num: '2+',
  aboutStat1Text: 'Years Experience',
  aboutStat2Num: '100+',
  aboutStat2Text: 'Projects Completed',
  aboutStat3Num: '18+',
  aboutStat3Text: 'Happy Clients',
  aboutStat4Num: '5+',
  aboutStat4Text: 'Countries Worked',

  footerTitle: 'SEYAM MUNSHI',
  instagramUrl: '',
  facebookUrl: '',
  youtubeUrl: '',
  behanceUrl: '',
  footerLink1Text: '',
  footerLink1Url: '',
  footerLink2Text: '',
  footerLink2Url: '',
  footerLink3Text: 'EMAIL',
  footerLink3Url: 'mailto:seyammunshi72@gmail.com',
  footerLink4Text: '',
  footerLink4Url: '',
  whatsappNumber: '+8801786546949',
  contactEmail: 'seyammunshi72@gmail.com',
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
      const dbData = docSnap.data() as Partial<SiteSettings>;
      // If heroVideoFit was saved as legacy 'contain' previously in Firestore, default to 'cover' so it fills the screen on desktop
      const heroVideoFit = (dbData.heroVideoFit === 'contain' ? 'cover' : dbData.heroVideoFit) || 'cover';
      set({ settings: { ...defaultSettings, ...dbData, heroVideoFit } });
    } else {
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
