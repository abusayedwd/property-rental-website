"use client"
import React, { useEffect } from 'react';
import { Home, Users, FileText, Key } from 'lucide-react';
import AOS from "aos";
import 'aos/dist/aos.css';

export default function HowItWorks() {
    useEffect(() => {
        AOS.init({
          duration: 1000,  // Animation duration
          easing: 'ease-in-out',  // Easing function
        });
      }, []);

  const steps = [
    {
      title: "Find real estate",
      description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est ei graeco quod suavitate vix.",
      icon: <Home className="w-12 h-12 text-gray-800" />
    },
    {
      title: "Meet relator",
      description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est ei graeco quod suavitate vix.",
      icon: <Users className="w-12 h-12 text-gray-800" />
    },
    {
      title: "Documents",
      description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est ei graeco quod suavitate vix.",
      icon: <FileText className="w-12 h-12 text-gray-800" />
    },
    {
      title: "Take the keys",
      description: "Sumo petentium ut per, at his wisim utinam adipiscing. Est ei graeco quod suavitate vix.",
      icon: <Key className="w-12 h-12 text-gray-800" />
    }
  ];

  return (
    <div className="container mx-auto py-12">
      <div className=" mb-16">
        <h2 className="text-4xl font-bold text-[#2FC639] mb-4">How It works?</h2>
        <h3 className="text-4xl font-bold text-gray-500">Find a perfect home</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-aos="zoom-out-right">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 border-r border-gray-200 last:border-r-0">
            <div className="mb-4">
              {step.icon}
            </div>
            <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
            <p className="text-gray-400 text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}