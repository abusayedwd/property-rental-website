 
// import AboutUs from "@/components/AboutUs";
// import AddPhoto from "@/components/AddPhoto";
// import AllProperty from "@/components/AllProperty";
// import Benner from "@/components/Benner";
// import ContactUs from "@/components/ContactUs";
// import FaQpage from "@/components/FaQpage";
// import PopularRent from "@/components/PopularRent";
// import PopularSell from "@/components/PopularSell";
// // import PopularRent from "@/components/PopularRent";
// // import PopularSell from "@/components/PopularSell";
 

// export default function Home() {

//   return (
//     <div>
//            <Benner />  
//           <AllProperty />
//            <AddPhoto />
//            <PopularSell />
//            <PopularRent />
//            <AboutUs />
//            <FaQpage />
//            <ContactUs />
//     </div>
//   );
// }


"use client";
import AboutUs from "@/components/AboutUs";
import AddPhoto from "@/components/AddPhoto";
import AllProperty from "@/components/AllProperty";
import Banner from "@/components/Benner";
import ContactUs from "@/components/ContactUs";
import FaQpage from "@/components/FaQpage";
import PopularRent from "@/components/PopularRent";
import PopularSell from "@/components/PopularSell";
import React, { useState } from "react";
 

export default function Home() {
  const [searchCriteria, setSearchCriteria] = useState(null);

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
  };

  return (
    <div>
      {/* Banner Component */}
      <Banner onSearch={handleSearch} />

      {/* Conditionally render AllProperty if searchCriteria exists */}
      {searchCriteria && <AllProperty searchCriteria={searchCriteria} />}

      {/* Hide other components when searchCriteria exists */}
      {!searchCriteria && (
        <>
          <AddPhoto />
          <PopularSell />
          <PopularRent />
          <AboutUs />
          <FaQpage />
          <ContactUs />
        </>
      )}
    </div>
  );
}