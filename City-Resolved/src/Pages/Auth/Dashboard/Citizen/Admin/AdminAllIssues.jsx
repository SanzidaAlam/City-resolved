import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  FaClipboardList,
  FaUserPlus,
  FaCheckCircle,
  FaArrowUp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminAllIssues = () => {
  const queryClient = useQueryClient();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const axiosSecure = useAxiosSecure();

  // --- FETCH ALL ISSUES ---
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["all-issues-admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues");
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return res.data.issues || [];
    },
  });

  // --- FETCH STAFF MEMBERS ---
  const { data: staffList = [] } = useQuery({
    queryKey: ["staff-list"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=staff");
      return res.data;
    },
  });

  // --- ASSIGN STAFF MUTATION ---
  const assignMutation = useMutation({
    mutationFn: async ({ issueId, staff }) => {
      return axiosSecure.patch(`/issues/${issueId}/assign`, {
        staffId: staff._id,
        staffName: staff.name,
        staffEmail: staff.email,
        staffPhoto: staff.photo,
      });
    },
    onSuccess: () => {
      // Updated to React Query v5 object syntax
      queryClient.invalidateQueries({ queryKey: ["all-issues-admin"] });
      document.getElementById("assign_modal").close();
      Swal.fire({
        title: "Assigned!",
        text: "Staff has been assigned successfully.",
        icon: "success"
      });
    },
  });

  // --- REJECT ISSUE MUTATION ---
  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.patch(`/issues/${id}/reject`);
    },
    onSuccess: () => {
      // Updated to React Query v5 object syntax
      queryClient.invalidateQueries({ queryKey: ["all-issues-admin"] });
      Swal.fire({
        title: "Rejected",
        text: "Issue has been rejected.",
        icon: "info"
      });
    },
  });

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const staffId = e.target.staff.value;
    const selectedStaff = staffList.find((s) => s._id === staffId);

    if (selectedIssue && selectedStaff) {
      assignMutation.mutate({
        issueId: selectedIssue._id,
        staff: selectedStaff,
      });
    }
  };

  const handleReject = (id) => {
    Swal.fire({
      title: "Reject this issue?",
      text: "It will be marked as invalid.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, reject it!",
    }).then((result) => {
      if (result.isConfirmed) {
        rejectMutation.mutate(id);
      }
    });
  };

  const openAssignModal = (issue) => {
    setSelectedIssue(issue);
    document.getElementById("assign_modal").showModal();
  };

  // --- Framer Motion Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
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
  if (isLoading)
    return (
      <div className="p-6 space-y-6">
        <div className="h-10 w-64 bg-base-300 rounded-lg animate-pulse mb-6"></div>
        <div className="bg-base-100 shadow-xl rounded-lg border border-base-200 overflow-hidden">
          <div className="h-12 bg-base-200 animate-pulse"></div>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center p-4 border-b border-base-200 animate-pulse gap-4"
            >
              <div className="w-12 h-12 bg-base-300 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-base-300 rounded"></div>
                <div className="h-3 w-1/4 bg-base-300 rounded"></div>
              </div>
              <div className="w-20 h-6 bg-base-300 rounded-full"></div>
              <div className="w-24 h-8 bg-base-300 rounded"></div>
            </div>
          ))}
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
        <FaClipboardList /> All Reported Issues
      </motion.h2>

      <motion.div
        variants={itemVariants}
        className="overflow-x-auto bg-base-100 shadow-xl rounded-lg border border-base-200"
      >
        <table className="table">
          <thead className="bg-base-200">
            <tr>
              <th>Issue</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned Staff</th>
              <th>Actions</th>
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
                  exit={{ opacity: 0, x: -30 }}
                  className="hover:bg-base-50/50 transition-colors"
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
                        <div className="text-sm opacity-50">
                          {issue.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        issue.status === "resolved"
                          ? "badge-success"
                          : issue.status === "rejected"
                          ? "badge-error"
                          : issue.status === "in-progress"
                          ? "badge-info"
                          : "badge-warning"
                      } capitalize`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td>
                    {issue.priority === "high" ? (
                      <div className="badge badge-error gap-1 text-white">
                        <FaArrowUp size={10} /> High
                      </div>
                    ) : (
                      <div className="badge badge-ghost">Normal</div>
                    )}
                  </td>
                  <td>
                    {issue.assignedStaff ? (
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8">
                            <img src={issue.assignedStaff.photo} alt="Staff" />
                          </div>
                        </div>
                        <span className="font-semibold text-sm">
                          {issue.assignedStaff.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">
                        Not assigned
                      </span>
                    )}
                  </td>
                  <th>
                    <div className="flex gap-2">
                      {!issue.assignedStaff &&
                        issue.status !== "rejected" &&
                        issue.status !== "resolved" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openAssignModal(issue)}
                            className="btn btn-xs btn-primary gap-1"
                          >
                            <FaUserPlus /> Assign
                          </motion.button>
                        )}

                      {issue.status === "pending" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(issue._id)}
                          className="btn btn-xs btn-error btn-outline"
                        >
                          Reject
                        </motion.button>
                      )}

                      {issue.assignedStaff && (
                        <span className="text-success text-xs flex items-center gap-1">
                          <FaCheckCircle /> Assigned
                        </span>
                      )}
                    </div>
                  </th>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      <dialog id="assign_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Assign Staff Member</h3>
          <p className="py-2">
            Select a staff member to handle:{" "}
            <span className="font-bold">{selectedIssue?.title}</span>
          </p>

          <form onSubmit={handleAssignSubmit}>
            <div className="form-control w-full my-4">
              <label className="label">
                <span className="label-text">Available Staff</span>
              </label>
              <select name="staff" className="select select-bordered" defaultValue="" required>
                <option disabled value="">
                  Select Staff...
                </option>
                {staffList.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name} ({staff.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("assign_modal").close()}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm Assignment
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </motion.div>
  );
};

export default AdminAllIssues;