"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface AuthProtectionProps {
  children: React.ReactNode;
}

export default function AuthProtection({ children }: AuthProtectionProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showContent, setShowContent] = useState(false);

  // Check for existing authorization in localStorage
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('isAuthorized');
      if (storedAuth === 'true') {
        setIsAuthorized(true);
        
        // Small delay to allow for fade-in animation
        setTimeout(() => {
          setShowContent(true);
        }, 300);
      }
      
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    
    checkAuth();
  }, []);

  // Handle password submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Using the specific password provided by the user
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD || 'bsevita-43242025';
    
    if (password === correctPassword) {
      setError('');
      setIsAuthorized(true);
      localStorage.setItem('isAuthorized', 'true');
      
      // Delay showing content for animation
      setTimeout(() => {
        setShowContent(true);
      }, 600);
    } else {
      setError('Incorrect password. Please try again.');
      
      // Shake animation effect on error
      const form = document.getElementById('password-form');
      if (form) {
        form.classList.add('shake-animation');
        setTimeout(() => {
          form.classList.remove('shake-animation');
        }, 500);
      }
    }
  };

  // If authorized and content should show, render children
  if (isAuthorized && showContent) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="gradient-animation"></div>
        <div className="gradient-overlay"></div>
        
        {/* Subtle light effects */}
        <div className="light-orb light-orb-1"></div>
        <div className="light-orb light-orb-2"></div>
        <div className="light-orb light-orb-3"></div>
      </div>
      
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-primary relative z-10"
          >
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </motion.div>
        ) : isAuthorized ? (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
            className="flex flex-col items-center relative z-10"
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="40"
                height="40"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary"
              >
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Access Granted</h2>
            <p className="text-white/70 mt-2">Entering the documentation...</p>
          </motion.div>
        ) : (
          <motion.div
            key="auth-form"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-background/20 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/10">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                Password Protected
              </h2>
              <p className="text-center text-white/70 mb-6">
                Enter password to access the documentation
              </p>

              <form id="password-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-2.5 bg-white/10 text-white rounded-md border border-white/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-white/50"
                    autoFocus
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-md transition-colors shadow-md border border-white/10"
                >
                  Submit
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[5]">
        <div className="absolute left-12 top-[15%] w-px h-40 bg-white/20"></div>
        <div className="absolute left-12 top-[15%] h-px w-12 bg-white/20"></div>
        <div className="absolute left-12 top-[15%] text-white/40" style={{ fontSize: '24px', transform: 'translate(-50%, -50%)' }}>+</div>
        
        <div className="absolute right-12 top-[20%] w-px h-40 bg-white/20"></div>
        <div className="absolute right-12 top-[20%] h-px w-12 bg-white/20"></div>
        <div className="absolute right-12 top-[20%] text-white/40" style={{ fontSize: '24px', transform: 'translate(50%, -50%)' }}>+</div>
        
        <div className="absolute left-12 bottom-[25%] w-px h-40 bg-white/20"></div>
        <div className="absolute left-12 bottom-[25%] h-px w-12 bg-white/20"></div>
        <div className="absolute left-12 bottom-[21.3%] text-white/40" style={{ fontSize: '24px', transform: 'translate(-50%, -50%)' }}>+</div>
        
        <div className="absolute right-12 bottom-[15%] w-px h-40 bg-white/20"></div>
        <div className="absolute right-12 bottom-[15%] h-px w-12 bg-white/20"></div>
        <div className="absolute right-12 bottom-[15%] text-white/40" style={{ fontSize: '24px', transform: 'translate(50%, -50%)' }}>+</div>
      </div>
      
      <style jsx>{`
        .shake-animation {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
          40%, 60% { transform: translate3d(3px, 0, 0); }
        }
        
        .gradient-animation {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, 
            rgba(76, 29, 149, 1) 0%,
            rgba(124, 58, 237, 1) 20%, 
            rgba(139, 92, 246, 1) 40%, 
            rgba(91, 33, 182, 1) 60%, 
            rgba(67, 56, 202, 1) 80%, 
            rgba(79, 70, 229, 1) 100%
          );
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        
        .light-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.4;
          animation: float 20s ease-in-out infinite;
        }
        
        .light-orb-1 {
          width: 300px;
          height: 300px;
          background-color: rgba(167, 139, 250, 0.3);
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }
        
        .light-orb-2 {
          width: 250px;
          height: 250px;
          background-color: rgba(192, 132, 252, 0.2);
          bottom: 15%;
          right: 10%;
          animation-delay: -5s;
        }
        
        .light-orb-3 {
          width: 200px;
          height: 200px;
          background-color: rgba(147, 51, 234, 0.2);
          bottom: 30%;
          left: 25%;
          animation-delay: -10s;
        }
        
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-15px) translateX(15px); }
          50% { transform: translateY(0px) translateX(0px); }
          75% { transform: translateY(15px) translateX(-15px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
      `}</style>
    </div>
  );
} 