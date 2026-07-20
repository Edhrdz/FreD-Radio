import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  Radio, Sliders, RadioTower, Disc, Users, Globe, Music2, 
  CreditCard, ShieldCheck, Check, LogIn, DollarSign, BarChart3, 
  Mic, LayoutDashboard, Play, Pause, Trash2, Upload, Calendar, Rss,
  Headphones, Server, Shield, Zap, Flame, Award, Heart, UserPlus,
  Compass, Library, Search, Loader2
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');

  // Sub-pestaña activa dentro del Panel del Locutor
  const [activeDashboardSection, setActiveDashboardSection] = useState('live');

  // Estados de Autenticación y Carga
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [requiresCard, setRequiresCard] = useState(false); 
  const [authEmail, setAuthEmail] = useState(''); 
  const [authPassword, setAuthPassword] = useState('');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Formulario de Tarjeta Simulado
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Estados del Reproductor de Radio Global
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

  // Estado del AutoDJ
  const [autoDJPistas, setAutoDJPistas] = useState([
    { id: 1, title: 'Track 001', artist: 'Artist 01', album: 'Album Alpha', duration: '03:18', size: '4.2 MB' },
    { id: 2, title: 'Track 002', artist: 'Artist 02', album: 'Album Beta', duration: '04:35', size: '5.8 MB' },
    { id: 3, title: 'Track 003', artist: 'Artist 03', album: 'Album Gamma', duration: '02:28', size: '3.1 MB' }
  ]);
  const [nuevaPistaNombre, setNuevaPistaNombre] = useState('');

  // Estaciones fijas
  const estacionesFijas = [
    { id: 101, title: 'Groove Salad', genre: 'Ambient / Lounge', streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3', img: 'https://somafm.com/img3/groovesalad-400.jpg', oyentes: '1,240' },
    { id: 102, title: 'Drone Zone', genre: 'Atmospheric Ambient', streamUrl: 'https://ice1.somafm.com/dronezone-128-mp3', img: 'https://somafm.com/img/dronezone120.jpg', oyentes: '890' },
    { id: 103, title: 'Indie Pop Rocks!', genre: 'Independent Pop', streamUrl: 'https://ice1.somafm.com/indiepop-128-mp3', img: 'https://somafm.com/img/indiepop120.jpg', oyentes: '2,110' },
    { id: 104, title: 'Secret Agent', genre: 'Soundtracks / Lounge', streamUrl: 'https://ice1.somafm.com/secretagent-128-mp3', img: 'https://somafm.com/img/secretagent120.jpg', oyentes: '450' }
  ];

  const tablaPlanes = [
    { id: 'plan_basic', nombre: 'Básico', precio: '6.50', estaciones: '1 estación', oyentes: 'Hasta 1,000', limitePistas: 100, color: 'border-slate-800 bg-slate-900/40 hover:border-purple-500/30', soloPrueba: true },
    { id: 'plan_standard', nombre: 'Estándar', precio: '14.00', estaciones: '1 estación', oyentes: 'Hasta 5,000', limitePistas: 500, color: 'border-slate-800 bg-slate-900/40 hover:border-purple-500/30', soloPrueba: false },
    { id: 'plan_pro', nombre: 'Pro', precio: '25.00', estaciones: '3 estaciones', oyentes: 'Hasta 25,000', limitePistas: 1000, color: 'border-slate-800 bg-slate-900/40 hover:border-pink-500/30', soloPrueba: false },
    { id: 'plan_premium', nombre: 'Premium', precio: '100.00', estaciones: '5 estaciones', oyentes: 'Ilimitados', limitePistas: 1500, color: 'border-slate-800 bg-slate-900/40 hover:border-amber-500/30', soloPrueba: false }
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
        setMiEstacionPropia(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      if (isPlaying) { audioRef.current.play().catch(() => setIsPlaying(false)); } 
      else { audioRef.current.pause(); }
    }
  }, [isPlaying, currentStation, volume, isMuted]);

  const fetchUserProfile = async (userId) => {
    try {
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profile) {
        setUserProfile(profile);
      }

      let { data: radio } = await supabase
        .from('radios')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (radio) {
        setMiEstacionPropia(radio);
      }
    } catch (err) {
      console.error("Error cargando perfil:", err);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      if (isRegistering) {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });

        if (signUpError) throw signUpError;

        if (authData?.user) {
          const planId = selectedPlan ? selectedPlan.id : 'free_tier';
          const planName = selectedPlan ? selectedPlan.nombre : 'Ninguno';
          const isSubscribed = requiresCard || selectedPlan ? true : false;

          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: authData.user.id, 
                email: authEmail,
                plan_id: planId,
                plan_name: planName,
                subscription_active: isSubscribed,
                payment_status: isSubscribed ? 'paid' : 'pending'
              }
            ]);

          if (profileError) throw profileError;
          
          alert("¡Cuenta registrada con éxito!");
          setShowAuthModal(false);
          setCurrentTab(isSubscribed ? 'dashboard' : 'home');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (signInError) throw signInError;
        setShowAuthModal(false);
        setCurrentTab('dashboard');
      }
    } catch (error) {
      setAuthError(error.message || 'Ocurrió un error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      alert("Error con Google Auth: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentTab('home');
  };

  const cambiarEstacionGlobal = (estacion) => {
    setCurrentStation(estacion);
    setIsPlaying(true);
  };

  const handleCrearEstacion = async (e) => {
    e.preventDefault();
    if (!user) return;

    const nuevaEstacion = {
      user_id: user.id,
      title: formTitle || 'Mi Estación de Streaming',
      genre: formGenre || 'Variada',
      img: formLogo || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80',
    };

    const { data, error } = await supabase
      .from('radios')
      .insert([nuevaEstacion])
      .select()
      .single();

    if (error) {
      alert("Error al inicializar servidor: " + error.message);
    } else {
      setMiEstacionPropia(data);
    }
  };

  const handleSubirPista = (e) => {
    e.preventDefault();
    if (!nuevaPistaNombre) return;
    setAutoDJPistas([...autoDJPistas, {
      id: Date.now(),
      title: nuevaPistaNombre,
      artist: 'Artista Cloud',
      album: 'Nube Repositorio',
      duration: '03:45',
      size: '5.1 MB'
    }]);
    setNuevaPistaNombre('');
  };

  const eliminarPista = (id) => {
    setAutoDJPistas(autoDJPistas.filter(p => p.id !== id));
  };

  const estacionesFiltradas = estacionesFijas.filter(est => 
    est.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    est.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05030a] text-slate-100 font-sans antialiased pb-32">
      <audio ref={audioRef} src={currentStation.streamUrl} />

      {/* HEADER GLOBAL - OPTIMIZADO PARA MOSTRARSE SIEMPRE */}
      <header className="sticky top-0 z-40 bg-[#05030a]/90 backdrop-blur-md border-b border-purple-950/20 px-4 md:px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-4">
          <div onClick={() => setCurrentTab('home')} className="flex items-center gap-3 cursor-pointer shrink-0">
            <div className="bg-gradient-to-r from-fuchsia-500 via-purple-600 to-pink-500 p-2.5 rounded-xl shadow-lg">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">FreD</span>
          </div>

          {/* NAVBAR CENTRAL - Totalmente visible en todas las pantallas */}
          <nav className="flex flex-wrap items-center gap-1 text-xs font-bold text-slate-400">
            <button onClick={() => setCurrentTab('home')} className={`px-2.5 py-2 rounded-xl transition ${currentTab === 'home' ? 'text-white bg-slate-900/60' : 'hover:text-white'}`}>Home</button>
            <button onClick={() => setCurrentTab('pricing')} className={`px-2.5 py-2 rounded-xl transition ${currentTab === 'pricing' ? 'text-white bg-slate-900/60' : 'hover:text-white'}`}>Planes y Precios</button>
            
            <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

            <button onClick={() => setCurrentTab('discover')} className={`px-2.5 py-2 rounded-xl transition flex items-center gap-1 ${currentTab === 'discover' ? 'text-white bg-[#16122c] shadow' : 'hover:text-white'}`}>
              <Compass className="w-3.5 h-3.5 text-purple-400" /> Descubrir
            </button>
            <button onClick={() => setCurrentTab('library')} className={`px-2.5 py-2 rounded-xl transition flex items-center gap-1 ${currentTab === 'library' ? 'text-white bg-[#16122c] shadow' : 'hover:text-white'}`}>
              <Library className="w-3.5 h-3.5 text-pink-400" /> Biblioteca
            </button>
            <button onClick={() => setCurrentTab('search_tab')} className={`px-2.5 py-2 rounded-xl transition flex items-center gap-1 ${currentTab === 'search_tab' ? 'text-white bg-[#16122c] shadow' : 'hover:text-white'}`}>
              <Search className="w-3.5 h-3.5 text-cyan-400" /> Buscar
            </button>

            {user && (
              <>
                <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>
                <button onClick={() => setCurrentTab('dashboard')} className={`px-2.5 py-2 rounded-xl border border-purple-500/30 text-purple-400 flex items-center gap-1 ${currentTab === 'dashboard' ? 'bg-purple-950/30 text-white' : ''}`}><Sliders className="w-3.5 h-3.5" /> Panel Locutor</button>
              </>
            )}
          </nav>
        </div>

        {/* ACCIONES DERECHAS */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[11px] bg-purple-950/40 border border-purple-500/20 px-3.5 py-2 rounded-full text-purple-300 font-medium">
                {user.email} {userProfile?.subscription_active && `[${userProfile?.plan_name}]`}
              </span>
              <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white px-1">Salir</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => { setIsRegistering(false); setRequiresCard(false); setAuthError(''); setShowAuthModal(true); }} className="text-xs font-bold text-slate-300 hover:text-white transition px-2 py-2 flex items-center gap-1">
                <LogIn className="w-3.5 h-3.5 text-purple-400" /> Iniciar Sesión
              </button>
              <button onClick={() => { setIsRegistering(true); setRequiresCard(false); setSelectedPlan(null); setAuthError(''); setShowAuthModal(true); }} className="text-xs font-bold bg-slate-900 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl hover:border-purple-500/40 transition flex items-center gap-1">
                <UserPlus className="w-3.5 h-3.5 text-pink-400" /> Registrarse
              </button>
              <button onClick={() => { setIsRegistering(true); setRequiresCard(true); setSelectedPlan(tablaPlanes[0]); setAuthError(''); setShowAuthModal(true); }} className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-black px-4 py-2.5 rounded-full text-[11px] tracking-wide shadow-md hover:opacity-90 transition">
                Empezar Prueba Gratis
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* VISTA: HOME */}
        {currentTab === 'home' && (
          <div className="space-y-16">
            <section className="bg-gradient-to-br from-purple-950/30 via-slate-950 to-slate-950 rounded-3xl border border-purple-500/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-6">
                <span className="bg-pink-500/10 text-pink-400 text-xs font-bold px-3 py-1 rounded-full border border-pink-500/20 tracking-wider">PROBÁLO GRATIS POR 15 DÍAS</span>
                <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">Crea tu radio online con <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AutoDJ Avanzado</span></h2>
                <p className="text-slate-400 text-sm leading-relaxed">Administra transmisiones en vivo, listas de reproducción inteligentes automatizadas y monetización directa desde un único panel lateral optimizado de nivel industrial.</p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button onClick={() => setCurrentTab('pricing')} className="bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-black px-6 py-3 rounded-full text-sm shadow-xl hover:scale-105 transition">Ver Planes de Streaming</button>
                </div>
              </div>
              <div className="relative w-full md:w-1/2 max-w-sm flex justify-center">
                <div className="bg-slate-900/60 p-8 rounded-2xl border border-purple-500/10 backdrop-blur-xl relative w-full text-center space-y-4">
                  <RadioTower className="w-12 h-12 text-pink-500 mx-auto animate-pulse" />
                  <div className="text-white font-black text-lg">Red Icecast KH Activa</div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-black text-white text-center">Infraestructura Diseñada para Emisores</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <h4 className="font-bold text-white text-xs">Transmisión Inmediata</h4>
                  <p className="text-[11px] text-slate-400">Soporte nativo para OBS, Butt y Mixxx.</p>
                </div>
                <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-2">
                  <Disc className="w-5 h-5 text-pink-400" />
                  <h4 className="font-bold text-white text-xs">AutoDJ en la Nube</h4>
                  <p className="text-[11px] text-slate-400">Automatiza listas las 24 horas del día.</p>
                </div>
                <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-white text-xs">Métricas de Oyentes</h4>
                  <p className="text-[11px] text-slate-400">Analíticas en tiempo real de tu audiencia.</p>
                </div>
                <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-white text-xs">Monetización</h4>
                  <p className="text-[11px] text-slate-400">Inyección inteligente de anuncios de audio.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VISTA: DESCUBRIR */}
        {currentTab === 'discover' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2"><Compass className="w-5 h-5 text-purple-400" /> Emisoras Destacadas</h3>
              <p className="text-xs text-slate-400">Escucha los servidores con mayor flujo de oyentes en tiempo real.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {estacionesFijas.map((est) => (
                <div key={est.id} className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl flex items-center justify-between group hover:border-purple-500/20 transition">
                  <div className="flex items-center gap-3">
                    <img src={est.img} alt="" className="w-11 h-11 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-white truncate max-w-[120px]">{est.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{est.genre}</p>
                      <span className="text-[9px] font-mono text-purple-400 flex items-center gap-1 mt-0.5"><Users className="w-2.5 h-2.5" /> {est.oyentes}</span>
                    </div>
                  </div>
                  <button onClick={() => cambiarEstacionGlobal(est)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 group-hover:bg-white group-hover:text-slate-950 transition">
                    {currentStation.id === est.id && isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA: BIBLIOTECA */}
        {currentTab === 'library' && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2"><Library className="w-5 h-5 text-pink-400" /> Tu Biblioteca</h3>
            <p className="text-xs text-slate-400">Tus estaciones guardadas y favoritas aparecerán en este bloque.</p>
            <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-xl p-12 text-center text-xs text-slate-500">
              Sintoniza cyber-emisoras en la pestaña superior "Descubrir" para guardar elementos aquí.
            </div>
          </div>
        )}

        {/* VISTA: BUSCAR */}
        {currentTab === 'search_tab' && (
          <div className="space-y-6">
            <div className="max-w-md relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input 
                type="text" 
                placeholder="Buscar por nombre de radio o género musical..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0c091c] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {estacionesFiltradas.length > 0 ? (
                estacionesFiltradas.map((est) => (
                  <div key={est.id} className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl flex items-center justify-between group hover:border-purple-500/20 transition">
                    <div className="flex items-center gap-3">
                      <img src={est.img} alt="" className="w-11 h-11 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-white truncate max-w-[120px]">{est.title}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{est.genre}</p>
                      </div>
                    </div>
                    <button onClick={() => cambiarEstacionGlobal(est)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 group-hover:bg-white group-hover:text-slate-950 transition">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 col-span-4">No se encontraron resultados.</p>
              )}
            </div>
          </div>
        )}

        {/* VISTA: PLANES */}
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
                  <button onClick={() => { setSelectedPlan(plan); setIsRegistering(true); setRequiresCard(plan.soloPrueba); setShowAuthModal(true); }} className={`w-full font-black py-3 rounded-xl text-xs uppercase tracking-wider transition ${plan.soloPrueba ? 'bg-white text-slate-950 hover:bg-slate-200' : 'bg-slate-900 text-white border border-slate-800 hover:border-purple-500/40'}`}>
                    {plan.soloPrueba ? 'Prueba Gratis 15 días' : `Adquirir ${plan.nombre}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA: PANEL DE LOCUTOR */}
        {currentTab === 'dashboard' && user && (
          <div className="space-y-6">
            <div className="border-b border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-purple-400" /> Consola de Control</h2>
                <p className="text-xs text-slate-400">Gestiona tu estación, automatizaciones de AutoDJ y servidores de audio.</p>
              </div>
              <div className="bg-[#0f0b24] border border-purple-500/20 px-4 py-2.5 rounded-xl text-xs space-y-0.5">
                <div className="text-slate-400">Suscripción activa: <span className="text-pink-400 font-bold">{userProfile?.plan_name || 'Ninguno (Demo)'}</span></div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">Estado de Pago: <span className="text-emerald-400 flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> Al día</span></div>
              </div>
            </div>

            {!miEstacionPropia ? (
              <div className="bg-[#0b0818] border border-purple-950/50 rounded-2xl p-6 max-w-xl mx-auto space-y-4">
                <h3 className="font-bold text-white text-sm">Configura tu Estación por primera vez</h3>
                <form onSubmit={handleCrearEstacion} className="space-y-4">
                  <input type="text" required placeholder="Nombre de tu Radio" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
                  <input type="text" required placeholder="Género Musical (ej. Techno, Pop)" value={formGenre} onChange={(e) => setFormGenre(e.target.value)} className="w-full bg-[#110e24] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
                  <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-xs uppercase">Inicializar Servidor en Supabase</button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* MENÚ LATERAL BLOQUEADO */}
                <aside className="w-full md:w-64 bg-[#0a0716] border border-slate-900 rounded-2xl p-3 flex flex-col gap-1 shrink-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2">Módulos de Radio</span>
                  <button onClick={() => setActiveDashboardSection('live')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${activeDashboardSection === 'live' ? 'bg-purple-950/40 text-purple-400 border border-purple-500/20' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                    <RadioTower className="w-4 h-4" /> Transmisión en Vivo
                  </button>
                  <button onClick={() => setActiveDashboardSection('autodj')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${activeDashboardSection === 'autodj' ? 'bg-purple-950/40 text-pink-400 border border-pink-500/20' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}>
                    <Disc className="w-4 h-4" /> Auto-DJ Storage
                  </button>
                </aside>

                <div className="flex-1 w-full bg-[#070512] border border-slate-900 rounded-2xl p-6 min-h-[350px]">
                  {activeDashboardSection === 'live' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-bold text-white">Servidor Mountpoint: {miEstacionPropia.title}</h3>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">SERVIDOR ONLINE</span>
                      </div>
                      <div className="bg-[#0c091c] border border-slate-900 rounded-xl p-4 space-y-3 font-mono text-xs">
                        <div className="flex justify-between border-b border-slate-900 pb-2"><span className="text-slate-500">Servidor / URL:</span><span className="text-slate-300">str.fredstreaming.com:8000</span></div>
                        <div className="flex justify-between border-b border-slate-900 pb-2"><span className="text-slate-500">Mountpoint:</span><span className="text-slate-300">/stream_{miEstacionPropia.id}</span></div>
                        <div className="flex justify-between border-b border-slate-900 pb-2"><span className="text-slate-500">Género Asignado:</span><span className="text-purple-400">{miEstacionPropia.genre}</span></div>
                      </div>
                    </div>
                  )}

                  {activeDashboardSection === 'autodj' && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">Playlist del Auto-DJ</h3>
                      <form onSubmit={handleSubirPista} className="flex gap-2 bg-[#0c091c] p-3 rounded-xl border border-slate-900">
                        <input type="text" required placeholder="Nombre de la pista..." value={nuevaPistaNombre} onChange={(e) => setNuevaPistaNombre(e.target.value)} className="bg-[#120f26] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white flex-1 focus:outline-none" />
                        <button type="submit" className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-lg"><Upload className="w-3.5 h-3.5 inline-block" /> Upload</button>
                      </form>
                      <div className="border border-slate-900 rounded-xl overflow-hidden text-xs">
                        {autoDJPistas.map((pista) => (
                          <div key={pista.id} className="grid grid-cols-12 p-3 items-center hover:bg-slate-900/30 transition">
                            <div className="col-span-10 flex items-center gap-2 font-medium text-slate-200"><Play className="w-3 h-3 text-slate-500" /> {pista.title}</div>
                            <div className="col-span-2 text-right">
                              <button onClick={() => eliminarPista(pista.id)} className="p-1.5 rounded bg-red-500/10 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* REPRODUCTOR INFERIOR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0814]/95 border-t border-purple-500/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/3">
          <img src={currentStation.img} alt="" className="w-10 h-10 rounded-lg object-cover shadow" />
          <div className="truncate"><h5 className="font-bold text-xs text-white truncate">{currentStation.title}</h5><p className="text-[11px] text-slate-400 truncate">{currentStation.genre}</p></div>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md">
          {isPlaying ? <Pause className="w-4 h-4 text-slate-950" /> : <Play className="w-4 h-4 text-slate-950 fill-slate-950" />}
        </button>
        <div className="w-1/3 flex justify-end items-center gap-2">
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-16 accent-pink-500 h-1 bg-slate-800 rounded" />
        </div>
      </div>

      {/* MODAL DE AUTENTICACIÓN */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090714] border border-purple-950/40 rounded-2xl p-6 relative space-y-5">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">
                {isRegistering ? (requiresCard ? `Plan ${selectedPlan?.nombre}` : 'Crea tu cuenta de Emisor') : 'Ingresa a tu Consola'}
              </h3>
              {selectedPlan && isRegistering && <p className="text-xs text-purple-400">Precio mensual: ${selectedPlan.precio} USD</p>}
            </div>
            
            {authError && <div className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center">{authError}</div>}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                <input type="email" required placeholder="tu@correo.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-[#0d0a1c] border border-slate-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Contraseña</label>
                <input type="password" required placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-[#0d0a1c] border border-slate-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none" />
              </div>
              
              {isRegistering && requiresCard && (
                <div className="bg-[#0e0b20] border border-purple-900/20 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-pink-500" /> Datos de Facturación (Simulado)</span>
                  <input type="text" required placeholder="Número de Tarjeta" maxLength="16" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full bg-[#130f2b] border border-slate-900 rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" required placeholder="MM/AA" maxLength="5" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="bg-[#130f2b] border border-slate-900 rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono text-center" />
                    <input type="text" required placeholder="CVC" maxLength="3" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} className="bg-[#130f2b] border border-slate-900 rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono text-center" />
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {isRegistering ? (requiresCard ? 'Confirmar y Pagar Suscripción' : 'Registrar Cuenta') : 'Entrar al Panel'}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-900"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-bold uppercase">O continuar con</span>
              <div className="flex-grow border-t border-slate-900"></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.102C18.445 2.108 15.595 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.56-4.455 10.56-10.75 0-.725-.075-1.275-.165-1.665h-10.4z"/></svg>
              Google Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
