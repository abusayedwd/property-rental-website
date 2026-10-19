"use client";
import React from "react";
import { Home, Users, FileText, Key } from "lucide-react";

const steps = [
  { title: "Find a home", description: "Search listings by location, price and property type to find homes that match what you need.", Icon: Home },
  { title: "Meet the landlord", description: "Message landlords directly through the platform to ask questions and arrange a viewing.", Icon: Users },
  { title: "Agree the terms", description: "Go through the rent or sale terms with the owner and agree the details.", Icon: FileText },
  { title: "Take the keys", description: "Settle the payment with the owner and move in. Your next home is ready.", Icon: Key },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primaryDark">How it works</p>
        <h2 className="mt-2 text-3xl font-bold text-navy md:text-4xl">Find a perfect home in four steps</h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ title, description, Icon }, index) => (
          <div key={title} className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
            <span className="absolute right-5 top-5 text-4xl font-bold text-gray-100">0{index + 1}</span>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primaryDark">
              <Icon className="h-7 w-7" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-navy">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
