import { useState } from "react";
import MovingDots from "./MovingDots";
import TermsModal from "./TermsModal";

export default function Landing({ onEnter }) {
  const [showTerms, setShowTerms] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="fixed inset-0 z-[500] bg-brand-bg flex flex-col items-center justify-center overflow-hidden animate-fade-in">
      <MovingDots />

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center max-w-[500px] w-full px-6 text-center">
        <div className="relative group mb-8">
          <div className="absolute -inset-6 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse" />
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.4)] p-1 border border-white/30 animate-pop-in overflow-hidden">
            <img src="/logo.jpeg" alt="Santa Catalina Logo" className="w-full h-full object-cover scale-110 rounded-full" />
          </div>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-black text-brand-dark tracking-tighter leading-tight animate-fade-in-up delay-100">
          Bienvenido a<br />
          <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">Santa Catalina</span>
        </h1>
        
        <p className="mt-4 text-brand-muted font-bold text-sm sm:text-base leading-relaxed animate-fade-in-up delay-200">
          La plataforma digital oficial de compra, venta y empleos para la comunidad de Holmberg, Río Cuarto y zonas aledañas.
        </p>

        <div className="mt-10 flex flex-col gap-4 w-full animate-fade-in-up delay-300">
          <div className="flex flex-col items-center gap-3 mb-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={accepted}
                  onChange={(e) => {
                    setAccepted(e.target.checked);
                    if (e.target.checked) setError(false);
                  }}
                  className="peer hidden" 
                />
                <div className="w-6 h-6 border-2 border-brand-primary/30 rounded-lg bg-brand-bg transition-all peer-checked:bg-brand-primary peer-checked:border-brand-primary group-hover:border-brand-primary shadow-inner flex items-center justify-center">
                  <span className={`text-white text-sm transition-transform ${accepted ? 'scale-100' : 'scale-0'}`}>✓</span>
                </div>
              </div>
              <span className="text-brand-muted text-xs font-bold uppercase tracking-wide group-hover:text-brand-dark transition-colors">
                Acepto los Términos y Condiciones
              </span>
            </label>
            
            {error && (
              <p className="text-[#EF4444] text-[10px] font-black uppercase tracking-wider animate-shake">
                ⚠️ Si no acepta los términos no podrá publicar gratis
              </p>
            )}
          </div>

          <button 
            onClick={() => {
              if (accepted) {
                onEnter();
              } else {
                setError(true);
              }
            }}
            className={`w-full py-4 px-8 bg-gradient-to-br from-brand-primary to-brand-secondary text-white font-black rounded-[20px] shadow-xl hover:shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg ${!accepted ? 'opacity-90 grayscale-[0.3]' : ''}`}
          >
            Ingresar a la Plataforma
          </button>
          
          <button 
            onClick={() => setShowTerms(true)}
            className="w-full py-3 px-8 bg-brand-card/50 backdrop-blur-sm text-brand-muted font-black rounded-[20px] border border-brand-primary/10 hover:bg-brand-card hover:text-brand-primary transition-all text-sm uppercase tracking-widest"
          >
            Ver Términos y Condiciones
          </button>
        </div>
      </div>

      {/* ── Terms and Conditions Modal ── */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      {/* Footer info */}
      <div className="absolute bottom-6 text-brand-muted text-[10px] font-black uppercase tracking-[0.3em] opacity-50 z-10">
        Santa Catalina · Holmberg te conecta
      </div>
    </div>
  );
}
