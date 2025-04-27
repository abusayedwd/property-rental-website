 

"use client";

import React from "react";
import { Collapse } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Header from "./customComponent/Header";

const { Panel } = Collapse;

const FaQpage = () => {
  const faqItems = [
    {
      question: "What is Your Next Home?",
      answer: "Your Next Home is a platform that connects landlords with tenants and buyers, making it easy to rent, buy, or sell properties. Your Next Home is a platform that connects landlords with tenants and buyers, making it easy to rent, buy, or sell properties.",
    },
    {
      question: "How does Your Next Home work?",
      answer: "Landlords can list their properties, and users can search for properties based on their preferences.",
    },
    {
      question: "Is Your Next Home available in all locations?",
      answer: "Yes, we support listings from multiple locations across the country.",
    },
    {
      question: "How do I find a property that matches my needs?",
      answer: "Use our advanced search filters to find properties based on location, type, price, and more.",
    },
    {
      question: "Is it safe to use Your Next Home?",
      answer: "Yes, our platform ensures a secure environment for both landlords and users to interact.",
    },
  ];

  return (
    <div className="container py-12 px-4">
      {/* Page Title */}
      <div className="text-center mb-12">
        <p className="text-[40px] font-[Montserrat] font-semibold dark:text-gray-300 text-gray-700">
          Questions & Answers
        </p>
        <Header size="extraLarge" className="text-[#2FC639] mt-5">
          FAQ
        </Header>
      </div>

      {/* FAQ List */}
      <div className="space-y-4 md:py-10">
        <Collapse
          accordion
          className="bg-transparent"
          expandIcon={({ isActive }) => (
            <PlusOutlined
              className={`text-white transition-transform duration-2000 ${
                isActive ? "rotate-45" : ""
              }`}
            />
          )}
          expandIconPosition="end"
        >
          {faqItems.map((item, index) => (
            <Panel
              header={
                <span className="text-white">
                  {item.question}
                </span>
              }
              key={index}
              className="rounded-lg text-xl shadow-md py-6 font-medium bg-gray-800"
            >
              <p className="text-[16px] text-black text-gray-600">
                {item.answer}
              </p>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default FaQpage;

 