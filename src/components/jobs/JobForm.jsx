import React, { useState } from 'react';
import { resizeImage } from '../../utils/helpers';

export default function JobForm({ onSave, onClose, initialData }) {
  const [form, setForm] = useState(initialData || { 
    title: '', 
    description: '', 
    whatsapp: '', 
    address: '',
    type: 'offer', 
    duration: 10,
    photo: '',
    photos: []
  });
  const [loading, setLoading] = useState(false);

  const handleImg = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await resizeImage(file);
      setForm({ ...form, photo: base64, photos: [base64] });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return alert('Todos los campos son obligatorios');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-md z-[400] flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-brand-card rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-8 pb-10 w-full max-w-[500px] max-h-[92vh] sm:max-h-[85vh] overflow-y-auto no-scrollbar animate-sheet-up sm:animate-pop-in border-t sm:border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <p className="font-serif text-[1.4rem] font-black text-brand-dark">{initialData ? '✏️ Editar Empleo' : '💼 Nueva Publicación'}</p>
          <button className="w-9 h-9 rounded-full bg-brand-bg text-brand-muted hover:text-brand-dark transition-colors font-bold" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex bg-brand-bg p-1 rounded-[16px] border-2 border-brand-primary/5">
            <button type="button" className={`flex-1 py-3 rounded-[12px] text-[0.82rem] font-black transition-all ${form.type === 'offer' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-muted'}`} onClick={() => setForm({ ...form, type: 'offer' })}>OFRECER TRABAJO</button>
            <button type="button" className={`flex-1 py-3 rounded-[12px] text-[0.82rem] font-black transition-all ${form.type === 'request' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-muted'}`} onClick={() => setForm({ ...form, type: 'request' })}>BUSCAR TRABAJO</button>
          </div>

          <div>
            <label className="block text-[0.78rem] font-black text-brand-muted uppercase tracking-widest mb-1.5 ml-1">Puesto o Servicio</label>
            <input className="w-full p-4 rounded-[18px] bg-brand-bg text-brand-dark border-2 border-brand-primary/5 focus:border-brand-primary/40 outline-none transition-all focus:shadow-mui" placeholder="Ej: Busco Niñera / Ofrezco Albañilería" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>

          <div>
            <label className="block text-[0.78rem] font-black text-brand-muted uppercase tracking-widest mb-1.5 ml-1">WhatsApp de contacto (Sin 0 ni 15)</label>
            <input type="tel" className="w-full p-4 rounded-[18px] bg-brand-bg text-brand-dark border-2 border-brand-primary/5 focus:border-brand-primary/40 outline-none transition-all focus:shadow-mui" placeholder="Ej: 3584123456" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.78rem] font-black text-brand-muted uppercase tracking-widest mb-1.5 ml-1">Duración (Máx 10 días)</label>
              <select className="w-full p-4 rounded-[18px] bg-brand-bg text-brand-dark border-2 border-brand-primary/5 focus:border-brand-primary/40 outline-none transition-all focus:shadow-mui appearance-none font-bold" value={form.duration} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) })}>
                {[1,2,3,4,5,6,7,8,9,10].map(d => (
                  <option key={d} value={d}>{d} {d === 1 ? 'Día' : 'Días'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[0.78rem] font-black text-brand-muted uppercase tracking-widest mb-1.5 ml-1">Dirección (Opcional)</label>
              <input className="w-full p-4 rounded-[18px] bg-brand-bg text-brand-dark border-2 border-brand-primary/5 focus:border-brand-primary/40 outline-none transition-all focus:shadow-mui" placeholder="Calle y Nro" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className="block text-[0.78rem] font-black text-brand-muted uppercase tracking-widest">Detalles</label>
              <span className={`text-[10px] font-black ${form.description.length >= 250 ? 'text-red-500' : 'text-brand-muted'}`}>
                {form.description.length}/250
              </span>
            </div>
            <textarea 
              maxLength={250}
              className="w-full p-4 rounded-[18px] bg-brand-bg text-brand-dark border-2 border-brand-primary/5 focus:border-brand-primary/40 outline-none transition-all focus:shadow-mui h-32 resize-none" 
              placeholder="Requisitos, horarios, experiencia..." 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-[0.78rem] font-black text-brand-muted uppercase tracking-widest mb-1.5 ml-1">Foto (Opcional)</label>
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleImg} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="w-full p-6 rounded-[18px] border-2 border-dashed border-brand-primary/20 bg-brand-bg flex flex-col items-center justify-center gap-2 transition-colors">
                {!form.photo ? (
                  <>
                    <span className="text-3xl">📸</span>
                    <span className="text-[0.78rem] font-bold text-brand-muted">Toca para subir una foto</span>
                  </>
                ) : (
                  <img src={form.photo} className="h-32 w-full object-contain rounded-[12px]" alt="preview" />
                )}
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full p-[18px] rounded-[20px] bg-gradient-to-br from-brand-primary to-brand-secondary text-white font-black text-[1rem] shadow-xl hover:opacity-90 active:scale-95 transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <span>🚀 Publicar Ahora</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
