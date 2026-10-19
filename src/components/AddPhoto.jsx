"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { useGetBannersQuery } from "@/redux/fetures/banner";
import url from "@/redux/api/baseUrl";

const FALLBACK = "/images/adds.png";

// Advertisement banners managed from the admin dashboard
const AddPhoto = () => {
  const { data } = useGetBannersQuery();
  const banners = data?.data?.attributes || [];

  // Nothing to show: skip the section entirely
  if (!banners.length) return null;

  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 md:mt-14">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{ 992: { slidesPerView: banners.length > 1 ? 2 : 1 } }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={banners.length > 2}
        className="ad-swiper !pb-10"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner._id || banner.id || index}>
            <a
              href={banner.link || "#"}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={banner.image?.url ? url + banner.image.url : FALLBACK}
                alt={banner.title || `Advertisement ${index + 1}`}
                loading="lazy"
                className="aspect-[2/1] w-full object-cover md:aspect-[5/2]"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK;
                }}
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AddPhoto;
