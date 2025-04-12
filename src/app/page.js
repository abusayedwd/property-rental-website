 

"use client";
import AboutUs from "@/components/AboutUs";
import AddPhoto from "@/components/AddPhoto";
import AdvertiseSection from "@/components/AdvertiseSection";
import AllProperty from "@/components/AllProperty";
import Banner from "@/components/Benner";
import ContactUs from "@/components/ContactUs";
import FaQpage from "@/components/FaQpage";
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
          <AdvertiseSection />
          <AddPhoto />
          <PopularSell />
          <PopularRent />
          <AboutUs />
          <FaQpage />
          <ContactUs />
        </>
      )}
    </div>
  );
}