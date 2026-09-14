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

const Home = () => {
  const [activeDivision, setActiveDivision] = useState("Semua");
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [showAspirasi, setShowAspirasi] = useState(false);

  return (
    <div className="overflow-hidden bg-ink text-cream">
      <HeroSection />
      <QuickActionsSection />
      <AboutSection />
      <LeadershipSection />
      <ProgramsSection
        activeDivision={activeDivision}
        onDivisionChange={setActiveDivision}
        showAll={showAllPrograms}
        onToggleShowAll={() => setShowAllPrograms((current) => !current)}
      />
      <SponsorBanner />
      <BlogSection />
      <AspirationsSection onOpen={() => setShowAspirasi(true)} />
      <FooterSection />
      {showAspirasi && <AspirasiModal onClose={() => setShowAspirasi(false)} />}
    </div>
  );
};

export default Home;
