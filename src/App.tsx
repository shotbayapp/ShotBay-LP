import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  X, 
  Check, 
  Search, 
  ArrowRight, 
  Folder, 
  Sparkles, 
  User, 
  Calendar, 
  Download, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Menu
} from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface EventItem {
  id: number;
  title: string;
  date: string;
  guests: number;
  photos: number;
  downloads: number;
  status: 'Live' | 'Completed';
  type: 'first' | 'second' | 'third' | 'custom';
}

export default function App() {
  // Application State
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Events' | 'Photos'>('Dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<{ open: boolean; plan: string; price: string } | null>(null);
  const [driveConfigOpen, setDriveConfigOpen] = useState(false);
  const [demoGalleryOpen, setDemoGalleryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Custom Dynamic State
  const [events, setEvents] = useState<EventItem[]>([
    { id: 1, title: 'Shekhar Weds Radhika', date: 'June 2nd 2026', guests: 423, photos: 1123, downloads: 230, status: 'Live', type: 'first' },
    { id: 2, title: 'Freddy Weds Daisy', date: 'March 13th 2026', guests: 202, photos: 2121, downloads: 210, status: 'Completed', type: 'second' },
    { id: 3, title: 'Techor Annual Meet', date: 'June 2nd 2026', guests: 423, photos: 4230, downloads: 330, status: 'Live', type: 'third' }
  ]);

  // Toast Functionality
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Create Event Form Values
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventGuests, setNewEventGuests] = useState('150');
  const [newEventStatus, setNewEventStatus] = useState<'Live' | 'Completed'>('Live');

  // Handle Event Creation
  const handleCreateEvent = (e: FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) {
      triggerToast('Event title is required', 'error');
      return;
    }
    const dateFormatted = newEventDate ? new Date(newEventDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) : 'June 19th 2026';

    const item: EventItem = {
      id: Date.now(),
      title: newEventTitle,
      date: dateFormatted,
      guests: parseInt(newEventGuests) || 80,
      photos: 0,
      downloads: 0,
      status: newEventStatus,
      type: 'custom'
    };

    setEvents((prev) => [item, ...prev]);
    setCreateModalOpen(false);
    // Reset fields
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventGuests('150');
    setNewEventStatus('Live');
    triggerToast(`"${item.title}" created successfully!`, 'success');
  };

  // Google Drive integration config state
  const [driveFolder, setDriveFolder] = useState('ShotBay/Events/2026');
  const [driveEnabled, setDriveEnabled] = useState(true);

  // AI Scanner state (Feature Cell 1 / AI Card click simulator)
  const [scanningState, setScanningState] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scannerResult, setScannerResult] = useState('');

  const runAIScanSimulation = () => {
    if (scanningState === 'scanning') return;
    setScanningState('scanning');
    triggerToast('Starting mock AI Facematch Scan...', 'info');
    setTimeout(() => {
      setScanningState('success');
      setScannerResult('Shekhar Matched! 14 Photos found instantly.');
      triggerToast('AI Face Scan Match Successful!', 'success');
    }, 2800);
  };

  // Demo Gallery States
  const [demoSelectedFace, setDemoSelectedFace] = useState<string | null>(null);
  const [demoSearchQuery, setDemoSearchQuery] = useState('');
  const sampleFaces = [
    { id: 'shekhar', name: 'Shekhar (Groom)', color: 'bg-amber-100' },
    { id: 'radhika', name: 'Radhika (Bride)', color: 'bg-rose-100' },
    { id: 'radhikas_dad', name: "Radhika's Father", color: 'bg-teal-100' },
    { id: 'friend_john', name: 'John (Groom\'s Friend)', color: 'bg-blue-100' }
  ];

  const demoPhotos = [
    { id: 1, url: 'bg-amber-900', tags: ['shekhar', 'radhika', 'groom', 'bride'], caption: 'Groom & Bride Entry Pose' },
    { id: 2, url: 'bg-emerald-950', tags: ['radhika', 'radhikas_dad', 'bride'], caption: 'Bride walking down the aisle' },
    { id: 3, url: 'bg-orange-950', tags: ['shekhar', 'groom'], caption: 'Groom and groomsmen pre-ceremony' },
    { id: 4, url: 'bg-stone-900', tags: ['radhikas_dad'], caption: 'Emotional moment at the mandap' },
    { id: 5, url: 'bg-violet-950', tags: ['radhika', 'bride'], caption: 'Stunning portrait of the bride' },
    { id: 6, url: 'bg-sky-950', tags: ['shekhar', 'radhika', 'groom', 'bride'], caption: 'Exchanging the Varmala rings' },
    { id: 7, url: 'bg-slate-900', tags: ['friend_john', 'shekhar'], caption: 'John and Shekhar share a toast' },
    { id: 8, url: 'bg-rose-950', tags: ['friend_john'], caption: 'Group dance performance on stage' }
  ];

  const filteredDemoPhotos = demoPhotos.filter(photo => {
    // Face filter matches
    if (demoSelectedFace && !photo.tags.includes(demoSelectedFace)) {
      return false;
    }
    // Search tags match
    if (demoSearchQuery) {
      return photo.tags.some(t => t.toLowerCase().includes(demoSearchQuery.toLowerCase())) ||
             photo.caption.toLowerCase().includes(demoSearchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-white text-[#090909]">
      
      {/* Toast Notification Deck */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 min-w-[320px] max-w-[420px]">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white text-[#111]`}
              style={{ borderColor: toast.type === 'success' ? '#cbf3db' : toast.type === 'error' ? '#ffd0d0' : '#d2d5ff' }}
            >
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />}
              <div className="flex-1 text-sm font-semibold">{toast.message}</div>
              <button onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} className="text-gray-400 hover:text-black shrink-0">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER SECTION */}
      <header className="nav relative">
        <div className="shell nav-inner flex items-center justify-between">
          <a className="brand flex items-center" href="#">
            <img 
              src="https://ksixmbebdydvlmebjxie.supabase.co/storage/v1/object/public/Web%20Assets/Web%20Assets/logo.svg" 
              alt="ShotBay Logo" 
              className="h-6 w-auto block" 
              referrerPolicy="no-referrer"
            />
          </a>
          <nav className="nav-links hidden md:flex items-center gap-11">
            <a href="#product" className="hover:text-[#6b75ff] transition">Product</a>
            <a href="#how" className="hover:text-[#6b75ff] transition">How It Works</a>
            <a href="#pricing" className="hover:text-[#6b75ff] transition">Pricing</a>
          </nav>
          <div className="nav-actions flex items-center gap-6">
            <button onClick={() => triggerToast('Login is pre-configured in demo mode!', 'info')} className="hover:text-[#6b75ff] cursor-pointer transition hidden md:block">Login</button>
            <a className="btn primary hidden md:inline-flex" onClick={() => setCheckoutModalOpen({ open: true, plan: 'Free Trial', price: '₹0' })} href="#pricing">Try For Free</a>
            
            {/* Hamburger button for mobile/tablet toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 text-gray-700 hover:text-black focus:outline-none bg-transparent border-0 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-[64px] left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-40 overflow-hidden md:hidden"
            >
              <div className="p-5 flex flex-col gap-3 font-normal">
                <a 
                  href="#product" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="py-2 px-1 text-sm font-medium border-b border-gray-100 flex items-center justify-between hover:text-[#6b75ff] transition text-gray-800"
                >
                  Product <ArrowRight className="w-4 h-4 text-gray-400" />
                </a>
                <a 
                  href="#how" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="py-2 px-1 text-sm font-medium border-b border-gray-100 flex items-center justify-between hover:text-[#6b75ff] transition text-gray-800"
                >
                  How It Works <ArrowRight className="w-4 h-4 text-gray-400" />
                </a>
                <a 
                  href="#pricing" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="py-2 px-1 text-sm font-medium border-b border-gray-100 flex items-center justify-between hover:text-[#6b75ff] transition text-gray-800"
                >
                  Pricing <ArrowRight className="w-4 h-4 text-gray-400" />
                </a>
                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      triggerToast('Login is pre-configured in demo mode!', 'info');
                    }
                    } 
                    className="w-full h-11 border border-gray-200 text-sm font-medium hover:bg-gray-50 text-gray-800 transition bg-transparent cursor-pointer"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCheckoutModalOpen({ open: true, plan: 'Free Trial', price: '₹0' });
                    }}
                    className="w-full h-11 bg-[#6b75ff] hover:bg-[#505cff] text-white text-sm font-medium shadow-lg shadow-indigo-100 transition cursor-pointer"
                  >
                    Try For Free
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero shell">
          <h1>Your guests shouldn't wait days for their photos.</h1>
          <p>Share event photos instantly through QR-powered galleries, custom event links, and AI face search.</p>
          <div className="hero-actions">
            <a className="btn primary" onClick={() => triggerToast('Selected Start Free Trial!', 'success')} href="#pricing">Start Free Trial</a>
            <button className="btn cursor-pointer" onClick={() => setDemoGalleryOpen(true)}>
              View Demo
            </button>
          </div>
        </section>

        {/* WORKSPACE / SHOWCASE CONTAINER */}
        <section className="showcase shell !p-0 overflow-hidden" id="product">
          <div className="showcase-wrap !w-full !max-w-full !p-0 h-[300px] sm:h-[450px] md:h-[559px]">
            <img 
              src="https://ksixmbebdydvlmebjxie.supabase.co/storage/v1/object/public/Web%20Assets/Web%20Assets/product.png" 
              alt="ShotBay Product Interface" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover block"
            />
          </div>
        </section>

        {/* SECTION TITLE: FEATURES */}
        <section className="section-title shell" id="how">
          <span className="eyebrow">FEATURES</span>
          <h2>Everything you need to deliver photos instantly.</h2>
        </section>

        {/* GRID OF FEATURE CELLS WITH ALTERNATING CHECKERBOARD ACCENTS */}
        <section className="feature-grid shell">
          
          {/* Cell 1: Copy */}
          <div className="feature-cell feature-copy order-cell-1">
            <h3>Find photos in seconds.</h3>
            <p>Guests can instantly discover their photos using AI face search instead of scrolling through hundreds of images.</p>
            <ul className="checks">
              <li>Fast discovery</li>
              <li>Accurate results</li>
              <li>Better guest experience</li>
            </ul>
          </div>
          
          {/* Cell 2: Visual */}
          <div className="feature-cell visual !p-0 overflow-hidden order-cell-2">
            <img 
              src="https://ksixmbebdydvlmebjxie.supabase.co/storage/v1/object/public/Web%20Assets/Web%20Assets/2.png" 
              alt="Find photos in seconds" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover block"
            />
          </div>

          {/* Cell 3: Visual */}
          <div className="feature-cell visual !p-0 overflow-hidden order-cell-3">
            <img 
              src="https://ksixmbebdydvlmebjxie.supabase.co/storage/v1/object/public/Web%20Assets/Web%20Assets/3.png" 
              alt="Dedicated event gallery" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover block"
            />
          </div>

          {/* Cell 4: Copy */}
          <div className="feature-cell feature-copy order-cell-4">
            <h3>A dedicated gallery for every event.</h3>
            <p>Create beautiful event pages with custom URLs and QR codes for instant guest access.</p>
            <ul className="checks">
              <li>Custom event URLs</li>
              <li>Guest-friendly access</li>
              <li>Mobile optimized</li>
            </ul>
          </div>

          {/* Cell 5: Copy */}
          <div className="feature-cell feature-copy order-cell-5">
            <h3>Every photo can be shared instantly.</h3>
            <p>Generate unique QR codes for individual photos and make downloads effortless.</p>
            <ul className="checks">
              <li>Direct downloads</li>
              <li>Simple sharing</li>
              <li>One scan access</li>
            </ul>
          </div>

          {/* Cell 6: Visual */}
          <div className="feature-cell visual !p-0 overflow-hidden order-cell-6">
            <img 
              src="https://ksixmbebdydvlmebjxie.supabase.co/storage/v1/object/public/Web%20Assets/Web%20Assets/4.png" 
              alt="Instant photo sharing" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover block"
            />
          </div>

          {/* Cell 7: Visual */}
          <div className="feature-cell visual !p-0 overflow-hidden order-cell-7">
            <img 
              src="https://ksixmbebdydvlmebjxie.supabase.co/storage/v1/object/public/Web%20Assets/Web%20Assets/5.png" 
              alt="Google Drive sync storage" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover block"
            />
          </div>

          {/* Cell 8: Copy */}
          <div className="feature-cell feature-copy order-cell-8">
            <h3>Your storage.<br />Your control.</h3>
            <p>Connect Google Drive and keep all event photos in your own storage without paying additional storage fees.</p>
            <ul className="checks">
              <li>No vendor lock-in</li>
              <li>Own your files</li>
              <li>Simple setup</li>
            </ul>
          </div>

        </section>

        {/* PRICING SECTION */}
        <section className="pricing shell" id="pricing">
          <div className="section-title">
            <span className="eyebrow">PRICING</span>
            <h2>Choose the Right Plan</h2>
          </div>
          <div className="plans">
            
            <article className="plan">
              <h3>Free Trial</h3>
              <div className="price">
                <strong>₹0</strong>
                <span>for 14 Days</span>
              </div>
              <p>Perfect for trying ShotBay.</p>
              <ul className="checks">
                <li>1 Event</li>
                <li>Custom Event URL</li>
                <li>QR Gallery Access</li>
                <li>Individual Photo QR Codes</li>
                <li>Google Drive Integration</li>
              </ul>
              <button 
                onClick={() => setCheckoutModalOpen({ open: true, plan: 'Free Trial', price: '₹0' })} 
                className="btn cursor-pointer w-full mt-auto block text-center font-bold"
              >
                Select Plan
              </button>
            </article>

            <article className="plan">
              <h3>Pro</h3>
              <div className="price">
                <strong>₹699</strong>
                <span>/month</span>
              </div>
              <p>For photographers handling regular events.</p>
              <ul className="checks">
                <li>Up to 10 Events / Month</li>
                <li>Custom Event URL</li>
                <li>AI Face Search</li>
                <li>QR Gallery Access</li>
                <li>Individual Photo QR Codes</li>
                <li>Google Drive Integration</li>
                <li>Priority Support</li>
              </ul>
              <button 
                onClick={() => setCheckoutModalOpen({ open: true, plan: 'Pro', price: '₹699/month' })} 
                className="btn primary cursor-pointer w-full mt-auto"
              >
                Select Plan
              </button>
            </article>

            <article className="plan studio">
              <h3>
                Studio 
                <span className="recommended">Recommended</span>
              </h3>
              <div className="price">
                <strong>₹1499</strong>
                <span>/month</span>
              </div>
              <p>For studios managing multiple events every week.</p>
              <ul className="checks">
                <li>Unlimited Events</li>
                <li>Custom Event URL</li>
                <li>AI Face Search</li>
                <li>QR Gallery Access</li>
                <li>Studio Branding</li>
                <li>Individual Photo QR Codes</li>
                <li>Google Drive Integration</li>
                <li>Priority Support</li>
                <li>Early Access Features</li>
              </ul>
              <button 
                onClick={() => setCheckoutModalOpen({ open: true, plan: 'Studio Recommended', price: '₹1,499/month' })}
                className="btn primary cursor-pointer w-full mt-auto"
              >
                Select Plan
              </button>
            </article>

          </div>
        </section>

        {/* TRUST LOGOS AND FOOTER */}
        <section className="trust shell">
          <h2>Built with trusted technology</h2>
          <div className="logos">
            <div className="logo-cell">
              <span className="google-dots"></span>
              Google AI
            </div>
            <div className="logo-cell">
              <span className="drive-logo"></span>
              Google Drive
            </div>
            <div className="logo-cell vercel">Vercel</div>
            <div className="logo-cell supabase">supabase</div>
          </div>
          <button 
            onClick={() => triggerToast('You are experiencing the official modern ShotBay live landing page sandbox!', 'info')} 
            className="footer-link bg-transparent border-none"
          >
            Know more
          </button>
        </section>
      </main>

      {/* COMPACT BRAND FOOTER */}
      <footer className="bg-[#fafafa] border-t border-gray-200 mt-24 pt-16 pb-0">
        <div className="shell grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1 space-y-4">
            <a className="brand flex items-center gap-2 mb-3" href="#">
              <img 
                src="https://ksixmbebdydvlmebjxie.supabase.co/storage/v1/object/public/Web%20Assets/Web%20Assets/logo.svg" 
                alt="ShotBay Logo" 
                className="h-6 w-auto block" 
                referrerPolicy="no-referrer"
              />
            </a>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
              Next-generation live events photo sharing, powered by AI face search and direct Google Drive sync.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li><a href="#product" className="hover:text-[#6b75ff] transition">Features</a></li>
              <li><a href="#pricing" className="hover:text-[#6b75ff] transition">Pricing &amp; Tiers</a></li>
              <li><button onClick={() => setDemoGalleryOpen(true)} className="hover:text-[#6b75ff] transition cursor-pointer text-left bg-transparent border-0 p-0 text-gray-500 font-normal">Interactive Demo</button></li>
              <li><a href="#how" className="hover:text-[#6b75ff] transition">How It Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-4">Integrations</h4>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li>
                <button onClick={() => triggerToast('Google Drive setup is pre-configured!', 'info')} className="hover:text-[#6b75ff] transition cursor-pointer text-left bg-transparent border-0 p-0 text-gray-500 font-normal">
                  Google Drive Sync
                </button>
              </li>
              <li>
                <button onClick={() => triggerToast('Google AI face search is fully live in demo gallery!', 'info')} className="hover:text-[#6b75ff] transition cursor-pointer text-left bg-transparent border-0 p-0 text-gray-500 font-normal">
                  Google Gemini AI
                </button>
              </li>
              <li>
                <button onClick={() => triggerToast('Supabase persistent real-time store enabled', 'info')} className="hover:text-[#6b75ff] transition cursor-pointer text-left bg-transparent border-0 p-0 text-gray-500 font-normal">
                  Supabase DB
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-4">Legal &amp; Support</h4>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li><button onClick={() => triggerToast('Privacy Policy (Demo Sandbox Only)', 'info')} className="hover:text-[#6b75ff] transition cursor-pointer text-left bg-transparent border-0 p-0 text-gray-500 font-normal">Privacy Policy</button></li>
              <li><button onClick={() => triggerToast('Terms of Service (Demo Sandbox Only)', 'info')} className="hover:text-[#6b75ff] transition cursor-pointer text-left bg-transparent border-0 p-0 text-gray-500 font-normal">Terms of Service</button></li>
              <li><button onClick={() => triggerToast('Our support team: support@shotbay.com', 'info')} className="hover:text-[#6b75ff] transition cursor-pointer text-left bg-transparent border-0 p-0 text-gray-500 font-normal">Contact Us</button></li>
            </ul>
          </div>
        </div>
        <div className="shell border-t border-gray-100 mt-12 pt-6 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-450">
          <p>© {new Date().getFullYear()} ShotBay Inc. All rights reserved.</p>
        </div>
      </footer>

      {/* CREATE EVENT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-[#090909]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl border-2 border-[#b8b8c0] max-w-md w-full shadow-2xl overflow-hidden text-[#111]"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#fafafa]">
              <h3 className="text-lg font-semibold text-[#111] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#6b75ff]" /> Create Live Event
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-normal uppercase text-gray-500 mb-1.5">Event Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Shekhar Weds Radhika, Annual Gala"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full h-11 border border-gray-200 rounded-lg px-3.5 text-sm outline-none focus:border-[#6b75ff]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-normal uppercase text-gray-500 mb-1.5 block">Date</label>
                  <input 
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full h-11 border border-gray-200 rounded-lg px-3.5 text-xs outline-none focus:border-[#6b75ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal uppercase text-gray-500 mb-1.5 block">Est. Guests</label>
                  <input 
                    type="number"
                    value={newEventGuests}
                    onChange={(e) => setNewEventGuests(e.target.value)}
                    placeholder="150"
                    className="w-full h-11 border border-gray-200 rounded-lg px-3.5 text-xs outline-none focus:border-[#6b75ff]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-normal uppercase text-gray-500 mb-1.5 font-sans block">Initial Event Status</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button 
                    type="button"
                    onClick={() => setNewEventStatus('Live')}
                    className={`h-10 text-xs font-normal rounded-lg border flex items-center justify-center gap-1.5 ${newEventStatus === 'Live' ? 'border-[#6b75ff] bg-[#f0f1ff] text-[#6b75ff]' : 'border-gray-200 text-gray-600'}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Active
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewEventStatus('Completed')}
                    className={`h-10 text-xs font-normal rounded-lg border flex items-center justify-center gap-1.5 ${newEventStatus === 'Completed' ? 'border-[#6b75ff] bg-[#f0f1ff] text-[#6b75ff]' : 'border-gray-200 text-gray-600'}`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-normal hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#6b75ff] text-white font-normal text-xs rounded-lg hover:bg-[#505cff] shadow-lg shadow-indigo-100">
                  Generate Event
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* DETAILED GOOGLE DRIVE CONFIG DRAWER */}
      {driveConfigOpen && (
        <div className="fixed inset-0 bg-[#090909]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl border-2 border-[#b8b8c0] max-w-sm w-full shadow-2xl overflow-hidden text-[#111]"
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#fafafa]">
              <h3 className="text-sm font-semibold text-[#111] flex items-center gap-1.5">
                <span className="drive-logo shrink-0 mb-1"></span> Google Drive storage options
              </h3>
              <button onClick={() => setDriveConfigOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-lg border border-gray-100">
                <div>
                  <p className="text-xs font-normal text-gray-900">Google Drive Integration</p>
                  <p className="text-[11px] text-gray-500 font-normal">Store guest uploads on your drive</p>
                </div>
                <button 
                  onClick={() => {
                    setDriveEnabled(!driveEnabled);
                    triggerToast(driveEnabled ? "Google Drive connection turned off" : "Google Drive connection turned on", "info");
                  }}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${driveEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform duration-200 ${driveEnabled ? 'translate-x-5.5' : ''}`} />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-normal uppercase text-gray-400 mb-1.5">ShotBay Root Directory</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={driveFolder}
                    onChange={(e) => setDriveFolder(e.target.value)}
                    disabled={!driveEnabled}
                    className="flex-1 h-9 border border-gray-200 rounded-md px-3 text-xs outline-none disabled:bg-gray-50 disabled:text-gray-400 focus:border-[#6b75ff]"
                  />
                  <button 
                    disabled={!driveEnabled}
                    onClick={() => triggerToast('Storage root folder verified!', 'success')} 
                    className="px-3 bg-gray-100 border border-gray-200 text-xs font-normal rounded-md disabled:opacity-50"
                  >
                    Test Path
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-blue-800 leading-relaxed font-normal">
                By enabling the Google Drive sync option, ShotBay automatically constructs mirror folders and pushes compressed / full-size galleries directly to your secure cloud!
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2 text-xs">
                <button onClick={() => setDriveConfigOpen(false)} className="px-4 py-2 bg-indigo-600 text-white font-normal rounded-md hover:bg-indigo-700">
                  Save preferences
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* PLAN SELECT / CHECKOUT MODAL */}
      {checkoutModalOpen?.open && (
        <div className="fixed inset-0 bg-[#090909]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl border-2 border-[#b8b8c0] max-w-sm w-full shadow-2xl overflow-hidden text-[#111]"
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#fafafa]">
              <h3 className="text-base font-semibold text-[#111] flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-500" /> Unlock {checkoutModalOpen.plan}
              </h3>
              <button onClick={() => setCheckoutModalOpen(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-center py-4 bg-indigo-50 border border-[#e2e4ff] rounded-xl">
                <span className="text-xs uppercase font-semibold text-[#6b75ff] tracking-widest">Selected Tier</span>
                <p className="text-2xl font-semibold text-[#090909] mt-1">{checkoutModalOpen.plan}</p>
                <p className="text-3xl font-semibold text-indigo-700 mt-2">{checkoutModalOpen.price}</p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-normal text-gray-700">100% money back guarantee if not satisfied.</span>
                </div>
                <div className="flex gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-normal text-gray-700">Instant setup - zero delays.</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-normal uppercase text-gray-500">Fast Sign Up Profile</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  defaultValue="shotbay.info@gmail.com"
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-xs outline-none focus:border-[#6b75ff]"
                />
              </div>

              <button 
                onClick={() => {
                  setCheckoutModalOpen(null);
                  triggerToast(`Welcome to ShotBay ${checkoutModalOpen.plan}! Account configured.`, 'success');
                }} 
                className="w-full h-11 bg-[#6b75ff] hover:bg-[#505cff] text-white font-normal text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                Confirm Setup & Start <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* DETAILED INTERACTIVE DEMO GALLERY VIEWER MODAL */}
      {demoGalleryOpen && (
        <div className="fixed inset-0 bg-[#090909] z-50 flex flex-col md:flex-row overflow-hidden text-white font-sans">
          
          {/* Main Gallery Workspace Section */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            
            {/* Header of demo viewer */}
            <div className="flex justify-between items-center border-b border-stone-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="bg-[#6b75ff] text-white text-xs font-semibold px-2 mt-0.5 py-0.5 uppercase rounded">SHOTBAY DEMO</span>
                <div>
                  <h2 className="text-xl font-semibold">Shekhar Weds Radhika</h2>
                  <p className="text-xs text-stone-400 font-normal">June 2nd, 2026 • Live Active QR Gallery</p>
                </div>
              </div>
              <button 
                onClick={() => setDemoGalleryOpen(false)} 
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter Face Bar to test AI Search */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4.5 mb-6">
              <div className="flex items-center justify-between mb-3 text-xs font-normal text-stone-300">
                <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Face-Match Filter Simulation (Click to match)</span>
                {demoSelectedFace && (
                  <button onClick={() => setDemoSelectedFace(null)} className="text-[#6b75ff] hover:underline">
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleFaces.map(face => (
                  <button
                    key={face.id}
                    onClick={() => {
                      setDemoSelectedFace(face.id === demoSelectedFace ? null : face.id);
                      triggerToast(`Filtered Shekhar's gallery for ${face.name}!`, 'info');
                    }}
                    className={`h-9 px-3.5 rounded-full text-xs font-normal transition flex items-center gap-1.5 cursor-pointer ${
                      demoSelectedFace === face.id
                        ? 'bg-[#6b75ff] text-white border-none shadow-lg'
                        : 'bg-stone-800 text-stone-200 border border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${face.color} border border-stone-600 shrink-0`} />
                    {face.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text search connector bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 relative">
                <input 
                  type="text"
                  placeholder="Search photo descriptions (e.g. Groom, Bride, mandap)..."
                  value={demoSearchQuery}
                  onChange={(e) => setDemoSearchQuery(e.target.value)}
                  className="w-full h-11 bg-stone-900 border border-stone-800 rounded-lg px-4.5 pl-11 text-xs text-stone-200 placeholder-stone-500 outline-none focus:border-[#6b75ff] font-normal"
                />
                <Search className="w-4 h-4 text-stone-500 absolute left-4.5 top-3.5" />
              </div>
              {demoSearchQuery && (
                <button onClick={() => setDemoSearchQuery('')} className="text-xs font-normal text-gray-400 hover:text-white">
                  Reset
                </button>
              )}
            </div>

            {/* Photos Results List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredDemoPhotos.map(photo => (
                  <motion.div
                    layout
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group relative aspect-[3/4] bg-stone-900 rounded-xl overflow-hidden border border-stone-800 flex flex-col justify-end"
                  >
                    {/* Placeholder visual image matching wedding theme */}
                    <div className={`absolute inset-0 ${photo.url} opacity-70 group-hover:opacity-90 transition-opacity flex items-center justify-center p-4`}>
                      <Camera className="w-8 h-8 text-white/10 group-hover:text-white/20 transition-colors" />
                    </div>

                    <div className="relative z-10 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                      <span className="text-[9px] uppercase font-normal tracking-widest text-indigo-300">PHOTO #{photo.id}</span>
                      <p className="font-semibold text-xs text-white truncate my-1">{photo.caption}</p>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-stone-800">
                        <button 
                          onClick={() => triggerToast(`Photo #${photo.id} triggered high-res download!`, 'success')}
                          className="text-[10px] font-normal text-emerald-400 flex items-center gap-1.5 hover:underline bg-transparent border-0 cursor-pointer p-0"
                        >
                          <Download className="w-3 h-3" /> Download Free
                        </button>
                        <button 
                          onClick={() => triggerToast(`Individual Photo QR generated for Photo #${photo.id}`, 'info')}
                          className="text-[10px] font-normal text-indigo-300 hover:underline bg-transparent border-0 cursor-pointer p-0"
                        >
                          Get QR
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredDemoPhotos.length === 0 && (
              <div className="py-24 text-center font-normal">
                <ImageIcon className="w-12 h-12 text-stone-700 mx-auto mb-4" />
                <p className="text-sm font-normal text-stone-400">No matching photos found in Shekhar's wedding index</p>
                <p className="text-xs text-stone-600 mt-1">Try another face filter or clear query to reset the gallery pool.</p>
              </div>
            )}

          </div>

          {/* Sidebar controls for demo */}
          <div className="w-full md:w-80 bg-stone-950 border-t md:border-t-0 md:border-l border-stone-800 p-6 flex flex-col justify-between font-normal">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase font-semibold text-stone-500 tracking-wider">Event QR Portal</h3>
                <p className="text-[11px] text-stone-400 mt-1 font-normal">Simulates guest perspective when scan code at the venue table cards</p>
              </div>

              {/* Vector code box */}
              <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl text-center">
                <div className="w-32 h-32 bg-stone-850 rounded-lg mx-auto flex items-center justify-center p-3 border border-stone-700">
                  <div className="qr-icon" style={{ scale: '1.4', color: '#ffea79' }}></div>
                </div>
                <p className="text-[11px] font-semibold tracking-widest text-[#6b75ff] uppercase mt-3">Scan Entry Code</p>
                <p className="text-[11px] font-normal text-stone-300 mt-1">shotbay.com/g/shekhar</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-900 font-normal">
                <p className="text-xs font-normal text-stone-400">Features Active In This Demo:</p>
                <div className="flex gap-2.5 items-center text-xs text-stone-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Google Drive mirror uploading</span>
                </div>
                <div className="flex gap-2.5 items-center text-xs text-stone-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Real-time tag coordinate matching</span>
                </div>
                <div className="flex gap-2.5 items-center text-xs text-stone-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Custom client subdomain layout</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setDemoGalleryOpen(false)} 
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-normal text-xs rounded-lg mt-8 border-0 cursor-pointer"
            >
              Exit Active Gallery View
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
