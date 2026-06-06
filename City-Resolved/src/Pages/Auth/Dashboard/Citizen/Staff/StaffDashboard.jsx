import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { AuthContext } from "../../../Context/AuthContext";
import { FaClipboardList, FaCheckCircle, FaArchive } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // --- FETCH DATA (Updated to TanStack Query v5) ---
  const { data: stats = {}, isPending } = useQuery({
    queryKey: ["staff-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/staff-stats/${user.email}`);
      return res.data;
    },
  });

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  // --- SKELETON LOADER ---
  if (isPending)
    return (
      <div className="p-6 space-y-6">
        <div className="h-10 w-64 bg-base-300 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-base-300 rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-base-300 rounded-xl animate-pulse border border-base-200"></div>
      </div>
    );

  const data = [
    { name: "Assigned", count: stats.totalAssigned || 0 },
    { name: "Resolved", count: stats.totalResolved || 0 },
    { name: "Closed", count: stats.totalClosed || 0 },
  ];

  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6">
        Staff Dashboard
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200"
        >
          <div className="stat-figure text-primary">
            <FaClipboardList className="text-3xl" />
          </div>
          <div className="stat-title">Assigned Issues</div>
          <div className="stat-value text-primary">{stats.totalAssigned || 0}</div>
          <div className="stat-desc">Total tasks assigned to you</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200"
        >
          <div className="stat-figure text-success">
            <FaCheckCircle className="text-3xl" />
          </div>
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-success">{stats.totalResolved || 0}</div>
          <div className="stat-desc">Issues fixed</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200"
        >
          <div className="stat-figure text-secondary">
            <FaArchive className="text-3xl" />
          </div>
          <div className="stat-title">Closed</div>
          <div className="stat-value text-secondary">{stats.totalClosed || 0}</div>
          <div className="stat-desc">Finalized issues</div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="card bg-base-100 shadow-xl p-6 border border-base-200"
      >
        <h3 className="text-xl font-bold mb-4">Work Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [value, 'Issues']} />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" barSize={50} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StaffDashboard;