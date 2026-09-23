import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Lock, HardDrive, Shield, X, EyeOff } from 'lucide-react';

export default function Footer() {
  const [isOwner, setIsOwner] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aman_is_owner') === 'true';
    } catch {
      return false;
    }
  });
  const [showPrompt, setShowPrompt] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      try {
        setIsOwner(localStorage.getItem('aman_is_owner') === 'true');
      } catch {
        setIsOwner(false);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleOwnerUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === '8827474622') {
      try {
        localStorage.setItem('aman_is_owner', 'true');
      } catch {}
      setIsOwner(true);
      setShowPrompt(false);
      setPasscode('');
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleLock = () => {
    try {
      localStorage.removeItem('aman_is_owner');
    } catch {}
    setIsOwner(false);
  };

  return (
    <footer className="bg-dark border-t border-white/5 py-12 text-center md:text-left relative">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img 
            src="/logo.png" 
            alt="Aman Visual Logo" 
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border border-white/20 shadow-2xl bg-black/40 p-1 hover:scale-105 transition-transform duration-300 shrink-0"
          />
          <div>
            <div className="font-display font-bold text-xl sm:text-2xl tracking-[0.2em] uppercase">
              Aman Visual
            </div>
            <p className="text-xs text-white/40 tracking-wider uppercase mt-1">
              Evershine Cosmic, Andheri West, Mumbai 400053
            </p>
          </div>
        </div>

        <p className="text-xs text-white/40 tracking-widest uppercase">
          © {new Date().getFullYear()} Aman Visual.in. All rights reserved.
        </p>

        <div className="flex items-center gap-5 flex-wrap justify-center">
          <Link to="/pricing" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest">Pricing & Quotations</Link>
          <Link to="/gear" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest">Gear & Kit</Link>
          <Link to="/client-galleries" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest">Client Deliveries</Link>
          <a 
            href="https://wa.me/918827474622" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/40 hover:text-emerald-400 transition-colors text-xs uppercase tracking-widest"
          >
            WhatsApp
          </a>
          <a 
            href="https://www.instagram.com/amanvisual.in?stkn=cGU5a25xNWw2cHE1&utm_source=qr" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest"
          >
            Instagram
          </a>
          <a 
            href="https://www.linkedin.com/in/aman-visuals-5aa4b43b4" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest"
          >
            LinkedIn
          </a>
          <a 
            href="https://www.youtube.com/channel/UC2yh3NtEq_Fb2tnqcTDf3OA" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/40 hover:text-red-500 transition-colors text-xs uppercase tracking-widest"
          >
            YouTube
          </a>

          {/* Owner Access & Admin Dashboard */}
          <Link
            to="/admin"
            className="text-amber-400/90 hover:text-amber-300 hover:border-amber-400/50 hover:bg-amber-400/10 transition-all text-[11px] uppercase tracking-widest inline-flex items-center gap-1.5 border border-amber-400/30 px-3 py-1.5 rounded-full bg-black/40 cursor-pointer shadow-sm font-semibold"
            title="Studio Admin Dashboard & Inquiries"
          >
            <Lock size={12} className="text-amber-400" />
            <span>Admin Dashboard</span>
          </Link>

          {isOwner && (
            /* Studio Owner Active Controls */
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <Link 
                to="/drive" 
                className="text-emerald-400 hover:text-emerald-300 transition-colors text-[11px] uppercase tracking-widest inline-flex items-center gap-1 font-medium"
                title="Google Drive Assets"
              >
                <HardDrive size={12} />
                Drive
              </Link>
              <button
                onClick={handleLock}
                className="text-white/40 hover:text-red-400 transition-colors text-[10px] uppercase tracking-widest inline-flex items-center gap-1 border border-white/10 px-2 py-1 rounded cursor-pointer"
                title="Lock Owner Mode"
              >
                <EyeOff size={11} />
                Lock
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-footer / Legal & Regulatory Bar */}
      <div className="container mx-auto px-6 md:px-12 mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <p className="font-mono text-[11px] tracking-wider uppercase">
          Studio HQ: Evershine Cosmic, Andheri West, Mumbai • CINEMA & EVENT MEDIA
        </p>
        <div className="flex items-center gap-6 flex-wrap justify-center font-mono text-[11px] tracking-wider uppercase">
          <Link 
            to="/privacy-policy" 
            className="hover:text-emerald-400 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-emerald-400"
          >
            Privacy Policy
          </Link>
          <span>•</span>
          <Link 
            to="/terms-and-conditions" 
            className="hover:text-amber-400 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-amber-400"
          >
            Terms & Conditions
          </Link>
          <span>•</span>
          <Link 
            to="/refund-policy" 
            className="hover:text-rose-400 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-rose-400"
          >
            Refund Policy
          </Link>
        </div>
      </div>

      {/* Studio Owner Verification Dialog */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/15 p-6 w-full max-w-sm relative shadow-2xl text-left">
            <button
              onClick={() => {
                setShowPrompt(false);
                setPasscode('');
                setPasscodeError(false);
              }}
              className="absolute top-4 right-4 text-white/40 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <Shield size={18} className="text-amber-400" />
              <h3 className="font-display uppercase font-bold text-sm tracking-wider text-white">
                Studio Owner Access
              </h3>
            </div>
            <p className="text-xs text-white/50 mb-4">
              Enter passcode to reveal the client enquiry inbox and internal studio tools.
            </p>

            <form onSubmit={handleOwnerUnlock} className="space-y-3">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                placeholder="Enter password..."
                autoFocus
                className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-white transition-colors"
              />
              {passcodeError && (
                <p className="text-red-400 text-[11px]">
                  Incorrect password. Please try again.
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-white text-black text-xs font-semibold py-2.5 uppercase tracking-wider hover:bg-white/90 transition-colors cursor-pointer"
                >
                  Verify & Unlock
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrompt(false)}
                  className="px-4 border border-white/20 text-white/60 text-xs uppercase tracking-wider hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
