import { useState, useEffect, Suspense } from 'react';
import { useStore, SiteSettings } from '../lib/store';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, LogOut, Monitor, LayoutDashboard, User } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import MonitorScreen from './MonitorScreen';
import Hero from './Hero';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import DeskScene from './DeskScene';
import * as THREE from 'three';

const Size = ReactQuill.Quill.import('attributors/style/size');
Size.whitelist = ['10px', '14px', '16px', '18px', '24px', '32px', '48px', '64px', '80px', '100px'];
ReactQuill.Quill.register(Size, true);

export default function AdminDashboard() {
  const { user, settings, updateSettings, logout, applyPreview } = useStore();
  const navigate = useNavigate();
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'3d' | 'home' | 'about' | 'footer'>('3d');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  // Sync settings when they are loaded from Firestore
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // If not logged in, wait for auth to initialize or redirect
  // But for simple access control, let's just show a message.
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-white/50 mb-8">You must be logged in as an admin to view this page.</p>
        <Link to="/" className="text-brand-primary hover:underline">Go back home</Link>
      </div>
    );
  }

  if (isFullscreenPreview) {
    return <Hero overrideSettings={localSettings} onExitPreview={() => setIsFullscreenPreview(false)} />;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(localSettings);
      alert('Settings saved successfully!');
    } catch (err: any) {
      alert(`Error saving settings: ${err?.message || 'Unknown error'}`);
      console.error('Save error details:', err, JSON.stringify(localSettings));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }
    setLocalSettings(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-brand-primary/30 flex flex-col">
      <div className="w-full mx-auto max-w-7xl flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 lg:block lg:pb-8 lg:mb-12">
            <Link to="/" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to site</span>
            </Link>
            <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
          </div>

          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
            <button 
              onClick={() => setActiveTab('3d')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === '3d' ? 'bg-brand-primary text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              <Monitor className="w-4 h-4" /> Home Page (3D)
            </button>
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'home' ? 'bg-brand-primary text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Projects
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'about' ? 'bg-brand-primary text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              <User className="w-4 h-4" /> About Page
            </button>
            <button 
              onClick={() => setActiveTab('footer')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'footer' ? 'bg-brand-primary text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Footer Menu
            </button>
          </nav>
        </div>

        {/* Editing Area */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-sm text-white/50">Changes are saved globally and affect all visitors.</p>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full transition-colors font-medium text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          {activeTab === '3d' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 xl:col-span-1">
                <section className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 text-brand-primary">3D Computer Screen</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Screen Text (WYSIWYG Editor)</label>

                    <div className="bg-white/90 rounded-lg overflow-hidden text-black quill-editor-wrapper">
                      <ReactQuill 
                        value={localSettings.screenText}
                        onChange={(content) => setLocalSettings(prev => ({ ...prev, screenText: content }))}
                        theme="snow"
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'size': ['10px', '14px', '16px', '18px', false, '24px', '32px', '48px', '64px', '80px', '100px'] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['link', 'clean']
                          ]
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-[#111] p-4 rounded-lg border border-white/10">
                    <input 
                      type="checkbox"
                      id="enableTypingAnimation"
                      checked={localSettings.enableTypingAnimation ?? true}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, enableTypingAnimation: e.target.checked }))}
                      className="w-5 h-5 accent-brand-primary cursor-pointer"
                    />
                    <label htmlFor="enableTypingAnimation" className="text-sm font-medium text-white/80 cursor-pointer leading-tight">
                      Enable Typing Animation<br/>
                      <span className="text-white/40 text-xs">Animates the text appearing progressively on the screen. (Fully supports custom sizes and colors now)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Text Size (px)</label>
                      <input 
                        type="number"
                        name="screenTextSize"
                        value={localSettings.screenTextSize}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none transition-colors"
                        placeholder="48"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Text Color</label>
                      <input 
                        type="color"
                        name="screenTextColor"
                        value={localSettings.screenTextColor || '#33FF33'}
                        onChange={handleChange}
                        className="w-full h-[50px] bg-black/50 border border-white/10 rounded-lg p-1 text-white focus:border-brand-primary outline-none transition-colors cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Background Color</label>
                      <input 
                        type="color"
                        name="screenBgColor"
                        value={localSettings.screenBgColor || '#030A03'}
                        onChange={handleChange}
                        className="w-full h-[50px] bg-black/50 border border-white/10 rounded-lg p-1 text-white focus:border-brand-primary outline-none transition-colors cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Glow Strength (1-50)</label>
                      <input 
                        type="number"
                        name="screenGlowStrength"
                        value={localSettings.screenGlowStrength}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none transition-colors"
                        placeholder="15"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-white mb-4">HTML Portal Alignment (Advanced)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Padding Inner (px)</label>
                        <input type="number" name="screenPaddingPx" value={localSettings.screenPaddingPx ?? 40} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Border Radius (px)</label>
                        <input type="number" name="portalBorderRadius" value={localSettings.portalBorderRadius ?? 80} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">HTML Width (px)</label>
                        <input type="number" name="portalWidth" value={localSettings.portalWidth ?? 800} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">HTML Height (px)</label>
                        <input type="number" name="portalHeight" value={localSettings.portalHeight ?? 600} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Portal Scale</label>
                        <input type="number" step="0.0001" name="portalScale" value={localSettings.portalScale ?? 0.00085} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Pos X (Local)</label>
                        <input type="number" step="0.001" name="portalPosX" value={localSettings.portalPosX ?? -0.002} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Pos Y (Local)</label>
                        <input type="number" step="0.001" name="portalPosY" value={localSettings.portalPosY ?? 0.048} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Pos Z (Local)</label>
                        <input type="number" step="0.001" name="portalPosZ" value={localSettings.portalPosZ ?? 0.485} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-6">
                    <label className="block text-sm font-medium text-white/50 mb-2">Image URL (Overrides text if provided)</label>
                    <input 
                      type="text"
                      name="screenPhotoUrl"
                      value={localSettings.screenPhotoUrl}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  {localSettings.screenPhotoUrl && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Contrast</label>
                        <input type="number" step="0.1" name="screenImageContrast" value={localSettings.screenImageContrast ?? 1.2} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Brightness</label>
                        <input type="number" step="0.1" name="screenImageBrightness" value={localSettings.screenImageBrightness ?? 1.1} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Sepia</label>
                        <input type="number" step="0.1" name="screenImageSepia" value={localSettings.screenImageSepia ?? 0.5} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Hue (deg)</label>
                        <input type="number" step="1" name="screenImageHue" value={localSettings.screenImageHue ?? 80} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Blur (px)</label>
                        <input type="number" step="0.1" name="screenImageBlur" value={localSettings.screenImageBlur ?? 0.5} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-bold mb-6 text-brand-primary">Model Position / Offset</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Position X</label>
                    <input 
                      type="number"
                      step="0.1"
                      name="cameraPositionX"
                      value={localSettings.cameraPositionX}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Position Y</label>
                    <input 
                      type="number"
                      step="0.1"
                      name="cameraPositionY"
                      value={localSettings.cameraPositionY}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Position Z</label>
                    <input 
                      type="number"
                      step="0.1"
                      name="cameraPositionZ"
                      value={localSettings.cameraPositionZ}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Live Preview Pane */}
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Live 3D Preview</h2>
                  <button 
                    onClick={() => setIsFullscreenPreview(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary rounded-lg text-sm font-medium transition-colors"
                  >
                    <Monitor className="w-4 h-4" /> Full 3D Preview
                  </button>
                </div>
                <div className="w-full bg-[#050505] border border-white/10 rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] mx-auto aspect-video cursor-grab active:cursor-grabbing">
                  <Canvas camera={{ position: [0, 1, 10], fov: 45 }} dpr={[1, 2]}>
                    <color attach="background" args={['#050505']} />
                    <ambientLight intensity={0.2} />
                    <OrbitControls 
                      enableZoom={true}
                      enablePan={false}
                      minPolarAngle={Math.PI / 4}
                      maxPolarAngle={Math.PI / 1.5}
                      target={[0, 0, 0]}
                    />
                    <ErrorBoundary fallbackRender={({error}) => <Html center position={[0, 0, 0]}><div style={{color: 'white', background: 'rgba(255, 0, 0, 0.8)', padding: '10px', borderRadius: '4px', whiteSpace: 'nowrap'}}>Model Error: {error?.message || "Unknown error"}</div></Html>}>
                      <Suspense fallback={null}>
                        <DeskScene overrideSettings={localSettings} />
                      </Suspense>
                    </ErrorBoundary>
                  </Canvas>
                </div>
                <p className="mt-4 text-white/40 text-sm text-center">Interactive 3D preview. Drag to rotate, scroll to zoom.</p>
              </div>
            </div>
            </div>
          )}

          {activeTab === 'home' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-bold mb-6 text-brand-primary">Projects Page Content</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Projects / Hero Section Subtitle</label>
                    <input 
                      type="text"
                      name="heroText"
                      value={localSettings.heroText}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                    />
                    <p className="mt-2 text-xs text-white/40">This is the text that floats centrally in the 3D scene background on the main page.</p>
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-white">Project List</h3>
                      <button 
                        onClick={() => {
                          const newProjects = [...(localSettings.projects || [])];
                          newProjects.push({ id: Date.now().toString(), category: 'NEW', title: 'New Project', duration: '00:00', image: '' });
                          setLocalSettings(prev => ({ ...prev, projects: newProjects }));
                        }}
                        className="bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary px-3 py-1.5 rounded text-sm transition-colors"
                      >
                        + Add Project
                      </button>
                    </div>

                    <div className="space-y-4">
                      {localSettings.projects?.map((proj, index) => (
                        <div key={proj.id || index} className="bg-black/50 p-4 rounded-xl border border-white/5 relative group">
                          <button 
                            onClick={() => {
                              const newProjects = [...(localSettings.projects || [])];
                              newProjects.splice(index, 1);
                              setLocalSettings(prev => ({ ...prev, projects: newProjects }));
                            }}
                            className="absolute top-4 right-4 text-red-500 opacity-50 hover:opacity-100"
                          >
                            Remove
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <label className="block text-xs font-medium text-white/30 mb-1">Title</label>
                              <input 
                                type="text" value={proj.title} 
                                onChange={(e) => {
                                  const p = [...localSettings.projects];
                                  p[index].title = e.target.value;
                                  setLocalSettings(prev => ({ ...prev, projects: p }));
                                }}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-white/30 mb-1">Category</label>
                              <input 
                                type="text" value={proj.category} 
                                onChange={(e) => {
                                  const p = [...localSettings.projects];
                                  p[index].category = e.target.value;
                                  setLocalSettings(prev => ({ ...prev, projects: p }));
                                }}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-white/30 mb-1">Image URL</label>
                              <input 
                                type="text" value={proj.image} 
                                onChange={(e) => {
                                  const p = [...localSettings.projects];
                                  p[index].image = e.target.value;
                                  setLocalSettings(prev => ({ ...prev, projects: p }));
                                }}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                              />
                            </div>
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <label className="block text-xs font-medium text-white/30 mb-1">Duration</label>
                                <input 
                                  type="text" value={proj.duration} 
                                  onChange={(e) => {
                                    const p = [...localSettings.projects];
                                    p[index].duration = e.target.value;
                                    setLocalSettings(prev => ({ ...prev, projects: p }));
                                  }}
                                  className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm outline-none"
                                />
                              </div>
                              <div className="flex items-center mt-6 gap-2">
                                <input 
                                  type="checkbox" checked={proj.featured || false} 
                                  onChange={(e) => {
                                    const p = [...localSettings.projects];
                                    p[index].featured = e.target.checked;
                                    setLocalSettings(prev => ({ ...prev, projects: p }));
                                  }}
                                  className="accent-brand-primary"
                                />
                                <span className="text-xs text-white/50">Featured (Glow)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!localSettings.projects || localSettings.projects.length === 0) && (
                        <p className="text-white/30 text-sm text-center py-4">No projects yet.</p>
                      )}
                    </div>
                  </div>

                </div>
              </section>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-bold mb-6 text-brand-primary">About Page Content</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Subtitle</label>
                      <input type="text" name="aboutSubtitle" value={localSettings.aboutSubtitle || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-brand-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">CV Link Object/URL</label>
                      <input type="text" name="aboutCvUrl" value={localSettings.aboutCvUrl || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-brand-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Heading Line 1</label>
                      <input type="text" name="aboutHeading1" value={localSettings.aboutHeading1 || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-brand-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Heading Line 2</label>
                      <input type="text" name="aboutHeading2" value={localSettings.aboutHeading2 || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-brand-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Heading Line 3 (Colored)</label>
                      <input type="text" name="aboutHeading3" value={localSettings.aboutHeading3 || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-brand-primary" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">About Section Text</label>
                    <textarea 
                      name="aboutText"
                      value={localSettings.aboutText}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:border-brand-primary outline-none h-48"
                    />
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">About Image URL (e.g. imgbb link)</label>
                      <input 
                        type="text"
                        name="aboutPhotoUrl"
                        value={localSettings.aboutPhotoUrl || ''}
                        onChange={handleChange}
                        placeholder="https://i.ibb.co/..."
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Image Size / Width % (10 to 100)</label>
                      <div className="flex gap-4 items-center h-full">
                        <input 
                          type="range" min="10" max="100" name="aboutPhotoSize" value={localSettings.aboutPhotoSize || 100}
                          onChange={handleChange} className="flex-1 accent-brand-primary"
                        />
                        <span className="text-white/50 font-mono w-12 text-right">{localSettings.aboutPhotoSize || 100}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Stats Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex gap-2">
                        <input type="text" name="aboutStat1Num" value={localSettings.aboutStat1Num || ''} onChange={handleChange} placeholder="5+" className="w-1/3 bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none font-bold" />
                        <input type="text" name="aboutStat1Text" value={localSettings.aboutStat1Text || ''} onChange={handleChange} placeholder="Years Experience" className="w-2/3 bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none" />
                      </div>
                      <div className="flex gap-2">
                        <input type="text" name="aboutStat2Num" value={localSettings.aboutStat2Num || ''} onChange={handleChange} placeholder="150+" className="w-1/3 bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none font-bold" />
                        <input type="text" name="aboutStat2Text" value={localSettings.aboutStat2Text || ''} onChange={handleChange} placeholder="Projects Completed" className="w-2/3 bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none" />
                      </div>
                      <div className="flex gap-2">
                        <input type="text" name="aboutStat3Num" value={localSettings.aboutStat3Num || ''} onChange={handleChange} placeholder="80+" className="w-1/3 bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none font-bold" />
                        <input type="text" name="aboutStat3Text" value={localSettings.aboutStat3Text || ''} onChange={handleChange} placeholder="Happy Clients" className="w-2/3 bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none" />
                      </div>
                      <div className="flex gap-2">
                        <input type="text" name="aboutStat4Num" value={localSettings.aboutStat4Num || ''} onChange={handleChange} placeholder="20+" className="w-1/3 bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none font-bold" />
                        <input type="text" name="aboutStat4Text" value={localSettings.aboutStat4Text || ''} onChange={handleChange} placeholder="Countries Worked" className="w-2/3 bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none" />
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-bold mb-6 text-brand-primary">Footer Customization</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2">Footer Title</label>
                    <input 
                      type="text"
                      name="footerTitle"
                      value={localSettings.footerTitle || ''}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Link 1 Text</label>
                      <input type="text" name="footerLink1Text" value={localSettings.footerLink1Text || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Link 1 URL</label>
                      <input type="text" name="footerLink1Url" value={localSettings.footerLink1Url || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Link 2 Text</label>
                      <input type="text" name="footerLink2Text" value={localSettings.footerLink2Text || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Link 2 URL</label>
                      <input type="text" name="footerLink2Url" value={localSettings.footerLink2Url || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Link 3 Text</label>
                      <input type="text" name="footerLink3Text" value={localSettings.footerLink3Text || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Link 3 URL</label>
                      <input type="text" name="footerLink3Url" value={localSettings.footerLink3Url || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Link 4 Text</label>
                      <input type="text" name="footerLink4Text" value={localSettings.footerLink4Text || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">Link 4 URL</label>
                      <input type="text" name="footerLink4Url" value={localSettings.footerLink4Url || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          <div className="flex justify-end pt-6 gap-4">
            <button 
              onClick={() => {
                applyPreview(localSettings);
                navigate('/');
              }}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <Monitor className="w-5 h-5" />
              View Website (Preview)
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-black font-bold rounded-xl hover:bg-[#CCFF00] transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
