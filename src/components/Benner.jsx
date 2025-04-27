 

// "use client";
// import React, { useState } from "react";
// import { Select, Button, message } from "antd";
// import states from "./statesData";
// const { Option } = Select;

// const Banner = ({ onSearch }) => {
//   const [houseName, setHouseName] = useState("");
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedSubState, setSelectedSubState] = useState(null);
//   const [transactionType, setTransactionType] = useState("rent");
//   const [openSubState, setOpenSubState] = useState(false);

//   const handleStateChange = (value) => {
//     setSelectedState(value);
//     setSelectedSubState(null);
//     setOpenSubState(true);
//   };

//   const handleSubStateChange = (value) => {
//     setSelectedSubState(value);
//     setOpenSubState(false);
//   };

//   const handleTransactionChange = (value) => {
//     setTransactionType(value);
//   };

//   const handleSearch = () => {
//     if (!selectedState || !selectedSubState || !transactionType) {
//       message.error("Please fill in all fields before searching.");
//       return;
//     }

//     // Prepare search criteria
//     const criteria = {
//       houseName,
//       selectedState,
//       selectedSubState,
//       transactionType,
//     };

//     // Pass search criteria to the parent component
//     onSearch(criteria);

//     console.log("Search Criteria Updated:", criteria);
//   };

//   return (
//     <div className="relative">
//       <div
//         className="bg-cover bg-center   lg:h-[550px] flex items-center justify-center"
//         style={{
//           backgroundImage: "url('/images/Hero.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-50"></div>
//         <div className="md:text-center w-[900px] z-10 px-4">
//           <h1 className="text-2xl text-[#2FC639] md:mt-1 mt-8 font-sans lg:text-[50px] font-bold mb-4">
//             The easy way to search for property <br />
//             <p className="mt-2 md:mt-4">to buy or rent.</p>
//           </h1>
//           <p className="text-white text-left md:text-2xl md:mt-10 font-sans font-semibold mb-4">
//             From Studio, Self-con for student Youth Corpers, single or detached
//             homes or even a luxury apartments for families. Whatever home you're
//             looking for, we're here to help with Nigeria's largest selection of   homes to buy and rent.
          
//           </p>

//           {/* Search Filters */}
//           <div className="md:mt-20  gap-4 lg:gap-2 bg-white py-3 px-5 rounded-lg shadow-lg w-[70%] mx-auto md:w-full max-w-4xl">

//           <h2 className="text-[16px] text-center md:text-left text-gray-700">
//         Find the Property
//       </h2>
//           <div className="flex flex-col  lg:flex-row">
//             <Select
//               className="md:w-full  md:ml-0 mx-2 h-10 w-44"
//               placeholder="Select a state"
//               value={selectedState}
//               onChange={handleStateChange}
//             >
//               {Object.keys(states).map((state) => (
//                 <Option key={state} value={state}>
//                   {state}
//                 </Option>
//               ))}
//             </Select>

//             {/* Local Government Selection */}
//             <Select
//               className="md:w-full  md:ml-0 mx-2 md:mt-0 md:mb-0 mt-2 mb-2 h-10 w-44"
//               placeholder="Select a local government"
//               value={selectedSubState}
//               onChange={handleSubStateChange}
//               open={openSubState}
//               disabled={!selectedState}
//             >
//               {(selectedState ? states[selectedState] : []).map((subState) => (
//                 <Option key={subState} value={subState}>
//                   {subState}
//                 </Option>
//               ))}
//             </Select>

//                <Select
//                 className="flex-1  md:ml-0 mx-2  h-12 w-44"
//                 placeholder="For Rent"
//                 size="large"
//                 defaultValue={transactionType}
//                 onChange={handleTransactionChange}
//               >
//                 <Option value="rent">Rent</Option>
//                 <Option value="sell">Sell</Option>
//               </Select>

//             {/* Search Button */}
//             <Button
//               type="primary"
//               className="bg-green-600 hover:bg-green-500 h-10 mx-2 mt-6 md:mt-0 px-6 text-white font-bold"
//               onClick={handleSearch}
//             >
//               Search
//             </Button>
//           </div>
//           </div>

          
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;

 

"use client";
import React, { useState, useEffect } from "react";
import { Select, Button, message } from "antd";
import states from "./statesData";
const { Option } = Select;

const Banner = ({ onSearch }) => {
  const [houseName, setHouseName] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSubState, setSelectedSubState] = useState(null);
  const [transactionType, setTransactionType] = useState("rent");
  const [openSubState, setOpenSubState] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of banner images
  const bannerImages = [
    "/images/Hero.jpg",
    "/images/bck1.jpg", // You'll need to add these images to your project
    "/images/bck2.jpg"  // You'll need to add these images to your project
  ];

  // Effect for image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStateChange = (value) => {
    setSelectedState(value);
    setSelectedSubState(null);
    setOpenSubState(true);
  };

  const handleSubStateChange = (value) => {
    setSelectedSubState(value);
    setOpenSubState(false);
  };

  const handleTransactionChange = (value) => {
    setTransactionType(value);
  };

  const handleSearch = () => {
    if (!selectedState || !selectedSubState || !transactionType) {
      message.error("Please fill in all fields before searching.");
      return;
    }

    // Prepare search criteria
    const criteria = {
      houseName,
      selectedState,
      selectedSubState,
      transactionType,
    };

    // Pass search criteria to the parent component
    onSearch(criteria);

    console.log("Search Criteria Updated:", criteria);
  };

  return (
    <div className="relative">
      <div className="relative lg:h-[750px] flex items-center justify-center overflow-hidden">
        {/* Image Slider */}
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: index === currentImageIndex ? 1 : 0,
              zIndex: index === currentImageIndex ? 1 : 0,
            }}
          ></div>
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-[2]"></div>
        
        {/* Content */}
        <div className="md:text-center w-[900px] z-10 px-4 relative z-[3]">
          <h1 className="text-2xl text-[#2FC639] md:mt-1 mt-8 font-sans lg:text-[50px] font-bold mb-4">
            The easy way to search for property <br />
            <p className="mt-2 md:mt-4">to buy or rent.</p>
          </h1>
          <p className="text-white text-left md:text-2xl md:mt-10 font-sans font-semibold mb-4">
            From Studio, Self-con for student Youth Corpers, single or detached
            homes or even a luxury apartments for families. Whatever home you're
            looking for, we're here to help with Nigeria's largest selection of homes to buy and rent.
          </p>

          {/* Search Filters */}
          <div className="md:mt-20 gap-4 lg:gap-2 bg-white py-3 px-5 rounded-lg shadow-lg w-[70%] mx-auto md:w-full max-w-4xl">
            <h2 className="text-[16px] text-center md:text-left text-gray-700">
              Find the Property
            </h2>
            <div className="flex flex-col lg:flex-row">
              <Select
                className="md:w-full md:ml-0 mx-2 h-10 w-44"
                placeholder="Select a state"
                value={selectedState}
                onChange={handleStateChange}
              >
                {Object.keys(states).map((state) => (
                  <Option key={state} value={state}>
                    {state}
                  </Option>
                ))}
              </Select>

              {/* Local Government Selection */}
              <Select
                className="md:w-full md:ml-0 mx-2 md:mt-0 md:mb-0 mt-2 mb-2 h-10 w-44"
                placeholder="Select a local government"
                value={selectedSubState}
                onChange={handleSubStateChange}
                open={openSubState}
                disabled={!selectedState}
              >
                {(selectedState ? states[selectedState] : []).map((subState) => (
                  <Option key={subState} value={subState}>
                    {subState}
                  </Option>
                ))}
              </Select>

              <Select
                className="flex-1 md:ml-0 mx-2 h-12 w-44"
                placeholder="For Rent"
                size="large"
                defaultValue={transactionType}
                onChange={handleTransactionChange}
              >
                <Option value="rent">Rent</Option>
                <Option value="sell">Sell</Option>
              </Select>

              {/* Search Button */}
              <Button
                type="primary"
                className="bg-green-600 hover:bg-green-500 h-10 mx-2 mt-6 md:mt-0 px-6 text-white font-bold"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
