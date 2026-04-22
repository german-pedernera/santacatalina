import React from 'react';
import { timeAgo, formatDate, WA_SVG } from '../../utils/helpers';

export default function PostCard({ post, isAdmin, onDelete, onEdit, onApprove }) {
  const wa = post.whatsapp?.replace(/\D/g, '');
  return (
    <div className={`bg-brand-card rounded-[24px] shadow-sm hover:shadow-mui overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1.5 group animate-fade-in-up ${!post.approved && isAdmin ? 'ring-2 ring-brand-primary/20' : ''}`}>
      {post.photo && (
        <div className="relative pb-[62%] overflow-hidden">
          <img src={post.photo} alt="producto" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[0.62rem] text-white font-black uppercase tracking-wider border border-white/20">
              {timeAgo(post.timestamp)} · {formatDate(post.timestamp)}
            </div>
            {isAdmin && !post.approved && (
              <div className="bg-orange-500 text-white px-2.5 py-1 rounded-full text-[0.62rem] font-black uppercase tracking-wider shadow-lg">
                Pendiente
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="font-serif text-[1.1rem] font-black text-brand-dark leading-tight line-clamp-2">{post.title}</h3>
          <p className="font-black text-brand-primary text-[1.1rem] ml-2 shrink-0">
            {Number(post.price) === 0 ? 'Consultar' : `$${Number(post.price).toLocaleString('es-AR')}`}
          </p>
        </div>
        {!post.photo && isAdmin && !post.approved && (
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-1">⚠️ Pendiente de aprobación</span>
        )}
        <p className="text-brand-muted text-[0.82rem] line-clamp-3 mb-4 leading-relaxed flex-1">{post.description}</p>
        
        {(post.email || post.address) && (
          <div className="flex flex-col gap-1 mb-4">
            {post.email && <p className="text-brand-primary text-[0.75rem] font-black flex items-center gap-1.5">📧 <span className="opacity-80">{post.email}</span></p>}
            {post.address && <p className="text-brand-muted text-[0.75rem] font-black flex items-center gap-1.5">📍 <span className="opacity-80">{post.address}</span></p>}
          </div>
        )}
        
        <div className="flex gap-2 items-center mt-auto">
          {wa && (
            <a 
              href={`https://wa.me/54${wa}`} 
              target="_blank" 
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 px-4 rounded-[16px] text-[0.85rem] font-black shadow-lg hover:opacity-90 active:scale-95 transition-all animate-wa-pulse"
            >
              {WA_SVG} <span>Consultar</span>
            </a>
          )}
          <button 
            onClick={(e) => {
              e.preventDefault();
              onLike();
            }}
            className={`h-11 px-4 flex items-center justify-center gap-2 rounded-[16px] transition-all active:scale-90 ${localStorage.getItem(`liked_${post.id}`) ? 'bg-red-50 text-red-500 shadow-inner' : 'bg-brand-bg text-brand-muted hover:text-red-500'}`}
          >
            <span className={`text-xl transition-transform ${localStorage.getItem(`liked_${post.id}`) ? 'scale-110' : 'group-hover:scale-110'}`}>❤️</span>
            <span className="font-black text-[0.9rem]">{post.likes || 0}</span>
          </button>
          {isAdmin && (
            <div className="flex gap-1.5">
              {!post.approved && (
                <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-green-500 text-white hover:bg-green-600 btn-mui shadow-lg" onClick={() => onApprove(post)} title="Aprobar">✅</button>
              )}
              <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-brand-bg text-brand-dark hover:bg-brand-accent/50 btn-mui" onClick={() => onEdit(post)}>✏️</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2] btn-mui" onClick={() => onDelete(post)}>🗑️</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
