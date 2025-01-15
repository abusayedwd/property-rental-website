"use client";
import React, { useState } from "react";
import { Input, Select, Button, Tag } from "antd";
import PopularSell from "./PopularSell";
const { Option } = Select; 
 
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
  {
    id: 5,
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
  {
    id: 6,
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



const SeeAllforSell = () => {
  const [houseName, setHouseName] = useState("");
  const [state, setState] = useState("CA"); 
  const [transactionType, setTransactionType] = useState("rent");  

  const handleSearch = () => {
    console.log("House Name:", houseName);
    console.log("State:", state);
    console.log("Transaction Type:", transactionType);
    // Add your search logic here
  };

  return (
    <div>
    <div className="relative">
        
      <div
        className=" bg-cover bg-center h-[350px] lg:h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxSizing: "border-box",
        }}
      >
        <div className="  inset-0 bg-black bg-opacity-50"></div>
        <div className="text-center w-[900px] z-10 px-4">
           
          <div className="flex flex-col lg:flex-row md:mt-10 items-center gap-4 lg:gap-2 bg-white p-4 rounded-lg shadow-lg w-2/3 mx-auto md:w-full max-w-4xl">
            {/* Input for House Name */}
            <Input
              placeholder="Search by House Name"
              className="flex-1 h-12 w-2/3"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
            />

            {/* Select for State */}
            <Select
              className="flex-1 h-12 w-2/3"
              placeholder="Select state"
              size="large"
              defaultValue={state}
              onChange={(value) => setState(value)}
            >
              <Option value="California">California</Option>
              <Option value="New York">New York</Option>
              <Option value="Texas">Texas</Option>
              {/* Add more states */}
            </Select>

            {/* Select for Rent/Buy/Sell */}
            <Select
              className="flex-1 h-12 w-2/3"
              placeholder="For Rent"
              size="large"
              defaultValue={transactionType}
              onChange={(value) => setTransactionType(value)}
            >
              <Option value="rent">Rent</Option>
              <Option value="buy">Buy</Option>
              <Option value="sell">Sell</Option>
            </Select>

            {/* Search Button */}
            <Button
              type="primary"
              className="bg-green-600 hover:bg-green-500 h-12 px-6 text-white font-bold"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div> 
    </div>



 {/* //see all for sell// */}

    <div className="container mt-20 mb-12">
      {/* Heading Section */}
      <div className="text-center mb-8">
      <Header size="extraLarge" className="text-green-700">
        All Sells Home
      </Header>
         
        <p className="text-blue-500 text-sm mt-12 md:text-base">
          You can see here all popular posts
        </p>
         
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
              <div className="flex items-center justify-between">
  <h2 className="text-lg font-bold text-gray-800 mb-1">
    {property.title}
  </h2>
  <Link href={`/detailsHome/${property.id}`}>
    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-600 transition-all duration-300">
      Details
    </button>
  </Link>
</div>

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


    </div>
 
  );
};

export default SeeAllforSell;
