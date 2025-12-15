"use client"
import EventCard from '@/components/OverlayLayout/EventCard';
import { useTheme } from "@/contexts/ThemeContext";
import { gsap } from 'gsap';
import Image from 'next/image';
import { IoExitOutline, IoChevronDown } from "react-icons/io5";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion, AnimatePresence } from 'framer-motion';
import EventLoader from '@/components/EventLoader';



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
  const router = useRouter();
  const isDystopia = theme === "dystopia";
  const containerRef = useRef<HTMLDivElement>(null)
  const [allEvents, setAllEvents] = useState<CardData[][]>([]);
  const [rawEvents, setRawEvents] = useState<CardData[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<CardData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [cardPosition, setCardPosition] = useState<{ x: number; y: number; width: number; height: number } | undefined>();
  const [animationType, setAnimationType] = useState<'fade' | 'slide' | 'flip'>('fade');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let styleElement = document.getElementById('events-swiper-styles') as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'events-swiper-styles';
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

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/events')
      .then(response => response.json())
      .then((events: any[]) => {
        // Transform API events to CardData format
        const transformedEvents: CardData[] = events.map((event) => {
          // Use event ID for redirect, ignore old redirect field from database
          const eventId = event._id || event.id;
          return {
            id: eventId,
            name: event.name,
            description: event.description || '',
            img: event.img,
            redirect: `/events/${eventId}`, // Always use new format with event ID
            cardposition: 'center',
            category: event.organizer || 'General',
          };
        });

        // Extract unique categories
        const uniqueCategoriesSet = new Set<string>();
        transformedEvents.forEach(event => {
          const orgs = event.category.split(',').map(s => s.trim());
          orgs.forEach(org => {
            if (org) uniqueCategoriesSet.add(org);
          });
        });

        const uniqueCategories = ['All', ...Array.from(uniqueCategoriesSet)].sort();
        setCategories(uniqueCategories);
        setRawEvents(transformedEvents);
      })
      .catch(error => {
        console.error("Error fetching event data:", error);
        // Fallback to empty array
        setAllEvents([]);
        setRawEvents([]);
      })
      .finally(() => {
        // Add a small delay to ensure smooth transition
        setTimeout(() => setIsLoading(false), 800);
      });
  }, []);

  useEffect(() => {
    // Filter and group events whenever selectedCategory or rawEvents change
    const filtered = selectedCategory === 'All'
      ? rawEvents
      : rawEvents.filter(e => {
        const orgs = e.category.split(',').map(s => s.trim());
        return orgs.includes(selectedCategory);
      });

    const eventsPerPage = 3;
    const groupedEvents: CardData[][] = [];
    for (let i = 0; i < filtered.length; i += eventsPerPage) {
      groupedEvents.push(filtered.slice(i, i + eventsPerPage));
    }

    setAllEvents(groupedEvents);
    setSelectedEventIndex(0); // Reset to first page on filter change
  }, [selectedCategory, rawEvents]);

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const normalizedX = (x - 0.5) * 2
      const normalizedY = (y - 0.5) * 2

      const maxX = 40
      const maxY = 20
      const targetX = -normalizedX * maxX
      const targetY = -normalizedY * maxY

      gsap.to('#events-bg', {
        x: targetX,
        y: targetY,
        duration: 0.2,
        ease: 'none'
      })

      const fgMaxX = 10
      const fgMaxY = 5
      const fgX = -normalizedX * fgMaxX
      const fgY = -normalizedY * fgMaxY
      gsap.to('#events-fg', {
        x: fgX,
        y: fgY,
        duration: 0.2,
        ease: 'none'
      })
    }

    const handleMouseLeave = () => {
      gsap.to('#events-bg', { x: 0, y: 0, duration: 0.4, ease: 'power2.out' })
      gsap.to('#events-fg', { x: 0, y: 0, duration: 0.4, ease: 'power2.out' })
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const dropdownOptions = allEvents.map((_, index) => ({
    value: index,
    label: `Event ${index + 1}`
  }));

  const currentEventCards = allEvents[selectedEventIndex] || [];

  const handleDropdownChange = (newValue: string | number) => {
    setSelectedEventIndex(Number(newValue));
  };


  return (
    <div ref={containerRef} className='w-full h-screen relative overflow-hidden'>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[100]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EventLoader theme={theme} />
          </motion.div>
        )}
      </AnimatePresence>
      <Link
        href="/"
        className={`clip-left absolute top-6 left-6 z-50 flex items-center gap-2 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 ${isDystopia
          ? 'bg-[#ee8f59]/20 hover:bg-[#ee8f59]/40 text-white'
          : 'bg-cyan-500/20 hover:bg-cyan-500/40 text-white'
          }`}
      >
        <IoExitOutline size={20} />
        <span className="font-semibold tracking-wider">EXIT</span>
      </Link>

      {/* Category Dropdown */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`clip-right flex items-center gap-2 px-6 py-3 backdrop-blur-sm transition-all duration-300 w-48 justify-between ${isDystopia
            ? 'bg-[#ee8f59]/20 hover:bg-[#ee8f59]/40 text-white'
            : 'bg-cyan-500/20 hover:bg-cyan-500/40 text-white'
            }`}
        >
          <span className="font-medium truncate">{selectedCategory}</span>
          <IoChevronDown
            className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`clip-right absolute top-full right-0 mt-2 w-48 backdrop-blur-md overflow-hidden shadow-xl max-h-60 overflow-y-auto ${isDystopia
                ? 'bg-black/90'
                : 'bg-black/80'
                }`}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors duration-200 text-sm ${selectedCategory === category
                    ? (isDystopia ? 'bg-[#ee8f59]/30 text-white' : 'bg-cyan-500/40 text-white')
                    : (isDystopia ? 'text-gray-300 hover:bg-[#ee8f59]/20' : 'text-gray-300 hover:bg-cyan-500/20')
                    }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div id="events-bg" className="w-full h-full absolute bottom-10 left-0" style={{
        pointerEvents: 'none',
      }}>
        <Image
          src={isDystopia ? "/bg_main_dys.png" : "/bg_main_eut.jpg"}
          alt="Event 1"
          width={1000}
          height={1000}
          className="w-full h-full object-cover object-center-bottom"
          style={{ objectPosition: "center center" }}
        />
      </div>

      <div id="events-fg" className="w-full h-full absolute bottom-0 left-0 pointer-events-none"
        style={{
          transform: "scale(1.1)",
        }}>
        <Image
          src={isDystopia ? "/events/bg_dys.png" : "/events/bg.png"}
          alt="Event 1"
          width={1000}
          height={1000}
          className="w-full h-full object-cover object-center-bottom"
          style={{ objectPosition: "center top", pointerEvents: 'none', }}
        />

        <div className='absolute inset-0 flex items-center justify-center w-full md:w-1/2 -top-[10vh] pointer-events-auto left-4 md:left-[calc(50%+65px)] md:-translate-x-1/2 z-20'>

          <div className="swiper-3d-container w-full h-full">
            <Swiper
              key={`swiper-${selectedEventIndex}-${currentEventCards.length}`}
              spaceBetween={80}
              slidesPerView={3}
              centeredSlides={true}
              initialSlide={1}
              watchSlidesProgress={true}
              onSwiper={(swiper) => {
                setSwiperInstance(swiper);
                console.log('✅ Swiper mounted! Active:', swiper.activeIndex);

                requestAnimationFrame(() => {
                  swiper.update();
                  swiper.updateSlides();
                  swiper.updateProgress();
                  swiper.updateSlidesClasses();
                  console.log('✅ Classes updated!');
                });
              }}
              className="w-full h-full events-swiper"
              style={{
                borderRadius: '1rem',
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                padding: 0,
              }}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 20 },
                640: { slidesPerView: 1, spaceBetween: 40 },
                1024: { slidesPerView: 3, spaceBetween: 80 },
              }}
              modules={[Navigation]}
              navigation={{ nextEl: '.events-next', prevEl: '.events-prev' }}
            >

              {currentEventCards.map((card) => (
                <SwiperSlide key={card.id}>
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to event detail page
                        if (card.redirect) {
                          router.push(card.redirect);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <div className="card-wrap w-[260px] md:w-[320px] lg:w-[360px] h-full">
                        <EventCard
                          id={card.id}
                          name={card.name}
                          description={card.description}
                          img={card.img}
                        />
                      </div>
                    </div>

                  </div>
                </SwiperSlide>
              ))}

            </Swiper>
          </div>

        </div>

        {theme === "utopia" ? (
          <>
            {/* 🌤 UTOPIA BUTTONS */}
            <button
              className="events-prev absolute left-60 top-1/2 -translate-y-1/2 z-30 
                 pointer-events-auto text-white 
                 px-3 py-2 rounded-full 
                 bg-cyan-500/20 backdrop-blur-sm
                 transition-all duration-300 ease-in-out
                 hover:bg-cyan-500/40 hover:scale-105 active:scale-95"
              aria-label="Previous"
            >
              <Image
                width={40}
                height={40}
                src="/events/previousArrowButtonUtopia.svg"
                alt="previous"
              />
            </button>

            <button
              className="events-next absolute right-50 top-1/2 -translate-y-1/2 z-30 
                 pointer-events-auto text-white 
                 px-3 py-2 rounded-full 
                 bg-cyan-500/20 backdrop-blur-sm
                 transition-all duration-300 ease-in-out
                 hover:bg-cyan-500/40 hover:scale-105 active:scale-95"
              aria-label="Next"
            >
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
                 px-3 py-2 rounded-full 
                 bg-[#ee8f59]/10 backdrop-blur-sm
                 transition-all duration-300 ease-in-out
                 hover:bg-[#ee8f59]/30 hover:scale-105 active:scale-95"
              aria-label="Previous"
            >
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
                 px-3 py-2 rounded-full 
                 bg-[#ee8f59]/10 backdrop-blur-sm
                 transition-all duration-300 ease-in-out
                 hover:bg-[#ee8f59]/30 hover:scale-105 active:scale-95"
              aria-label="Next"
            >
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
  )
}