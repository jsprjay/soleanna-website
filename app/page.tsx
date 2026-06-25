import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TrackTuesdays from "@/components/TrackTuesdays";
import Gallery from "@/components/Gallery";
import Schedule from "@/components/Schedule";
import ShopCTA from "@/components/ShopCTA";
import Footer from "@/components/Footer";

// The hero ticket and schedule read live from the database each request,
// so the page always reflects the latest edits.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <TrackTuesdays />
        <Gallery />
        <Schedule />
        <ShopCTA />
      </main>
      <Footer />
    </>
  );
}
