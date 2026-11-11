import { useState } from "react";
import AboutSection from "../sect/home/AboutSection";
import AspirasiModal from "../sect/home/AspirasiModal";
import AspirationsSection from "../sect/home/AspirationsSection";
import BlogSection from "../sect/home/BlogSection";
import FooterSection from "../sect/home/FooterSection";
import HeroSection from "../sect/home/HeroSection";
import LeadershipSection from "../sect/home/LeadershipSection";
import ProgramsSection from "../sect/home/ProgramsSection";
import QuickActionsSection from "../sect/home/QuickActionsSection";
import SponsorBanner from "../sect/home/SponsorBanner";
import { submitAspiration } from "../lib/homeDataApi";
import { useHomeData } from "../hooks/useHomeData";

const Home = () => {
  const { data, loading, error } = useHomeData();
  const [activeDivision, setActiveDivision] = useState("Semua");
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [showAspirasi, setShowAspirasi] = useState(false);

  if (loading || !data) {
    return <div className="grid min-h-screen place-items-center bg-ink text-cream">Memuat data...</div>;
  }

  return (
    <div className="overflow-hidden bg-ink text-cream">
      {error && (
        <div className="bg-orange px-6 py-2 text-center font-outfit text-xs text-ink">
          Data Supabase belum dapat dimuat. Menampilkan data cadangan.
        </div>
      )}
      <HeroSection />
      <QuickActionsSection />
      <AboutSection />
      <LeadershipSection leaders={data.leaders} />
      <ProgramsSection
        divisions={data.divisions}
        programs={data.programs}
        activeDivision={activeDivision}
        onDivisionChange={setActiveDivision}
        showAll={showAllPrograms}
        onToggleShowAll={() => setShowAllPrograms((current) => !current)}
      />
      <SponsorBanner sponsors={data.sponsors} />
      <BlogSection articles={data.articles} />
      <AspirationsSection onOpen={() => setShowAspirasi(true)} />
      <FooterSection />
      {showAspirasi && (
        <AspirasiModal
          onClose={() => setShowAspirasi(false)}
          onSubmit={submitAspiration}
        />
      )}
    </div>
  );
};

export default Home;
