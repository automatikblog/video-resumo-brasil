
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ToolSection from '@/components/ToolSection';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import UseCases from '@/components/UseCases';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <HeroSection />
        <ToolSection />
        <HowItWorks />
        <Features />
        <UseCases />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
