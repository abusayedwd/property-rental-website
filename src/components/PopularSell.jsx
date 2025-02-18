 


"use client";

import React, { useEffect } from "react";
import { Button, Tag } from "antd";
import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import Header from "./customComponent/Header";
import Link from "next/link";
 import url from "@/redux/api/baseUrl";
import { useGetPromotedASellPropertiesQuery } from "@/redux/fetures/property/getPromotedASellProperties";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import { useRouter } from "next/navigation";

const PopularSell = ({ searchCriteria }) => {
  const router = useRouter()
  // const { data: user } = useLogedUserQuery();

  const state = searchCriteria?.selectedState;
 const subState = searchCriteria?.selectedSubState;
 const propertyType = searchCriteria?.transactionType;
 
 const { data: propertiess, isLoading } = useGetPromotedASellPropertiesQuery({
  state: state || "", 
  subState: subState || "", 
  propertyType: propertyType || ""
});

const properties = propertiess?.data?.attributes?.results || [];
  // Filter properties to show only those with propertyType === "sell"
 
  return (
    <div className="container mt-56 md:mt-28">
      {/* Heading Section */}
      <div className="text-center mb-8">
        <Header size="extraLarge" className="text-[#2FC639]">
          Popular for Sell
        </Header>
        <p className="text-blue-500 text-sm md:mt-12 md:text-base">
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
        {isLoading ? (
          <p className="text-center text-gray-500">Loading properties...</p>
        ) : properties?.length === 0 ? (
          <p className="text-center text-gray-500">No properties found.</p>
        ) : (
          properties?.map((property) => (
            <div
              key={property.id}
              className="border rounded-lg shadow-md overflow-hidden bg-white"
            >
              {/* Image Section */}
              <div className="relative">
                <img
                  src={property?.image?.url ? url + property.image.url : "/images/default-home.png"}
                  alt={property.houseName}
                  className="w-full h-[200px] object-cover"
                />
                <Tag
                  color="red"
                  className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold"
                >
                  {property.propertyType === "sell" ? "For Sale" : "For Rent"}
                </Tag>
              </div>

              {/* Content Section */}
              <div className="p-4 bg-green-50">
                {/* Title */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    {property.houseName || "Unnamed Property"}
                  </h2>
                </div>

                {/* Address */}
                <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
                  <EnvironmentOutlined />
                  {property.address || "No address provided"}
                </p>

                {/* Price and Type */}
                <div className="flex justify-between items-center mb-3">
                  <p className="text-green-600 font-bold text-xl">
                    ${property.price || "N/A"}
                  </p>
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <HomeOutlined />
                    Type: {property.type || "N/A"}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {property.state || "N/A"}, {property.subState || ""}
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-3 gap-2 text-gray-600 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <AppstoreAddOutlined />
                    Rooms: {property?.rooms || "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <AppstoreAddOutlined />
                    Baths: {property.baths || "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <AppstoreAddOutlined />
                    State: {property.state || "N/A"}
                  </div>
                </div>

                {/* Action Buttons */}

                <div className="flex gap-3">
                  <button
                    className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                    onClick={() => {
                     
                        router.push(`/detailsHome/${property.id}`);
                     
                    }}
                  >
                    Details
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>



      
    </div>
  );
};

export default PopularSell;

 