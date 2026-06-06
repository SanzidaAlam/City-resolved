import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Link } from "react-router";
import { FaEdit, FaTrash, FaEye, FaMapMarkerAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../../Components/Shared/Loader";
import { imageUpload } from "../../../Components/Elements/ImageUpload";

const MyIssues = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");
  
  const axiosSecure = useAxiosSecure();

  const [editingIssue, setEditingIssue] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const { data: issues = [], isLoading: isIssuesLoading } = useQuery({
    queryKey: ["my-issues", user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-issues/${user.email}`);
      return res.data;
    },
  });

  const filteredIssues = filterStatus === "all" 
    ? issues 
    : issues.filter(issue => issue.status === filterStatus);

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/issues/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Your issue has been deleted.", "success");
      queryClient.invalidateQueries(["my-issues"]);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleEditClick = (issue) => {
    setEditingIssue(issue);
    document.getElementById('edit_modal').showModal();
  };

  const handleUpdateIssue = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    const form = e.target;
    
    const title = form.title.value;
    const description = form.description.value;
    const category = form.category.value;
    const location = form.location.value;
    const imageFile = form.image.files[0];

    try {
        let photoURL = editingIssue.photo;

        if(imageFile) {
            photoURL = await imageUpload(imageFile);
        }

        const updateData = { title, description, category, location, photo: photoURL };

        await axiosSecure.patch(`/issues/${editingIssue._id}`, updateData);
        
        Swal.fire("Success", "Issue updated successfully", "success");
        queryClient.invalidateQueries(["my-issues"]);
        document.getElementById('edit_modal').close();
        setEditingIssue(null);
    } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to update issue", "error");
    } finally {
        setModalLoading(false);
    }
  };

  if (authLoading || isIssuesLoading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Reported Issues</h2>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="font-semibold">Filter:</span>
            <select 
                className="select select-bordered select-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
            </select>
            <Link to="/dashboard/report-issue" className="btn btn-primary btn-sm ml-2">
                + Report New
            </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 shadow-xl rounded-lg border border-base-200">
        <table className="table">
          <thead className="bg-base-200 text-base-content uppercase">
            <tr>
              <th>Issue</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={issue.photo} alt={issue.title} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{issue.title}</div>
                      <div className="text-sm opacity-50 flex items-center gap-1">
                        <FaMapMarkerAlt size={10} /> {issue.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-ghost badge-sm">{issue.category}</span>
                </td>
                <td>
                    <span className={`badge ${
                        issue.status === 'resolved' ? 'badge-success' : 
                        issue.status === 'in-progress' ? 'badge-info' : 'badge-warning'
                    } capitalize`}>
                        {issue.status}
                    </span>
                </td>
                <td className="text-xs">
                    {new Date(issue.createdAt).toLocaleDateString()}
                </td>
                <th>
                  <div className="flex gap-2">
                    <Link to={`/issues/${issue._id}`} className="btn btn-ghost btn-xs tooltip" data-tip="View Details">
                        <FaEye />
                    </Link>
                    
                    {issue.status === 'pending' && (
                        <button 
                            onClick={() => handleEditClick(issue)}
                            className="btn btn-ghost btn-xs text-info tooltip" 
                            data-tip="Edit"
                        >
                            <FaEdit />
                        </button>
                    )}

                    <button 
                        onClick={() => handleDelete(issue._id)}
                        className="btn btn-ghost btn-xs text-error tooltip" 
                        data-tip="Delete"
                    >
                        <FaTrash />
                    </button>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredIssues.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                No issues found.
            </div>
        )}
      </div>

      <dialog id="edit_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Edit Issue</h3>
            {editingIssue && (
                <form onSubmit={handleUpdateIssue} className="space-y-4">
                    <div className="form-control">
                        <label className="label">Title</label>
                        <input type="text" name="title" defaultValue={editingIssue.title} className="input input-bordered" required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">Category</label>
                            <select name="category" defaultValue={editingIssue.category} className="select select-bordered">
                                <option value="Roads">Roads & Potholes</option>
                                <option value="Lighting">Street Lighting</option>
                                <option value="Water">Water & Drainage</option>
                                <option value="Garbage">Garbage & Waste</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">Location</label>
                            <input type="text" name="location" defaultValue={editingIssue.location} className="input input-bordered" required />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">Update Image (Optional)</label>
                        <input type="file" name="image" className="file-input file-input-bordered w-full" accept="image/*" />
                    </div>

                    <div className="form-control">
                        <label className="label">Description</label>
                        <textarea name="description" defaultValue={editingIssue.description} className="textarea textarea-bordered h-24 mx-4" required></textarea>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={() => document.getElementById('edit_modal').close()}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                            {modalLoading ? <span className="loading loading-spinner"></span> : "Update Changes"}
                        </button>
                    </div>
                </form>
            )}
        </div>
      </dialog>
    </div>
  );
};

export default MyIssues;