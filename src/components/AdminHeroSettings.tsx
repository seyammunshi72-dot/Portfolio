import React, { useState } from 'react';
import { SiteSettings } from '../lib/store';
import { Monitor, Play, CheckCircle2, Image as ImageIcon, ExternalLink, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { extractImgbbUrl, isImgbbUrl, resolveViewerPageToDirectUrl } from '../lib/imgbbUtils';

interface AdminHeroSettingsProps {
  localSettings: SiteSettings;
  setLocalSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleVideoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsFullscreenPreview: (val: boolean) => void;
}

export default function AdminHeroSettings({
  localSettings,
  setLocalSettings,
  setIsFullscreenPreview
}: AdminHeroSettingsProps) {
  const currentUrl = localSettings.heroGifUrl || localSettings.heroVideoUrl || '/hero-animation.gif';
  const [isResolving, setIsResolving] = useState(false);
  const [resolveMessage, setResolveMessage] = useState<string | null>(null);

  // Handle smart input for ImgBB / GIF link
  const handleGifUrlChange = async (val: string) => {
    const cleanUrl = extractImgbbUrl(val);
    setLocalSettings(prev => ({
      ...prev,
      heroMediaType: 'gif',
      heroGifUrl: cleanUrl,
      heroVideoUrl: cleanUrl
    }));

    // If it's a viewer page (ibb.co/xyz without i.ibb.co), try resolving in background
    if (cleanUrl.includes('ibb.co') && !cleanUrl.includes('i.ibb.co')) {
      setIsResolving(true);
      setResolveMessage('Checking ImgBB link...');
      const direct = await resolveViewerPageToDirectUrl(cleanUrl);
      setIsResolving(false);
      if (direct) {
        setResolveMessage('Direct GIF link resolved!');
        setLocalSettings(prev => ({
          ...prev,
          heroMediaType: 'gif',
          heroGifUrl: direct,
          heroVideoUrl: direct
        }));
      } else {
        setResolveMessage('Tip: Use ImgBB "Direct links" option (starts with https://i.ibb.co/...)');
      }
    } else {
      setResolveMessage(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-brand-primary" /> Home Screen Hero (ImgBB GIF)
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Add your looping animation GIF from ImgBB for the top of your portfolio home screen.
                </p>
              </div>
            </div>

            {/* ImgBB Animated GIF Input Section */}
            <div className="space-y-4 bg-black/40 border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  ImgBB Animated GIF URL or Embed Code
                </label>
                <a
                  href="https://imgbb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-primary hover:underline"
                >
                  Open ImgBB.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={currentUrl}
                  onChange={(e) => handleGifUrlChange(e.target.value)}
                  placeholder="https://i.ibb.co/..../animation.gif or /hero-animation.gif"
                  className="w-full bg-black/70 border border-white/15 rounded-lg p-3 text-white focus:border-brand-primary outline-none text-sm font-mono pr-10"
                />
                {isResolving && (
                  <RefreshCw className="w-4 h-4 text-brand-primary animate-spin absolute right-3 top-3.5" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLocalSettings(prev => ({
                      ...prev,
                      heroMediaType: 'gif',
                      heroGifUrl: '/hero-animation.gif',
                      heroVideoUrl: '/hero-animation.gif'
                    }));
                  }}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white font-medium py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                  Use Fast Local GIF (/hero-animation.gif)
                </button>
              </div>

              {resolveMessage && (
                <p className="text-xs text-brand-primary font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {resolveMessage}
                </p>
              )}

              {/* Guarantee Banner */}
              <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-xs text-white/80 space-y-1">
                <p className="font-bold text-brand-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                  Pure Animated GIF Mode (No Video Player)
                </p>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  This media renders as a native animated GIF image. It loops continuously with zero video controls, no pause delays, and full browser compatibility.
                </p>
              </div>

              {/* Step by Step Guide in Bengali & English */}
              <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-lg text-xs text-white/60 space-y-2">
                <p className="font-bold text-white/90">💡 ImgBB থেকে GIF যুক্ত করার সহজ নিয়ম:</p>
                <ol className="list-decimal list-inside space-y-1 text-white/70 text-[11px]">
                  <li><a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline">imgbb.com</a> এ গিয়ে আপনার GIF টি Upload করুন।</li>
                  <li>আপলোড সম্পন্ন হলে <b>Embed codes</b> ড্রপডাউনে <b>Direct links</b> সিলেক্ট করুন।</li>
                  <li>সেখান থেকে লিঙ্কটি (যেমন: <code className="text-white bg-white/10 px-1 py-0.5 rounded">https://i.ibb.co/.../name.gif</code>) কপি করে উপরের ঘরে পেস্ট করুন।</li>
                  <li>HTML বা ভিউয়ার পেজ পেস্ট করলেও আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে সরাসরি GIF লিঙ্কটি এক্সট্রাক্ট করে নেবে!</li>
                </ol>
              </div>
            </div>

            {/* Framing / Fit Style */}
            <div className="border-t border-white/10 pt-6">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Screen Display Mode (Computer & Mobile)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setLocalSettings(prev => ({ ...prev, heroVideoFit: 'cover' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    (localSettings.heroVideoFit || 'cover') === 'cover' || localSettings.heroVideoFit === 'fill-width'
                      ? 'border-brand-primary bg-brand-primary/10 text-white'
                      : 'border-white/10 bg-black/30 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                    {((localSettings.heroVideoFit || 'cover') === 'cover' || localSettings.heroVideoFit === 'fill-width') && <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />}
                    Full Width (100% - No Crop)
                  </div>
                  <div className="text-[10px] text-white/40">100% full width, shows complete hair, text & scroll arrow (Recommended)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalSettings(prev => ({ ...prev, heroVideoFit: 'fill-viewport' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    localSettings.heroVideoFit === 'fill-viewport'
                      ? 'border-brand-primary bg-brand-primary/10 text-white'
                      : 'border-white/10 bg-black/30 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                    {localSettings.heroVideoFit === 'fill-viewport' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />}
                    Fit Viewport Height
                  </div>
                  <div className="text-[10px] text-white/40">Fills exact viewport height, keeps head at top</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalSettings(prev => ({ ...prev, heroVideoFit: 'framed' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    localSettings.heroVideoFit === 'framed' || localSettings.heroVideoFit === 'contain'
                      ? 'border-brand-primary bg-brand-primary/10 text-white'
                      : 'border-white/10 bg-black/30 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                    {(localSettings.heroVideoFit === 'framed' || localSettings.heroVideoFit === 'contain') && <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />}
                    Framed (Contain)
                  </div>
                  <div className="text-[10px] text-white/40">Preserves original 16:9 ratio with borders</div>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Video / GIF Live Preview Right Column */}
        <div className="xl:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-brand-primary" /> Live GIF Preview
              </h2>
              <button 
                type="button"
                onClick={() => setIsFullscreenPreview(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary rounded-lg text-sm font-medium transition-colors"
              >
                <Monitor className="w-4 h-4" /> Full Preview
              </button>
            </div>

            <div className="w-full bg-[#050505] border border-white/10 rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)] aspect-video flex items-center justify-center p-2">
              {currentUrl ? (
                <img 
                  src={currentUrl || '/hero-animation.gif'}
                  className={
                    localSettings.heroVideoFit === 'framed' || localSettings.heroVideoFit === 'contain'
                      ? "max-h-full max-w-full object-contain rounded-xl"
                      : "w-full h-full object-cover rounded-xl"
                  }
                  alt="Hero GIF Preview"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (!img.src.includes('/hero-animation.gif')) {
                      img.src = '/hero-animation.gif';
                    }
                  }}
                />
              ) : (
                <div className="text-center p-8 text-white/40 flex flex-col items-center">
                  <ImageIcon className="w-12 h-12 text-white/20 mb-3" />
                  <p className="text-sm font-bold text-white/70">No GIF Selected</p>
                  <p className="text-xs mt-1 text-white/40 max-w-xs">
                    Paste an ImgBB GIF link to preview it looping live here.
                  </p>
                </div>
              )}
            </div>

            <div className="text-xs text-white/50 text-center flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary inline-block" />
              Displaying as an Animated GIF (zero video player artifacts, automatic infinite loop)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
