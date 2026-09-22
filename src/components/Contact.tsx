import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageCircle, Briefcase, Globe, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '../lib/store';
import { getWhatsAppChatUrl, formatSocialUrl, extractInstagramUsername } from '../lib/socialUtils';

export default function Contact() {
  const { settings } = useStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Select a service');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactEmail = settings.contactEmail || 'seyammunshi72@gmail.com';
  const whatsappNumber = settings.whatsappNumber || '+8801786546949';
  const whatsappDisplay = whatsappNumber;

  const instagramRaw = settings.instagramUrl || settings.footerLink1Url || 'sey.am1';
  const instagramUsername = extractInstagramUsername(instagramRaw);
  const instagramDisplay = `@${instagramUsername}`;
  const instagramUrl = formatSocialUrl('instagram', instagramRaw) || `https://instagram.com/${instagramUsername}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setStatus('error');
      return;
    }

    const chosenService = service === 'Select a service' ? 'General Video Inquiry' : service;
    const emailSubject = encodeURIComponent(`Project Inquiry: ${chosenService} - ${fullName}`);
    const emailBody = encodeURIComponent(
      `Name: ${fullName}\nEmail: ${email}\nInterested In: ${chosenService}\n\nMessage:\n${message}`
    );

    // Trigger direct mail client
    window.location.href = `mailto:${contactEmail}?subject=${emailSubject}&body=${emailBody}`;

    setStatus('success');
    setTimeout(() => {
      setFullName('');
      setEmail('');
      setService('Select a service');
      setMessage('');
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative z-10 mx-4 sm:mx-6 lg:mx-auto max-w-7xl font-sans">
      {/* Ambient blend glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#0284c7]/[0.03] rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 px-4"
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-white tracking-tight mb-4">
          Have a Project? Let’s Talk
        </h2>
        <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto font-normal">
          Tell us about your project. We will get back with a clear plan.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Cards */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-5 space-y-4"
        >
          {/* Email Us Card */}
          <a
            href={`mailto:${contactEmail}`}
            className="group block bg-[#141414]/90 hover:bg-[#1a1a1a]/95 border border-white/10 rounded-2xl p-6 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-white text-lg sm:text-xl font-bold tracking-tight mb-1 group-hover:text-brand-primary transition-colors">
                  Email Us
                </h3>
                <p className="text-white/60 text-sm sm:text-base font-normal break-all">
                  {contactEmail}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                {/* Gmail Multi-colored Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
                  <path fill="#EA4335" d="M20 4H4C2.9 4 2 4.9 2 6l10 6.25L22 6c0-1.1-.9-2-2-2z"/>
                  <path fill="#FBBC05" d="M2 6v12c0 1.1.9 2 2 2h2V9.5L2 6z"/>
                  <path fill="#34A853" d="M20 20c1.1 0 2-.9 2-2V6l-4 3.5V20h2z"/>
                </svg>
              </div>
            </div>
          </a>

          {/* WhatsApp Us Card */}
          <a
            href={getWhatsAppChatUrl(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-[#141414]/90 hover:bg-[#1a1a1a]/95 border border-white/10 rounded-2xl p-6 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-white text-lg sm:text-xl font-bold tracking-tight mb-1 group-hover:text-[#25D366] transition-colors">
                  WhatsApp Us
                </h3>
                <p className="text-white/60 text-sm sm:text-base font-normal font-mono">
                  {whatsappDisplay}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                {/* WhatsApp Official Color Icon */}
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                  <path
                    fill="#25D366"
                    d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z"
                  />
                  <path
                    fill="white"
                    d="M17.52 14.33C17.22 14.18 15.75 13.45 15.47 13.35C15.2 13.25 15 13.2 14.81 13.5C14.61 13.8 14.05 14.47 13.88 14.66C13.71 14.86 13.53 14.88 13.24 14.73C12.94 14.58 11.99 14.27 10.87 13.27C9.99 12.49 9.4 11.52 9.23 11.23C9.06 10.93 9.21 10.77 9.36 10.63C9.49 10.5 9.66 10.28 9.8 10.11C9.95 9.94 10 9.82 10.1 9.62C10.2 9.42 10.15 9.25 10.08 9.1C10 8.95 9.43 7.55 9.2 6.98C8.97 6.43 8.74 6.51 8.57 6.5C8.41 6.49 8.22 6.49 8.03 6.49C7.84 6.49 7.52 6.56 7.26 6.84C6.99 7.13 6.25 7.82 6.25 9.22C6.25 10.62 7.27 11.97 7.42 12.16C7.56 12.36 9.45 15.27 12.35 16.52C13.04 16.82 13.58 17 14 17.13C14.69 17.35 15.31 17.32 15.81 17.25C16.36 17.17 17.51 16.55 17.75 15.87C17.99 15.19 17.99 14.61 17.92 14.49C17.85 14.36 17.67 14.29 17.52 14.33Z"
                  />
                </svg>
              </div>
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-[#141414]/90 hover:bg-[#1a1a1a]/95 border border-white/10 rounded-2xl p-6 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-white text-lg sm:text-xl font-bold tracking-tight mb-1 group-hover:text-[#E1306C] transition-colors">
                  Instagram
                </h3>
                <p className="text-white/60 text-sm sm:text-base font-normal font-mono">
                  {instagramDisplay}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                {/* Official Instagram Color Gradient Icon */}
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <radialGradient id="contactInstaGrad" cx="30%" cy="105%" r="130%" fx="30%" fy="105%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#contactInstaGrad)" />
                  <circle cx="12" cy="12" r="3.4" stroke="white" strokeWidth="1.6" fill="none" />
                  <circle cx="16.5" cy="7.5" r="1.1" fill="white" />
                  <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="white" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            </div>
          </a>

          {/* Work with Seyam Card */}
          <div className="bg-[#141414]/90 border border-white/10 rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-white text-lg sm:text-xl font-bold tracking-tight mb-1">
                  Work with Seyam
                </h3>
                <p className="text-white/60 text-sm sm:text-base font-normal">
                  Open for freelance & contract opportunities
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md text-[#1d4ed8]">
                <Briefcase className="w-6 h-6 text-[#1e40af]" />
              </div>
            </div>
          </div>

          {/* Visit Us / Location Card */}
          <div className="bg-[#141414]/90 border border-white/10 rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-white text-lg sm:text-xl font-bold tracking-tight mb-1">
                  Global Availability
                </h3>
                <p className="text-white/60 text-sm sm:text-base font-normal">
                  Worldwide Remote • 24/7 Client Support
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md text-[#1e40af]">
                <Globe className="w-6 h-6 text-[#1e40af]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-7 bg-[#141414]/95 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Full Name
              </label>
              <input 
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none transition-all text-sm sm:text-base"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Email
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john48@gmail.com"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none transition-all text-sm sm:text-base"
              />
            </div>

            {/* Interested In */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Interested In
              </label>
              <div className="relative">
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none transition-all appearance-none cursor-pointer text-sm sm:text-base pr-10"
                >
                  <option value="Select a service" className="bg-[#1c1c1c] text-white/60">Select a service</option>
                  <option value="YouTube Long-form Video Editing" className="bg-[#1c1c1c] text-white">YouTube Long-form Video Editing</option>
                  <option value="Talking Head / Podcasts" className="bg-[#1c1c1c] text-white">Talking Head / Podcasts</option>
                  <option value="Short-form Content (Reels / TikTok / Shorts)" className="bg-[#1c1c1c] text-white">Short-form Content (Reels / TikTok / Shorts)</option>
                  <option value="Cinematic & Commercial Edits" className="bg-[#1c1c1c] text-white">Cinematic & Commercial Edits</option>
                  <option value="Gaming & Montage Edits" className="bg-[#1c1c1c] text-white">Gaming & Montage Edits</option>
                  <option value="Full Video Editing Retainer" className="bg-[#1c1c1c] text-white">Full Video Editing Retainer</option>
                  <option value="Other Project" className="bg-[#1c1c1c] text-white">Other Project</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Your Message */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Your Message
              </label>
              <textarea 
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I would like to know more about your service"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none transition-all resize-y min-h-[120px] text-sm sm:text-base leading-relaxed"
              />
            </div>

            {/* Feedback Alert */}
            {status === 'success' && (
              <div className="p-4 rounded-xl bg-[#0284c7]/20 border border-[#0284c7]/40 text-white flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0" />
                <span>Thank you! Preparing your message to Seyam...</span>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
                Please fill in your name and email address.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-8 rounded-xl font-bold text-white text-base shadow-lg bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
