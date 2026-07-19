import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Radio, Compass, Library, Search, LogIn, CheckCircle, Play, Pause, ArrowRight, Volume2, VolumeX, Music, Heart, Sparkles, Sliders, PlusCircle, RadioTower, Key, Disc } from 'lucide-react';

export default function App() {
  // Estados de Navegación por Pestañas
  const [currentTab, setCurrentTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Autenticación
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // Estados del Reproductor de Radio
  const [currentStation, setCurrentStation] = useState({
    id: 101,
    title: 'Groove Salad',
    genre: 'Ambient / Lounge',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    img: 'https://somafm.com/img3/groovesalad-400.jpg'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  // Estados del Formulario de Registro de Estación Nueva
  const [formTitle, setFormTitle] = useState('');
  const [formGenre, setFormGenre] = useState('');
  const [formLogo, setFormLogo] = useState('');
  const [formStream, setFormStream] = useState('');
  const [formTags, setFormTags] = useState('');

  // BASE DE DATOS DE ESTACIONES REALS CON SUS LOGOS OFICIALES
  const estacionesSugeridas = [
    { id: 101, title: 'Groove Salad', genre: 'Ambient / Lounge', streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3', img: 'https://somafm.com/img3/groovesalad-400.jpg', tags: 'Chill, Relax', isCustom: false },
    { id: 102, title: 'Underground 80s', genre: 'Synthwave / Retro', streamUrl: 'https://ice1.somafm.com/u80s-128-mp3', img: 'https://somafm.com/logos/256/u80s256.png', tags: 'Retro, 80s', isCustom: false },
    { id: 103, title: 'Indie Pop Rocks!', genre: 'Alternative Rock', streamUrl: 'https://ice1.somafm.com/indiepop-128-mp3', img: 'https://somafm.com/logos/256/indiepop256.png', tags: 'Indie, Rock', isCustom: false },
    { id: 104, title: 'Drone Zone', genre: 'Ambient / Drone', streamUrl: 'https://ice1.somafm.com/dronezone-128-mp3', img: 'https://somafm.com/img/dronezone120.jpg', tags: 'Ambient, Focus', isCustom: false },
    { id: 105, title: 'DEF CON Radio', genre: 'Hackers Music / Techno', streamUrl: 'https://ice1.somafm.com/defcon-128-mp3', img: 'https://somafm.com/logos/256/defcon256.png', tags: 'Electronic, Techno', isCustom: false },
    { id: 106, title: 'Fluid', genre: 'Hip Hop / Beats', streamUrl: 'https://ice1.somafm.com/fluid-128-mp3', img: 'https://somafm.com/logos/256/fluid256.png', tags: 'HipHop, Urban', isCustom: false },
    { id: 107, title: 'Lush', genre: 'Sensuous Chill', streamUrl: 'https://ice1.somafm.com/lush-128-mp3', img: 'https://somafm.com/logos/256/lush256.png', tags: 'Vocal, Chill', isCustom: false },
    { id: 108, title: 'Secret Agent', genre: 'Lounge / Spy', streamUrl: 'https://ice1.somafm.com/secretagent-128-mp3', img: 'https://somafm.com/logos/256/secretagent256.png', tags: 'Cinematic, 60s', isCustom: false },
  ];

  // RADIOS CREADAS POR LOS USUARIOS DE LA COMUNIDAD (Empieza con un par de muestra)
  const [estacionesComunidad, setEstacionesComunidad] = useState([
    { id: 1, title: 'Mi Radio Urbana', genre: 'Reggaeton / Trap', streamUrl: 'https://ice1.somafm.com/fluid-128-mp3', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80', tags: 'Comunidad, Urban', userCreator: 'Carlos_DJ', isCustom: true },
    { id: 2, title: 'Rock Local FreD', genre: 'Rock en Español', streamUrl: 'https://ice1.somafm.com/indiepop-128-mp3', img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80', tags: 'Comunidad, Rock', userCreator: 'FreD_Master', isCustom: true },
  ]);

  // Objeto que almacena la estación que el usuario logueado ha creado (null si no tiene una)
  const [miEstacionPropia, setMiEstacionPropia] = useState(null);

  // UNIÓN DE AMBAS: Las de la comunidad van primero en la fila siempre
  const todasLasEstaciones = [...estacionesComunidad, ...estacionesSugeridas];

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

  // Manejar creación de la estación desde el formulario
  const handleCrearEstacion = (e) => {
    e.preventDefault();
    
    const nuevaRadio = {
      id: Date.now(), // ID temporal único
      title: formTitle || 'Mi Estación de Radio',
      genre: formGenre || 'Varios / Música',
      streamUrl: formStream || 'https://ice1.somafm.com/groovesalad-128-mp3', // default si está vacío
      img: formLogo || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80',
      tags: formTags || 'En Vivo, Web',
      userCreator: user ? user.email.split('@')[0] : 'Locutor Anonimo',
      isCustom: true
    };

    // Añadir a la lista comunitaria global (Prioridad Máxima)
    setEstacionesComunidad([nuevaRadio, ...estacionesComunidad]);
    // Asignar como la estación propia del locutor actual
    setMiEstacionPropia(nuevaRadio);
  };

  const seleccionarEstacion = (est) => {
    setCurrentStation({
      id: est.id,
      title: est.title,
      genre: est.genre,
      streamUrl: est.streamUrl,
      img: est.img
    });
    setIsPlaying(true);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegistering) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert('¡Registro simulado / exitoso!');
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message);
      } else {
        setUser(data.user);
        setShowAuthModal(false);
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMiEstacionPropia(null);
    setCurrentTab('home');
  };

  const filteredStations = todasLasEstaciones.filter(est => 
    est.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    est.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#06040c] text-slate-100 font-sans antialiased pb-32 selection:bg-pink-500/30">
      
      <audio ref={audioRef} src={currentStation.streamUrl} preload="none" />

      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <header className="sticky top-0 z-40 bg-[#06040c]/80 backdrop-blur-md border-b border-purple-950/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div onClick={() => setCurrentTab('home')} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-gradient-to-r from-fuchsia-500 via-purple-600 to-pink-500 p-3 rounded-2xl shadow-xl shadow-purple-600/20 transform group-hover:scale-105 transition duration-300">
              <Radio className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              FreD
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400">
            <button onClick={() => setCurrentTab('home')} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${currentTab === 'home' ? 'text-white bg-slate-900/40 border-slate-800/40' : 'border-transparent hover:text-white'}`}><Radio className="w-4 h-4 text-pink-500" /> Home</button>
            <button onClick={() => setCurrentTab('discover')} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${currentTab === 'discover' ? 'text-white bg-slate-900/40 border-slate-800/40' : 'border-transparent hover:text-white'}`}><Compass className="w-4 h-4 text-purple-400" /> Descubrir</button>
            <button onClick={() => setCurrentTab('search')} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${currentTab === 'search' ? 'text-white bg-slate-900/40 border-slate-800/40' : 'border-transparent hover:text-white'}`}><Search className="w-4 h-4 text-cyan-400" /> Buscar</button>
            
            {/* PESTAÑA EXCLUSIVA SI EL USUARIO INICIÓ SESIÓN */}
            {user && (
              <button onClick={() => setCurrentTab('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${currentTab === 'dashboard' ? 'text-white bg-purple-500/20 border-purple-500/40' : 'border-purple-950/40 hover:text-purple-300 text-purple-400 font-semibold'}`}><Sliders className="w-4 h-4 text-fuchsia-500 animate-pulse" /> Panel Locutor</button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs bg-purple-950/40 border border-purple-500/30 px-4 py-2 rounded-full text-purple-300 font-medium">{user.email}</span>
              <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-red-400 font-medium transition">Salir</button>
            </div>
          ) : (
            <button onClick={() => { setIsRegistering(false); setShowAuthModal(true); }} className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-bold px-6 py-2 rounded-full shadow-lg text-sm">Iniciar sesión</button>
          )}
        </div>
      </header>

      {/* CUERPO CENTRAL DE LA APLICACIÓN */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* VISTA: HOME */}
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Banner Informativo */}
            <section className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-fuchsia-950/10 to-slate-950 rounded-3xl border border-purple-500/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
              <div className="max-w-xl space-y-6 z-10">
                <span className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-400 text-xs font-bold px-3 py-1 rounded-full border border-pink-500/20 uppercase tracking-widest animate-pulse">
                  ● PLATAFORMA ABIERTA
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
                  La radio del mundo, <br /><span className="bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">en tus manos</span>
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  Escucha las estaciones oficiales o sintoniza los canales independientes creados directamente por nuestra comunidad registrada. ¡Inicia sesión para registrar tu propia estación!
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setCurrentTab('discover')} className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition">
                    Explorar estaciones <ArrowRight className="w-4 h-4" />
                  </button>
                  {user && !miEstacionPropia && (
                    <button onClick={() => setCurrentTab('dashboard')} className="bg-slate-900 border border-slate-800 text-purple-400 font-bold px-6 py-3 rounded-full flex items-center gap-2 transition hover:bg-slate-800">
                      Emitir En Vivo <RadioTower className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tarjeta Destacada */}
              <div onClick={() => seleccionarEstacion(estacionesSugeridas[0])} className="relative w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden shadow-2xl group cursor-pointer border border-white/5">
                <img src={estacionesSugeridas[0].img} alt="Cover" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6">
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300">Sugerencia Estelar</span>
                    <h3 className="text-xl font-bold text-white">{estacionesSugeridas[0].title}</h3>
                    <p className="text-xs text-slate-300">{estacionesSugeridas[0].genre}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN PRIORITARIA: EMISORAS DE NUESTRA COMUNIDAD */}
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-2xl font-bold tracking-tight text-white">Estaciones de la Comunidad FreD</h3>
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-semibold">Prioridad Alta</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {estacionesComunidad.map((est) => (
                  <div key={est.id} onClick={() => seleccionarEstacion(est)} className={`bg-slate-900/30 border rounded-2xl p-4 hover:bg-slate-900/60 transition duration-300 group cursor-pointer ${currentStation.id === est.id ? 'border-pink-500/40' : 'border-slate-900/50'}`}>
                    <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 relative shadow-md">
                      <img src={est.img} alt={est.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> ONLINE
                      </div>
                    </div>
                    <h4 className="font-bold text-white text-sm truncate">{est.title}</h4>
                    <p className="text-xs text-pink-400 truncate">Por: {est.userCreator}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{est.genre}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VISTA: DISCOVER (Directorio Completo Ordenado por Prioridad) */}
        {currentTab === 'discover' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Directorio de Estaciones</h2>
              <p className="text-slate-400 text-sm mt-1">Explora la colección completa. Las estaciones de usuarios registrados se posicionan arriba.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {todasLasEstaciones.map((est) => (
                <div key={est.id} onClick={() => seleccionarEstacion(est)} className={`bg-[#0d0a1c]/60 border rounded-2xl p-4 hover:border-purple-500/30 hover:bg-slate-900/40 transition duration-300 group cursor-pointer ${currentStation.id === est.id ? 'border-pink-500/40 bg-purple-950/10' : 'border-slate-900'}`}>
                  <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 relative shadow-inner">
                    <img src={est.img} alt={est.title} className="w-full h-full object-cover" />
                    <div className={`absolute top-3 left-3 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md ${est.isCustom ? 'bg-amber-400' : 'bg-cyan-400'}`}>
                      {est.isCustom ? 'USER RADIO' : '128K MP3'}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-emerald-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-md">
                      ONLINE
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-sm truncate">{est.title}</h4>
                  <p className="text-xs text-slate-400 truncate mb-1">{est.genre}</p>
                  <span className="text-[10px] bg-slate-950/80 px-2 py-1 rounded-md text-slate-500 font-medium">{est.tags}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA NUEVA: DASHBOARD DEL LOCUTOR */}
        {currentTab === 'dashboard' && user && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <RadioTower className="w-8 h-8 text-purple-400" /> Panel de Control de Emisión
              </h2>
              <p className="text-slate-400 text-sm mt-1">Configura tu estación de radio y obtén tus credenciales para transmitir en vivo.</p>
            </div>

            {/* CASO A: EL USUARIO NO TIENE UNA RADIO REGISTRADA TODAVÍA -> MUESTRA EL FORMULARIO */}
            {!miEstacionPropia ? (
              <div className="bg-[#0b0818] border border-purple-950/50 rounded-3xl p-8 shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                  <PlusCircle className="w-6 h-6 text-pink-500" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Registrar Mi Nueva Estación</h3>
                    <p className="text-xs text-slate-400">Rellena los detalles para dar de alta tu señal en el directorio principal.</p>
                  </div>
                </div>

                <form onSubmit={handleCrearEstacion} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nombre de la Radio *</label>
                    <input type="text" required placeholder="Ej: Mi Radio Online" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-pink-500" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Género Musical / Categoría *</label>
                    <input type="text" required placeholder="Ej: Tech House / Techno o Variada" value={formGenre} onChange={(e) => setFormGenre(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-pink-500" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">URL del Logo / Arte (Imagen Web)</label>
                    <input type="url" placeholder="Ej: https://images.unsplash.com/..." value={formLogo} onChange={(e) => setFormLogo(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-pink-500" />
                    <p className="text-[11px] text-slate-500">Puedes dejarlo en blanco para usar una imagen por defecto de FreD.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Etiquetas (Separadas por coma)</label>
                    <input type="text" placeholder="Ej: En vivo, Electro, Non-stop" value={formTags} onChange={(e) => setFormTags(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-pink-500" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">URL de Transmisión de Audio (Direct Stream Link)</label>
                    <input type="url" placeholder="Ej: https://tu-servidor-icecast.com/live" value={formStream} onChange={(e) => setFormStream(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-pink-500" />
                    <p className="text-[11px] text-purple-400/80">Si aún no tienes servidor, déjalo vacío y el sistema te asignará una señal demo para que pruebes el reproductor de inmediato.</p>
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button type="submit" className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-black py-4 rounded-xl shadow-xl hover:opacity-90 transition uppercase tracking-wider text-sm">
                      Activar y Registrar Mi Estación
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* CASO B: EL LOCUTOR YA REGISTRÓ SU RADIO -> MUESTRA LAS CREDENCIALES Y DATOS DE EMISIÓN */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Bloque Izquierdo: Estado de la señal en tiempo real */}
                <div className="bg-[#0b0818] border border-purple-950/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-md">
                    <img src={miEstacionPropia.img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Disc className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest mb-1">
                      ● EMISIÓN ACTIVA
                    </span>
                    <h3 className="text-xl font-bold text-white truncate max-w-[200px]">{miEstacionPropia.title}</h3>
                    <p className="text-xs text-purple-400">{miEstacionPropia.genre}</p>
                  </div>
                  <button onClick={() => seleccionarEstacion(miEstacionPropia)} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold py-2 px-4 rounded-xl text-xs w-full transition flex items-center justify-center gap-2">
                    <Play className="w-3 h-3 fill-current" /> Probar Oír en Mi Web
                  </button>
                </div>

                {/* Bloque Derecho: Servidores y Token para pegar en OBS / BUTT */}
                <div className="md:col-span-2 bg-[#0b0818] border border-purple-950/50 rounded-2xl p-6 space-y-6">
                  <div>
                    <h4 className="font-bold text-white text-lg">Parámetros de Conexión de Audio</h4>
                    <p className="text-xs text-slate-400">Introduce estos datos en tu codificador de streaming favorito (OBS Studio, BUTT, Mixxx) para mandar tu audio directo a la plataforma.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-[#120f26] border border-slate-900 rounded-xl p-4 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><RadioTower className="w-3 h-3 text-cyan-400" /> Servidor de Audio (Icecast URL)</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded">Recomendado</span>
                      </div>
                      <p className="text-sm font-mono text-slate-200 select-all break-all">icecast.fredradio.com:8000/live</p>
                    </div>

                    <div className="bg-[#120f26] border border-slate-900 rounded-xl p-4 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Key className="w-3 h-3 text-pink-400" /> Clave de Transmisión / Mountpoint Password</span>
                        <span className="text-[10px] text-purple-400 font-semibold">Privado</span>
                      </div>
                      <p className="text-sm font-mono text-pink-400 select-all">fred_stream_pass_{miEstacionPropia.id}</p>
                    </div>
                  </div>

                  <div className="bg-purple-950/20 border border-purple-500/10 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
                    <strong>¡Tu radio ya está en el aire de FreD-Radio!</strong> Cualquier visitante que entre a la pestaña <em>Home</em> o <em>Descubrir</em> verá tu radio en la sección prioritaria de la comunidad de manera instantánea.
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* VISTA: SEARCH */}
        {currentTab === 'search' && (
          <div className="space-y-8">
            <input type="text" placeholder="Busca por nombre de estación o género..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full max-w-2xl mx-auto block bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-base focus:outline-none focus:border-cyan-500 transition" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {filteredStations.map((est) => (
                <div key={est.id} onClick={() => seleccionarEstacion(est)} className="bg-slate-900/30 border border-slate-800 rounded-2xl p-4 cursor-pointer">
                  <img src={est.img} alt="" className="w-full aspect-square rounded-xl object-cover mb-3" />
                  <h4 className="font-bold text-white text-sm truncate">{est.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{est.genre}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MINI-PLAYER FIJO INTERACTIVO (ABAJO) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0814]/95 backdrop-blur-lg border-t border-purple-500/10 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
          <img src={currentStation.img} alt="" className="w-12 h-12 rounded-xl object-cover shadow-lg flex-shrink-0" />
          <div className="truncate">
            <h5 className="font-bold text-sm text-white truncate">{currentStation.title}</h5>
            <p className="text-xs text-slate-400 truncate">{currentStation.genre}</p>
          </div>
        </div>

        <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-lg transform active:scale-95 transition">
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div className="flex items-center gap-3 w-1/3 justify-end">
          <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white transition">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }} className="w-24 accent-pink-500 bg-slate-800 h-1 rounded-lg cursor-pointer" />
        </div>
      </div>

      {/* MODAL DE AUTENTICACIÓN */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090714] border border-purple-950/40 rounded-2xl p-8 relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white font-bold text-lg">✕</button>
            <h3 className="text-2xl font-bold text-white text-center mb-6">Bienvenidos a FreD-Radio</h3>
            <form onSubmit={handleAuth} className="space-y-4">
              <input type="email" required placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0d0a1c] border border-slate-900 rounded-xl py-3 px-4 text-sm text-white focus:outline-none" />
              <input type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0d0a1c] border border-slate-900 rounded-xl py-3 px-4 text-sm text-white focus:outline-none" />
              <button type="submit" className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-bold py-3 rounded-xl shadow-lg text-sm">{isRegistering ? 'Regístrate' : 'Iniciar sesión'}</button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-pink-400 font-semibold block text-center mt-4 mx-auto hover:underline">{isRegistering ? 'Inicia sesión' : 'Regístrate aquí'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
