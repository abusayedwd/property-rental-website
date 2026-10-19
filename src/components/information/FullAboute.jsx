"use client";
import React from "react";
import Link from "next/link";
import {
  HiChevronRight,
  HiOutlineMagnifyingGlass,
  HiOutlineChatBubbleLeftRight,
  HiOutlineHeart,
  HiOutlineMapPin,
  HiOutlineBolt,
  HiOutlineDevicePhoneMobile,
  HiOutlineEye,
  HiOutlineFlag,
  HiOutlineCheckCircle,
  HiOutlineKey,
  HiArrowRight,
} from "react-icons/hi2";
import AnimatedStatsSection from "./AnimatedStatsSection";

const features = [
  { icon: HiOutlineMapPin, title: "All 64 districts", text: "Search by district and area, from Gulshan and Dhanmondi to every upazila in the country." },
  { icon: HiOutlineChatBubbleLeftRight, title: "Talk to owners directly", text: "Message landlords from the listing page. No middlemen and no hidden brokerage fees from us." },
  { icon: HiOutlineMagnifyingGlass, title: "Filters that matter", text: "Narrow down by price in Taka, bedrooms, property type and rent or sale in seconds." },
  { icon: HiOutlineHeart, title: "Save your favourites", text: "Keep a shortlist of homes you like and come back to compare them any time." },
  { icon: HiOutlineBolt, title: "Featured listings", text: "Owners can promote a property so it appears first in search results." },
  { icon: HiOutlineDevicePhoneMobile, title: "Works on any device", text: "Browse, chat and manage listings from your phone, tablet or computer." },
];

const steps = [
  { title: "Search", text: "Pick a district and area, set your budget, and browse homes for rent or sale." },
  { title: "Connect", text: "Save the ones you like and message the owner to ask questions or book a visit." },
  { title: "Move in", text: "Agree the details with the owner and get the keys to your new home." },
];

const SectionHeading = ({ eyebrow, title, text, center }) => (
  <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
    <p className="text-sm font-semibold uppercase tracking-wider text-primaryDark">{eyebrow}</p>
    <h2 className="mt-2 text-3xl font-bold text-navy md:text-4xl">{title}</h2>
    {text && <p className="mt-4 text-lg leading-relaxed text-gray-500">{text}</p>}
  </div>
);

const FullAboute = () => {
  return (
    <div className="bg-white">
      {/* Banner */}
      <section className="relative overflow-hidden">
        <img src="/images/bck1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#171F3D]/95 via-[#222F55]/85 to-[#222F55]/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:py-32">
          <nav className="flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <HiChevronRight size={14} />
            <span className="text-primary">About us</span>
          </nav>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Helping Bangladesh find a place to call <span className="text-primary">home</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            MyNextHome connects people looking for a home with the landlords and owners who have one, in every district of the country.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/property"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-colors hover:bg-primaryDark"
            >
              Browse properties <HiArrowRight size={18} />
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <img src="/images/vision.jpg" alt="Our team at work" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl" />
          <div className="absolute -bottom-6 right-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl md:-right-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primaryDark">
              <HiOutlineKey size={22} />
            </span>
            <div>
              <p className="font-semibold text-navy">Rent or buy</p>
              <p className="text-sm text-gray-500">One place for both</p>
            </div>
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="Who we are"
            title="A simpler way to rent, buy and list property"
            text="Finding a home in Bangladesh often means endless phone calls, word of mouth and brokers. We built MyNextHome to put real listings, clear prices and direct contact with owners in one place."
          />
          <ul className="mt-6 space-y-3">
            {[
              "Listings for flats, duplexes, studios, plots and more",
              "Prices shown up front in Taka",
              "Owners manage their own listings and answer you directly",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <HiOutlineCheckCircle size={22} className="mt-0.5 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AnimatedStatsSection />

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading center eyebrow="What drives us" title="Our mission and vision" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                icon: HiOutlineFlag,
                title: "Our mission",
                text: "To make finding and listing a home fast, transparent and fair, so renters and buyers can decide with confidence and owners can reach the right people without hassle.",
              },
              {
                icon: HiOutlineEye,
                title: "Our vision",
                text: "A Bangladesh where anyone, in any district, can find a home that fits their life and budget with a few taps, and where every owner can list a property in minutes.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primaryDark">
                  <Icon size={28} />
                </span>
                <h3 className="mt-6 text-2xl font-bold text-navy">{title}</h3>
                <p className="mt-3 leading-relaxed text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading center eyebrow="Why MyNextHome" title="Everything you need to find the right home" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="group rounded-2xl border border-gray-100 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primaryDark transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon size={24} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading center eyebrow="How it works" title="From search to keys in three steps" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+40px)] top-8 hidden h-px w-[calc(100%-80px)] border-t-2 border-dashed border-primary/30 md:block" />
                )}
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white shadow-lg shadow-primary/30">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-navy">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-gray-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl">
          <img src="/images/appr.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171F3D]/95 to-[#059347]/80" />
          <div className="relative flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-14">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-white md:text-4xl">Have a property to rent or sell?</h2>
              <p className="mt-3 text-lg text-white/80">Create a free landlord account and publish your listing in a few minutes.</p>
            </div>
            <Link
              href="/auth/singup"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-navy shadow-lg transition-colors hover:bg-secondary"
            >
              List your property <HiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FullAboute;
