 


"use client";
import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { useGetBannersQuery } from '@/redux/fetures/banner';
import url from '@/redux/api/baseUrl';
import banner from '@/../../public/images/adds.png'; // Import your local demo banner image
import Link from 'next/link';
import Aos from 'aos';

const AddPhoto = () => {
  const { data: banners } = useGetBannersQuery();
  console.log(banners);

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };

  useEffect(() => {
    Aos.init({
      duration: 1000,  // Animation duration
      easing: 'ease-in-out',  // Easing function
    });
  }, []);

  // Check if banners exist
  const hasBanners = banners?.data?.attributes?.length > 0;

  // If no banners, show the "No banner" message
  if (!hasBanners) {
    return (
      <div className="md:mt-8 mt-12 md:container">
        <div className="rounded-lg overflow-hidden flex items-center justify-center bg-gray-100" style={{ height: "100px" }}>
          <p className="text-xl text-gray-600 font-medium">No banners available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:mt-8 mt-12 md:container">
      <Swiper
        pagination={pagination}
        slidesPerView={1}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 2 },
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        data-aos="zoom-in"
        className="mySwiper rounded-lg overflow-hidden gap-4 md:h-80 h-28"
        style={{ height: "300px" }}
      >
        {banners.data.attributes.map((banner, index) => (
          <SwiperSlide key={index} >
            <div>
              <a target='_blank' href={banner.link || '#'} rel="noopener noreferrer">
                <img
                  src={banner.image.url ? url + banner.image.url : banner}
                  alt={`Banner ${index}`}
                  style={{ width: '100%', height: "300px" }}
                  className='h-48 md:h-[450px] p-4'
                  onError={(e) => {
                    console.error("Image failed to load", e);
                    e.target.src = banner; // Fallback to local image in case of error
                  }}
                />
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AddPhoto;


// "use client";

// import { useEffect } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { Autoplay, Pagination } from 'swiper/modules';
// import { useGetBannersQuery } from '@/redux/fetures/banner';
// import url from '@/redux/api/baseUrl';
// import banner from '@/../../public/images/adds.png'; // Import your local demo banner image
// import Link from 'next/link';
// import AOS from 'aos';
 

// const AddPhoto = () => {
//   const { data: banners } = useGetBannersQuery();
//   console.log(banners);

//   const pagination = {
//     clickable: true,
//     renderBullet: function (index, className) {
//       return '<span class="' + className + '">' + (index + 1) + '</span>';
//     },
//   };

//   // Check if banners exist
//   const hasBanners = banners?.data?.attributes?.length > 0;

//   // If no banners, show the "No banner" message
//   if (!hasBanners) {
//     return (
//       <div className="md:mt-8 mt-12 md:container">
//         <div className="rounded-lg overflow-hidden flex items-center justify-center bg-gray-100" style={{ height: "100px" }}>
//           <p className="text-xl text-gray-600 font-medium">No banners available</p>
//         </div>
//       </div>
//     );
//   }

//   useEffect(() => {
//     AOS.init({
//       duration: 1000,  // Animation duration
//       easing: 'ease-in-out',  // Easing function
//     });
//   }, []);

//   return (
//     <div className="md:mt-8 mt-12 md:container">
//       <Swiper
//         pagination={pagination}
//         slidesPerView={1}
//         modules={[Pagination, Autoplay]}
//         breakpoints={{
//           640: { slidesPerView: 1 },
//           768: { slidesPerView: 1 },
//           1024: { slidesPerView: 2 },
//         }}
//         autoplay={{
//           delay: 6000,
//           disableOnInteraction: false,
//         }}
//         className="mySwiper rounded-lg overflow-hidden gap-4 md:h-80 h-28"
//         style={{ height: "300px" }}
//       >
//         {banners.data.attributes.map((banner, index) => (
//           <SwiperSlide key={index} data-aos="zoom-in">
//             <div>
//               <a target='_blank' href={banner.link || '#'} rel="noopener noreferrer">
//                 <img
//                   src={banner.image.url ? url + banner.image.url : banner}
//                   alt={`Banner ${index}`}
//                   style={{ width: '100%', height: "300px" }}
//                   className='h-48 md:h-[450px] p-4'
//                   onError={(e) => {
//                     console.error("Image failed to load", e);
//                     e.target.src = banner; // Fallback to local image in case of error
//                   }}
//                 />
//               </a>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default AddPhoto;
