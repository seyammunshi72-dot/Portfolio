import React, { useState, useEffect } from 'react';
import { useStore, SiteSettings } from '../lib/store';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, LogOut, Monitor, LayoutDashboard, User, Edit2, PanelBottom, Star, Film, ExternalLink, Phone, Image as ImageIcon, Sparkles } from 'lucide-react';
import Hero from './Hero';
import AdminHeroSettings from './AdminHeroSettings';
import { saveVideoBlob } from '../lib/videoStorage';
import { getWhatsAppChatUrl, formatSocialUrl, extractInstagramUsername } from '../lib/socialUtils';

function FolderCard({
  category,
  count,
  onExpand,
  onUpdateCategory
}: {
  key?: React.Key;
  category: string;
  count: number;
  onExpand: () => void;
  onUpdateCategory: (oldCat: string, newCat: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(category);

  useEffect(() => { setVal(category); }, [category]);

  const commitUpdate = () => {
    setIsEditing(false);
    if (val.trim() && val.trim() !== category) {
      onUpdateCategory(category, val.trim().toUpperCase());
    } else {
      setVal(category);
    }
  };

  return (
    <button 
      onClick={() => { 
        if (!isEditing) onExpand(); 
      }}
      className="relative group text-left transition-transform hover:-translate-y-2 h-48 w-full"
    >
      {/* Back tab */}
      <div className="absolute top-0 left-4 w-1/2 h-8 bg-[#C6A67A] rounded-t-[10px] shadow-inner" />
      
      {/* Main Body */}
      <div className="absolute top-4 left-0 w-full h-[calc(100%-1rem)] bg-[#E8D1A7] rounded-xl rounded-tl-none shadow-lg border-2 border-[#B58C56]/50 p-4 flex flex-col justify-center items-center overflow-hidden">
        
        {/* Paper label */}
        <div 
          className="bg-[#Fdfaf5] py-2.5 px-6 shadow-[1px_1px_3px_rgba(0,0,0,0.1)] transform -rotate-1 border border-black/5 z-10 w-4/5 text-center flex items-center justify-center -translate-y-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onBlur={commitUpdate}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitUpdate();
                if (e.key === 'Escape') {
                  setVal(category);
                  setIsEditing(false);
                }
              }}
              className="font-mono text-xs tracking-[0.2em] text-[#462F24] font-bold uppercase w-full bg-transparent outline-none text-center border-b border-brand-primary placeholder-[#462F24]/50"
              placeholder="FOLDER NAME"
            />
          ) : (
            <>
              <span className="font-mono text-xs tracking-[0.2em] text-[#462F24] font-bold uppercase truncate">{category}</span>
              <Edit2 className="w-3 h-3 text-[#462F24]/30 ml-2 flex-shrink-0" />
            </>
          )}
        </div>

        {/* Left spine detail */}
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-60 z-0">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-5 h-2.5 rounded-full border-[2.5px] border-[#8B5D33]/60 mix-blend-multiply" />
          ))}
        </div>
        
        <div className="absolute bottom-3 right-4 text-[10px] font-bold tracking-wider text-[#8B5D33] opacity-50 uppercase">
          {count} {count === 1 ? 'Item' : 'Items'}
        </div>
      </div>
    </button>
  );
}

export default function AdminDashboard() {
  const { user, settings, updateSettings, logout, applyPreview } = useStore();
  const navigate = useNavigate();
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'projects' | 'about' | 'reviews' | 'footer'>('hero');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Sync settings when they are loaded from Firestore
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await saveVideoBlob(file);
    } catch (err) {
      console.warn('Could not save to IndexedDB:', err);
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalSettings(prev => ({
      ...prev,
      heroType: 'video',
      heroVideoUrl: objectUrl
    }));
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
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'hero' ? 'bg-brand-primary text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              <ImageIcon className="w-4 h-4" /> Home GIF & Hero
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'projects' ? 'bg-brand-primary text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Projects & Categories
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'about' ? 'bg-brand-primary text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              <User className="w-4 h-4" /> About Section
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'reviews' ? 'bg-brand-primary text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              <Star className="w-4 h-4" /> Client Reviews
            </button>
            <button 
              onClick={() => setActiveTab('footer')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'footer' ? 'bg-brand-primary text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              <PanelBottom className="w-4 h-4" /> Footer & Contact
            </button>
          </nav>
        </div>

        {/* Editing Area */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-sm text-white/50">Manage your portfolio content. Changes update live upon saving.</p>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full transition-colors font-medium text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          {/* TAB 1: HERO VIDEO */}
          {activeTab === 'hero' && (
            <AdminHeroSettings 
              localSettings={localSettings}
              setLocalSettings={setLocalSettings}
              handleChange={handleChange}
              handleVideoUpload={handleVideoUpload}
              setIsFullscreenPreview={setIsFullscreenPreview}
            />
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-primary">Projects & Categories</h2>
                    <p className="text-sm text-white/50 mt-1">Organize your portfolio video work into distinct folder categories.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const newProjects = [...(localSettings.projects || [])];
                      newProjects.push({ id: Date.now().toString(), category: expandedCategory || 'TALKING HEAD', title: 'New Video Project', image: '', videoUrl: '' });
                      setLocalSettings(prev => ({ ...prev, projects: newProjects }));
                    }}
                    className="bg-brand-primary text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#CCFF00] transition-colors"
                  >
                    + Add New Project
                  </button>
                </div>

                <div className="space-y-6">
                  {expandedCategory === null ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {Array.from(new Set(localSettings.projects?.map(p => p.category) || [])).map(category => {
                          const count = localSettings.projects?.filter(p => p.category === category).length;
                          return (
                            <FolderCard 
                              key={category as string}
                              category={category as string}
                              count={count || 0}
                              onExpand={() => setExpandedCategory(category as string)}
                              onUpdateCategory={(oldCat, newCat) => {
                                const p = [...(localSettings.projects || [])].map(proj => {
                                  if (proj.category === oldCat) {
                                    return { ...proj, category: newCat };
                                  }
                                  return proj;
                                });
                                setLocalSettings(prev => ({ ...prev, projects: p }));
                              }}
                            />
                          );
                        })}
                      </div>

                      {(!localSettings.projects || localSettings.projects.length === 0) && (
                        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                          <p className="text-white/40 text-sm mb-4">No projects added yet.</p>
                          <button 
                            onClick={() => {
                              const newProjects = [
                                { id: Date.now().toString(), category: 'TALKING HEAD', title: 'Sample Project', image: '', videoUrl: '' }
                              ];
                              setLocalSettings(prev => ({ ...prev, projects: newProjects }));
                            }}
                            className="bg-brand-primary/20 text-brand-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-primary/30 transition-colors"
                          >
                            + Create First Project
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <button 
                          onClick={() => setExpandedCategory(null)}
                          className="text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back to All Folders
                        </button>
                        <div className="flex items-center gap-2 flex-1 group/title">
                          <input 
                            value={expandedCategory}
                            onChange={(e) => {
                              const newCategory = e.target.value.toUpperCase();
                              const p = [...(localSettings.projects || [])].map(proj => {
                                if (proj.category === expandedCategory) {
                                  return { ...proj, category: newCategory };
                                }
                                return proj;
                              });
                              setLocalSettings(prev => ({ ...prev, projects: p }));
                              setExpandedCategory(newCategory);
                            }}
                            className="text-xl font-bold text-brand-primary bg-transparent border-b border-white/20 focus:border-brand-primary outline-none transition-colors w-auto min-w-[200px]"
                            placeholder="Category Folder Name"
                          />
                          <Edit2 className="w-4 h-4 text-white/30" />
                        </div>
                      </div>
                      
                      {localSettings.projects?.map((proj, index) => {
                        if (proj.category !== expandedCategory) return null;
                        return (
                          <div key={proj.id || index} className="bg-black/60 p-5 rounded-xl border border-white/10 relative group">
                            <button 
                              onClick={() => {
                                const newProjects = [...(localSettings.projects || [])];
                                newProjects.splice(index, 1);
                                setLocalSettings(prev => ({ ...prev, projects: newProjects }));
                              }}
                              className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20"
                            >
                              Delete Project
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Project Title</label>
                                <input 
                                  type="text" value={proj.title} 
                                  onChange={(e) => {
                                    const p = [...localSettings.projects];
                                    p[index].title = e.target.value;
                                    setLocalSettings(prev => ({ ...prev, projects: p }));
                                  }}
                                  className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-brand-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Category Folder</label>
                                <input 
                                  type="text" value={proj.category} 
                                  onChange={(e) => {
                                    const p = [...localSettings.projects];
                                    p[index].category = e.target.value.toUpperCase();
                                    setLocalSettings(prev => ({ ...prev, projects: p }));
                                  }}
                                  className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none uppercase focus:border-brand-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Thumbnail Image URL</label>
                                <input 
                                  type="text" value={proj.image} 
                                  onChange={(e) => {
                                    const p = [...localSettings.projects];
                                    p[index].image = e.target.value;
                                    setLocalSettings(prev => ({ ...prev, projects: p }));
                                  }}
                                  placeholder="https://... image link"
                                  className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-brand-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Video Link (Google Drive / YouTube)</label>
                                <input 
                                  type="text" value={proj.videoUrl || ''} 
                                  onChange={(e) => {
                                    const p = [...localSettings.projects];
                                    p[index].videoUrl = e.target.value;
                                    setLocalSettings(prev => ({ ...prev, projects: p }));
                                  }}
                                  className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-brand-primary"
                                  placeholder="https://drive.google.com/file/d/.../view"
                                />
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <input 
                                  type="checkbox" 
                                  id={`featured-${index}`}
                                  checked={proj.featured || false} 
                                  onChange={(e) => {
                                    const p = [...localSettings.projects];
                                    p[index].featured = e.target.checked;
                                    setLocalSettings(prev => ({ ...prev, projects: p }));
                                  }}
                                  className="accent-brand-primary w-4 h-4"
                                />
                                <label htmlFor={`featured-${index}`} className="text-xs text-white/70 cursor-pointer">
                                  Mark as Featured Project
                                </label>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-brand-primary">About Page Content</h2>
                  <p className="text-sm text-white/50 mt-1">Customize your story, bio text in Notepad.exe, and profile photo.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Notepad Window Heading</label>
                    <input 
                      type="text" 
                      name="aboutSubtitle" 
                      value={localSettings.aboutSubtitle || ''} 
                      onChange={handleChange} 
                      placeholder="Who is this guy?!?"
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-primary" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Profile Photo URL (viewer.exe)</label>
                    <input 
                      type="text" 
                      name="aboutPhotoUrl" 
                      value={localSettings.aboutPhotoUrl || ''} 
                      onChange={handleChange} 
                      placeholder="https://... (direct link or imgbb image link)"
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-primary" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Notepad Bio Text (Write paragraphs separated by new lines)</label>
                  <textarea 
                    name="aboutText"
                    value={localSettings.aboutText || ''}
                    onChange={handleChange}
                    placeholder="Write your personal introduction here..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:border-brand-primary outline-none h-44 text-sm leading-relaxed"
                  />
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-bold text-white mb-2">Experience Metrics & Counters</h3>
                  <p className="text-xs text-white/40 mb-4">These appear in the counters section directly beneath the retro windows.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <input type="text" name="aboutStat1Num" value={localSettings.aboutStat1Num || ''} onChange={handleChange} placeholder="2+" className="w-1/3 bg-black/50 border border-white/10 rounded-lg p-2.5 text-white outline-none font-bold" />
                      <input type="text" name="aboutStat1Text" value={localSettings.aboutStat1Text || ''} onChange={handleChange} placeholder="Years Experience" className="w-2/3 bg-black/50 border border-white/10 rounded-lg p-2.5 text-white outline-none" />
                    </div>
                    <div className="flex gap-2">
                      <input type="text" name="aboutStat2Num" value={localSettings.aboutStat2Num || ''} onChange={handleChange} placeholder="100+" className="w-1/3 bg-black/50 border border-white/10 rounded-lg p-2.5 text-white outline-none font-bold" />
                      <input type="text" name="aboutStat2Text" value={localSettings.aboutStat2Text || ''} onChange={handleChange} placeholder="Projects Completed" className="w-2/3 bg-black/50 border border-white/10 rounded-lg p-2.5 text-white outline-none" />
                    </div>
                    <div className="flex gap-2">
                      <input type="text" name="aboutStat3Num" value={localSettings.aboutStat3Num || ''} onChange={handleChange} placeholder="18+" className="w-1/3 bg-black/50 border border-white/10 rounded-lg p-2.5 text-white outline-none font-bold" />
                      <input type="text" name="aboutStat3Text" value={localSettings.aboutStat3Text || ''} onChange={handleChange} placeholder="Happy Clients" className="w-2/3 bg-black/50 border border-white/10 rounded-lg p-2.5 text-white outline-none" />
                    </div>
                    <div className="flex gap-2">
                      <input type="text" name="aboutStat4Num" value={localSettings.aboutStat4Num || ''} onChange={handleChange} placeholder="5+" className="w-1/3 bg-black/50 border border-white/10 rounded-lg p-2.5 text-white outline-none font-bold" />
                      <input type="text" name="aboutStat4Text" value={localSettings.aboutStat4Text || ''} onChange={handleChange} placeholder="Countries Worked" className="w-2/3 bg-black/50 border border-white/10 rounded-lg p-2.5 text-white outline-none" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-primary">Client Testimonials</h2>
                    <p className="text-sm text-white/50 mt-1">Real feedback from clients. Note: This section automatically hides on the public site when empty.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const newReviews = [...(localSettings.reviews || [])];
                      newReviews.push({ name: 'Client Name', role: 'Creator / Founder', content: 'Outstanding video editing and fast delivery.', rating: 5 });
                      setLocalSettings(prev => ({ ...prev, reviews: newReviews }));
                    }}
                    className="bg-brand-primary text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#CCFF00] transition-colors"
                  >
                    + Add Review
                  </button>
                </div>

                <div className="space-y-4">
                  {localSettings.reviews?.map((review, index) => (
                    <div key={index} className="bg-black/60 p-5 rounded-xl border border-white/10 relative group">
                      <button 
                        onClick={() => {
                          const newReviews = [...(localSettings.reviews || [])];
                          newReviews.splice(index, 1);
                          setLocalSettings(prev => ({ ...prev, reviews: newReviews }));
                        }}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20"
                      >
                        Delete Review
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="block text-xs font-medium text-white/40 mb-1">Client Name</label>
                          <input 
                            type="text" value={review.name} 
                            onChange={(e) => {
                              const r = [...(localSettings.reviews || [])];
                              r[index].name = e.target.value;
                              setLocalSettings(prev => ({ ...prev, reviews: r }));
                            }}
                            className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-brand-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/40 mb-1">Role or Organization</label>
                          <input 
                            type="text" value={review.role} 
                            onChange={(e) => {
                              const r = [...(localSettings.reviews || [])];
                              r[index].role = e.target.value;
                              setLocalSettings(prev => ({ ...prev, reviews: r }));
                            }}
                            className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-brand-primary"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-white/40 mb-1">Feedback Content</label>
                          <textarea 
                            value={review.content} 
                            onChange={(e) => {
                              const r = [...(localSettings.reviews || [])];
                              r[index].content = e.target.value;
                              setLocalSettings(prev => ({ ...prev, reviews: r }));
                            }}
                            className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-brand-primary min-h-[70px]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/40 mb-1">Star Rating (1-5)</label>
                          <input 
                            type="number" value={review.rating} min="1" max="5" 
                            onChange={(e) => {
                              const r = [...(localSettings.reviews || [])];
                              r[index].rating = Number(e.target.value);
                              setLocalSettings(prev => ({ ...prev, reviews: r }));
                            }}
                            className="w-full bg-[#111] border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-brand-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!localSettings.reviews || localSettings.reviews.length === 0) && (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-white/40 text-sm">
                      No reviews added yet. The reviews section remains hidden on the public site until you add one.
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* TAB 6: FOOTER & CONTACT */}
          {activeTab === 'footer' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-brand-primary">Footer & Social Links</h2>
                  <p className="text-sm text-white/50 mt-1">Configure your signature name and public social profiles.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Signature / Brand Title</label>
                  <input 
                    type="text"
                    name="footerTitle"
                    value={localSettings.footerTitle || ''}
                    onChange={handleChange}
                    placeholder="SEYAM MUNSHI"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                  />
                </div>

                {/* Contact & WhatsApp Configuration */}
                <div className="border-t border-white/10 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#25D366] inline-block shadow-[0_0_8px_#25D366]" />
                        WhatsApp Contact (Number Only)
                      </h3>
                      <p className="text-xs text-white/50 mt-0.5">
                        Enter your phone number directly. Do NOT enter a web link! We automatically generate the chat link for both the footer and the floating WhatsApp button.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                      <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                        WhatsApp Phone Number
                      </label>
                      <input 
                        type="text" 
                        name="whatsappNumber" 
                        value={localSettings.whatsappNumber || ''} 
                        onChange={handleChange} 
                        placeholder="+8801786546949" 
                        className="w-full bg-black/60 border border-white/15 rounded-lg p-3 text-white text-sm font-mono focus:border-[#25D366] outline-none" 
                      />
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-white/50">
                          Format: +8801786546949 or 01786546949
                        </span>
                        {localSettings.whatsappNumber && (
                          <a 
                            href={getWhatsAppChatUrl(localSettings.whatsappNumber)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#25D366] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Test WhatsApp Chat
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                      <label className="block text-xs font-bold text-white">
                        Contact Email
                      </label>
                      <input 
                        type="email" 
                        name="contactEmail" 
                        value={localSettings.contactEmail || ''} 
                        onChange={handleChange} 
                        placeholder="seyammunshi72@gmail.com" 
                        className="w-full bg-black/60 border border-white/15 rounded-lg p-3 text-white text-sm font-mono focus:border-brand-primary outline-none" 
                      />
                      <span className="text-[11px] text-white/50 block pt-1">
                        Inquiries and email cards will be directed to this address
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Profiles Section */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Social Media Profiles</h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      Enter your social media usernames or profile links. Works automatically with or without "https://".
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Instagram */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 inline-block" />
                          Instagram Profile
                        </label>
                        {(localSettings.instagramUrl || localSettings.footerLink1Url) && (
                          <a 
                            href={formatSocialUrl('instagram', localSettings.instagramUrl || localSettings.footerLink1Url)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-brand-primary hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Test Link
                          </a>
                        )}
                      </div>
                      <input 
                        type="text" 
                        name="instagramUrl" 
                        value={localSettings.instagramUrl || localSettings.footerLink1Url || ''} 
                        onChange={(e) => {
                          handleChange(e);
                          setLocalSettings(prev => ({
                            ...prev,
                            instagramUrl: e.target.value,
                            footerLink1Text: 'INSTAGRAM',
                            footerLink1Url: e.target.value
                          }));
                        }} 
                        placeholder="@sey.am1 or https://instagram.com/sey.am1" 
                        className="w-full bg-black/60 border border-white/15 rounded-lg p-2.5 text-white text-sm font-mono focus:border-brand-primary outline-none" 
                      />
                      <span className="text-[11px] text-white/40 block">
                        Username: @{extractInstagramUsername(localSettings.instagramUrl || localSettings.footerLink1Url || 'sey.am1')}
                      </span>
                    </div>

                    {/* Facebook */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#1877F2] inline-block" />
                          Facebook Profile / Page
                        </label>
                        {localSettings.facebookUrl && (
                          <a 
                            href={formatSocialUrl('facebook', localSettings.facebookUrl)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-brand-primary hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Test Link
                          </a>
                        )}
                      </div>
                      <input 
                        type="text" 
                        name="facebookUrl" 
                        value={localSettings.facebookUrl || ''} 
                        onChange={handleChange} 
                        placeholder="facebook.com/seyammunshi or https://facebook.com/..." 
                        className="w-full bg-black/60 border border-white/15 rounded-lg p-2.5 text-white text-sm font-mono focus:border-brand-primary outline-none" 
                      />
                      <span className="text-[11px] text-white/40 block">
                        Will be formatted to https://facebook.com/...
                      </span>
                    </div>

                    {/* YouTube */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FF0000] inline-block" />
                          YouTube Channel
                        </label>
                        {(localSettings.youtubeUrl || localSettings.footerLink2Url) && (
                          <a 
                            href={formatSocialUrl('youtube', localSettings.youtubeUrl || localSettings.footerLink2Url)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-brand-primary hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Test Link
                          </a>
                        )}
                      </div>
                      <input 
                        type="text" 
                        name="youtubeUrl" 
                        value={localSettings.youtubeUrl || localSettings.footerLink2Url || ''} 
                        onChange={(e) => {
                          handleChange(e);
                          setLocalSettings(prev => ({
                            ...prev,
                            youtubeUrl: e.target.value,
                            footerLink2Text: 'YOUTUBE',
                            footerLink2Url: e.target.value
                          }));
                        }} 
                        placeholder="youtube.com/@seyammunshi or https://youtube.com/..." 
                        className="w-full bg-black/60 border border-white/15 rounded-lg p-2.5 text-white text-sm font-mono focus:border-brand-primary outline-none" 
                      />
                      <span className="text-[11px] text-white/40 block">
                        Will be formatted to https://youtube.com/...
                      </span>
                    </div>

                    {/* Behance / Portfolio */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#0057ff] inline-block" />
                          Behance / Other Portfolio
                        </label>
                        {(localSettings.behanceUrl || localSettings.footerLink4Url) && (
                          <a 
                            href={formatSocialUrl('generic', localSettings.behanceUrl || localSettings.footerLink4Url)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-brand-primary hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Test Link
                          </a>
                        )}
                      </div>
                      <input 
                        type="text" 
                        name="behanceUrl" 
                        value={localSettings.behanceUrl || localSettings.footerLink4Url || ''} 
                        onChange={(e) => {
                          handleChange(e);
                          setLocalSettings(prev => ({
                            ...prev,
                            behanceUrl: e.target.value,
                            footerLink4Text: 'BEHANCE',
                            footerLink4Url: e.target.value
                          }));
                        }} 
                        placeholder="https://behance.net/seyammunshi" 
                        className="w-full bg-black/60 border border-white/15 rounded-lg p-2.5 text-white text-sm font-mono focus:border-brand-primary outline-none" 
                      />
                      <span className="text-[11px] text-white/40 block">
                        Portfolio or personal website link
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Custom Footer Links */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <h4 className="text-sm font-bold text-white/80">Additional Custom Footer Link (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-1">Custom Link Label</label>
                      <input type="text" name="footerLink3Text" value={localSettings.footerLink3Text || ''} onChange={handleChange} placeholder="TWITTER / X or OTHER" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-1">Custom Link URL</label>
                      <input type="text" name="footerLink3Url" value={localSettings.footerLink3Url || ''} onChange={handleChange} placeholder="https://x.com/..." className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm font-mono" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Action Bar */}
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
