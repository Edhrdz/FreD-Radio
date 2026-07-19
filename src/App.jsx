import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  Radio, Sliders, RadioTower, Disc, Users, Globe, Music2, 
  CreditCard, ShieldCheck, Check, LogIn, DollarSign, BarChart3, 
  Mic, LayoutDashboard, Play, Pause, Trash2, Upload, Calendar, Rss
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');

  // Sub-pestaña activa dentro del Panel del Locutor
  const [activeDashboardSection, setActiveDashboardSection] = useState('live');

  // Estados de Autenticación y Planes
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authEmail, setAuthEmail] = useState(''); 
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  // Formulario de Tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Estados del Reproductor de Radio Global (Barra inferior)
  const [currentStation, setCurrentStation] = useState({
    id: 101, title: 'Groove Salad', genre: 'Ambient / Lounge',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3', img: 'https://somafm.com/img3/groovesalad-400.jpg'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Formulario de Radio Nueva
  const [formTitle, setFormTitle] = useState('');
  const [formGenre, setFormGenre] = useState('');
  const [formLogo, setFormLogo] = useState('');
  const [miEstacionPropia, setMiEstacionPropia] = useState(null);

  // Estado del AutoDJ (Lista de reproducción idéntica a la captura de Zeno)
  const [autoDJPistas, setAutoDJPistas] = useState([
    { id: 1, title: 'Track 001', artist: 'Artist 01', album: 'Album Alpha', duration: '03:18', size: '4.2 MB' },
    { id: 2, title: 'Track 002', artist: 'Artist 02', album: 'Album Beta', duration: '04:35', size: '5.8 MB' },
    { id: 3, title: 'Track 003', artist: 'Artist 03', album: 'Album Gamma', duration: '02:28', size: '3.1 MB' }
  ]);
  const [nuevaPistaNombre, setNuevaPistaNombre] = useState('');

  // Datos fijos de planes
  const tablaPlanes = [
    { nombre: 'Básico', precio: '6.50', original: '12.00', estaciones: '1 estación', oyentes: 'Hasta 1,000', limitePistas: 100, color: 'border-slate-800 bg-slate-900/40 hover:border-purple-500/30', soloPrueba: true },
    { nombre: 'Estándar', precio: '14.00', original: '28.00', estaciones: '1 estación', oyentes: 'Hasta 5,000', limitePistas: 500, color: 'border-slate-800 bg-slate-900/40 hover:border-purple-500/30', soloPrueba: false },
    { nombre: 'Pro', precio: '25.00', original: '50.00', estaciones: '3 estaciones', oyentes: 'Hasta 25,000', limitePistas: 1000, color: 'border-slate-800 bg-slate-900/40 hover:border-pink-500/30', soloPrueba: false },
    { nombre: 'Premium', precio: '100.00', original: '200.00', estaciones: '5 estaciones', oyentes: 'Ilimitados', limitePistas: 1500, color: 'border-slate-800 bg-slate-900/40 hover:border-amber-500/30', soloPrueba: false }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      if (isPlaying) { audioRef.current.play().catch(() => setIsPlaying(false)); } 
      else { audioRef.current.pause(); }
    }
  }, [isPlaying, currentStation, volume, isMuted]);

  const handleCrearEstacion = (e) => {
    e.preventDefault();
    setMiEstacionPropia({
      id: Date.now(),
      title: formTitle || 'Mi Estación Industrial',
      genre: formGenre || 'Variada',
      img: formLogo || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80',
    });
  };

  const handleSubirPista = (e) => {
    e.preventDefault();
    if (!nuevaPistaNombre) return;
    setAutoDJPistas([...autoDJPistas, {
      id: Date.now(),
      title: nuevaPistaNombre,
      artist: 'Unknown',
      album: 'Nube Storage',
      duration: '03:45',
      size: '5.1 MB'
    }]);
    setNuevaPistaNombre('');
  };

  const eliminarPista = (id) => {
    setAutoDJPistas(autoDJPistas.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#06040c] text-slate-100 font-sans antialiased pb-32">
      <audio ref={audioRef} src={currentStation.streamUrl} />

      {/* HEADER GLOBAL */}
      <header className="sticky top-0 z-40 bg-[#06040c]/90 backdrop-blur-md border-b border-purple-950/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div onClick={() => setCurrentTab('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="bg-gradient-to-r from-fuchsia-500 via-purple-600 to-pink-500 p-2.5 rounded-xl shadow-lg">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">FreD</span>
          </div>
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400">
            <button onClick={() => setCurrentTab('home')} className={`px-4 py-2 rounded-xl transition ${currentTab === 'home' ? 'text-white bg-slate-900/40' : 'hover:text-white'}`}>Home</button>
            <button onClick={() => setCurrentTab('pricing')} className={`px-4 py-2 rounded-xl transition ${currentTab === 'pricing' ? 'text-white bg-slate-900/40' : 'hover:text-white'}`}>Planes y Precios</button>
            {user && hasPaymentMethod && (
              <button onClick={() => setCurrentTab('dashboard')} className={`px-4 py-2 rounded-xl border border-purple-500/30 text-purple-400 flex items-center gap-1.5 ${currentTab === 'dashboard' ? 'bg-purple-950/30 text-white' : ''}`}><Sliders className="w-3.5 h-3.5" /> Panel Locutor</button>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs bg-purple-950/40 border border-purple-500/20 px-4 py-2 rounded-full text-purple-300 font-medium">{user.email}</span>
              <button onClick={() => { setUser(null); setHasPaymentMethod(false); setMiEstacionPropia(null); setCurrentTab('home'); }} className="text-xs text-slate-400 hover:text-white px-2">Salir</button>
            </div>
          ) : (
            <button onClick={() => { setIsRegistering(true); setSelectedPlan(tablaPlanes[0]); setShowAuthModal(true); }} className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-black px-5 py-2 rounded-full text-xs tracking-wide shadow-md">Empezar Prueba Gratis</button>
          )}
        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* VISTA: HOME */}
        {currentTab === 'home' && (
          <div className="space-y-12">
            <section className="bg-gradient-to-br from-purple-950/20 via-slate-950 to-slate-950 rounded-3xl border border-purple-500/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-6">
                <span className="bg-pink-500/10 text-pink-400 text-xs font-bold px-3 py-1 rounded-full border border-pink-500/20 tracking-wider">PROBÁLO GRATIS POR 15 DÍAS</span>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-none">Crea tu radio online con <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AutoDJ Avanzado</span></h2>
                <p className="text-slate-400 text-sm leading-relaxed">Administra transmisiones en vivo, listas de reproducción inteligentes automatizadas y monetización directa desde un único panel lateral optimizado.</p>
                <button onClick={() => setCurrentTab('pricing')} className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-black px-6 py-3 rounded-full text-sm shadow-xl">Ver Planes de Streaming</button>
              </div>
            </section>
          </div>
        )}

        {/* VISTA: PLANES DE PRECIOS */}
        {currentTab === 'pricing' && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white">Elige tu Plan de Emisión Industrial</h2>
              <p className="text-slate-400 text-sm">Prueba gratis de 15 días disponible de manera exclusiva para el Plan Básico.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tablaPlanes.map((plan, idx) => (
                <div key={idx} className={`border rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 ${plan.color}`}>
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white tracking-wide">{plan.nombre}</h4>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-black text-white">${plan.precio}</span>
                      <span className="text-xs text-slate-500">/ mes</span>
                    </div>
                    <ul className="text-xs space-y-2.5 text-slate-300 border-t border-slate-900/80 pt-4">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> {plan.estaciones}</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> {plan.oyentes} simultáneos</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> <strong>{plan.limitePistas} pistas</strong> AutoDJ</li>
                    </ul>
                  </div>
                  <button onClick={() => { setSelectedPlan(plan); setIsRegistering(true); setShowAuthModal(true); }} className={`w-full font-black py-3 rounded-xl text-xs uppercase tracking-wider transition ${plan.soloPrueba ? 'bg-white text-slate-950 hover:bg-slate-200' : 'bg-slate-900 text-white border border-slate-800 hover:border-purple-500/40'}`}>
                    {plan.soloPrueba ? 'Prueba Gratis 15 días' : `Adquirir ${plan.nombre}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA: PANEL DE LOCUTOR COMPLETO CON MENÚ LATERAL IZQUIERDO */}
        {currentTab === 'dashboard' && user && hasPaymentMethod && (
          <div className="space-y-6">
            
            {/* Encabezado del Dashboard */}
            <div className="border-b border-slate-900 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-purple-400" /> Consola de Control Zeno Tools</h2>
                <p className="text-xs text-slate-400">Gestiona tu estación, automatizaciones de AutoDJ y analíticas geográficas.</p>
              </div>
            </div>

            {!miEstacionPropia ? (
              <div className="bg-[#0b0818] border border-purple-950/50 rounded-2xl p-6 max-w-xl mx-auto space-y-4">
                <h3 className="font-bold text-white text-sm">Configura tu Estación por primera vez</h3>
                <form onSubmit={handleCrearEstacion} className="space-y-4">
                  <input type="text" required placeholder="Nombre de tu Radio" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
                  <input type="text" required placeholder="Género Musical (ej. Techno, Pop)" value={formGenre} onChange={(e) => setFormGenre(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
                  <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-xs uppercase">Inicializar Servidor</button>
                </form>
              </div>
            ) : (
              
              /* CONTENEDOR SPLIT: MENÚ LATERAL + ÁREA DE CONTENIDO */
              <div className="flex flex-col md:flex-row gap-6 items-start">
                
                {/* MENÚ LATERAL IZQUIERDO (SIDEBAR al estilo Zeno Tools) */}
                <aside className="w-full md:w-64 bg-[#0a0716] border border-slate-900 rounded-2xl p-3 flex flex-col gap-1 shrink-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2">Módulos de Radio</span>
                  
                  <button onClick={() => setActiveDashboardSection('live')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${activeDashboardSection === 'live' ? 'bg-purple-950/40 text-purple-400 border border-purple-500/20' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                    <RadioTower className="w-4 h-4" /> Transmisión en Vivo
                  </button>

                  <button onClick={() => setActiveDashboardSection('autodj')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${activeDashboardSection === 'autodj' ? 'bg-purple-950/40 text-pink-400 border border-pink-500/20' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                    <Disc className="w-4 h-4" /> Auto-DJ Storage
                  </button>

                  <button onClick={() => setActiveDashboardSection('analytics')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${activeDashboardSection === 'analytics' ? 'bg-purple-950/40 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                    <BarChart3 className="w-4 h-4" /> Analíticas e Historial
                  </button>

                  <button onClick={() => setActiveDashboardSection('monetization')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${activeDashboardSection === 'monetization' ? 'bg-purple-950/40 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                    <DollarSign className="w-4 h-4" /> Monetización Audio
                  </button>

                  <button onClick={() => setActiveDashboardSection('podcast')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${activeDashboardSection === 'podcast' ? 'bg-purple-950/40 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                    <Mic className="w-4 h-4" /> Graba tus Podcasts
                  </button>
                </aside>

                {/* CONTENIDO DE LA SECCIÓN ACTIVA (Se desplaza dinámicamente) */}
                <div className="flex-1 w-full bg-[#070512] border border-slate-900 rounded-2xl p-6 min-h-[460px]">
                  
                  {/* SECCIÓN SIDEBAR: TRANSMISIÓN EN VIVO */}
                  {activeDashboardSection === 'live' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-bold text-white">Transmisión en Vivo</h3>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">SERVIDOR ONLINE</span>
                      </div>
                      <p className="text-xs text-slate-400">Usa estos parámetros en tu software de transmisión favorito (OBS, Butt o Mixxx) para conectarte a la antena.</p>
                      
                      <div className="bg-[#0c091c] border border-slate-900 rounded-xl p-4 space-y-3 font-mono text-xs">
                        <div className="flex justify-between border-b border-slate-900 pb-2">
                          <span className="text-slate-500">Servidor / URL:</span>
                          <span className="text-slate-300">str.fredstreaming.com:8000</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-2">
                          <span className="text-slate-500">Mountpoint / Clave:</span>
                          <span className="text-slate-300">/live_stream_{miEstacionPropia.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Contraseña de Emisión:</span>
                          <span className="text-purple-400 font-bold">fred_secret_pass_2026</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECCIÓN SIDEBAR: AUTO-DJ (Maqueta idéntica a la tabla de Zeno Tools) */}
                  {activeDashboardSection === 'autodj' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-bold text-white">Playlist del Auto-DJ</h3>
                          <p className="text-xs text-slate-500">Estas canciones sonarán en bucle continuo de forma automática al desconectarte.</p>
                        </div>
                        <span className="text-xs text-purple-400 bg-purple-950/30 px-3 py-1.5 rounded-xl border border-purple-500/20 font-medium">Límite del Plan: {autoDJPistas.length} / {selectedPlan?.limitePistas || 100}</span>
                      </div>

                      {/* Botón de Carga al Estilo Zeno */}
                      <form onSubmit={handleSubirPista} className="flex gap-2 bg-[#0c091c] p-3 rounded-xl border border-slate-900">
                        <input type="text" required placeholder="Nombre de la pista o canción a subir" value={nuevaPistaNombre} onChange={(e) => setNuevaPistaNombre(e.target.value)} className="bg-[#120f26] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white flex-1 focus:outline-none" />
                        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Upload</button>
                      </form>

                      {/* Tabla del Repositorio de Pistas */}
                      <div className="border border-slate-900 rounded-xl overflow-hidden text-xs">
                        <div className="grid grid-cols-12 bg-[#0c091c] p-3 border-b border-slate-900 text-slate-400 font-bold">
                          <div className="col-span-5">Título de la pista</div>
                          <div className="col-span-3">Artista</div>
                          <div className="col-span-2">Duración</div>
                          <div className="col-span-2 text-right">Acciones</div>
                        </div>
                        <div className="divide-y divide-slate-900">
                          {autoDJPistas.map((pista) => (
                            <div key={pista.id} className="grid grid-cols-12 p-3 items-center hover:bg-slate-900/30 transition">
                              <div className="col-span-5 flex items-center gap-2 font-medium text-slate-200">
                                <Play className="w-3 h-3 text-slate-500" /> {pista.title}
                              </div>
                              <div className="col-span-3 text-slate-400 truncate">{pista.artist}</div>
                              <div className="col-span-2 text-slate-400 font-mono">{pista.duration}</div>
                              <div className="col-span-2 text-right">
                                <button onClick={() => eliminarPista(pista.id)} className="p-1.5 rounded bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500/20 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECCIÓN SIDEBAR: ANALÍTICAS */}
                  {activeDashboardSection === 'analytics' && (
                    <div className="space-y-6">
                      <h3 className="text-base font-bold text-white">Estadísticas y Analíticas Geográficas</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#0c091c] border border-slate-900 p-4 rounded-xl"><span className="text-[10px] text-slate-500 uppercase font-bold">Total Listeners</span><p className="text-2xl font-black text-cyan-400 mt-1">2,983</p></div>
                        <div className="bg-[#0c091c] border border-slate-900 p-4 rounded-xl"><span className="text-[10px] text-slate-500 uppercase font-bold">Países Conectados</span><p className="text-2xl font-black text-white mt-1">32</p></div>
                        <div className="bg-[#0c091c] border border-slate-900 p-4 rounded-xl"><span className="text-[10px] text-slate-500 uppercase font-bold">Horas Escuchadas</span><p className="text-2xl font-black text-purple-400 mt-1">1.22 M</p></div>
                      </div>

                      {/* Lista de Países Idéntica al Mapa de Zeno */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400">Top Oyentes por Región</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-[#0c091c]/50 p-2.5 rounded-lg border border-slate-900 flex justify-between"><span>🇲🇽 México</span><span className="font-mono text-cyan-400 font-bold">1,909 Users</span></div>
                          <div className="bg-[#0c091c]/50 p-2.5 rounded-lg border border-slate-900 flex justify-between"><span>🇺🇸 United States</span><span className="font-mono text-cyan-400 font-bold">707 Users</span></div>
                          <div className="bg-[#0c091c]/50 p-2.5 rounded-lg border border-slate-900 flex justify-between"><span>🇬🇹 Guatemala</span><span className="font-mono text-cyan-400 font-bold">70 Users</span></div>
                          <div className="bg-[#0c091c]/50 p-2.5 rounded-lg border border-slate-900 flex justify-between"><span>🇳🇮 Nicaragua</span><span className="font-mono text-cyan-400 font-bold">44 Users</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECCIÓN SIDEBAR: MONETIZACIÓN */}
                  {activeDashboardSection === 'monetization' && (
                    <div className="space-y-6">
                      <h3 className="text-base font-bold text-white">Monetización por Audio Ads</h3>
                      <p className="text-xs text-slate-400">Los anuncios se inyectan en tu señal automáticamente cada 30 minutos a través del reproductor de tus oyentes.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#0c091c] border border-slate-900 p-4 rounded-xl">
                          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Total Revenue Acumulado</span>
                          <p className="text-3xl font-black text-white mt-1">$3,488.00</p>
                        </div>
                        <div className="bg-[#0c091c] border border-slate-900 p-4 rounded-xl">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Impresiones de Anuncio</span>
                          <p className="text-2xl font-mono text-slate-300 mt-1">3,100,369</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECCIÓN SIDEBAR: GRABACIÓN / PODCAST */}
                  {activeDashboardSection === 'podcast' && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">Grabación Automática de Programas</h3>
                      <p className="text-xs text-slate-400">Tu señal se procesará automáticamente para crear un feed de podcast listo para ser subido a Spotify o Apple Podcasts.</p>
                      
                      <div className="bg-[#0c091c] border border-slate-900 p-4 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-400"><Rss className="w-4 h-4" /> RSS Feed URL Generado</div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 font-mono text-[11px] text-slate-300 truncate select-all">
                          https://podcast.fredstreaming.com/feed/station_{miEstacionPropia.id}
                        </div>
                        <p className="text-[11px] text-slate-500">Copia este enlace en cualquier agregador de directorios de podcast para distribuir tu señal grabada.</p>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* MINI REPRODUCTOR INFERIOR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0814]/95 border-t border-purple-500/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/3">
          <img src={currentStation.img} alt="" className="w-10 h-10 rounded-lg object-cover shadow" />
          <div className="truncate"><h5 className="font-bold text-xs text-white truncate">{currentStation.title}</h5><p className="text-[11px] text-slate-400 truncate">{currentStation.genre}</p></div>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md">
          {isPlaying ? <Pause className="w-4 h-4 text-slate-950" /> : <Play className="w-4 h-4 text-slate-950 fill-slate-950" />}
        </button>
        <div className="w-1/3 flex justify-end items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Vol</span>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-16 accent-pink-500 h-1 bg-slate-800 rounded" />
        </div>
      </div>

      {/* MODAL DE AUTENTICACIÓN / PASARELA DE PAGO */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090714] border border-purple-950/40 rounded-2xl p-6 relative space-y-6">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
            
            <div className="text-center space-y-1">
              <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase">
                {isRegistering ? `Plan: ${selectedPlan?.nombre}` : 'Acceso de Emisores'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {isRegistering ? (selectedPlan?.soloPrueba ? 'Comienza tus 15 días gratis' : 'Configura tu suscripción') : 'Ingresa a tu Consola'}
              </h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setUser({ email: authEmail }); setHasPaymentMethod(true); setShowAuthModal(false); setCurrentTab('dashboard'); }} className="space-y-4">
              <input type="email" required placeholder="Tu correo electrónico" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-[#0d0a1c] border border-slate-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
              
              {isRegistering && (
                <div className="bg-[#0e0b20] border border-purple-900/20 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-pink-500" /> Validación de Tarjeta</span>
                  <input type="text" required placeholder="0000 0000 0000 0000" maxLength="16" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full bg-[#130f2b] border border-slate-900 rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" required placeholder="MM/AA" maxLength="5" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="bg-[#130f2b] border border-slate-900 rounded-lg py-2 px-3 text-xs text-white font-mono text-center" />
                    <input type="password" required placeholder="CVC" maxLength="3" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} className="bg-[#130f2b] border border-slate-900 rounded-lg py-2 px-3 text-xs text-white font-mono text-center" />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase shadow-lg flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> {isRegistering ? (selectedPlan?.soloPrueba ? 'Activar Prueba Gratuita' : 'Confirmar Registro') : 'Entrar al Panel'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
