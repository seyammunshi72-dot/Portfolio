import React, { useState, useRef, useEffect } from 'react';
import { SiteSettings, useStore } from '../lib/store';
import { ArrowDown, Upload, Film, Sparkles, Image as ImageIcon } from 'lucide-react';
import { saveVideoBlob, loadVideoBlob, clearVideoBlob } from '../lib/videoStorage';
import { extractImgbbUrl, isImgbbUrl, isDirectGifOrImage } from '../lib/imgbbUtils';

interface VideoHeroProps {
  settings: SiteSettings;
  onExitPreview?: () => void;
}

export default function VideoHero({ settings, onExitPreview }: VideoHeroProps) {
  const { updateSettings, applyPreview } = useStore();
  const [localBlobUrl, setLocalBlobUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Load persistent video/gif from IndexedDB or default fallback on mount
  useEffect(() => {
    let active = true;
    async function initVideo() {
      try {
        const blob = await loadVideoBlob();
        if (blob && active) {
          const objectUrl = URL.createObjectURL(blob);
          setLocalBlobUrl(objectUrl);
        }
      } catch (err) {
        console.warn('Error loading media from storage:', err);
      }
    }
    initVideo();
    return () => {
      active = false;
    };
  }, []);

  const rawUrl = localBlobUrl || settings.heroGifUrl?.trim() || settings.heroVideoUrl?.trim() || '/hero-animation.gif';

  const [imgSrc, setImgSrc] = useState<string>(rawUrl);

  useEffect(() => {
    setImgSrc(rawUrl);
  }, [rawUrl]);

  // 2. Handle Google Drive Embeds
  const isGoogleDrive = rawUrl.includes('drive.google.com');
  const isImageOrGif = 
    settings.heroMediaType === 'gif' ||
    isImgbbUrl(rawUrl) ||
    isDirectGifOrImage(rawUrl) ||
    /\.(gif|webp|png|jpe?g)($|\?)/i.test(rawUrl) || 
    rawUrl.startsWith('data:image/');
  
  let driveEmbedUrl = '';
  if (isGoogleDrive) {
    const matchId = rawUrl.match(/\/d\/([a-zA-Z0-9-_]+)/) || rawUrl.match(/id=([a-zA-Z0-9-_]+)/);
    if (matchId && matchId[1]) {
      driveEmbedUrl = `https://drive.google.com/file/d/${matchId[1]}/preview`;
    } else {
      driveEmbedUrl = rawUrl.replace(/\/view.*$/, '/preview');
    }
  }

  // 3. Autoplay policy enforcement: ensure video plays automatically as a loop if it's a video file
  useEffect(() => {
    if (videoRef.current && rawUrl && !isGoogleDrive && !isImageOrGif) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(e => console.log('Autoplay fallback:', e));
        }
      });
    }
  }, [rawUrl, isGoogleDrive, isImageOrGif]);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    try {
      // Save permanently to IndexedDB
      await saveVideoBlob(file);
      const objectUrl = URL.createObjectURL(file);
      setLocalBlobUrl(objectUrl);

      // If smaller file, also update store
      if (file.size < 600 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          applyPreview({ heroVideoUrl: dataUrl, heroGifUrl: dataUrl });
          updateSettings({ heroVideoUrl: dataUrl, heroGifUrl: dataUrl }).catch(() => {});
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Failed to save file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const clean = extractImgbbUrl(urlInput);
    setLocalBlobUrl(null);
    clearVideoBlob();
    const isGif = isImgbbUrl(clean) || isDirectGifOrImage(clean);
    applyPreview({ 
      heroVideoUrl: clean, 
      heroGifUrl: clean, 
      heroMediaType: isGif ? 'gif' : 'video' 
    });
    updateSettings({ 
      heroVideoUrl: clean, 
      heroGifUrl: clean, 
      heroMediaType: isGif ? 'gif' : 'video' 
    }).catch(() => {});
    setUrlInput('');
  };

  // Media Display Fit Mode
  // 'cover' / 'fill-width' (default) -> 100% full width edge-to-edge with natural aspect ratio (NO cropping of head or text)
  // 'framed' | 'contain' -> centered inside black frame
  // 'fill-viewport' -> cropped to strictly fill viewport height with object-top
  const fitMode = settings.heroVideoFit || 'cover';
  const isContain = fitMode === 'contain' || fitMode === 'framed';
  const isFillViewport = fitMode === 'fill-viewport';

  const sectionHeightClass = isContain
    ? "h-[calc(100svh-3.5rem)] sm:h-[calc(100svh-4rem)]"
    : isFillViewport
    ? "min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100svh-4rem)] h-[calc(100svh-3.5rem)] sm:h-[calc(100svh-4rem)]"
    : "h-auto w-full";

  const mediaFitClass = isContain
    ? "max-h-[calc(100svh-3.5rem)] sm:max-h-[calc(100svh-4rem)] w-auto max-w-full block select-none mx-auto object-contain"
    : isFillViewport
    ? "w-full h-full min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100svh-4rem)] object-cover object-top block select-none"
    : "w-full h-auto block select-none mx-auto object-cover";

  return (
    <section 
      id="home"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative w-full bg-[#050505] overflow-hidden font-sans select-none flex items-center justify-center ${
        rawUrl 
          ? sectionHeightClass 
          : 'h-[100svh] min-h-[600px] flex flex-col justify-center items-center'
      }`}
    >
      {/* Admin Quick Exit Button */}
      {onExitPreview && (
        <button 
          onClick={onExitPreview}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 bg-black/80 backdrop-blur border border-brand-primary/30 text-brand-primary rounded-full hover:bg-brand-primary/10 transition-colors font-bold text-[10px] sm:text-xs shadow-[0_0_20px_rgba(51,255,51,0.2)]"
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-primary animate-pulse" />
          Back to Admin Editor
        </button>
      )}

      {/* Main Home Screen Display - 100% Edge-to-Edge Full Width */}
      {rawUrl ? (
        <div className={`relative w-full ${isFillViewport || isContain ? 'h-full' : 'h-auto'} flex items-center justify-center overflow-hidden`}>
          {isGoogleDrive ? (
            <div className="w-full aspect-video bg-black flex items-center justify-center">
              <iframe 
                src={`${driveEmbedUrl}?autoplay=1`} 
                className="w-full h-full border-0 pointer-events-auto" 
                allow="autoplay; encrypted-media; fullscreen"
                title="Seyam Munshi Home Reel"
              />
            </div>
          ) : isImageOrGif ? (
            <img 
              src={imgSrc} 
              alt="Seyam Munshi Animation" 
              className={mediaFitClass}
              loading="eager"
              referrerPolicy="no-referrer"
              onError={() => {
                if (imgSrc !== '/hero-animation.gif') {
                  console.warn('Hero GIF failed to load from remote host, falling back to local /hero-animation.gif');
                  setImgSrc('/hero-animation.gif');
                }
              }}
            />
          ) : (
            <div className={`relative w-full ${isFillViewport || isContain ? 'h-full' : 'h-auto'} flex items-center justify-center`}>
              <video 
                ref={videoRef}
                src={rawUrl}
                autoPlay
                loop
                muted
                playsInline
                className={mediaFitClass}
              />
            </div>
          )}
        </div>
      ) : (
        /* Initial Setup Stage: When no GIF/video has been configured yet */
        <div className="relative z-20 flex flex-col items-center justify-center max-w-xl w-full px-6 text-center">
          <div className={`w-full p-8 md:p-12 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center bg-white/[0.02] backdrop-blur-xl ${
            isDragging ? 'border-brand-primary bg-brand-primary/5 scale-102' : 'border-white/15 hover:border-white/30'
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-brand-primary shadow-[0_0_30px_rgba(255,85,51,0.2)]">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Set Your Home Screen (ImgBB GIF or Media)
            </h2>
            <p className="text-sm text-white/50 mb-8 max-w-sm">
              Add your animated ImgBB GIF or video reel. It will display full-width at the top of your portfolio, looping smoothly.
            </p>

            <label className="flex items-center gap-3 px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-black font-black text-sm rounded-full cursor-pointer transition-all shadow-[0_0_30px_rgba(255,85,51,0.4)] hover:scale-105 active:scale-95">
              <Upload className="w-4 h-4" />
              <span>Select File (GIF, MP4, WebM)</span>
              <input 
                type="file" 
                accept="image/gif,image/webp,video/mp4,video/webm,video/quicktime"
                onChange={handleFileInput}
                className="hidden" 
              />
            </label>

            <div className="mt-6 flex items-center gap-4 text-xs text-white/30 w-full justify-center">
              <div className="h-[1px] bg-white/10 flex-1" />
              <span>OR PASTE IMGBB GIF LINK</span>
              <div className="h-[1px] bg-white/10 flex-1" />
            </div>

            <form onSubmit={handleUrlSubmit} className="mt-4 w-full flex gap-2">
              <input 
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://i.ibb.co/.../animation.gif or Google Drive link"
                className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-brand-primary font-mono"
              />
              <button 
                type="submit"
                className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-black font-bold text-xs rounded-xl transition-colors"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Scroll Down Indicator (desktop only, hidden on mobile) */}
      <a 
        href="#work"
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex-col items-center gap-1.5 mix-blend-difference text-white hover:opacity-80 transition-opacity group"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase font-mono group-hover:tracking-[0.4em] transition-all font-bold">
          SCROLL
        </span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </a>
    </section>
  );
}
