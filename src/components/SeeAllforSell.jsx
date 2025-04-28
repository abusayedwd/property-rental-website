"use client";

import React, { useEffect } from "react";
import { Button, Tag } from "antd";
import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import Header from "./customComponent/Header";
import Link from "next/link";
import url from "@/redux/api/baseUrl";
import { useGetPromotedASellPropertiesQuery } from "@/redux/fetures/property/getPromotedASellProperties";
// Import Swiper components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MdBathroom, MdOutlineBathtub, MdOutlineRealEstateAgent } from "react-icons/md";
import { useRouter } from "next/navigation";
import AOS from "aos";
import 'aos/dist/aos.css';

const SeeAllforSell = () => {
    const router = useRouter();
  const { data: propertiess, isLoading } = useGetPromotedASellPropertiesQuery(
    {
      state: "", 
      subState: "", 
      propertyType: ""
    }
  );
  const properties = propertiess?.data?.attributes?.results || [];
  useEffect(() => {
    AOS.init({
      duration: 1000,  // Animation duration
      easing: 'ease-in-out',  // Easing function
    });
  }, []);
  // Property Card Component to avoid duplication
  const PropertyCard = ({ property }) => (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white h-full" data-aos="zoom-in">
      {/* Image Section */}
      <div className="relative">
        <img
          src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
          alt={property.houseName}
          className="w-full h-[200px] object-cover"
        />
        <Tag
          color="red"
          className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold"
        >
          {property.propertyType === "sold" ? "Sold" :
           property.propertyType === "rented" ? "Rented" :
           ["sell", "for sell"].includes(property.propertyType) ? "For Sale" :
           ["rent", "for rent"].includes(property.propertyType) ? "For Rent" :
           "Unknown"}
        </Tag>
      </div>

      {/* Content Section */}
      <div className="p-4 bg-green-50 h-full flex flex-col">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            {property.houseName || "Unnamed Property"}
          </h2>
        </div>

        {/* Address */}
        <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
          <EnvironmentOutlined />
          {property.place || "No address provided"}
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
        </div>
        
        <div className="text-gray-500 text-sm mb-2">
          {property.state || "N/A"}, {property.subState || ""}
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-3 gap-2 text-gray-600 text-sm mb-4">
           <div className="flex items-center gap-1">
                               <MdBathroom />
                                  Rooms: {property?.rooms || "N/A"}
                                </div>
                                <div className="flex items-center gap-1">
                                <MdOutlineBathtub />
                                  Baths: {property.baths || "N/A"}
                                </div>
                                <div className="flex items-center gap-1">
                                <MdOutlineRealEstateAgent />
                                  State: {property.state || "N/A"}
                                </div>
        </div>

        {/* Action Buttons */}
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
  );

  return (
    <div className="md:container w-[95%] mx-auto mt-28">
      {/* Heading Section */}
      <div className="text-center mb-8">
        <Header size="extraLarge" className="text-[#2FC639]">
          All Property for Sell
        </Header>
        <p className="text-blue-500 text-sm mt-12 md:text-base">
          You can see here all popular property
        </p>
      </div>

      <Button
        onClick={() => window.history.back()}
        className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-2 rounded-lg mb-6"
      >
        Back
      </Button>

      {/* Loading and Empty States */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading properties...</p>
      ) : properties?.length === 0 ? (
        <p className="text-center text-gray-500">No properties found.</p>
      ) : (
        <>
          {/* Mobile Swiper View - Only shown on small screens */}
          <div className="block lg:hidden my-6 pb-8">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                // When screen width is >= 640px (sm)
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                }
              }}
              className="pb-12" // Add padding for pagination bullets
            >
              {properties.map((property) => (
                <SwiperSlide key={property.id}>
                  <PropertyCard property={property} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop Grid View - Only shown on large screens */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6 my-6 pb-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SeeAllforSell;