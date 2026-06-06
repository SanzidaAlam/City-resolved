import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import { motion } from "motion/react";
import { 
  FaCheckCircle, 
  FaMapMarkerAlt, 
  FaArrowRight, 
  FaQuoteLeft, 
  FaBuilding, 
  FaTree, 
  FaLandmark, 
  FaUniversity,
  FaMobileAlt,
  FaCamera
} from "react-icons/fa";

// Components
import Banner from "../../../Components/Shared/Banner";
import Feature from "../../../Components/Elements/Feature";
import InternalWorkings from "../../../Components/Elements/InternalWorkings";

// --- SKELETON LOADER ---
const HomeSkeleton = () => (
  <div className="bg-base-100 min-h-screen pb-20">
    <div className="h-[500px] w-full bg-base-200 animate-pulse mb-12" />
    
    <div className="container mx-auto px-4 space-y-24">
        {/* Trusted By Skeleton */}
        <div className="flex justify-center gap-8 opacity-50">
            {[1,2,3,4].map(i => <div key={i} className="h-12 w-32 bg-base-200 rounded-lg animate-pulse" />)}
        </div>

        {/* Feature Skeleton */}
        <div className="h-96 w-full bg-base-200 rounded-3xl animate-pulse" />

        {/* Grid Skeleton (4 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-[400px] bg-base-200 rounded-2xl animate-pulse" />
            ))}
        </div>
    </div>
  </div>
);

// --- STATIC SECTION: TRUSTED PARTNERS ---
const TrustedBy = () => (
    <div className="py-10 border-b border-base-200 bg-base-100">
        <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-bold uppercase tracking-widest opacity-40 mb-6">Trusted by Municipalities & Organizations</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <FaBuilding size={40} className="hover:text-primary" />
                <FaLandmark size={40} className="hover:text-secondary" />
                <FaTree size={40} className="hover:text-accent" />
                <FaUniversity size={40} className="hover:text-primary" />
            </div>
        </div>
    </div>
);

// --- STATIC SECTION: MOBILE FRIENDLY (Updated) ---
const MobileFriendly = () => (
    <section className="py-24 px-4 bg-base-100 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
            <div className="bg-base-200 rounded-[3rem] p-12 md:p-0 flex flex-col md:flex-row items-center relative">
                
                {/* Content */}
                <div className="md:w-1/2 md:p-16 z-10">
                    <div className="badge badge-accent badge-outline mb-4">Mobile Ready</div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                        Report Issues <br/>
                        <span className="text-primary">On The Go.</span>
                    </h2>
                    <p className="text-lg opacity-70 mb-8">
                        No app download needed. Our platform is fully optimized for your phone. Snap a photo, tag the location, and hit send in seconds.
                    </p>
                    <div className="flex gap-4">
                        <Link 
                            to="/dashboard/report-issue" 
                            className="btn btn-primary btn-lg rounded-xl gap-2 shadow-xl hover:shadow-primary/30"
                        >
                            <FaCamera size={20} /> Report Issue Now
                        </Link>
                    </div>
                </div>

                {/* Visual */}
                <div className="md:w-1/2 relative h-[400px] md:h-[500px] w-full flex items-end justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-transparent to-transparent z-20" />
                    <div className="relative z-10 transform translate-y-10 md:translate-y-0">
                        <FaMobileAlt size={400} className="text-base-300 drop-shadow-2xl" />
                        {/* Mockup Screen content simulation */}
                        <div className="absolute top-[12%] left-[10%] right-[10%] bottom-[12%] bg-base-100 rounded-3xl overflow-hidden flex flex-col items-center justify-center border-2 border-base-200">
                            <FaMapMarkerAlt size={60} className="text-secondary animate-bounce" />
                            <p className="mt-4 font-bold text-lg text-base-content">Location Detected</p>
                            <div className="mt-2 text-xs text-base-content/50">Ready to submit</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- TESTIMONIALS ---
const Testimonials = () => {
  const reviews = [
    { name: "Sarah K.", role: "Resident", text: "Finally, a way to actually get the potholes on my street fixed. The updates were real-time!" },
    { name: "James L.", role: "Volunteer", text: "I love the community events feature. It's great to see neighbors coming together." },
    { name: "Dr. Alom", role: "City Official", text: "This platform helps us prioritize the most critical infrastructure needs efficiently." },
  ];

  return (
    <section className="py-24 bg-base-100 border-t border-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Community <span className="text-secondary">Voice</span></h2>
          <p className="opacity-60">Hear from the people making a difference.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="card bg-base-200/50 border border-base-200 p-8 rounded-3xl relative"
            >
              <FaQuoteLeft className="text-4xl text-primary/20 absolute top-6 left-6" />
              <div className="mt-8 relative z-10">
                <p className="text-lg italic mb-6 opacity-80">"{rev.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                      <span className="text-xs">{rev.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold">{rev.name}</h4>
                    <p className="text-xs text-primary font-bold uppercase">{rev.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- CTA ---
const CTA = () => (
  <section className="py-24 bg-base-200 px-4">
    <div className="container mx-auto bg-gradient-to-r from-secondary to-accent rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Transform Your City?</h2>
        <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
          Join thousands of proactive citizens today. Report an issue in seconds.
        </p>
        <Link to="/auth/register" className="btn btn-lg bg-white text-secondary hover:bg-base-100 border-none rounded-full px-10 shadow-lg font-bold">
          Join the Movement <FaArrowRight />
        </Link>
      </div>
    </div>
  </section>
);

const Home = () => {
  const { data: resolvedIssues = [], isLoading } = useQuery({
    queryKey: ["recent-resolved"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:3000/issues/resolved/recent"
      );
      return res.data;
    },
  });

  if (isLoading) return <HomeSkeleton />;

  return (
    <div className="font-sans">
      <Banner />
      <TrustedBy />
      <Feature />
      <InternalWorkings />
      <MobileFriendly />

      {/* --- RESOLVED ISSUES SECTION (FIXED CARDS) --- */}
      <section className="py-24 bg-base-100 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="text-left max-w-xl">
              <div className="badge badge-primary badge-outline mb-4 font-bold">Proof of Work</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-base-content">Recently Resolved</h2>
              <p className="text-lg opacity-60">
                See the impact we are making in your neighborhood.
              </p>
            </div>
            <Link
              to="/all-issues"
              className="btn btn-outline btn-primary rounded-full px-8 group"
            >
              View All Reports <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {resolvedIssues.length > 0 ? (
            // 4 Column Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {resolvedIssues.map((issue, index) => (
                <motion.div
                  key={issue._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="card bg-base-100 shadow-xl border border-base-200 group h-full flex flex-col"
                >
                  {/* Card Image */}
                  <figure className="h-48 relative overflow-hidden">
                    <img
                      src={issue.photo}
                      alt={issue.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 badge badge-success text-white font-bold shadow-md gap-1">
                      <FaCheckCircle size={12} /> Resolved
                    </div>
                  </figure>
                  
                  {/* Card Body */}
                  <div className="card-body p-5 flex-grow">
                    <h3 className="card-title text-lg font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {issue.title}
                    </h3>
                    
                    <p className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                      <FaMapMarkerAlt className="text-secondary" />
                      <span className="line-clamp-1">{issue.location}</span>
                    </p>
                    
                    {/* Description Clamp */}
                    <p className="text-sm opacity-70 line-clamp-2 mb-4">
                        {issue.description}
                    </p>

                    {/* Bottom Action Area */}
                    <div className="card-actions mt-auto pt-4 border-t border-base-200">
                      <Link
                        to={`/issues/${issue._id}`}
                        className="btn btn-sm btn-outline btn-primary w-full group/btn"
                      >
                        View Details
                        <FaArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
              <p className="text-xl font-bold opacity-50">
                No resolved issues to show yet. Be the first!
              </p>
            </div>
          )}
        </div>
      </section>

      <Testimonials />
      <CTA />

    </div>
  );
};

export default Home;