import React, { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthContext";
import Loader from "../../Components/Shared/Loader";
import {
  FaArrowUp,
  FaTrash,
  FaEdit,
  FaMapMarkerAlt,
  FaUserTie,
} from "react-icons/fa";
import Swal from "sweetalert2";

const IssueDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: issue, isLoading: isIssueLoading } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3000/issues/${id}`
      );
      return res.data;
    },
  });

  const { data: timeline = [], isLoading: isTimelineLoading } = useQuery({
    queryKey: ["timeline", id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3000/timelines/${id}`
      );
      return res.data;
    },
  });

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.delete(`/issues/${id}`);
        Swal.fire("Deleted!", "Your issue has been deleted.", "success");
        navigate("/dashboard/my-issues");
      }
    });
  };

  if (isIssueLoading || isTimelineLoading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
            <figure className="h-64 md:h-96 w-full relative">
              <img
                src={issue.photo || "https://via.placeholder.com/800x400"}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
              {issue.priority === "high" && (
                <div className="absolute top-4 right-4 badge badge-error gap-2 p-3 animate-pulse text-white">
                  <FaArrowUp /> High Priority
                </div>
              )}
              <div className="absolute bottom-4 left-4 badge badge-neutral p-3">
                {issue.category}
              </div>
            </figure>

            <div className="card-body">
              <h1 className="text-3xl font-bold">{issue.title}</h1>
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <FaMapMarkerAlt className="text-primary" />
                <span className="font-semibold">{issue.location}</span>
              </div>

              <p className="text-gray-700 leading-relaxed text-lg">
                {issue.description}
              </p>
              {user?.email === issue.reportedBy.email && (
                <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-base-200">
                  {issue.status === "pending" && (
                    <button className="btn btn-outline btn-info gap-2">
                      <FaEdit /> Edit Issue
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="btn btn-outline btn-error gap-2"
                  >
                    <FaTrash /> Delete
                  </button>

                  {issue.priority !== "high" && (
                    <Link
                      to="/dashboard/payment"
                      state={{ price: 500, type: "boost", issueId: issue._id }}
                      className="btn btn-warning gap-2"
                    >
                      <FaArrowUp /> Boost Priority (500tk)
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {issue.assignedStaff && (
            <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaUserTie className="text-primary" /> Assigned Staff
              </h3>
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img
                      src={
                        issue.assignedStaff.photo || "https://i.pravatar.cc/150"
                      }
                      alt="Staff"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {issue.assignedStaff.name}
                  </p>
                  <p className="text-gray-500">{issue.assignedStaff.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl border border-base-200 p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-6 border-b pb-2">
              Issue Timeline
            </h3>

            <ul className="steps steps-vertical w-full">
              {timeline.map((entry) => (
                <li
                  key={entry._id}
                  className={`step ${
                    entry.status === "resolved" || entry.status === "closed"
                      ? "step-success"
                      : entry.status === "boosted"
                      ? "step-warning"
                      : "step-primary"
                  }`}
                >
                  <div className="text-left ml-2 mb-4 w-full">
                    <p className="font-bold text-sm uppercase opacity-70">
                      {entry.status}
                    </p>
                    <p className="font-medium">{entry.message}</p>
                    <div className="text-xs text-gray-400 mt-1 flex justify-between">
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      <span className="badge badge-xs badge-ghost">
                        {entry.updatedBy}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
