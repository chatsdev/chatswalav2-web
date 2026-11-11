"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Images from "../../shared/Image";
import { HomeProps } from "../../types/landingPage";

const Home: React.FC<HomeProps> = ({ data }) => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="home" className="relative overflow-hidden pt-16 flex flex-col" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16,185,129,0.12) 0%, rgba(255,255,255,0) 70%), linear-gradient(160deg, #f0fdf4 0%, #ffffff 40%, #f8fafc 100%)" }}>

      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[var(--primary-opacity-20)]/40 blur-3xl" />
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-teal-100/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-light-primary/50 blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col justify-center pt-[calc(30px+(64-30)*((100vw-320px)/(1920-320)))] pb-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[calc(5px+(48-5)*((100vw-320px)/(1920-320)))] items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {data.badge && (
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 tracking-wide uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-sm font-bold text-primary">{data.badge}</span>
                </div>
              )}

              <h1 className="text-[calc(18px+(50-18)*((100vw-320px)/(1920-320)))] font-bold text-slate-900 leading-[1.1] sm:mb-6 mb-4 tracking-tight">
                {data.title}
              </h1>

              <p className="text-[17px] text-slate-600 font-medium mb-[calc(12px+(32-12)*((100vw-320px)/(1920-320)))] leading-relaxed max-w-xl mx-auto lg:mx-0">
                {data.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {data.primary_button?.text && (
                  <Button
                    className="group bg-primary hover:bg-primary/90 text-white px-8! py-4! h-12! rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                    onClick={() => router.push(data?.primary_button?.link || "")}
                  >
                    {data.primary_button.text}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>

              {/* Social Proof */}
              {/* <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <Images
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="user"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-slate-900 font-bold">4.9/5</span>
                  <span className="text-slate-500 text-sm">from 2000+ users</span>
                </div>
              </div> */}
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden ">
                <Images
                  src={data?.hero_image}
                  fallbackSrc={"/assets/images/default3.png"}
                  alt="App Dashboard"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>

              {/* Floating Cards */}
              {data.floating_images?.slice(0, 2).map((img, index) => {
                const isLeft = img.position === "left" || img.position?.includes("left");
                const positionClass = isLeft
                  ? "absolute -left-8 top-1/4 z-10 max-w-[180px] hidden lg:block"
                  : "absolute -right-8 top-[45%] z-10 max-w-[180px] hidden lg:block";

                return (
                  <div key={index} className={positionClass} style={{ animationDelay: `${index * 1.5}s` }}>
                    <div>
                      <Images
                        src={img.url}
                        alt={`Feature ${index + 1}`}
                        width={180}
                        height={120}
                        className="rounded-lg"
                        unoptimized
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Logos */}
      {data.brand_logos && data.brand_logos.length > 0 && (
        <div className="border-t border-slate-200 py-[calc(18px+(40-18)*((100vw-320px)/(1920-320)))] bg-gray-50 mt-auto">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-bold text-slate-600 mb-[calc(20px+(32-20)*((100vw-320px)/(1920-320)))]">
              {data.trusted_label || "Trusted by 5,000+ Teams Worldwide"}
            </p>
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex overflow-x-auto items-center justify-center gap-8 pb-4 no-scrollbar ${isDragging ? 'cursor-grabbing select-none snap-none' : 'cursor-grab snap-x'}`}
            >
              {data.brand_logos.map((logoUrl, i) => (
                <div key={i} className={`shrink-0 snap-center ${isDragging ? 'pointer-events-none' : ''}`}>
                  <Images
                    src={logoUrl}
                    alt={`Brand ${i + 1}`}
                    width={140}
                    height={48}
                    className="h-8 w-auto object-contain grayscale"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;