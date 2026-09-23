import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 bg-darker">
        {/* Subtle gradient overlay to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-darker/80 via-darker/40 to-darker/90 z-10" />
        <video 
          autoPlay 
          loop 
          muted={true}
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end items-end p-6 sm:p-8 md:p-10 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex flex-col items-end text-right max-w-[280px] sm:max-w-xs md:max-w-sm"
        >
          <span className="font-display tracking-[0.25em] text-[9px] sm:text-[10px] uppercase text-white/70 mb-1.5">
            Aman Visual.in
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight leading-tight mb-2">
            Cinematic <span className="text-white/60">Vision</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/70 font-light mb-4 leading-relaxed">
            Elevating brands through premium photography and commercial videography in Mumbai & beyond.
          </p>
          
          <div className="flex flex-row justify-end gap-2 sm:gap-3">
            <a 
              href="#pricing"
              className="inline-flex items-center justify-center px-3.5 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] sm:text-xs tracking-wider uppercase rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.35)] active:translate-y-[1px] transition-all duration-100 cursor-pointer"
            >
              Book Now
            </a>
            <Link 
              to="/portfolio"
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-white text-black font-semibold text-[10px] sm:text-xs tracking-wider uppercase rounded-sm shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_2px_0_0_#9ca3af] hover:translate-y-[1px] hover:bg-neutral-100 active:translate-y-[3px] active:shadow-none active:scale-[0.97] active:bg-neutral-200 focus:outline-none transition-all duration-100 ease-out cursor-pointer select-none touch-manipulation"
            >
              Portfolio
            </Link>
            <a 
              href="#contact"
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-transparent border border-white/20 text-white font-medium text-[10px] sm:text-xs tracking-wider uppercase rounded-sm hover:border-white/60 hover:bg-white/5 active:translate-y-[2px] active:scale-[0.97] focus:outline-none transition-all duration-100 ease-out cursor-pointer select-none touch-manipulation"
            >
              Quote
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
