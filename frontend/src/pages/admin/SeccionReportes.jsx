import React, { useState, useEffect } from 'react';
import jh7Api from '../../api/jh7Api'; 
import { 
  BarChart3, TrendingUp, Package, RotateCcw, 
  CheckCircle2, XCircle, Clock, Award, AlertCircle 
} from 'lucide-react';

export const SeccionReportes = () => {
  const [periodo, setPeriodo] = useState('Mensual');
  const [tecnicosReales, setTecnicosReales] = useState([]);
  const [stats, setStats] = useState({
    totalEquipos: 0,
    enCampo: 0,
    totalRecuperados: 0
  });
  const [cargando, setCargando] = useState(true);

  // Función para obtener todos los datos reales del sistema
  const obtenerDatosReporte = async () => {
    try {
      setCargando(true);
      
      // 1. Obtenemos estadísticas globales (Contadores)
      const resStats = await jh7Api.get('/instalaciones/stats/globales');
      setStats(resStats.data);

      // 2. Obtenemos lista de técnicos registrados
      const resUsuarios = await jh7Api.get('/usuarios'); 
      const soloTecnicos = resUsuarios.data.filter(
        u => u.rol === 'TECNICO' || u.rol === 'Tecnico' || u.rol === 'Técnico'
      );
      setTecnicosReales(soloTecnicos);

      setCargando(false);
    } catch (error) {
      console.error("Error al cargar datos del reporte:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerDatosReporte();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. RESUMEN DE MATERIALES Y EQUIPOS REALES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReportCard 
          title="Stock Total Equipos" 
          value={stats.totalEquipos} 
          sub="Disponibles en Almacén" 
          icon={<Package className="text-blue-500"/>} 
        />
        <ReportCard 
          title="Equipos en Campo" 
          value={stats.enCampo} 
          sub="Asignados a técnicos" 
          icon={<TrendingUp className="text-green-500"/>} 
        />
        <ReportCard 
          title="Equipos Recuperados" 
          value={stats.totalRecuperados} 
          sub="Total histórico registrado" 
          icon={<RotateCcw className="text-jh7_red"/>} 
          isAlert={stats.totalRecuperados > 0} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. RANKING DE PRODUCTIVIDAD (BASADO EN USUARIOS REALES) */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-lg uppercase flex items-center gap-2 dark:text-white">
              <Award className="text-jh7_red" size={20}/> Productividad Real JH7
            </h3>
            <span className="text-[10px] font-bold bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full dark:text-gray-300">
              {periodo}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-gray-400 uppercase tracking-widest border-b dark:border-slate-700">
                  <th className="pb-4">Técnico</th>
                  <th className="pb-4 text-center">Estado</th>
                  <th className="pb-4 text-right">Efectividad</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {tecnicosReales.length > 0 ? (
                  tecnicosReales.map((t, i) => (
                    <tr key={t.id || i} className="text-sm font-bold dark:text-white">
                      <td className="py-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> {t.nombre}
                      </td>
                      <td className="py-4 text-center text-gray-500">
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md font-black">ACTIVO</span>
                      </td>
                      <td className="py-4 text-right font-black">0%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-10 text-center text-xs text-gray-400 font-bold uppercase italic">
                      {cargando ? "Sincronizando con base de datos..." : "No se encontraron técnicos"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. TABLA: INCIDENCIAS (POR AHORA VACÍA HASTA QUE HAYA FALLOS) */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="font-black text-lg uppercase mb-6 flex items-center gap-2 dark:text-white">
            <AlertCircle className="text-orange-500" size={20}/> Instalaciones Fallidas
          </h3>
          <div className="space-y-4">
             <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-[2rem]">
                <CheckCircle2 size={30} className="text-green-500 mb-2 opacity-20" />
                <p className="text-[10px] text-gray-400 font-black uppercase italic">
                  Sin incidencias reportadas hoy
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* 4. TOTALES MENSUALES - CONSOLIDADO FINAL */}
      <div className="bg-jh7_dark p-8 rounded-[3rem] text-white shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-jh7_red rounded-2xl shadow-lg shadow-red-500/20">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">Reporte Consolidado Mensual</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <MetricSmall label="Total Instaladas" value="0" icon={<CheckCircle2 size={14}/>} />
          {/* Aquí mostramos tus 4 recuperados reales */}
          <MetricSmall label="Total Recuperadas" value={stats.totalRecuperados} icon={<RotateCcw size={14}/>} />
          <MetricSmall label="Reprogramadas" value="0" icon={<Clock size={14}/>} />
          <MetricSmall label="Rechazadas" value="0" icon={<XCircle size={14}/>} />
        </div>
      </div>

    </div>
  );
};

// --- COMPONENTE INTERNO: TARJETAS DE REPORTE ---
const ReportCard = ({ title, value, sub, icon, isAlert }) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl">{icon}</div>
      {isAlert && (
        <span className="animate-pulse bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[9px] font-black px-2 py-1 rounded-full uppercase">
          Real Time
        </span>
      )}
    </div>
    <p className="text-4xl font-black text-jh7_dark dark:text-white tracking-tighter">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </p>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{title}</p>
    <p className="text-xs text-gray-500 mt-4 italic font-medium">{sub}</p>
  </div>
);

// --- COMPONENTE INTERNO: MÉTRICA PEQUEÑA ---
const MetricSmall = ({ label, value, icon }) => (
  <div className="group">
    <div className="flex items-center gap-2 text-jh7_red mb-1 group-hover:translate-x-1 transition-transform">
      {icon} 
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</span>
    </div>
    <p className="text-3xl font-black tracking-tighter text-white">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </p>
  </div>
);