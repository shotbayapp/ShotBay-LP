/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight, Sparkles, ChevronRight, X, User, Instagram } from 'lucide-react';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', instagram: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mouse tracking for gradient effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sheetUrl = import.meta.env.VITE_GOOGLE_SHEET_WEB_APP_URL;

    console.log("Submitting form with data:", formData);
    console.log("Sheet URL:", sheetUrl);
    
    if (formData.email) {
      if (!sheetUrl) {
        console.error("VITE_GOOGLE_SHEET_WEB_APP_URL is not set.");
        return;
      }
      try {
        const formDataPayload = new FormData();
        formDataPayload.append('name', formData.name);
        formDataPayload.append('email', formData.email);
        formDataPayload.append('instagram', formData.instagram);

        const response = await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors', // Apps Script needs no-cors for this
          body: formDataPayload,
        });
        
        console.log("Fetch executed (no-cors response might not indicate success).");
        // no-cors means response.ok will not be reliable
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setIsModalOpen(false);
          setFormData({ name: '', email: '', instagram: '' });
        }, 3000);
      } catch (error) {
        console.error("Error submitting form", error);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 font-sans selection:bg-orange-100 selection:text-orange-900 relative flex flex-col">
      {/* Interactive Background Gradient */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 opacity-60 blur-[120px]"
        style={{
          background: `radial-gradient(800px circle at ${smoothX.get()}px ${smoothY.get()}px, rgba(147, 51, 234, 0.12), transparent 60%),
                       radial-gradient(800px circle at ${window.innerWidth - smoothX.get()}px ${window.innerHeight - smoothY.get()}px, rgba(59, 130, 246, 0.1), transparent 60%),
                       radial-gradient(600px circle at ${smoothX.get()}px ${window.innerHeight - smoothY.get()}px, rgba(251, 146, 60, 0.05), transparent 60%)`,
        }}
      />
      
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[30%] h-[30%] rounded-full bg-rose-50/50 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-6 md:py-10 max-w-7xl mx-auto md:px-12 w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center group cursor-pointer"
        >
          <div className="w-24 h-12 flex items-center justify-start transition-transform group-hover:scale-105">
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjEO-8ePcVBWDd0XYvCiyeJzVOIwqPKvJ-I9Q3QiGEP71ToWTX4-f48pwEIrRzmZYrGcpIYhq2PEa1q3pDZrViX4cktQ8C42hhsZYFENDWbApnt4MnzS1ivsSFIta_TetNbdrJEjdKeLdyqRBpdxxSWkgEdnONRa__EwAFPUaKfSU1CD-Cw8i8HujwSWjlp/s1446/ShotBay.png" 
              alt="Shotbay Logo" 
              className="w-full h-full object-contain object-left"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-5xl mx-auto text-center w-full">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-5xl mx-auto text-center w-full rounded-3xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6 md:mb-8 px-2"
          >
            Turn every event into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500">a live photo experience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-12 leading-relaxed"
          >
            Guests see their photos as the moment unfolds.
          </motion.p>

        {/* CTA Button */}
        {/* Removed CTA button and join text as requested */}

        </motion.main>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-xs text-zinc-400">© 2026 Shotbay. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-8">
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wider font-bold">Twitter</a>
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wider font-bold">Instagram</a>
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wider font-bold">Facebook</a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-white/60 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_32px_128px_-32px_rgba(0,0,0,0.12)] border border-zinc-100"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-zinc-50 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>

              {!isSubmitted ? (
                <div className="space-y-6 md:space-y-8">
                  <div className="space-y-2 md:space-y-3 text-left">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                      Bring ShotBay <br />
                      to your next event
                    </h2>
                    <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
                      We’re opening early access for photographers and event teams before launch.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4 text-left">
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="Your Name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-11 pr-4 py-4 rounded-2xl bg-zinc-50 border border-transparent focus:bg-white focus:border-zinc-200 outline-none transition-all text-sm font-medium"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-11 pr-4 py-4 rounded-2xl bg-zinc-50 border border-transparent focus:bg-white focus:border-zinc-200 outline-none transition-all text-sm font-medium"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                          <Instagram className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="Instagram Handle"
                          value={formData.instagram}
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                          className="w-full pl-11 pr-4 py-4 rounded-2xl bg-zinc-50 border border-transparent focus:bg-white focus:border-zinc-200 outline-none transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-medium hover:bg-zinc-800 transition-all active:scale-95 text-base mt-2 shadow-xl shadow-zinc-200"
                    >
                      Request Early Access
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold tracking-tight">Request Received</h3>
                    <p className="text-zinc-500 text-base leading-relaxed max-w-[280px] mx-auto">
                      Thanks <span className="font-bold text-zinc-900">{formData.name}</span>. We've added you to our priority queue.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
