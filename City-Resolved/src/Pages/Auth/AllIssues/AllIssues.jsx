import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link, useNavigate } from "react-router";
import { FaSearch, FaMapMarkerAlt, FaThumbsUp, FaArrowLeft, FaArrowRight, FaFilter } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";
import CardSkeleton from "../../Components/Shared/CardSkeleton";
import { motion, AnimatePresence } from "motion/react";

const AllIssues = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 

  // --- CHANGED SECTION STARTS HERE ---
  
  // Fetching Data with Query Params
  // 1. We removed ": issues = []" because data is now an object, not an array
  const { data, isLoading } = useQuery({
    // 2. IMPORTANT: Added 'currentPage' to queryKey. 
    // This triggers a re-fetch whenever the page changes.
    queryKey: ["all-issues", search, status, category, currentPage],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/issues`, {
        params: { 
          search, 
          status, 
          category,
          // 3. Send pagination params to backend
          page: currentPage,
          limit: itemsPerPage
        },
      });
      return res.data; // Returns { issues: [...], total: 123 }
    },
  });

  // 4. Extract data safely from the response object
  const issuesList = data?.issues || []; // The actual array of issues
  const totalCount = data?.total || 0;   // The total count from DB

  // 5. Calculate total pages based on Server Total
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Note: We REMOVED the client-side .slice() logic here because 
  // the server now returns only the 12 items we need.

  // --- CHANGED SECTION ENDS HERE ---

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const upvoteMutation = useMutation({
    mutationFn: async (issueId) => {
      if (!user) { navigate("/auth/login"); throw new Error("Please login"); }
      const res = await axiosSecure.patch(`/issues/upvote/${issueId}`, { userEmail: user.email });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-issues"]);
      Swal.fire({ icon: "success", title: "Upvoted!", showConfirmButton: false, timer: 1000, toast: true, position: 'top-end' });
    },
  });

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setCategory("");
    setCurrentPage(1);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      
      {/* --- Header & Search Section --- */}
      <div className="flex flex-col gap-6 mb-10">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Reported Issues</h2>
          <p className="text-gray-500">Browse and track community reports in real-time.</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-base-200 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <input 
              type="text" 
              placeholder="Search by title..." 
              className="input input-bordered w-full pl-10 focus:input-primary" 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <select 
              className="select select-bordered w-full sm:w-auto focus:select-primary" 
              value={status} 
              onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>

            <button 
              onClick={handleReset} 
              className="btn btn-neutral btn-outline gap-2"
              title="Reset Filters"
            >
              <FaFilter /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* --- Content Grid --- */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode='wait'>
            {issuesList.length > 0 ? (
              issuesList.map((issue) => (
                <motion.div
                  layout // Enables smooth layout shifts when filtering
                  variants={cardVariants}
                  whileHover={{ y: -5 }} // Card lifts slightly on hover
                  key={issue._id}
                  className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col overflow-hidden group"
                >
                  <figure className="h-48 overflow-hidden relative">
                    <motion.img 
                      whileHover={{ scale: 1.1 }} // Image zooms in on hover
                      transition={{ duration: 0.4 }}
                      src={issue.photo} 
                      alt={issue.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className={`absolute top-2 right-2 badge ${issue.status === 'resolved' ? 'badge-success text-white' : 'badge-warning text-white'} uppercase text-xs font-bold`}>
                      {issue.status || 'Pending'}
                    </div>
                  </figure>

                  <div className="card-body p-5 flex-grow">
                    <div className="flex justify-between items-start">
                      <div className="badge badge-outline badge-sm mb-2 opacity-70">{issue.category}</div>
                      <span className="text-xs text-gray-400">{new Date(issue.date || Date.now()).toLocaleDateString()}</span>
                    </div>

                    <h2 className="card-title text-lg font-bold text-gray-800 leading-tight mb-1">
                      {issue.title}
                    </h2>
                    
                    <p className="text-xs flex items-center gap-1 text-gray-500 mb-2">
                      <FaMapMarkerAlt className="text-primary" /> {issue.location}
                    </p>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
                      {issue.description}
                    </p>

                    <div className="divider my-2"></div>

                    <div className="card-actions justify-between items-center">
                      <button 
                        onClick={() => upvoteMutation.mutate(issue._id)} 
                        className={`btn btn-sm ${issue.upvotedBy?.includes(user?.email) ? "btn-primary" : "btn-ghost"} gap-2`}
                      >
                        <FaThumbsUp /> {issue.upvotes}
                      </button>
                      <Link to={`/issues/${issue._id}`} className="btn btn-sm btn-outline btn-primary">
                        Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <div className="text-gray-400 text-xl">No issues found matching your criteria.</div>
                <button onClick={handleReset} className="btn btn-link">Clear filters</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* --- Pagination --- */}
      {!isLoading && totalCount > itemsPerPage && (
        <div className="flex justify-center mt-16 gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="btn btn-circle btn-outline btn-sm md:btn-md"
          >
            <FaArrowLeft />
          </button>
          
          <div className="join">
            {[...Array(totalPages)].map((_, index) => {
              // Simple logic to show limited page numbers if too many pages exist
              if (index + 1 === 1 || index + 1 === totalPages || (index + 1 >= currentPage - 1 && index + 1 <= currentPage + 1)) {
                return (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`join-item btn btn-sm md:btn-md ${currentPage === index + 1 ? "btn-active btn-primary" : ""}`}
                  >
                    {index + 1}
                  </button>
                );
              } else if (index + 1 === currentPage - 2 || index + 1 === currentPage + 2) {
                return <button key={index} className="join-item btn btn-disabled btn-sm md:btn-md">...</button>;
              }
              return null;
            })}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="btn btn-circle btn-outline btn-sm md:btn-md"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default AllIssues;