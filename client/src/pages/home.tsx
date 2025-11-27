import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ValuePropositionGrid from "@/components/ValuePropositionGrid";
import NewsletterPreview from "@/components/NewsletterPreview";
import SocialProof from "@/components/SocialProof";
import StatisticsBar from "@/components/StatisticsBar";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ValuePropositionGrid />
        <NewsletterPreview />
        <SocialProof />
        <StatisticsBar />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
