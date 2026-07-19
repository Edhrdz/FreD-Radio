import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Radio, Compass, Library, Search, LogIn, CheckCircle, Play, Pause, ArrowRight, Volume2, VolumeX, Music, Heart } from 'lucide-react';

export default function App() {
  // Estados de Navegación por Pestañas
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'discover', 'library', 'search'
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Autenticación
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);

  // Estados del Reproductor de Radio
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

  const audioRef = useRef(null);

  // Ampliamos a las 15 estaciones recomendadas por SomaFM organizadas por género
  const estaciones = [
    { id: 1, title: 'Groove Salad', genre: 'Ambient / Lounge', streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3', img: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-400', tags: 'Chill, Relax' },
    { id: 2, title: 'Underground 80s', genre: 'Synthwave / Retro', streamUrl: 'https://ice1.somafm.com/u80s-128-mp3', img: 'bg-gradient-to-tr from-blue-600 to-cyan-500', tags: 'Retro, 80s' },
    { id: 3, title: 'Indie Pop Rocks!', genre: 'Alternative Rock', streamUrl: 'https://ice1.somafm.com/indiepop-128-mp3', img: 'bg-gradient-to-tr from-rose-500 to-orange-400', tags: 'Indie, Rock' },
    { id: 4, title: 'Drone Zone', genre: 'Ambient / Drone', streamUrl: 'https://ice1.somafm.com/dronezone-128-mp3', img: 'bg-gradient-to-tr from-teal-500 to-emerald-400', tags: 'Ambient, Focus' },
    { id: 5, title: 'Heavy Metal', genre: 'Metal / Hard Rock', streamUrl: 'https://ice1.somafm.com/metal-128-mp3', img: 'bg-gradient-to-tr from-red-700 to-slate-800', tags: 'Metal, Core' },
    { id: 6, title: 'Fluid', genre: 'Hip Hop / Beats', streamUrl: 'https://ice1.somafm.com/fluid-128-mp3', img: 'bg-gradient-to-tr from-fuchsia-600 to-pink-700', tags: 'HipHop, Urban' },
    { id: 7, title: 'Space Station Soma', genre: 'Ambient / Spacemusic', streamUrl: 'https://ice1.somafm.com/spacestation-128-mp3', img: 'bg-gradient-to-tr from-indigo-900 to-indigo-400', tags: 'Ambient, SciFi' },
    { id: 8, title: 'Lush', genre: 'Sensuous Chill', streamUrl: 'https://ice1.somafm.com/lush-128-mp3', img: 'bg-gradient-to-tr from-pink-400 to-rose-600', tags: 'Vocal, Chill' },
    { id: 9, title: 'Boot Liquor', genre: 'Americana / Roots', streamUrl: 'https://ice1.somafm.com/bootliquor-128-mp3', img: 'bg-gradient-to-tr from-amber-700 to-amber-900', tags: 'Country, Folk' },
    { id: 10, title: 'Digitalis', genre: 'Alternative Electronica', streamUrl: 'https://ice1.somafm.com/digitalis-128-mp3', img: 'bg-gradient-to-tr from-cyan-700 to-blue-900', tags: 'Electronic, Indie' },
    { id: 11, title: 'Suburbs of Goa', genre: 'Desi-Beat / Eastern Chill', streamUrl: 'https://ice1.somafm.com/suburbsofgoa-128-mp3', img: 'bg-gradient-to-tr from-orange-500 to-yellow-600', tags: 'World, Chill' },
    { id: 12, title: 'Beat Blender', genre: 'Midtempo Electronica', streamUrl: 'https://ice1.somafm.com/beatblender-128-mp3', img: 'bg-gradient-to-tr from-emerald-600 to-teal-800', tags: 'House, Dance' },
    { id: 13, title: 'Def Con Radio', genre: 'Hackers Music', streamUrl: 'https://ice1.somafm.com/defcon-128-mp3', img: 'bg-gradient-to-tr from-zinc-700 to-black', tags: 'Electronic, Techno' },
    { id: 14, title: 'Secret Agent', genre: 'Lounge / Spy Soundtrack', streamUrl: 'https://ice1.somafm.com/secretagent-128-mp3', img: 'bg-gradient-to-tr from-violet-800 to-slate-900', tags: 'Cinematic, 60s' },
    { id: 15, title: 'Seven Inch Soul', genre: 'Vintage Soul', streamUrl: 'https://ice1.somafm.com/7inchsoul-128-mp3', img: 'bg-gradient-to-tr from-red-500 to-pink-600', tags: 'Soul, Funk' },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Error de streaming: ", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentStation, volume, isMuted]);

  const seleccionarEstacion = (estacion) => {
    setCurrentStation({
      id: estacion.id,
      title: estacion.title,
      genre: estacion.genre,
      streamUrl: estacion.streamUrl,
      img: estacion.img.replace('bg-gradient-to-tr ', '')
    });
    setIsPlaying(true);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (isRegistering) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage({ type: 'error', text: error.message });
      else setMessage({ type: 'success', text: '¡Registro exitoso! Revisa tu correo.' });
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

  // Filtrado de emisoras para la pestaña de búsqueda y descubrimiento
  const filteredStations = estaciones.filter(est => 
    est.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    est.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    est.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07050f] text-slate-100 font-sans antialiased pb-32 selection:bg-pink-500/30">
      
      <audio ref={audioRef} src={currentStation.streamUrl} preload="none" />

      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <header className="sticky top-0 z-40 bg-[#07050f]/80 backdrop-blur-md border-b border-purple-950/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div onClick={() => setCurrentTab('home')} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-gradient-to-r from-fuchsia-500 via-purple-600 to-pink-500 p-3 rounded-2xl shadow-xl shadow-purple-600/20 transform group-hover:scale-105 transition duration-300">
              <Radio className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              FreD
            </span>
          </div>

          {/* Menú de Navegación por pestañas */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400">
            <button 
              onClick={() => setCurrentTab('home')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${currentTab === 'home' ? 'text-white bg-slate-900/60 border-slate-800/40 shadow-inner' : 'border-transparent hover:text-white'}`}
            >
              <Radio className={`w-4 h-4 ${currentTab === 'home' ? 'text-pink-500' : ''}`} /> Home
            </button>
            <button 
              onClick={() => setCurrentTab('discover')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${currentTab === 'discover' ? 'text-white bg-slate-900/60 border-slate-800/40 shadow-inner' : 'border-transparent hover:text-white'}`}
            >
              <Compass className={`w-4 h-4 ${currentTab === 'discover' ? 'text-purple-400' : ''}`} /> Descubrir
            </button>
            <button 
              onClick={() => setCurrentTab('library')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${currentTab === 'library' ? 'text-white bg-slate-900/60 border-slate-800/40 shadow-inner' : 'border-transparent hover:text-white'}`}
            >
              <Library className={`w-4 h-4 ${currentTab === 'library' ? 'text-fuchsia-400' : ''}`} /> Biblioteca
            </button>
            <button 
              onClick={() => setCurrentTab('search')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${currentTab === 'search' ? 'text-white bg-slate-900/60 border-slate-800/40 shadow-inner' : 'border-transparent hover:text-white'}`}
            >
              <Search className={`w-4 h-4 ${currentTab === 'search' ? 'text-cyan-400' : ''}`} /> Buscar
            </button>
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

      {/* CONTENIDO INTERACTIVO SEGÚN LA PESTAÑA */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* VISTA 1: HOME */}
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Banner Destacado */}
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
                  <button onClick={() => setCurrentTab('discover')} className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:opacity-95 transition">
                    Explorar estaciones <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div onClick={() => seleccionarEstacion(estaciones[0])} className="relative w-full max-w-[340px] aspect-square rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-400 p-6 flex flex-col justify-end shadow-2xl group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition flex items-center justify-center">
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

            {/* Listado Inicial (Muestra las primeras 6 más populares) */}
            <section className="space-y-6">
              <h3 className="text-2xl font-bold tracking-tight text-white">✨ Estaciones Populares</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {estaciones.slice(0, 6).map((est) => (
                  <div key={est.id} onClick={() => seleccionarEstacion(est)} className={`bg-slate-900/40 border rounded-2xl p-4 hover:bg-slate-900/80 transition duration-300 group cursor-pointer ${currentStation.id === est.id ? 'border-pink-500/40' : 'border-slate-900'}`}>
                    <div className={`w-full aspect-square rounded-xl ${est.img} mb-4 relative p-3 flex flex-col justify-between shadow-inner`}>
                      <span className="self-start bg-black/60 backdrop-blur-md text-[10px] text-red-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">● LIVE</span>
                      <div className="w-10 h-10 bg-white text-slate-950 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 self-end shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    <h4 className="font-bold text-white text-sm truncate">{est.title}</h4>
                    <p className="text-xs text-slate-500 truncate">{est.genre}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VISTA 2: DISCOVER (Directorio Completo con las 15 Emisoras) */}
        {currentTab === 'discover' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Directorio de Estaciones</h2>
              <p className="text-slate-400 text-sm mt-1">Explora la colección completa de transmisiones en alta fidelidad.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {estaciones.map((est) => (
                <div key={est.id} onClick={() => seleccionarEstacion(est)} className={`bg-slate-900/30 border rounded-2xl p-4 hover:border-purple-500/30 hover:bg-slate-900/70 transition duration-300 group cursor-pointer ${currentStation.id === est.id ? 'border-pink-500/40' : 'border-slate-800/40'}`}>
                  <div className={`w-full aspect-square rounded-xl ${est.img} mb-4 relative p-3 flex flex-col justify-between`}>
                    <span className="self-start bg-black/70 backdrop-blur-md text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-md">128K MP3</span>
                  </div>
                  <h4 className="font-bold text-white text-sm truncate">{est.title}</h4>
                  <p className="text-xs text-slate-400 truncate mb-2">{est.genre}</p>
                  <span className="text-[10px] bg-slate-950 px-2 py-1 rounded-md text-slate-500 font-medium">{est.tags}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 3: BIBLIOTECA (Sección para favoritos de usuario) */}
        {currentTab === 'library' && (
          <div className="space-y-6 text-center py-16 bg-slate-900/20 border border-slate-900 rounded-3xl p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full flex items-center justify-center mx-auto text-fuchsia-400 shadow-xl shadow-fuchsia-500/5">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Tu Biblioteca Personal</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              {user 
                ? 'Aún no has guardado ninguna estación favorita. ¡Explora el directorio y añade las mejores transmisiones!' 
                : 'Inicia sesión con tu cuenta para guardar tus estaciones favoritas y sincronizarlas en todos tus dispositivos.'}
            </p>
            {!user && (
              <button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-purple-400 to-pink-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm mt-4 shadow-lg">
                Iniciar sesión ahora
              </button>
            )}
          </div>
        )}

        {/* VISTA 4: BUSCAR (Buscador en tiempo real con filtros dinámicos) */}
        {currentTab === 'search' && (
          <div className="space-y-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text"
                placeholder="Busca por nombre de estación, género musical o palabras clave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-base focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-2xl placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {searchQuery ? `Resultados para "${searchQuery}" (${filteredStations.length})` : 'Sugerencias para ti'}
              </h3>

              {filteredStations.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredStations.map((est) => (
                    <div key={est.id} onClick={() => seleccionarEstacion(est)} className="bg-slate-900/30 border border-slate-800/40 rounded-2xl p-4 hover:border-cyan-500/20 hover:bg-slate-900/70 transition duration-300 cursor-pointer">
                      <div className={`w-full aspect-square rounded-xl ${est.img} mb-3 flex items-center justify-center`}>
                        <Play className="w-6 h-6 text-white/40 group-hover:text-white" />
                      </div>
                      <h4 className="font-bold text-white text-sm truncate">{est.title}</h4>
                      <p className="text-xs text-slate-400 truncate">{est.genre}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No encontramos ninguna estación que coincida con tu búsqueda. ¡Prueba otro género!
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* MINI-PLAYER FIJO INTERACTIVO (ABAJO) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0c0a1a]/95 backdrop-blur-lg border-t border-purple-500/10 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${currentStation.img} flex items-center justify-center shadow-lg flex-shrink-0 relative`}>
            <Music className="w-5 h-5 text-white/70" />
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

        <div className="flex flex-col items-center gap-1 justify-center">
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-white hover:bg-slate-200 text-slate-950 flex items-center justify-center shadow-lg transform active:scale-95 transition">
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
        </div>

        <div className="flex items-center gap-3 w-1/3 justify-end">
          <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white transition">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input 
            type="range" min="0" max="1" step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
            className="w-24 accent-pink-500 bg-slate-800 h-1 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* MODAL DE AUTENTICACIÓN */}
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
                type="email" required placeholder="Correo electrónico" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0a1c] border border-slate-900 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-purple-500 transition"
              />

              <input
                type="password" required placeholder="Contraseña" value={password}
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
