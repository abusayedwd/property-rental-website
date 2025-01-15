"use client";

import React from "react";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";
import Header from "./customComponent/Header";

const ContactUs = () => {
  return (
    <div className="bg-white md:py-12 container">
      {/* Page Title */}
      <div className="text-center mb-12">
        <p className="text-blue-500 text-[40px] font-[Montserrat] font-semibold">For any help</p>
        
        <Header size="extraLarge" className="text-green-700 mt-5"> Contact With Us </Header>
           
      </div>

      {/* Content Section */}
      <div className="  grid grid-cols-1 lg:grid-cols-2 items-center gap-12 md:mt-24">
        {/* Left Section: Image */}
        <div className="relative flex justify-center">
        <img
              src="/images/contact.png"
              alt="House Exterior"
              className="  mk:relative bottom-6 object-cover rounded-lg shadow-md"
            /> 
          {/* Decorative Background (Buildings) */}
          <div
            className=" "
            aria-hidden="true"
          >
           
          </div>
        </div>

        {/* Right Section: Contact Details */}
        <div className="space-y-6">
          {/* Call Us */}
          <div className="flex items-center bg-green-50 p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-full">
              <PhoneOutlined className="text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Call Us</h3>
              <p className="text-gray-600">+(08) 255 201 888</p>
            </div>
          </div>

          {/* Email Now */}
          <div className="flex items-center bg-green-50 p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-full">
              <MailOutlined className="text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Email Now</h3>
              <p className="text-gray-600">hello@procleaning.com</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center bg-green-50 p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-full">
              <EnvironmentOutlined className="text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Address</h3>
              <p className="text-gray-600">
                7510, Brand Tower, New York, USA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
