'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Book, Code, Terminal, Cpu, Layers, Image as ImageIcon } from 'lucide-react';

const SECTIONS = [
  { id: 'intro', title: 'Introduction', icon: Book },
  { id: 'installation', title: 'Installation', icon: Terminal },
  { id: 'architecture', title: 'Architecture', icon: Layers },
  { id: 'features', title: 'Core Features', icon: Cpu },
  { id: 'usage', title: 'Usage Guide', icon: ImageIcon },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('intro');

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 pb-20 flex flex-col md:flex-row gap-12">
        
        {/* --- LEFT SIDEBAR (Navigation) --- */}
        <aside className="w-full md:w-64 shrink-0 hidden md:block">
          <div className="sticky top-32 space-y-2 border-l border-white/10 pl-6">
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center gap-3 text-sm font-medium transition-colors w-full text-left py-2 ${
                  activeSection === item.id ? 'text-cyan-400 translate-x-2' : 'text-gray-500 hover:text-white'
                }`}
              >
                <item.icon size={16} />
                {item.title}
              </button>
            ))}
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 max-w-4xl space-y-24">
          
          {/* Introduction */}
          <section id="intro" className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight">Documentation</h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              SpectraY is a next-generation image processing engine that bridges the gap between web interactivity and computer vision. 
              By offloading complex matrix operations to a Python backend, we achieve scientific-grade precision in a browser environment.
            </p>
            <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-2xl">
              <h4 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                <Code size={20} /> Why Python?
              </h4>
              <p className="text-sm text-gray-400">
                While JavaScript is fast, Python's <strong>NumPy</strong> and <strong>OpenCV</strong> libraries offer optimized C-based implementations for matrix convolution, making them superior for heavy image transformation tasks.
              </p>
            </div>
          </section>

          {/* Installation */}
          <section id="installation" className="space-y-6">
            <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-4">Installation</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-200">1. Clone Repository</h3>
              <code className="block p-4 bg-zinc-950 border border-white/10 rounded-lg text-sm text-gray-400 font-mono">
                git clone https://github.com/username/spectray.git <br/>
                cd spectray
              </code>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-200">2. Setup Backend (Python)</h3>
              <code className="block p-4 bg-zinc-950 border border-white/10 rounded-lg text-sm text-gray-400 font-mono">
                python -m venv venv <br/>
                source venv/bin/activate <br/>
                pip install Flask flask-cors opencv-python-headless numpy <br/>
                python api/index.py
              </code>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-200">3. Setup Frontend (Next.js)</h3>
              <code className="block p-4 bg-zinc-950 border border-white/10 rounded-lg text-sm text-gray-400 font-mono">
                npm install <br/>
                npm run dev
              </code>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" className="space-y-6">
            <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-4">System Architecture</h2>
            <p className="text-gray-400">
              SpectraY uses a RESTful JSON architecture to communicate between the Client and Server.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5">
                    <h3 className="text-cyan-400 font-bold mb-4">Frontend (Client)</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>• Next.js 16 App Router</li>
                        <li>• Framer Motion for Animations</li>
                        <li>• React Lenis for Smooth Scroll</li>
                        <li>• Fetch API for Data Transmission</li>
                    </ul>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5">
                    <h3 className="text-purple-400 font-bold mb-4">Backend (Server)</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>• Flask (Python)</li>
                        <li>• OpenCV for Image Ops</li>
                        <li>• NumPy for Matrix Math</li>
                        <li>• Base64 Encoding/Decoding</li>
                    </ul>
                </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="space-y-6">
            <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-4">Core Capabilities</h2>
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Matrix Manipulation</h3>
                    <p className="text-gray-400 text-sm">
                        Direct access to RGB channels allows for precise histogram equalization and contrast stretching algorithms that CSS filters cannot replicate.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Convolution Filters</h3>
                    <p className="text-gray-400 text-sm">
                        We apply 3x3 and 5x5 kernels for operations like <strong>Gaussian Blur</strong>, <strong>Sharpening</strong>, and <strong>Edge Detection (Sobel/Canny)</strong>.
                    </p>
                </div>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}