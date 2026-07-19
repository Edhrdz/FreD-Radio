import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Radio, Compass, Library, Search, LogIn, CheckCircle, Play, Pause, ArrowRight, Volume2, VolumeX, Music } from 'lucide-react';

export default function App() {
  // Estados de Autenticación
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);

  // Estados del Reproductor de Radio Real
  const [currentStation, setCurrentStation] = useState({
    id: 1,
    title: 'Groove Salad',
    genre: 'Ambient / Lounge',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    img: 'from-purple-600 via-pink-500 to-indigo-400'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Referencia al elemento de Audio nativo
  const audioRef = useRef(null);

  // Lista de 6 estaciones reales de SomaFM
  const estaciones = [
    { id: 1, title: 'Groove Salad', genre: 'Ambient / Lounge', streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3', img: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-400' },
    { id: 2, title: 'Underground 80s', genre: 'Synthwave / Retro', streamUrl: 'https://ice1.somafm.com/u80s-128-mp3', img: 'bg-gradient-to-tr from-blue-600 to-cyan-500' },
    { id: 3, title: 'Indie Pop Rocks!', genre: 'Alternative Rock', streamUrl: 'https://ice1.somafm.com/indiepop-128-mp3', img: 'bg-gradient-to-tr from-rose-500 to-orange-400' },
    { id: 4, title: 'Drone Zone', genre: 'Ambient / Drone', streamUrl: 'https://ice1.somafm.com/dronezone-128-mp3', img: 'bg-gradient-to-tr from-teal-500 to-emerald-400' },
    { id: 5, title: 'Heavy Metal', genre: 'Metal / Hard Rock', streamUrl: 'https://ice1.somafm.com/metal-128-mp3', img: 'bg-gradient-to-tr from-red-700 to-slate-800' },
    { id: 6, title: 'Fluid', genre: 'Hip Hop / Beats', streamUrl: 'https://ice1.somafm.com/fluid-128-mp3', img: 'bg-gradient-to-tr from-fuchsia-600 to-pink-700' },
  ];

  // Controlar la reproducción de audio de forma segura
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Error al reproducir el streaming: ", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentStation, volume, isMuted]);

  // Manejar cambio de estación al hacer clic
  const seleccionarEstacion = (estacion) => {
    setCurrentStation({
      id: estacion.id,
      title: estacion.title,
      genre: estacion.genre,
      streamUrl: estacion.streamUrl,
      img: estacion.img.replace('bg-gradient-to-tr ', '') // Limpiar string para usar la misma clase de degradado
    });
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

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

  return (
    <div className="min-h-screen bg-[#07050f] text-slate-100 font-sans antialiased pb-32 selection:bg-pink-500/30">
      
      {/* Elemento HTML5 oculto que maneja el streaming */}
      <audio ref={audioRef} src={currentStation.streamUrl} preload="none" />

      {/* 1. BARRA DE NAVEGACIÓN SUPERIOR */}
      <header className="sticky top-0 z-40 bg-[#07050f]/80 backdrop-blur-md border-b border-purple-950/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-gradient-to-r from-fuchsia-500 via-purple-600 to-pink-500 p-3 rounded-2xl shadow-xl shadow-purple-600/20 transform group-hover:scale-105 transition duration-300">
              <Radio className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              FreD
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button className="flex items-center gap-2 text-white bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/40"><Radio className="w-4 h-4 text-pink-500" /> Home</button>
            <button className="flex items-center gap-2 hover:text-white transition"><Compass className="w-4 h-4" /> Descubrir</button>
            <button className="flex items-center gap-2 hover:text-white transition"><Library className="w-4 h-4" /> Biblioteca</button>
            <button className="flex items-center gap-2 hover:text-white transition"><Search className="w-4 h-4" /> Buscar</button>
          </nav>
        </div>

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
        
        {/* 2. BANNER PRINCIPAL DINÁMICO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 via-fuchsia-950/20 to-slate-950 rounded-3xl border border-purple-500/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl space-y-6 z-10">
            <span className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-400 text-xs font-bold px-3 py-1 rounded-full border border-pink-500/20 uppercase tracking-widest">
              ● En vivo ahora
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
              La radio del mundo, <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                en tus manos
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Miles de estaciones de radio en vivo de SomaFM. Descubre, escucha música sin publicidad y sigue tus géneros favoritos en FreD.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:opacity-95 transition">
                Explorar estaciones <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => seleccionarEstacion(estaciones[0])}
                className="bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-white" /> Escuchar recomendada
              </button>
            </div>
          </div>

          {/* Arte fluido del banner */}
          <div 
            onClick={() => seleccionarEstacion(estaciones[0])}
            className="relative w-full max-w-[340px] aspect-square rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-400 p-6 flex flex-col justify-end shadow-2xl group cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-300 flex items-center justify-center">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transform scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition duration-300">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>
            <div className="z-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300">Recomendación</span>
              <h3 className="text-xl font-bold text-white">Groove Salad</h3>
              <p className="text-xs text-slate-300">Ambient / Lounge</p>
            </div>
          </div>
        </section>

        {/* 3. LISTADO DE ESTACIONES REALES */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              ✨ Estaciones en Vivo de SomaFM
            </h3>
            <button className="text-xs font-semibold text-pink-400 hover:underline">Ver todo →</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {estaciones.map((est) => {
              const isThisCurrent = currentStation.id === est.id;
              return (
                <div 
                  key={est.id} 
                  onClick={() => seleccionarEstacion(est)}
                  className={`bg-slate-900/40 border rounded-2xl p-4 hover:bg-slate-900/80 transition duration-300 group cursor-pointer ${isThisCurrent ? 'border-pink-500/40 bg-purple-950/10' : 'border-slate-900'}`}
                >
                  <div className={`w-full aspect-square rounded-xl ${est.img} mb-4 relative p-3 flex flex-col justify-between shadow-inner`}>
                    <span className="self-start bg-black/60 backdrop-blur-md text-[10px] text-red-400 font-bold px-2 py-0.5 rounded-md border border-red-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" /> LIVE
                    </span>
                    <div className="w-10 h-10 bg-white text-slate-950 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition duration-300 self-end shadow-lg">
                      {isThisCurrent && isPlaying ? <Pause className="w-4 h-4 fill-current text-slate-950" /> : <Play className="w-4 h-4 fill-current text-slate-950 ml-0.5" />}
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-sm truncate">{est.title}</h4>
                  <p className="text-xs text-slate-500 truncate">{est.genre}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 4. MINI-PLAYER FIJO INTERACTIVO (ABAJO) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0c0a1a]/90 backdrop-blur-lg border-t border-purple-500/10 px-6 py-4 flex items-center justify-between shadow-2xl">
        
        {/* Información de la Radio Actual */}
        <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${currentStation.img} flex items-center justify-center shadow-lg flex-shrink-0 relative`}>
            <Music className="w-5 h-5 text-white/70" />
            
            {/* Ecualizador animado visual */}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center gap-0.5 px-2">
                <span className="w-1 bg-pink-400 h-3 animate-[pulse_0.6s_infinite_alternate]" />
                <span className="w-1 bg-purple-400 h-5 animate-[pulse_0.4s_infinite_alternate_0.2s]" />
                <span className="w-1 bg-fuchsia-400 h-4 animate-[pulse_0.5s_infinite_alternate_0.1s]" />
              </div>
            )}
          </div>
          <div className="truncate">
            <h5 className="font-bold text-sm text-white truncate">{currentStation.title}</h5>
            <p className="text-xs text-slate-400 truncate">{currentStation.genre}</p>
          </div>
        </div>

        {/* Botones de Control Central */}
        <div className="flex flex-col items-center gap-1 justify-center">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white hover:bg-slate-200 text-slate-950 flex items-center justify-center shadow-lg transform active:scale-95 transition"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
        </div>

        {/* Control de Volumen Lado Derecho */}
        <div className="flex items-center gap-3 w-1/3 justify-end">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="text-slate-400 hover:text-white transition"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-24 accent-pink-500 bg-slate-800 h-1 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* 5. MODAL DE AUTENTICACIÓN */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090714] border border-purple-950/40 rounded-2xl p-8 shadow-2xl relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white font-bold text-lg">✕</button>

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
              <button type="button" className="w-full bg-[#120f24] hover:bg-[#1a1635] text-slate-200 font-medium py-3 rounded-xl border border-slate-800/60 text-sm flex items-center justify-center gap-2 transition">
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

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg text-sm">
                {loading ? 'Procesando...' : isRegistering ? 'Regístrate' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="text-center mt-6 text-xs text-slate-400">
              {isRegistering ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
              <button onClick={() => setIsRegistering(!isRegistering)} className="text-pink-400 font-semibold hover:underline">
                {isRegistering ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
