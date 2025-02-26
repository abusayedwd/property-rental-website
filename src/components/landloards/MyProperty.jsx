 


// "use client"
// import React, { useState } from "react";
// import { Button, Tag, Pagination, Menu } from "antd";
// import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
// import Link from "next/link";
// import Header from "../customComponent/Header";
// import { useGetMypropertyQuery } from "@/redux/fetures/property/getMyproperty";
// import url from "@/redux/api/baseUrl";
// import { useRouter } from "next/navigation";
// import { usePaymentMutation } from "@/redux/fetures/payment/payment";
// // import { loadStripe } from "@stripe/stripe-js";

// // const stripePromise = loadStripe("your-public-stripe-key"); // Replace with your actual Stripe publishable key

// const MyProperty = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const router = useRouter()


 

//   // Dropdown menu options
//   const menu = (
//     <Menu
//       onClick={({ key }) => console.log(`Selected: ${key}`)}
//       items={[
//         { key: "rent", label: "Rent" },
//         { key: "sell", label: "Sell" }
//       ]}
//     />
//   );

//   const { data: myProperty, isLoading } = useGetMypropertyQuery({ page: currentPage, limit: pageSize });
//   console.log(myProperty)

//   const properties = myProperty?.data?.attributes?.results || [];
//   const totalResults = myProperty?.data?.attributes?.totalResults || 0;

//   const handlePageChange = (page, pageSize) => {
//     setCurrentPage(page);
//     setPageSize(pageSize);
//   };

//   const [payment, ] = usePaymentMutation()
//   // Handle payment for promotion
//   const handlePromotionPayment = async (propertyId) => {
//     console.log(propertyId)
//       const id = {
//         propertyId
//       }
//     try{
//       const res= await payment(id).unwrap();
//       console.log(res)
//       if(res?.status === 200){
//         router.push(res?.url)
//       }
//     }catch(error){
//       console.log(error)
//     }
    
 
//   };

//   return (
//     <div className="container my-6 min-h-screen md:my-12">
//       <div className="text-center mb-8">
//         <Header size="large" className="text-green-700">
//           My Property
//         </Header>
//       </div>

//       <div className="text-right py-4">
//         <Link href="/addproperty">
//           <Button className="!text-white !bg-[#1A3459] p-4 font-semibold">
//             Add Property
//           </Button>
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {isLoading ? (
//           <p className="text-center text-gray-500">Loading properties...</p>
//         ) : properties?.length === 0 ? (
//           <p className="text-center text-gray-500">No properties found.</p>
//         ) : (
//           properties.map((property) => (
//             <div key={property.id} className="border rounded-lg shadow-md overflow-hidden bg-white">

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
   
 

//               <div className="p-4 bg-green-50">
//                 <h2 className="text-lg font-bold text-gray-800 mb-1">
//                   {property.houseName || "Unnamed Property"}
//                 </h2>
//                 <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
//                   <EnvironmentOutlined />
//                   {property.address || "No address provided"}
//                 </p>

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

//                 {/* Promotion Section */}
                

//                 <div className="flex gap-3 mt-3">
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
//                   <div className="text-right">
//                   {property?.isPromotion ? (
//                     <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
//                       Promoted
//                     </span>
//                   ) : (
//                     <button
//                       className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition"
//                       onClick={() => handlePromotionPayment(property?.id)}
//                     >
//                       Promote For - $2
//                     </button>
//                   )}
//                 </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

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

// export default MyProperty;



"use client";
import React, { useState } from "react";
import { Button, Tag, Pagination, Menu, Dropdown, Space } from "antd";
import { EnvironmentOutlined, HomeOutlined, AppstoreAddOutlined, MoreOutlined } from "@ant-design/icons";
import Link from "next/link";
import Header from "../customComponent/Header";
import { useGetMypropertyQuery } from "@/redux/fetures/property/getMyproperty";
import url from "@/redux/api/baseUrl";
import { useRouter } from "next/navigation";
import { usePaymentMutation } from "@/redux/fetures/payment/payment";
import { usePropertyStatusMutation } from "@/redux/fetures/property/propertyStatus";
import toast, { Toaster } from "react-hot-toast";

const MyProperty = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();
  const [value, setValue] = useState('')

  const { data: myProperty, isLoading } = useGetMypropertyQuery({ page: currentPage, limit: pageSize });
  const properties = myProperty?.data?.attributes?.results || [];
  const totalResults = myProperty?.data?.attributes?.totalResults || 0;

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const [payment] = usePaymentMutation();

  // Handle payment for promotion
  const handlePromotionPayment = async (propertyId) => {
    console.log(propertyId);
    const id = { propertyId };
    try {
      const res = await payment(id).unwrap();
      console.log(res);
      if (res?.status === true ) {
        window.open(res?.authorizationUrl, "_blank");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get Property Status
  const getPropertyStatus = (propertyType) => {
    switch (propertyType) {
      case "sold":
        return "Sold";
      case "rented":
        return "Rented";
      case "sell":
      case "for sell":
        return "For Sale";
      case "rent":
      case "for rent":
        return "For Rent";
      default:
        return "Unknown";
    }
  };

  // Dropdown menu
  const [selectedProperty, setSelectedProperty] = useState(null);
  // console.log(selectedProperty)
  const [updatestatus] = usePropertyStatusMutation()

  const renderDropdownMenu = (property) => (
    <Menu
      onClick={ async ({ key }) => {
        setSelectedProperty({ id: property.id, type: key });
        console.log(`Selected: ${key} for property ${property.id}`);
         try{

           const res = await updatestatus({id:property?.id, propertyType : key}) 
             console.log(res) 
             if(res.error?.status==403){
               toast.error(res?.error?.data?.message) 
             }else{ 
               toast.success(res?.data?.message)
             }
         
         }catch(error){
          console.log(error)
          toast.error(res?.error?.data?.message)
         }
       

      }}
      items={[
        { key: "rented", label: "rented" },
        { key: "sold", label: "sold" }
      ]}
    />

    
  );

  return (
    <div className="container my-6 min-h-screen md:my-12">
      <Toaster />
      <div className="text-center mb-8">
        <Header size="large" className="text-green-700">
          My Property
        </Header>
      </div>

      <div className="text-right py-4">
        <Link href="/addproperty">
          <Button className="!text-white !bg-[#1A3459] p-4 font-semibold">Add Property</Button>
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
              {/* Property Image & Status */}
              <div className="relative">
                <img
                  src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
                  alt={property.houseName}
                  className="w-full h-[200px] object-cover"
                />
                <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
                  {getPropertyStatus(property.propertyType)}
                  
                </Tag>

                {/* Show Dropdown only if NOT Sold or Rented */}
                {!(property.propertyType === "sold" || property.propertyType === "rented") && (
                  <Dropdown overlay={renderDropdownMenu(property)} trigger={["click"]}>
                    <MoreOutlined className="absolute top-2 font-bold  right-2 text-2xl cursor-pointer" />
                  </Dropdown>
                )}
              </div>

              {/* Property Details */}
              <div className="p-4 bg-green-50">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{property.houseName || "Unnamed Property"}</h2>
                <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
                  <EnvironmentOutlined />
                  {property.place || "No address provided"}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <p className="text-green-600 font-bold text-xl">₦{property.price || "N/A"}</p>
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
                  <div className="text-right">
                    {property?.isPromotion ? (
                      <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                        Promoted
                      </span>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition"
                        onClick={() => handlePromotionPayment(property?.id)}
                      >
                        Promote For - ₦ 3000
                      </button>
                    )}
                  </div>
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

export default MyProperty;
