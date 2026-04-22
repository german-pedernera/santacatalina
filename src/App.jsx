// Updated logic for likes and display limits
import { useState, useEffect, useRef } from "react";
import { db, auth, storage } from "./firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  setDoc,
  where,
  getDocs,
  writeBatch,
  increment
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Components
import PostCard from "./components/marketplace/PostCard";
import PostForm from "./components/marketplace/PostForm";
import JobCard from "./components/jobs/JobCard";
import JobForm from "./components/jobs/JobForm";
import ConfirmDialog from "./components/common/ConfirmDialog";
import AdminLogin from "./components/auth/AdminLogin";
import AuthScreen from "./components/auth/AuthScreen";
import MovingDots from "./components/common/MovingDots";
import Landing from "./components/common/Landing";
import Footer from "./components/common/Footer";
import TermsModal from "./components/common/TermsModal";
import FeaturedAds from "./components/common/FeaturedAds";
import AdContactForm from "./components/common/AdContactForm";
import { WA_SVG } from "./utils/helpers";

const TELEGRAM_BOT_TOKEN = '8674203998:AAHDiy5tXcRHI9JwXvhrqq9_HvjcmgW-Vi8';
const TELEGRAM_CHAT_ID   = '1222847704';

async function notifyAdmin(type, data) {
  const text = `
🚀 *Nueva Publicación Pendiente*
📂 *Tipo:* ${type === 'post' ? 'Clasificados' : 'Bolsa Trabajo'}
📝 *Título:* ${data.title}
📞 *WhatsApp:* ${data.whatsapp}
🕒 *Fecha:* ${new Date().toLocaleString('es-AR')}
  `;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' })
    });
  } catch (e) { console.error("Telegram notify error", e); }
}

const POSTS_KEY = 'posts'; 
const JOBS_KEY  = 'jobs';  
const WA_GROUP   = 'https://chat.whatsapp.com/GJds8z0PeHMK9D4KrML4gx?mode=gi_t';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts,   setPosts]   = useState([]);
  const [jobs,    setJobs]    = useState([]);
  const [section, setSection] = useState('home');
  const [showPost,  setShowPost]  = useState(false);
  const [showJob,   setShowJob]   = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isAdmin,   setIsAdmin]   = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [editPost,  setEditPost]  = useState(null);
  const [confirm,   setConfirm]   = useState(null); 
  const [menuVis,   setMenuVis]   = useState(true);
  const [loading,   setLoading]   = useState(true);
  const [weather,   setWeather]   = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasEntered, setHasEntered] = useState(sessionStorage.getItem('hasEntered') === 'true');

  const lastScrollY  = useRef(0);

  /* Auth Listener */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  /* Real-time sync with Firebase */
  useEffect(() => {
    setLoading(true);
    const qPosts = query(collection(db, POSTS_KEY), orderBy("timestamp", "desc"));
    const unsubPosts = onSnapshot(qPosts, (snap) => {
      setPosts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      setLoading(false);
    }, (err) => { setLoading(false); });

    const qJobs = query(collection(db, JOBS_KEY), orderBy("timestamp", "desc"));
    const unsubJobs = onSnapshot(qJobs, (snap) => {
      setJobs(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    }, (err) => {});

    return () => { unsubPosts(); unsubJobs(); };
  }, []);

  /* Cleanup expired posts/jobs */
  useEffect(() => {
    const cleanup = async () => {
      const now = Date.now();
      posts.forEach(p => {
        if (p.expiryTimestamp && p.expiryTimestamp < now) {
          deleteDoc(doc(db, POSTS_KEY, p.id)).catch(() => {});
        }
      });
      jobs.forEach(j => {
        if (j.expiryTimestamp && j.expiryTimestamp < now) {
          deleteDoc(doc(db, JOBS_KEY, j.id)).catch(() => {});
        }
      });
    };
    if (posts.length > 0 || jobs.length > 0) cleanup();
  }, [posts.length, jobs.length]);

  /* Theme management */
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  /* Weather */
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const [wRes, gRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`),
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`)
        ]);
        const wData = await wRes.json();
        const gData = await gRes.json();
        setWeather({ temp: Math.round(wData.current_weather.temperature), city: gData.city || gData.locality || 'Río Cuarto', icon: '🌤️' });
      } catch (e) {}
    };
    fetchWeather(-33.15, -64.40);
  }, []);

  /* Scroll logic */
  useEffect(() => {
    const handleScroll = () => {
      const curY = window.scrollY;
      setMenuVis(curY < lastScrollY.current || curY < 100);
      lastScrollY.current = curY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const savePost = async (data) => {
    const now = Date.now();
    const payload = { 
      ...data, 
      timestamp: now,
      expiryTimestamp: now + (data.duration || 10) * 24 * 60 * 60 * 1000,
      approved: isAdmin ? (editPost ? (editPost.approved ?? true) : true) : false 
    };
    if (editPost) {
      await updateDoc(doc(db, POSTS_KEY, editPost.id), payload);
    } else {
      payload.likes = 0;
      await addDoc(collection(db, POSTS_KEY), payload);
      if (!isAdmin) {
        notifyAdmin('post', payload);
        setShowStatusModal(true);
        setTimeout(() => setShowStatusModal(false), 3000);
      }
    }
    setShowPost(false); setEditPost(null);
  };

  const saveJob = async (data) => {
    const now = Date.now();
    const payload = { 
      ...data, 
      timestamp: now,
      expiryTimestamp: now + (data.duration || 10) * 24 * 60 * 60 * 1000,
      approved: isAdmin ? (editJob ? (editJob.approved ?? true) : true) : false 
    };
    if (editJob) {
      await updateDoc(doc(db, JOBS_KEY, editJob.id), payload);
    } else {
      payload.likes = 0;
      await addDoc(collection(db, JOBS_KEY), payload);
      if (!isAdmin) {
        notifyAdmin('job', payload);
        setShowStatusModal(true);
        setTimeout(() => setShowStatusModal(false), 3000);
      }
    }
    setShowJob(false); setEditJob(null);
  };

  const approveItem = async (id, type) => {
    await updateDoc(doc(db, type === 'post' ? POSTS_KEY : JOBS_KEY, id), { approved: true });
  };

  const deleteItem = async () => {
    if (!confirm) return;
    await deleteDoc(doc(db, confirm.type === 'post' ? POSTS_KEY : JOBS_KEY, confirm.id));
    setConfirm(null);
  };

  const likeItem = async (id, type) => {
    const key = `liked_${id}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, 'true');
    await updateDoc(doc(db, type === 'post' ? POSTS_KEY : JOBS_KEY, id), { 
      likes: increment(1) 
    });
  };

  const handlePublish = () => {
    setEditPost(null);
    setShowChoice(true);
  };

  const filteredPosts = posts.filter(p => 
    (isAdmin || (p.approved && (!p.expiryTimestamp || p.expiryTimestamp > Date.now()))) && (
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const filteredJobs = jobs.filter(j => 
    (isAdmin || (j.approved && (!j.expiryTimestamp || j.expiryTimestamp > Date.now()))) && (
      j.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      j.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEnter = () => {
    setHasEntered(true);
    sessionStorage.setItem('hasEntered', 'true');
  };

  if (!hasEntered) return <Landing onEnter={handleEnter} />;

  return (
    <div className="min-h-screen bg-brand-bg font-sans selection:bg-brand-primary selection:text-white">
      {/* ── Top Utility Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[150] px-4 pt-4 pointer-events-none">
        <div className="max-w-[1200px] mx-auto flex justify-between sm:justify-end items-center gap-3">
          <div className="pointer-events-auto bg-brand-card/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg text-white text-[0.75rem] font-black flex items-center gap-2">
            {weather ? <span>{weather.icon} {weather.temp}°C · {weather.city}</span> : <span className="animate-pulse">...</span>}
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-[#0088CC] via-[#0077BB] to-[#0055AA] py-20 px-4 text-center overflow-hidden">
        <MovingDots />
        <div className="relative z-10 mb-8 flex justify-center mt-6">
          <div className="relative w-44 h-44 sm:w-60 sm:h-60 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl p-1 border border-white/30 overflow-hidden animate-pop-in">
            <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover scale-110" />
          </div>
        </div>
        <h1 className="font-serif text-5xl sm:text-7xl font-black text-white drop-shadow-2xl animate-fade-in-up">Santa Catalina</h1>
        <p className="text-white/90 text-sm sm:text-base font-black tracking-widest uppercase mt-4 animate-fade-in-up delay-100 flex justify-center gap-4 flex-wrap">
          <span>Holmberg</span>
          <span className="opacity-40">·</span>
          <span>Río Cuarto</span>
          <span className="opacity-40">·</span>
          <span>Compra Venta</span>
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-4 mx-4 sm:mx-auto max-w-[600px] z-[100] mt-[-35px]">
        <div className="flex bg-brand-card/90 backdrop-blur-xl rounded-[28px] shadow-2xl p-1.5 gap-1 border border-brand-primary/10 overflow-x-auto no-scrollbar">
          <button className={`flex-1 py-2.5 px-2 rounded-[22px] font-black transition-all duration-300 flex flex-col items-center justify-center gap-1 ${section === 'home' ? 'bg-brand-primary text-white shadow-lg scale-105' : 'text-brand-muted hover:bg-brand-primary/5'}`} onClick={() => setSection('home')}>
            <span className="text-xl">🏠</span>
            <span className="text-[10px] uppercase tracking-tighter">Inicio</span>
          </button>
          <button className={`flex-1 py-2.5 px-2 rounded-[22px] font-black transition-all duration-300 flex flex-col items-center justify-center gap-1 ${section === 'marketplace' ? 'bg-brand-primary text-white shadow-lg scale-105' : 'text-brand-muted hover:bg-brand-primary/5'}`} onClick={() => setSection('marketplace')}>
            <span className="text-xl">🏪</span>
            <span className="text-[10px] uppercase tracking-tighter">Ventas</span>
          </button>
          <button className={`flex-1 py-2.5 px-2 rounded-[22px] font-black transition-all duration-300 flex flex-col items-center justify-center gap-1 ${section === 'jobs' ? 'bg-brand-primary text-white shadow-lg scale-105' : 'text-brand-muted hover:bg-brand-primary/5'}`} onClick={() => setSection('jobs')}>
            <span className="text-xl">💼</span>
            <span className="text-[10px] uppercase tracking-tighter">Empleos</span>
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 mt-10 max-w-[640px] mx-auto">
        <div className="relative group">
          <input type="text" placeholder="busqueda en la plataforma" className="w-full p-4.5 pl-14 rounded-3xl bg-brand-card text-brand-dark shadow-sm border border-brand-primary/10 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-40 group-focus-within:opacity-100 transition-opacity">🔍</span>
          {searchTerm && <button className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary" onClick={() => setSearchTerm('')}>✕</button>}
        </div>
      </div>

      {/* ── Featured Ads ── */}
      {!searchTerm && <FeaturedAds isAdmin={isAdmin} />}

      {/* ── Main Content ── */}
      <main className="max-w-[1200px] mx-auto px-4 mt-12 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-pulse">
            <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4"></div>
            <p className="font-black text-brand-muted uppercase tracking-widest text-xs">Sincronizando...</p>
          </div>
        ) : (
          <div className="space-y-16">
            {(searchTerm || section === 'home' || section === 'marketplace') && (
              <section className="animate-fade-in-up">
                <div className="flex justify-between items-center gap-4 mb-8">
                  <div className="flex flex-col min-w-0">
                    <h2 className="font-serif text-2xl sm:text-3xl font-black text-brand-dark truncate">
                      {searchTerm ? 'Resultados' : section === 'home' ? 'Clasificados' : 'Productos'}
                    </h2>
                    <p className="text-brand-muted text-[10px] sm:text-xs font-black uppercase mt-1 tracking-wider opacity-70 truncate sm:whitespace-normal">Promociona gratis tus productos</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {searchTerm && <span className="hidden sm:block text-brand-muted text-[10px] font-bold uppercase tracking-widest">{filteredPosts.length} anuncios</span>}
                    <button 
                      onClick={() => { setEditPost(null); setShowPost(true); }}
                      className="bg-brand-primary text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
                    >
                      <span className="text-lg">＋</span> Publicar
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchTerm || section === 'marketplace' || isAdmin || section === 'home' ? filteredPosts : filteredPosts).map(p => (
                    <PostCard key={p.id} post={p} isAdmin={isAdmin} onDelete={() => setConfirm({id: p.id, type: 'post'})} onEdit={() => {setEditPost(p); setShowPost(true);}} onApprove={() => approveItem(p.id, 'post')} onLike={() => likeItem(p.id, 'post')} />
                  ))}
                  {(searchTerm ? filteredPosts : posts).length === 0 && (
                    <p className="col-span-full text-center py-10 text-brand-muted font-bold opacity-50 italic">No hay productos disponibles.</p>
                  )}
                </div>
              </section>
            )}

            {(searchTerm || section === 'home' || section === 'jobs') && (
              <section className="animate-fade-in-up delay-100">
                <div className="flex justify-between items-center gap-4 mb-8 border-t border-brand-primary/5 pt-12">
                  <div className="flex flex-col min-w-0">
                    <h2 className="font-serif text-2xl sm:text-3xl font-black text-brand-dark truncate">
                      {searchTerm ? 'Empleos' : section === 'home' ? 'Bolsa Trabajo' : 'Ofertas'}
                    </h2>
                    <p className="text-brand-muted text-[10px] sm:text-xs font-black uppercase mt-1 tracking-wider opacity-70 truncate sm:whitespace-normal">Promociona gratis tus ofertas</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {searchTerm && <span className="hidden sm:block text-brand-muted text-[10px] font-bold uppercase tracking-widest">{filteredJobs.length} vacantes</span>}
                    <button 
                      onClick={() => { setEditPost(null); setShowJob(true); }}
                      className="bg-brand-primary text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
                    >
                      <span className="text-lg">＋</span> Publicar
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(searchTerm || section === 'jobs' || isAdmin || section === 'home' ? filteredJobs : filteredJobs).map(j => (
                    <JobCard key={j.id} job={j} isAdmin={isAdmin} onDelete={() => setConfirm({id: j.id, type: 'job'})} onEdit={() => {setEditPost(j); setShowJob(true);}} onApprove={() => approveItem(j.id, 'job')} onLike={() => likeItem(j.id, 'job')} />
                  ))}
                  {(searchTerm ? filteredJobs : jobs).length === 0 && (
                    <p className="col-span-full text-center py-10 text-brand-muted font-bold opacity-50 italic">No hay ofertas laborales disponibles.</p>
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* ── Featured Ads Contact ── */}
      <AdContactForm />

      {/* ── Floating Menu ── */}
      <div className={`fixed bottom-0 left-0 right-0 z-[200] transition-all duration-500 pb-safe ${menuVis ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="mx-auto max-w-[500px] mb-6 px-4">
          <div className="flex items-center justify-around bg-brand-card/95 backdrop-blur-3xl rounded-[32px] p-2.5 shadow-[0_-15px_50px_rgba(0,0,0,0.2)] border border-brand-primary/10">
            <button className={`flex flex-col items-center gap-1 py-2 px-1 min-w-[65px] rounded-2xl transition-all duration-300 ${section === 'home' ? 'text-brand-primary bg-brand-primary/10 -translate-y-2 scale-110 shadow-lg' : 'text-brand-muted'}`} onClick={() => setSection('home')}>
              <span className="text-xl sm:text-2xl">🏠</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">Inicio</span>
            </button>
            <button className={`flex flex-col items-center gap-1 py-2 px-1 min-w-[65px] rounded-2xl transition-all duration-300 ${section === 'marketplace' ? 'text-brand-primary bg-brand-primary/10 -translate-y-2 scale-110 shadow-lg' : 'text-brand-muted'}`} onClick={() => setSection('marketplace')}>
              <span className="text-xl sm:text-2xl">🏪</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">Ventas</span>
            </button>
            
            <button className="flex flex-col items-center justify-center -mt-12 w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full text-white shadow-2xl active:scale-90 hover:scale-110 transition-all duration-300 border-4 border-brand-bg group" onClick={handlePublish}>
              <span className="text-3xl font-bold group-hover:rotate-90 transition-transform">＋</span>
            </button>

            <button className={`flex flex-col items-center gap-1 py-2 px-1 min-w-[65px] rounded-2xl transition-all duration-300 ${section === 'jobs' ? 'text-brand-primary bg-brand-primary/10 -translate-y-2 scale-110 shadow-lg' : 'text-brand-muted'}`} onClick={() => setSection('jobs')}>
              <span className="text-xl sm:text-2xl">💼</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">Empleos</span>
            </button>
            <button className={`flex flex-col items-center gap-1 py-2 px-1 min-w-[65px] rounded-2xl transition-all duration-300 ${isAdmin ? 'text-brand-primary bg-brand-primary/10 -translate-y-2 scale-110 shadow-lg' : 'text-brand-muted'}`} onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)}>
              <span className="text-xl sm:text-2xl">{isAdmin ? '🔓' : '⚙️'}</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showPost && <PostForm onSave={savePost} onClose={() => { setShowPost(false); setEditPost(null); }} initialData={editPost} />}
      {showJob  && <JobForm  onSave={saveJob}  onClose={() => { setShowJob(false);  setEditPost(null); }} initialData={editPost} />}
      {showLogin && <AdminLogin onLogin={() => setIsAdmin(true)} onClose={() => setShowLogin(false)} />}
      {confirm && <ConfirmDialog title="Confirmar" msg="¿Borrar?" onOk={deleteItem} onCancel={() => setConfirm(null)} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      
      <a href={WA_GROUP} target="_blank" className="fixed bottom-[110px] right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl z-[190] animate-wa-pulse hover:scale-110 transition-all">
        <div className="scale-125">{WA_SVG}</div>
      </a>

      {/* ── Final Info Section (Antigravity Style) ── */}
      <section className="max-w-[1000px] mx-auto px-6 mb-32">
        <div className="animate-float bg-brand-card/30 backdrop-blur-3xl border border-brand-primary/20 p-10 sm:p-16 rounded-[56px] text-center shadow-[0_30px_90px_rgba(0,0,0,0.15)] relative overflow-hidden">
          {/* Antigravity Points */}
          <MovingDots color="#ffffff" connectionColor="rgba(255, 255, 255, 0.4)" />
          
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50" />
          
          <span className="inline-block bg-brand-primary/20 text-brand-primary px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.4em] mb-6 border border-brand-primary/10">Información Importante</span>
          
          <h2 className="font-serif text-2xl sm:text-5xl font-black text-brand-dark leading-tight mb-4 tracking-tighter max-w-[700px] mx-auto">
            <span className="text-[#00CCFF]">Publicaciones</span> gratuitas: <span className="text-brand-primary underline decoration-brand-primary/20 decoration-4 underline-offset-4">10 días</span>
          </h2>
          
          <div className="flex flex-col items-center justify-center mt-8 pt-8 border-t border-brand-primary/10">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 bg-brand-dark text-white px-8 sm:px-12 py-6 sm:py-8 rounded-[40px] shadow-2xl border border-white/5 transition-all duration-500 hover:shadow-brand-primary/20">
              <div className="flex items-center gap-5">
                <span className="text-4xl sm:text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float">💎</span>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00CCFF] mb-1 drop-shadow-sm">Suscripción</p>
                  <p className="font-serif text-2xl sm:text-3xl font-black leading-tight bg-gradient-to-br from-white via-white to-[#00CCFF]/50 bg-clip-text text-transparent">
                    <span className="text-[#00CCFF]">Publicaciones</span><br />
                    <span className="text-brand-primary">Premium</span>
                  </p>
                </div>
              </div>
              
              <div className="hidden sm:block w-px h-16 bg-white/10" />
              
              <div className="text-center sm:text-left">
                <div className="font-serif text-5xl sm:text-7xl font-black text-brand-primary tracking-tighter">
                  $40.000
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0000FF] mt-1">Pago Mensual</p>
              </div>
            </div>

            {/* New Promo Line Outside */}
            <div className="mt-12 animate-fade-in-up">
              <h3 className="font-serif text-xl sm:text-3xl font-black text-brand-dark leading-tight tracking-tighter">
                🔥 Promoción 2x1 Publicidad <span className="text-[#00CCFF]">Mayo / Junio</span>: <span className="text-brand-primary underline decoration-brand-primary/20 decoration-4 underline-offset-4 tracking-normal">$60.000</span>
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer onShowTerms={() => setShowTerms(true)} />
      {/* Modal de Elección de Publicación */}
      {showChoice && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-brand-dark/95 backdrop-blur-2xl animate-fade-in">
          <div className="bg-brand-card w-full max-w-[480px] p-10 rounded-[56px] shadow-2xl border border-white/10 relative animate-pop-in">
            <button onClick={() => setShowChoice(false)} className="absolute top-8 right-8 text-4xl text-brand-muted hover:text-brand-primary transition-all">&times;</button>
            
            <div className="text-center mb-10">
              <span className="inline-block bg-brand-primary/20 text-brand-primary px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">Nueva Publicación</span>
              <h3 className="font-serif text-3xl sm:text-4xl font-black text-brand-dark leading-tight">¿Qué deseas publicar hoy?</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-5">
              <button 
                onClick={() => { setShowPost(true); setShowChoice(false); }}
                className="group flex items-center gap-6 p-6 rounded-[32px] bg-brand-bg border-2 border-transparent hover:border-brand-primary hover:bg-white transition-all text-left shadow-lg hover:shadow-brand-primary/10"
              >
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🏪</div>
                <div>
                  <h4 className="font-black text-brand-dark text-lg leading-tight mb-1 uppercase tracking-tight">Clasificado de Venta</h4>
                  <p className="text-brand-muted text-[0.8rem] font-bold leading-snug">Artículos, productos, servicios o inmuebles.</p>
                </div>
              </button>

              <button 
                onClick={() => { setShowJob(true); setShowChoice(false); }}
                className="group flex items-center gap-6 p-6 rounded-[32px] bg-brand-bg border-2 border-transparent hover:border-brand-secondary hover:bg-white transition-all text-left shadow-lg hover:shadow-brand-secondary/10"
              >
                <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">💼</div>
                <div>
                  <h4 className="font-black text-brand-dark text-lg leading-tight mb-1 uppercase tracking-tight">Oferta / Demanda</h4>
                  <p className="text-brand-muted text-[0.8rem] font-bold leading-snug">Búsqueda de empleo u ofrecimiento de servicios.</p>
                </div>
              </button>
            </div>
            
            <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted opacity-40">Santa Catalina · Holmberg te conecta</p>
          </div>
        </div>
      )}

      {/* Modal de Proceso de Publicación */}
      {showStatusModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-brand-dark/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-brand-card w-full max-w-[450px] p-10 rounded-[48px] shadow-2xl border border-brand-primary/20 text-center animate-pop-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary animate-wa-pulse" />
            
            <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
            </div>
            
            <h3 className="font-serif text-3xl font-black text-brand-dark mb-4 leading-tight">Publicación en proceso</h3>
            <p className="text-brand-muted font-bold leading-relaxed mb-6">
              Chequeo para su autorización,<br /> 
              <span className="text-brand-primary">estará pronto visible</span>
            </p>
            
            <div className="flex items-center justify-center gap-2 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="animate-pulse">●</span>
              <span>Procesando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

