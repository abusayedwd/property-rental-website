"use client";
import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
// import './styles.css';
import { Autoplay, Pagination } from 'swiper/modules';
import { useGetBannersQuery } from '@/redux/fetures/banner';
import url from '@/redux/api/baseUrl';
// import 'swiper/swiper-bundle.min.css'; // Import Swiper styles

const AddPhoto = () => {
  const { data: banners } = useGetBannersQuery();

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };
  return (
    <div className="md:mt-8 mt-60 container">
      

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
              delay: 2000,
              disableOnInteraction: false,
            }}
            className="mySwiper rounded-lg overflow-hidden gap-4 md:h-80 h-28"
            style={{ height: "300px" }}
          >
               {banners?.data?.attributes?.map((banner, index) => (
          <SwiperSlide key={index}>
            <img
              src={url + banner.image.url}
              alt={`Banner ${index}`}
              style={{ width: '100%', height:"300px"  }}
              className='h-48 md:h-[450px] p-4'
              onError={(e) => {
                console.error("Image failed to load", e);
              }}
            />
          </SwiperSlide>
        ))}
          
          </Swiper> 
    </div>
  );
};

export default AddPhoto;
