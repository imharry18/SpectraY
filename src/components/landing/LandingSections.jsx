'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sliders, Activity, BrainCircuit, ArrowRight, MousePointer2 } from 'lucide-react';

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

// --- SECTION 1: HERO ---
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black pt-20">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-600/20 rounded-[100%] blur-[120px] pointer-events-none" />
      
      <div className="container relative z-10 px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">v1.0 Now Live</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.9]">
            PIXEL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600">PERFECTION</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The first web-based image processor powered by raw Python algorithms.
            <br /> <span className="text-white">Professional grade. Browser based.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/studio">
              <button className="px-10 py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg rounded-full transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]">
                Open Studio
              </button>
            </Link>
            <button className="px-10 py-5 border border-white/10 hover:bg-white/5 text-white font-medium text-lg rounded-full transition-all flex items-center gap-2">
              Read the Docs <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- SECTION 2: EDITING ---
const EditingSection = () => {
  return (
    <section id="editing" className="min-h-screen flex items-center bg-zinc-950 py-24 border-t border-white/5">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-8 text-purple-400">
            <Sliders size={24} />
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">Precision <br/> Control.</h2>
          <p className="text-xl text-gray-400 mb-8">
            Manipulate RGB channels directly. Our histogram equalization and curve adjustments happen in real-time using NumPy matrices.
          </p>
        </motion.div>
        
        {/* Abstract Visual Representation */}
        <div className="h-[500px] w-full bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-4 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-purple-600/20 rounded-full blur-[100px] group-hover:bg-purple-600/30 transition-all duration-700" />
           <div className="relative z-10 h-full flex items-center justify-center border border-white/5 rounded-2xl bg-black/20 backdrop-blur-sm">
             <span className="font-mono text-xs text-gray-500">Interactive Preview Module</span>
           </div>
        </div>
      </div>
    </section>
  );
};

// --- SECTION 3: SPECTRA AI ---
const AISection = () => {
  return (
    <section id="ai" className="min-h-screen flex flex-col justify-center bg-black py-24 relative overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950/20 to-black" />
       
       <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 mb-8">
                <BrainCircuit size={18} />
                <span className="text-sm font-bold tracking-widest uppercase">Spectra AI Engine</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8">
                The Future is <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Generative.</span>
            </h2>
            <p className="text-2xl text-gray-500 max-w-3xl mx-auto">
                Coming soon: Neural Style Transfer and Object Removal powered by PyTorch, running directly in your browser.
            </p>
          </motion.div>
       </div>
    </section>
  );
};

export default function LandingSections() {
  return (
    <div className="w-full overflow-hidden bg-black">
      <HeroSection />
      <EditingSection />
      <AISection />
    </div>
  );
}