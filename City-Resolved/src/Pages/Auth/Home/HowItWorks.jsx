import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  FaCamera,
  FaUserTie,
  FaTools,
  FaCheckCircle,
  FaMobileAlt,
  FaCrown,
  FaBell,
  FaChartLine,
  FaMapMarkedAlt,
  FaUsers,
  FaShieldAlt,
  FaClock,
  FaArrowRight
} from "react-icons/fa";

const steps = [
  { icon: <FaCamera />, title: "Report Issue", desc: "Snap, tag location, and submit instantly." },
  { icon: <FaUserTie />, title: "Admin Review", desc: "Verification and priority assignment." },
  { icon: <FaTools />, title: "Work Begins", desc: "Field staff deployment & repair tracking." },
  { icon: <FaCheckCircle />, title: "Resolved", desc: "Completion verified with photo proof." },
  { icon: <FaBell />, title: "Live Updates", desc: "Real-time status notifications." },
  { icon: <FaMapMarkedAlt />, title: "Geo Tracking", desc: "Interactive map-based oversight." },
  { icon: <FaUsers />, title: "Community Vote", desc: "Crowdsourced priority ranking." },
  { icon: <FaClock />, title: "Fast Resolution", desc: "SLA-driven priority handling." },
  { icon: <FaMobileAlt />, title: "Mobile First", desc: "Optimized for all devices." },
  { icon: <FaChartLine />, title: "Data Analytics", desc: "City performance metrics." },
  { icon: <FaShieldAlt />, title: "Secure Core", desc: "Encrypted data & JWT Auth." },
  { icon: <FaCrown />, title: "Premium Tier", desc: "Priority support & unlimited logs." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
};

const HowItWorks = ({ embedded = false }) => {
  return (
    <section className={`${embedded ? "py-20" : "min-h-screen"} relative bg-base-100 overflow-hidden`}>
      
      {/* --- 1. Background Elements (Primary/Secondary only) --- */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>
      
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* --- 2. Hero Section --- */}
      {!embedded && (
        <div className="relative z-10 pt-20 pb-16 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-secondary uppercase tracking-widest text-xs font-bold mb-4 block">
              System Architecture
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-base-content">
              From <span className="text-secondary">Problem</span> to <span className="text-primary">Solution</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-base-content/60 leading-relaxed">
              A transparent workflow designed to bridge the gap between citizens and authorities.
            </p>
          </motion.div>
        </div>
      )}

      {/* --- 3. The Grid --- */}
      <div className="container mx-auto px-4 relative z-10 pb-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="group relative"
            >
              {/* Card Container */}
              <div className="h-full bg-base-100 border border-base-content/10 rounded-3xl p-6 hover:border-primary transition-all duration-500 shadow-sm hover:shadow-xl overflow-hidden">
                
                {/* Step Number Background */}
                <div className="absolute top-2 right-4 text-6xl font-black text-base-content/5 select-none group-hover:scale-110 group-hover:text-primary/10 transition-all duration-500">
                  {idx < 9 ? `0${idx + 1}` : idx + 1}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon Box */}
                  <div className="w-14 h-14 rounded-2xl bg-base-200 text-primary flex items-center justify-center text-2xl group-hover:bg-primary group-hover:text-secondary transition-all duration-300 mb-6">
                    {step.icon}
                  </div>

                  {/* Text Content */}
                  <h3 className="text-lg font-bold mb-2 text-base-content group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm text-base-content/60 leading-relaxed group-hover:text-base-content/80 transition-colors">
                    {step.desc}
                  </p>

                  {/* Decorative Line (Primary Color) */}
                  <div className="mt-auto pt-6">
                    <div className="h-1 w-12 bg-base-content/10 rounded-full group-hover:w-full group-hover:bg-secondary transition-all duration-700" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* --- 4. Bottom CTA --- */}
        {!embedded && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <Link
              to="/dashboard/report-issue"
              className="btn btn-lg btn-primary rounded-full px-10 gap-3 group shadow-lg shadow-primary/30 mt-10"
            >
              Start Reporting
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HowItWorks;