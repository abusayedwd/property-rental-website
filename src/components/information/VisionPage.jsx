"use client"

import React from 'react';
import Image from 'next/image';
import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

const VisionPage = () => {
  return (
    <div className="container mx-auto py-16 px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left side - Image */}
        <div className="w-full md:w-1/2">
          <div className="rounded-lg overflow-hidden">
            <Image 
              src="/images/vision.jpg" 
              alt="Person using laptop to view property" 
              width={600} 
              height={450}
              className="w-full object-cover"
            />
          </div>
        </div>
        
        {/* Right side - Content */}
        <div className="w-full md:w-1/2">
          <Title level={1} className="text-4xl font-bold mb-6">Vision</Title>
          
          <Paragraph className="text-lg text-gray-700 mb-6">
            Mazim saepe instructior mei ei, sanctus assueverit per at, ad eam veri putent nonumes. Id duo modo quidam maluisset, ut mel tractatos intellegat. Ea electram repudiandae qui. Ea soluta meliore accumsan vel, est veniam populo ea. Mel habeo elitr dissentunt id, oratio fabulas lobortis te pri.
          </Paragraph>
          
          <Button 
            type="primary" 
            size="large"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 border-none px-8 py-5 h-auto flex items-center"
          >
            View more
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisionPage;