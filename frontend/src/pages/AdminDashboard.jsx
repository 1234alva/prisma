import { 
  Users, MapPin, AlertCircle, TrendingUp, Package, 
  Clock, Search, Monitor, X, Settings, Database, Wrench 
} from 'lucide-react';
import { useState, useEffect } from 'react'; 
import jh7Api from '../api/jh7Api'; 

import { SeccionPersonal } from './admin/SeccionPersonal';
import { SeccionTrabajo } from './admin/SeccionTrabajo';
import { SeccionMaterial } from './admin/SeccionMaterial';
import { SeccionEquipos } from './admin/SeccionEquipos'; 
import { SeccionRecuperados } from './admin/SeccionRecuperados';
import { SeccionReportes } from './admin/SeccionReportes';
import { SeccionHerramientas } from './admin/SeccionHerramientas'; 

export const AdminDashboard = ({ user, seccion }) => {
  const [busqueda, setBusqueda] = useState(""); 
  const [mostrarDetalle, setMostrarDetalle] = useState(null); 


  const [stats, setStats] = useState({
    totalEquipos: 0,
    enCampo: 0,
    totalRecuperados: 0,
    tecnicosActivos: 0 
  });

  
  useEffect(() => {
    const cargarStatsReales = async () => {
      try {
        const resp = await jh7Api.get('/instalaciones/stats/globales');
        setStats(prev => ({
          ...prev,
          totalEquipos: resp.data.totalEquipos,
          enCampo: resp.data.enCampo,
          totalRecuperados: resp.data.totalRecuperados
        }));
      } catch (error) {
        console.error("Error al sincronizar Dashboard:", error);
      }
    };

    if (!seccion || seccion === 'inicio') {
      cargarStatsReales();
    }
  }, [seccion]); 

  const buscarSolicitud = (e) => {
    if (e.key === 'Enter' && busqueda.trim() !== "") {
      setMostrarDetalle(busqueda);
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      
      {mostrarDetalle && (
        <ModalDetalle solicitud={mostrarDetalle} onClose={() => setMostrarDetalle(null)} />
      )}

      {/* --- HEADER DE CONTROL SUPERIOR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar Orden real (Ej: JH-001)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-xs focus:ring-2 focus:ring-jh7_red/20 transition-all dark:text-white"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={buscarSolicitud}
          />
        </div>

        <div className="flex items-center gap-4 border-l-0 md:border-l md:pl-6 border-gray-100 dark:border-slate-700">
          <div className="text-right">
            <p className="text-[10px] font-black text-jh7_red uppercase italic leading-none mb-1">JH7</p>
            <p className="text-sm font-black text-jh7_dark dark:text-white uppercase">{user?.nombre || 'Administrador'}</p>
          </div>
          <div className="w-11 h-11 bg-jh7_red rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-red-500/20 text-xl italic">
            {user?.nombre?.charAt(0) || 'A'}
          </div>
        </div>
      </div>

      {/* --- RENDERIZADO DINÁMICO --- */}
      <div className="transition-all duration-300">
        {(!seccion || seccion === 'inicio') && (
          <VistaGeneralDashboard stats={stats} />
        )}
        {seccion === 'personal' && <SeccionPersonal />}
        {seccion === 'trabajo' && <SeccionTrabajo />}
        {seccion === 'material' && <SeccionMaterial />}
        {seccion === 'equipos' && <SeccionEquipos />} 
        {seccion === 'herramientas' && <SeccionHerramientas />}
        {seccion === 'recuperados' && <SeccionRecuperados />}
        {seccion === 'reportes' && <SeccionReportes />}
      </div>
    </div>
  );
};


const VistaGeneralDashboard = ({ stats }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cambiamos los títulos y valores para que coincidan con tu lógica de inventario */}
        <StatCard title="Stock Almacén" value={stats.totalEquipos} icon={<Package size={20}/>} color="blue" />
        <StatCard title="Equipos en Campo" value={stats.enCampo} icon={<MapPin size={20}/>} color="orange" />
        
        {/* Aquí aparecerá tu 4 real */}
        <StatCard 
          title="Equipos Recuperados" 
          value={stats.totalRecuperados} 
          icon={<RefreshCcw size={20}/>} 
          color="red" 
          highlight={stats.totalRecuperados > 0} 
        />
        
        <StatCard title="Técnicos Activos" value={stats.tecnicosActivos} icon={<Users size={20}/>} color="dark" />
    </div>

    {/* Si todo está en cero (excepto recuperados), mostramos el estado de espera */}
    {stats.totalEquipos === 0 && stats.enCampo === 0 && (
      <div className="bg-white dark:bg-slate-800 p-12 rounded-[3.5rem] shadow-sm border border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 text-gray-300 animate-pulse">
             <Database size={40} />
          </div>
          <h3 className="text-sm font-black text-jh7_dark dark:text-white uppercase tracking-widest mb-2">Base de Datos en Espera</h3>
          <p className="text-[10px] text-gray-400 max-w-xs text-center font-bold uppercase tracking-tighter">
            Actualmente tienes <span className="text-jh7_red">{stats.totalRecuperados} equipos recuperados</span>. 
            Las demás estadísticas subirán cuando el almacenero ingrese stock.
          </p>
      </div>
    )}
  </div>
);

const StatCard = ({ title, value, icon, highlight }) => (
  <div className={`p-8 rounded-[2.5rem] shadow-sm transition-all duration-500 ${
    highlight 
    ? 'bg-jh7_red text-white shadow-lg shadow-red-500/20 scale-[1.02]' 
    : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700'
  }`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${highlight ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-900 text-jh7_red'}`}>
        {icon}
      </div>
    </div>
    <p className={`text-[10px] font-black uppercase mb-1 tracking-widest ${highlight ? 'text-white/70' : 'text-gray-400'}`}>
      {title}
    </p>
    <h4 className={`text-4xl font-black tracking-tighter ${highlight ? 'text-white' : 'text-jh7_dark dark:text-white'}`}>
      {value}
    </h4>
  </div>
);


import { RefreshCcw } from 'lucide-react';

const ModalDetalle = ({ solicitud, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-jh7_dark/90 backdrop-blur-md animate-in fade-in">
    <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-[3.5rem] p-12 text-center shadow-2xl">
      <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-jh7_red rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={40} />
      </div>
      <h4 className="text-2xl font-black text-jh7_dark dark:text-white uppercase mb-2 tracking-tighter">Sin registros</h4>
      <p className="text-[11px] text-gray-400 mb-8 font-black uppercase tracking-widest leading-relaxed">
        La orden <span className="text-jh7_red">#{solicitud}</span> no fue encontrada. 
      </p>
      <button onClick={onClose} className="w-full py-5 bg-jh7_dark dark:bg-jh7_red text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:opacity-90 transition-all">
         Entendido
      </button>
    </div>
  </div>
);