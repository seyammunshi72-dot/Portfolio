import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { useStore } from '../lib/store';

export default function Reviews() {
  const { settings } = useStore();
  const reviews = settings.reviews || [];

  return (
    <section id="testimonials" className="py-24 relative z-10 mx-6 lg:mx-auto max-w-7xl overflow-hidden font-sans">
      {/* Subtle ambient blend glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-brand-primary/[0.03] rounded-full blur-[100px] pointer-events-none -z-10" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-4 block">Testimonials</span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase font-display text-white">
          Client Feedback
        </h2>
      </motion.div>

      {reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#141414]/90 backdrop-blur-xl border border-white/10 rounded-[1.25rem] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:bg-[#1a1a1a]/90 transition-colors flex flex-col"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(Math.max(1, Math.min(5, Math.floor(review.rating || 5))))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#ff4444] text-[#ff4444]" />
                ))}
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-1 italic opacity-90">
                "{review.content}"
              </p>
              <div className="mt-auto">
                <h4 className="text-white font-bold text-lg tracking-tight">{review.name}</h4>
                <span className="text-gray-500 text-xs font-semibold tracking-widest uppercase">{review.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 border border-white/10 rounded-[1.25rem] bg-[#141414]/60 max-w-xl mx-auto backdrop-blur-md">
          <p className="text-gray-300 text-base italic mb-3">
            "Delivering high-retention video editing, precision pacing, and cinematic visual rhythm for creators worldwide."
          </p>
          <span className="text-brand-primary text-xs font-mono uppercase tracking-widest block font-bold">
            Client Testimonials & Feedback
          </span>
        </div>
      )}
    </section>
  );
}
