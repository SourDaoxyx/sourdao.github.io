import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Manifesto from "@/components/Manifesto";
import Protocol from "@/components/Protocol";
import Value from "@/components/Value";
import LiveFeed from "@/components/LiveFeed";
import Roadmap from "@/components/Roadmap";
import WhitepaperCTA from "@/components/WhitepaperCTA";
import Community from "@/components/Community";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";
import Navbar from "@/components/Navbar";
import MascotGuide from "@/components/MascotGuide";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden relative">
      <Navbar />
      <ParticleField />
      <Hero />
      <Problem />
      <Manifesto />
      <Protocol />
      <Value />
      <Roadmap />
      <LiveFeed />
      <WhitepaperCTA />
      <Community />
      <FAQ />
      <Footer />
      <MascotGuide />
    </main>
  );
}
