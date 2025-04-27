 
 
// "use client";

// import React, { useEffect } from "react";
// import { Button, Tag } from "antd";
// import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
// import Header from "./customComponent/Header";
// import Link from "next/link";
// import url from "@/redux/api/baseUrl";
// import { useGetPromotedASellPropertiesQuery } from "@/redux/fetures/property/getPromotedASellProperties";
// import { useRouter } from "next/navigation";
// import { Swiper, SwiperSlide } from "swiper/react";
 
// import SwiperCore, { Navigation, Pagination } from 'swiper'; // Import modules

// // Initialize Swiper with modules
// SwiperCore.use([Navigation, Pagination]);

// const PopularSell = ({ searchCriteria }) => {
//   const router = useRouter();

//   const state = searchCriteria?.selectedState;
//   const subState = searchCriteria?.selectedSubState;
//   const propertyType = searchCriteria?.transactionType;

//   const { data: propertiess, isLoading } = useGetPromotedASellPropertiesQuery({
//     state: state || "",
//     subState: subState || "",
//     propertyType: propertyType || ""
//   });

//   const properties = propertiess?.data?.attributes?.results || [];

//   return (
//     <div className="container mt-16 md:mt-28">
//       {/* Heading Section */}
//       <div className="text-center mb-8">
//         <Header size="extraLarge" className="text-[#2FC639]">
//           Popular for Sell
//         </Header>
//         <p className="text-blue-500 text-sm md:mt-12 md:text-base">
//           You can see here all popular posts
//         </p>
//         <div className="mt-4 text-right ">
//           <Link href="/seeAllSell">
//             <Button className="text-white hover:bg-green-600 bg-[#1A3459] hover:text-white font-semibold">
//               See all
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Swiper Section for Property Cards */}
//       <div className="swiper-container">
//         <Swiper
//           spaceBetween={10}
//           slidesPerView="auto"
//           navigation={true}
//           pagination={true} // Optional pagination
//           breakpoints={{
//             320: {
//               slidesPerView: 1, // Mobile: 1 slide at a time
//             },
//             768: {
//               slidesPerView: 2, // Tablet: 2 slides at a time
//             },
//             1024: {
//               slidesPerView: 4, // Desktop: 4 slides at a time
//             },
//           }}
//         >
//           {isLoading ? (
//             <p className="text-center text-gray-500">Loading properties...</p>
//           ) : properties?.length === 0 ? (
//             <p className="text-center text-gray-500">No properties found.</p>
//           ) : (
//             properties?.map((property) => (
//               <SwiperSlide key={property.id}>
//                 <div className="border rounded-lg shadow-md overflow-hidden bg-white">
//                   {/* Image Section */}
//                   <div className="relative">
//                     <img
//                       src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
//                       alt={property.houseName}
//                       className="w-full h-[200px] object-cover"
//                     />
//                     <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
//                       {property.propertyType === "sold"
//                         ? "Sold"
//                         : property.propertyType === "rented"
//                         ? "Rented"
//                         : ["sell", "for sell"].includes(property.propertyType)
//                         ? "For Sale"
//                         : ["rent", "for rent"].includes(property.propertyType)
//                         ? "For Rent"
//                         : "Unknown"}
//                     </Tag>
//                   </div>

//                   {/* Content Section */}
//                   <div className="p-4 bg-green-50">
//                     <div className="flex items-center justify-between">
//                       <h2 className="text-lg font-bold text-gray-800 mb-1">
//                         {property.houseName || "Unnamed Property"}
//                       </h2>
//                     </div>

//                     <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
//                       <EnvironmentOutlined />
//                       {property.address || "No address provided"}
//                     </p>

//                     <div className="flex justify-between items-center mb-3">
//                       <p className="text-green-600 font-bold text-xl">
//                         ₦{property.price || "N/A"}
//                       </p>
//                       <div className="text-gray-500 text-sm flex items-center gap-1">
//                         <HomeOutlined />
//                         Type: {property.type || "N/A"}
//                       </div>
//                       <div className="text-gray-500 text-sm">
//                         {property.state || "N/A"}, {property.subState || ""}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-2 text-gray-600 text-sm mb-4">
//                       <div className="flex items-center gap-1">
//                         <AppstoreAddOutlined />
//                         Rooms: {property?.rooms || "N/A"}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <AppstoreAddOutlined />
//                         Baths: {property.baths || "N/A"}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <AppstoreAddOutlined />
//                         State: {property.state || "N/A"}
//                       </div>
//                     </div>

//                     <div className="flex gap-3">
//                       <button
//                         className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
//                         onClick={() => {
//                           router.push(`/detailsHome/${property.id}`);
//                         }}
//                       >
//                         Details
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))
//           )}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default PopularSell;


"use client";

import React, { useEffect } from "react";
import { Button, Tag } from "antd";
import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
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

const PopularSell = ({ searchCriteria }) => {
  const router = useRouter();

  const state = searchCriteria?.selectedState;
  const subState = searchCriteria?.selectedSubState;
  const propertyType = searchCriteria?.transactionType;
 
  const { data: propertiess, isLoading } = useGetPromotedASellPropertiesQuery({
    state: state || "", 
    subState: subState || "", 
    propertyType: propertyType || ""
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,  // Animation duration
      easing: 'ease-in-out',  // Easing function
    });
  }, []);

  const properties = propertiess?.data?.attributes?.results || [];

  // Property Card Component to avoid duplication
  const PropertyCard = ({ property }) => (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white h-full " data-aos="zoom-in">
      {/* Image Section */}
      <div className="relative">
        <img
          src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
          alt={property.houseName}
          className="w-full h-[200px] object-cover"
        />
        <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
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
            ₦{property.price || "N/A"}
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
    <div className="md:container w-[95%] mx-auto mt-16 md:mt-28">
      {/* Heading Section */}
      <div className="text-center mb-8">
        <Header size="extraLarge" className="text-[#2FC639]">
          Popular for Sell
        </Header>
        <p className="text-blue-500 text-sm md:mt-12 md:text-base">
          You can see here all popular property
        </p>
        <div className="mt-4 text-right">
          <Link href="/seeAllSell">
            <Button className="text-white hover:bg-green-600 bg-[#1A3459] hover:text-white font-semibold">
              See all
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading and Empty States */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading properties...</p>
      ) : properties?.length === 0 ? (
        <p className="text-center text-gray-500">No properties found.</p>
      ) : (
        <>
          {/* Mobile Swiper View - Only shown on small screens */}
          <div className="block lg:hidden">
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
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
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