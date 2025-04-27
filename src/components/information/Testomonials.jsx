import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    [
      {
        id: 1,
        name: 'Joey Trebio',
        role: 'MANAGER',
        avatar: '/images/model.png', // Replace with actual image path
        quote: "Ut vix primis tractatos. Ad est alterum epicuri accusamus. Duo per id his qualisque deseruisse reformidans ex, quo omnesque cotidieque. Dolor voluptua per, his in congue."
      },
      {
        id: 2,
        name: 'Ellie Holmes',
        role: 'SALES ADVISOR',
        avatar: '/images/model1.png', // Replace with actual image path
        quote: "Ut vix primis tractatos. Ad est alterum epicuri accusamus. Duo per id his qualisque deseruisse reformidans ex, quo omnesque cotidieque. Dolor voluptua per, his in congue."
      },
    ],
    [
      {
        id: 3,
        name: 'Other Person 1',
        role: 'SALES ADVISOR',
        avatar: '/images/model2.png',
        quote: "Ut vix primis tractatos. Ad est alterum epicuri accusamus. Duo per id his qualisque deseruisse reformidans ex, quo omnesque cotidieque. Dolor voluptua per, his in congue."
      },
      {
        id: 4,
        name: 'Other Person 2',
        role: 'MANAGER',
        avatar: '/images/model3.png',
        quote: "Ut vix primis tractatos. Ad est alterum epicuri accusamus. Duo per id his qualisque deseruisse reformidans ex, quo omnesque cotidieque. Dolor voluptua per, his in congue."
      },
    ],
    [
        {
            id: 3,
            name: 'Other Person 1',
            role: 'SALES ADVISOR',
            avatar: '/images/model2.png',
            quote: "Ut vix primis tractatos. Ad est alterum epicuri accusamus. Duo per id his qualisque deseruisse reformidans ex, quo omnesque cotidieque. Dolor voluptua per, his in congue."
          },
          {
            id: 4,
            name: 'Other Person 2',
            role: 'MANAGER',
            avatar: '/images/model3.png',
            quote: "Ut vix primis tractatos. Ad est alterum epicuri accusamus. Duo per id his qualisque deseruisse reformidans ex, quo omnesque cotidieque. Dolor voluptua per, his in congue."
          },
    ],
    [
      {
        id: 7,
        name: 'Mari Adams',
        role: 'SALES ADVISOR',
        avatar: '/path/to/mari-image.jpg', // Replace with actual image path
        quote: "Ut vix primis tractatos. Ad est alterum epicuri accusamus. Duo per id his qualisque deseruisse reformidans ex, quo omnesque cotidieque. Dolor voluptua per, his in congue."
      },
      {
        id: 8,
        name: 'Kevin Wels',
        role: 'MANAGER',
        avatar: '/path/to/kevin-image.jpg', // Replace with actual image path
        quote: "Ut vix primis tractatos. Ad est alterum epicuri accusamus. Duo per id his qualisque deseruisse reformidans ex, quo omnesque cotidieque. Dolor voluptua per, his in congue."
      },
    ]
  ];

  const TestimonialItem = ({ testimonial }) => (
    <div className="flex items-start">
      <div className="mr-4">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name}
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-baseline mb-1">
          <h3 className="text-xl font-bold mr-2">{testimonial.name}</h3>
          <span className="text-xs text-gray-500 uppercase tracking-wider">{testimonial.role}</span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">"{testimonial.quote}"</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 bg-white">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: function (index, className) {
            return '';  // We're using custom pagination below
          },
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="testimonials-swiper"
      >
        {testimonials.map((testimonialPair, index) => (
          <SwiperSlide key={index}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
              {testimonialPair.map((testimonial) => (
                <TestimonialItem key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div className="flex justify-center mt-12">
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button 
              key={index} 
              className={`w-2.5 h-2.5 rounded-full ${index === activeIndex ? 'bg-orange-500' : 'bg-orange-200'}`}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                const swiperInstance = document.querySelector('.testimonials-swiper').swiper;
                swiperInstance.slideTo(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;