import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { FaPaperPlane, FaMapMarkerAlt } from "react-icons/fa";
import Loader from "../../../Components/Shared/Loader";
import { imageUpload } from "../../../Components/Elements/ImageUpload";

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    
    const title = form.title.value;
    const description = form.description.value;
    const category = form.category.value;
    const location = form.location.value;
    const imageFile = form.image.files[0];

    try {
      const photoURL = await imageUpload(imageFile);

      const issueData = {
        title,
        description,
        category,
        location,
        photo: photoURL,
        reportedBy: {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL
        },
        status: 'pending',
        priority: 'normal',
        upvotes: 0,
        createdAt: new Date()
      };

      const dbResponse = await axiosSecure.post('/issues', issueData);

      if (dbResponse.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Issue Reported!',
          text: 'Your issue has been submitted successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/dashboard/my-issues');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Limit Reached',
          text: dbResponse.data.message,
          footer: '<a href="/dashboard/profile">Upgrade to Premium</a>'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Report a New Issue</h2>
        <p className="text-gray-500">Help us make the city better by reporting infrastructure problems.</p>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Issue Title</span></label>
              <input type="text" name="title" placeholder="E.g., Broken Street Light" className="input input-bordered w-full" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Category</span></label>
                <select name="category" className="select select-bordered w-full" required defaultValue="">
                  <option disabled value="">Select Category</option>
                  <option value="Roads">Roads & Potholes</option>
                  <option value="Lighting">Street Lighting</option>
                  <option value="Water">Water & Drainage</option>
                  <option value="Garbage">Garbage & Waste</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Location</span></label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" name="location" placeholder="E.g., Mirpur 10" className="input input-bordered w-full pl-10" required />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Upload Image</span></label>
              <input type="file" name="image" className="file-input file-input-bordered file-input-primary w-full" accept="image/*" required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Description </span></label>
              <textarea name="description" className="textarea textarea-bordered h-32 mx-4" placeholder="Describe the issue..." required></textarea>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full text-lg" disabled={loading}>
                {loading ? <Loader /> : <><FaPaperPlane /> Submit Report</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;