import React from 'react';

export default function Footer({ onShowTerms }) {
  return (
    <footer className="bg-brand-card/50 border-t border-brand-primary/5 pt-16 pb-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          {/* Logo & Slogan */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.jpeg" alt="Logo" className="w-10 h-10 object-cover rounded-full" />
              <span className="font-serif text-xl font-black text-brand-dark">Santa Catalina</span>
            </div>
            <p className="text-brand-muted text-sm font-bold max-w-[280px]">
              La plataforma digital oficial de la comunidad para compra, venta y búsqueda de empleo.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-brand-dark font-black uppercase text-xs tracking-[0.2em]">Síguenos</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/codex_dev2026/" target="_blank" rel="noreferrer" className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-lg border border-brand-primary/10">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <button 
              onClick={onShowTerms}
              className="text-brand-muted hover:text-brand-primary font-black text-xs uppercase tracking-widest transition-all"
            >
              Términos y Condiciones
            </button>
            <p className="text-brand-muted/50 text-[10px] font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} Santa Catalina Digital
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
