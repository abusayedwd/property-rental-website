import React, { useState } from "react";
import { Input } from "antd";

const EnquiryPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div
      className="w-full bg-cover bg-center bg-fixed py-20"
      style={{ backgroundImage: "url('/images/appr.jpg')" }}
    >
      <div className="flex w-full items-center justify-center bg-navy/70 px-4 py-16">
        <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl sm:p-10">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-800 sm:text-4xl">
            Discover a New Way of Living
          </h2>
          <p className="mb-8 text-center text-gray-500">
            Save your time and easily rent or sell your property with the lowest
            commission on the real estate market.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Your name*"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="!h-12 !rounded-lg !border-gray-300"
            />
            <Input
              type="email"
              name="email"
              placeholder="Your email*"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="!h-12 !rounded-lg !border-gray-300"
            />
            <Input
              type="tel"
              name="phone"
              placeholder="Your phone number*"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="!h-12 !rounded-lg !border-gray-300"
            />

            <button
              type="submit"
              className="!h-12 w-full rounded-lg bg-primary font-semibold text-white transition-colors hover:bg-primaryDark"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPage;
