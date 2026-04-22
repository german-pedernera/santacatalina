import React from 'react';
import { timeAgo, formatDate, WA_SVG } from '../../utils/helpers';

export default function JobCard({ job, isAdmin, onDelete, onEdit, onApprove }) {
  const wa  = job.whatsapp?.replace(/\D/g, '');
  const off = job.type === 'offer';
  return (
    <div className={`bg-brand-card rounded-[24px] shadow-sm hover:shadow-mui overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1.5 border-l-4 ${off ? 'border-l-[#059669]' : 'border-l-[#7C3AED]'} animate-fade-in-up ${!job.approved && isAdmin ? 'ring-2 ring-brand-primary/20' : ''}`}>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start flex-wrap gap-1.5 mb-2.5">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.74rem] font-extrabold ${off ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#EDE9FE] text-[#7C3AED]'}`}>
              {off ? '💼 OFERTA' : '🔍 BUSCO'}
            </span>
            {isAdmin && !job.approved && (
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[0.74rem] font-extrabold uppercase tracking-wider shadow-sm">
                Pendiente
              </span>
            )}
          </div>
          <span className="text-brand-muted text-[0.68rem] font-bold">{timeAgo(job.timestamp)} — {formatDate(job.timestamp)}</span>
        </div>
        
        <h3 className="font-serif text-[1.05rem] font-black text-brand-dark mb-1 leading-tight">{job.title}</h3>
        
        {(job.email || job.address) && (
          <div className="flex flex-col gap-1 mb-2">
            {job.email && <p className="text-brand-primary text-[0.75rem] font-black flex items-center gap-1.5">📧 <span className="opacity-80">{job.email}</span></p>}
            {job.address && <p className="text-brand-muted text-[0.75rem] font-black flex items-center gap-1.5">📍 <span className="opacity-80">{job.address}</span></p>}
          </div>
        )}

        <p className="text-brand-muted text-[0.82rem] line-clamp-4 mb-4 leading-relaxed flex-1">{job.description}</p>
        
        <div className="flex gap-2 items-center mt-auto">
          {wa && (
            <a 
              href={`https://wa.me/54${wa}`} 
              target="_blank" 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[16px] text-[0.85rem] font-black shadow-lg transition-all btn-mui ${off ? 'bg-[#25D366] text-white animate-wa-pulse' : 'bg-brand-primary text-white'}`}
            >
              {WA_SVG} <span>{off ? 'Postularme' : 'Contactar'}</span>
            </a>
          )}
          <button 
            onClick={(e) => {
              e.preventDefault();
              onLike();
            }}
            className={`h-11 px-4 flex items-center justify-center gap-2 rounded-[16px] transition-all active:scale-90 ${localStorage.getItem(`liked_${job.id}`) ? 'bg-red-50 text-red-500 shadow-inner' : 'bg-brand-bg text-brand-muted hover:text-red-500'}`}
          >
            <span className={`text-xl transition-transform ${localStorage.getItem(`liked_${job.id}`) ? 'scale-110' : 'group-hover:scale-110'}`}>❤️</span>
            <span className="font-black text-[0.9rem]">{job.likes || 0}</span>
          </button>
          {isAdmin && (
            <div className="flex gap-1.5">
              {!job.approved && (
                <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-green-500 text-white hover:bg-green-600 btn-mui shadow-lg" onClick={() => onApprove(job)} title="Aprobar">✅</button>
              )}
              <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-brand-bg text-brand-dark hover:bg-brand-accent/50 btn-mui" onClick={() => onEdit(job)}>✏️</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2] btn-mui" onClick={() => onDelete(job)}>🗑️</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
