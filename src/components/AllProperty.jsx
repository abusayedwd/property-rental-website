 


// "use client";

// import React from "react";
// import { Button, Tag } from "antd";
// import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
// import { useRouter } from "next/navigation";
// import url from "@/redux/api/baseUrl";
// import { useGetAllpropertyQuery } from "@/redux/fetures/property/getAllProperty";

// const AllProperty = ({ searchCriteria }) => {
//   const router = useRouter();
//   const state = searchCriteria?.selectedState;
//   const subState = searchCriteria?.selectedSubState;
//   const propertyType = searchCriteria?.transactionType;

//   const { data: propertiess, isLoading } = useGetAllpropertyQuery({
//     state: state || "",
//     subState: subState || "",
//     propertyType: propertyType || "",
//   });

//   const properties = propertiess?.data?.attributes?.results || [];

//   // Separate promoted and non-promoted properties
//   const promotedProperties = properties.filter((property) => property.isPromotion);
//   const regularProperties = properties.filter((property) => !property.isPromotion);

//   return (
//     <div className="md:container mt-12 min-h-[600px] mb-20 md:mt-16">
//       {/* Heading Section */}
//       <div className="text-center mb-8">
//         <h1 className="text-[#2FC639] text-2xl">Your Finder Property</h1>
//       </div>

//       {/* Promoted Properties Section */}
//       {promotedProperties.length > 0 && (
//         <div>
//           <h2 className="text-xl font-bold text-green-600 mb-4">🔥 Promoted Properties</h2>
//           <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-4 gap-6">
//             {promotedProperties.map((property) => (
//               <div key={property.id} className="border rounded-lg shadow-md overflow-hidden bg-white p-4">
//                 {/* Image Section (Top) */}
//                 <div className="relative">
//                   {/* <img
//                     src={property?.image?.url ? url + property.image.url : "/images/default-home.png"}
//                     alt={property.houseName}
//                     className="w-full h-[250px] object-cover"
//                   /> */}
//                      <img
//                   src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
//                   alt={property.houseName}
//                   className="w-full h-[200px] object-cover"
//                 />
//                   <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
//                     {property.propertyType === "sell" ? "For Sale" : "For Rent"}
//                   </Tag>
//                   <Tag color="green" className="absolute top-2 right-2 px-3 py-1 text-sm font-semibold">
//                     Promoted
//                   </Tag>
//                 </div>

//                 {/* Content Section (Below Image) */}
//                 <div className="p-6 bg-green-50">
//                   <h2 className="text-lg font-bold text-gray-800">{property.houseName || "Unnamed Property"}</h2>
//                   <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
//                     <EnvironmentOutlined />
//                     {property.address || "No address provided"}
//                   </p>

//                   <div className="flex justify-between items-center mb-2">
//                     <p className="text-green-600 font-bold text-xl">$ {property.price || "N/A"}</p>
//                     <div className="text-gray-500 text-sm flex items-center gap-1">
//                       <HomeOutlined />
//                       Type: {property.type || "N/A"}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-3 gap-2 text-gray-600 text-sm mb-4">
//                     <div className="flex items-center gap-1">
//                       <AppstoreAddOutlined />
//                       Rooms: {property?.rooms || "N/A"}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <AppstoreAddOutlined />
//                       Baths: {property.baths || "N/A"}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <AppstoreAddOutlined />
//                       State: {property.state || "N/A"}
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
//                       onClick={() => router.push(`/detailsHome/${property.id}`)}
//                     >
//                       Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Regular Properties Section */}
//       {regularProperties.length > 0 && (
//         <div className="mt-10">
//           <h2 className="text-xl font-bold text-gray-600 mb-4">🏠Not Promoted Properties</h2>
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//             {regularProperties.map((property) => (
//               <div key={property.id} className="border rounded-lg shadow-md overflow-hidden bg-white p-4">
//                 {/* Image Section (Top) */}
//                 <div className="relative">
//                 <img
//                   src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
//                   alt={property.houseName}
//                   className="w-full h-[150px] object-cover"
//                 />
//                   <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
//                     {property.propertyType === "sell" ? "For Sale" : "For Rent"}
//                   </Tag>
//                 </div>

//                 {/* Content Section (Below Image) */}
//                 <div className="p-3 bg-gray-100">
//                   <h2 className="text-md font-bold text-gray-800">{property.houseName || "Unnamed Property"}</h2>
//                   <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
//                     <EnvironmentOutlined />
//                     {property.address || "No address provided"}
//                   </p>

//                   <div className="flex justify-between items-center mb-2">
//                     <p className="text-green-600 font-bold text-lg">$ {property.price || "N/A"}</p>
//                     <div className="text-gray-500 text-sm flex items-center gap-1">
//                       <HomeOutlined />
//                       Type: {property.type || "N/A"}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-3 gap-2 text-gray-600 text-sm mb-4">
//                     <div className="flex items-center gap-1">
//                       <AppstoreAddOutlined />
//                       Rooms: {property?.rooms || "N/A"}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <AppstoreAddOutlined />
//                       Baths: {property.baths || "N/A"}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <AppstoreAddOutlined />
//                       State: {property.state || "N/A"}
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
//                       onClick={() => router.push(`/detailsHome/${property.id}`)}
//                     >
//                       Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {!isLoading && promotedProperties.length === 0 && regularProperties.length === 0 && (
//         <p className="text-center text-gray-500 mt-6">No properties found.</p>
//       )}
//     </div>
//   );
// };

// export default AllProperty;


"use client";

import React, { useEffect, useState } from "react";
import { Button, Tag } from "antd";
import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import url from "@/redux/api/baseUrl";
import { useGetAllpropertyQuery } from "@/redux/fetures/property/getAllProperty";
// Import Swiper components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { MdBathroom, MdOutlineBathtub, MdOutlineRealEstateAgent } from "react-icons/md";

const AllProperty = ({ searchCriteria }) => {
  const router = useRouter();
  const state = searchCriteria?.selectedState;
  const subState = searchCriteria?.selectedSubState;
  const propertyType = searchCriteria?.transactionType;
  const [isMobile, setIsMobile] = useState(false);

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const { data: propertiess, isLoading } = useGetAllpropertyQuery({
    state: state || "",
    subState: subState || "",
    propertyType: propertyType || "",
  });

  const properties = propertiess?.data?.attributes?.results || [];

  // Separate promoted and non-promoted properties
  const promotedProperties = properties.filter((property) => property.isPromotion);
  const regularProperties = properties.filter((property) => !property.isPromotion);

  // Property Card Component to avoid repetition
  const PropertyCard = ({ property, isPromoted = false }) => (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white p-4">
      {/* Image Section (Top) */}
      <div className="relative">
        <img
          src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
          alt={property.houseName}
          className={`w-full object-cover ${isPromoted ? "h-[200px]" : "h-[150px]"}`}
        />
        <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
          {property.propertyType === "sell" ? "For Sale" : "For Rent"}
        </Tag>
        {isPromoted && (
          <Tag color="green" className="absolute top-2 right-2 px-3 py-1 text-sm font-semibold">
            Promoted
          </Tag>
        )}
      </div>

      {/* Content Section (Below Image) */}
      <div className={`p-3 ${isPromoted ? "bg-green-50" : "bg-gray-100"}`}>
        <h2 className={`${isPromoted ? "text-lg" : "text-md"} font-bold text-gray-800`}>
          {property.houseName || "Unnamed Property"}
        </h2>
        <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
          <EnvironmentOutlined />
          {property.place || "No address provided"}
        </p>

        <div className="flex justify-between items-center mb-2">
          <p className={`text-green-600 font-bold ${isPromoted ? "text-xl" : "text-lg"}`}>
            $ {property.price || "N/A"}
          </p>
          <div className="text-gray-500 text-sm flex items-center gap-1">
            <HomeOutlined />
            Type: {property.type || "N/A"}
          </div>
        </div>

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

        <div className="flex gap-3">
          <button
            className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            onClick={() => router.push(`/detailsHome/${property.id}`)}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:container mt-12 min-h-[600px] mb-20 md:mt-16">
      {/* Heading Section */}
      <div className="text-center mb-8">
        <h1 className="text-[#2FC639] text-2xl">Your Finder Property</h1>
      </div>

      {/* Promoted Properties Section */}
      {promotedProperties.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-green-600 mb-4">🔥 Promoted Properties</h2>
          
          {isMobile ? (
            <Swiper
              // slidesPerView={1.2}
              spaceBetween={10}
              pagination={pagination}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              modules={[Pagination, Autoplay]}   
              className="mySwiper"
            >
              {promotedProperties.map((property) => (
                <SwiperSlide key={property.id}>
                  <PropertyCard property={property} isPromoted={true} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-4 gap-6">
              {promotedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} isPromoted={true} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Regular Properties Section */}
      {regularProperties.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-600 mb-4">🏠 Not Promoted Properties</h2>
          
          {isMobile ? (
            <Swiper
              slidesPerView={1.2}
              spaceBetween={10}
              pagination={pagination}
              modules={[Pagination]}
              className="mySwiper"
            >
              {regularProperties.map((property) => (
                <SwiperSlide key={property.id}>
                  <PropertyCard property={property} isPromoted={false} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {regularProperties.map((property) => (
                <PropertyCard key={property.id} property={property} isPromoted={false} />
              ))}
            </div>
          )}
        </div>
      )}

      {!isLoading && promotedProperties.length === 0 && regularProperties.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No properties found.</p>
      )}
    </div>
  );
};

export default AllProperty;