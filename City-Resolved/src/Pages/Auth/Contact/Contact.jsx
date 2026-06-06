import React, { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'motion/react';
import { FaPaperPlane, FaUser, FaEnvelope, FaTag, FaPen, FaCheckCircle, FaMapMarkedAlt, FaPhoneAlt, FaClock, FaHeadset } from 'react-icons/fa';
import Swal from 'sweetalert2';

// --- CUSTOM SKELETON COMPONENT ---
const ContactSkeleton = () => {
  return (
    <div className="min-h-screen bg-base-200 pb-24 pt-28 px-4 animate-pulse">
      <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
         <div className="h-8 w-32 bg-base-300 rounded-full mx-auto"></div>
         <div className="h-12 w-3/4 bg-base-300 rounded-xl mx-auto"></div>
         <div className="h-4 w-full bg-base-300 rounded-lg"></div>
      </div>

      <div className="container mx-auto max-w-6xl space-y-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 flex flex-col gap-6">
               <div className="h-96 bg-base-300 rounded-2xl w-full"></div>
               <div className="h-32 bg-base-300 rounded-2xl w-full"></div>
            </div>
            <div className="lg:col-span-8">
               <div className="h-[600px] bg-base-300 rounded-2xl w-full"></div>
            </div>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <div className="h-72 bg-base-300 rounded-2xl"></div>
             <div className="space-y-4">
                 <div className="h-10 w-48 bg-base-300 rounded-lg mb-6"></div>
                 {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="h-20 bg-base-300 rounded-xl"></div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Contact = () => {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs.sendForm(
      import.meta.env.VITE_SERVICE_ID,
      import.meta.env.VITE_TEMPLATE_ID,
      form.current,
      import.meta.env.VITE_PUBLIC_KEY
    )
    .then(() => {
      Swal.fire({
        title: 'Message Sent!',
        text: 'We will get back to you shortly.',
        icon: 'success',
        confirmButtonColor: 'oklch(var(--p))'
      });
      form.current.reset();
      setIsSending(false);
    })
    .catch((error) => {
      console.error('EmailJS Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again.',
        icon: 'error'
      });
      setIsSending(false);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const slideRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (isLoading) {
    return <ContactSkeleton />;
  }

  return (
    <div className="min-h-screen bg-base-200 font-sans text-base-content pb-24 pt-28">
      
      {/* --- HEADER --- */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center mb-16 px-4"
      >
        <motion.div
           variants={itemVariants}
           className="inline-block px-4 py-1.5 mb-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest"
        >
            Get In Touch
        </motion.div>
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-5xl font-black mb-4"
        >
          Let's Start a Conversation
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="opacity-60 max-w-2xl mx-auto text-lg leading-relaxed"
        >
          Whether you have a technical issue, a partnership proposal, or just want to connect with our team—we're here to listen.
        </motion.p>
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 max-w-6xl space-y-20"
      >
        
        {/* --- SECTION 1: SUPPORT PROFILE & FORM --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Support Team Profile */}
          <motion.div 
            variants={slideLeft}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Profile Card with Hover Float */}
            <motion.div 
                whileHover={{ y: -5 }}
                className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden group hover:shadow-2xl hover:border-primary/30 transition-all duration-300"
            >
                <div className="h-32 bg-primary/10 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                </div>
                
                <div className="card-body pt-0 relative">
                    <div className="avatar absolute -top-14 left-6">
                        <div className="w-24 h-24 rounded-2xl ring ring-base-100 ring-offset-4 ring-offset-base-100 shadow-xl bg-primary flex items-center justify-center text-primary-content group-hover:ring-primary transition-all duration-300">
                            <FaHeadset size={40} />
                        </div>
                    </div>
                    
                    <div className="mt-12">
                        <div className="badge badge-secondary badge-outline mb-2 font-bold text-xs gap-1">
                            <FaEnvelope /> Available 24/7
                        </div>
                        <h2 className="text-2xl font-black group-hover:text-primary transition-colors">Support Team</h2>
                        <p className="text-sm font-bold text-primary opacity-80 uppercase tracking-wide mb-4">Community Assistance</p>
                        
                        <p className="text-sm opacity-70 leading-relaxed mb-6">
                            "We built City Resolved to empower citizens and improve neighborhoods. If you have any questions, feedback, or need help with a report, let's connect!"
                        </p>
                        
                        <div className="w-full mt-2">
                             <a href="mailto:info@cityresolved.com" className="btn btn-primary w-full text-primary-content gap-2 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                                <FaEnvelope size={18} /> Email Us Directly
                             </a>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats with Hover */}
            <motion.div 
                whileHover={{ y: -5 }}
                className="card bg-base-100 shadow-lg border border-base-300 p-6 hover:border-success/40 transition-all duration-300"
            >
                <h3 className="font-bold text-lg mb-4 opacity-80">Response Time</h3>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center text-xl">
                        <FaCheckCircle />
                    </div>
                    <div>
                        <div className="font-black text-2xl">~2 Hrs</div>
                        <div className="text-xs opacity-60 font-bold uppercase">Average Reply Speed</div>
                    </div>
                </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Contact Form */}
          <motion.div 
            variants={slideRight}
            className="lg:col-span-8"
          >
            <div className="card bg-base-100 shadow-2xl border border-base-300 overflow-hidden">
              <div className="card-body p-8 md:p-10 gap-8">
                <div>
                    <h2 className="card-title text-3xl font-black mb-2">Send a Message</h2>
                    <p className="opacity-60 text-sm">Fill out the form below. We usually respond within 24 hours.</p>
                </div>
                
                <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-bold opacity-80">Your Name</span>
                      </label>
                      <label className="input input-bordered flex items-center gap-3 bg-base-200/50 focus-within:bg-base-100 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all h-12">
                        <FaUser className="opacity-40" />
                        <input type="text" name="user_name" className="grow" placeholder="John Doe" required />
                      </label>
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-bold opacity-80">Email Address</span>
                      </label>
                      <label className="input input-bordered flex items-center gap-3 bg-base-200/50 focus-within:bg-base-100 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all h-12">
                        <FaEnvelope className="opacity-40" />
                        <input type="email" name="user_email" className="grow" placeholder="john@example.com" required />
                      </label>
                    </div>
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-bold opacity-80">Department</span>
                    </label>
                    <div className="relative">
                        <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 z-10" />
                        <select name="subject" className="select select-bordered w-full pl-10 bg-base-200/50 focus:bg-base-100 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all h-12 text-base font-normal">
                            <option disabled selected>Select a topic...</option>
                            <option>General Inquiry</option>
                            <option>Partnership Opportunity</option>
                            <option>Report a Bug</option>
                            <option>Feedback</option>
                        </select>
                    </div>
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-bold opacity-80">Your Message</span>
                    </label>
                    <div className="relative">
                        <FaPen className="absolute left-4 top-4 opacity-40 mt-1" />
                        <textarea 
                            name="message" 
                            className="textarea textarea-bordered w-full h-48 pl-10 pt-4 bg-base-200/50 focus:bg-base-100 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base leading-relaxed resize-none" 
                            placeholder="How can we help you today?" 
                            required
                        ></textarea>
                    </div>
                  </div>

                  <div className="form-control mt-2">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      disabled={isSending}
                      className="btn btn-primary btn-lg w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 border-none transition-all"
                    >
                      {isSending ? (
                        <span className="loading loading-spinner loading-md"></span>
                      ) : (
                        <span className="flex items-center gap-2">
                           Send Message <FaPaperPlane />
                        </span>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- SECTION 2: HQ INFO & FAQ --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Office Info Card */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card bg-base-100 shadow-xl border border-base-300 h-full hover:shadow-2xl transition-all duration-300"
            >
                <div className="card-body p-8 lg:p-12">
                     <div className="mb-8">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl mb-4">
                            <FaMapMarkedAlt />
                        </div>
                        <h2 className="text-3xl font-black mb-2">Visit Our HQ</h2>
                        <p className="opacity-60 text-lg">We love meeting our community members.</p>
                     </div>

                     <div className="space-y-6">
                        {/* Address Row Hover */}
                        <div className="flex items-start gap-4 p-4 bg-base-200/50 rounded-xl border border-base-200 hover:border-primary/50 hover:bg-base-200 hover:shadow-md transition-all duration-300 group cursor-default">
                            <div className="mt-1 text-primary group-hover:scale-110 transition-transform"><FaMapMarkedAlt size={20} /></div>
                            <div>
                                <h4 className="font-bold text-lg">Dhaka Office</h4>
                                <p className="opacity-70">123 Tech Avenue, Gulshan 2<br/>Dhaka, Bangladesh</p>
                            </div>
                        </div>

                        {/* Phone Row Hover */}
                        <div className="flex items-start gap-4 p-4 bg-base-200/50 rounded-xl border border-base-200 hover:border-secondary/50 hover:bg-base-200 hover:shadow-md transition-all duration-300 group cursor-default">
                            <div className="mt-1 text-secondary group-hover:scale-110 transition-transform"><FaPhoneAlt size={20} /></div>
                            <div>
                                <h4 className="font-bold text-lg">Phone Support</h4>
                                <p className="opacity-70">+880 1234567890</p>
                                <p className="text-xs opacity-50 font-bold uppercase mt-1">Mon-Fri, 9am - 6pm</p>
                            </div>
                        </div>

                        {/* Hours Row Hover */}
                        <div className="flex items-start gap-4 p-4 bg-base-200/50 rounded-xl border border-base-200 hover:border-accent/50 hover:bg-base-200 hover:shadow-md transition-all duration-300 group cursor-default">
                            <div className="mt-1 text-accent group-hover:scale-110 transition-transform"><FaClock size={20} /></div>
                            <div>
                                <h4 className="font-bold text-lg">Working Hours</h4>
                                <p className="opacity-70">We operate remotely 24/7 for critical bugs.</p>
                            </div>
                        </div>
                     </div>
                </div>
            </motion.div>

            {/* Expanded FAQ */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                className="space-y-4"
            >
                <div className="mb-6">
                    <h2 className="text-3xl font-black mb-2">Common Questions</h2>
                    <p className="opacity-60">Everything you need to know before you contact us.</p>
                </div>

                <div className="collapse collapse-plus bg-base-100 border border-base-300 rounded-xl shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <input type="radio" name="my-accordion-3" defaultChecked /> 
                    <div className="collapse-title text-lg font-bold">
                        Is City Resolved free to use?
                    </div>
                    <div className="collapse-content"> 
                        <p className="opacity-70 leading-relaxed">Yes! Reporting issues and viewing the community dashboard is completely free for all citizens.</p>
                    </div>
                </div>
                <div className="collapse collapse-plus bg-base-100 border border-base-300 rounded-xl shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <input type="radio" name="my-accordion-3" /> 
                    <div className="collapse-title text-lg font-bold">
                        How can I volunteer?
                    </div>
                    <div className="collapse-content"> 
                        <p className="opacity-70 leading-relaxed">We love volunteers! You can join clean-up drives listed on the 'Events' page, or contribute code to our GitHub repository.</p>
                    </div>
                </div>
                <div className="collapse collapse-plus bg-base-100 border border-base-300 rounded-xl shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <input type="radio" name="my-accordion-3" /> 
                    <div className="collapse-title text-lg font-bold">
                        Are reports anonymous?
                    </div>
                    <div className="collapse-content"> 
                        <p className="opacity-70 leading-relaxed">By default, your name is attached to the report to ensure authenticity. However, you can toggle "Anonymous Report" during submission to hide your identity publicly.</p>
                    </div>
                </div>
                <div className="collapse collapse-plus bg-base-100 border border-base-300 rounded-xl shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <input type="radio" name="my-accordion-3" /> 
                    <div className="collapse-title text-lg font-bold">
                        Do you work with the government?
                    </div>
                    <div className="collapse-content"> 
                        <p className="opacity-70 leading-relaxed">We are an independent platform, but we forward verified high-priority reports to municipal authorities to speed up resolution.</p>
                    </div>
                </div>
            </motion.div>

        </div>

      </motion.div>
    </div>
  );
};

export default Contact;