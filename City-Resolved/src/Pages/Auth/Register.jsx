import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import { Upload, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { imageUpload } from "../../Components/Elements/ImageUpload";
import Loader from "../../Components/Shared/Loader";

const Register = () => {
  const { createUser, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadProgress(1);

    try {
      const url = await imageUpload(file, (progress) => {
        setUploadProgress(progress);
      });
      setImageUrl(url);
    } catch (error) {
      console.error(error);
      setUploadProgress(0);
      Swal.fire("Error", "Image upload failed", "error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    if (password.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "warning");
      return;
    }

    if (!imageUrl) {
      Swal.fire("Error", "Please wait for image upload to complete", "warning");
      return;
    }

    setLoading(true);

    try {
      await createUser(email, password);

      await updateUser(name, imageUrl);

      const userInfo = {
        name: name,
        email: email,
        photo: imageUrl,
      };

      await axios.post(
        "http://localhost:3000/users",
        userInfo
      );

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Welcome to City Resolved!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.error?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-primary">
              Create Account
            </h2>
            <p className="text-base-content/70">
              Join us to make your city better
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Profile Photo</span>
              </label>
              <div className="relative border-2 border-dashed border-base-300 rounded-lg p-4 hover:border-primary transition-colors text-center cursor-pointer h-32 flex flex-col justify-center items-center">
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required={!imageUrl}
                />

                {uploadProgress > 0 && uploadProgress < 100 ? (
                  <div className="w-full px-4">
                    <progress
                      className="progress progress-primary w-full"
                      value={uploadProgress}
                      max="100"
                    ></progress>
                    <p className="text-xs text-center mt-1 font-semibold">
                      {uploadProgress}% Uploading...
                    </p>
                  </div>
                ) : imageUrl ? (
                  <div className="flex flex-col items-center text-success">
                    <CheckCircle size={32} className="mb-2" />
                    <span className="text-sm font-bold">
                      Image Uploaded Successfully
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-base-content/60">
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="citizen@example.com"
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••"
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={
                  loading || (uploadProgress > 0 && uploadProgress < 100)
                }
                className="btn btn-primary w-full text-lg "
              >
                {loading ? <Loader /> : "Register"}
              </button>
            </div>
          </form>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="link link-primary font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;