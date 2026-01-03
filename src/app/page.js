'use client';
import { ReactLenis } from '@studio-freight/react-lenis';
import Navbar from '@/components/layout/Navbar';
import LandingSections from '@/components/landing/LandingSections';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <ReactLenis root>
      <main className="bg-black min-h-screen">
        <Navbar />
        <LandingSections />
        <Footer />
      </main>
    </ReactLenis>
  );
}