import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Tracks } from "@/components/home/Tracks";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Prizes } from "@/components/home/Prizes";
import { Schedule } from "@/components/home/Schedule";
import { FAQ } from "@/components/home/FAQ";
import { SpecialRegistrationTerminal } from "@/components/registration/SpecialRegistrationTerminal";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-slate-200 selection:text-slate-950">
      <Navbar />
      <Hero />
      <Tracks />
      <HowItWorks />
      <Prizes />
      <Schedule />
      <FAQ />
      <SpecialRegistrationTerminal />
      <Footer />
    </main>
  );
}
