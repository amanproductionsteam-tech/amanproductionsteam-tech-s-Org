import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MessageCircle, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Search, 
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Inbox,
  HardDrive,
  Eye,
  EyeOff,
  Key,
  CreditCard,
  CheckCircle,
  Database
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  shootDate?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'archived';
  emailDelivery?: {
    attempted?: boolean;
    sent?: boolean;
    provider?: string;
    messageId?: string;
    error?: string;
    sentAt?: string;
  };
}

interface AdminBooking {
  id: string;
  orderId?: string;
  cfPaymentId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceTitle: string;
  amount: number;
  totalAmount?: number;
  eventDate?: string;
  eventVenue?: string;
  customNotes?: string;
  utr?: string;
  status: 'PENDING_VERIFICATION' | 'PAID' | 'FAILED' | 'CANCELLED';
  paymentMode?: string;
  receiptNumber?: string;
  createdAt: string;
  verifiedAt?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  useEffect(() => {
    fetch('/api/admin/session').then(r => r.json())
      .then(data => setIsAuthenticated(Boolean(data.authenticated)))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setCheckingSession(false));
  }, []);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [activeSection, setActiveSection] = useState<'enquiries' | 'bookings' | 'secrets'>('enquiries');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState<'all' | 'PENDING_VERIFICATION' | 'PAID' | 'FAILED'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Production Secrets & API Keys state
  interface SecretsState {
    email: {
      isConfigured: boolean;
      destinationEmail: string;
      smtpUser: string;
      hasSmtpPass: boolean;
      smtpPassMasked: string;
      smtpHost: string;
      smtpPort: string;
      smtpSecure?: string;
      senderEmail?: string;
      hasResendKey: boolean;
      resendKeyMasked: string;
    };
    security: {
      hasCustomAdminPassword: boolean;
      adminPasswordMasked: string;
    };
  }

  const [secretsData, setSecretsData] = useState<SecretsState | null>(null);
  const [loadingSecrets, setLoadingSecrets] = useState(false);
  const [savingSecrets, setSavingSecrets] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [saveErrorMsg, setSaveErrorMsg] = useState('');

  // Form fields for editing secrets
  const [formDestEmail, setFormDestEmail] = useState('amanproductionsteam@gmail.com');
  const [formSmtpUser, setFormSmtpUser] = useState('amanproductionsteam@gmail.com');
  const [formSmtpPass, setFormSmtpPass] = useState('');
  const [formSmtpHost, setFormSmtpHost] = useState('smtp.gmail.com');
  const [formSmtpPort, setFormSmtpPort] = useState('465');
  const [formSmtpSecure, setFormSmtpSecure] = useState('true');
  const [formSenderEmail, setFormSenderEmail] = useState('"Aman Visual" <amanproductionsteam@gmail.com>');
  const [formAdminPassword, setFormAdminPassword] = useState('');
  const [showSmtpPassInput, setShowSmtpPassInput] = useState(false);
  const [showAdminPassInput, setShowAdminPassInput] = useState(false);

  // Testing status
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'contacted' | 'archived'>('all');

  const fetchSecrets = async () => {
    setLoadingSecrets(true);
    try {
      const res = await fetch('/api/admin/secrets');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.secrets) {
          setSecretsData(data.secrets);
          if (data.secrets.email?.destinationEmail) {
            setFormDestEmail(data.secrets.email.destinationEmail);
          }
          if (data.secrets.email?.smtpUser) {
            setFormSmtpUser(data.secrets.email.smtpUser);
          }
          if (data.secrets.email?.smtpHost) {
            setFormSmtpHost(data.secrets.email.smtpHost);
          }
          if (data.secrets.email?.smtpPort) {
            setFormSmtpPort(data.secrets.email.smtpPort);
          }
          if (data.secrets.email?.smtpSecure !== undefined) {
            setFormSmtpSecure(String(data.secrets.email.smtpSecure));
          }
          if (data.secrets.email?.senderEmail) {
            setFormSenderEmail(data.secrets.email.senderEmail);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch secrets:', err);
    } finally {
      setLoadingSecrets(false);
    }
  };

  const handleSaveSecrets = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSecrets(true);
    setSaveSuccessMsg('');
    setSaveErrorMsg('');
    try {
      const payload: any = {
        destinationEmail: formDestEmail,
        smtpHost: formSmtpHost,
        smtpPort: formSmtpPort,
        smtpSecure: formSmtpSecure,
        senderEmail: formSenderEmail,
      };
      if (formSmtpUser.trim()) payload.smtpUser = formSmtpUser.trim();
      if (formSmtpPass.trim()) payload.smtpPass = formSmtpPass.trim();
      if (formAdminPassword.trim()) payload.adminPassword = formAdminPassword.trim();

      const res = await fetch('/api/admin/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save secrets.');
      }
      setSaveSuccessMsg('✓ Production secrets saved and activated successfully on the server!');
      if (data.secrets) {
        setSecretsData(data.secrets);
      }
      setFormSmtpPass('');
      setFormAdminPassword('');
    } catch (err: any) {
      setSaveErrorMsg(err.message || 'Error saving secrets.');
    } finally {
      setSavingSecrets(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/admin/test-email', { method: 'POST' });
      const data = await res.json();
      setTestEmailResult({
        success: data.success,
        message: data.message || data.error || 'Verification completed.'
      });
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: err.message || 'Failed to send test email.'
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        }
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  const handleVerifyBooking = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/verify`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchBookings();
      } else {
        alert(data.error || 'Failed to verify booking');
      }
    } catch (err) {
      console.error('Error verifying booking:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectBooking = async (id: string) => {
    if (!confirm('Are you sure you want to mark this booking as rejected?')) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/reject`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchBookings();
      } else {
        alert(data.error || 'Failed to reject booking');
      }
    } catch (err) {
      console.error('Error rejecting booking:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Load inquiries, bookings, and gateway status from backend
  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const [res] = await Promise.all([
        fetch('/api/contact'),
        fetchBookings().catch(() => null)
      ]);
      const data = await res.json();
      if (data.success && Array.isArray(data.enquiries)) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnquiries();
      fetchSecrets();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pin })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Sign-in failed.');
      setPin('');
      setIsAuthenticated(true);
      setPinError(false);
    } catch (error) {
      setPinError(true);
      alert(error instanceof Error ? error.message : 'Sign-in failed.');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'archived') => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error deleting enquiry:', err);
    }
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      searchTerm === '' ||
      b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone?.includes(searchTerm) ||
      b.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.utr?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      bookingFilterStatus === 'all' || b.status === bookingFilterStatus;
    return matchesSearch && matchesStatus;
  });

  const newCount = enquiries.filter((e) => e.status === 'new').length;
  const pendingVerificationCount = bookings.filter((b) => b.status === 'PENDING_VERIFICATION').length;

  // Check the server session before showing the owner workspace.
  if (checkingSession) return <div className="min-h-screen bg-[#050505] text-white p-12">Checking owner access…</div>;
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#121212] border border-white/10 p-8 sm:p-10 shadow-2xl relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Website
          </Link>

          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white">
            <Lock size={20} />
          </div>

          <h1 className="text-2xl font-display font-bold uppercase tracking-tight mb-2">
            Aman Visual Inbox
          </h1>
          <p className="text-xs text-white/50 leading-relaxed mb-8">
            Enter your passcode to manage all customer project enquiries and messages.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] uppercase tracking-widest text-white/40">
                  Password / Passcode
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPin('8827474622');
                    setPinError(false);
                  }}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 uppercase tracking-wider font-mono cursor-pointer flex items-center gap-1 transition-colors"
                  title="Click to fill default passcode"
                >
                  <Key size={11} /> Auto-fill (8827474622)
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter password (e.g. 8827474622)..."
                  autoFocus
                  className="w-full bg-black/50 border border-white/20 pl-4 pr-10 py-3 text-white text-sm focus:outline-none focus:border-white transition-colors font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pinError && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Incorrect password. Please try again.
                </p>
              )}

              {/* Informative credentials note */}
              <div className="mt-4 p-3.5 bg-white/[0.04] border border-white/10 rounded-sm">
                <div className="flex items-start gap-2.5">
                  <Key size={15} className="text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-white/80 leading-relaxed">
                    <p className="text-[11px] text-white/50 uppercase tracking-wider mb-0.5">
                      Studio Owner Passcode:
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold text-sm tracking-widest select-all">
                        8827474622
                      </span>
                      <span className="text-[10px] text-white/40">
                        (Studio Contact Number)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-white text-black text-xs font-semibold uppercase tracking-widest hover:bg-white/90 transition-colors cursor-pointer"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Inbox
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Breadcrumbs variant="inline" />
            <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Aman Visual Logo"
                className="h-8 w-8 object-contain rounded-full border border-white/15"
              />
              <div>
                <h1 className="text-lg font-display uppercase font-bold tracking-wider">
                  Aman Visual <span className="text-white/40 text-sm font-normal">| Enquiry Inbox</span>
                </h1>
                <p className="text-[11px] text-white/40">
                  Connected to amanproductionsteam@gmail.com
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/todos"
              className="px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 hover:bg-emerald-500 hover:text-black transition-colors inline-flex items-center gap-1.5"
            >
              <Database size={13} />
              Supabase DB
            </Link>
            <Link
              to="/client-galleries"
              className="px-3.5 py-2 bg-amber-500/20 border border-amber-500/40 text-xs text-amber-300 hover:bg-amber-500 hover:text-black transition-colors inline-flex items-center gap-1.5"
            >
              <Eye size={13} />
              Client Deliveries
            </Link>
            <Link
              to="/drive"
              className="px-3.5 py-2 bg-emerald-600/20 border border-emerald-500/40 text-xs text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <HardDrive size={13} />
              Drive Assets
            </Link>
            <button
              onClick={fetchEnquiries}
              disabled={loading}
              className="px-3.5 py-2 border border-white/15 text-xs text-white/70 hover:text-white hover:border-white transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => {
                fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
                setIsAuthenticated(false);
              }}
              className="px-3.5 py-2 bg-white/10 text-xs text-white/80 hover:bg-white hover:text-black transition-colors uppercase tracking-wider"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 flex-1">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#121212] border border-white/5 p-5">
            <span className="text-[10px] uppercase tracking-widest text-white/40">Total Enquiries</span>
            <div className="text-3xl font-display font-bold mt-1 text-white">{enquiries.length}</div>
          </div>
          <div className="bg-[#121212] border border-white/5 p-5">
            <span className="text-[10px] uppercase tracking-widest text-white/40">New / Unaddressed</span>
            <div className="text-3xl font-display font-bold mt-1 text-amber-400">{newCount}</div>
          </div>
          <div className="bg-[#121212] border border-white/5 p-5">
            <span className="text-[10px] uppercase tracking-widest text-white/40">Confirmed Bookings</span>
            <div className="text-3xl font-display font-bold mt-1 text-emerald-400">
              {bookings.filter((b) => b.status === 'PAID').length}
            </div>
          </div>
          <div
            className={`p-5 transition-all border ${
              pendingVerificationCount > 0
                ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30'
                : 'bg-[#121212] border-white/5'
            }`}
          >
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <Clock size={12} />
              <span>Pending UPI Verification</span>
            </span>
            <div className="text-3xl font-display font-bold mt-1 text-amber-300">
              {pendingVerificationCount}
            </div>
          </div>
        </div>

        {/* Official Kotak Mahindra Bank UPI & Direct Booking Status Box */}
        <div className="bg-[#121212] border border-emerald-500/30 p-5 mb-8 rounded-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider font-semibold">
                <CreditCard size={14} />
                <span>Official Kotak Mahindra Bank UPI & Direct Reservation</span>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Client retainers and bookings are paid directly to Kotak Mahindra Bank (UPI ID: <span className="text-white font-mono font-bold">8827474622@ybl</span> / A/C: <span className="text-white font-mono font-bold">1645939816</span>).
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-white/10 rounded text-xs font-mono">
                <span className="text-white/40">Gateway:</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Direct Kotak UPI
                </span>
              </div>

              <Link
                to="/pricing"
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs uppercase tracking-wider font-bold rounded cursor-pointer transition-all inline-flex items-center gap-1.5"
              >
                <span>View Live Rates</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/70">
            <div className="bg-black/40 p-2.5 rounded border border-white/5">
              <span className="text-[10px] text-white/40 uppercase font-mono block">Beneficiary</span>
              <strong className="text-white">Aman Tiwari</strong>
            </div>
            <div className="bg-black/40 p-2.5 rounded border border-white/5">
              <span className="text-[10px] text-white/40 uppercase font-mono block">UPI ID / Phone</span>
              <strong className="text-emerald-400 font-mono">8827474622@ybl</strong>
            </div>
            <div className="bg-black/40 p-2.5 rounded border border-white/5">
              <span className="text-[10px] text-white/40 uppercase font-mono block">Account / IFSC</span>
              <strong className="text-white font-mono">1645939816 • KKBK0000133</strong>
            </div>
          </div>
        </div>

        {/* Supabase Cloud Database Integration Status */}
        <div className="bg-[#121212] border border-emerald-500/20 p-5 mb-8 rounded-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Database size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white font-display">Supabase Cloud Database</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-1 font-mono">
                  https://bzxwthyqoscvlplvguit.supabase.co
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/todos"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider rounded-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Database size={13} />
                <span>Open Todos Table</span>
              </Link>
              <a
                href="https://supabase.com/dashboard/project/bzxwthyqoscvlplvguit"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs border border-white/10 rounded-sm inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveSection('enquiries')}
            className={`pb-3 text-xs uppercase tracking-wider font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSection === 'enquiries'
                ? 'border-emerald-500 text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Inbox size={15} />
            <span>Client Enquiries</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white font-mono">
              {enquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('bookings')}
            className={`pb-3 text-xs uppercase tracking-wider font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSection === 'bookings'
                ? 'border-emerald-500 text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <CreditCard size={15} />
            <span>Bookings & Retainers</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white font-mono">
              {bookings.length}
            </span>
            {pendingVerificationCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono animate-pulse">
                {pendingVerificationCount} Pending Verification
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveSection('secrets');
              fetchSecrets();
            }}
            className={`pb-3 text-xs uppercase tracking-wider font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSection === 'secrets'
                ? 'border-emerald-500 text-white font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Key size={15} />
            <span>Production Secrets & API Keys</span>
            {secretsData?.email?.isConfigured ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Active ✓
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                Configure Keys
              </span>
            )}
          </button>
        </div>

        {activeSection === 'enquiries' ? (
          <>
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3 text-white/40" />
            <input
              type="text"
              placeholder="Search by client, email, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['all', 'new', 'contacted', 'archived'] as const).map((statusKey) => (
              <button
                key={statusKey}
                onClick={() => setFilterStatus(statusKey)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                  filterStatus === statusKey
                    ? 'bg-white text-black font-semibold'
                    : 'bg-[#121212] border border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {statusKey}
              </button>
            ))}
          </div>
        </div>

        {/* Enquiries List */}
        {filteredEnquiries.length === 0 ? (
          <div className="bg-[#121212] border border-white/5 p-16 text-center">
            <Inbox size={40} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-lg font-display uppercase text-white mb-1">No Enquiries Found</h3>
            <p className="text-xs text-white/40">
              {searchTerm ? 'No entries match your search criteria.' : 'No enquiries received yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEnquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="bg-[#121212] border border-white/10 p-6 transition-all hover:border-white/20"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-white/40 bg-black/60 px-2 py-0.5 border border-white/10">
                        {enquiry.id}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 ${
                          enquiry.status === 'new'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : enquiry.status === 'contacted'
                            ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                            : 'bg-white/10 text-white/50 border border-white/10'
                        }`}
                      >
                        {enquiry.status}
                      </span>
                      {enquiry.message?.includes('Retainer') && (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 inline-flex items-center gap-1">
                          <CreditCard size={11} /> Booking Retainer Paid
                        </span>
                      )}
                      <span className="text-[11px] text-white/40 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(enquiry.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-semibold text-white">
                      {enquiry.name}
                    </h3>
                    <div className="text-xs text-white/60 mt-1 flex flex-wrap items-center gap-4">
                      <span>Service: <strong className="text-white">{enquiry.service}</strong></span>
                      <span>Email: <a href={`mailto:${enquiry.email}`} className="text-emerald-400 hover:underline">{enquiry.email}</a></span>
                      {enquiry.phone && (
                        <span>Phone: <a href={`tel:${enquiry.phone}`} className="text-white hover:underline">{enquiry.phone}</a></span>
                      )}
                      {enquiry.shootDate && (
                        <span>Shoot Date: <strong className="text-amber-400">{enquiry.shootDate}</strong></span>
                      )}
                      {enquiry.emailDelivery?.sent ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          Delivered to Gmail ✓
                        </span>
                      ) : enquiry.emailDelivery?.error ? (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded" title={enquiry.emailDelivery.error}>
                          Email Pending
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Quick WhatsApp direct to customer */}
                    {enquiry.phone ? (
                      <a
                        href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '').length === 10 ? '91' + enquiry.phone.replace(/[^0-9]/g, '') : enquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${enquiry.name}, thank you for contacting Aman Visual regarding your ${enquiry.service} enquiry.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors text-xs inline-flex items-center gap-1.5"
                      >
                        <MessageCircle size={13} />
                        WhatsApp Client
                      </a>
                    ) : (
                      <a
                        href={`https://wa.me/918827474622?text=${encodeURIComponent(
                          `Hi Aman, client enquiry follow-up for ${enquiry.name} (${enquiry.email}) for ${enquiry.service}.\nMessage: "${enquiry.message}"`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors text-xs inline-flex items-center gap-1.5"
                      >
                        <MessageCircle size={13} />
                        WhatsApp
                      </a>
                    )}

                    {/* Email Client */}
                    <a
                      href={`mailto:${enquiry.email}?subject=${encodeURIComponent(
                        `Aman Visual | Regarding your ${enquiry.service} enquiry`
                      )}&body=${encodeURIComponent(
                        `Hi ${enquiry.name},\n\nThank you for reaching out to Aman Visual regarding your project (${enquiry.service}).\n\nI reviewed your brief:\n"${enquiry.message}"\n\nLet's discuss how we can bring this vision to life.\n\nWarm regards,\nAman\nAman Visual | Mumbai\n+91 8827474622`
                      )}`}
                      className="px-3 py-1.5 bg-white/10 border border-white/15 text-white hover:bg-white hover:text-black transition-colors text-xs inline-flex items-center gap-1.5"
                    >
                      <Mail size={13} />
                      Reply Email
                    </a>

                    {/* Status Dropdown */}
                    <select
                      value={enquiry.status}
                      onChange={(e) =>
                        handleStatusChange(enquiry.id, e.target.value as any)
                      }
                      className="bg-black/60 border border-white/20 text-xs px-2.5 py-1.5 text-white/80 focus:outline-none focus:border-white"
                    >
                      <option value="new">Mark New</option>
                      <option value="contacted">Mark Contacted</option>
                      <option value="archived">Mark Archived</option>
                    </select>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(enquiry.id)}
                      className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                      title="Delete enquiry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-black/40 border border-white/5 p-4 text-sm text-white/80 font-light leading-relaxed whitespace-pre-wrap">
                  {enquiry.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    ) : activeSection === 'bookings' ? (
      <>
        {/* Filters and Search Bar for Bookings */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3 text-white/40" />
            <input
              type="text"
              placeholder="Search bookings by client, order ID, UTR, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(
              [
                { key: 'all', label: 'All Bookings' },
                { key: 'PENDING_VERIFICATION', label: `Pending Verification (${pendingVerificationCount})` },
                { key: 'PAID', label: 'Paid / Confirmed' },
                { key: 'FAILED', label: 'Failed' },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setBookingFilterStatus(key as any)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  bookingFilterStatus === key
                    ? key === 'PENDING_VERIFICATION'
                      ? 'bg-amber-400 text-black font-bold'
                      : 'bg-white text-black font-semibold'
                    : 'bg-[#121212] border border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-[#121212] border border-white/5 p-16 text-center">
            <CreditCard size={40} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-lg font-display uppercase text-white mb-1">No Bookings Found</h3>
            <p className="text-xs text-white/40">
              {searchTerm ? 'No entries match your search criteria.' : 'No customer bookings recorded yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isPending = b.status === 'PENDING_VERIFICATION';
              const isPaid = b.status === 'PAID';
              const isDirectUpi = b.paymentMode === 'DIRECT_UPI_QR';

              return (
                <div
                  key={b.id}
                  className={`p-6 transition-all border ${
                    isPending
                      ? 'bg-[#14120b] border-amber-500/40 ring-1 ring-amber-500/20'
                      : 'bg-[#121212] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-mono text-xs text-white/50 bg-black/60 px-2 py-0.5 border border-white/10">
                          Ref: {b.id}
                        </span>
                        {b.orderId && b.orderId !== b.id && (
                          <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                            Order: {b.orderId}
                          </span>
                        )}
                        <span
                          className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                            isPaid
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {isPending ? 'Pending Bank Verification' : b.status}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-white/60">
                          {isDirectUpi ? 'Kotak Direct UPI QR' : 'Advance Booking Retainer'}
                        </span>
                        <span className="text-[11px] text-white/40 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(b.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-display font-semibold text-white flex items-center gap-3">
                        <span>{b.customerName}</span>
                        <span className="text-emerald-400 font-mono text-lg font-bold">
                          ₹{b.amount.toLocaleString('en-IN')}
                        </span>
                      </h3>

                      <div className="text-xs text-white/60 mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1">
                        <span>Service: <strong className="text-white">{b.serviceTitle}</strong></span>
                        {b.customerEmail && (
                          <span>Email: <a href={`mailto:${b.customerEmail}`} className="text-emerald-400 hover:underline">{b.customerEmail}</a></span>
                        )}
                        {b.customerPhone && (
                          <span>Phone: <a href={`tel:${b.customerPhone}`} className="text-white hover:underline">{b.customerPhone}</a></span>
                        )}
                        {b.eventDate && (
                          <span>Shoot Date: <strong className="text-amber-300">{b.eventDate}</strong></span>
                        )}
                        {b.eventVenue && (
                          <span>Venue: <strong className="text-white/80">{b.eventVenue}</strong></span>
                        )}
                        {b.utr && (
                          <span>Client UTR: <strong className="font-mono text-emerald-300">{b.utr}</strong></span>
                        )}
                      </div>
                    </div>

                    {/* Booking Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {b.customerPhone && (
                        <a
                          href={`https://wa.me/91${b.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            isPending
                              ? `Hello ${b.customerName}! Aman from Aman Visual here. I am reviewing your advance payment transfer (Booking Ref: ${b.id}, Amount: ₹${b.amount}). Thank you for choosing Aman Visual!`
                              : `Hello ${b.customerName}! Your booking with Aman Visual for ${b.serviceTitle} is confirmed! Receipt Ref: ${b.receiptNumber || b.id}. Let's finalize your shoot plan.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-colors text-xs inline-flex items-center gap-1.5 font-bold cursor-pointer"
                        >
                          <MessageCircle size={13} />
                          WhatsApp Client
                        </a>
                      )}

                      {isPending && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleVerifyBooking(b.id)}
                            disabled={actionLoadingId === b.id}
                            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer inline-flex items-center gap-1.5 shadow"
                          >
                            <CheckCircle2 size={14} />
                            <span>{actionLoadingId === b.id ? 'Confirming...' : '✓ Confirm Kotak Credit'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRejectBooking(b.id)}
                            disabled={actionLoadingId === b.id}
                            className="px-3 py-2 border border-red-500/40 text-red-300 hover:bg-red-500/20 text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Pending Kotak Instruction Callout */}
                  {isPending && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-200 flex items-start gap-2.5 mb-3">
                      <Clock size={15} className="text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold text-amber-300 block">Manual Verification Required</span>
                        <p className="text-white/70 text-[11px] leading-relaxed">
                          Client transferred via Direct Kotak Bank UPI QR. Check your Kotak Mahindra Bank account (A/c 1645939816) for incoming credit of <strong className="text-white font-mono">₹{b.amount.toLocaleString('en-IN')}</strong>. Once you verify the credit in your bank app, click <strong>"✓ Confirm Kotak Credit"</strong> above to transition this booking to Confirmed.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Verified Paid Info */}
                  {isPaid && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded text-xs text-emerald-200 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={15} className="text-emerald-400" />
                        <span>
                          Booking Verified & Confirmed | Receipt # <strong className="font-mono text-white">{b.receiptNumber || b.orderId}</strong>
                        </span>
                      </div>
                      {b.verifiedAt && (
                        <span className="text-[11px] text-white/50 font-mono">
                          Verified: {new Date(b.verifiedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Notes / Brief */}
                  {b.customNotes && (
                    <div className="bg-black/40 border border-white/5 p-3 text-xs text-white/80 font-light mt-3 leading-relaxed">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 block mb-0.5">Client Notes:</span>
                      {b.customNotes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </>
    ) : (
      /* Production Secrets & API Keys Workspace */
      <div className="space-y-8 max-w-4xl">
        {/* Top Header Card */}
        <div className="bg-[#121212] border border-white/10 p-6 rounded-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-sm">
                  <Key size={16} />
                </span>
                <h2 className="text-lg font-display uppercase tracking-wider text-white font-bold">
                  Studio Secrets & Production Keys
                </h2>
              </div>
              <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
                Configure your SMTP credentials for customer enquiry delivery and studio owner access. Values are encrypted and securely stored on the server—never in client bundles or public repositories.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchSecrets}
              disabled={loadingSecrets}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs border border-white/10 rounded-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start md:self-auto"
            >
              <RefreshCw size={13} className={loadingSecrets ? 'animate-spin' : ''} />
              <span>Refresh Status</span>
            </button>
          </div>

          {/* Quick Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            <div className="bg-black/50 border border-white/5 p-3 rounded">
              <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 block">Studio Payment Mode</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white">
                  Kotak Mahindra Bank UPI
                </span>
              </div>
              <div className="text-[11px] text-white/50 font-mono mt-1 truncate">
                UPI ID: 8827474622@ybl
              </div>
            </div>

            <div className="bg-black/50 border border-white/5 p-3 rounded">
              <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 block">Enquiry Email Delivery</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${secretsData?.email?.isConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-xs font-semibold text-white">
                  {secretsData?.email?.isConfigured ? 'Operational' : 'Password Needed'}
                </span>
              </div>
              <div className="text-[11px] text-white/50 truncate mt-1">
                To: {secretsData?.email?.destinationEmail || 'amanproductionsteam@gmail.com'}
              </div>
            </div>

            <div className="bg-black/50 border border-white/5 p-3 rounded">
              <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 block">Studio Owner Portal</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-white">
                  {secretsData?.security?.hasCustomAdminPassword ? 'Custom Password Set' : 'Default PIN Active'}
                </span>
              </div>
              <div className="text-[11px] text-white/50 font-mono mt-1">
                Protected by timing-safe login
              </div>
            </div>
          </div>
        </div>

        {/* Success / Error alerts */}
        {saveSuccessMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-sm flex items-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
        {saveErrorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-sm flex items-center gap-3">
            <ShieldAlert size={16} className="text-red-400 shrink-0" />
            <span>{saveErrorMsg}</span>
          </div>
        )}

        {/* Main Secrets Form */}
        <form onSubmit={handleSaveSecrets} className="space-y-6">
          {/* Section 1: Kotak Mahindra Bank UPI Configuration */}
          <div className="bg-[#121212] border border-white/10 p-6 rounded-sm space-y-5">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={15} className="text-emerald-400" />
                  <span>Official Kotak Mahindra Bank & UPI Details</span>
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Direct client payments are credited straight to your registered Kotak Mahindra Bank account.
                </p>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                Direct UPI Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-black/50 p-3 rounded border border-white/5">
                <span className="text-[10px] uppercase font-mono text-white/40 block">Account Holder</span>
                <span className="text-xs font-bold text-white">Aman Tiwari</span>
              </div>
              <div className="bg-black/50 p-3 rounded border border-white/5">
                <span className="text-[10px] uppercase font-mono text-white/40 block">Bank Name</span>
                <span className="text-xs font-bold text-white">Kotak Mahindra Bank</span>
              </div>
              <div className="bg-black/50 p-3 rounded border border-white/5">
                <span className="text-[10px] uppercase font-mono text-white/40 block">Account Number</span>
                <span className="text-xs font-mono font-bold text-emerald-400">1645939816</span>
              </div>
              <div className="bg-black/50 p-3 rounded border border-white/5">
                <span className="text-[10px] uppercase font-mono text-white/40 block">IFSC Code</span>
                <span className="text-xs font-mono font-bold text-white">KKBK0000133</span>
              </div>
            </div>

            <div className="p-3.5 bg-black/40 border border-white/10 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-white/40 uppercase font-mono text-[10px] block">Official UPI ID</span>
                <span className="font-mono text-sm font-bold text-emerald-400">8827474622@ybl</span>
                <span className="text-[11px] text-white/50 ml-2">(Phone: +91 8827474622)</span>
              </div>
              <div className="text-[11px] text-white/50">
                Clients receive instant digital retainer receipts with reference numbers on payment submission.
              </div>
            </div>
          </div>

          {/* Section 2: Transactional Email & Enquiries */}
          <div className="bg-[#121212] border border-white/10 p-6 rounded-sm space-y-5">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Mail size={15} className="text-emerald-400" />
                  <span>Gmail SMTP Transactional Email Service</span>
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Automated notifications sent when customers submit an enquiry or confirm a booking advance.
                </p>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Gmail SMTP Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  Studio Destination Email
                </label>
                <input
                  type="email"
                  value={formDestEmail}
                  onChange={(e) => setFormDestEmail(e.target.value)}
                  placeholder="amanproductionsteam@gmail.com"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-white/40 mt-1">
                  Enquiries & customer payment alerts arrive here.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  SMTP Sender Account (Gmail)
                </label>
                <input
                  type="email"
                  value={formSmtpUser}
                  onChange={(e) => setFormSmtpUser(e.target.value)}
                  placeholder="amanproductionsteam@gmail.com"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-white/40 mt-1">
                  Gmail account sending the emails via SMTP.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 flex items-center justify-between">
                  <span>Gmail App Password</span>
                  {secretsData?.email?.hasSmtpPass && (
                    <span className="text-[10px] text-emerald-400 font-mono">
                      (Configured ✓)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showSmtpPassInput ? 'text' : 'password'}
                    value={formSmtpPass}
                    onChange={(e) => setFormSmtpPass(e.target.value)}
                    placeholder={
                      secretsData?.email?.hasSmtpPass
                        ? 'Leave empty to keep existing password, or enter new 16-letter App Password'
                        : 'e.g. abcd efgh ijkl mnop'
                    }
                    className="w-full bg-black/60 border border-white/15 px-3 py-2 pr-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPassInput(!showSmtpPassInput)}
                    className="absolute right-2.5 top-2.5 text-white/40 hover:text-white"
                  >
                    {showSmtpPassInput ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[11px] text-white/40 mt-1">
                  Generate in: Google Account &gt; Security &gt; 2-Step Verification &gt; App Passwords.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  Sender Display Header
                </label>
                <input
                  type="text"
                  value={formSenderEmail}
                  onChange={(e) => setFormSenderEmail(e.target.value)}
                  placeholder={`"Aman Visual" <${formSmtpUser}>`}
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-white/40 mt-1">
                  Appears as the "From:" line in customer and admin inboxes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={formSmtpHost}
                  onChange={(e) => setFormSmtpHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-white/40 mt-1">Default: smtp.gmail.com</p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  SMTP Port
                </label>
                <input
                  type="text"
                  value={formSmtpPort}
                  onChange={(e) => setFormSmtpPort(e.target.value)}
                  placeholder="465"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-white/40 mt-1">465 (SSL) or 587 (TLS)</p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  SSL / TLS Mode
                </label>
                <select
                  value={formSmtpSecure}
                  onChange={(e) => setFormSmtpSecure(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="true">Secure (SSL / TLS on 465)</option>
                  <option value="false">STARTTLS (Port 587)</option>
                </select>
                <p className="text-[11px] text-white/40 mt-1">Standard for Gmail: Secure (465)</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-[11px] text-white/50">
                Clicking test will send an immediate sample verification email to your destination inbox.
              </div>

              <button
                type="button"
                onClick={handleTestEmail}
                disabled={testingEmail || (!secretsData?.email?.hasSmtpPass && !formSmtpPass)}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white text-xs border border-white/15 rounded transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0"
              >
                <Mail size={13} className={testingEmail ? 'animate-pulse' : ''} />
                <span>{testingEmail ? 'Sending...' : 'Send Test Email to Studio'}</span>
              </button>
            </div>

            {testEmailResult && (
              <div
                className={`p-3 text-xs rounded flex items-center gap-2 ${
                  testEmailResult.success
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}
              >
                {testEmailResult.success ? <CheckCircle size={14} /> : <ShieldAlert size={14} />}
                <span>{testEmailResult.message}</span>
              </div>
            )}
          </div>

          {/* Section 3: Studio Owner Access Password */}
          <div className="bg-[#121212] border border-white/10 p-6 rounded-sm space-y-4">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Lock size={15} className="text-emerald-400" />
                  <span>Studio Admin Portal Access Password</span>
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Update the password required to access this /admin workspace.
                </p>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-white/60">
                Encrypted Session
              </span>
            </div>

            <div className="max-w-md">
              <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 flex items-center justify-between">
                <span>New Admin Password</span>
                <span className="text-[10px] text-white/40">
                  (Default fallback: 8827474622)
                </span>
              </label>
              <div className="relative">
                <input
                  type={showAdminPassInput ? 'text' : 'password'}
                  value={formAdminPassword}
                  onChange={(e) => setFormAdminPassword(e.target.value)}
                  placeholder="Leave empty to keep current password"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 pr-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassInput(!showAdminPassInput)}
                  className="absolute right-2.5 top-2.5 text-white/40 hover:text-white"
                >
                  {showAdminPassInput ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Submit Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#121212] border border-white/10 sticky bottom-4 shadow-2xl rounded-sm">
            <div className="text-xs text-white/60 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              <span>
                Changes take effect immediately on the server upon saving.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={savingSecrets}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg"
              >
                {savingSecrets ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Saving Secrets...</span>
                  </>
                ) : (
                  <>
                    <Key size={14} />
                    <span>Save & Apply Production Secrets</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    )}
  </main>
    </div>
  );
}
