import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TrackTuesdays from "@/components/TrackTuesdays";
import Schedule from "@/components/Schedule";
import ShopCTA from "@/components/ShopCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <TrackTuesdays />
        <Schedule />
        <ShopCTA />
      </main>
      <Footer />
    </>
  );
}
