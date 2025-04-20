"use client";

import React from "react";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";
import Header from "./customComponent/Header";
import { useGetContactQuery } from "@/redux/fetures/information/contact";

const ContactUs = () => {

  const {data: contact} = useGetContactQuery();
  console.log(contact?.data?.attributes[0])
  const userContact = contact?.data?.attributes[0]
  
  return (
    <div className="md:py-12 container">
      {/* Page Title */}
      <div className="text-center mb-12">
        <p className="text-blue-500 text-[40px] font-[Montserrat] font-semibold">For any help</p>
        
        <Header size="extraLarge" className="text-[#2FC639] mt-5"> Contact With Us </Header>
           
      </div>

      {/* Content Section */}
      <div className="  grid grid-cols-1 lg:grid-cols-2 items-center gap-12 md:mt-24">
        {/* Left Section: Image */}
        <div className="relative flex justify-center">
        <img
              src="/images/davispAb.jpg"
              alt="House Exterior"
              className="  mk:relative bottom-6 object-cover md:h-[400px] md:w-[80%] rounded-lg shadow-md"
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
          <div className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-full">
              <PhoneOutlined className="text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Call Us</h3>
              <p className="">{userContact?.phone}</p>
            </div>
          </div>

          {/* Email Now */}
          <div className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-full">
              <MailOutlined className="text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold  ">Email Now</h3>
              <p className=" ">{userContact?.email}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-full">
              <EnvironmentOutlined className="text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold  ">Address</h3>
              <p className=" ">
                {userContact?.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
