"use client";
import React, { useState, useEffect, useRef } from "react";
import { HiOutlineHomeModern, HiOutlineKey, HiOutlineUsers, HiOutlineMapPin } from "react-icons/hi2";
import { useGetPublicStatsQuery } from "@/redux/fetures/property/publicStats";

const useCountUp = (target, shouldStart, duration = 1500) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    const startTime = Date.now();
    let frame;
    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      setValue(Math.floor(target * (1 - Math.pow(1 - progress, 3)))); // ease-out
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [shouldStart, target, duration]);
  return value;
};

const StatCard = ({ icon: Icon, value, label }) => (
  <div className="flex flex-col items-center px-4 text-center">
    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-primary">
      <Icon size={24} />
    </span>
    <p className="text-4xl font-bold text-white md:text-5xl">{value.toLocaleString()}</p>
    <p className="mt-2 text-sm text-white/70">{label}</p>
  </div>
);

// Public platform numbers (no earnings) with a count-up when scrolled into view
const AnimatedStatsSection = () => {
  const statsRef = useRef(null);
  const [inView, setInView] = useState(false);
  const { data } = useGetPublicStatsQuery();
  const stats = data?.data?.attributes;

  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setInView(true), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const start = inView && !!stats;
  const listings = useCountUp(stats?.activeListings || 0, start);
  const landlords = useCountUp(stats?.landlords || 0, start);
  const members = useCountUp(stats?.members || 0, start);
  const districts = useCountUp(stats?.districts || 0, start);

  return (
    <section ref={statsRef} className="relative overflow-hidden bg-navy py-16 md:py-20">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 md:grid-cols-4">
        <StatCard icon={HiOutlineHomeModern} value={listings} label="Homes listed now" />
        <StatCard icon={HiOutlineKey} value={landlords} label="Landlords & owners" />
        <StatCard icon={HiOutlineUsers} value={members} label="Renters & buyers" />
        <StatCard icon={HiOutlineMapPin} value={districts} label="Districts covered" />
      </div>
    </section>
  );
};

export default AnimatedStatsSection;
