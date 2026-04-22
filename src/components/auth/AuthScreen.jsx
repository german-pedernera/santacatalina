import React, { useState } from 'react';
import { 
  doc, 
  setDoc,
  getDoc
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { db, auth } from "../../firebase";
import { PWD_REGEX, SECURITY_QUESTIONS } from "../../utils/helpers";
import MovingDots from '../common/MovingDots';

export default function AuthScreen() {
  const [mode, setMode] = useState('login'); 
  const [form, setForm] = useState({ 
    name: '', lastName: '', email: '', phone: '', 
    password: '', confirm: '', question: SECURITY_QUESTIONS[0], answer: '' 
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [captcha, setCaptcha] = useState({ q: '', a: 0, input: '' });

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ q: `${n1} + ${n2} = ?`, a: n1 + n2, input: '' });
  };

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    setErr('');
    const { name, lastName, email, phone, password, confirm, question, answer } = form;
    if (!name || !lastName || !email || !phone || !answer || !password) return setErr('Todos los campos son obligatorios.');
    if (password !== confirm) return setErr('Las contraseñas no coinciden.');
    if (!PWD_REGEX.test(password)) return setErr('Contraseña débil.');

    setLoading(true);
    try {
      const userDocId = `${name.trim().toLowerCase()}_${lastName.trim().toLowerCase()}`;
      const userRef = doc(db, 'users', userDocId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setLoading(false);
        return setErr('Este usuario ya existe.');
      }
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(userRef, { uid: cred.user.uid, name, lastName, email, phone, question, answer, password, fullName: `${name} ${lastName}` });
      setForm({ name: '', lastName: '', email: '', phone: '', password: '', confirm: '', question: SECURITY_QUESTIONS[0], answer: '' });
      alert("Registro exitoso.");
      setMode('login');
    } catch (e) {
      setErr(`Error: ${e.message}`);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setErr('');
    const { name, lastName, password } = form;
    if (!name || !lastName || !password) return setErr('Faltan datos.');
    setLoading(true);
    try {
      const userDocId = `${name.trim().toLowerCase()}_${lastName.trim().toLowerCase()}`;
      const userSnap = await getDoc(doc(db, 'users', userDocId));
      if (!userSnap.exists()) {
        setLoading(false);
        return setErr('Usuario no encontrado.');
      }
      const userData = userSnap.data();
      setPendingUser({ email: userData.email, password });
      generateCaptcha();
      setShowTerms(true);
    } catch (e) { setErr('Error al validar.'); }
    setLoading(false);
  };

  const handleAcceptTerms = async () => {
    if (parseInt(captcha.input) !== captcha.a) return alert("Captcha incorrecto.");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, pendingUser.email, pendingUser.password);
    } catch (e) { alert("Error."); setShowTerms(false); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
      <MovingDots />
      <div className="bg-brand-card p-8 rounded-[32px] shadow-mui w-full max-w-[420px] relative overflow-hidden z-10">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-full -mr-10 -mt-10" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg p-1.5 border-2 border-brand-primary/10">
              <img src="/logo.png" alt="Santa Catalina Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          </div>
          
          <h2 className="text-center text-2xl font-black text-brand-dark mb-2">
            {mode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
          </h2>
          <p className="text-center text-brand-muted text-[0.85rem] mb-8 font-bold">
            {mode === 'login' ? 'Ingresa tus datos para continuar' : 'Únete a nuestra comunidad de compra venta'}
          </p>

          {err && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[0.75rem] font-black mb-6 border border-red-100 animate-pop-in">
              ⚠️ {err}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="auth-label">Nombre</label>
                <input className="auth-input" placeholder="Juan" value={form.name} onChange={e => upd('name', e.target.value)} />
              </div>
              <div>
                <label className="auth-label">Apellido</label>
                <input className="auth-input" placeholder="Pérez" value={form.lastName} onChange={e => upd('lastName', e.target.value)} />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="auth-label">Email</label>
                  <input type="email" className="auth-input" placeholder="email@ejemplo.com" value={form.email} onChange={e => upd('email', e.target.value)} />
                </div>
                <div>
                  <label className="auth-label">Teléfono</label>
                  <input type="tel" className="auth-input" placeholder="3584123456" value={form.phone} onChange={e => upd('phone', e.target.value)} />
                </div>
                <div>
                  <label className="auth-label">Pregunta de Seguridad</label>
                  <select className="auth-input" value={form.question} onChange={e => upd('question', e.target.value)}>
                    {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className="auth-label">Respuesta</label>
                  <input className="auth-input" placeholder="Tu respuesta secreta..." value={form.answer} onChange={e => upd('answer', e.target.value)} />
                </div>
              </>
            )}

            <div>
              <label className="auth-label">Contraseña</label>
              <input type="password" className="auth-input" placeholder="••••••••" value={form.password} onChange={e => upd('password', e.target.value)} />
            </div>

            {mode === 'register' && (
              <div>
                <label className="auth-label">Confirmar Contraseña</label>
                <input type="password" className="auth-input" placeholder="••••••••" value={form.confirm} onChange={e => upd('confirm', e.target.value)} />
              </div>
            )}

            <button 
              disabled={loading}
              onClick={mode === 'login' ? handleLogin : handleRegister}
              className="w-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white py-4 rounded-[20px] font-black shadow-xl hover:opacity-90 active:scale-95 transition-all mt-4 disabled:opacity-50"
            >
              {loading ? '⏳ Procesando...' : mode === 'login' ? '🚀 Iniciar Sesión' : '✨ Crear Cuenta'}
            </button>

            <div className="text-center mt-6">
              <button 
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}
                className="text-brand-primary font-black text-[0.85rem] hover:underline"
              >
                {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Verification Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-md z-[500] flex items-center justify-center p-6">
          <div className="bg-brand-card p-8 rounded-[32px] shadow-2xl w-full max-w-[400px] animate-pop-in border border-white/10">
            <h3 className="text-xl font-black mb-4 text-brand-dark">Verificación de Seguridad</h3>
            <p className="text-brand-muted text-[0.85rem] mb-6 font-bold">
              Resuelve el captcha para confirmar que eres humano e ingresar a la plataforma:
            </p>
            
            <div className="bg-brand-bg p-6 rounded-2xl text-center mb-6 border-2 border-brand-primary/10">
              <span className="text-2xl font-black text-brand-primary tracking-widest">{captcha.q}</span>
            </div>
            
            <input 
              type="number" 
              className="auth-input mb-6 text-center text-xl font-black" 
              placeholder="Resultado" 
              value={captcha.input} 
              onChange={e => setCaptcha({ ...captcha, input: e.target.value })} 
            />
            
            <div className="flex gap-3">
              <button onClick={() => setShowTerms(false)} className="flex-1 py-3.5 rounded-[18px] bg-brand-bg text-brand-muted font-bold btn-mui">Cancelar</button>
              <button onClick={handleAcceptTerms} disabled={loading} className="flex-1 py-3.5 rounded-[18px] bg-brand-primary text-white font-black shadow-lg btn-mui disabled:opacity-50">
                {loading ? '⏳ Validando...' : '✅ Ingresar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
