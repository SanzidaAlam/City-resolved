import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { FaPaperPlane, FaMapMarkerAlt, FaRobot, FaMagic, FaLocationArrow } from "react-icons/fa";
import Loader from "../../../Components/Shared/Loader";
import { imageUpload } from "../../../Components/Elements/ImageUpload";
import { motion } from "framer-motion";

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // State Management
  const [formData, setFormData] = useState({
    title: "",
    category: "Uncategorized",
    location: "",
    description: "",
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(null); 
  
  // UX Loading & Animation States
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isTyping, setIsTyping] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- CORE UX FEATURE: The Typewriter Function ---
  const typeText = async (fieldName, targetText, speed = 30) => {
    return new Promise((resolve) => {
      let i = 0;
      setFormData((prev) => ({ ...prev, [fieldName]: "" })); 

      const timer = setInterval(() => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: targetText.substring(0, i + 1),
        }));
        i++;
        if (i === targetText.length) {
          clearInterval(timer);
          resolve(); 
        }
      }, speed);
    });
  };

  // --- Helper: Fetch Location String Silently ---
  const fetchLocationString = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve("Geolocation not supported");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const readableAddress = data.address.suburb || data.address.city || data.address.town || data.display_name.split(",").slice(0, 2).join(",");
            resolve(readableAddress);
          } catch (error) {
            resolve(`${latitude}, ${longitude}`); // Fallback to coords
          }
        },
        () => resolve("Location access denied")
      );
    });
  };

  // --- Manual Location Button ---
  const handleGetLocation = async () => {
    setIsLocating(true);
    const locString = await fetchLocationString();
    setIsLocating(false);
    setIsTyping(true);
    await typeText("location", locString, 40);
    setIsTyping(false);
  };

  // --- Feature 2: AI Auto-Fill + Auto Location Sequence ---
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    setIsAnalyzing(true);

    try {
      // 1. Upload to ImgBB
      const uploadedUrl = await imageUpload(file);
      setPhotoURL(uploadedUrl); 

      // 2. Start fetching location in the background while AI thinks
      const locationPromise = fetchLocationString();

      // 3. Send URL to Backend securely
      const analysisRes = await axiosSecure.post("/analyze-image", { 
          imageUrl: uploadedUrl 
      });
      
      const { category, title, description, rawCaption } = analysisRes.data;
      console.log("🧠 RAW AI THOUGHTS:", rawCaption);

      setIsAnalyzing(false);
      setIsTyping(true);

      // Handle cases where the AI doesn't recognize the image so the typewriter still works
      const finalCategory = (category && category !== "Uncategorized") ? category : "Others";
      const finalTitle = title || "Reported Civic Issue";
      const finalDesc = description || "Please provide more details about this issue here...";

      // Snap dropdown to category
      setFormData((prev) => ({ ...prev, category: finalCategory }));

      // SEQUENCE 1: Type Title
      if (!formData.title) {
        await typeText("title", finalTitle, 40); 
      }
      
      // SEQUENCE 2: Type Description
      if (!formData.description) {
        await typeText("description", finalDesc, 20); 
      }

      // SEQUENCE 3: Type Location (waits for the background promise to finish resolving)
      if (!formData.location) {
        const locString = await locationPromise;
        await typeText("location", locString, 40);
      }

    } catch (error) {
      console.error("Pipeline crashed:", error);
    } finally {
      setIsAnalyzing(false);
      setIsTyping(false);
    }
  };

  // --- Final Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoURL && !imageFile) return Swal.fire("Error", "Please upload an image.", "error");
    
    setLoading(true);

    try {
      const finalPhotoUrl = photoURL || await imageUpload(imageFile);

      const issueData = {
        title: formData.title.trim() || `Reported: ${formData.category}`,
        description: formData.description.trim() || "No description provided.",
        category: formData.category,
        location: formData.location,
        photo: finalPhotoUrl,
        reportedBy: {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        },
        status: "pending",
        priority: "normal",
        upvotes: 0,
        createdAt: new Date(),
      };

      const dbResponse = await axiosSecure.post("/issues", issueData);

      if (dbResponse.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Issue Reported!",
          text: "Your issue has been submitted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/dashboard/my-issues");
      } else {
        Swal.fire({ icon: "error", title: "Limit Reached", text: dbResponse.data.message });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Submission Failed", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div className="max-w-3xl mx-auto p-4" variants={containerVariants} initial="hidden" animate="visible">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Report a New Issue</h2>
        <div className="badge badge-primary badge-outline mt-3 gap-2 p-4 max-w-full text-center">
          <FaRobot className="flex-shrink-0" />
          <span>Upload an image first, and watch the AI auto-fill the form for you.</span>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Upload Proof Image (Required)</span>
                {isAnalyzing && <span className="label-text-alt text-primary flex items-center gap-1"><FaMagic className="animate-spin" /> Analyzing Image & Location...</span>}
              </label>
              <input
                type="file"
                className="file-input file-input-bordered file-input-primary w-full"
                accept="image/*"
                onChange={handleImageSelect}
                required
                disabled={isTyping} 
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Issue Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., Broken Street Light"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Category</span>
                </label>
                <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered w-full">
                  <option value="Uncategorized">Let AI Decide (Auto-Detect)</option>
                  <option value="Road Damage">Road Damage</option>
                  <option value="Street Light Issue">Street Light Issue</option>
                  <option value="Water Leakage & Drainage">Water Leakage & Drainage</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Location (Required)</span>
                </label>
                <div className="relative flex items-center w-full">
                  <FaMapMarkerAlt className="absolute left-3 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="E.g., Mirpur 10"
                    className="input input-bordered w-full pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={handleGetLocation}
                    className="absolute right-2 btn btn-xs btn-circle btn-primary"
                    disabled={isLocating || isTyping}
                    title="Get Current Location"
                  >
                    {isLocating ? <Loader /> : <FaLocationArrow />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Description</span>
              </label>
              <br />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered h-32 w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Provide additional context details..."
              ></textarea>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full text-lg" disabled={loading || isAnalyzing || isTyping}>
                {loading ? <Loader /> : <><FaPaperPlane /> Submit Report</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportIssue;
