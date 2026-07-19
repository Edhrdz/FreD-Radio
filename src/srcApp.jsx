import React, { useState } from 'react';
import { Radio, Play, Pause, User, Star, CreditCard, Shield, Sliders, MessageSquare, Zap } from 'lucide-react';

// Estaciones de ejemplo para la vista visual
const MOCK_STATIONS = [
  { id: 1, name: "Planeta Rock", genre: "Rock", listeners: 142, gradient: "from-purple-600 to-indigo-600" },
  { id: 2, name: "Electro Beat", genre: "Electronic", listeners: 320, gradient: "from-cyan-500 to-blue-600" },
  { id: 3, name: "Amor Eterno", genre: "Baladas", listeners: 89, gradient: "from-pink-500 to-rose-500" },
  { id: 4, name: "Urban Flow", genre: "Reggaeton / Trap", listeners: 512, gradient: "from-amber-500 to-orange-600" },
];

// Estructura de planes solicitada (Suscripciones Pro muy cómodas)
const PRICING_PLANS = [
  {
    name: "Plan Free",
    price: "$0",
    description: "Para oyentes apasionados",
    features: ["Escuchar todas las estaciones", "Crear perfil de usuario", "Guardar favoritos", "Chat limitado"],
    buttonText: "Empezar Gratis",
    popular: false
  },
  {
    name: "Locutor Básico",
    price: "$5",
    description: "Ideal para iniciar tu primera estación",
    features: ["1 Estación de Radio propia", "Hasta 50 oyentes simultáneos", "5GB almacenamiento AutoDJ", "Soporte estándar"],
    buttonText: "Adquirir Básico",
    popular: false
  },
  {
    name: "Locutor Pro",
    price: "$15",
    description: "Diseñado para creadores constantes",
    features: ["Hasta 3 Estaciones propias", "Hasta 200 oyentes simultáneos", "20GB almacenamiento AutoDJ", "Estadísticas detalladas", "Chat en tiempo real"],
    buttonText: "Volverse Pro",
    popular: true
  },
  {
    name: "Premium / Empresa",
    price: "$50",
    description: "Potencia ilimitada para profesionales",
    features: ["Estaciones ilimitadas", "Oyentes ilimitados (Alta calidad)", "100GB almacenamiento AutoDJ", "Soporte prioritario 24/7", "Reproductor web personalizado"],
    buttonText: "Contacto Premium",
    popular: false
  }
];

export default function App() {
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' o 'pricing'

  const handlePlayStation = (station) => {
    setCurrentStation(station);
    setIsPlaying(true);
  };

  return (
    <div class="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header / Navegación */}
      <header class="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('explore')}>
          <Radio class="h-7 w-7 text-indigo-500 animate-pulse" />
          <span class="text-2xl font-black tracking-wider bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">FreD</span>
        </div>
        <nav class="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('explore')} 
            class={`font-medium transition ${activeTab === 'explore' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}>
            Explorar
          </button>
          <button 
            onClick={() => setActiveTab('pricing')} 
            class={`font-medium transition ${activeTab === 'pricing' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}>
            Planes Pro
          </button>
          <button class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full text-sm font-semibold transition border border-slate-700">
            <User class="h-4 w-4" /> Iniciar Sesión
          </button>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {activeTab === 'explore' ? (
          <div>
            {/* Hero Visual */}
            <div class="rounded-3xl p-8 md:p-12 mb-10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/30 shadow-2xl relative overflow-hidden">
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <h1 class="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Tu música, tus estaciones, <span class="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">tu control.</span></h1>
              <p class="text-slate-400 max-w-xl text-lg mb-6">Sintoniza transmisiones globales o crea tu propia estación de radio con herramientas profesionales completamente gratis.</p>
              <button onClick={() => setActiveTab('pricing')} class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition">
                Comenzar como Locutor
              </button>
            </div>

            {/* Rejilla de Estaciones */}
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2"><Radio class="h-5 w-5 text-indigo-400" /> Estaciones Destacadas</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {MOCK_STATIONS.map((station) => (
                <div key={station.id} class="bg-slate-900 rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition group flex flex-col justify-between">
                  <div>
                    <div class={`w-full aspect-square rounded-xl bg-gradient-to-br ${station.gradient} mb-4 flex items-center justify-center relative overflow-hidden shadow-inner`}>
                      <Radio class="h-12 w-12 text-white/40 group-hover:scale-110 transition duration-300" />
                      <button 
                        onClick={() => handlePlayStation(station)}
                        class="absolute bottom-3 right-3 bg-white text-slate-950 p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition duration-300 transform translate-y-2 group-hover:translate-y-0">
                        {currentStation?.id === station.id && isPlaying ? <Pause class="h-5 w-5 fill-current" /> : <Play class="h-5 w-5 fill-current" />}
                      </button>
                    </div>
                    <h3 class="font-bold text-lg text-slate-100 tracking-wide">{station.name}</h3>
                    <p class="text-xs font-semibold text-indigo-400 bg-indigo-950/50 inline-block px-2.5 py-0.5 rounded-md mt-1">{station.genre}</p>
                  </div>
                  <div class="flex items-center justify-between mt-4 text-xs text-slate-400 pt-3 border-t border-slate-800/60">
                    <span>{station.listeners} oyentes</span>
                    <button class="hover:text-amber-400 transition"><Star class="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Sección de Planes de Pago ($5 a $50) */
          <div>
            <div class="text-center max-w-3xl mx-auto mb-12">
              <h2 class="text-3xl md:text-4xl font-black mb-4">Planes flexibles para tus necesidades</h2>
              <p class="text-slate-400 text-lg">Empieza gratis como oyente o lánzate como locutor profesional con precios extremadamente cómodos y escalables.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {PRICING_PLANS.map((plan, index) => (
                <div key={index} class={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between relative transition hover:shadow-xl ${plan.popular ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 scale-105 z-10' : 'border-slate-800'}`}>
                  {plan.popular && (
                    <span class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      Más Popular
                    </span>
                  )}
                  <div>
                    <h3 class="text-xl font-bold mb-1 text-slate-100">{plan.name}</h3>
                    <p class="text-xs text-slate-400 mb-4 min-h-[32px]">{plan.description}</p>
                    <div class="flex items-baseline gap-1 mb-6">
                      <span class="text-4xl font-black tracking-tight">{plan.price}</span>
                      <span class="text-xs text-slate-400">/mes</span>
                    </div>
                    <ul class="space-y-3 mb-8 text-sm text-slate-300">
                      {plan.features.map((feature, i) => (
                        <li key={i} class="flex items-start gap-2.5">
                          <Zap class="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button class={`w-full py-3 rounded-xl font-semibold text-sm transition ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}>
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Reproductor Fijo Inferior */}
      {currentStation && (
        <div class="bg-slate-900/90 backdrop-blur border-t border-slate-800 fixed bottom-0 left-0 right-0 p-4 px-6 flex items-center justify-between z-50">
          <div class="flex items-center gap-4">
            <div class={`w-12 h-12 rounded-lg bg-gradient-to-br ${currentStation.gradient} flex items-center justify-center shrink-0`}>
              <Radio class="h-6 w-6 text-white/60" />
            </div>
            <div>
              <p class="font-bold text-sm text-slate-100 tracking-wide">{currentStation.name}</p>
              <p class="text-xs text-indigo-400">{currentStation.genre} — En Vivo</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              class="bg-white text-slate-950 p-3 rounded-full hover:scale-105 transition shadow-md">
              {isPlaying ? <Pause class="h-5 w-5 fill-current" /> : <Play class="h-5 w-5 fill-current" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}