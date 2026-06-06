import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { AuthContext } from "../../../Context/AuthContext";
import Loader from "../../../Components/Shared/Loader";
import {
  FaClipboardList,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

const CitizenDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: issues = [], isLoading: isIssuesLoading } = useQuery({
    queryKey: ["my-issues", user?.email],
    enabled: !authLoading && !!user?.email, 
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-issues/${user.email}`);
      return res.data;
    },
  });

  // 4. Show loader if Auth is checking OR Data is fetching
  if (authLoading || isIssuesLoading) return <Loader />;

  const totalIssues = issues.length;
  // Safety check: ensure issues is an array before filtering
  const pendingIssues = Array.isArray(issues) ? issues.filter((issue) => issue.status === "pending").length : 0;
  const resolvedIssues = Array.isArray(issues) ? issues.filter((issue) => issue.status === "resolved").length : 0;
  const inProgressIssues = Array.isArray(issues) ? issues.filter((issue) => issue.status === "in-progress").length : 0;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Welcome, {user?.displayName}!</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Issues */}
        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-primary">
            <FaClipboardList className="text-3xl" />
          </div>
          <div className="stat-title">Total Reported</div>
          <div className="stat-value text-primary">{totalIssues}</div>
          <div className="stat-desc">Issues submitted by you</div>
        </div>

        {/* Pending */}
        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-warning">
            <FaSpinner className="text-3xl" />
          </div>
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">{pendingIssues}</div>
          <div className="stat-desc">Waiting for staff</div>
        </div>

        {/* In Progress */}
        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-info">
             {/* Using a spinner icon instead of Loader component here to avoid layout shifts */}
             <FaSpinner className="text-3xl animate-spin" />
          </div>
          <div className="stat-title">In Progress</div>
          <div className="stat-value text-info">{inProgressIssues}</div>
          <div className="stat-desc">Currently being fixed</div>
        </div>

        {/* Resolved */}
        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-success">
            <FaCheckCircle className="text-3xl" />
          </div>
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-success">{resolvedIssues}</div>
          <div className="stat-desc">Successfully fixed</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          {issues.length === 0 ? (
            <p className="text-gray-500">No issues reported yet.</p>
          ) : (
            <ul className="steps steps-vertical">
              {issues.slice(0, 3).map((issue) => (
                <li
                  key={issue._id}
                  className={`step step-${
                    issue.status === "resolved" ? "success" : "primary"
                  }`}
                >
                  {issue.title}{" "}
                  <span className="text-xs ml-2 opacity-60">
                    ({new Date(issue.createdAt).toLocaleDateString()})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;