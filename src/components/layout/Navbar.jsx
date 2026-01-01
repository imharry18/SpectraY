'use client';
import Link from 'next/link';
import { Camera, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/30 border-b border-white/10"
    >
      <div className="flex items-center gap-2">
        <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg">
          <Camera className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-wider text-white">
          SPECTRA<span className="text-cyan-400">X</span>
        </span>
      </div>

      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
        <Link href="#" className="hover:text-cyan-400 transition-colors">Features</Link>
        <Link href="#" className="hover:text-cyan-400 transition-colors">How it Works</Link>
        <Link href="#" className="hover:text-cyan-400 transition-colors">Docs</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="https://github.com" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <Github size={20} />
        </Link>
        <button className="px-5 py-2 text-sm font-bold text-black bg-cyan-400 rounded-full hover:bg-cyan-300 transition-transform hover:scale-105">
          Launch Editor
        </button>
      </div>
    </motion.nav>
  );
}