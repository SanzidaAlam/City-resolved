import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaUsers, FaBan, FaCheckCircle } from "react-icons/fa";
import Loader from "../../../Components/Shared/Loader";

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", "citizen"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=citizen");
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, isBlocked }) => {
      const res = await axiosSecure.patch(`/users/status/${id}`, { isBlocked });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        showConfirmButton: false,
        timer: 1000,
      });
    },
  });

  const handleStatusChange = (user) => {
    const action = user.isBlocked ? "Unblock" : "Block";
    Swal.fire({
      title: `Are you sure you want to ${action} this user?`,
      text: user.isBlocked
        ? "They will be able to log in and report issues."
        : "They will not be able to report issues.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: user.isBlocked ? "#36d399" : "#d33",
      confirmButtonText: `Yes, ${action} them!`,
    }).then((result) => {
      if (result.isConfirmed) {
        statusMutation.mutate({ id: user._id, isBlocked: !user.isBlocked });
      }
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaUsers /> Manage Citizens ({users.length})
      </h2>

      <div className="overflow-x-auto bg-base-100 shadow-xl rounded-lg border border-base-200">
        <table className="table">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10">
                        <img
                          src={user.photo || "https://i.pravatar.cc/150"}
                          alt={user.name}
                        />
                      </div>
                    </div>
                    <div className="font-bold">{user.name}</div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  {user.isBlocked ? (
                    <span className="text-error font-bold flex items-center gap-1">
                      <FaBan /> Blocked
                    </span>
                  ) : (
                    <span className="text-success font-bold flex items-center gap-1">
                      <FaCheckCircle /> Active
                    </span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleStatusChange(user)}
                    className={`btn btn-xs ${
                      user.isBlocked ? "btn-success" : "btn-error"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
