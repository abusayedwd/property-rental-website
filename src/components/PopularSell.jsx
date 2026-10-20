



"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button, Tag } from "antd";
import { EnvironmentOutlined, HomeOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import Header from "./customComponent/Header";
import Link from "next/link";
import url from "@/redux/api/baseUrl";
import { useGetPromotedASellPropertiesQuery } from "@/redux/fetures/property/getPromotedASellProperties";
import { useRouter } from "next/navigation";
// Import Swiper components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MdBathroom, MdOutlineBathtub, MdOutlineRealEstateAgent } from "react-icons/md";
import AOS from "aos";
import 'aos/dist/aos.css';
import { demoSellProperties } from "@/data/demoProperties";
import { formatPrice } from "@/utils/formatPrice";
import PropertyCard, { PropertyCardSkeleton } from "@/components/property/PropertyCard";

const PopularSell = ({ searchCriteria }) => {
  const router = useRouter();
   // Use ref instead of state to avoid re-renders
  const state = searchCriteria?.selectedState;
  const subState = searchCriteria?.selectedSubState;
  const propertyType = searchCriteria?.transactionType;
 
  const { data: propertiess, isLoading } = useGetPromotedASellPropertiesQuery({
    state: state || "", 
    subState: subState || "", 
    propertyType: propertyType || ""
  });
  const fetchedProperties = propertiess?.data?.attributes?.results || [];
  const properties =
    !isLoading && fetchedProperties.length === 0 ? demoSellProperties : fetchedProperties;



    useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
    });
  }, []);

    return (
    <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 md:mt-24">
      {/* Heading Section */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primaryDark">Featured listings</p>
          <h2 className="mt-1 text-3xl font-bold text-navy md:text-4xl">Homes for sale</h2>
          <p className="mt-2 text-gray-500">Featured properties ready for their next owner.</p>
        </div>
        <Link
          href="/seeAllSell"
          className="group inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-5 py-2.5 text-sm font-semibold text-navy shadow-sm transition-colors hover:border-primary hover:text-primaryDark"
        >
          View all <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Loading and Empty States */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[1, 2, 3, 4].map((i) => <PropertyCardSkeleton key={i} />)}</div>
      ) : properties?.length === 0 ? (
        <p className="text-center text-gray-500">No properties found.</p>
      ) : (
        <>
          {/* Mobile Swiper View - Only shown on small screens */}
          <div className="block lg:hidden">
            <Swiper
              modules={[Pagination]}
              spaceBetween={16}
              slidesPerView={1.12}
              pagination={{ clickable: true }}
              breakpoints={{ 600: { slidesPerView: 2.1, spaceBetween: 20 } }}
              className="!pb-12"
            >
              {properties.map((property) => (
                <SwiperSlide key={property.id}>
                  <PropertyCard property={property} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop Grid View - Only shown on large screens */}
          <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PopularSell;