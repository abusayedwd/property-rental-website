 

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
//             looking for, we're here to help with Bangladesh's largest selection of   homes to buy and rent.
          
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
import { districtOptions, getAreaOptions, filterLocationOption } from "./statesData";
import { useT } from "@/i18n/LanguageProvider";
const { Option } = Select;

const Banner = ({ onSearch }) => {
  const t = useT();
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

  // District is required; area is optional (searches the whole district)
  const handleSearch = () => {
    if (!selectedState) {
      message.error(t("hero.chooseDistrict"));
      return;
    }
    onSearch({ houseName, selectedState, selectedSubState, transactionType });
  };

  return (
    <section className="relative isolate overflow-hidden">
      {/* Rotating background */}
      {bannerImages.map((image, index) => (
        <div
          key={image}
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${image}')`, opacity: index === currentImageIndex ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#171F3D]/85 via-[#171F3D]/70 to-[#171F3D]/90 md:bg-gradient-to-r md:from-[#171F3D]/90 md:via-[#222F55]/75 md:to-[#222F55]/40" />

      <div className="mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 md:min-h-[620px] md:py-20 lg:min-h-[680px]">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t("hero.badge")}
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {t("hero.title1")} <span className="text-primary">{t("hero.title2")}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Search card */}
        <div className="mt-8 w-full max-w-5xl rounded-2xl bg-white p-3 shadow-2xl shadow-black/20 md:p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_0.8fr_auto]">
            <Select
              size="large"
              className="w-full"
              placeholder={t("hero.district")}
              value={selectedState}
              onChange={handleStateChange}
              options={districtOptions}
              showSearch
              filterOption={filterLocationOption}
            />
            <Select
              size="large"
              className="w-full"
              placeholder={selectedState ? t("hero.areaOptional") : t("hero.area")}
              value={selectedSubState}
              onChange={handleSubStateChange}
              open={openSubState}
              onDropdownVisibleChange={setOpenSubState}
              disabled={!selectedState}
              options={getAreaOptions(selectedState)}
              showSearch
              allowClear
              filterOption={filterLocationOption}
            />
            <Select size="large" className="w-full" value={transactionType} onChange={handleTransactionChange}>
              <Option value="rent">{t("hero.forRent")}</Option>
              <Option value="sell">{t("hero.forSale")}</Option>
            </Select>
            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              className="!h-10 w-full !border-none !bg-primary !px-8 !font-semibold hover:!bg-primaryDark lg:w-auto"
            >
              {t("hero.search")}
            </Button>
          </div>
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          {[t("hero.point1"), t("hero.point2"), t("hero.point3")].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">✓</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Slide indicators */}
        <div className="mt-8 flex gap-2">
          {bannerImages.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Show background ${index + 1}`}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 rounded-full transition-all ${index === currentImageIndex ? "w-8 bg-primary" : "w-4 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
