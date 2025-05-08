
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/about/HeroSection";
import TabNavigation from "@/components/about/TabNavigation";
import Overview from "@/components/about/Overview";
import TokenomicsSection from "@/components/about/tokenomics/TokenomicsSection";
import FAQSection from "@/components/about/faq/FAQSection";
import CTASection from "@/components/about/CTASection";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tokenomics' | 'faq'>('overview');
  
  return (
    <MainLayout>
      <HeroSection />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'overview' && <Overview />}
      {activeTab === 'tokenomics' && <TokenomicsSection />}
      {activeTab === 'faq' && <FAQSection />}
      
      <CTASection />
    </MainLayout>
  );
};

export default AboutPage;
