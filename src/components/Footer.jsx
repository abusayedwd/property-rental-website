"use client";

import React from "react";

const Footer = () => {
  return (
    <footer
      className="bg-cover bg-center text-white py-12 px-4 md:px-8"
      style={{
        backgroundImage: "url('/images/bg.png')", // Replace with your background image
      }}
    >
      <div className=" container grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Logo and About Info */}
        <div>
            <div className="my-4">

        <img src="/images/logo.png" alt="" /> 
            </div>
          <p className="text-sm leading-relaxed">
            Welcome to Your Next Home, a platform designed to make finding or
            listing properties simple and hassle-free. We connect landlords with
            tenants and buyers, offering a seamless experience for browsing or
            showcasing properties.
          </p>
          <p className="text-sm mt-4">
            Whether you’re searching for your dream home or looking to rent or
            sell a property, Your Next Home is your trusted partner in making it
            happen. Discover your next space with us today!
          </p>
        </div>

        {/* Column 2: Explore Links */}
        <div className="md:ml-20">
          <h3 className="text-lg font-semibold text-green-400 mb-4">Explore</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about-us"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/contact-us"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Utility Links */}
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Utility Pages
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/privacy-policy"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms-of-use"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Terms of Use
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Get In Touch
          </h3>
          <ul className="space-y-2">
            <li>
              <p className="text-sm text-gray-300">paerdu@gmail.com</p>
            </li>
            <li>
              <p className="text-sm text-gray-300">(009) 555 678 90</p>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
