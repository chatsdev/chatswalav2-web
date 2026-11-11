"use client";

import { Star, ArrowLeft } from "lucide-react";
import React, { useRef } from "react";
import Images from "../../shared/Image";
import { TestimonialPopulated, TestimonialProps } from "../../types/landingPage";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/src/elements/ui/button";


const Testimonial: React.FC<TestimonialProps> = ({ data }) => {
  const swiperRef = useRef<any>(null);

  const testimonials = (data.testimonials || [])
    .map((item) => item._id)
    .filter((item): item is TestimonialPopulated => !!item && typeof item === "object");

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-12 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="inline-block text-[12px] font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            {data.badge || "TESTIMONIALS"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            {data.title}
          </h2>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Nav Buttons */}
          <div className="hidden sm:block">
            <Button variant="unstyled"
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-0 top-[calc(50%-28px)] -translate-y-1/2 -translate-x-4 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white border border-slate-200 shadow-md hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer"
              aria-label="Previous"
            >
              <ArrowLeft size={18} className="text-slate-700" />
            </Button>
            <Button variant="unstyled"
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-0 top-[calc(50%-28px)] -translate-y-1/2 translate-x-4 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white border border-slate-200 shadow-md hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer"
              aria-label="Next"
            >
              <ArrowLeft size={18} className="rotate-180 text-slate-700" />
            </Button>
          </div>

          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Autoplay, Navigation, Pagination]}
            centeredSlides={true}
            loop={testimonials.length > 2}
            grabCursor={true}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-14!"
            breakpoints={{
              320:  { slidesPerView: 1.1, spaceBetween: 16, centeredSlides: true },
              640:  { slidesPerView: 2,   spaceBetween: 24, centeredSlides: false },
              1024: { slidesPerView: 3,   spaceBetween: 32, centeredSlides: true },
            }}
          >
            {testimonials.map((item, idx) => (
              <SwiperSlide key={idx} className="h-auto! py-2">
                {({ isActive }) => (
                  <div
                    className={`flex flex-col h-full bg-white rounded-2xl p-7 border transition-all duration-500 ${
                      isActive
                        ? "border-primary/20 shadow-xl shadow-primary/5 scale-105 z-10"
                        : "border-slate-100 shadow-sm opacity-70 scale-95"
                    }`}
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={i < Math.round(item.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-slate-600 leading-relaxed text-sm flex-1 mb-6">
                      &ldquo;{item.description}&rdquo;
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 w-full mb-5" />

                    {/* User */}
                    <div className="flex items-center gap-3">
                      <Images
                        src={item?.user_image}
                        alt={item?.user_name || "user"}
                        className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-white shadow"
                        width={44}
                        height={44}
                        unoptimized
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{item.user_name}</h4>
                        {item.user_post && (
                          <p className="text-xs text-slate-400 truncate">{item.user_post}</p>
                        )}
                      </div>
                      <span className="ml-auto shrink-0 text-[10px] font-extrabold text-primary bg-light-primary border border-[var(--primary-opacity-20)] px-2.5 py-1 rounded-full">
                        Verified
                      </span>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
