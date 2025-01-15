

"use client";
import React, { useState } from "react";
import { Input, Select, Button } from "antd";
 

const { Option } = Select;

const Banner = () => {
  const [houseName, setHouseName] = useState("");
  const [state, setState] = useState("CA"); 
  const [transactionType, setTransactionType] = useState("rent");  

  const handleSearch = () => {
    console.log("House Name:", houseName);
    console.log("State:", state);
    console.log("Transaction Type:", transactionType);
    // Add your search logic here
  };

  return (
    <div className="relative">
      <div
        className="  bg-cover bg-center h-[200px] lg:h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxSizing: "border-box",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="text-center w-[900px] z-10 px-4">
           
          <div className="flex flex-col lg:flex-row md:mt-10 items-center gap-4 lg:gap-2 bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
            {/* Input for House Name */}
            <Input
              placeholder="Search by House Name"
              className="flex-1 h-12"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
            />

            {/* Select for State */}
            <Select
              className="flex-1 h-12"
              placeholder="Select state"
              size="large"
              defaultValue={state}
              onChange={(value) => setState(value)}
            >
              <Option value="California">California</Option>
              <Option value="New York">New York</Option>
              <Option value="Texas">Texas</Option>
              {/* Add more states */}
            </Select>

            {/* Select for Rent/Buy/Sell */}
            <Select
              className="flex-1 h-12"
              placeholder="For Rent"
              size="large"
              defaultValue={transactionType}
              onChange={(value) => setTransactionType(value)}
            >
              <Option value="rent">Rent</Option>
              <Option value="buy">Buy</Option>
              <Option value="sell">Sell</Option>
            </Select>

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
  );
};

export default Banner;
