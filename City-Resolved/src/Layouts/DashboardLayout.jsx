import React, { useContext } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import useRole from "../Hooks/useRole";
import {
  Home,
  Users,
  FileText,
  CreditCard,
  UserCog,
  LogOut,
  Menu,
  PlusCircle,
  List,
  LayoutDashboard,
} from "lucide-react";

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [role] = useRole();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const sidebarOptions = (
    <>
      {role === "admin" && (
        <>
          <li>
            <NavLink to="/dashboard/admin-home">
              <LayoutDashboard size={18} /> Admin Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-users">
              <Users size={18} /> Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-staff">
              <UserCog size={18} /> Manage Staff
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/all-issues">
              <List size={18} /> All Issues
            </NavLink>
          </li>
          
        </>
      )}

      {role === "staff" && (
        <>
          <li>
            <NavLink to="/dashboard/staff-home">
              <LayoutDashboard size={18} /> Staff Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/assigned-issues">
              <List size={18} /> Assigned Issues
            </NavLink>
          </li>
        </>
      )}

      {role === "citizen" && (
        <>
          <li>
            <NavLink to="/dashboard/citizen-home">
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/my-issues">
              <FileText size={18} /> My Issues
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/report-issue">
              <PlusCircle size={18} /> Report Issue
            </NavLink>
          </li>
        </>
      )}

      <div className="divider"></div>

      <li>
        <NavLink to="/dashboard/profile">
          <UserCog size={18} /> Profile
        </NavLink>
      </li>
      <li>
        <NavLink to="/">
          <Home size={18} /> Back to Home
        </NavLink>
      </li>
      <li>
        <button onClick={handleLogout} className="text-error">
          <LogOut size={18} /> Logout
        </button>
      </li>
    </>
  );

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-200 min-h-screen">
        <div className="w-full navbar bg-base-100 lg:hidden shadow-sm">
          <div className="flex-none">
            <label
              htmlFor="dashboard-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <Menu size={24} />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold text-lg">
            City Resolved
          </div>
        </div>

        <div className="p-8">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content shadow-xl space-y-2">
          <div className="mb-6 flex flex-col items-center">
            <div className="avatar mb-2">
              <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user?.photoURL} alt="User" />
              </div>
            </div>
            <p className="font-bold text-lg">{user?.displayName}</p>
            <p className="text-xs uppercase tracking-widest badge badge-ghost">
              {role}
            </p>
          </div>
          {sidebarOptions}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
