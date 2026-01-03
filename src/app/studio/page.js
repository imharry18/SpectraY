'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sliders, Wand2, Palette, BrainCircuit, ArrowUpRight, Sparkles } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';

// Animation Stagger Config
const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVars = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function StudioPage() {
  return (
    <main className="h-screen w-full bg-black text-white relative selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* --- HEADER (Fixed Height: ~80px) --- */}
      <header className="relative z-50 flex items-center justify-between px-8 py-6 shrink-0">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
           <div>
             <h1 className="text-xl font-bold tracking-tight leading-none">SPECTRA<span className="text-gray-500">STUDIO</span></h1>
             <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">v1.0.0 Stable</p>
           </div>
        </div>
        <Link href="/">
            <button className="px-5 py-2 text-xs font-mono font-medium text-gray-400 border border-white/10 rounded-full hover:bg-white/5 hover:text-white transition-all group flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-red-500 transition-colors" />
                EXIT WORKSPACE
            </button>
        </Link>
      </header>

      {/* --- MAIN CONTENT (Fills remaining height) --- */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="relative z-10 flex-1 px-6 pb-6 min-h-0" // min-h-0 is crucial for nested scrolling/flex
      >
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-6 gap-4 h-full">
            
            {/* 1. MAIN EDITOR (Left Column - Spans full height of grid) */}
            <motion.div variants={itemVars} className="md:col-span-2 row-span-4 md:row-span-6 h-full">
                <Link href="/studio/editor" className="h-full block">
                    <SpotlightCard className="h-full bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-900/60 transition-colors border-white/5">
                        <div className="p-8 md:p-10 flex flex-col justify-between h-full relative z-10">
                            
                            {/* Top Section */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6 border border-cyan-500/20">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                        </span>
                                        Primary Engine
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-medium text-white mb-4">Editor <br/> Workspace</h2>
                                    <p className="text-gray-400 max-w-sm text-lg leading-relaxed">
                                        Professional-grade manipulation. Histogram equalization, curve adjustments, and pixel-perfect correction.
                                    </p>
                                </div>
                                <ArrowUpRight className="text-cyan-400/50" size={32} />
                            </div>

                            {/* Bottom Section */}
                            <div className="space-y-6">
                                {/* Fake UI representation */}
                                <div className="flex gap-2 opacity-50">
                                    <div className="h-1 flex-1 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full overflow-hidden">
                                        <div className="h-full w-[40%] bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                                    </div>
                                    <div className="h-1 w-12 bg-gray-700 rounded-full" />
                                </div>
                                
                                <div className="flex items-center gap-3 text-cyan-400 font-bold group">
                                    <div className="w-10 h-10 rounded-full border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
                                        <Sliders size={18} />
                                    </div>
                                    <span className="group-hover:translate-x-1 transition-transform">Initialize System</span>
                                </div>
                            </div>
                        </div>
                    </SpotlightCard>
                </Link>
            </motion.div>

            {/* RIGHT COLUMN (Stacked) */}
            
            {/* 2. FILTERS (Top Right - Spans 2 rows) */}
            <motion.div variants={itemVars} className="md:col-span-1 md:row-span-2">
                <Link href="/studio/filters" className="h-full block">
                    <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.25)" className="h-full bg-zinc-900/40 border-white/5">
                        <div className="p-6 flex items-center justify-between h-full">
                            <div>
                                <Wand2 className="text-purple-400 mb-3" size={28} />
                                <h3 className="text-xl font-bold text-white">Filters</h3>
                                <p className="text-xs text-gray-500">Convolution Matrix</p>
                            </div>
                            <ArrowUpRight className="text-gray-600" size={20} />
                        </div>
                    </SpotlightCard>
                </Link>
            </motion.div>

            {/* 3. CREATE (Middle Right - Spans 2 rows) */}
            <motion.div variants={itemVars} className="md:col-span-1 md:row-span-2">
                <Link href="/studio/create" className="h-full block">
                    <SpotlightCard spotlightColor="rgba(236, 72, 153, 0.25)" className="h-full bg-zinc-900/40 border-white/5">
                        <div className="p-6 flex items-center justify-between h-full">
                            <div>
                                <Palette className="text-pink-400 mb-3" size={28} />
                                <h3 className="text-xl font-bold text-white">Generate</h3>
                                <p className="text-xs text-gray-500">Procedural Art</p>
                            </div>
                            <ArrowUpRight className="text-gray-600" size={20} />
                        </div>
                    </SpotlightCard>
                </Link>
            </motion.div>

            {/* 4. AI TOOLS (Bottom Right - Spans 2 rows) */}
            <motion.div variants={itemVars} className="md:col-span-1 md:row-span-2">
                <SpotlightCard spotlightColor="rgba(99, 102, 241, 0.25)" className="h-full bg-indigo-950/10 border-indigo-500/20 border-dashed">
                    <div className="p-6 flex flex-col justify-center h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-20">
                            <BrainCircuit size={64} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold text-white">Spectra AI</h3>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500 text-white uppercase">Soon</span>
                            </div>
                            <p className="text-xs text-indigo-200/50 mb-3">Neural Style Transfer</p>
                            <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-mono border border-indigo-500/30 rounded px-2 py-1 w-fit bg-indigo-500/10">
                                <Sparkles size={10} /> WAITING_FOR_DEPLOY
                            </div>
                        </div>
                    </div>
                </SpotlightCard>
            </motion.div>

        </div>
      </motion.div>
    </main>
  );
}