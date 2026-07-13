import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    
    // GSAP parallax or floating animation for background elements
    const ctx = gsap.context(() => {
      gsap.to(".glass-orb", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.1
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Neural Network / Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glass-orb absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl mix-blend-screen" />
        <div className="glass-orb absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center max-w-4xl px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wide uppercase"
        >
          Version 1.0
        </motion.div>
        
        <h1 className="text-8xl md:text-[150px] font-extrabold tracking-tighter mb-2 text-gradient-flowing drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] font-phoenix">
          PHOENIX
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 text-gradient">
          The Knowledge Rescue Engine
        </h2>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
          Transform forgotten documents into a living, interconnected AI brain. Upload once, discover forever.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-premium btn-premium-alt px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:bg-gray-100 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Enter Phoenix
          </button>
          
          <button 
            onClick={() => navigate('/graph')}
            className="btn-premium px-8 py-4 rounded-xl glass-panel text-white font-medium text-lg hover:bg-white/10"
          >
            Explore Knowledge Graph
          </button>
        </div>
      </motion.div>
    </div>
  );
};
