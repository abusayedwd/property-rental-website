"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGetTotalStatusQuery } from "@/redux/fetures/payment/totalStatus";

const useCountUp = (target, shouldStart, duration = 1500) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    const startTime = Date.now();

    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      setValue(Math.floor(target * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [shouldStart, target, duration]);

  return value;
};

const StatCard = ({ value, label, formatter = (v) => v }) => (
  <div className="w-full text-center md:w-1/3">
    <h2 className="text-4xl font-bold text-white md:text-5xl">{formatter(value)}</h2>
    <p className="mt-2 text-primary/90">{label}</p>
  </div>
);

const AnimatedStatsSection = () => {
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { data } = useGetTotalStatusQuery();
  const stats = data?.data?.attributes;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) setHasAnimated(true);
        });
      },
      { threshold: 0.1 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, [hasAnimated]);

  const users = useCountUp(stats?.users || 0, hasAnimated && !!stats);
  const landlords = useCountUp(stats?.landLord || 0, hasAnimated && !!stats);
  const totalAmount = useCountUp(stats?.totalAmount || 0, hasAnimated && !!stats);

  return (
    <div className="w-full bg-navy py-20" ref={statsRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-start justify-between gap-y-8 text-center">
          <StatCard value={users} label="Registered Renters & Buyers" />
          <StatCard value={landlords} label="Verified Landlords" />
          <StatCard
            value={totalAmount}
            label="In Property Transactions"
            formatter={(v) => `$${v.toLocaleString()}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedStatsSection;
