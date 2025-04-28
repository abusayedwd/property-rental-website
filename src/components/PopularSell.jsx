 


// "use client";

// import React, { useEffect, useState } from "react";
// import { Button, Tag } from "antd";
// import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
// import Header from "./customComponent/Header";
// import Link from "next/link";
// import url from "@/redux/api/baseUrl";
// import { useGetPromotedASellPropertiesQuery } from "@/redux/fetures/property/getPromotedASellProperties";
// import { useRouter } from "next/navigation";
// // Import Swiper components
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { MdBathroom, MdOutlineBathtub, MdOutlineRealEstateAgent } from "react-icons/md";
// import AOS from "aos";
// import 'aos/dist/aos.css';

// const PopularSell = ({ searchCriteria }) => {
//   const router = useRouter();
//   const [isHovered, setIsHovered] = useState(false);
//   const state = searchCriteria?.selectedState;
//   const subState = searchCriteria?.selectedSubState;
//   const propertyType = searchCriteria?.transactionType;
 
//   const { data: propertiess, isLoading } = useGetPromotedASellPropertiesQuery({
//     state: state || "", 
//     subState: subState || "", 
//     propertyType: propertyType || ""
//   });

//   useEffect(() => {
//     AOS.init({
//       duration: 1000,  // Animation duration
//       easing: 'ease-in-out',  // Easing function
//     });
//   }, []);

//   const properties = propertiess?.data?.attributes?.results || []; 
 
//   const PropertyCard = ({ property }) => (

//     <div className="border rounded-lg shadow-md overflow-hidden  hover:shadow-xl transition-all duration-500" >
//     {/* Image Section with Enhanced Overlay */}
//     <div className="relative group">
//       <img
//         src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
//         alt={property.houseName}
//         className="w-full h-[500px] object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
//       />
      
//       {/* Status Tag */}
//       <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold z-10">
//         {property.propertyType === "sold" ? "Sold" :
//           property.propertyType === "rented" ? "Rented" :
//           ["sell", "for sell"].includes(property.propertyType) ? "For Sale" :
//           ["rent", "for rent"].includes(property.propertyType) ? "For Rent" :
//           "Unknown"}
//       </Tag>
      
//       {/* Gradient Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
//       {/* Details button that appears on hover with enhanced animation */}
//       <div className="absolute inset-0 flex items-center justify-center">
//         <button
//           className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out font-medium shadow-lg"
//           onClick={() => router.push(`/detailsHome/${property.id}`)}
//         >
//           View Details
//         </button>
//       </div>
//     </div>
    
//     {/* Content Section */}
//     <div className="p-4 bg-green-50 h-full flex flex-col">
//       {/* Title */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg font-bold text-gray-800 mb-1">
//           {property.houseName || "Unnamed Property"}
//         </h2>
//       </div>
//       {/* Address */}
//       <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
//         <EnvironmentOutlined />
//         {property.place || "No address provided"}
//       </p>
//       {/* Price and Type */}
//       <div className="flex justify-between items-center mb-3">
//         <p className="text-green-600 font-bold text-xl">
//           ${property.price || "N/A"}
//         </p>
//         <div className="text-gray-500 text-sm flex items-center gap-1">
//           <HomeOutlined />
//           Type: {property.type || "N/A"}
//         </div>
//       </div>
//     </div>
//   </div>
  
  
  
//   );





//   return (
//     <div className="md:container w-[95%] mx-auto mt-16 md:mt-28">
//       {/* Heading Section */}
//       <div className="text-center mb-8">
//         <Header size="extraLarge" className="text-[#2FC639]">
//           Popular for Sell
//         </Header>
//         <p className="text-blue-500 text-sm md:mt-12 md:text-base">
//           You can see here all popular property
//         </p>
//         <div className="mt-4 text-right">
//           <Link href="/seeAllSell">
//             <Button className="text-white hover:bg-green-600 bg-[#1A3459] hover:text-white font-semibold">
//               See all
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Loading and Empty States */}
//       {isLoading ? (
//         <p className="text-center text-gray-500">Loading properties...</p>
//       ) : properties?.length === 0 ? (
//         <p className="text-center text-gray-500">No properties found.</p>
//       ) : (
//         <>
//           {/* Mobile Swiper View - Only shown on small screens */}
//           <div className="block lg:hidden">
//             <Swiper
//               modules={[Navigation, Pagination]}
//               spaceBetween={16}
//               slidesPerView={1}
//               navigation
//               pagination={{ clickable: true }}
//               breakpoints={{
//                 // When screen width is >= 640px (sm)
//                 640: {
//                   slidesPerView: 2,
//                   spaceBetween: 20,
//                 }
//               }}
//               className="pb-12" // Add padding for pagination bullets
//             >
//               {properties.map((property) => (
//                 <SwiperSlide key={property.id}>
//                   <PropertyCard property={property} />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>

//           {/* Desktop Grid View - Only shown on large screens */}
//           <div className="hidden lg:grid lg:grid-cols-2 gap-6">
//             {properties.map((property) => (
//               <PropertyCard key={property.id} property={property} />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default PopularSell;


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

export default PopularSell;