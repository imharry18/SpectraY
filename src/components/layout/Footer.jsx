import Link from 'next/link';
import { Camera, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        
        {/* Top Section: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Camera className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold text-white tracking-widest">SPECTRAY</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              The professional standard for web-based image processing. 
              Mathematically precise editing for engineers and creators.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Twitter size={18} /></Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Github size={18} /></Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Linkedin size={18} /></Link>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Image Editor</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Batch Processing</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Spectra AI</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">GitHub Repo</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} SpectraY Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span>Systems Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}