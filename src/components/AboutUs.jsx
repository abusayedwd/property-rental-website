"use client";
import Link from "next/link";
import React from "react";
import { HiArrowRight } from "react-icons/hi2";

const AboutUs = () => {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-12">
        <div className="md:order-2">
          <img
            src="/images/ab1.jpg"
            alt="Family home exterior"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"
          />
        </div>
        <div className="md:order-1">
          <p className="text-sm font-semibold uppercase tracking-wider text-primaryDark">About us</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-navy md:text-4xl">Connecting landlords with tenants and buyers</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
            MyNextHome makes renting, buying and selling property simpler. Landlords list their homes in minutes,
            and renters and buyers can explore a wide range of options and contact owners directly.
          </p>
          <Link href="/aboutus" className="mt-6 inline-flex items-center gap-2 font-semibold text-primaryDark hover:underline">
            Learn more about us <HiArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
