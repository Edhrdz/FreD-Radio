import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Radio, Compass, Search, Sliders, PlusCircle, RadioTower, Key, Disc, Users, Globe, Music2, FolderPlus, CreditCard, ShieldCheck, Check, Sparkles, LogIn, DollarSign, BarChart3, Mic } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');

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

  // Estados del Reproductor de Radio
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

  // Simulación de AutoDJ (Pistas del usuario)
  const [autoDJPistas, setAutoDJPistas] = useState([
    { id: 1, name: 'chill_backbone_beat.mp3', size: '4.2 MB' },
    { id: 2, name: 'synthwave_sunset_drive.mp3', size: '5.8 MB' }
  ]);
  const [nuevaPistaNombre, setNuevaPistaNombre] = useState('');

  // Datos fijos de estaciones sugeridas
  const estacionesSugeridas = [
    { id: 101, title: 'Groove Salad', genre: 'Ambient / Lounge', streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3', img: 'https://somafm.com/img3/groovesalad-400.jpg', tags: 'Chill, Relax', isCustom: false },
    { id: 102, title: 'Underground 80s', genre: 'Synthwave / Retro', streamUrl: 'https://ice1.somafm.com/u80s-128-mp3', img: 'https://somafm.com/logos/256/u80s256.png', tags: 'Retro, 80s', isCustom: false },
    { id: 103, title: 'Indie Pop Rocks!', genre: 'Alternative Rock', streamUrl: 'https://ice1.somafm.com/indiepop-128-mp3', img: 'https://somafm.com/logos/256/indiepop256.png', tags: 'Indie, Rock', isCustom: false },
    { id: 104, title: 'Drone Zone', genre: 'Ambient / Drone', streamUrl: 'https://ice1.somafm.com/dronezone-128-mp3', img: 'https://somafm.com/img/dronezone120.jpg', tags: 'Ambient, Focus', isCustom: false }
  ];

  const [estacionesComunidad, setEstacionesComunidad] = useState([
    { id: 1, title: 'Mi Radio Urbana', genre: 'Reggaeton / Trap', streamUrl: 'https://ice1.somafm.com/fluid-128-mp3', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80', tags: 'Comunidad, Urban', userCreator: 'Carlos_DJ', isCustom: true }
  ]);

  const [miEstacionPropia, setMiEstacionPropia] = useState(null);
  const todasLasEstaciones = [...estacionesComunidad, ...estacionesSugeridas];

  // Estructura de Planes de Precios Corregida (Módulos de Zeno Tools añadidos)
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
    const nuevaRadio = {
      id: Date.now(),
      title: formTitle || 'FreD Radio Station',
      genre: formGenre || 'Variada',
      streamUrl: 'https://ice1.somafm.com/u80s-128-mp3',
      img: formLogo || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80',
      tags: 'En Vivo, AutoDJ',
      userCreator: user ? user.email.split('@')[0] : 'Locutor',
      isCustom: true
    };
    setEstacionesComunidad([nuevaRadio, ...estacionesComunidad]);
    setMiEstacionPropia(nuevaRadio);
  };

  const handleSubirPista = (e) => {
    e.preventDefault();
    if (!nuevaPistaNombre) return;
    if (autoDJPistas.length >= (selectedPlan?.limitePistas || 100)) {
      alert("Has alcanzado el límite de pistas de tu plan.");
      return;
    }
    setAutoDJPistas([...autoDJPistas, { id: Date.now(), name: nuevaPistaNombre.endsWith('.mp3') ? nuevaPistaNombre : `${nuevaPistaNombre}.mp3`, size: '5.1 MB' }]);
    setNuevaPistaNombre('');
  };

  const procesarPagoTarjeta = (e) => {
    e.preventDefault();
    if (authEmail && cardNumber && cardExpiry && cardCvc) {
      setUser({ email: authEmail });
      setHasPaymentMethod(true);
      setShowAuthModal(false);
      setCurrentTab('dashboard');
    }
  };

  const ejecutarLoginDirecto = (e) => {
    e.preventDefault();
    if (authEmail) {
      setUser({ email: authEmail });
      setHasPaymentMethod(true);
      setShowAuthModal(false);
      setCurrentTab('dashboard');
    }
  };

  const seleccionarEstacion = (est) => {
    setCurrentStation({ id: est.id, title: est.title, genre: est.genre, streamUrl: est.streamUrl, img: est.img });
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-[#06040c] text-slate-100 font-sans antialiased pb-32">
      <audio ref={audioRef} src={currentStation.streamUrl} />

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#06040c]/80 backdrop-blur-md border-b border-purple-950/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div onClick={() => setCurrentTab('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="bg-gradient-to-r from-fuchsia-500 via-purple-600 to-pink-500 p-2.5 rounded-xl shadow-lg">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">FreD</span>
          </div>
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400">
            <button onClick={() => setCurrentTab('home')} className={`px-4 py-2 rounded-xl transition ${currentTab === 'home' ? 'text-white bg-slate-900/40' : 'hover:text-white'}`}>Home</button>
            <button onClick={() => setCurrentTab('discover')} className={`px-4 py-2 rounded-xl transition ${currentTab === 'discover' ? 'text-white bg-slate-900/40' : 'hover:text-white'}`}>Descubrir</button>
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
            <>
              <button onClick={() => { setIsRegistering(false); setSelectedPlan(tablaPlanes[0]); setShowAuthModal(true); }} className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-xl flex items-center gap-1.5"><LogIn className="w-4 h-4" /> Iniciar Sesión</button>
              <button onClick={() => { setIsRegistering(true); setSelectedPlan(tablaPlanes[0]); setShowAuthModal(true); }} className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-black px-5 py-2 rounded-full text-xs tracking-wide shadow-md">Empezar Prueba Gratis</button>
            </>
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
                <h2 className="text-4xl md:text-5xl font-black text-white leading-none">Crea tu radio online con <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AutoDJ Pro</span></h2>
                <p className="text-slate-400 text-sm leading-relaxed">Aloja tu música en la nube, programa tus listas de reproducción 24/7 y analiza a tu audiencia con estadísticas geográficas en tiempo real.</p>
                <button onClick={() => setCurrentTab('pricing')} className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-black px-6 py-3 rounded-full text-sm shadow-xl">Ver Planes de Streaming</button>
              </div>
              <img src={estacionesSugeridas[0].img} alt="" className="w-full max-w-[280px] aspect-square object-cover rounded-2xl border border-white/5 shadow-2xl" />
            </section>

            {/* SECCIÓN MÓDULOS INSPIRADOS EN LAS CAPTURAS */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              <div className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3"><Radio className="text-purple-400 w-5 h-5" /><h4 className="text-white font-bold text-base">Transmisión en Vivo</h4></div>
                <p className="text-xs text-slate-400 leading-relaxed">Oyentes simultáneos parametrizados con ancho de banda totalmente ilimitado y creación de relays automatizados.</p>
              </div>
              <div className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3"><Disc className="text-pink-400 w-5 h-5" /><h4 className="text-white font-bold text-base">Módulo Auto-DJ</h4></div>
                <p className="text-xs text-slate-400 leading-relaxed">Configura y gestiona listas de reproducción inteligentes en la nube para cuando tu estación esté desconectada.</p>
              </div>
              <div className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3"><BarChart3 className="text-cyan-400 w-5 h-5" /><h4 className="text-white font-bold text-base">Analíticas de Audiencia</h4></div>
                <p className="text-xs text-slate-400 leading-relaxed">Reportes históricos a largo plazo y mapas geográficos en tiempo real incorporados para los miembros del plan.</p>
              </div>
              <div className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3"><DollarSign className="text-emerald-400 w-5 h-5" /><h4 className="text-white font-bold text-base">Monetización Integrada</h4></div>
                <p className="text-xs text-slate-400 leading-relaxed">Recibe pagos e ingresos directos por los anuncios de audio reproducidos dinámicamente en tus estaciones.</p>
              </div>
              <div className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl space-y-3 lg:col-span-1">
                <div className="flex items-center gap-3"><Mic className="text-amber-400 w-5 h-5" /><h4 className="text-white font-bold text-base">Graba tus Programas</h4></div>
                <p className="text-xs text-slate-400 leading-relaxed">Crea podcasts automatizados a partir de las grabaciones directas de tus transmisiones de radio en vivo.</p>
              </div>
            </section>
          </div>
        )}

        {/* VISTA: PLANES DE PRECIOS ADAPTADOS A LA MAQUETA OSCURA */}
        {currentTab === 'pricing' && (
          <div className="space-y-8 max-w-6xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white">Elige tu Plan de Emisión Industrial</h2>
              <p className="text-slate-400 text-sm">Escoge el plan ideal para tu audiencia. El soporte de tarjeta es requerido para validar la cuenta.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tablaPlanes.map((plan, idx) => (
                <div key={idx} className={`border rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 ${plan.color}`}>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-bold text-white tracking-wide">{plan.nombre}</h4>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-black text-white">${plan.precio}</span>
                        <span className="text-xs text-slate-500">/ mes</span>
                      </div>
                      <p className="text-xs text-slate-500 line-through mt-0.5">Precio original: ${plan.original}</p>
                    </div>

                    <ul className="text-xs space-y-2.5 text-slate-300 border-t border-slate-900/80 pt-4">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> {plan.estaciones}</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> {plan.oyentes} simultáneos</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Ancho de banda ilimitado</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> <strong>{plan.limitePistas} pistas</strong> de AutoDJ</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Calidad de audio hasta 128kbps</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Estadísticas y analíticas de países</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Monetización por anuncios de audio</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Servidor automático para Podcasts</li>
                    </ul>
                  </div>

                  {plan.soloPrueba ? (
                    <button onClick={() => { setSelectedPlan(plan); setIsRegistering(true); setShowAuthModal(true); }} className="w-full bg-white text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-200 transition">
                      Prueba Gratis 15 días
                    </button>
                  ) : (
                    <button onClick={() => { setSelectedPlan(plan); setIsRegistering(true); setShowAuthModal(true); }} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider border border-slate-800 hover:border-purple-500/40 transition">
                      Adquirir Plan {plan.nombre}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA PRO: DASHBOARD DEL LOCUTOR */}
        {currentTab === 'dashboard' && user && hasPaymentMethod && (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2"><RadioTower className="w-6 h-6 text-purple-400" /> Consola del Locutor Pro</h2>
                <p className="text-xs text-slate-400">Plan Activo: <span className="text-pink-400 font-bold">{selectedPlan?.nombre || 'Básico'}</span> {selectedPlan?.soloPrueba && '(Modo Prueba de 15 Días)'}</p>
              </div>
            </div>

            {!miEstacionPropia ? (
              <div className="bg-[#0b0818] border border-purple-950/50 rounded-2xl p-6 max-w-xl mx-auto space-y-4">
                <h3 className="font-bold text-white">Configura tu Estación para el AutoDJ</h3>
                <form onSubmit={handleCrearEstacion} className="space-y-4">
                  <input type="text" required placeholder="Nombre de la Radio" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
                  <input type="text" required placeholder="Género Musical" value={formGenre} onChange={(e) => setFormGenre(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
                  <input type="url" placeholder="URL de la imagen del logo (opcional)" value={formLogo} onChange={(e) => setFormLogo(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
                  <button type="submit" className="w-full bg-pink-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider">Crear Estación y Activar Servidor</button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA 1: ANALÍTICAS EN TIEMPO REAL (ZENO TOOLS STYLE) */}
                <div className="bg-[#0b0818] border border-purple-950/40 rounded-2xl p-6 space-y-6">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2 text-slate-400"><Users className="w-4 h-4 text-cyan-400" /> Audiencia Global</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#110e24] p-4 rounded-xl border border-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Oyentes actuales</span>
                      <p className="text-3xl font-black text-emerald-400 mt-1">412</p>
                    </div>
                    <div className="bg-[#110e24] p-4 rounded-xl border border-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Pico Máximo</span>
                      <p className="text-3xl font-black text-white mt-1">1,890</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-purple-400" /> Top Países</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded-lg"><span>🇲🇽 México</span><span className="font-mono text-cyan-400">1909 oyentes</span></div>
                      <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded-lg"><span>🇺🇸 Estados Unidos</span><span className="font-mono text-cyan-400">707 oyentes</span></div>
                      <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded-lg"><span>🇬🇹 Guatemala</span><span className="font-mono text-cyan-400">70 oyentes</span></div>
                      <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded-lg"><span>🇸🇻 El Salvador</span><span className="font-mono text-cyan-400">28 oyentes</span></div>
                    </div>
                  </div>
                </div>

                {/* COLUMNA 2: ADMINISTRADOR AUTODJ */}
                <div className="bg-[#0b0818] border border-purple-950/40 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2 text-slate-400"><Music2 className="w-4 h-4 text-pink-400" /> Repositorio AutoDJ</h3>
                  <p className="text-xs text-slate-500">Sube tus archivos MP3. El AutoDJ alternará automáticamente las canciones cuando no estés transmitiendo en vivo.</p>
                  
                  <div className="text-xs text-slate-400 bg-purple-950/20 p-2.5 rounded-lg flex justify-between">
                    <span>Espacio Usado: <strong>{autoDJPistas.length} / {selectedPlan?.limitePistas || 100} pistas</strong></span>
                  </div>

                  <form onSubmit={handleSubirPista} className="flex gap-2">
                    <input type="text" placeholder="nombre_cancion.mp3" value={nuevaPistaNombre} onChange={(e) => setNuevaPistaNombre(e.target.value)} className="bg-[#110e24] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white flex-1 focus:outline-none" />
                    <button type="submit" className="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-purple-700">Subir</button>
                  </form>

                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {autoDJPistas.map(pista => (
                      <div key={pista.id} className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                        <span className="truncate max-w-[180px] text-slate-300 font-mono">{pista.name}</span>
                        <span className="text-[10px] text-slate-500">{pista.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMNA 3: MONETIZACIÓN Y PODCASTS */}
                <div className="bg-[#0b0818] border border-purple-950/40 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2 text-slate-400"><DollarSign className="w-4 h-4 text-emerald-400" /> Panel de Control Avanzado</h3>
                  
                  {/* Bloque Monetización */}
                  <div className="bg-[#110e24] p-3 rounded-xl border border-slate-900 space-y-1">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Ingresos Estimados por Anuncios</span>
                    <p className="text-xl font-black text-white font-mono">$3,488.00</p>
                    <p className="text-[10px] text-slate-500">3,100,369 Impresiones de audio reproducidas</p>
                  </div>

                  {/* Bloque Grabaciones / Podcast */}
                  <div className="bg-[#110e24] p-3 rounded-xl border border-slate-900 space-y-2">
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1"><Mic className="w-3 h-3" /> Grabador de Programas (Podcasts)</span>
                    <p className="text-xs text-slate-300">Generación de RSS feed automática activada.</p>
                    <div className="bg-slate-950 p-2 rounded border border-slate-900 text-[10px] font-mono text-slate-400 truncate">
                      https://podcast.fredradio.com/feed/{miEstacionPropia.id}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* MINI PLAYER FIJO */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0814]/95 border-t border-purple-500/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/3">
          <img src={currentStation.img} alt="" className="w-10 h-10 rounded-lg object-cover shadow" />
          <div className="truncate"><h5 className="font-bold text-xs text-white truncate">{currentStation.title}</h5><p className="text-[11px] text-slate-400 truncate">{currentStation.genre}</p></div>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md transform active:scale-95 transition">
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div className="w-1/3 flex justify-end items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Vol</span>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-16 accent-pink-500 h-1 bg-slate-800 rounded" />
        </div>
      </div>

      {/* MODAL DE AUTENTICACIÓN / PAGO */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090714] border border-purple-950/40 rounded-2xl p-6 relative space-y-6">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
            
            <div className="text-center space-y-1">
              <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase">
                {isRegistering ? `Plan Seleccionado: ${selectedPlan?.nombre || 'Básico'}` : 'Acceso Locutores'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {isRegistering ? (selectedPlan?.soloPrueba ? 'Comienza tus 15 días gratis' : 'Configura tu suscripción') : 'Ingresa a tu Consola'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRegistering ? (selectedPlan?.soloPrueba ? 'No se realizará ningún cargo hoy.' : 'Acceso inmediato a tu servidor.') : 'Introduce tus credenciales de emisión.'}
              </p>
            </div>

            {isRegistering ? (
              <form onSubmit={procesarPagoTarjeta} className="space-y-4">
                <div className="space-y-2">
                  <input type="email" required placeholder="Tu correo electrónico" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-[#0d0a1c] border border-slate-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
                </div>

                <div className="bg-[#0e0b20] border border-purple-900/20 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-pink-500" /> Información de Pago</span>
                  
                  <input type="text" required placeholder="0000 0000 0000 0000" maxLength="16" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full bg-[#130f2b] border border-slate-900 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-pink-500 font-mono" />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" required placeholder="MM/AA" maxLength="5" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="bg-[#130f2b] border border-slate-900 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-pink-500 font-mono text-center" />
                    <input type="password" required placeholder="CVC" maxLength="3" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} className="bg-[#130f2b] border border-slate-900 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-pink-500 font-mono text-center" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> {selectedPlan?.soloPrueba ? 'Activar Prueba Gratuita' : 'Activar Servidor Industrial'}
                </button>
              </form>
            ) : (
              <form onSubmit={ejecutarLoginDirecto} className="space-y-4">
                <input type="email" required placeholder="Tu correo electrónico registrado" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-[#0d0a1c] border border-slate-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
                <input type="password" placeholder="Contraseña" className="w-full bg-[#0d0a1c] border border-slate-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
                <button type="submit" className="w-full bg-purple-600 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-purple-700 transition">
                  Entrar al Panel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
