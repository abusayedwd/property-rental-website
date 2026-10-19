"use client";

import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";

export default function FaQpage() {
  const dataArr = [
    {
      title: "What is MyNextHome?",
      description:
        "MyNextHome is a platform that connects landlords with tenants and buyers, making it easy to rent, buy, or sell properties.",
    },
    {
      title: "What's the first step of the home buying process?",
      description:
        "Start by browsing listings and using the search filters to narrow down properties by location, type, and price. Once you find a place you like, you can message the landlord directly to ask questions or schedule a viewing.",
    },
    {
      title: "Is MyNextHome available in all locations?",
      description: "Yes, we support listings from multiple locations across the country.",
    },
    {
      title: "How do I find a property that matches my needs?",
      description:
        "Use our advanced search filters to find properties based on location, type, price, and more.",
    },
    {
      title: "Is it safe to use MyNextHome?",
      description:
        "Yes, our platform ensures a secure environment for both landlords and users to interact.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const handleToggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-primaryDark">FAQ</p>
        <h2 className="mt-2 text-3xl font-bold text-navy md:text-4xl">Questions & answers</h2>
      </div>

      <div className="mx-auto max-w-3xl space-y-3">
        {dataArr.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => handleToggle(idx)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold text-gray-800">{item.title}</span>
                <DownOutlined
                  className={`shrink-0 text-primary transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
