"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper as SwiperView, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { ChevronLeft, ChevronRight, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import groceriesImage from "../src/assets/Swiper.png";
import "swiper/css";

const slides = [
  {
    title: "Fresh Products Delivered to your Door",
    offer: "Get 20% off your first order",
    primary: "Shop Now",
    secondary: "View Deals",
    imagePosition: "center 58%",
  },
  {
    title: "Fresh picks for every table",
    offer: "Discover today's freshest groceries",
    primary: "Shop Now",
    secondary: "View Deals",
    imagePosition: "center 45%",
  },
  {
    title: "Your weekly shop, made easy",
    offer: "Fresh favorites delivered right to you",
    primary: "Shop Now",
    secondary: "View Deals",
    imagePosition: "center 70%",
  },
];

const benefits = [
  { icon: Truck, title: "Free Shipping", detail: "On orders over 500 EGP", color: "bg-blue-50 text-blue-500" },
  { icon: ShieldCheck, title: "Secure Payment", detail: "100% secure transactions", color: "bg-emerald-50 text-emerald-500" },
  { icon: RotateCcw, title: "Easy Returns", detail: "14-day return policy", color: "bg-orange-50 text-orange-500" },
  { icon: Headphones, title: "24/7 Support", detail: "Dedicated support team", color: "bg-purple-50 text-purple-500" },
];

export default function Swiper() {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    setSwiperReady(true);
  }, []);

  return (
    <section aria-label="Featured offers" className="w-full">
      <div className="relative isolate h-[330px] overflow-hidden bg-[#087b37] sm:h-[380px] lg:h-[420px]">
        {swiperReady ? (
          <SwiperView
            modules={[Autoplay]}
            loop
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="h-full w-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.title}>
                <div className="relative flex h-full items-center">
                  <Image
                    src={groceriesImage}
                    alt="Fresh vegetables at the grocery market"
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="-z-20 object-cover"
                    style={{ objectPosition: slide.imagePosition }}
                  />
                  <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,174,69,0.94)_0%,rgba(0,174,69,0.82)_48%,rgba(0,174,69,0.72)_100%)]" />
                  <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-12 lg:px-16">
                    <div className="max-w-[560px] text-white">
                      <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                        {slide.title}
                      </h1>
                      <p className="mt-3 text-base font-medium sm:text-lg">{slide.offer}</p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link href="/shop" className="inline-flex h-11 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-[#159f56] transition hover:bg-green-50">
                          {slide.primary}
                        </Link>
                        <Link href="/shop" className="inline-flex h-11 items-center justify-center rounded-md border border-white/80 bg-transparent px-6 text-sm font-semibold text-white transition hover:bg-white/15">
                          {slide.secondary}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </SwiperView>
        ) : (
          <div className="relative flex h-full items-center">
            <Image
              src={groceriesImage}
              alt="Fresh vegetables at the grocery market"
              fill
              priority
              sizes="100vw"
              className="-z-20 object-cover"
              style={{ objectPosition: slides[0].imagePosition }}
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,174,69,0.94)_0%,rgba(0,174,69,0.82)_48%,rgba(0,174,69,0.72)_100%)]" />
            <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-12 lg:px-16">
              <div className="max-w-[560px] text-white">
                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{slides[0].title}</h1>
                <p className="mt-3 text-base font-medium sm:text-lg">{slides[0].offer}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/shop" className="inline-flex h-11 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-[#159f56] transition hover:bg-green-50">{slides[0].primary}</Link>
                  <Link href="/shop" className="inline-flex h-11 items-center justify-center rounded-md border border-white/80 bg-transparent px-6 text-sm font-semibold text-white transition hover:bg-white/15">{slides[0].secondary}</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          aria-label="Previous offer"
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-5 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#159f56] shadow-md transition hover:bg-white sm:left-8"
        >
          <ChevronLeft aria-hidden="true" size={20} />
        </button>
        <button
          type="button"
          aria-label="Next offer"
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-5 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#159f56] shadow-md transition hover:bg-white sm:right-8"
        >
          <ChevronRight aria-hidden="true" size={20} />
        </button>

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5" aria-label="Choose an offer">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to offer ${index + 1}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className={`h-2.5 rounded-full transition-all ${activeIndex === index ? "w-5 bg-white" : "w-2.5 bg-white/65 hover:bg-white/90"}`}
            />
          ))}
        </div>
      </div>

      <ul className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-3 px-4 py-6 sm:px-6 md:grid-cols-4 md:gap-4 lg:px-10">
        {benefits.map(({ icon: Icon, title, detail, color }) => (
          <li key={title} className="flex min-h-[76px] items-center gap-3 rounded-xl border border-[#eef0ef] bg-white px-3 py-3 shadow-[0_2px_8px_rgba(16,24,40,0.06)] sm:px-4">
            <span className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full ${color}`}>
              <Icon aria-hidden="true" size={17} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[#252b27] sm:text-sm">{title}</span>
              <span className="mt-1 block truncate text-[10px] text-[#7b827e] sm:text-xs">{detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
