 


// "use client";

// import React, { useState } from "react";
// import { Button, Tag, Pagination } from "antd";
// import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
// import Link from "next/link";
// import Header from "../customComponent/Header";
// import { useGetMypropertyQuery } from "@/redux/fetures/property/getMyproperty";
// import url from "@/redux/api/baseUrl";

// const MyPosts = () => {
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   // Fetch properties with pagination
//   const { data: myProperty, isLoading } = useGetMypropertyQuery({ page: currentPage, limit: pageSize });

//   console.log(myProperty);

//   // Ensure properties are available before rendering
//   const properties = myProperty?.data?.attributes?.results || [];
//   const totalResults = myProperty?.data?.attributes?.totalResults || 0;

//   // Handle page change
//   const handlePageChange = (page, pageSize) => {
//     setCurrentPage(page);
//     setPageSize(pageSize);
//   };

//   return (
//     <div className="container my-6 min-h-screen md:my-12">
//       {/* Heading Section */}
//       <div className="text-center mb-8">
//         <Header size="large" className="text-green-700">
//           My Property
//         </Header>
//       </div>

//       <div className="text-right py-4">
//         <Link href="/addpost">
//           <Button className="!text-white !bg-[#1A3459] p-4 font-semibold">
//             Add Property
//           </Button>
//         </Link>
//       </div>

//       {/* Property Cards Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {isLoading ? (
//           <p className="text-center text-gray-500">Loading properties...</p>
//         ) : properties?.length === 0 ? (
//           <p className="text-center text-gray-500">No properties found.</p>
//         ) : (
//           properties.map((property) => (
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
//                 <div className=" text-right">
//       {property?.isPromotion ? (
//         <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
//           Promoted
//         </span>
//       ) : (
//         <button className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition">
//           Promote Your Property
//         </button>
//       )}
//     </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3">
//                   <Link href={`/detailsHome/${property.id}`}>
//                     <button className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-blue-600 transition-all duration-300">
//                       Details
//                     </button>
//                   </Link>
//                   <Link href={`/editpost/${property.id}`}>
//                     <button className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300">
//                       Edit
//                     </button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center mt-6">
//         <Pagination
//           current={currentPage}
//           pageSize={pageSize}
//           total={totalResults}
//           showSizeChanger
//           onChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default MyPosts;
"use client"
import React, { useState } from "react";
import { Button, Tag, Pagination } from "antd";
import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import Link from "next/link";
import Header from "../customComponent/Header";
import { useGetMypropertyQuery } from "@/redux/fetures/property/getMyproperty";
import url from "@/redux/api/baseUrl";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe("your-public-stripe-key"); // Replace with your actual Stripe publishable key

const MyPosts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: myProperty, isLoading } = useGetMypropertyQuery({ page: currentPage, limit: pageSize });

  const properties = myProperty?.data?.attributes?.results || [];
  const totalResults = myProperty?.data?.attributes?.totalResults || 0;

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Handle payment for promotion
  const handlePromotionPayment = async (propertyId) => {
    const stripe = await stripePromise;

    const response = await fetch("http://localhost:5000/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, amount: 2 }),
    });

    const session = await response.json();
    if (session.id) {
      await stripe.redirectToCheckout({ sessionId: session.id });
    } else {
      alert("Error processing payment");
    }
  };

  return (
    <div className="container my-6 min-h-screen md:my-12">
      <div className="text-center mb-8">
        <Header size="large" className="text-green-700">
          My Property
        </Header>
      </div>

      <div className="text-right py-4">
        <Link href="/addpost">
          <Button className="!text-white !bg-[#1A3459] p-4 font-semibold">
            Add Property
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading properties...</p>
        ) : properties?.length === 0 ? (
          <p className="text-center text-gray-500">No properties found.</p>
        ) : (
          properties.map((property) => (
            <div key={property.id} className="border rounded-lg shadow-md overflow-hidden bg-white">
              <div className="relative">
                <img
                  src={property?.image?.url ? url + property.image.url : "/images/default-home.png"}
                  alt={property.houseName}
                  className="w-full h-[200px] object-cover"
                />
                <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
                  {property.propertyType === "sell" ? "For Sale" : "For Rent"}
                </Tag>
              </div>

              <div className="p-4 bg-green-50">
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {property.houseName || "Unnamed Property"}
                </h2>
                <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
                  <EnvironmentOutlined />
                  {property.address || "No address provided"}
                </p>

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

                {/* Promotion Section */}
                <div className="text-right">
                  {property?.isPromotion ? (
                    <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      Promoted
                    </span>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition"
                      onClick={() => handlePromotionPayment(property.id)}
                    >
                      Promote Your Property - $2
                    </button>
                  )}
                </div>

                <div className="flex gap-3 mt-3">
                  <Link href={`/detailsHome/${property.id}`}>
                    <button className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-blue-600 transition-all duration-300">
                      Details
                    </button>
                  </Link>
                  <Link href={`/editpost/${property.id}`}>
                    <button className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalResults}
          showSizeChanger
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MyPosts;
