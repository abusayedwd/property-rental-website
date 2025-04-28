 

"use client";
import AboutUs from "@/components/AboutUs";
import AddPhoto from "@/components/AddPhoto";
import AdvertiseSection from "@/components/AdvertiseSection";
import AllProperty from "@/components/AllProperty";
import Banner from "@/components/Benner";
import ContactUs from "@/components/ContactUs";
import EnquiryPage from "@/components/Enquery";
import FaQpage from "@/components/FaQpage";
import HowItWorks from "@/components/HowItWorks";
import AnimatedStatsSection from "@/components/information/AnimatedStatsSection";
import HeroSection from "@/components/information/Heroab";
import TestimonialsSection from "@/components/information/Testomonials";
import ModernProperty from "@/components/ModernProperty";
import PopularRent from "@/components/PopularRent";
import PopularSell from "@/components/PopularSell";
import Head from "next/head";
import React, { useState } from "react";
 

export default function Home() {
  const [searchCriteria, setSearchCriteria] = useState(null);

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
  };

  return (
    <div>
   
      {/* Banner Component */}
      <Banner onSearch={handleSearch} />

      {/* Conditionally render AllProperty if searchCriteria exists */}
      {searchCriteria && <AllProperty searchCriteria={searchCriteria} />}

      {/* Hide other components when searchCriteria exists */}
      {!searchCriteria && (
        <>
          <AddPhoto />
          <PopularSell />
          <PopularRent />
          <ModernProperty />
          <AboutUs />
          <AnimatedStatsSection />
          <EnquiryPage />
          <HowItWorks />
          <FaQpage />
          <AdvertiseSection />
          <HeroSection />
    
          <ContactUs />
          <TestimonialsSection />
        </>
      )}
    </div>
  );
}