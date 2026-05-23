import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useStore } from '../lib/store';

export default function Pricing() {
  const { settings } = useStore();
  const plans = settings.pricingPlans || [];

  return (
    <section id="pricing" className="py-20 relative z-10 border-t border-white/5 mx-6 lg:mx-auto max-w-7xl overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-4 block">Investment</span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase font-display text-white">
          Pricing Plans
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-4">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            className={`relative p-8 rounded-[1.25rem] border backdrop-blur-xl flex flex-col ${
              plan.popular 
                ? 'bg-[#1a1a1a]/90 border-brand-primary/50 shadow-[0_0_30px_rgba(51,255,51,0.1)] md:-mt-4 md:mb-4' 
                : 'bg-[#141414]/90 border-white/10 hover:border-white/20 hover:bg-[#181818]/90'
            } transition-all duration-300`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-[#050505] text-[10px] font-bold tracking-widest uppercase px-4 py-1 rounded-full border-2 border-[#050505]">
                Most Popular
              </div>
            )}
            
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2">{plan.name}</h3>
            <p className="text-gray-400 text-sm mb-6 h-10">{plan.description}</p>
            
            <div className="mb-8">
              <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{plan.price}</span>
              {plan.price !== "Custom" && <span className="text-white/50 text-sm ml-2">/project</span>}
            </div>
            
            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-brand-primary' : 'text-gray-500'}`} />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <button className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-colors ${
              plan.popular 
                ? 'bg-brand-primary text-[#050505] hover:bg-[#2ae02a]' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}>
              Select Plan
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
