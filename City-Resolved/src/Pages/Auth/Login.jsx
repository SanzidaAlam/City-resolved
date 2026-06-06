import React, { useContext, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaCity, FaShieldAlt, FaBolt, FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { motion } from "motion/react";
import Loader from "../../Components/Shared/Loader";

const Login = () => {
  const { signIn, signInWithGoogle, resetPass } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // --- 1. CORE LOGIN LOGIC ---
  const performLogin = async (email, password) => {
    setLoading(true);
    try {
      await signIn(email, password);
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "Login successful.",
        timer: 1500,
        showConfirmButton: false,
        background: "#fff",
        color: "#333"
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message, // Firebase usually gives specific errors like "user-not-found"
      });
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HANDLERS ---

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    performLogin(email, password);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const userInfo = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      };
      await axios.post("http://localhost:3000/users", userInfo);
      Swal.fire({
        icon: "success",
        title: "Google Login",
        text: `Welcome ${user.displayName}`,
        timer: 1500,
        showConfirmButton: false,
      });
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  const handleForgetPassword = () => {
    const email = emailRef.current.value;
    if (!email) {
      Swal.fire({ icon: "warning", title: "Oops...", text: "Please write your email before resetting password." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({ icon: "error", title: "Invalid Email", text: "Please enter a valid email address." });
      return;
    }
    resetPass(email)
      .then(() => Swal.fire({ icon: "success", title: "Email Sent", text: "Check your email for the password reset link." }))
      .catch((error) => Swal.fire({ icon: "error", title: "Error", text: error.message }));
  };

  // --- ANIMATION VARIANTS ---
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex bg-base-200">
      
      {/* --- LEFT SIDE: BRANDING & INFO (Hidden on mobile) --- */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12 text-primary-content">
        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 max-w-lg space-y-8">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                        <FaCity className="text-4xl" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">City Resolved</h1>
                </div>
                <h2 className="text-5xl font-bold leading-tight mb-6">
                    Building a Better <br /> <span className="text-secondary">Tomorrow, Today.</span>
                </h2>
                <p className="text-lg opacity-80 leading-relaxed">
                    Join thousands of proactive citizens. Report issues, track resolutions, and collaborate with authorities to maintain your neighborhood.
                </p>
            </motion.div>

            {/* Features List */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.5, duration: 0.8 }}
                className="grid gap-6 mt-8"
            >
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                    <FaShieldAlt className="text-2xl text-accent" />
                    <div>
                        <h4 className="font-bold">Secure & Private</h4>
                        <p className="text-sm opacity-70">Your data is encrypted and safe.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                    <FaBolt className="text-2xl text-yellow-300" />
                    <div>
                        <h4 className="font-bold">Real-time Updates</h4>
                        <p className="text-sm opacity-70">Get notified instantly on status changes.</p>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-200"
        >
          <div className="card-body p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-base-content mb-2">Welcome Back!</h2>
              <p className="text-base-content/60">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  ref={emailRef}
                  placeholder="citizen@example.com"
                  className="input input-bordered w-full h-12 focus:input-primary bg-base-200/50 focus:bg-base-100 transition-all"
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
                  placeholder="••••••••"
                  className="input input-bordered w-full h-12 focus:input-primary bg-base-200/50 focus:bg-base-100 transition-all"
                  required
                />
                <label className="label">
                  <a onClick={handleForgetPassword} className="label-text-alt link link-primary hover:text-primary-focus cursor-pointer font-semibold">
                    Forgot password?
                  </a>
                </label>
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full h-12 text-lg shadow-lg shadow-primary/30"
                >
                  {loading ? <Loader /> : (
                      <span className="flex items-center gap-2">
                          Sign In <FaArrowRight size={14} />
                      </span>
                  )}
                </button>
              </div>
            </form>

            <div className="divider text-xs opacity-50 uppercase font-bold tracking-widest my-6">Or</div>

            <div className="space-y-4">
                <button
                    onClick={handleGoogleLogin}
                    className="btn btn-outline w-full h-12 hover:bg-base-200 transition-all flex items-center justify-center gap-2"
                >
                    <FcGoogle className="text-2xl" /> Continue with Google
                </button>

                <p className="text-center text-sm mt-4">
                    Don't have an account?{" "}
                    <Link to="/auth/register" className="link link-primary font-bold hover:text-primary-focus transition-colors">
                    Create an account
                    </Link>
                </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;