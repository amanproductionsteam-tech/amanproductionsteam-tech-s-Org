import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight,
  Video,
  Layers,
  Camera,
  CheckCircle2
} from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-dark relative overflow-hidden border-t border-white/5">
      {/* Subtle Grid & Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-950/20 blur-[130px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-amber-950/20 blur-[140px] mix-blend-screen" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 md:mb-20">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/50 mb-3">
            <span className="w-6 h-[1px] bg-white/40 inline-block" />
            <span>Profile & Direction</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight">
            Cinematographer & <span className="text-white/60">Visual Director</span>
          </h2>
        </div>

        {/* Clean 2-Column Profile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Portrait & Media Block */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="relative aspect-[4/5] bg-charcoal w-full overflow-hidden group shadow-2xl shadow-black/80 rounded-sm border border-white/10">
              <img 
                src="/aman-portrait.png" 
                alt="Aman - Cinematographer and Photographer" 
                className="w-full h-full object-cover object-top sm:object-center transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Sparkles size={13} /> Cinematographer & Director
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                    Aman
                  </h3>
                </div>
                <span className="text-[11px] uppercase tracking-wider px-3 py-1 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 rounded-sm">
                  Mumbai, India
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="mt-6 grid grid-cols-3 gap-4 border border-white/10 p-4 bg-white/[0.02] rounded-sm text-center">
              <div>
                <div className="text-2xl font-display font-bold text-white mb-0.5">5+</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">Years Exp.</div>
              </div>
              <div className="border-x border-white/5">
                <div className="text-2xl font-display font-bold text-white mb-0.5">500+</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-amber-300 mb-0.5">300+</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">Clients</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Bio Narrative & Pillars */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="lg:col-span-7 flex flex-col space-y-6"
          >
            <div className="space-y-4 text-white/80 font-light text-base sm:text-lg leading-relaxed">
              <p>
                I am Aman, a professional cinematographer and commercial photographer based in Mumbai, India, with over five years of specialized experience directing and capturing high-stakes productions.
              </p>
              <p>
                My visual language blends technical precision with visceral storytelling. From multi-camera live shoot stages and luxury brand PR activations to corporate documentaries and intimate studio podcasts, I craft frames that command attention.
              </p>
              <p className="text-white/60 text-sm sm:text-base">
                Whether managing large multi-operator camera crews or directing nimble run-and-gun gimbal shots, every frame is engineered with calibrated lighting, intentional composition, and post-production grade color science.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-amber-300 mb-3">
                  <Video size={16} />
                </div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-1">
                  Cine Directing
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  High-energy commercials, brand narratives, and cinematic live set coverage.
                </p>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-amber-300 mb-3">
                  <Camera size={16} />
                </div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-1">
                  Still & Portraiture
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Executive headshots, high-fashion editorials, and premium PR imagery.
                </p>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-amber-300 mb-3">
                  <Layers size={16} />
                </div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-1">
                  Multi-Cam Rigs
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Multi-camera concert coverage, podcast studios, and live stage broadcasts.
                </p>
              </div>
            </div>

            {/* Dedicated Gear Banner Callout */}
            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
                  <CheckCircle2 size={14} />
                  <span>Studio-Owned Production Kit</span>
                </div>
                <p className="text-xs text-white/60">
                  Sony Cinema FX30, Canon EOS R6 Series, 13+ fast prime lenses, and dual DJI RS gimbals.
                </p>
              </div>

              <Link
                to="/gear"
                className="shrink-0 px-4 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2 rounded-sm text-center"
              >
                <span>View Gear Arsenal</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
