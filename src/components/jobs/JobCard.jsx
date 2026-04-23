import React from 'react';
import { timeAgo, formatDate, WA_SVG } from '../../utils/helpers';

export default function JobCard({ job, isAdmin, onDelete, onEdit, onApprove, onLike, onClick }) {
  const wa  = job.whatsapp?.replace(/\D/g, '');
  const off = job.type === 'offer';
  return (
    <div 
      onClick={onClick}
      className={`bg-brand-card w-full rounded-[24px] shadow-sm hover:shadow-mui overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1.5 animate-fade-in-up cursor-pointer ${!job.approved && isAdmin ? 'ring-2 ring-brand-primary/20' : ''}`}
    >
      {job.photo ? (
        <div className="relative pb-[56%] overflow-hidden bg-brand-bg/50">
          <img src={job.photo} alt="empleo" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            <span className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[0.55rem] sm:text-[0.62rem] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 ${off ? 'bg-[#059669]/80 text-white' : 'bg-[#7C3AED]/80 text-white'}`}>
              {off ? '💼 Oferta' : '🔍 Busco'}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative pb-[40%] bg-brand-bg/30 flex items-center justify-center border-b border-brand-primary/5">
          <span className="text-brand-muted/40 text-[0.65rem] font-black uppercase tracking-widest px-4 text-center">
            sin fotografía aportada por el usuario
          </span>
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            <span className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[0.55rem] sm:text-[0.62rem] font-black uppercase tracking-wider backdrop-blur-md border border-brand-primary/10 ${off ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#EDE9FE] text-[#7C3AED]'}`}>
              {off ? '💼 Oferta' : '🔍 Busco'}
            </span>
          </div>
        </div>
      )}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start flex-wrap gap-1.5 mb-2.5">

          {isAdmin && !job.approved && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[0.74rem] font-extrabold uppercase tracking-wider shadow-sm">
              Pendiente
            </span>
          )}
          <span className="text-brand-muted text-[0.68rem] font-bold ml-auto">{timeAgo(job.timestamp)} — {formatDate(job.timestamp)}</span>
        </div>
        
        <h3 className="font-serif text-[0.85rem] sm:text-[1rem] font-black text-brand-dark mb-1 leading-tight line-clamp-1">{job.title}</h3>
        <p className="text-brand-muted text-[0.7rem] sm:text-[0.8rem] mb-3 leading-relaxed flex-1 line-clamp-2">{job.description}</p>
        
        <div className="flex flex-col gap-2 mt-auto" onClick={e => e.stopPropagation()}>
          <div className="flex gap-2 items-center">
            {wa && (
              <a 
                href={`https://wa.me/54${wa}`} 
                target="_blank" 
                className={`flex-1 flex items-center justify-center gap-1 py-2 sm:py-2.5 px-1.5 sm:px-4 rounded-[12px] sm:rounded-[16px] text-[0.65rem] sm:text-[0.85rem] font-black shadow-lg transition-all btn-mui ${off ? 'bg-[#25D366] text-white animate-wa-pulse' : 'bg-brand-primary text-white'}`}
              >
                {WA_SVG} <span>{off ? 'Postularme' : 'Contactar'}</span>
              </a>
            )}
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLike();
              }}
              className={`h-9 sm:h-11 px-2 sm:px-4 flex items-center justify-center gap-1 rounded-[12px] sm:rounded-[16px] transition-all active:scale-90 shrink-0 min-w-[50px] ${localStorage.getItem(`liked_${job.id}`) ? 'bg-red-50 text-red-500 shadow-inner' : 'bg-brand-bg text-brand-muted hover:text-red-500'}`}
            >
              <span className={`text-base sm:text-xl transition-transform ${localStorage.getItem(`liked_${job.id}`) ? 'scale-110' : 'group-hover:scale-110'}`}>❤️</span>
              <span className="font-black text-[0.75rem] sm:text-[0.9rem]">{job.likes || 0}</span>
            </button>
          </div>

          {isAdmin && (
            <div className="flex gap-2 pt-2 border-t border-brand-primary/10 mt-1">
              {!job.approved && (
                <button className="flex-1 h-9 sm:h-10 flex items-center justify-center rounded-[12px] sm:rounded-[14px] bg-green-500 text-white hover:bg-green-600 btn-mui shadow-lg text-[0.8rem]" onClick={(e) => { e.stopPropagation(); onApprove(job); }} title="Aprobar">✅ Aprobar</button>
              )}
              <button className="flex-1 h-9 sm:h-10 flex items-center justify-center rounded-[12px] sm:rounded-[14px] bg-brand-bg text-brand-dark hover:bg-brand-accent/50 btn-mui text-[0.8rem]" onClick={(e) => { e.stopPropagation(); onEdit(job); }}>✏️ Editar</button>
              <button className="flex-1 h-9 sm:h-10 flex items-center justify-center rounded-[12px] sm:rounded-[14px] bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2] btn-mui text-[0.8rem]" onClick={(e) => { e.stopPropagation(); onDelete(job); }}>🗑️ Borrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
