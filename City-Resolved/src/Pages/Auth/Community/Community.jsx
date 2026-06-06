import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area 
} from 'recharts';
import { FaUsers, FaCheckCircle, FaClipboardList, FaChartLine } from 'react-icons/fa';

const Community = () => {

  // --- 1. DATA FETCHING ---
  const { data: issuesData, isLoading } = useQuery({
    queryKey: ['all-issues-stats'],
    queryFn: async () => {
      // Fetch sufficient data for accurate stats
      const res = await axios.get('http://localhost:3000/issues?limit=1000');
      return res.data.issues || []; 
    }
  });

  const issues = issuesData || [];

  // --- 2. CALCULATE STATS ---
  const counts = useMemo(() => {
    const stats = {
        resolved: 0,
        pending: 0,
        inProgress: 0,
        rejected: 0,
        activeUsers: new Set()
    };

    issues.forEach(issue => {
        const status = (issue.status || 'pending').toLowerCase();
        if (status === 'resolved') stats.resolved++;
        else if (status === 'in-progress') stats.inProgress++;
        else if (status === 'rejected') stats.rejected++;
        else stats.pending++;

        if (issue.reportedBy?.email) {
            stats.activeUsers.add(issue.reportedBy.email);
        }
    });

    return stats;
  }, [issues]);

  const totalActiveUsers = counts.activeUsers.size;
  const successRate = issues.length > 0 
    ? Math.round((counts.resolved / issues.length) * 100) 
    : 0;

  // --- 3. CHART CONFIGURATION ---
  const statusChartData = [
      { name: 'Resolved', value: counts.resolved, colorClass: 'text-primary' },      
      { name: 'In Progress', value: counts.inProgress, colorClass: 'text-secondary' }, 
      { name: 'Pending', value: counts.pending, colorClass: 'text-accent' },        
      { name: 'Rejected', value: counts.rejected, colorClass: 'text-neutral' }       
  ].filter(item => item.value > 0);

  // Cycling colors for Bar Chart
  const BAR_COLOR_CLASSES = ['text-primary', 'text-secondary', 'text-accent', 'text-neutral', 'text-info'];

  const categoryData = useMemo(() => {
    if (!issues.length) return [];
    const catCounts = {};
    issues.forEach(issue => {
      const cat = issue.category || 'Other';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });
    return Object.keys(catCounts).map(key => ({
      name: key,
      count: catCounts[key]
    })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [issues]);

  const trendData = useMemo(() => {
    if (!issues.length) return [];
    const grouped = {};
    issues.forEach(issue => {
      const date = new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return Object.keys(grouped).map(date => ({
      date,
      reports: grouped[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [issues]);

  // --- 4. ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // --- 5. LOADING SKELETON ---
  if (isLoading) {
    return (
        <div className="min-h-screen bg-base-200 py-12 px-4 md:px-8 pt-24">
            <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
                {/* Header Skeleton */}
                <div className="h-16 w-1/3 bg-base-300 rounded-xl mx-auto mb-8"></div>
                {/* Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-base-300 rounded-2xl"></div>)}
                </div>
                {/* Charts Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-[400px] bg-base-300 rounded-2xl"></div>
                    <div className="h-[400px] bg-base-300 rounded-2xl"></div>
                </div>
                {/* Full Width Chart Skeleton */}
                <div className="h-[350px] bg-base-300 rounded-2xl"></div>
            </div>
        </div>
    );
  }

  // --- 6. MAIN CONTENT ---
  return (
    <div className="min-h-screen bg-base-200 font-sans text-base-content py-12 px-4 md:px-8 pt-24">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          Community <span className="text-primary">Impact</span>
        </h1>
        <p className="text-xl font-medium opacity-80 max-w-2xl mx-auto">
          Real-time transparency. Visualizing our collective progress.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >

        {/* --- STATS CARDS (High Visibility) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Reports */}
            <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl border-l-8 border-primary">
                <div className="card-body p-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-primary/20 text-primary text-xl"><FaClipboardList /></div>
                        <div className="text-sm font-extrabold uppercase tracking-widest opacity-70">Total Reports</div>
                    </div>
                    <div className="text-5xl font-black text-primary">{issues.length}</div>
                </div>
            </motion.div>

            {/* Resolved */}
            <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl border-l-8 border-secondary">
                <div className="card-body p-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-secondary/20 text-secondary text-xl"><FaCheckCircle /></div>
                        <div className="text-sm font-extrabold uppercase tracking-widest opacity-70">Resolved</div>
                    </div>
                    <div className="text-5xl font-black text-secondary">{counts.resolved}</div>
                </div>
            </motion.div>

            {/* Active Users */}
            <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl border-l-8 border-accent">
                <div className="card-body p-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-accent/20 text-accent text-xl"><FaUsers /></div>
                        <div className="text-sm font-extrabold uppercase tracking-widest opacity-70">Active Citizens</div>
                    </div>
                    <div className="text-5xl font-black text-accent">{totalActiveUsers}</div>
                </div>
            </motion.div>

            {/* Success Rate */}
            <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl border-l-8 border-neutral">
                <div className="card-body p-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-neutral/20 text-neutral text-xl"><FaChartLine /></div>
                        <div className="text-sm font-extrabold uppercase tracking-widest opacity-70">Success Rate</div>
                    </div>
                    <div className="text-5xl font-black text-base-content">{successRate}%</div>
                </div>
            </motion.div>

        </div>

        {/* --- CHARTS ROW 1 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart A: Categories (Multi-Colored) */}
            <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl">
                <div className="card-body p-8">
                    <h2 className="card-title text-2xl font-black mb-6 text-primary">Top Concerns</h2>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" opacity={0.1} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={100} 
                                    tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 700 }} 
                                    axisLine={false}
                                    tickLine={false}
                                    className="text-base-content"
                                />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))', borderRadius: '12px', border: '2px solid currentColor', fontWeight: 'bold' }}
                                />
                                {/* Using Cell to cycle colors for each bar */}
                                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={32}>
                                    {categoryData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill="currentColor" 
                                            className={BAR_COLOR_CLASSES[index % BAR_COLOR_CLASSES.length]} 
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.div>

            {/* Chart B: Status (Pie) */}
            <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl">
                <div className="card-body p-8 relative">
                    <h2 className="card-title text-2xl font-black mb-6 text-secondary">Resolution Status</h2>
                    <div className="h-[350px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={90}
                                    outerRadius={120}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="currentColor" className={entry.colorClass} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))', borderRadius: '12px', border: '2px solid currentColor', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        
                        {/* Center Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none top-8">
                            <div className="text-6xl font-black text-base-content tracking-tighter">{issues.length}</div>
                            <div className="text-sm font-extrabold uppercase tracking-widest opacity-60 text-base-content mt-1">Total</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* --- CHART ROW 2: TRENDS --- */}
        <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl">
             <div className="card-body p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="card-title text-2xl font-black mb-1 text-accent">Reporting Activity</h2>
                        <p className="text-sm font-bold opacity-60">Volume of reports over time</p>
                    </div>
                </div>
                
                <div className="h-[350px] w-full text-accent">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="date" 
                                tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 700 }} 
                                axisLine={false}
                                tickLine={false}
                                className="text-base-content"
                            />
                            <YAxis 
                                tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 700 }} 
                                axisLine={false}
                                tickLine={false}
                                className="text-base-content"
                            />
                            <CartesianGrid vertical={false} stroke="currentColor" strokeDasharray="4 4" opacity={0.15} className="text-base-content" />
                            <Tooltip 
                                 contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))', borderRadius: '12px', border: '2px solid currentColor', fontWeight: 'bold' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="reports" 
                                stroke="currentColor" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorReports)" 
                                className="text-accent"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
             </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Community;