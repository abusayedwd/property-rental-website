import React from "react";
import Link from "next/link";
import { HiOutlineCheckCircle, HiArrowRight } from "react-icons/hi2";

const points = [
  "Real photos and full details on every listing",
  "Message landlords directly, no middlemen",
  "Prices shown up front in Taka",
];

export default function ModernProperty() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:gap-12 md:py-24">
      <div className="relative">
        <img
          src="/images/premium.jpg"
          alt="Modern apartment balcony with city view"
          loading="lazy"
          className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"
        />
        <div className="absolute -bottom-3 -left-3 -z-10 h-full w-full rounded-2xl bg-secondary md:-bottom-5 md:-left-5" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primaryDark">Why people choose us</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight text-navy md:text-4xl lg:text-5xl">Modern spaces, simple search</h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
          Spend less time filtering and more time finding a place that actually feels like home, whether it&apos;s a
          compact studio or a family duplex.
        </p>
        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-gray-700">
              <HiOutlineCheckCircle size={22} className="mt-0.5 shrink-0 text-primary" />
              {point}
            </li>
          ))}
        </ul>
        <Link
          href="/property"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primaryDark"
        >
          Browse properties <HiArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
