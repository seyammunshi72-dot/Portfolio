import React from 'react';
import { SiteSettings } from '../lib/store';
import { Film, Monitor, Upload, Play, CheckCircle2 } from 'lucide-react';

interface AdminHeroSettingsProps {
  localSettings: SiteSettings;
  setLocalSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsFullscreenPreview: (val: boolean) => void;
}

export default function AdminHeroSettings({
  localSettings,
  setLocalSettings,
  handleChange,
  handleVideoUpload,
  setIsFullscreenPreview
}: AdminHeroSettingsProps) {
  const videoUrl = localSettings.heroVideoUrl || '';
  const isGoogleDrive = videoUrl.includes('drive.google.com');
  const isImageOrGif = /\.(gif|webp|png|jpe?g)($|\?)/i.test(videoUrl) || videoUrl.startsWith('data:image/');

  let drivePreviewUrl = '';
  if (isGoogleDrive) {
    const matchId = videoUrl.match(/\/d\/([a-zA-Z0-9-_]+)/) || videoUrl.match(/id=([a-zA-Z0-9-_]+)/);
    if (matchId && matchId[1]) {
      drivePreviewUrl = `https://drive.google.com/file/d/${matchId[1]}/preview`;
    } else {
      drivePreviewUrl = videoUrl.replace(/\/view.*$/, '/preview');
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
            <h2 className="text-2xl font-bold text-brand-primary flex items-center gap-2">
              <Film className="w-6 h-6" /> Hero Video Configuration
            </h2>
            <p className="text-sm text-white/50">
              Set the looping showcase video for the top of your portfolio website.
            </p>

            {/* Video URL Input */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Video / GIF URL or Google Drive Link
              </label>
              <input 
                type="text"
                name="heroVideoUrl"
                value={localSettings.heroVideoUrl || ''}
                onChange={handleChange}
                placeholder="https://drive.google.com/file/d/.../view or direct video link"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none text-sm font-mono"
              />
              <div className="mt-2.5 p-3 bg-white/[0.03] border border-white/5 rounded-lg text-xs text-white/50 space-y-1">
                <p className="font-semibold text-white/70">💡 Google Drive theke video use korar niyam:</p>
                <p>1. Google Drive e video te right-click kore <b>Share &gt; Anyone with the link (Viewer)</b> korun.</p>
                <p>2. Link ta copy kore ekhane paste korun.</p>
              </div>
            </div>

            {/* Direct File Upload */}
            <div className="border-t border-white/10 pt-6">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Or Upload Video / GIF Directly from Device
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-brand-primary/60 rounded-xl p-6 cursor-pointer bg-black/40 transition-colors group">
                <Upload className="w-8 h-8 text-brand-primary mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Click to Select Video / GIF from Computer</span>
                <span className="text-[10px] text-white/40 mt-1">Supports MP4, WebM, MOV, or GIF files (loops seamlessly)</span>
                <input 
                  type="file" 
                  accept="video/mp4,video/webm,video/quicktime,image/gif,image/webp" 
                  onChange={handleVideoUpload}
                  className="hidden" 
                />
              </label>
            </div>

            {/* Framing / Fit Style */}
            <div className="border-t border-white/10 pt-6">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Screen Display Mode
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLocalSettings(prev => ({ ...prev, heroVideoFit: 'cover' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    (localSettings.heroVideoFit || 'cover') === 'cover'
                      ? 'border-brand-primary bg-brand-primary/10 text-white'
                      : 'border-white/10 bg-black/30 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                    {(localSettings.heroVideoFit || 'cover') === 'cover' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />}
                    Full Screen (Cover)
                  </div>
                  <div className="text-[10px] text-white/40">Fills the entire screen edge-to-edge</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalSettings(prev => ({ ...prev, heroVideoFit: 'contain' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    localSettings.heroVideoFit === 'contain'
                      ? 'border-brand-primary bg-brand-primary/10 text-white'
                      : 'border-white/10 bg-black/30 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                    {localSettings.heroVideoFit === 'contain' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />}
                    Framed (Contain)
                  </div>
                  <div className="text-[10px] text-white/40">Preserves original video aspect ratio</div>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Video Live Preview Right Column */}
        <div className="xl:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-brand-primary" /> Live Video Preview
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
              {videoUrl ? (
                isGoogleDrive ? (
                  <iframe 
                    src={`${drivePreviewUrl}?autoplay=1`}
                    className="w-full h-full border-0 rounded-xl"
                    allow="autoplay"
                    title="Hero Video Preview"
                  />
                ) : isImageOrGif ? (
                  <img 
                    src={videoUrl}
                    className={(localSettings.heroVideoFit || 'cover') === 'cover' ? "w-full h-full object-cover rounded-xl" : "max-h-full max-w-full object-contain rounded-xl"}
                    alt="Hero Preview"
                  />
                ) : (
                  <video 
                    src={videoUrl}
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className={(localSettings.heroVideoFit || 'cover') === 'cover' ? "w-full h-full object-cover rounded-xl" : "max-h-full max-w-full object-contain rounded-xl"}
                  />
                )
              ) : (
                <div className="text-center p-8 text-white/40 flex flex-col items-center">
                  <Film className="w-12 h-12 text-white/20 mb-3" />
                  <p className="text-sm font-bold text-white/70">No Video Selected</p>
                  <p className="text-xs mt-1 text-white/40 max-w-xs">
                    Upload a video file or paste a Google Drive / direct link to preview it looping live here.
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs text-white/40 text-center">
              Plays automatically on the home screen in an infinite loop without player controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
