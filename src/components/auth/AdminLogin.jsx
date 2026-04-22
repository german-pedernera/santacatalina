import React, { useState } from 'react';

export default function AdminLogin({ onLogin, onClose }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const ADMIN_USER = 'Ger25$';
  const ADMIN_PASS = 'Emi25$';

  const handle = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      onLogin();
      onClose();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-[600] flex items-center justify-center p-6">
      <div className="bg-brand-card w-full max-w-[360px] p-8 rounded-[32px] shadow-2xl animate-pop-in border border-brand-primary/10">
        <h3 className="font-serif text-2xl font-black text-brand-dark mb-2 text-center">Panel de Control</h3>
        <p className="text-brand-muted text-xs font-bold uppercase tracking-widest text-center mb-8">Acceso restringido</p>
        
        <div className="space-y-4 mb-8">
          <input 
            type="text" 
            className="w-full p-4 rounded-2xl bg-brand-bg border border-brand-primary/10 outline-none focus:border-brand-primary transition-all text-brand-dark font-bold" 
            placeholder="Usuario" 
            value={user} 
            onChange={e => setUser(e.target.value)}
            autoComplete="off"
          />
          <input 
            type="password" 
            className="w-full p-4 rounded-2xl bg-brand-bg border border-brand-primary/10 outline-none focus:border-brand-primary transition-all text-brand-dark font-bold" 
            placeholder="Contraseña" 
            value={pass} 
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()}
            autoComplete="new-password"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold text-center mb-6 animate-shake border border-red-100">
            Error: Usuario y/o contraseña incorrectos. Vuelva a intentarlo.
          </div>
        )}

        <div className="flex gap-3">
          <button className="flex-1 p-4 rounded-2xl bg-brand-bg text-brand-muted font-black text-sm uppercase tracking-wider hover:bg-brand-primary/5 transition-all" onClick={onClose}>Cerrar</button>
          <button className="flex-1 p-4 rounded-2xl bg-brand-primary text-white font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all" onClick={handle}>Entrar</button>
        </div>
      </div>
    </div>
  );
}
