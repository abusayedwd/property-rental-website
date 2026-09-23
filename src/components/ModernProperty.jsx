import React from "react";
import Link from "next/link";

export default function ModernProperty() {
  return (
    <div className="container mt-12 flex min-h-screen w-full flex-col items-center md:flex-row">
      <div className="relative mb-8 w-full md:mb-0 md:w-1/2">
        <div className="relative w-full overflow-hidden rounded-lg">
          <div className="absolute bottom-0 left-0 top-0 w-2 bg-primary"></div>
          <img
            src="/images/premium.jpg"
            alt="Modern apartment balcony with city view"
            className="h-auto w-full rounded-lg shadow-md"
          />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary"></div>
        </div>
      </div>

      <div className="w-full md:w-1/2 md:pl-12">
        <h1 className="mb-6 text-4xl font-bold text-[#2FC639] md:text-5xl">
          Modern Spaces and Premium Design
        </h1>

        <p className="mb-8 text-gray-600">
          Every listing on MyNextHome is reviewed for quality — from natural light and
          layout to finish and location — so you spend less time filtering and more time
          finding a place that actually feels like home.
        </p>

        <ul className="mb-8 space-y-2">
          <li className="flex items-start text-gray-600">
            <span className="mr-2 text-primary">—</span>
            <span>Verified listings with real photos and accurate details</span>
          </li>
          <li className="flex items-start text-gray-600">
            <span className="mr-2 text-primary">—</span>
            <span>Direct messaging with landlords, no middlemen</span>
          </li>
          <li className="flex items-start text-gray-600">
            <span className="mr-2 text-primary">—</span>
            <span>Transparent pricing with no hidden fees</span>
          </li>
        </ul>

        <Link href="/property">
          <button
            type="button"
            className="rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primaryDark"
          >
            View More
          </button>
        </Link>
      </div>
    </div>
  );
}
