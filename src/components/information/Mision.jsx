"use client"

import React from 'react';
import Image from 'next/image';
import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

const MissionSection = () => {
  return (
    <div className="container mx-auto py-16 ">
      <div className="flex flex-col md:flex-row-reverse items-center gap-12">
        {/* Right side - Image */}
        <div className="w-full md:w-1/2">
          <div className="rounded-lg overflow-hidden">
            <Image 
              src="/images/mision.jpg" 
              alt="Real estate agent showing property to clients" 
              width={600} 
              height={450}
              className="w-full object-cover"
            />
          </div>
        </div>
        
        {/* Left side - Content */}
        <div className="w-full md:w-1/2 text-center md:text-right">
          <Title level={1} className="text-4xl font-bold mb-8">Mission</Title>
          
          <Paragraph className="text-lg text-gray-400 mb-8">
            Repudiandae qui ea soluta meliore accumsan vel, est veniam populo ea. Mel 
            habeo nonumes. Id duo modo quidam maluisset, ut tractatos intellegat. Ea 
            electram Mazim saepe instructior mei ei, sanctus assueverit per at, mel 
            dissentunt id, oratio fabulas lobortis te pri probo dolore vix vero.
          </Paragraph>
          
          <div className="flex justify-center md:justify-end">
          <button type="button" className="group relative h-14 w-48 overflow-hidden border-2 border-sky-400 text-xl text-sky-400 hover:text-sky-200"><span className="bg-sky-800  ease-in absolute w-[57%]  -translate-x-full group-hover:translate-x-0 -left-2 top-0 bottom-0 duration-300 -z-10 skew-x-12"></span><span className="bg-sky-600 ease-in absolute w-[55%]  translate-x-full group-hover:translate-x-0 -right-2 top-0 bottom-0 duration-300 skew-x-12 -z-10"></span>
          View more
          </button>
 
          </div>
        </div>
      </div>
       
    </div>
  );
};

export default MissionSection;