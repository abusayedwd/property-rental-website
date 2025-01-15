"use client";

import React from "react";
import { Button, Tag } from "antd";
import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import Header from "./customComponent/Header";
import Link from "next/link";

// Sample JSON Data
const properties = [
  {
    id: 1,
    image: "/images/home.png", // Ensure these images are in your public/images directory
    status: "For Sell",
    title: "Gorgeous House Building",
    address: "58 Hullbrook Road, Tibbati, Camaron",
    price: "$7,500",
    type: "Home",
    code: "E560A",
    beds: 4,
    baths: 2,
    sqft: 1150,
  },
  {
    id: 2,
    image: "/images/home.png",
    status: "For Sell",
    title: "Modern Apartment",
    address: "22 Park Street, New York, NY",
    price: "$8,200",
    type: "Apartment",
    code: "A750B",
    beds: 3,
    baths: 2,
    sqft: 1350,
  },
  {
    id: 3,
    image: "/images/home.png",
    status: "For Sell",
    title: "Luxury Villa",
    address: "102 Palm Beach Road, Miami, FL",
    price: "$12,500",
    type: "Villa",
    code: "V990C",
    beds: 5,
    baths: 4,
    sqft: 2500,
  },
  {
    id: 4,
    image: "/images/home.png",
    status: "For Sell",
    title: "Cozy Cottage",
    address: "7 Maple Drive, Boston, MA",
    price: "$5,900",
    type: "Cottage",
    code: "C120D",
    beds: 2,
    baths: 1,
    sqft: 750,
  },
];

const PopularSell = () => {
  return (
    <div className="container mt-28">
      {/* Heading Section */}
      <div className="text-center mb-8">
      <Header size="extraLarge" className="text-green-700">
        Popular for Sell
      </Header>
         
        <p className="text-blue-500 text-sm mt-12 md:text-base">
          You can see here all popular posts
        </p>
        <div className="mt-4 text-right ">
            <Link href="/seeAllSell"> 
          <Button className="text-white hover:bg-green-600 bg-[#1A3459] hover:text-white font-semibold">
            See all
          </Button>
            </Link>   

        </div>
      </div>

      {/* Property Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="border rounded-lg shadow-md overflow-hidden bg-white"
          >
            {/* Image Section */}
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-[200px] object-cover"
              />
              <Tag
                color="red"
                className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold"
              >
                {property.status}
              </Tag>
            </div>

            {/* Content Section */}
            <div className="p-4 bg-green-50">
              {/* Title */}
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                {property.title}
              </h2>

              {/* Address */}
              <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
                <EnvironmentOutlined />
                {property.address}
              </p>

              {/* Price and Type */}
              <div className="flex justify-between items-center mb-3">
                <p className="text-green-600 font-bold text-xl">
                  {property.price}
                </p>
                <div className="text-gray-500 text-sm flex items-center gap-1">
                  <HomeOutlined />
                  Type: {property.type}
                </div>
                <div className="text-gray-500 text-sm">{property.code}</div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-3 gap-2 text-gray-600 text-sm mb-4">
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

              {/* Action Button */}
              <Button
                type="primary"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold"
              >
                Message Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularSell;
