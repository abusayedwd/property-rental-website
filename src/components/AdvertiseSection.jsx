"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Modal } from "antd";
import { HiOutlineSparkles, HiOutlineMegaphone, HiOutlineCheckCircle, HiOutlineEnvelope } from "react-icons/hi2";
import { useGetContactQuery } from "@/redux/fetures/information/contact";
import { useGetPromotionPlansQuery } from "@/redux/fetures/payment/payment";

// Two ways to get seen: Featured listings for owners (self-serve, paid online)
// and home-page banners for businesses (arranged by email).
const AdvertiseSection = () => {
  const [bannerOpen, setBannerOpen] = useState(false);
  const { data: contact } = useGetContactQuery();
  const email = contact?.data?.attributes?.[0]?.email || "";
  const { data: plansData } = useGetPromotionPlansQuery();
  const plans = plansData?.data?.attributes?.plans || [];
  const provider = plansData?.data?.attributes?.provider;
  const cheapest = plans.length ? Math.min(...plans.map((p) => p.price)) : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="rounded-3xl bg-navy p-6 shadow-xl md:p-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Get more replies</p>
        <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">Put your property or business in front of home seekers</h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {/* Featured listings */}
          <div className="flex flex-col rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-amber-950">
              <HiOutlineSparkles size={22} />
            </span>
            <h3 className="mt-4 text-xl font-semibold text-white">Featured listing</h3>
            <p className="mt-1 text-white/70">Your listing shows first in search and on the home page, with a Featured badge.</p>
            {plans.length > 0 && (
              <ul className="mt-4 space-y-2">
                {plans.map((plan) => (
                  <li key={plan.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm text-white">
                    <span>{plan.days} days</span>
                    <span className="font-semibold">৳{plan.price.toLocaleString("en-IN")}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex-1" />
            <Link
              href="/myproperty"
              className="mt-5 flex h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-white transition-colors hover:bg-primaryDark"
            >
              {cheapest ? `Promote from ৳${cheapest.toLocaleString("en-IN")}` : "Promote a listing"}
            </Link>
            <p className="mt-2 text-center text-xs text-white/50">
              {provider === "sslcommerz" ? "Pay with bKash, Nagad, Rocket or card" : "Pay securely by card"}
            </p>
          </div>

          {/* Banner ads */}
          <div className="flex flex-col rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
              <HiOutlineMegaphone size={22} />
            </span>
            <h3 className="mt-4 text-xl font-semibold text-white">Home page banner</h3>
            <p className="mt-1 text-white/70">For developers, agencies, interior designers, movers and other home businesses.</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {["Banner on the home page for 30 days", "Links to your website or Facebook page", "Reaches people actively looking for a home"].map((x) => (
                <li key={x} className="flex gap-2">
                  <HiOutlineCheckCircle size={18} className="shrink-0 text-primary" /> {x}
                </li>
              ))}
            </ul>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setBannerOpen(true)}
              className="mt-5 flex h-12 items-center justify-center rounded-full border border-white/25 px-6 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Banner details
            </button>
          </div>
        </div>
      </div>

      <Modal title="Advertise with a home page banner" open={bannerOpen} onCancel={() => setBannerOpen(false)} footer={null} centered width={560}>
        <div className="space-y-4 text-gray-600">
          <div>
            <h3 className="font-semibold text-navy">What you get</h3>
            <ul className="ml-5 mt-1 list-disc space-y-1">
              <li>Banner size: 1200 × 400 pixels (JPG or PNG, under 300 KB)</li>
              <li>Placement: home page slider, seen by every visitor</li>
              <li>Duration: 30 days, with a link to your site</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-navy">How it works</h3>
            <ol className="ml-5 mt-1 list-decimal space-y-1">
              <li>Email us your banner and the dates you want.</li>
              <li>We confirm the price and availability within one working day.</li>
              <li>Your banner goes live after payment.</li>
            </ol>
          </div>
          <p className="text-sm">Banners must be honest and suitable for a family audience. We may decline any ad.</p>
          {email && (
            <a
              href={`mailto:${email}?subject=${encodeURIComponent("Home page banner")}`}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white hover:bg-primaryDark"
            >
              <HiOutlineEnvelope size={18} /> Email {email}
            </a>
          )}
        </div>
      </Modal>
    </section>
  );
};

export default AdvertiseSection;
