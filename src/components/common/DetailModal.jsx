import React, { useEffect } from 'react';
import { timeAgo, formatDate, WA_SVG } from '../../utils/helpers';

export default function DetailModal({ item, type, onClose, onLike }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!item) return null;

  const photos = item.photos || (item.photo ? [item.photo] : []);
  const wa = item.whatsapp?.replace(/\D/g, '');
  const isJob = type === 'job';
  const off = isJob && item.type === 'offer';

  return (
    <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-xl z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-brand-card w-full sm:max-w-[800px] h-[92vh] sm:h-auto sm:max-h-[90vh] rounded-t-[40px] sm:rounded-[40px] shadow-2xl border-t sm:border border-white/10 overflow-hidden flex flex-col md:flex-row animate-sheet-up sm:animate-pop-in">
        
        {/* Close Button Mobile */}
        <button className="absolute top-6 right-6 z-[1010] md:hidden w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center font-bold" onClick={onClose}>✕</button>

        {/* Media Section */}
        <div className="w-full md:w-1/2 h-[280px] sm:h-[400px] md:h-auto bg-brand-bg relative shrink-0">
          {item.photo ? (
            <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center bg-brand-primary/5">
              <span className="text-6xl grayscale opacity-20">{isJob ? '💼' : '🏪'}</span>
              <p className="text-brand-muted/40 text-[0.65rem] font-black uppercase tracking-widest px-4">sin fotografía aportada por el usuario</p>
            </div>
          )}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <div className="bg-brand-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[0.65rem] font-black uppercase tracking-widest shadow-lg">
              {isJob ? (off ? 'Oferta Laboral' : 'Busqueda Laboral') : 'Clasificado'}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto no-scrollbar flex flex-col relative">
          {/* Close Button Desktop */}
          <button className="hidden md:flex absolute top-8 right-8 w-10 h-10 rounded-full bg-brand-bg text-brand-muted hover:text-brand-dark transition-all items-center justify-center font-bold" onClick={onClose}>✕</button>

          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
               <span className="text-brand-muted text-[0.6rem] sm:text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-60">Publicado {timeAgo(item.timestamp)}</span>
               <span className="text-brand-muted/20 text-xs">|</span>
               <span className="text-brand-muted text-[0.6rem] sm:text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-60">{formatDate(item.timestamp)}</span>
            </div>
            
            <h2 className="font-serif text-2xl sm:text-4xl font-black text-brand-dark leading-tight mb-4 tracking-tighter">{item.title}</h2>
            
            {!isJob && (
              <div className="inline-block bg-brand-primary/10 px-4 py-2 rounded-2xl">
                <p className="font-black text-brand-primary text-xl sm:text-2xl tracking-tighter">
                  {Number(item.price) === 0 ? 'Consultar' : `$${Number(item.price).toLocaleString('es-AR')}`}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-[0.65rem] sm:text-[0.7rem] font-black text-brand-muted uppercase tracking-[0.3em] mb-3">Descripción Detallada</h3>
            <p className="text-brand-dark text-[0.9rem] sm:text-[0.95rem] leading-relaxed mb-8 font-medium whitespace-pre-wrap">{item.description}</p>

            {(item.email || item.address) && (
              <div className="bg-brand-bg/50 border border-brand-primary/5 rounded-[24px] p-5 sm:p-6 space-y-3 mb-8">
                {item.email && (
                  <div className="flex items-center gap-4">
                    <span className="text-xl">📧</span>
                    <div>
                      <p className="text-[0.55rem] sm:text-[0.6rem] font-black text-brand-muted uppercase tracking-widest">Email de contacto</p>
                      <p className="text-brand-primary font-black text-xs sm:text-sm">{item.email}</p>
                    </div>
                  </div>
                )}
                {item.address && (
                  <div className="flex items-center gap-4">
                    <span className="text-xl">📍</span>
                    <div>
                      <p className="text-[0.55rem] sm:text-[0.6rem] font-black text-brand-muted uppercase tracking-widest">Ubicación / Dirección</p>
                      <p className="text-brand-dark font-black text-xs sm:text-sm">{item.address}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 sm:gap-4 mt-auto pt-4 border-t border-brand-primary/5">
            {wa && (
              <a 
                href={`https://wa.me/54${wa}`} 
                target="_blank" 
                className="flex-[2] flex items-center justify-center gap-2 sm:gap-3 bg-[#25D366] text-white py-3.5 sm:py-4 rounded-[18px] sm:rounded-[20px] font-black shadow-xl hover:shadow-[#25D366]/30 active:scale-95 transition-all text-[0.75rem] sm:text-sm uppercase tracking-widest animate-wa-pulse"
              >
                {WA_SVG} <span>{isJob ? (off ? 'Postularme' : 'Contactar') : 'Consultar'}</span>
              </a>
            )}
            <button 
              onClick={(e) => {
                e.preventDefault();
                onLike();
              }}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 rounded-[18px] sm:rounded-[20px] transition-all active:scale-90 border-2 ${localStorage.getItem(`liked_${item.id}`) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-brand-bg border-brand-primary/5 text-brand-muted hover:text-red-500'}`}
            >
              <span className="text-xl sm:text-2xl">❤️</span>
              <span className="font-black text-base sm:text-lg">{item.likes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
