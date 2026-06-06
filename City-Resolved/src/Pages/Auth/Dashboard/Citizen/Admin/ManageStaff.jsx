import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaUserTie, FaTrash, FaPlus, FaEnvelope, FaUser, FaEdit, FaLock, FaCloudUploadAlt, FaFileImage } from 'react-icons/fa';
import { imageUpload } from '../../../Components/Elements/ImageUpload';
import { motion, AnimatePresence } from 'framer-motion';

const ManageStaff = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [editStaff, setEditStaff] = useState(null);
    
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputRef = useRef(null);
    const axiosSecure = useAxiosSecure();

    // --- FETCH DATA (Updated to TanStack Query v5) ---
    const { data: staffMembers = [], isPending } = useQuery({
        queryKey: ['users', 'staff'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users?role=staff');
            return res.data;
        }
    });

    // --- DELETE MUTATION ---
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return axiosSecure.delete(`/users/${id}`);
        },
        onSuccess: () => {
            // Updated invalidateQueries syntax for v5
            queryClient.invalidateQueries({ queryKey: ['users'] });
            Swal.fire({
                title: 'Deleted!',
                text: 'Staff member has been removed.',
                icon: 'success'
            });
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: "Remove Staff?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    // --- FILE UPLOAD HANDLERS ---
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // --- ADD STAFF ---
    const handleAddStaff = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress(0);
        
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        try {
            let photoURL = "https://i.pravatar.cc/150?img=12";
            
            if (selectedFile) {
                photoURL = await imageUpload(selectedFile, (progress) => {
                    setUploadProgress(progress);
                });
            }

            const res = await axiosSecure.post('/users/add-staff', {
                name,
                email,
                password,
                photo: photoURL
            });
            
            if(res.data.success){
                Swal.fire({
                    title: "Success", 
                    text: "Staff account created successfully!", 
                    icon: "success"
                });
                queryClient.invalidateQueries({ queryKey: ['users'] });
                document.getElementById('add_staff_modal').close();
                form.reset();
                setSelectedFile(null);
                setUploadProgress(0);
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error", 
                text: error.response?.data?.message || "Failed to add staff", 
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (staff) => {
        setEditStaff(staff);
        document.getElementById('edit_staff_modal').showModal();
    };

    // --- UPDATE STAFF ---
    const handleUpdateStaff = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value; 
        
        try {
            const updateData = { name, email };
            const res = await axiosSecure.patch(`/users/info/${editStaff._id}`, updateData);

            if(res.data.modifiedCount > 0){
                Swal.fire({ title: "Success", text: "Staff info updated", icon: "success" });
                queryClient.invalidateQueries({ queryKey: ['users'] });
                document.getElementById('edit_staff_modal').close();
                setEditStaff(null);
            }

        } catch (error) {
            console.error(error);
            Swal.fire({ title: "Error", text: "Failed to update info", icon: "error" });
        } finally {
            setLoading(false);
        }
    };

    // --- ANIMATION VARIANTS ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    // --- SKELETON LOADER ---
    if (isPending) return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-48 bg-base-300 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-base-300 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="card bg-base-100 shadow-xl border border-base-200 h-48 p-6 animate-pulse">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-base-300"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-4 w-3/4 bg-base-300 rounded"></div>
                                <div className="h-3 w-1/2 bg-base-300 rounded"></div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-base-200">
                            <div className="h-8 w-20 bg-base-300 rounded"></div>
                            <div className="h-8 w-20 bg-base-300 rounded"></div>
                        </div>
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
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <motion.h2 variants={itemVariants} className="text-3xl font-bold flex items-center gap-2">
                    <FaUserTie /> Manage Staff ({staffMembers.length})
                </motion.h2>
                <motion.button 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('add_staff_modal').showModal()}
                    className="btn btn-primary"
                >
                    <FaPlus /> Add New Staff
                </motion.button>
            </div>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
            >
                {/* popLayout mode makes removal transitions much smoother */}
                <AnimatePresence mode="popLayout">
                    {staffMembers.map((staff) => (
                        <motion.div 
                            key={staff._id} 
                            variants={itemVariants}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
                            transition={{ duration: 0.2 }}
                            className="card bg-base-100 shadow-xl border border-base-200"
                        >
                            <div className="card-body">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="avatar">
                                        <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img src={staff.photo || "https://i.pravatar.cc/150"} alt={staff.name} />
                                        </div>
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-lg truncate">{staff.name}</h3>
                                        <p className="text-sm text-gray-500 truncate">{staff.email}</p>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-base-200">
                                    <button 
                                        onClick={() => openEditModal(staff)}
                                        className="btn btn-sm btn-outline btn-info gap-2"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(staff._id)}
                                        className="btn btn-sm btn-outline btn-error gap-2"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* ADD STAFF MODAL */}
            <dialog id="add_staff_modal" className="modal">
                <div className="modal-box w-11/12 max-w-md">
                    <h3 className="font-bold text-lg mb-4">Add New Staff Member</h3>
                    <form onSubmit={handleAddStaff} className="space-y-4">
                        <div className="form-control">
                            <label className="label">Name</label>
                            <label className="input input-bordered flex items-center gap-2">
                                <FaUser className="opacity-70"/>
                                <input type="text" name="name" className="grow" required />
                            </label>
                        </div>
                        <div className="form-control">
                            <label className="label">Email</label>
                            <label className="input input-bordered flex items-center gap-2">
                                <FaEnvelope className="opacity-70"/>
                                <input type="email" name="email" className="grow" required />
                            </label>
                        </div>
                        <div className="form-control">
                            <label className="label">Password</label>
                            <label className="input input-bordered flex items-center gap-2">
                                <FaLock className="opacity-70"/>
                                <input type="password" name="password" className="grow" required minLength="6" />
                            </label>
                        </div>
                        
                        <div className="form-control">
                            <label className="label font-semibold">Profile Photo</label>
                            
                            <div 
                                className={`h-32 w-full rounded-lg border-2 border-dashed flex flex-col justify-center items-center cursor-pointer transition-colors ${dragActive ? "border-primary bg-primary/10" : "border-base-300 hover:border-primary"}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => inputRef.current.click()}
                            >
                                <input 
                                    ref={inputRef}
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                                
                                {selectedFile ? (
                                    <div className="text-center p-2">
                                        <FaFileImage className="text-2xl text-primary mx-auto mb-1" />
                                        <p className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <FaCloudUploadAlt className="text-3xl mx-auto mb-2" />
                                        <p className="text-sm">Drag & Drop or Click to Upload</p>
                                    </div>
                                )}
                            </div>

                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="w-full mt-2">
                                    <progress className="progress progress-primary w-full" value={uploadProgress} max="100"></progress>
                                    <p className="text-xs text-right text-gray-500 mt-1">{uploadProgress}%</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-action">
                            <button type="button" className="btn" onClick={() => {
                                document.getElementById('add_staff_modal').close();
                                setSelectedFile(null);
                                setUploadProgress(0);
                            }}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Creating..." : "Create Staff"}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* EDIT STAFF MODAL */}
            <dialog id="edit_staff_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Edit Staff Info</h3>
                    {editStaff && (
                        <form onSubmit={handleUpdateStaff} className="space-y-4">
                            <div className="form-control">
                                <label className="label">Name</label>
                                <input type="text" name="name" defaultValue={editStaff.name} className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">Email</label>
                                <input type="email" name="email" defaultValue={editStaff.email} className="input input-bordered" required />
                            </div>
                            
                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => {
                                    document.getElementById('edit_staff_modal').close();
                                    setEditStaff(null);
                                }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Updating..." : "Update Info"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </motion.div>
    );
};

export default ManageStaff;