import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Reviews from '../components/Reviews';
import PricingSection from '../components/PricingSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-darker w-full selection:bg-white selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Reviews />
        <PricingSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
