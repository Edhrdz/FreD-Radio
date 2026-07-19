import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Radio, Compass, Library, Search, LogIn, UserPlus, CheckCircle, Play, ArrowRight } from 'lucide-react';

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (isRegistering) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: '¡Registro exitoso! Revisa tu correo.' });
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setUser(data.user);
        setMessage({ type: 'success', text: '¡Sesión iniciada!' });
        setTimeout(() => setShowAuthModal(false), 1500);
      }
    }
    setLoading(false);
  };

  // Datos simulados idénticos a tus capturas
  const estaciones = [
    { id: 1, title: 'Fluid', genre: 'Hip Hop', isLive: true, img: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-400' },
    { id: 2, title: 'Underground 80s', genre: 'Synthwave', isLive: true, img: 'bg-gradient-to-tr from-blue-600 to-cyan-500' },
    { id: 3, title: 'Indie Pop Rocks!', genre: 'Alternative', isLive: true, img: 'bg-gradient-to-tr from-rose-500 to-orange-400' },
    { id: 4, title: 'Drone Zone', genre: 'Ambient', isLive: true, img: 'bg-gradient-to-tr from-teal-500 to-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-[#07050f] text-slate-100 font-sans antialiased selection:bg-pink-500/30">
      
      {/* 1. BARRA DE NAVEGACIÓN SUPERIOR */}
      <header className="sticky top-0 z-40 bg-[#07050f]/80 backdrop-blur-md border-b border-purple-950/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* LOGO DE FRED MUCHO MÁS GRANDE Y VISIBLE */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-gradient-to-r from-fuchsia-500 via-purple-600 to-pink-500 p-3 rounded-2xl shadow-xl shadow-purple-600/20 transform group-hover:scale-105 transition duration-300">
              <Radio className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              FreD
            </span>
          </div>

          {/* Menú de Navegación Izquierdo */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button className="flex items-center gap-2 text-white bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/40"><Radio className="w-4 h-4 text-pink-500" /> Home</button>
            <button className="flex items-center gap-2 hover:text-white transition"><Compass className="w-4 h-4" /> Descubrir</button>
            <button className="flex items-center gap-2 hover:text-white transition"><Library className="w-4 h-4" /> Biblioteca</button>
            <button className="flex items-center gap-2 hover:text-white transition"><Search className="w-4 h-4" /> Buscar</button>
          </nav>
        </div>

        {/* Botón de Iniciar Sesión de tu captura */}
        <div>
          {user ? (
            <span className="text-xs bg-purple-950/40 border border-purple-500/30 px-4 py-2 rounded-full text-purple-300 font-medium">
              {user.email}
            </span>
          ) : (
            <button 
              onClick={() => { setIsRegistering(false); setShowAuthModal(true); }}
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-bold px-6 py-2 rounded-full shadow-lg hover:opacity-90 active:scale-95 transition text-sm"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        
        {/* 2. BANNER PRINCIPAL DESTACADO DE TU CAPTURA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 via-fuchsia-950/20 to-slate-950 rounded-3xl border border-purple-500/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl space-y-6 z-10">
            <span className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-400 text-xs font-bold px-3 py-1 rounded-full border border-pink-500/20 uppercase tracking-widest animate-pulse">
              ● En vivo ahora
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
              La radio del mundo, <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                en tus manos
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Miles de estaciones de radio en vivo — música, noticias, cultura, deporte. Descubre, escucha y sigue tus favoritas en FreD.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-pink-500/10 hover:opacity-95 transition">
                Explorar estaciones <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition">
                <Play className="w-4 h-4 fill-white" /> Escuchar destacada
              </button>
            </div>
          </div>

          {/* Arte fluido del banner */}
          <div className="relative w-full max-w-[340px] aspect-square rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-400 p-6 flex flex-col justify-end shadow-2xl group cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-300" />
            <div className="z-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300">Destacado</span>
              <h3 className="text-xl font-bold text-white">Fluid</h3>
              <p className="text-xs text-slate-300">Hip Hop</p>
            </div>
          </div>
        </section>

        {/* 3. SECCIÓN DE ESTACIONES DESTACADAS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              ✨ Estaciones destacadas
            </h3>
            <button className="text-xs font-semibold text-pink-400 hover:underline">Ver todo →</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {estaciones.map((est) => (
              <div key={est.id} className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 hover:border-purple-500/20 hover:bg-slate-900/80 transition duration-300 group cursor-pointer">
                <div className={`w-full aspect-square rounded-xl ${est.img} mb-4 relative p-3 flex flex-col justify-between shadow-inner`}>
                  <span className="self-start bg-black/60 backdrop-blur-md text-[10px] text-red-400 font-bold px-2 py-0.5 rounded-md border border-red-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" /> LIVE
                  </span>
                  <div className="w-10 h-10 bg-white text-slate-950 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition duration-300 self-end shadow-lg">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
                <h4 className="font-bold text-white text-base truncate">{est.title}</h4>
                <p className="text-xs text-slate-500 truncate">{est.genre}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 4. VENTANA MODAL FLOTANTE DE INICIO DE SESIÓN COMPACTO */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090714] border border-purple-950/40 rounded-2xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2.5 rounded-xl mb-3 shadow-lg">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Bienvenidos</h3>
              <p className="text-xs text-slate-400 mt-1">Accede para escuchar tus estaciones favoritas.</p>
            </div>

            {message.text && (
              <div className={`p-3 rounded-xl mb-4 border text-xs text-center ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <button 
                type="button" 
                className="w-full bg-[#120f24] hover:bg-[#1a1635] text-slate-200 font-medium py-3 rounded-xl border border-slate-800/60 text-sm flex items-center justify-center gap-2 transition"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-4 h-4" />
                Continuar con Google
              </button>

              <div className="relative flex py-2 items-center text-xs text-slate-600">
                <div className="flex-grow border-t border-slate-900" />
                <span className="flex-shrink mx-3">o</span>
                <div className="flex-grow border-t border-slate-900" />
              </div>

              <input
                type="email"
                required
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0a1c] border border-slate-900 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-purple-500 transition"
              />

              <input
                type="password"
                required
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0a1c] border border-slate-900 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-purple-500 transition"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg text-sm"
              >
                {loading ? 'Procesando...' : isRegistering ? 'Regístrate' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="text-center mt-6 text-xs text-slate-400">
              {isRegistering ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
              <button 
                onClick={() => setIsRegistering(!isRegistering)} 
                className="text-pink-400 font-semibold hover:underline"
              >
                {isRegistering ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
