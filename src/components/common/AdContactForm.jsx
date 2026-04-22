import React, { useState } from 'react';

export default function AdContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  // Credenciales de Telegram configuradas
  const TELEGRAM_BOT_TOKEN = '8674203998:AAHDiy5tXcRHI9JwXvhrqq9_HvjcmgW-Vi8';
  const TELEGRAM_CHAT_ID   = '1222847704';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const text = `
🚀 *Nueva Solicitud de Publicidad*
👤 *Nombre:* ${formData.name}
📞 *Teléfono:* ${formData.phone}
📧 *Email:* ${formData.email}
📝 *Mensaje:* ${formData.message}
    `;

    try {
      // Simulamos un retraso de 3 segundos para el "círculo de enviando" como pidió el usuario
      await new Promise(resolve => setTimeout(resolve, 3000));

      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', email: '', message: '' });
        setTimeout(() => setStatus(null), 6000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const [activeBenefit, setActiveBenefit] = useState(null);

  const benefits = [
    { 
      icon: '🚀', 
      title: 'Máxima visibilidad local', 
      desc: 'Tu negocio aparecerá en la sección superior de la plataforma, siendo lo primero que ven los vecinos de Holmberg y Río Cuarto al ingresar. ¡No dejes que te pasen por alto!'
    },
    { 
      icon: '✨', 
      title: 'Lugar preferencial', 
      desc: 'Destácate por sobre el resto. Tu marca se posicionará en lugares estratégicos para garantizar que nadie pase por alto tu oferta comercial.' 
    },
    { 
      icon: '📅', 
      title: 'Exposición por 30 días', 
      desc: '30 días de corrido sin interrupciones. Tu publicidad trabaja para ti las 24 horas, asegurando un flujo constante de interesados durante todo el mes.' 
    },
    { 
      icon: '📈', 
      title: 'Alcance constante', 
      desc: 'Garantizamos que tu anuncio llegue a la mayor cantidad de personas posible a través de nuestra red comunitaria en constante crecimiento diario.' 
    },
    { 
      icon: '💎', 
      title: 'Solo $40.000 mensuales', 
      desc: 'Una inversión mínima para un retorno máximo. Accede a publicidad de alto impacto por el precio más competitivo del mercado local.' 
    }
  ];

  return (
    <section className="px-4 py-20 bg-gradient-to-b from-transparent to-brand-primary/5">
      <div className="max-w-[800px] mx-auto bg-brand-card rounded-[40px] shadow-2xl border border-brand-primary/10 overflow-hidden flex flex-col md:flex-row">
        <div className="bg-brand-primary p-8 sm:p-10 text-white md:w-2/5 flex flex-col justify-center border-r border-white/10">
          <h3 className="font-serif text-3xl font-black mb-8 leading-tight">¿Quieres destacar?</h3>
          
          <div className="space-y-3 mb-10">
            {benefits.map((item, i) => (
              <button 
                key={i} 
                onClick={() => setActiveBenefit(item)}
                className="w-full flex items-center gap-3 text-white/90 text-xs sm:text-sm font-black bg-white/10 p-3.5 rounded-2xl border border-white/5 transition-all hover:bg-white/20 hover:translate-x-1 text-left group"
              >
                <span className="text-xl drop-shadow-md group-hover:scale-125 transition-transform">{item.icon}</span>
                <span className="uppercase tracking-wide flex-1">{item.title}</span>
                <span className="opacity-40 group-hover:opacity-100 transition-opacity">➜</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 pt-6 border-t border-white/10">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-inner">📢</div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-tight">Publicidad Destacada Premium</span>
          </div>
        </div>

        {/* Benefit Detail Modal */}
        {activeBenefit && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md animate-fade-in" onClick={() => setActiveBenefit(null)}>
            <div className="bg-brand-card w-full max-w-[400px] p-8 sm:p-10 rounded-[40px] shadow-2xl border border-brand-primary/10 animate-pop-in relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary" />
              <button onClick={() => setActiveBenefit(null)} className="absolute top-6 right-6 text-2xl text-brand-muted hover:text-brand-primary">&times;</button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner animate-bounce-subtle">
                  {activeBenefit.icon}
                </div>
                <h4 className="font-serif text-2xl font-black text-brand-dark mb-4 leading-tight">
                  {activeBenefit.title}
                </h4>
                <p className="text-brand-muted text-[0.95rem] font-bold leading-relaxed mb-8">
                  {activeBenefit.desc}
                </p>
                <button 
                  onClick={() => setActiveBenefit(null)}
                  className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Side - Form */}
        <form onSubmit={handleSubmit} className="p-10 flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-brand-primary ml-2">Nombre y Apellido</label>
              <input 
                type="text" 
                required
                className="w-full p-4 rounded-2xl bg-brand-bg border border-brand-primary/10 outline-none focus:border-brand-primary transition-all font-bold text-brand-dark" 
                placeholder="Ej: Juan Pérez"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-brand-primary ml-2">Teléfono</label>
              <input 
                type="tel" 
                required
                className="w-full p-4 rounded-2xl bg-brand-bg border border-brand-primary/10 outline-none focus:border-brand-primary transition-all font-bold text-brand-dark" 
                placeholder="Ej: 358 1234567"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-brand-primary ml-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="w-full p-4 rounded-2xl bg-brand-bg border border-brand-primary/10 outline-none focus:border-brand-primary transition-all font-bold text-brand-dark" 
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-brand-primary ml-2">¿Qué quieres anunciar?</label>
            <textarea 
              required
              className="w-full p-4 rounded-2xl bg-brand-bg border border-brand-primary/10 outline-none focus:border-brand-primary transition-all font-bold text-brand-dark min-h-[120px]" 
              placeholder="Cuéntanos sobre tu negocio..."
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === 'sending'}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${status === 'sending' ? 'bg-brand-muted text-white cursor-not-allowed' : 'bg-brand-primary text-white hover:brightness-110'}`}
          >
            {status === 'sending' ? (
              <>
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>Enviar Solicitud</span>
                <span className="text-xl">✈️</span>
              </>
            )}
          </button>

          {status === 'success' && (
            <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-xs font-black text-center animate-pop-in">
              ✅ ¡Mensaje enviado con éxito! Nos contactaremos pronto.
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black text-center animate-shake">
              ❌ Error al enviar. Por favor, intenta más tarde.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
