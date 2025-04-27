"use client"

import React, { useEffect, useState } from 'react';
import { Typography, Divider } from 'antd';
import Header from '../customComponent/Header';
import { useAbouteUsQuery } from '@/redux/fetures/information/aboutus';
import Image from 'next/image';
import VisionPage from './VisionPage';
import AnimatedStatsSection from './AnimatedStatsSection';

const FullAboute = () => {
  // You can uncomment this if you want to fetch about data from API
  // const { data: aboutData, isLoading } = useAbouteUsQuery();

  return (
    <div className=" min-h-screen mx-auto shadow-md rounded-lg">
      {/* Using Next.js Image component correctly */}
      <Image 
        src="/images/abouteus.png" 
        alt="About Us" 
        width={1000} 
        height={500}
        className="w-full rounded-lg"
      />
      
      {/* You can add more content below the image */}
          <VisionPage />
          <AnimatedStatsSection />
    </div>
  );
};

export default FullAboute;
