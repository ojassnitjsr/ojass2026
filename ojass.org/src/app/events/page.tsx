"use client";
import EventCard from "@/components/OverlayLayout/EventCard";
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import { IoExitOutline, IoChevronDown } from "react-icons/io5";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import EventLoader from "@/components/EventLoader";

interface CardData {
    id: string;
    name: string;
    description: string;
    img: string;
    redirect: string;
    cardposition: string;
    category: string;
}

export default function Page() {
    const { theme } = useTheme();

    const isDystopia = theme === "dystopia";
    const [allEvents, setAllEvents] = useState<CardData[]>([]);
    const [rawEvents, setRawEvents] = useState<CardData[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [selectedCategory, setSelectedCategory] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("ojass26_event_category") || "All";
        }
        return "All";
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedEventIndex, setSelectedEventIndex] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("ojass26_event_index");
            return saved ? parseInt(saved) : 0;
        }
        return 0;
    });
    const [swiperInstance, setSwiperInstance] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [hasRestoredSwiperState, setHasRestoredSwiperState] = useState(false);
    const pendingIndexRef = useRef<number | null>(null);

    useEffect(() => {
        let styleElement = document.getElementById(
            "events-swiper-styles",
        ) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.id = "events-swiper-styles";
            document.head.appendChild(styleElement);
        }

        const activeScale = 1.1;

        styleElement.textContent = `
    .events-swiper .swiper-slide {
      transition: transform 300ms ease, opacity 300ms ease;
      transform: scale(0.6) !important;
      opacity: 0.9 !important;
    }
    .events-swiper .swiper-slide-prev,
    .events-swiper .swiper-slide-next {
      transform: scale(0.6) !important;
      opacity: 0.9 !important;
    }
    .events-swiper .swiper-slide-active {
      transform: scale(${activeScale}) !important;
      opacity: 1 !important;
      z-index: 2;
    }
    
    .clip-left {
      clip-path: polygon(
        20px 0, 
        100% 0, 
        100% calc(100% - 20px), 
        calc(100% - 20px) 100%, 
        0 100%, 
        0 20px
      );
    }
    .clip-right {
      clip-path: polygon(
        0 0, 
        calc(100% - 20px) 0, 
        100% 20px, 
        100% 100%, 
        20px 100%, 
        0 calc(100% - 20px)
      );
    }
  `;

        return () => {
            styleElement?.remove();
        };
    }, [selectedEventIndex]);

    // Detect if device is mobile/touch-based
    useEffect(() => {
        const checkMobile = () => {
            const isTouchDevice =
                "ontouchstart" in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.matchMedia(
                "(max-width: 1024px)",
            ).matches;
            setIsMobile(isTouchDevice || isSmallScreen);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    useEffect(() => {
        const CACHE_KEY = "ojass26_events_cache";
        const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

        setIsLoading(true);

        // Helper function to check if cache is valid
        const isCacheValid = (timestamp: number) => {
            return Date.now() - timestamp < CACHE_DURATION;
        };

        // Try to load from cache first
        const loadFromCache = () => {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data, timestamp } = JSON.parse(cached);
                    if (isCacheValid(timestamp)) {
                        console.log("Loading events from cache");
                        return data;
                    } else {
                        console.log("Cache expired, fetching fresh data");
                        localStorage.removeItem(CACHE_KEY);
                    }
                }
            } catch (error) {
                console.error("Error reading cache:", error);
                localStorage.removeItem(CACHE_KEY);
            }
            return null;
        };

        // Try cache first
        const cachedData = loadFromCache();

        if (cachedData) {
            // Use cached data
            const transformedEvents: CardData[] = cachedData.map((event: any) => {
                const eventId = event._id || event.id;
                return {
                    id: eventId,
                    name: event.name,
                    description: event.description || "",
                    img: event.img,
                    redirect: `/events/${event.redirect}`,
                    cardposition: "center",
                    category: event.organizer || "General",
                };
            });

            // Extract unique categories
            const uniqueCategoriesSet = new Set<string>();
            transformedEvents.forEach((event) => {
                const orgs = event.category.split(",").map((s) => s.trim());
                orgs.forEach((org) => {
                    if (org) uniqueCategoriesSet.add(org);
                });
            });

            const uniqueCategories = [
                "All",
                ...Array.from(uniqueCategoriesSet),
            ].sort();
            setCategories(uniqueCategories);
            setRawEvents(transformedEvents);

            // Restore state from local storage
            const savedCategory = localStorage.getItem("ojass26_event_category");
            const savedIndex = localStorage.getItem("ojass26_event_index");

            if (savedCategory) {
                setSelectedCategory(savedCategory);
            }
            if (savedIndex) {
                pendingIndexRef.current = parseInt(savedIndex);
            }

            setTimeout(() => setIsLoading(false), 300);
        } else {
            // Fetch from API
            fetch("/api/events")
                .then((response) => response.json())
                .then((events: any[]) => {
                    // Save to cache
                    try {
                        localStorage.setItem(
                            CACHE_KEY,
                            JSON.stringify({
                                data: events,
                                timestamp: Date.now(),
                            })
                        );
                        console.log("Events cached successfully");
                    } catch (error) {
                        console.error("Error caching events:", error);
                    }

                    // Transform API events to CardData format
                    const transformedEvents: CardData[] = events.map((event) => {
                        const eventId = event._id || event.id;
                        return {
                            id: eventId,
                            name: event.name,
                            description: event.description || "",
                            img: event.img,
                            redirect: `/events/${event.redirect}`,
                            cardposition: "center",
                            category: event.organizer || "General",
                        };
                    });

                    // Extract unique categories
                    const uniqueCategoriesSet = new Set<string>();
                    transformedEvents.forEach((event) => {
                        const orgs = event.category.split(",").map((s) => s.trim());
                        orgs.forEach((org) => {
                            if (org) uniqueCategoriesSet.add(org);
                        });
                    });

                    const uniqueCategories = [
                        "All",
                        ...Array.from(uniqueCategoriesSet),
                    ].sort();
                    setCategories(uniqueCategories);
                    setRawEvents(transformedEvents);
                })
                .catch((error) => {
                    console.error("Error fetching event data:", error);
                    setAllEvents([]);
                    setRawEvents([]);
                })
                .finally(() => {
                    // Restore state from local storage
                    const savedCategory = localStorage.getItem("ojass26_event_category");
                    const savedIndex = localStorage.getItem("ojass26_event_index");

                    if (savedCategory) {
                        setSelectedCategory(savedCategory);
                    }
                    if (savedIndex) {
                        pendingIndexRef.current = parseInt(savedIndex);
                    }

                    setTimeout(() => setIsLoading(false), 800);
                });
        }
    }, []);

    useEffect(() => {
        // Filter events whenever selectedCategory or rawEvents change
        const filtered =
            selectedCategory === "All"
                ? rawEvents
                : rawEvents.filter((e) => {
                    const orgs = e.category.split(",").map((s) => s.trim());
                    return orgs.includes(selectedCategory);
                });

        setAllEvents(filtered);

        // Restore index if pending (from localStorage on initial load)
        if (pendingIndexRef.current !== null) {
            setSelectedEventIndex(pendingIndexRef.current);
            pendingIndexRef.current = null;
        }
        // Don't reset to 0 on initial load - the state is already initialized from localStorage
        // Only reset when user actively changes category (which will be handled by the category change itself)
    }, [selectedCategory, rawEvents]);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("ojass26_event_category", selectedCategory);
            localStorage.setItem(
                "ojass26_event_index",
                selectedEventIndex.toString(),
            );
        }
    }, [selectedCategory, selectedEventIndex, isLoading]);

    return (
        <div className="w-full h-screen relative overflow-hidden">
            {/* Loader with CSS transition */}
            <div
                className={`fixed inset-0 z-[100] transition-opacity duration-500 ease-in-out pointer-events-none ${
                    isLoading ? "opacity-100 pointer-events-auto" : "opacity-0"
                }`}>
                <EventLoader theme={theme} />
            </div>

            <Link
                href="/"
                className={`clip-left absolute top-6 left-6 z-50 flex items-center gap-2 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 ${isDystopia
                    ? "bg-[#ee8f59]/20 hover:bg-[#ee8f59]/40 text-white"
                    : "bg-cyan-500/20 hover:bg-cyan-500/40 text-white"
                    }`}>
                <IoExitOutline size={20} />
                <span className="font-semibold tracking-wider">EXIT</span>
            </Link>

            {/* Category Dropdown */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`clip-right flex items-center gap-2 px-6 py-3 backdrop-blur-sm transition-all duration-300 w-48 justify-between ${isDystopia
                        ? "bg-[#ee8f59]/20 hover:bg-[#ee8f59]/40 text-white"
                        : "bg-cyan-500/20 hover:bg-cyan-500/40 text-white"
                        }`}>
                    <span className="font-medium truncate">
                        {selectedCategory}
                    </span>
                    <IoChevronDown
                        className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {/* Dropdown Menu with CSS transition */}
                <div
                    className={`clip-right absolute top-full right-0 mt-2 w-48 backdrop-blur-md overflow-hidden shadow-xl max-h-60 overflow-y-auto transition-all duration-300 ease-out origin-top ${
                        isDystopia ? "bg-black/90" : "bg-black/80"
                    } ${
                        isDropdownOpen
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                setSelectedEventIndex(0); // Reset to first event when changing category
                                setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 transition-colors duration-200 text-sm ${
                                selectedCategory === category
                                    ? isDystopia
                                        ? "bg-[#ee8f59]/30 text-white"
                                        : "bg-cyan-500/40 text-white"
                                    : isDystopia
                                    ? "text-gray-300 hover:bg-[#ee8f59]/20"
                                    : "text-gray-300 hover:bg-cyan-500/20"
                            }`}>
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div
                id="events-bg"
                className="w-full h-full absolute bottom-10 left-0"
                style={{
                    pointerEvents: "none",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                }}>
                <Image
                    src="/home1.jpg"
                    alt="Event 1"
                    width={1000}
                    height={1000}
                    className={`w-full h-full object-cover object-center-bottom ${isDystopia ? "hue-rotate-180" : ""}`}
                    style={{ objectPosition: "center center" }}
                />
            </div>

            <div
                id="events-fg"
                className="w-full h-full absolute bottom-0 left-0 pointer-events-none"
                style={{
                    transform: "scale(1)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                }}>
                <Image
                    src={isDystopia ? "/events/ship.png" : "/events/ship.png"}
                    alt="Event 1"
                    width={1000}
                    height={1000}
                    className={`w-full h-full object-cover object-center-center ${isDystopia ? "hue-rotate-180" : ""} scale-105`}
                    style={{
                        objectPosition: "center center",
                        pointerEvents: "none",
                    }}
                />

                <div className="absolute inset-0 flex items-center justify-center w-full md:w-1/2 top-[0vh] pointer-events-auto left-1/2 -translate-x-1/2 z-20">
                    <div className="swiper-3d-container w-full h-full">
                        <Swiper
                            key={`swiper-${selectedCategory}-${allEvents.length}`}
                            loop={allEvents.length > 1}
                            spaceBetween={80}
                            slidesPerView={allEvents.length >= 3 ? 3 : allEvents.length}
                            centeredSlides={true}
                            initialSlide={selectedEventIndex}
                            onSlideChange={(swiper) =>
                                setSelectedEventIndex(swiper.realIndex)
                            }
                            watchSlidesProgress={true}
                            onSwiper={(swiper) => {
                                setSwiperInstance(swiper);
                                // Batch updates in single RAF for better performance
                                requestAnimationFrame(() => {
                                    swiper.update();
                                    swiper.updateSlides();
                                    swiper.updateProgress();
                                    swiper.updateSlidesClasses();

                                    // Restore saved index after Swiper is ready, only once
                                    if (selectedEventIndex > 0 && !hasRestoredSwiperState) {
                                        swiper.slideTo(selectedEventIndex, 0); // 0 = no animation for instant restore
                                        console.log(`Restored to saved index: ${selectedEventIndex}`);
                                        setHasRestoredSwiperState(true); // Set flag to true after restoration
                                    }
                                });
                            }}
                            className="w-full h-full events-swiper"
                            style={{
                                borderRadius: "1rem",
                                width: "100%",
                                height: "100%",
                                background: "transparent",
                                border: "none",
                                padding: 0,
                            }}
                            breakpoints={{
                                0: { slidesPerView: 1, spaceBetween: 20, loop: allEvents.length > 1 },
                                640: { slidesPerView: 1, spaceBetween: 40, loop: allEvents.length > 1 },
                                1024: {
                                    slidesPerView: allEvents.length >= 3 ? 3 : allEvents.length,
                                    spaceBetween: 80,
                                    loop: allEvents.length > 4
                                },
                            }}
                            modules={[Navigation]}
                            navigation={{
                                nextEl: ".events-next",
                                prevEl: ".events-prev",
                            }}>
                            {allEvents.map((card) => (
                                <SwiperSlide key={card.id}>
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Link
                                            href={card.redirect}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Save current state before navigating
                                                localStorage.setItem("ojass26_event_category", selectedCategory);
                                                localStorage.setItem("ojass26_event_index", selectedEventIndex.toString());
                                                console.log(`Saved state: category=${selectedCategory}, index=${selectedEventIndex}`);
                                            }}
                                            className="cursor-pointer block">
                                            <div className="card-wrap w-[260px] md:w-[320px] lg:w-[360px] h-full">
                                                <EventCard
                                                    id={card.id}
                                                    name={card.name}
                                                    description={
                                                        card.description
                                                    }
                                                    img={card.img}
                                                />
                                            </div>
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Event Counter Display */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
                            <div className={`px-6 py-3 rounded-full backdrop-blur-md border-2 font-mono text-lg font-bold ${isDystopia
                                ? "bg-[#ee8f59]/20 border-[#ee8f59]/40 text-[#ee8f59] shadow-lg shadow-[#ee8f59]/20"
                                : "bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-500/20"
                                }`}>
                                {selectedEventIndex + 1} / {allEvents.length}
                            </div>
                        </div>
                    </div>
                </div>

                {theme === "utopia" ? (
                    <>
                        {/* 🌤 UTOPIA BUTTONS */}
                        <button
                            className="events-prev absolute left-[15%] top-1/2 -translate-y-1/2 z-30 
              pointer-events-auto text-white 
              px-4 py-4 rounded-full 
              bg-cyan-500/60 backdrop-blur-md
              border-2 border-cyan-300/80
              shadow-xl shadow-cyan-400/50
              transition-all duration-300 ease-in-out
              hover:bg-cyan-400/80 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-400/70
              active:scale-95
              hidden md:block"
                            aria-label="Previous">
                            <Image
                                width={40}
                                height={40}
                                src="/events/previousArrowButtonUtopia.svg"
                                alt="previous"
                            />
                        </button>

                        <button
                            className="events-next absolute right-[15%] top-1/2 -translate-y-1/2 z-30 
              pointer-events-auto text-white 
              px-4 py-4 rounded-full 
              bg-cyan-500/60 backdrop-blur-md
              border-2 border-cyan-300/80
              shadow-xl shadow-cyan-400/50
              transition-all duration-300 ease-in-out
              hover:bg-cyan-400/80 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-400/70
              active:scale-95
              hidden md:block"
                            aria-label="Next">
                            <Image
                                width={40}
                                height={40}
                                src="/events/nextArrowButtonUtopia.svg"
                                alt="next"
                            />
                        </button>
                    </>
                ) : (
                    <>
                        {/* 🌒 DYSTOPIA BUTTONS */}
                        <button
                            className="events-prev absolute left-60 top-1/2 -translate-y-1/2 z-30 
              pointer-events-auto text-white 
              px-4 py-4 rounded-full 
              bg-[#ee8f59]/50 backdrop-blur-md
              border-3 border-[#ff9d6e]
              shadow-2xl shadow-[#ee8f59]/80
              transition-all duration-300 ease-in-out
              hover:bg-[#ee8f59]/70 hover:scale-110 hover:shadow-2xl hover:shadow-[#ff9d6e]
              active:scale-95
              hidden md:block"
                            aria-label="Previous">
                            <Image
                                width={40}
                                height={40}
                                src="/events/previousArrowButtonDystopia.svg"
                                alt="previous"
                            />
                        </button>

                        <button
                            className="events-next absolute right-50 top-1/2 -translate-y-1/2 z-30 
              pointer-events-auto text-white 
              px-4 py-4 rounded-full 
              bg-[#ee8f59]/50 backdrop-blur-md
              border-3 border-[#ff9d6e]
              shadow-2xl shadow-[#ee8f59]/80
              transition-all duration-300 ease-in-out
              hover:bg-[#ee8f59]/70 hover:scale-110 hover:shadow-2xl hover:shadow-[#ff9d6e]
              active:scale-95
              hidden md:block"
                            aria-label="Next">
                            <Image
                                width={40}
                                height={40}
                                src="/events/nextArrowButtonDystopia.svg"
                                alt="next"
                            />
                        </button>
                    </>
                )}

                {/* <div className='absolute bottom-10 mx-auto flex items-center justify-center w-full h-1/2 z-10' style={{
      pointerEvents: 'none',
    }}>
      <Image
        src="/events/holo.png"
        alt="Event 1"
        width={1000}
        height={1000}
        className="h-[70vh] object-contain object-center-bottom"
        style={{ objectPosition: "center bottom" }}
      />
    </div> */}
            </div>
        </div>
    );
}
