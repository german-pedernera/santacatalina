import React from 'react';

export default function ConfirmDialog({ title, msg, onOk, onCancel }) {
  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[500] flex items-center justify-center p-6 animate-pop-in">
      <div className="bg-brand-card p-6 rounded-[24px] shadow-mui max-w-[340px] w-full text-center border border-brand-primary/10">
        <p className="font-serif text-[1.2rem] font-black text-brand-dark mb-2">{title}</p>
        <p className="text-brand-muted text-[0.88rem] mb-6 leading-relaxed">{msg}</p>
        <div className="flex gap-3">
          <button className="flex-1 py-3 px-4 rounded-[14px] bg-brand-bg text-brand-muted font-bold text-[0.9rem] hover:bg-brand-accent/50 btn-mui" onClick={onCancel}>No, volver</button>
          <button className="flex-1 py-3 px-4 rounded-[14px] bg-[#DC2626] text-white font-black text-[0.9rem] shadow-lg btn-mui" onClick={onOk}>Sí, eliminar</button>
        </div>
      </div>
    </div>
  );
}
