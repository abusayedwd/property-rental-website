// "use client";
// import React, { useState } from "react";
// import { Input, Select, Button, message } from "antd";
// import states from "./statesData";
// import PopularSell from "./PopularSell";
// import PopularRent from "./PopularRent";
// const { Option } = Select;

// const Banner = () => {
//   const [houseName, setHouseName] = useState("");
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedSubState, setSelectedSubState] = useState(null);
//   const [transactionType, setTransactionType] = useState("rent");
//   const [openSubState, setOpenSubState] = useState(false);

//   // Debugging logs for state changes
//   const handleStateChange = (value) => {
//     console.log("State Selected:", value);
//     setSelectedState(value);
//     setSelectedSubState(null);
//     setOpenSubState(true);
//   };

//   const handleSubStateChange = (value) => {
//     console.log("Local Government Selected:", value);
//     setSelectedSubState(value);
//     setOpenSubState(false);
//   };

//   const handleTransactionChange = (value) => {
//     console.log("Transaction Type Selected:", value);
//     setTransactionType(value);
//   };

//   const handleSearch = () => {
//     console.log("Search button clicked!"); 
//     console.log("State:", selectedState);
//     console.log("Local Government:", selectedSubState);
//     console.log("Transaction Type:", transactionType);

//     if (!houseName || !selectedState || !selectedSubState || !transactionType) {
//       message.error("Please fill in all fields before searching.");
//       return;
//     }

 
    
//     console.log("State:", selectedState);
//     console.log("Local Government:", selectedSubState);
//     console.log("Transaction Type:", transactionType);
//   };

//   return (
//     <div>

//     <div className="relative">
//       <div
//         className="bg-cover bg-center h-[300px] lg:h-[650px] flex items-center justify-center"
//         style={{
//           backgroundImage: "url('/images/Hero.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-50"></div>
//         <div className="md:text-center w-[900px] z-10 px-4">
//           <h1 className="text-2xl text-[#2FC639] md:mt-1 mt-64 font-sans lg:text-[50px] font-bold mb-4">
//             The easy way to search for property <br />
//             <p className="mt-2 md:mt-4">to buy or rent.</p>
//           </h1>
//           <p className="text-white text-left md:text-2xl md:mt-10 font-sans font-semibold mb-4">
//             From Studio, Self-con for student Youth Corpers, single or detached
//             homes or even a luxury apartments for families. Whatever home you're
//             looking for, we're here to help with Nigeria's largest selection of
//             homes to buy and rent.
//           </p>

//           {/* Search Filters */}
//           <div className="flex flex-col lg:flex-row md:mt-20 items-center gap-4 lg:gap-2 bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
//             {/* House Name Input */}
//             {/* <Input
//               placeholder="Search by House Name"
//               className="flex-1 h-12 w-48"
//               value={houseName}
//               onChange={(e) => {
//                 console.log("House Name Input:", e.target.value);
//                 setHouseName(e.target.value);
//               }}
//             /> */}

//             {/* State Selection */}
//             <Select
//               className="md:w-full w-60"
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
//               className="md:w-full w-60"
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

//             {/* Transaction Type Selection */}
//             <Select
//               className="flex-1 h-12 w-60"
//               placeholder="For Rent"
//               size="large"
//               defaultValue={transactionType}
//               onChange={handleTransactionChange}
//             >
//               <Option value="rent">Rent</Option>
//               <Option value="sell">Sell</Option>
//             </Select>

//             {/* Search Button */}
//             <Button
//               type="primary"
//               className="bg-green-600 hover:bg-green-500 h-12 px-6 text-white font-bold"
//               onClick={handleSearch}
//             >
//               Search
//             </Button>
//           </div>
//         </div>
//       </div>


//     </div>

//       <PopularSell />
//       <PopularRent />

//     </div>
//   );
// };

// export default Banner;

"use client";
import React, { useState } from "react";
import { Input, Select, Button, message } from "antd";
import states from "./statesData";
import PopularSell from "./PopularSell";
import PopularRent from "./PopularRent";
const { Option } = Select;

const Banner = () => {
  const [houseName, setHouseName] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSubState, setSelectedSubState] = useState(null);
  const [transactionType, setTransactionType] = useState("rent");
  const [openSubState, setOpenSubState] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState(null);

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

    // Update search criteria state
    setSearchCriteria({
      houseName,
      selectedState,
      selectedSubState,
      transactionType,
    });

    console.log("Search Criteria Updated:", {
      houseName,
      selectedState,
      selectedSubState,
      transactionType,
    });
  };

  return (
    <div>
      <div className="relative">
        <div
          className="bg-cover bg-center h-[300px] lg:h-[650px] flex items-center justify-center"
          style={{
            backgroundImage: "url('/images/Hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="md:text-center w-[900px] z-10 px-4">
            <h1 className="text-2xl text-[#2FC639] md:mt-1 mt-64 font-sans lg:text-[50px] font-bold mb-4">
              The easy way to search for property <br />
              <p className="mt-2 md:mt-4">to buy or rent.</p>
            </h1>
            <p className="text-white text-left md:text-2xl md:mt-10 font-sans font-semibold mb-4">
              From Studio, Self-con for student Youth Corpers, single or detached
              homes or even a luxury apartments for families. Whatever home you're
              looking for, we're here to help with Nigeria's largest selection of
              homes to buy and rent.
            </p>

            {/* Search Filters */}
            <div className="flex flex-col lg:flex-row md:mt-20 items-center gap-4 lg:gap-2 bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
              {/* State Selection */}
              <Select
                className="md:w-full w-60"
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
                className="md:w-full w-60"
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

              {/* Transaction Type Selection */}
              {/* <Select
                className="flex-1 h-12 w-60"
                placeholder="For Rent"
                size="large"
                defaultValue={transactionType}
                onChange={handleTransactionChange}
              >
                <Option value="rent">Rent</Option>
                <Option value="sell">Sell</Option>
              </Select> */}

              {/* Search Button */}
              <Button
                type="primary"
                className="bg-green-600 hover:bg-green-500 h-12 px-6 text-white font-bold"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pass searchCriteria as props */}
      <PopularSell searchCriteria={searchCriteria} />
      <PopularRent searchCriteria={searchCriteria} />
    </div>
  );
};

export default Banner;

