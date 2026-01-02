import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
}