'use client';
import Link from 'next/link';
import { Camera, Github, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Filters', href: '#filters' },
    { name: 'Editing', href: '#editing' },
    { name: 'SpectAI', href: '#ai' },
    { name: 'Docs', href: '/docs' },
    { name: 'About', href: '/about' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 backdrop-blur-xl bg-black/40 border-b border-white/5 supports-[backdrop-filter]:bg-black/20"
    >
      {/* Logo Area */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-cyan-600 to-blue-700 rounded-xl group-hover:scale-105 transition-transform">
          <Camera className="w-5 h-5 text-white" />
          <div className="absolute inset-0 bg-white/20 blur-lg rounded-xl opacity-0 group-hover:opacity-50 transition-opacity" />
        </div>
        <span className="text-xl font-bold tracking-widest text-white">
          SPECTRA<span className="text-cyan-400">X</span>
        </span>
      </Link>

      {/* Center Links */}
      <div className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5 backdrop-blur-md">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right Action Area */}
      <div className="flex items-center gap-4">
        <Link 
            href="https://github.com" 
            className="hidden md:flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
            <Github size={20} />
        </Link>
        
        <Link href="/studio">
          <button className="group relative flex items-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full overflow-hidden transition-all hover:pr-4">
            <span className="relative z-10 group-hover:-translate-x-1 transition-transform">Launch Studio</span>
            <ChevronRight className="w-4 h-4 relative z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
        </Link>
      </div>
    </motion.nav>
  );
}