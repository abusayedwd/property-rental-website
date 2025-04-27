"use client"

import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src="/images/appr.jpg" 
          alt="Couple with coffee and laptop moving into new home" 
          fill
          className="object-cover"
          priority
        />
        {/* Semi-transparent overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Text Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Premium Houses<br/>and Apartments
            </h1>
            <p className="text-white text-lg md:text-xl opacity-90">
              * Save your time and easily rent or sell your property
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;