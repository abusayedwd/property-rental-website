"use client";

import React from "react";
import { Button, Tag } from "antd";
import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
 
 

const DetailsPage = () => {
 

  // Mock property data (replace with actual API call or data)
  const property = {
    id: 1,
    image: "/images/home.png", // Ensure this image exists in your public/images directory
    status: "For sell",
    title: "Gorgeous House Building",
    address: "Block-C, Banani, Dhaka",
    price: "$7,500",
    type: "Home",
    beds: 4,
    baths: 2,
    sqft: 1150,
  };

  return (
    <div className="container mx-auto mt-8 pt-5 py-12">
      
      {/* Header */}
      <h1 className="text-center text-3xl font-bold text-green-600 mb-8">Details</h1>

      {/* Card Container */}
      <div className="max-w-3xl mx-auto border border-green-300 rounded-lg shadow-lg p-6 bg-white">
        {/* Status Tag */}
        <Tag
          color="red"
          className="absolute top-4 left-4 px-3 py-1 text-sm font-semibold uppercase"
        >
          {property.status}
        </Tag>

        {/* Property Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: Text Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{property.title}</h2>
            <p className="text-gray-500 flex items-center gap-2 mt-2">
              <EnvironmentOutlined className="text-green-500" />
              Place: {property.address}
            </p>
            <p className="text-green-600 text-xl font-bold mt-4">Price: {property.price}</p>
            <p className="text-gray-500 text-sm mt-1">Type: {property.type}</p>

            {/* Additional Details */}
            <div className="flex items-center gap-4 mt-4 text-gray-600">
              <div className="flex items-center gap-1">
                <AppstoreAddOutlined />
                Beds: {property.beds}
              </div>
              <div className="flex items-center gap-1">
                <AppstoreAddOutlined />
                Baths: {property.baths}
              </div>
              <div className="flex items-center gap-1">
                <AppstoreAddOutlined />
                sqft: {property.sqft}
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div>
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={() => router.back()}
            className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-2 rounded-lg"
          >
            Back
          </Button>
          <Button
            type="primary"
            className="bg-green-600 text-white hover:bg-green-500 px-6 py-2 rounded-lg"
          >
            Message Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
