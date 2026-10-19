import React from "react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

// Call-to-action band (previously a form that didn't send anywhere)
const EnquiryPage = () => {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <img src="/images/appr.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#171F3D]/95 via-[#171F3D]/85 to-[#059347]/70" />
        <div className="relative flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between md:p-14">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">Discover a new way of living</h2>
            <p className="mt-3 text-base text-white/80 md:text-lg">
              Find your next home in minutes, or list your property for free and reach people looking right now.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:shrink-0 lg:flex-row">
            <Link
              href="/property"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-colors hover:bg-primaryDark"
            >
              Browse homes <HiArrowRight size={18} />
            </Link>
            <Link
              href="/auth/singup"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              List your property
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryPage;
