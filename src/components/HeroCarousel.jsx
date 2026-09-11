"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  PhoneCall,
  Sparkles,
  Image as ImageIcon,
  Film,
} from "lucide-react";

export default function HeroCarousel({
  homeData = null,
  locationTitle = "",
  makeLink = (path) => path,
  loading = false,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const videoRefs = useRef({});

  // Parse media items strictly from Firestore home data
  const parseMediaList = (data) => {
    if (!data) return [];
    const list = [];

    // 1. Check media array (preferred)
    if (Array.isArray(data.media) && data.media.length > 0) {
      data.media.forEach((item, idx) => {
        const url = typeof item === "string" ? item : item?.url;
        const type =
          item?.type ||
          (url?.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? "video" : "image");
        if (url && typeof url === "string" && url.trim() !== "") {
          list.push({
            id: `media-${idx}`,
            type,
            url: url.trim(),
          });
        }
      });
    }

    // 2. Check images array
    if (list.length === 0 && Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((url, idx) => {
        if (url && typeof url === "string" && url.trim() !== "") {
          list.push({
            id: `img-${idx}`,
            type: "image",
            url: url.trim(),
          });
        }
      });
    }

    // 3. Check single imageUrl / image
    if (list.length === 0) {
      const singleImg = data.imageUrl || data.image;
      if (singleImg && typeof singleImg === "string" && singleImg.trim() !== "") {
        list.push({
          id: "single-img",
          type: "image",
          url: singleImg.trim(),
        });
      }
    }

    // 4. Check videos array
    if (Array.isArray(data.videos) && data.videos.length > 0) {
      data.videos.forEach((vUrl, idx) => {
        if (
          vUrl &&
          typeof vUrl === "string" &&
          vUrl.trim() !== "" &&
          !list.some((item) => item.url === vUrl.trim())
        ) {
          list.push({
            id: `vid-${idx}`,
            type: "video",
            url: vUrl.trim(),
          });
        }
      });
    }

    // 5. Check single videoUrl
    if (data.videoUrl && typeof data.videoUrl === "string" && data.videoUrl.trim() !== "") {
      const v = data.videoUrl.trim();
      if (!list.some((item) => item.url === v)) {
        list.push({
          id: "single-vid",
          type: "video",
          url: v,
        });
      }
    }

    return list;
  };

  const slides = parseMediaList(homeData);

  // Dynamic texts strictly from homeData
  const heroTitle =
    homeData?.title?.trim() ||
    (locationTitle
      ? `Healthcare & Diagnostic Solutions in ${locationTitle}`
      : "Healthcare & Diagnostic Solutions");

  const heroDescription = homeData?.description?.trim() || "";

  const btn1Text = homeData?.button1Text?.trim() || "Explore Products";
  const btn2Text = homeData?.button2Text?.trim() || "Contact Us";

  // Dynamic button URLs
  const getButtonHref = (link, defaultRoute) => {
    if (!link || typeof link !== "string" || link.trim() === "") {
      return makeLink(defaultRoute);
    }
    const cleanLink = link.trim();
    if (cleanLink.startsWith("http://") || cleanLink.startsWith("https://") || cleanLink.startsWith("tel:") || cleanLink.startsWith("mailto:")) {
      return cleanLink;
    }
    const formatted = cleanLink.startsWith("/") ? cleanLink : `/${cleanLink}`;
    return makeLink(formatted);
  };

  const btn1Href = getButtonHref(homeData?.button1Link, "/items");
  const btn2Href = getButtonHref(homeData?.button2Link, "/contact");

  // Dynamic highlights / badges if configured in DB
  const dynamicBadges = Array.isArray(homeData?.badges)
    ? homeData.badges.filter(Boolean)
    : Array.isArray(homeData?.highlights)
    ? homeData.highlights.filter(Boolean)
    : [];

  const topBadge =
    homeData?.badge?.trim() ||
    homeData?.tagline?.trim() ||
    homeData?.subtitle?.trim() ||
    (locationTitle ? `Serving ${locationTitle}` : "");

  // Auto-slide effect only when multiple real dynamic slides exist
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPlaying, slides.length, currentSlide]);

  useEffect(() => {
    if (currentSlide >= slides.length && slides.length > 0) {
      setCurrentSlide(slides.length - 1);
    }
  }, [slides.length, currentSlide]);

  // Play video on current slide
  useEffect(() => {
    const currentMedia = slides[currentSlide];
    if (currentMedia?.type === "video") {
      const vid = videoRefs.current[currentSlide];
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    }
  }, [currentSlide, slides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Touch swipe support for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || slides.length <= 1) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const activeMedia = slides.length > 0 ? slides[currentSlide] || slides[0] : null;

  if (loading && !homeData) {
    return (
      <section className="relative overflow-hidden bg-[#180d0d] text-white py-16 sm:py-24">
        <div className="container-custom">
          <div className="max-w-2xl space-y-4 animate-pulse">
            <div className="h-6 w-48 rounded-full bg-white/10" />
            <div className="h-12 w-3/4 rounded-2xl bg-white/15" />
            <div className="h-5 w-full rounded-lg bg-white/10" />
            <div className="h-5 w-2/3 rounded-lg bg-white/10" />
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-40 rounded-xl bg-white/20" />
              <div className="h-12 w-40 rounded-xl bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#180d0d] text-white">
      {/* Background Media Viewport */}
      <div
        className="relative w-full min-h-[380px] sm:min-h-[440px] md:min-h-[490px] lg:min-h-[530px] flex items-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {activeMedia ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {activeMedia.type === "video" ? (
                <video
                  ref={(el) => (videoRefs.current[currentSlide] = el)}
                  src={activeMedia.url}
                  className="w-full h-full object-cover object-center"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt={`Hero Media ${currentSlide + 1}`}
                  className="w-full h-full object-cover object-center brightness-105 contrast-105"
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* High quality static medical diagnostic laboratory hero image */
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/hero_medical_lab.jpg"
              alt="Medical Diagnostic Equipment & Laboratory"
              className="w-full h-full object-cover object-center brightness-100 contrast-105 opacity-100"
            />
          </div>
        )}

        {/* Soft, Non-intrusive Gradient on text side */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent lg:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Foreground Content Container */}
        <div className="container-custom relative z-20 h-full flex flex-col justify-center py-12 sm:py-16">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Top Badge (Only rendered if present dynamically) */}
            {topBadge && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#FEEAE8] shadow-lg backdrop-blur-md"
              >
                <Sparkles size={14} className="text-[#FF7B72] animate-pulse" />
                <span>{topBadge}</span>
              </motion.div>
            )}

            {/* Main Dynamic Heading */}
            <motion.h1
              key={`title-${currentSlide}-${heroTitle}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-3 sm:mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl leading-[1.14] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
            >
              {heroTitle}
            </motion.h1>

            {/* Dynamic Description */}
            {heroDescription && (
              <motion.p
                key={`desc-${currentSlide}-${heroDescription}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-[#FEEAE8] max-w-2xl font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              >
                {heroDescription}
              </motion.p>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center gap-4"
            >
              {btn1Text && (
                <Link
                  href={btn1Href}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#E05353] text-white px-6 py-3.5 text-xs sm:text-sm font-bold shadow-xl shadow-[#E05353]/40 transition-all duration-300 hover:bg-[#C93B3B] hover:text-white hover:shadow-2xl hover:-translate-y-0.5 border border-white/20 group/btn1"
                >
                  <span className="text-white font-bold">{btn1Text}</span>
                  <ArrowRight size={16} className="text-white transition-transform group-hover/btn1:translate-x-1" />
                </Link>
              )}

              {btn2Text && (
                <Link
                  href={btn2Href}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/70 bg-black/50 text-white px-6 py-3.5 text-xs sm:text-sm font-bold backdrop-blur-md shadow-md transition-all duration-300 hover:bg-[#E05353] hover:border-[#E05353] hover:text-white hover:-translate-y-0.5 group/btn2"
                >
                  <PhoneCall size={16} className="text-white transition-transform group-hover/btn2:rotate-12" />
                  <span className="text-white font-bold">{btn2Text}</span>
                </Link>
              )}
            </motion.div>

            {/* Dynamic Badges if provided */}
            {dynamicBadges.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/20 pt-4 text-xs font-semibold text-[#FEEAE8]"
              >
                {dynamicBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF7B72]" />
                    <span>{badge}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Carousel Floating Controls Bar - Only rendered when > 1 dynamic slides exist */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2 sm:gap-3">
            {/* Auto-play toggle */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur-md border border-white/30 hover:bg-black/85 transition-all shadow-md"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              title="Previous Slide"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-black/60 text-white backdrop-blur-md border border-white/30 hover:bg-[#E05353] hover:border-[#E05353] transition-all shadow-md"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Counter Badge */}
            <div className="flex items-center gap-1.5 rounded-xl bg-black/70 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold text-[#FEEAE8] backdrop-blur-md border border-white/30 shadow-md">
              {activeMedia?.type === "video" ? (
                <Film size={12} className="text-[#FF7B72]" />
              ) : (
                <ImageIcon size={12} className="text-[#FF7B72]" />
              )}
              <span>
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              title="Next Slide"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-black/60 text-white backdrop-blur-md border border-white/30 hover:bg-[#E05353] hover:border-[#E05353] transition-all shadow-md"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Bottom Pagination Dots - Only rendered when > 1 dynamic slides exist */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 flex items-center gap-1.5 sm:gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-2 sm:h-2.5 ${
                  currentSlide === idx
                    ? "w-6 sm:w-8 bg-[#E05353] shadow-md shadow-[#E05353]/60"
                    : "w-2 sm:w-2.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

