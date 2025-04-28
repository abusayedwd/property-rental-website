"use client"

import React, { useState, useEffect, useRef } from 'react';

const AnimatedStatsSection = () => {
  // Reference to the stats container
  const statsRef = useRef(null);
  
  // State for each counter
  const [soldPrice, setSoldPrice] = useState(0);
  const [propertiesSold, setPropertiesSold] = useState(0);
  const [leasedPrice, setLeasedPrice] = useState(0);
  const [propertiesLeased, setPropertiesLeased] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  
  // Target values
  const targetSoldPrice = 940;
  const targetPropertiesSold = 24;
  const targetLeasedPrice = 680;
  const targetPropertiesLeased = 95;
  const targetTotalTransactions = 522;
  
  // Animation duration in milliseconds
  const animationDuration = 2000;
  
  // Track if animation has already run
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Create an Intersection Observer to detect when the stats section is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          // Start the animations when the section becomes visible
          setHasAnimated(true);
          animateCounters();
        }
      });
    }, {
      threshold: 0.1 // Trigger when at least 10% of the element is visible
    });
    
    // Start observing the stats container
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    // Clean up the observer
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);
  
  // Function to animate counters
  const animateCounters = () => {
    const startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Update counter values based on progress
      setSoldPrice(Math.floor(targetSoldPrice * progress));
      setPropertiesSold(Math.floor(targetPropertiesSold * progress));
      setLeasedPrice(Math.floor(targetLeasedPrice * progress));
      setPropertiesLeased(Math.floor(targetPropertiesLeased * progress));
      setTotalTransactions(Math.floor(targetTotalTransactions * progress));
      
      // Continue animation until complete
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };
  
  return (
    <div className="w-full py-24 bg-slate-900" ref={statsRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-start text-center">
          {/* Median Sold Price */}
          <div className="w-full md:w-1/5 mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-200">${soldPrice}k</h2>
            <p className="text-amber-200 mt-2">Median sold price</p>
          </div>
          
          {/* Properties Sold */}
          <div className="w-full md:w-1/5 mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-200">{propertiesSold}</h2>
            <p className="text-amber-200 mt-2">Properties sold</p>
          </div>
          
          {/* Median Leased Price */}
          <div className="w-full md:w-1/5 mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-200">${leasedPrice}k</h2>
            <p className="text-amber-200 mt-2">Median leased price</p>
          </div>
          
          {/* Properties Leased */}
          <div className="w-full md:w-1/5 mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-200">{propertiesLeased}</h2>
            <p className="text-amber-200 mt-2">Properties leased</p>
          </div>
          
          {/* Sales & Rental Transactions */}
          <div className="w-full md:w-1/5">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-200">${totalTransactions}k</h2>
            <p className="text-amber-200 mt-2">sales & rental transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedStatsSection;