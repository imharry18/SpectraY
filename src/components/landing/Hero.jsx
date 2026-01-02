'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Layers, Zap } from 'lucide-react';

// A component to render the "Matrix" background
const MatrixBackground = () => {
  // Generate a grid of random "pixel values"
  const rows = new Array(8).fill(0);
  const cols = new Array(12).fill(0);

  return (
    <div className="absolute inset-0 z-0 opacity-20 overflow-hidden mask-image-gradient">
      <div className="grid grid-cols-12 gap-2 p-4">
        {rows.map((_, i) => (
          cols.map((_, j) => (
            <motion.div
              key={`${i}-${j}`}
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
              className="text-[10px] md:text-xs font-mono text-cyan-500/50 whitespace-nowrap"
            >
              [{Math.floor(Math.random() * 255)}, 
               {Math.floor(Math.random() * 255)}, 
               {Math.floor(Math.random() * 255)}]
            </motion.div>
          ))
        ))}
      </div>
      {/* Gradient Overlay to fade edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    </div>
  );
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-20 bg-black text-white overflow-hidden">
      
      <MatrixBackground />

      <div className="container relative z-10 px-4 mx-auto text-center">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-6 border rounded-full border-cyan-500/30 bg-cyan-500/10"
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-cyan-300">Powered by OpenCV & NumPy</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500"
        >
          Visual Data, <br />
          <span className="text-cyan-400">Mathematically</span> Refined.
        </motion.h1>

        {/* Subhead */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg text-gray-400 mb-10"
        >
          Experience next-gen image processing. SpectraX deconstructs your images into 
          RGB matrices and applies high-performance Python algorithms directly in the browser.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="group relative px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2">
            Start Processing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border border-white/20 hover:bg-white/10 rounded-full transition-all text-white">
            View on GitHub
          </button>
        </motion.div>
      </div>

      {/* Feature Grid at Bottom of Hero */}
      <div className="relative z-10 mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
        {[
          { icon: Layers, title: "Matrix Convolution", desc: "Kernel-based operations for blurring and sharpening." },
          { icon: Zap, title: "Real-time Python", desc: "Powered by a high-performance Flask backend." },
          { icon: Cpu, title: "Pixel Manipulation", desc: "Low-level RGB channel separation and adjustment." }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (idx * 0.1) }}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-cyan-500/50 transition-colors"
          >
            <feature.icon className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}