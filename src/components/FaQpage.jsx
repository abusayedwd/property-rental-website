 

// "use client";

import { useState } from "react";
import Header from "./customComponent/Header";

// import React from "react";
// import { Collapse } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import Header from "./customComponent/Header";

// const { Panel } = Collapse;

// const FaQpage = () => {
//   const faqItems = [
    // {
    //   question: "What is Your Next Home?",
    //   answer: "Your Next Home is a platform that connects landlords with tenants and buyers, making it easy to rent, buy, or sell properties. Your Next Home is a platform that connects landlords with tenants and buyers, making it easy to rent, buy, or sell properties.",
    // },
    // {
    //   question: "How does Your Next Home work?",
    //   answer: "Landlords can list their properties, and users can search for properties based on their preferences.",
    // },
    // {
    //   question: "Is Your Next Home available in all locations?",
    //   answer: "Yes, we support listings from multiple locations across the country.",
    // },
    // {
    //   question: "How do I find a property that matches my needs?",
    //   answer: "Use our advanced search filters to find properties based on location, type, price, and more.",
    // },
    // {
    //   question: "Is it safe to use Your Next Home?",
    //   answer: "Yes, our platform ensures a secure environment for both landlords and users to interact.",
    // },
//   ];

//   return (
//     <div className="container py-12 px-4">
//       {/* Page Title */}
//       <div className="text-center mb-12">
//         <p className="text-[40px] font-[Montserrat] font-semibold dark:text-gray-300 text-gray-700">
//           Questions & Answers
//         </p>
//         <Header size="extraLarge" className="text-[#2FC639] mt-5">
//           FAQ
//         </Header>
//       </div>

//       {/* FAQ List */}
//       <div className="space-y-4 md:py-10">
//         <Collapse
//           accordion
//           className="bg-transparent"
//           expandIcon={({ isActive }) => (
//             <PlusOutlined
//               className={`text-white transition-transform duration-2000 ${
//                 isActive ? "rotate-45" : ""
//               }`}
//             />
//           )}
//           expandIconPosition="end"
//         >
//           {faqItems.map((item, index) => (
//             <Panel
//               header={
//                 <span className="text-white">
//                   {item.question}
//                 </span>
//               }
//               key={index}
//               className="rounded-lg text-xl shadow-md py-6 font-medium bg-gray-800"
//             >
//               <p className="text-[16px] text-black text-gray-600">
//                 {item.answer}
//               </p>
//             </Panel>
//           ))}
//         </Collapse>
//       </div>
//     </div>
//   );
// };

// export default FaQpage;

export default function FaQpage() {
  // add your array of object data
  const dataArr = [
    {
      title: "What is Your Next Home?",
      description: "Your Next Home is a platform that connects landlords with tenants and buyers, making it easy to rent, buy, or sell properties. Your Next Home is a platform that connects landlords with tenants and buyers, making it easy to rent, buy, or sell properties.",
    },
    {
      title: "What the first step of the home buying process?",
      description: "Vim ne munere melius tritani, stet dolore disputationi an per, ea libris aliquid vix. Per ex odio nihil, ei eam illum porro vituperatoribus. Sed no justo nihil, ad est nemore explicari signiferumque, sed tota facer appetere et. Qui eu libris molestie comprehensam. Sale iisque epicurei cu pro, inermis efficiantur no est, ex elit utroque abhorreant sed. Lorem ipsum dolor sit amet, error ullamcorper in sit, nam mazim laoreet delectus eu. Vis id atqui quodsi. Commune constituam quo an, ad eum quas augue aliquip. Sed cu oratio legendos. Mea et wisi recteque, bonorum probatus phaedrum sit at, id nec vidit inciderint possit pertinax delicata his ut..",


 

    },
    {
      title: "Is Your Next Home available in all locations?",
      description: "Yes, we support listings from multiple locations across the country.",
    },
    {
      title: "How do I find a property that matches my needs?",
      description: "Use our advanced search filters to find properties based on location, type, price, and more.",
    },
    {
      title: "Is it safe to use Your Next Home?",
      description: "Yes, our platform ensures a secure environment for both landlords and users to interact.",
    },
      ];

  // toggle state and function
  const [isOpen, setIsOpen] = useState(null);
  const handleToggle = (idx) => {
      setIsOpen((prevIdx) => (prevIdx === idx ? null : idx));
  };
  
  return (
      <div className="container py-12 px-4">
             <div className="text-center mb-12">
         <p className="text-[40px] font-[Montserrat] font-semibold dark:text-gray-300 text-gray-700">
           Questions & Answers
         </p>
       <Header size="extraLarge" className="text-[#2FC639] mt-5">
         FAQ
       </Header>
       </div>
       <div className="flex justify-center">

          <div className="cursor-pointer space-y-6 ">
              {/* mapping each accordion  */}
              {dataArr.map((data, idx) => (
                  <div key={idx} onClick={() => handleToggle(idx)} className="flex items-center w-[800px]">
                      {/* the index div  */}
                      <div className="flex size-16 select-none items-center justify-center rounded-md bg-zinc-700 text-2xl font-semibold text-white">
                          <span>0{idx + 1}</span>
                      </div>

                      <div className="relative h-[2px] w-10 bg-zinc-700">
                          <span className="absolute -left-2 -top-[5px] z-40 h-3 w-3 rounded-full border-2 border-zinc-700 bg-white"></span>
                          <span className="h-1 w-10 bg-zinc-700"></span>
                          <span
                              className={`absolute -right-2 -top-[5px] z-40 h-3 w-3 rounded-full border-2 ${isOpen === idx ? 'border-zinc-700 bg-white delay-100' : 'border-transparent'}`}
                          ></span>
                      </div>

                      {/* main accordion div  */}
                      <div className=" ">
                          <div className="relative   border-t-[12px] border-zinc-700 bg-sky-50 p-3 shadow-md">
                              <span className="absolute right-0 top-0 h-0 w-0 border-b-[40px] border-r-[40px] border-b-transparent border-r-zinc-700"></span>
                              <h1 className="select-none text-lg text-zinc-700">{data.title}</h1>
                          </div>
                          <div className={`grid overflow-hidden text-slate-600 transition-all duration-300 ease-in-out ${isOpen === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                              <div className="overflow-hidden">
                                  <div className=" w-[700px] bg-zinc-700 p-6 mr-12 text-sm text-white">{data.description}</div>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
       </div>
      </div>
  );
}
