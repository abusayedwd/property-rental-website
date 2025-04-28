import React, { useState } from "react";
import { Button, Input } from "antd";

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
    console.log(formData); // You can send this data to your server or API.
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/images/appr.jpg')", // Replace with your image path
      }}
    >
      <div className="w-full pr-10 h-full bg-black/50 flex justify-end items-center">
        <div className="w-[80%] max-w-4xl bg-[#EDEEDC] opacity-60 rounded-lg p-8">
          <h2 className="text-4xl text-center font-bold mb-4">
            Discover a new way of living
          </h2>
          <p className="text-center text-lg mb-8">
            Save your time and easily rent or sell your property with the lowest commission on the real estate market.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Your name*"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-4 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Your email*"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-4 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <Input
                type="tel"
                name="phone"
                placeholder="Your phone number*"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-4 border-2 border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-center">
            <button type="button" className="group relative h-14 w-full overflow-hidden border-2 border-sky-400 text-xl text-sky-400 hover:text-sky-200">
            <span className="bg-sky-800  ease-in absolute w-[57%]  -translate-x-full group-hover:translate-x-0 -left-2 top-0 bottom-0 duration-300 -z-10 skew-x-12"></span>
            <span className="bg-sky-600 ease-in absolute w-[55%]  translate-x-full group-hover:translate-x-0 -right-2 top-0 bottom-0 duration-300 skew-x-12 -z-10"></span>
          View more
          </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPage;
