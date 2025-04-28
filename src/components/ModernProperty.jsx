import React from 'react';

export default function ModernProperty() {
  return (
    <div className="flex flex-col md:flex-row items-center container mt-12 w-full min-h-screen">
      <div className="relative w-full md:w-1/2 mb-8 md:mb-0">
        <div className="w-full rounded-lg overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-yellow-400"></div>
          <img 
            src="/images/premium.jpg" 
            alt="Couple looking at laptop with moving boxes" 
            className="w-full h-auto rounded-lg shadow-md"
          />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-400"></div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 md:pl-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2FC639] mb-6">
          Modern spaces and premium design
        </h1>
        
        <p className="text-gray-400 mb-8">
          Lorem ipsum dolor sit amet, minimum inimicus quo no, at vix primis
          viderere vituperatoribus. In corpora argumentum.
        </p>
        
        <ul className="mb-8 space-y-2">
          <li className="flex items-start text-gray-400">
            <span className="text-gray-500 mr-2">—</span>
            <span>Mea omnium explicari</span>
          </li>
          <li className="flex items-start text-gray-400">
            <span className="text-gray-500 mr-2">—</span>
            <span>His no legere feugaitoer</span>
          </li>
          <li className="flex items-start text-gray-400">
            <span className="text-gray-500 mr-2">—</span>
            <span>Illum idquem</span>
          </li>
        </ul>
        
        <div className=" ">
          <button type="button" className="group relative h-14 w-48 overflow-hidden border-2 border-sky-400 text-xl text-sky-400 hover:text-sky-200">
            <span className="bg-sky-800  ease-in absolute w-[57%]  -translate-x-full group-hover:translate-x-0 -left-2 top-0 bottom-0 duration-300 -z-10 skew-x-12"></span>
            <span className="bg-sky-600 ease-in absolute w-[55%]  translate-x-full group-hover:translate-x-0 -right-2 top-0 bottom-0 duration-300 skew-x-12 -z-10"></span>
          View more
          </button>
 
          </div>
      </div>
    </div>
  );
}