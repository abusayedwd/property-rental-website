// "use client";

// import React from "react";
// import { Button, Tag } from "antd";
// import {
//   EnvironmentOutlined,
//   HomeOutlined,
//   AppstoreAddOutlined,
// } from "@ant-design/icons";
// import { useParams, useRouter } from "next/navigation";
// import { useGetSinglepropertyQuery } from "@/redux/fetures/property/getPropertyById";

// const DetailsPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const { id } = params;

//   const { data: propertys, isLoading } = useGetSinglepropertyQuery(id, { skip: !id });
//   const property = propertys?.data?.attributes;

//   if (isLoading) {
//     return <div className="text-center text-lg font-bold">Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto mt-8 pt-5 py-12">
//       <h1 className="text-center text-3xl font-bold text-green-600 mb-8">Property Details</h1>

//       <div className="max-w-3xl mx-auto border border-green-300 rounded-lg shadow-lg p-6 bg-white relative">
//         {property.isPromotion && (
//           <Tag
//             color="red"
//             className="absolute top-4 left-4 px-3 py-1 text-sm font-semibold uppercase"
//           >
//             Promoted
//           </Tag>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">{property.houseName}</h2>
//             <p className="text-gray-500 flex items-center gap-2 mt-2">
//               <EnvironmentOutlined className="text-green-500" />
//               {property.address}, {property.state}, {property.subState}
//             </p>
//             <p className="text-green-600 text-xl font-bold mt-4">Price: ${property.price}</p>
//             <p className="text-gray-500 text-sm mt-1">Type: {property.type}</p>

//             <div className="flex items-center gap-4 mt-4 text-gray-600">
//               <div className="flex items-center gap-1">
//                 <AppstoreAddOutlined /> Rooms: {property.rooms}
//               </div>
//               <div className="flex items-center gap-1">
//                 <AppstoreAddOutlined /> Baths: {property.baths}
//               </div>
//             </div>
//           </div>

//           <div>
//             <img
//               src={property.image?.url}
//               alt={property.houseName}
//               className="w-full h-auto rounded-lg shadow-md"
//             />
//           </div>
//         </div>

//         <div className="flex justify-between mt-6">
//           <Button
//             onClick={() => router.back()}
//             className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-2 rounded-lg"
//           >
//             Back
//           </Button>
//           <Button
//             type="primary"
//             className="bg-green-600 text-white hover:bg-green-500 px-6 py-2 rounded-lg"
//           >
//             Message Now
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailsPage;



"use client";

import React from "react";
import { Button, Tag } from "antd";
import { 
  EnvironmentOutlined, 
  HomeOutlined, 
  AppstoreAddOutlined, 
  CalendarOutlined,
  TagOutlined,
  DollarOutlined
} from "@ant-design/icons";
import { useParams } from "next/navigation";
import { useGetSinglepropertyQuery } from "@/redux/fetures/property/getPropertyById";
import url from "@/redux/api/baseUrl";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";

const DetailsPage = () => {
  const params = useParams();
  const { id } = params;

   const {data: user} = useLogedUserQuery()
    // console.log(user)
  
    const role = user?.data?.attributes?.user?.role;
    // console.log(role)
  
  const { data: propertys, isLoading } = useGetSinglepropertyQuery(id, { skip: !id });
  const property = propertys?.data?.attributes;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!property) {
    return <div>No property found</div>;
  }

  return (
    <div className="container mx-auto mt-8 pt-5 py-12">
      <h1 className="text-center text-3xl font-bold text-green-600 mb-8">Property Details</h1>

      <div className="max-w-4xl mx-auto border border-green-300 rounded-lg shadow-lg p-6 bg-white">
        {/* Property Image */}
        <div className="mb-6">
          <img
            src={url + property.image?.url || '/placeholder-image.jpg'}
            alt={property.houseName}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{property.houseName}</h2>
            
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-600">
                <EnvironmentOutlined className="text-green-500" />
                <strong>Address:</strong> {property.address}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <HomeOutlined className="text-green-500" />
                <strong>Property Type:</strong> {property.propertyType}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <TagOutlined className="text-green-500" />
                <strong>Type:</strong> {property.type}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <DollarOutlined className="text-green-500" />
                <strong>Price:</strong> ${property.price}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-600">
                <AppstoreAddOutlined className="text-green-500" />
                <strong>Rooms:</strong> {property.rooms}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <AppstoreAddOutlined className="text-green-500" />
                <strong>Bathrooms:</strong> {property.baths}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <HomeOutlined className="text-green-500" />
                <strong>State:</strong> {property.state}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <HomeOutlined className="text-green-500" />
                <strong>Sub-State:</strong> {property.subState}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <CalendarOutlined className="text-green-500" />
                <strong>Created At:</strong> {new Date(property.createdAt).toLocaleDateString()}
              </p>
              {property.isPromotion && (
                <Tag color="green" className="mt-2">Promotion Available</Tag>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={() => window.history.back()}
            className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-2 rounded-lg"
          >
            Back
          </Button>
          {role === "user" && (
        <Button
          type="primary"
          className="bg-green-600 text-white hover:bg-green-500 px-6 py-2 rounded-lg"
        >
          Messages With Landlord
        </Button>
      )}
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
