import React from "react";
import { motion } from "framer-motion";
import { FaTools, FaCog, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router"; // Assuming you are using react-router

const ManageUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-lg space-y-8"
      >
        {/* Animated Construction Icons */}
        <div className="relative flex justify-center items-center h-40 w-40 mx-auto">
          {/* Spinning background gear */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute text-primary opacity-20 text-[150px]"
          >
            <FaCog />
          </motion.div>
          
          {/* Floating foreground tools */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative z-10 text-7xl text-secondary drop-shadow-xl"
          >
            <FaTools />
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-base-content tracking-tight">
            Under Construction
          </h2>
          <p className="text-lg text-base-content/60 leading-relaxed">
            We're currently building out the <span className="font-semibold text-primary">Manage Citizens</span> feature. 
            Our team is working hard to bring this to you soon. Check back later!
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="btn btn-primary shadow-lg shadow-primary/30 gap-2"
        >
          <FaArrowLeft /> Go Back
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ManageUsers;