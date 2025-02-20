 

// "use client"

// import React from "react";
// import { Button, Tag } from "antd";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { 
//   EnvironmentOutlined, 
//   HomeOutlined, 
//   AppstoreAddOutlined, 
//   CalendarOutlined,
//   TagOutlined,
//   DollarOutlined
// } from "@ant-design/icons";
// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/pagination';

// import './styles.css'; 

// import { Pagination } from 'swiper/modules';
// // import { 
// //   EnvironmentOutlined, 
// //   HomeOutlined, 
// //   TagOutlined, 
// //   DollarOutlined
// // } from "@ant-design/icons";
// import { MdBedroomParent } from "react-icons/md";
// import { LuBath } from "react-icons/lu";
// import { useParams } from "next/navigation";
// import { useGetSinglepropertyQuery } from "@/redux/fetures/property/getPropertyById";
// import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
// import { useCreatChatMutation } from "@/redux/fetures/messaging/createChat";
// import { useRouter } from "next/navigation";
// import url from "@/redux/api/baseUrl";

// const DetailsPage = () => {
//   const params = useParams();
//   const { id } = params;
//   const router = useRouter();

//   const { data: user } = useLogedUserQuery();
//   const role = user?.data?.attributes?.user?.role;

//   const [chatcreat] = useCreatChatMutation();
  
//   const { data: propertys, isLoading } = useGetSinglepropertyQuery(id, { skip: !id });
//   const property = propertys?.data?.attributes;

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!property) {
//     return <div>No property found</div>;
//   }

//   const messages = async (id) => {
//     const data = { senderId: id };
//     try {
//       const res = await chatcreat(data).unwrap();
//       if (res?.code === 201) { 
//         router.push(`/messages?chatId=${res?.data?.attributes?.id}`);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const pagination = {
//     clickable: true,
//     renderBullet: function (index, className) {
//       return '<span class="' + className + '">' + (index + 1) + '</span>';
//     },
//   };

//   return (
//     <div className="container mx-auto mt-8 pt-5 py-12">
//       <h1 className="text-center text-3xl font-bold text-green-600 mb-8">Property Details</h1>

//       <div className="max-w-4xl mx-auto border border-green-300 rounded-lg shadow-lg p-6 bg-white">
//         <div className="mb-6">
//           <Swiper pagination={pagination} modules={[Pagination]} className="mySwiper">
//             {property?.images?.map((image, index) => (
//               <SwiperSlide key={index}>
//                 <img src={url + image.url} alt={`property-image-${index}`} className="w-full h-[200px]" />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">{property.houseName}</h2>
//             <div className="space-y-3">
//               <p className="flex items-center gap-2 text-gray-600">
//                 <EnvironmentOutlined className="text-green-500" />
//                 <strong>Place:</strong> {property.place}
//               </p>
//               <p className="flex items-center gap-2 text-gray-600">
//                 <HomeOutlined className="text-green-500" />
//                 <strong>Property Type:</strong> {property.propertyType}
//               </p>
//               <p className="flex items-center gap-2 text-gray-600">
//                 <TagOutlined className="text-green-500" />
//                 <strong>Type:</strong> {property.type}
//               </p>
//               <p className="flex items-center gap-2 text-gray-600">
//                 <DollarOutlined className="text-green-500" />
//                 <strong>Price:</strong> ₦ {property.price}
//               </p>
//             </div>
//           </div>

//           <div>
//             <div className="space-y-3">
//               <p className="flex items-center gap-2 text-gray-600">
//                 <MdBedroomParent className="text-green-500" />
//                 <strong>Rooms:</strong> {property.rooms}
//               </p>
//               <p className="flex items-center gap-2 text-gray-600">
//                 <LuBath className="text-green-500" />
//                 <strong>Bathrooms:</strong> {property.baths}
//               </p>
//               <p className="flex items-center gap-2 text-gray-600">
//                 <EnvironmentOutlined className="text-green-500" />
//                 <strong>State:</strong> {property.state}
//               </p>
//               <p className="flex items-center gap-2 text-gray-600">
//                 <EnvironmentOutlined className="text-green-500" />
//                 <strong>L.G.A:</strong> {property.subState} 
//               </p>
//               <p className="flex items-center gap-2 text-gray-600">
//                 <CalendarOutlined className="text-green-500" />
//                 <strong>Created At:</strong> {new Date(property.createdAt).toLocaleDateString()}
//               </p>
//               <p>
//                 Owner: <Tag color="green" className="mt-2 font-bold">{property?.landlordId?.fullName}</Tag>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-between mt-6">
//           <Button
//             onClick={() => window.history.back()}
//             className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-2 rounded-lg"
//           >
//             Back
//           </Button>

//           {role === "user" && (
//             <Button
//               type="primary"
//               className="bg-green-600 text-white hover:bg-green-500 md:px-6 py-2 rounded-lg"
//               onClick={() => messages(property?.landlordId?.id)}
//             >
//               Messages With Landlord
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailsPage;

"use client";

import React from "react";
import { Button, Tag } from "antd";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';
import { Autoplay, Pagination } from 'swiper/modules';
import { 
  EnvironmentOutlined, 
  HomeOutlined, 
  TagOutlined,
  DollarOutlined,
  CalendarOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { MdBedroomParent } from "react-icons/md";
import { useParams } from "next/navigation";
import { useGetSinglepropertyQuery } from "@/redux/fetures/property/getPropertyById";
import url from "@/redux/api/baseUrl";
import { useLogedUserQuery } from "@/redux/fetures/user/logedUser";
import { useCreatChatMutation } from "@/redux/fetures/messaging/createChat";
import { useRouter } from "next/navigation";
import { LuBath } from "react-icons/lu";
import CustomBanner from "./customComponent/customBanner";

const DetailsPage = () => {
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const { data: user } = useLogedUserQuery();
  const role = user?.data?.attributes?.user?.role;

  const [chatcreat] = useCreatChatMutation();
  
  const { data: propertys, isLoading } = useGetSinglepropertyQuery(id, { skip: !id });
  const property = propertys?.data?.attributes;
  console.log(property)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!property) {
    return <div>No property found</div>;
  }

  const messages = async (id) => {
    const data = {
      senderId: id
    };
    try {
      const res = await chatcreat(data).unwrap();
      if (res?.code === 201) { 
        router.push(`/messages?chatId=${res?.data?.attributes?.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };

  return (
    <div> 
      <CustomBanner />
    <div className="container mx-auto mt-8 pt-5 py-12">
      <h1 className="text-center text-3xl font-bold text-green-600 mb-8">Property Details</h1>

      <div className="max-w-4xl mx-auto border border-green-300 rounded-lg shadow-lg p-6 bg-white">
        <div className="mb-6">
          <Swiper
            pagination={pagination}
            modules={[Pagination, Autoplay]}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            className="mySwiper rounded-lg overflow-hidden"
            style={{ height: '350px' }}
          >
            {property.images.map((image, index) => (
              <SwiperSlide key={image._id}>
                <div className="w-full h-full relative">
                  <img 
                    src={`${url}${image.url}`}
                    alt={`Property Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{property.houseName}</h2>
            
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-600">
                <EnvironmentOutlined className="text-green-500" />
                <strong>Place:</strong> {property.place}
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
                <strong>Price:</strong> ₦ {property.price}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <CalendarOutlined className="text-green-500" />
                <strong>Available From :</strong> {property?.date}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-600">
                <MdBedroomParent className="text-green-500" />
                <strong>Rooms:</strong> {property.rooms}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <LuBath className="text-green-500" />
                <strong>Bathrooms:</strong> {property.baths}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <EnvironmentOutlined className="text-green-500" />
                <strong>State:</strong> {property.state}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <EnvironmentOutlined className="text-green-500" />
                <strong>L.G.A:</strong> {property.subState} 
              </p>
             
              <p className="flex items-center gap-2 text-gray-600">
              <InfoCircleOutlined className="text-green-500" />
                <strong>Other Info:</strong> {property?.textArea}
              </p>
              Owner: <Tag color="green" className="mt-2 font-bold">{property?.landlordId?.fullName}</Tag>
           
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
              className="bg-green-600 text-white hover:bg-green-500 md:px-6 py-2 rounded-lg"
              onClick={() => messages(property?.landlordId?.id)}
            >
              Messages With Landlord
            </Button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default DetailsPage;