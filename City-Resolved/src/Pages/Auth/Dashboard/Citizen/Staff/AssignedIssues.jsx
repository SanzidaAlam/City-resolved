import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthContext";
import {
  FaTasks,
  FaArrowUp,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const AssignedIssues = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  // --- FETCH DATA (Updated to TanStack Query v5) ---
  const { data: issues = [], isPending } = useQuery({
    queryKey: ["assigned-issues", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/assigned/${user.email}`);
      return res.data;
    },
  });

  // --- STATUS MUTATION ---
  const statusMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      return axiosSecure.patch(`/issues/status/${id}`, {
        status: newStatus,
        userEmail: user.email,
        userName: user.displayName,
      });
    },
    onSuccess: () => {
      // Updated invalidateQueries syntax for v5
      queryClient.invalidateQueries({ queryKey: ["assigned-issues"] });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Status Updated",
        showConfirmButton: false,
        timer: 1000,
      });
    },
  });

  const handleStatusChange = (id, e) => {
    const newStatus = e.target.value;
    if (newStatus) {
      statusMutation.mutate({ id, newStatus });
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  // --- SKELETON LOADER ---
  if (isPending)
    return (
      <div className="p-6 space-y-6">
        <div className="h-10 w-64 bg-base-300 rounded animate-pulse mb-6"></div>
        <div className="overflow-x-auto bg-base-100 shadow-xl rounded-lg border border-base-200">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th>Issue Details</th>
                <th>Priority</th>
                <th>Current Status</th>
                <th>Update Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-base-200">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-base-300 rounded-xl"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-base-300 rounded"></div>
                        <div className="h-3 w-24 bg-base-300 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="h-6 w-16 bg-base-300 rounded-full"></div>
                  </td>
                  <td>
                    <div className="h-6 w-20 bg-base-300 rounded-full"></div>
                  </td>
                  <td>
                    <div className="h-8 w-32 bg-base-300 rounded"></div>
                  </td>
                  <td>
                    <div className="h-6 w-24 bg-base-300 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        variants={itemVariants}
        className="text-3xl font-bold mb-6 flex items-center gap-2"
      >
        <FaTasks /> My Assigned Tasks
      </motion.h2>

      <motion.div
        variants={itemVariants}
        className="overflow-x-auto bg-base-100 shadow-xl rounded-lg border border-base-200"
      >
        <table className="table">
          <thead className="bg-base-200">
            <tr>
              <th>Issue Details</th>
              <th>Priority</th>
              <th>Current Status</th>
              <th>Update Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {issues.map((issue) => (
                <motion.tr
                  key={issue._id}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30, filter: "blur(5px)" }}
                  transition={{ duration: 0.2 }}
                  className={issue.priority === "high" ? "bg-error/5" : "hover:bg-base-50/50 transition-colors"}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={issue.photo} alt="Issue" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{issue.title}</div>
                        <div className="text-sm opacity-50 flex items-center gap-1">
                          <FaMapMarkerAlt /> {issue.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {issue.priority === "high" ? (
                      <div className="badge badge-error text-white gap-1 font-bold animate-pulse">
                        <FaArrowUp /> High
                      </div>
                    ) : (
                      <div className="badge badge-ghost">Normal</div>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        issue.status === "resolved"
                          ? "badge-success"
                          : issue.status === "closed"
                          ? "badge-neutral"
                          : issue.status === "in-progress"
                          ? "badge-info"
                          : "badge-warning"
                      } capitalize font-semibold`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="select select-bordered select-sm w-full max-w-xs focus:select-primary"
                      defaultValue={issue.status}
                      onChange={(e) => handleStatusChange(issue._id, e)}
                      disabled={issue.status === "closed"}
                    >
                      <option disabled>Change Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="working">Working</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <th>
                    <Link
                      to={`/issues/${issue._id}`}
                      className="btn btn-ghost btn-xs"
                    >
                      View Details
                    </Link>
                  </th>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {issues.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <FaCheckCircle className="text-4xl mx-auto mb-2 text-success opacity-50" />
            <p>No pending tasks! Great job.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AssignedIssues;