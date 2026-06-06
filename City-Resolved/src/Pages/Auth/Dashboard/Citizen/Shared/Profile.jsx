import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { imageUpload } from "../../../Components/Elements/ImageUpload";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "motion/react";
import { 
  FaUserEdit, FaSave, FaTimes, FaCamera, FaEnvelope, 
  FaCalendarAlt, FaShieldAlt, FaMapMarkerAlt, FaMedal, FaCity 
} from "react-icons/fa";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch User Data from DB to get role and status
  const { data: dbUser, isLoading, refetch } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage({
        file: file,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    const form = e.target;
    const name = form.name.value;
    
    try {
      let photoURL = dbUser?.photo || user?.photoURL;

      // 1. Upload new image if selected
      if (previewImage?.file) {
        photoURL = await imageUpload(previewImage.file);
      }

      // 2. Update in MongoDB
      const res = await axiosSecure.patch(`/users/profile/${user.email}`, {
        name,
        photo: photoURL
      });

      if (res.data.modifiedCount > 0 || previewImage) {
        // 3. Update in Firebase Auth
        await updateUser(name, photoURL);
        
        refetch();
        setIsEditing(false);
        setPreviewImage(null);
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile details have been saved.",
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // --- SKELETON LOADER ---
  if (isLoading) return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="h-64 rounded-3xl bg-base-300 animate-pulse relative">
        <div className="absolute -bottom-16 left-10 w-32 h-32 rounded-full bg-base-200 border-4 border-base-100"></div>
      </div>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-40 bg-base-300 rounded-2xl animate-pulse col-span-2"></div>
        <div className="h-40 bg-base-300 rounded-2xl animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <motion.div 
      className="p-6 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. COVER & HEADER SECTION */}
      <motion.div variants={itemVariants} className="relative mb-24">
        {/* Cover Image (Gradient) */}
        <div className="h-48 md:h-64 rounded-t-3xl bg-gradient-to-r from-primary to-secondary shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-4 right-6 text-primary-content opacity-30">
                <FaCity className="text-9xl" />
            </div>
        </div>

        {/* Profile Card Overlay */}
        <div className="absolute -bottom-20 left-6 right-6 md:left-10 flex flex-col md:flex-row items-end md:items-end gap-6">
            <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-base-100 shadow-2xl overflow-hidden bg-base-200">
                    <img 
                        src={previewImage?.url || dbUser?.photo || "https://i.pravatar.cc/150"} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
                {isEditing && (
                    <label className="absolute bottom-2 right-2 btn btn-circle btn-sm btn-primary cursor-pointer shadow-lg">
                        <FaCamera className="text-secondary" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                )}
            </div>

            <div className="mb-2 flex-1">
                <h1 className="text-3xl md:text-4xl font-black text-base-content drop-shadow-sm">
                    {dbUser?.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="badge badge-lg badge-primary uppercase font-bold tracking-wider text-xs">
                        {dbUser?.role || "Citizen"}
                    </span>
                    {dbUser?.isVerified && (
                        <span className="badge badge-lg badge-warning gap-1 text-xs font-bold">
                            <FaMedal /> Premium Member
                        </span>
                    )}
                </div>
            </div>

            <div className="mb-4">
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="btn btn-primary shadow-lg gap-2"
                    >
                        <FaUserEdit /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => { setIsEditing(false); setPreviewImage(null); }} 
                            className="btn btn-ghost bg-base-100/50"
                        >
                            <FaTimes /> Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
      </motion.div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: EDIT FORM / INFO */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            
            {/* Edit Form */}
            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.div 
                        key="edit-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="card bg-base-100 shadow-xl border border-primary/20"
                    >
                        <div className="card-body">
                            <h2 className="card-title mb-4">Update Details</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="form-control">
                                    <label className="label font-bold pr-1">Full Name </label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        defaultValue={dbUser?.name} 
                                        className="input input-bordered focus:input-primary" 
                                        required 
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label font-bold pr-1">Email (Read Only)</label>
                                    <input 
                                        type="text" 
                                        value={dbUser?.email} 
                                        className="input input-bordered bg-base-200 cursor-not-allowed" 
                                        disabled 
                                    />
                                </div>
                                <div className="card-actions justify-end mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        disabled={loadingUpdate}
                                    >
                                        {loadingUpdate ? <span className="loading loading-spinner"></span> : <><FaSave /> Save Changes</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="view-info"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="card bg-base-100 shadow-xl border border-base-200"
                    >
                        <div className="card-body">
                            <h2 className="card-title border-b pb-2 mb-4">About Me</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <FaEnvelope size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                                        <p className="font-medium">{dbUser?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                                        <FaMapMarkerAlt size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
                                        <p className="font-medium">Dhaka, Bangladesh</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-accent/10 rounded-lg text-accent">
                                        <FaShieldAlt size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Account Status</p>
                                        <p className={`font-medium ${dbUser?.isBlocked ? 'text-error' : 'text-success'}`}>
                                            {dbUser?.isBlocked ? "Suspended" : "Active"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-neutral/10 rounded-lg text-neutral">
                                        <FaCalendarAlt size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Joined</p>
                                        <p className="font-medium">
                                            {/* Fallback date or fetch from firebase metadata if available */}
                                            {new Date().getFullYear()} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

        {/* RIGHT COLUMN: STATS / BADGE */}
        <motion.div variants={itemVariants} className="space-y-6">
            
            {/* Quick Stats */}
            <div className="stats stats-vertical w-full shadow-xl border border-base-200">
                <div className="stat">
                    <div className="stat-title">Role Permissions</div>
                    <div className="stat-value text-2xl capitalize">{dbUser?.role}</div>
                    <div className="stat-desc">Access Level: {dbUser?.role === 'admin' ? 'High' : 'Standard'}</div>
                </div>
                
                <div className="stat">
                    <div className="stat-title">Verification</div>
                    <div className={`stat-value text-2xl ${dbUser?.isVerified ? 'text-primary' : 'text-gray-400'}`}>
                        {dbUser?.isVerified ? "Verified" : "Unverified"}
                    </div>
                    <div className="stat-desc">
                        {dbUser?.isVerified ? "Thank you for your support!" : "Upgrade to report more issues"}
                    </div>
                </div>
            </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;