'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Camera, Code2, Cpu, Globe, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Pixel Obsessed.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          SpectraY isn't just an image editor. It's a demonstration of how modern web technologies 
          can harness the raw mathematical power of computer vision.
        </motion.p>
      </section>

      {/* --- MISSION GRID --- */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { icon: Globe, title: "Web Native", desc: "Bringing desktop-class performance to the browser using efficient API design." },
                { icon: Cpu, title: "Python Powered", desc: "Leveraging the world's most powerful data science language for image logic." },
                { icon: Camera, title: "Visual First", desc: "A UI designed for creators, focusing on clarity, precision, and aesthetics." }
            ].map((item, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-cyan-500/20 transition-colors"
                >
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-cyan-400">
                        <item.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* --- TECH STACK STRIP --- */}
      <section className="border-y border-white/5 bg-zinc-950 py-16">
        <div className="container mx-auto px-6 text-center">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-10">Powering the Engine</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {['Next.js', 'React', 'Tailwind', 'Python', 'Flask', 'OpenCV', 'NumPy'].map((tech) => (
                    <span key={tech} className="text-xl font-bold text-white">{tech}</span>
                ))}
            </div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="container mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-400 text-sm font-medium mb-6">
            <Heart size={16} /> The Team
        </div>
        <h2 className="text-4xl font-bold mb-12">Who is behind SpectraY?</h2>
        
        <div className="max-w-md mx-auto p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/0">
            <div className="bg-black rounded-[22px] p-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full mb-6 flex items-center justify-center text-3xl font-bold">
                    HRX
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Harry</h3>
                <p className="text-cyan-400 text-sm font-mono mb-6">Lead Developer & Designer</p>
                <p className="text-gray-400 text-sm">
                    Full-stack developer with a passion for computer vision and interactive web experiences. 
                    Building the future of browser-based editing.
                </p>
            </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}