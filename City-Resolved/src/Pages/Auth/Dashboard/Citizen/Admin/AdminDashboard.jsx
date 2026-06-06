import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaUsers, FaClipboardList, FaMoneyBillWave, FaSpinner } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContext } from "../../../Context/AuthContext";
import { motion } from "framer-motion";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    // --- FETCH DATA (Updated to TanStack Query v5 API) ---
    const { data: stats = {}, isPending } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin-stats');
            return res.data;
        }
    });

    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    // --- SKELETON LOADER ---
    if (isPending) return (
        <div className="p-6 animate-pulse space-y-6">
            {/* Title Skeleton */}
            <div className="h-10 w-64 bg-base-300 rounded-lg mb-6"></div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-base-300 rounded-2xl"></div>
                ))}
            </div>

            {/* Bottom Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80 bg-base-300 rounded-xl"></div>
                <div className="h-80 bg-base-300 rounded-xl"></div>
            </div>
        </div>
    );

    // --- DATA PREP ---
    const data = [
        { name: 'Pending', value: stats.pendingIssues || 0 },
        { name: 'Resolved', value: stats.resolvedIssues || 0 },
    ];
    
    const COLORS = ['#FFBB28', '#00C49F'];

    return (
        <motion.div 
            className="p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6">
                Admin Dashboard
            </motion.h2>
            
            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Users */}
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
                    <div className="stat-figure text-secondary">
                        <FaUsers className="text-3xl" />
                    </div>
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value text-secondary">{stats.totalUsers || 0}</div>
                </motion.div>

                {/* Total Issues */}
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
                    <div className="stat-figure text-primary">
                        <FaClipboardList className="text-3xl" />
                    </div>
                    <div className="stat-title">Total Issues</div>
                    <div className="stat-value text-primary">{stats.totalIssues || 0}</div>
                </motion.div>

                {/* Total Revenue */}
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
                    <div className="stat-figure text-success">
                        <FaMoneyBillWave className="text-3xl" />
                    </div>
                    <div className="stat-title">Total Revenue</div>
                    <div className="stat-value text-success">{stats.revenue?.toLocaleString() || 0} Tk</div>
                </motion.div>
                
                {/* Pending Issues */}
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
                     <div className="stat-figure text-warning">
                        <FaSpinner className="text-3xl" />
                    </div>
                    <div className="stat-title">Pending Issues</div>
                    <div className="stat-value text-warning">{stats.pendingIssues || 0}</div>
                </motion.div>
            </div>

            {/* --- BOTTOM SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Pie Chart Card */}
                <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl p-6 border border-base-200">
                    <h3 className="text-xl font-bold mb-4">Issue Status Distribution</h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [value, 'Issues']} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
                
                {/* System Health Card */}
                <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl p-6 border border-base-200">
                    <h3 className="text-xl font-bold mb-4">System Health</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                            <span>Server Status</span>
                            <span className="badge badge-success gap-2">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> Online
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                            <span>Database Connection</span>
                            <span className="badge badge-success">Connected</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                            <span>Admin Access</span>
                            <span className="badge badge-primary">Authorized</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;