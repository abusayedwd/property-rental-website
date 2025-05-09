"use client";

import Link from "next/link";
import React from "react";

const AboutUs = () => {
  return (
    <div className=" w-[95%] mx-auto md:w-full mt-12 pb-12">
      <div className=" container grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        {/* Left Section: Text Content */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2FC639] mb-4">
            About Us
          </h1>
          <p className="text-gray-400 md:text-lg leading-relaxed">
            Welcome to <span className="font-semibold">Your Next Home</span>, 
            the ultimate platform for connecting landlords with tenants and buyers. 
            We simplify the process of renting, buying, and selling properties by offering 
            a user-friendly space where landlords can post their listings, and users can 
            explore a wide range of options with ease.{" "}
            <Link href="/aboutus" className="text-green-600 font-medium hover:underline">
              See More...
            </Link>
          </p>
        </div>

        {/* Right Section: Images */}
        <div className="relative flex justify-center items-center">
          {/* Decorative Dots */}
          {/* <div className="absolute top-0 left-0 w-12 h-12 bg-[url('/images/dots.svg')] bg-contain bg-no-repeat"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-[url('/images/dots.svg')] bg-contain bg-no-repeat"></div> */}

          {/* Images */}
          <div className=" gap-4">
            <img
              src="/images/ab1.jpg"
              alt="House Exterior"
              className="w-full md:h-[480px] h-[280px] object-cover rounded-lg shadow-md"
            />
            {/* <img
             src="/images/ab2.jpg"
              alt="Family in Living Room"
              className="w-[280px] md:w-[480px] h-[280px] md:h-[380px] object-container md:absolute top-20 left-36 rounded-lg shadow-md"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
