import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Typewriter } from "react-simple-typewriter";
import { ArrowRight, Activity, MapPin, Users, Leaf, BarChart3 } from "lucide-react";
import { Link } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import poster1 from "../../assets/banner-1.jpg"
import poster2 from "../../assets/banner-2.jpg"
import poster3 from "../../assets/banner-3.jpg"
import poster4 from "../../assets/banner-4.jpg"
import poster5 from "../../assets/banner-5.jpg"

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useContext(AuthContext);

  const slides = [
    {
      id: 1,
      image: poster1,
      badge: "The Problem",
      badgeIcon: <Activity size={16} />,
      title: "Our cities are facing",
      typewriterWords: ["Plastic Waste", "Neglected Areas", "Urban Decay", "Pollution"],
      description: "Over 2 billion tons of waste overwhelm our infrastructure annually. The crisis is visible on every corner, demanding immediate attention.",
      color: "text-red-400",
    },
    {
      id: 2,
      image: poster2,
      badge: "The Solution",
      badgeIcon: <Users size={16} />,
      title: "Join forces for",
      typewriterWords: ["With the Community", "Active Change", "Teamwork", "Restoration"],
      description: "Real change starts locally. Join thousands of volunteers reclaiming streets, parks, and beaches. Your hands can heal the city.",
      color: "text-blue-400",
    },
    {
      id: 3,
      image: poster3,
      badge: "The Technology",
      badgeIcon: <MapPin size={16} />,
      title: "Report issues via",
      typewriterWords: ["Smart Tracking", "Geo-Tagging", "Instant Alerts", "Live Updates"],
      description: "Don't just walk past a problem—report it. Our platform connects citizens directly to resolution teams with precise location tracking.",
      color: "text-purple-400",
    },
    {
      id: 4,
      image: poster4,
      badge: "The Impact",
      badgeIcon: <BarChart3 size={16} />,
      title: "Visualize our",
      typewriterWords: ["Data Insights", "Cleaner Streets", "Resolved Cases", "Progress"],
      description: "Let's make a difference together. Track waste reduction metrics and watch your city transform through data-driven action.",
      color: "text-yellow-400",
    },
    {
      id: 5,
      image: poster5,
      badge: "The Future",
      badgeIcon: <Leaf size={16} />,
      title: "Let's Make Our City",
      typewriterWords: ["Sustainable", "Green", "Beautiful", "& The best"],
      description: "Lets not just make complains, Take action make a place that we can call home.",
      color: "text-green-400",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000); 
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[700px] overflow-hidden font-sans bg-neutral-900 text-neutral-100">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent z-10" />
          
          <img
            src={slides[currentSlide].image}
            alt="Slide Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 h-full container mx-auto px-6 md:px-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <div key={currentSlide} className="max-w-3xl space-y-6">
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
                {slides[currentSlide].badgeIcon}
                {slides[currentSlide].badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
            >
              {slides[currentSlide].title} <br />
              <span className={slides[currentSlide].color}>
                <Typewriter
                  words={slides[currentSlide].typewriterWords}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>

            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="pt-6"
              >
                <Link to="auth/login">
                  <button className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 text-lg font-bold rounded-full overflow-hidden transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    Get Started
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              currentSlide === index 
                ? "bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                : "bg-white/20 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3 md:hidden">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;