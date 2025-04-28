// "use client";

// import React, { useEffect } from "react";
// import { Button, Tag } from "antd";
// import {
//   EnvironmentOutlined,
//   HomeOutlined,
//   AppstoreAddOutlined,
// } from "@ant-design/icons";
// import Header from "./customComponent/Header";
// import Link from "next/link";
// import { useGetPromotedARentPropertiesQuery } from "@/redux/fetures/property/getPromotedARentProperties";
// import url from "@/redux/api/baseUrl";
// import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
// import { useRouter } from "next/navigation";

// const PopularRent = ({ searchCriteria }) => {
//   const router = useRouter()
//   const { data: user } = useLogedUserQuery();

//   const state = searchCriteria?.selectedState;
//   const subState = searchCriteria?.selectedSubState;
//   const propertyType = searchCriteria?.transactionType;

//   console.log(state, subState, propertyType);

//   const { data: propertiess, isLoading } = useGetPromotedARentPropertiesQuery({
//     state: state || "",
//     subState: subState || "",
//     propertyType: propertyType || "",
//   });

//   // Safely access properties
//   const properties = propertiess?.data?.attributes?.results || [];

//   // Filter properties to show only those with propertyType === "sell"

//   return (
//     <div className="container mt-12 md:mt-28">
//       {/* Heading Section */}
//       <div className="text-center mb-8">
//         <Header size="extraLarge" className="text-[#2FC639]">
//           Popular for Rent
//         </Header>
//         <p className="text-blue-500 text-sm md:mt-12 md:text-base">
//           You can see here all popular posts
//         </p>
//         <div className="mt-4 text-right ">
//           <Link href="/seeAllRentHome">
//             <Button className="text-white hover:bg-green-600 bg-[#1A3459] hover:text-white font-semibold">
//               See all
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Property Cards Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {isLoading ? (
//           <p className="text-center text-gray-500">Loading properties...</p>
//         ) : properties?.length === 0 ? (
//           <p className="text-center text-gray-500">No properties found.</p>
//         ) : (
//           properties?.map((property) => (
//             <div
//               key={property.id}
//               className="border rounded-lg shadow-md overflow-hidden bg-white"
//             >
//               {/* Image Section */}
//               <div className="relative">
//                 <img
//                   src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
//                   alt={property.houseName}
//                   className="w-full h-[200px] object-cover"
//                 />
//                 <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
                  
//                 {property.propertyType === "sold" ? "Sold" :
//    property.propertyType === "rented" ? "Rented" :
//    ["sell", "for sell"].includes(property.propertyType) ? "For Sale" :
//    ["rent", "for rent"].includes(property.propertyType) ? "For Rent" :
//    "Unknown"}

//                 </Tag>
//               </div>

//               {/* Content Section */}
//               <div className="p-4 bg-green-50">
//                 {/* Title */}
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-lg font-bold text-gray-800 mb-1">
//                     {property.houseName || "Unnamed Property"}
//                   </h2>
//                 </div>

//                 {/* Address */}
//                 <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
//                   <EnvironmentOutlined />
//                   {property.address || "No address provided"}
//                 </p>

//                 {/* Price and Type */}
//                 <div className="flex justify-between items-center mb-3">
//                   <p className="text-green-600 font-bold text-xl">
//                   ${property.price || "N/A"}
//                   </p>
//                   <div className="text-gray-500 text-sm flex items-center gap-1">
//                     <HomeOutlined />
//                     Type: {property.type || "N/A"}
//                   </div>
//                   <div className="text-gray-500 text-sm">
//                     {property.state || "N/A"}, {property.subState || ""}
//                   </div>
//                 </div>

//                 {/* Property Details */}
//                 <div className="grid grid-cols-3 gap-2 text-gray-600 text-sm mb-4">
//                   <div className="flex items-center gap-1">
//                     <AppstoreAddOutlined />
//                     Rooms: {property?.rooms || "N/A"}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <AppstoreAddOutlined />
//                     Baths: {property.baths || "N/A"}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <AppstoreAddOutlined />
//                     State: {property.state || "N/A"}
//                   </div>
                   
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3">
//                   <button
//                     className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
//                     onClick={() => {
//                       if (user) {
//                         router.push(`/detailsHome/${property.id}`);
//                       } else {
//                         router.push("/auth/login");
//                       }
//                     }}
//                   >
//                     Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default PopularRent;

"use client";

import React, { useEffect, useRef } from "react";
import { Button, Tag } from "antd";
import {
  EnvironmentOutlined,
  HomeOutlined,
  AppstoreAddOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import Header from "./customComponent/Header";
import Link from "next/link";
import { useGetPromotedARentPropertiesQuery } from "@/redux/fetures/property/getPromotedARentProperties";
import url from "@/redux/api/baseUrl";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
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
const PopularRent = ({ searchCriteria }) => {
  const router = useRouter(); 
  const state = searchCriteria?.selectedState;
  const subState = searchCriteria?.selectedSubState;
  const propertyType = searchCriteria?.transactionType;

  const { data: propertiess, isLoading } = useGetPromotedARentPropertiesQuery({
    state: state || "",
    subState: subState || "",
    propertyType: propertyType || "",
  });
 // Safely access properties
 const properties = propertiess?.data?.attributes?.results || [];


 const favoritesRef = useRef({});
 useEffect(() => {
   AOS.init({
     duration: 1000,
     easing: 'ease-in-out',
   });
   
   // Load favorites from localStorage
   const savedFavorites = localStorage.getItem('propertyFavorites');
   if (savedFavorites) {
     favoritesRef.current = JSON.parse(savedFavorites);
   }
 }, []);

 
 
 // Handle toggling favorites without causing re-renders
 const handleToggleFavorite = (propertyId, e, heartIconRef, outlineHeartRef) => {
   e.stopPropagation();
   e.preventDefault();
   
   // Toggle favorite state in the ref
   favoritesRef.current[propertyId] = !favoritesRef.current[propertyId];
   
   // Update localStorage
   localStorage.setItem('propertyFavorites', JSON.stringify(favoritesRef.current));
   
   // Directly manipulate the DOM to show/hide appropriate heart icon
   if (heartIconRef && outlineHeartRef) {
     if (favoritesRef.current[propertyId]) {
       heartIconRef.style.display = "block";
       outlineHeartRef.style.display = "none";
     } else {
       heartIconRef.style.display = "none";
       outlineHeartRef.style.display = "block";
     }
   }
 };

 const PropertyCard = ({ property }) => {
   // Create refs for the heart icons
   const filledHeartRef = useRef(null);
   const outlineHeartRef = useRef(null);
   
   return (
     <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-500" data-aos="zoom-in">
       {/* Image Section with Enhanced Overlay */}
       <div className="relative group">
         <img
           src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
           alt={property.houseName}
           className="w-full h-[500px] object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
         />
         
         {/* Status Tag */}
         <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold z-10">
           {property.propertyType === "sold" ? "Sold" :
             property.propertyType === "rented" ? "Rented" :
             ["sell", "for sell"].includes(property.propertyType) ? "For Sale" :
             ["rent", "for rent"].includes(property.propertyType) ? "For Rent" :
             "Unknown"}
         </Tag>
         
         {/* Favorite Button - Using DOM manipulation instead of state changes */}
         <button 
           className="absolute top-2 right-2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-md hover:bg-white z-20"
           onClick={(e) => handleToggleFavorite(property.id, e, filledHeartRef.current, outlineHeartRef.current)}
         >
           <span 
             ref={filledHeartRef} 
             style={{ display: favoritesRef.current[property.id] ? 'block' : 'none' }}
           >
             <HeartFilled className="text-lg text-red-500" />
           </span>
           <span 
             ref={outlineHeartRef} 
             style={{ display: favoritesRef.current[property.id] ? 'none' : 'block' }}
           >
             <HeartOutlined className="text-lg text-gray-600 hover:text-red-500" />
           </span>
         </button>
         
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
         
         {/* Details button that appears on hover with enhanced animation */}
         <div className="absolute inset-0 flex items-center justify-center">
           <div
             className="px-6 py-3 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out font-medium shadow-lg"
             onClick={() => router.push(`/detailsHome/${property.id}`)}
           >
             <div> 
                <button type="button" className=" relative h-14 w-48 overflow-hidden border-2 border-sky-400 text-xl text-sky-400 hover:text-sky-200">
             <span className="bg-sky-800 bg-opacity-60  ease-in absolute w-[57%]  -translate-x-full group-hover:translate-x-0 -left-2 top-0 bottom-0 duration-300 -z-10 skew-x-12"></span>
             <span className="bg-sky-600 bg-opacity-60 ease-in absolute w-[55%]  translate-x-full group-hover:translate-x-0 -right-2 top-0 bottom-0 duration-300 skew-x-12 -z-10"></span>
           View more
           </button>
             </div>
           
           </div>
         </div>



       </div>
       
       {/* Content Section */}
       <div className="p-4  h-full flex flex-col">
         {/* Title */}
         <div className="flex items-center justify-between">
           <h2 className="text-lg font-bold text-gray-200 mb-1">
             {property.houseName || "Unnamed Property"}
           </h2>
         </div>
         {/* Address */}
         <p className="text-gray-200 text-sm flex items-center gap-2 mb-2">
           <EnvironmentOutlined />
           {property.place || "No address provided"}
         </p>
         {/* Price and Type */}
         <div className="flex justify-between items-center mb-3">
           <p className="text-green-600 font-bold text-xl">
             ${property.price || "N/A"}
           </p>
           <div className="text-gray-200 text-sm flex items-center gap-1">
             <HomeOutlined />
             Type: {property.type || "N/A"}
           </div>
         </div>
       </div>
     </div>
   );
 };

  return (
    <div className="md:container w-[95%] mx-auto mt-12 md:mt-28">
      {/* Heading Section */}
      <div className="text-center mb-8">
        <Header size="extraLarge" className="text-gray-100">
          Popular for Rent
        </Header>
        <p className="text-blue-500 text-sm md:mt-12 md:text-base">
          You can see here all popular property
        </p>
        <div className="mt-4 text-right">
          <Link href="/seeAllRentHome">
            <Button className="text-white hover:bg-green-600 bg-[#1A3459] hover:text-white font-semibold">
              See all
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading and Empty States */}
      {isLoading ? (
        <p className="text-center text-gray-200">Loading properties...</p>
      ) : properties?.length === 0 ? (
        <p className="text-center text-gray-200">No properties found.</p>
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
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PopularRent;