 
 

// "use client";

// import React, { useEffect } from "react";
// import { Button, Tag } from "antd";
// import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
// import Header from "./customComponent/Header";
// import Link from "next/link";
// import url from "@/redux/api/baseUrl";
// import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
// import { useRouter } from "next/navigation";
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

//   // Extract properties and sort them based on isPromotion
//   const properties = propertiess?.data?.attributes?.results || [];
//   const sortedProperties = [...properties].sort((a, b) => {
//     if (a.isPromotion === b.isPromotion) return 0; // If both are equal, no change
//     return a.isPromotion ? -1 : 1; // Bring promoted properties to the top
//   });

//   return (
//     <div className="container mt-56 min-h-[600px] md:mt-16">
//       {/* Heading Section */}
//       <div className="text-center mb-8">
//         <h1 className="text-[#2FC639] text-2xl">Your finder Property</h1>
//       </div>

//       {/* Property Cards Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {isLoading ? (
//           <p className="text-center text-gray-500">Loading properties...</p>
//         ) : sortedProperties?.length === 0 ? (
//           <p className="text-center text-gray-500">No properties found.</p>
//         ) : (
//           sortedProperties?.map((property) => (
//             <div
//               key={property.id}
//               className="border rounded-lg shadow-md overflow-hidden bg-white"
//             >
//               {/* Image Section */}
//               <div className="relative">
//                 <img
//                   src={property?.image?.url ? url + property.image.url : "/images/default-home.png"}
//                   alt={property.houseName}
//                   className="w-full h-[200px] object-cover"
//                 />
//                 <Tag
//                   color="red"
//                   className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold"
//                 >
//                   {property.propertyType === "sell" ? "For Sale" : "For Rent"}
//                 </Tag>
//                 {property.isPromotion && (
//                   <Tag
//                     color="green"
//                     className="absolute top-2 right-2 px-3 py-1 text-sm font-semibold"
//                   >
//                     Promoted
//                   </Tag>
//                 )}
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
//                     ${property.price || "N/A"}
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
//                       router.push(`/detailsHome/${property.id}`);
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

// export default AllProperty;
"use client";

import React from "react";
import { Button, Tag } from "antd";
import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import url from "@/redux/api/baseUrl";
import { useGetAllpropertyQuery } from "@/redux/fetures/property/getAllProperty";

const AllProperty = ({ searchCriteria }) => {
  const router = useRouter();
  const state = searchCriteria?.selectedState;
  const subState = searchCriteria?.selectedSubState;
  const propertyType = searchCriteria?.transactionType;

  const { data: propertiess, isLoading } = useGetAllpropertyQuery({
    state: state || "",
    subState: subState || "",
    propertyType: propertyType || "",
  });

  const properties = propertiess?.data?.attributes?.results || [];

  // Separate promoted and non-promoted properties
  const promotedProperties = properties.filter((property) => property.isPromotion);
  const regularProperties = properties.filter((property) => !property.isPromotion);

  return (
    <div className="container mt-56 min-h-[600px] mb-20 md:mt-16">
      {/* Heading Section */}
      <div className="text-center mb-8">
        <h1 className="text-[#2FC639] text-2xl">Your Finder Property</h1>
      </div>

      {/* Promoted Properties Section */}
      {promotedProperties.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-green-600 mb-4">🔥 Promoted Properties</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {promotedProperties.map((property) => (
              <div key={property.id} className="border rounded-lg shadow-md overflow-hidden bg-white lg:col-span-2">
                {/* Image Section (Top) */}
                <div className="relative">
                  <img
                    src={property?.image?.url ? url + property.image.url : "/images/default-home.png"}
                    alt={property.houseName}
                    className="w-full h-[250px] object-cover"
                  />
                  <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
                    {property.propertyType === "sell" ? "For Sale" : "For Rent"}
                  </Tag>
                  <Tag color="green" className="absolute top-2 right-2 px-3 py-1 text-sm font-semibold">
                    Promoted
                  </Tag>
                </div>

                {/* Content Section (Below Image) */}
                <div className="p-6 bg-green-50">
                  <h2 className="text-lg font-bold text-gray-800">{property.houseName || "Unnamed Property"}</h2>
                  <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
                    <EnvironmentOutlined />
                    {property.address || "No address provided"}
                  </p>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-green-600 font-bold text-xl">₦ {property.price || "N/A"}</p>
                    <div className="text-gray-500 text-sm flex items-center gap-1">
                      <HomeOutlined />
                      Type: {property.type || "N/A"}
                    </div>
                  </div>

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
            ))}
          </div>
        </div>
      )}

      {/* Regular Properties Section */}
      {regularProperties.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-600 mb-4">🏠Not Promoted Properties</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {regularProperties.map((property) => (
              <div key={property.id} className="border rounded-lg shadow-md overflow-hidden bg-white p-4">
                {/* Image Section (Top) */}
                <div className="relative">
                  <img
                    src={property?.image?.url ? url + property.image.url : "/images/default-home.png"}
                    alt={property.houseName}
                    className="w-full h-[150px] object-cover"
                  />
                  <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
                    {property.propertyType === "sell" ? "For Sale" : "For Rent"}
                  </Tag>
                </div>

                {/* Content Section (Below Image) */}
                <div className="p-3 bg-gray-100">
                  <h2 className="text-md font-bold text-gray-800">{property.houseName || "Unnamed Property"}</h2>
                  <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
                    <EnvironmentOutlined />
                    {property.address || "No address provided"}
                  </p>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-green-600 font-bold text-lg">₦ {property.price || "N/A"}</p>
                    <div className="text-gray-500 text-sm flex items-center gap-1">
                      <HomeOutlined />
                      Type: {property.type || "N/A"}
                    </div>
                  </div>

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
            ))}
          </div>
        </div>
      )}

      {!isLoading && promotedProperties.length === 0 && regularProperties.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No properties found.</p>
      )}
    </div>
  );
};

export default AllProperty;
