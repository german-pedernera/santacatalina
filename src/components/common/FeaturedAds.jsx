import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { WA_SVG, resizeImage } from '../../utils/helpers';

export default function FeaturedAds({ isAdmin }) {
  const [ads, setAds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ 
    title: '', name: '', whatsapp: '', description: '', image: '', images: [], location: '',
    facebook: '', instagram: '', tiktok: '', x: '', website: '' 
  });
  const [loading, setLoading] = useState(false);
  const [currentIdxs, setCurrentIdxs] = useState({}); // Track current index for each ad's carousel

  useEffect(() => {
    const q = query(collection(db, 'featured_ads'));
    const unsub = onSnapshot(q, (snap) => {
      const adsList = snap.docs.map(d => ({ 
        ...d.data(), 
        id: d.id,
        images: d.data().images || (d.data().image ? [d.data().image] : []),
        facebook: d.data().facebook || '',
        instagram: d.data().instagram || '',
        tiktok: d.data().tiktok || '',
        x: d.data().x || '',
        website: d.data().website || ''
      }));
      setAds(adsList);
      
      // Initialize indices
      const indices = {};
      adsList.forEach(ad => { indices[ad.id] = 0; });
      setCurrentIdxs(indices);
      
      if (adsList.length === 0) {
        addDoc(collection(db, 'featured_ads'), {
          title: 'Desarrollo web para tu negocio',
          name: 'Desarrollo Code Web </>',
          whatsapp: '0111569534244',
          description: 'Impulsamos tu marca con sitios web modernos, rápidos y autogestionables. ¡Lleva tu negocio al siguiente nivel digital!',
          image: '/featured/web-dev.png',
          images: ['/featured/web-dev.png'],
          location: 'https://maps.google.com'
        });
      }
    });
    return unsub;
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.whatsapp) return;
    setLoading(true);
    
    const payload = { ...form };
    if (editingId) {
      await updateDoc(doc(db, 'featured_ads', editingId), payload);
    } else {
      await addDoc(collection(db, 'featured_ads'), payload);
    }
    
    resetForm();
    setShowForm(false);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ 
      title: '', name: '', whatsapp: '', description: '', image: '', images: [], location: '',
      facebook: '', instagram: '', tiktok: '', x: '', website: '' 
    });
    setEditingId(null);
  };

  const handleEdit = (ad) => {
    setForm({ 
      title: ad.title, 
      name: ad.name, 
      whatsapp: ad.whatsapp, 
      description: ad.description || '', 
      image: ad.image || '',
      images: ad.images || [],
      location: ad.location || '',
      facebook: ad.facebook || '',
      instagram: ad.instagram || '',
      tiktok: ad.tiktok || '',
      x: ad.x || '',
      website: ad.website || ''
    });
    setEditingId(ad.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este anuncio destacado?')) {
      await deleteDoc(doc(db, 'featured_ads', id));
    }
  };

  const handleImg = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await resizeImage(file);
      if (form.images.length >= 5) return alert('Máximo 5 fotos');
      const newImages = [...form.images, base64];
      setForm({ ...form, images: newImages, image: newImages[0] });
    }
  };

  const removePhoto = (idx) => {
    const newImgs = form.images.filter((_, i) => i !== idx);
    setForm({ ...form, images: newImgs, image: newImgs[0] || '' });
  };

  const [showInfoModal, setShowInfoModal] = useState(false);

  const nextImg = (adId, max) => {
    setCurrentIdxs(prev => ({ ...prev, [adId]: (prev[adId] + 1) % max }));
  };
  const prevImg = (adId, max) => {
    setCurrentIdxs(prev => ({ ...prev, [adId]: (prev[adId] - 1 + max) % max }));
  };

  return (
    <section className="px-4 py-16 max-w-[1400px] mx-auto animate-fade-in-up">
      <div className="flex justify-between items-end mb-12 border-b-2 border-brand-primary/10 pb-6">
        <div className="flex flex-col">
          <span className="text-brand-primary font-black uppercase text-[0.65rem] tracking-[0.4em] mb-2">Recomendados</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-black text-brand-dark tracking-tighter">Publicidad Destacada Premium</h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-brand-muted text-sm font-bold opacity-70">Los mejores servicios locales en un solo lugar</p>
            <button 
              onClick={() => setShowInfoModal(true)}
              className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-sm"
            >
              ¿Cómo aparecer aquí?
            </button>
          </div>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-brand-primary text-white px-8 py-4 rounded-[24px] font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            ＋ Nuevo Anuncio
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-10">
        {ads.map(ad => {
          const imgs = ad.images || (ad.image ? [ad.image] : []);
          const cur = currentIdxs[ad.id] || 0;
          return (
            <div key={ad.id} className="relative bg-brand-card rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-brand-primary/5 flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-700">
              {/* Image Section */}
              <div className="md:w-1/2 h-[300px] md:h-auto relative overflow-hidden bg-brand-bg/30">
                {imgs.length > 0 ? (
                  <>
                    <img src={imgs[cur]} alt={ad.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    {imgs.length > 1 && (
                      <>
                        <button onClick={() => prevImg(ad.id, imgs.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/40">❮</button>
                        <button onClick={() => nextImg(ad.id, imgs.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/40">❯</button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                          {imgs.map((_, i) => (
                            <div key={i} className={`w-1 h-1 rounded-full transition-all ${i === cur ? 'bg-white w-3' : 'bg-white/40'}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-brand-primary/5 flex items-center justify-center text-6xl opacity-30">🚀</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-brand-card/10 md:to-brand-card/20" />
                
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                  <span className="bg-brand-primary/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Premium</span>
                  <button 
                    onClick={() => setShowInfoModal(true)}
                    className="bg-white/90 backdrop-blur-md text-brand-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-lg hover:scale-110 transition-all"
                    title="¿Cómo anunciar?"
                  >
                    ?
                  </button>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between relative">
                {isAdmin && (
                  <div className="absolute top-6 right-6 flex gap-2 z-10">
                    <button onClick={() => handleEdit(ad)} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-lg">✏️</button>
                    <button onClick={() => handleDelete(ad.id)} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg">✕</button>
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-2xl">✨</div>
                    <p className="text-brand-primary font-black text-xs uppercase tracking-[0.2em]">{ad.name}</p>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-black text-brand-dark leading-tight mb-4 tracking-tighter">{ad.title}</h3>
                  <p className="text-brand-muted text-[0.95rem] leading-relaxed mb-6 opacity-90">{ad.description}</p>
                  
                  {/* Social Media Row */}
                  {(ad.facebook || ad.instagram || ad.tiktok || ad.x || ad.website) && (
                    <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
                      {ad.website && (
                        <a href={ad.website.startsWith('http') ? ad.website : `https://${ad.website}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-xl hover:bg-brand-primary hover:text-white transition-all shadow-sm" title="Sitio Web">🌐</a>
                      )}
                      {ad.facebook && (
                        <a href={ad.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#1877F2]/10 rounded-full flex items-center justify-center text-xl hover:bg-[#1877F2] hover:text-white transition-all shadow-sm" title="Facebook">📘</a>
                      )}
                      {ad.instagram && (
                        <a href={ad.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#E4405F]/10 rounded-full flex items-center justify-center text-xl hover:bg-[#E4405F] hover:text-white transition-all shadow-sm" title="Instagram">📸</a>
                      )}
                      {ad.tiktok && (
                        <a href={ad.tiktok} target="_blank" rel="noreferrer" className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center text-xl hover:bg-black hover:text-white transition-all shadow-sm" title="TikTok">🎵</a>
                      )}
                      {ad.x && (
                        <a href={ad.x} target="_blank" rel="noreferrer" className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center text-lg hover:bg-black hover:text-white transition-all shadow-sm font-black" title="X">X</a>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3">
                  <a 
                    href={`https://wa.me/54${ad.whatsapp.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-[24px] font-black text-[1rem] shadow-xl hover:shadow-[#25D366]/40 active:scale-95 transition-all"
                  >
                    {WA_SVG} <span>Contactar Ahora</span>
                  </a>
                  
                  {ad.location && (
                    <a 
                      href={ad.location} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-3 bg-brand-bg text-brand-primary border-2 border-brand-primary/10 py-4 rounded-[24px] font-black text-[1rem] hover:bg-brand-primary/5 transition-all"
                    >
                      <span>📍 Ver Ubicación</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Marketing Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-2 sm:p-4 bg-brand-dark/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-brand-card w-[95%] max-w-[500px] p-5 sm:p-12 rounded-[40px] sm:rounded-[56px] shadow-2xl border border-white/10 relative overflow-hidden animate-pop-in max-h-[95vh] overflow-y-auto no-scrollbar">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary animate-wa-pulse" />
            
            <button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 text-3xl text-brand-muted hover:text-brand-primary transition-all">&times;</button>
            
            <div className="text-center">
              <span className="inline-block bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-6 mt-4">Impulsa tu Marca</span>
              <h3 className="font-serif text-xl sm:text-4xl font-black text-brand-dark mb-4 sm:mb-8 leading-tight px-2">¿Quieres que tu negocio esté aquí?</h3>
              
              <div className="space-y-4 sm:space-y-6 text-left mb-8 sm:mb-10">
                {[
                  { icon: '🎯', title: 'Posicionamiento', text: 'Tu marca será lo primero que vean nuestros usuarios.' },
                  { icon: '📱', title: 'WhatsApp Directo', text: 'Contacto inmediato con tus clientes potenciales.' },
                  { icon: '⭐', title: 'Exposición 24/7', text: 'Visible las 24hs durante los 30 días del mes.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3.5 sm:p-4 rounded-[24px] bg-brand-bg/50 border border-brand-primary/5">
                    <span className="text-2xl sm:text-3xl">{item.icon}</span>
                    <div>
                      <h4 className="font-black text-brand-dark text-[0.7rem] sm:text-sm uppercase tracking-wider mb-0.5">{item.title}</h4>
                      <p className="text-brand-muted text-[0.65rem] sm:text-xs font-medium leading-tight">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-brand-primary p-5 sm:p-8 rounded-[32px] text-white shadow-xl shadow-brand-primary/20">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2 text-white">Inversión Mensual</p>
                <p className="font-serif text-3xl sm:text-5xl font-black mb-4 sm:mb-6 tracking-tight">$30.000</p>
                <a 
                  href="https://wa.me/543584123456" // Reemplazar con el WhatsApp real del admin si es necesario
                  target="_blank"
                  className="block w-full bg-white text-brand-primary py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-black/10"
                >
                  Contratar Publicidad Ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 sm:p-6 bg-brand-dark/60 backdrop-blur-md animate-fade-in">
          <div className="bg-brand-card w-full max-w-[700px] p-8 sm:p-12 rounded-[40px] shadow-2xl border border-brand-primary/10 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-serif text-3xl font-black text-brand-dark leading-tight">{editingId ? 'Editar Anuncio' : 'Nuevo Anuncio Destacado'}</h3>
                <p className="text-brand-muted text-xs font-black uppercase tracking-widest mt-2">Configuración de Publicidad Premium</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-3xl text-brand-muted hover:text-brand-primary">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-primary ml-2">Título</label>
                  <input type="text" placeholder="Ej: Diseño de Sitios Web" className="auth-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-primary ml-2">Negocio</label>
                  <input type="text" placeholder="Ej: Estudio Digital" className="auth-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-primary ml-2">WhatsApp (Sin 0 ni 15)</label>
                  <input type="tel" placeholder="Ej: 3584123456" className="auth-input" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-primary ml-2">Link Google Maps (Opcional)</label>
                  <input type="url" placeholder="https://goo.gl/maps/..." className="auth-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-brand-primary/5 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-primary ml-2">Facebook (Opcional)</label>
                  <input type="url" placeholder="Link" className="auth-input text-xs" value={form.facebook} onChange={e => setForm({...form, facebook: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-primary ml-2">Instagram (Opcional)</label>
                  <input type="url" placeholder="Link de perfil" className="auth-input text-xs" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-primary ml-2">TikTok (Opcional)</label>
                  <input type="url" placeholder="Link" className="auth-input text-xs" value={form.tiktok} onChange={e => setForm({...form, tiktok: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-primary ml-2">X / Twitter (Opcional)</label>
                  <input type="url" placeholder="Link" className="auth-input text-xs" value={form.x} onChange={e => setForm({...form, x: e.target.value})} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-brand-primary ml-2">Sitio Web (Opcional)</label>
                  <input type="url" placeholder="https://tu-sitio.com" className="auth-input text-xs" value={form.website} onChange={e => setForm({...form, website: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-brand-primary ml-2">Descripción</label>
                <textarea placeholder="Cuéntale a los usuarios por qué elegirte..." className="auth-input min-h-[120px] py-4 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-brand-primary ml-2">Imágenes (Hasta 5)</label>
                
                {form.images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative shrink-0">
                        <img src={img} className="w-24 h-24 object-cover rounded-2xl border border-brand-primary/10 shadow-lg" alt="preview" />
                        <button type="button" onClick={() => removePhoto(i)} className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs font-bold shadow-xl flex items-center justify-center hover:bg-red-600">✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative group">
                  <input type="file" accept="image/*" onChange={handleImg} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="w-full h-40 rounded-3xl border-2 border-dashed border-brand-primary/20 bg-brand-bg flex flex-col items-center justify-center gap-3 transition-all group-hover:border-brand-primary/40 group-hover:bg-brand-primary/5">
                    <span className="text-4xl transition-transform group-hover:scale-110">📸</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">
                      {form.images.length === 0 ? 'Subir imagen principal' : `Añadir otra imagen (${form.images.length}/5)`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 p-5 rounded-[24px] bg-brand-bg text-brand-muted font-black uppercase text-xs tracking-widest">Cancelar</button>
                <button type="submit" disabled={loading} className="flex-[2] p-5 rounded-[24px] bg-brand-primary text-white font-black shadow-xl uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
                  {loading ? 'Guardando...' : (editingId ? 'Actualizar Anuncio' : 'Publicar Anuncio')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
