import { useState, useEffect } from 'react';
import { 
  PlusCircle, Power, LogOut, CheckCircle2, TrendingUp, 
  Wrench, ChevronRight, ClipboardList
} from 'lucide-react';

// IMPORTACIONES DE TUS COMPONENTES ORIGINALES (Sin cambios internos)
import { RegistrarInstalacion } from '../components/tecnico/RegistrarInstalacion'; 
import { GestionRecuperos } from '../components/tecnico/GestionRecuperos';
import { TrabajoAsignado } from '../components/tecnico/TrabajoAsignado';

export const DashboardTecnico = ({ user, onLogout }) => {
  const [seccion, setSeccion] = useState('inicio');
  const [estaActivo, setEstaActivo] = useState(false);
  const [stats, setStats] = useState({ hoy: 0, mes: 0 });
  const [cargando, setCargando] = useState(false);

  // Mantenemos tu lógica de sincronización de estadísticas
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      try {
        setCargando(true);
        const response = await fetch(`http://localhost:3000/instalaciones/tecnico/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const hoy = new Date().toISOString().split('T')[0];
          const instalacionesHoy = data.filter(i => i.fecha?.startsWith(hoy)).length;
          setStats({ hoy: instalacionesHoy, mes: data.length });
        }
      } catch (error) {
        console.error("Error al sincronizar stats:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchStats();
  }, [user?.id]);

  const toggleAsistencia = () => setEstaActivo(!estaActivo);

  return (
    <div className="min-h-screen bg-gray-50 pb-10 transition-all duration-300">
      
      {/* NAVBAR - Se mantiene igual */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleAsistencia}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl text-[10px] font-black transition-all ${
              estaActivo 
              ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
              : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Power size={14} />
            {estaActivo ? 'EN SERVICIO' : 'MARCAR ENTRADA'}
          </button>
          {cargando && <span className="text-[9px] font-black text-jh7_red animate-pulse">ACTUALIZANDO...</span>}
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block border-r pr-6 border-gray-100">
            <p className="text-xs font-black text-jh7_dark uppercase">{user?.nombre}</p>
            <p className="text-[9px] text-jh7_red font-bold uppercase italic">Técnico Nivel 1</p>
          </div>
          <button onClick={onLogout} className="p-2.5 bg-red-50 text-jh7_red rounded-xl hover:bg-jh7_red hover:text-white transition-all shadow-sm">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* ÁREA DE TRABAJO */}
      <div className="p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {seccion === 'inicio' ? (
            <>
              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center gap-6">
                  <div className="p-5 bg-green-50 text-green-600 rounded-3xl"><CheckCircle2 size={35} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hoy</p>
                    <p className="text-4xl font-black text-jh7_dark">{stats.hoy}</p>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center gap-6">
                  <div className="p-5 bg-blue-50 text-blue-600 rounded-3xl"><TrendingUp size={35} /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mes</p>
                    <p className="text-4xl font-black text-jh7_dark">{stats.mes}</p>
                  </div>
                </div>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nueva Instalación - Llama al formulario */}
                <button 
                  disabled={!estaActivo}
                  onClick={() => setSeccion('nueva-instalacion')}
                  className={`group flex items-center p-8 bg-jh7_red text-white rounded-[3rem] transition-all shadow-xl hover:scale-[1.02] ${!estaActivo && 'opacity-40 grayscale cursor-not-allowed'}`}
                >
                  <div className="p-4 bg-white/20 rounded-2xl mr-6"><PlusCircle size={32} /></div>
                  <div className="text-left">
                    <h3 className="font-black uppercase text-xl tracking-widest">Nueva Instalación</h3>
                    <p className="text-xs opacity-80 font-bold uppercase tracking-tighter">Formulario de registro</p>
                  </div>
                </button>

                {/* Agenda - Llama a TrabajoAsignado */}
                <button 
                  onClick={() => setSeccion('asignado')}
                  className="group flex items-center p-8 bg-white border-2 border-gray-100 rounded-[3rem] transition-all shadow-sm hover:border-blue-500"
                >
                  <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl mr-6"><ClipboardList size={32} /></div>
                  <div className="text-left">
                    <h3 className="font-black uppercase text-xl tracking-widest text-jh7_dark">Agenda del Día</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Órdenes de trabajo</p>
                  </div>
                </button>
              </div>

              {/* Banner inferior - Llama a GestionRecuperos */}
              <div className="bg-jh7_dark p-8 rounded-[3rem] text-white shadow-xl flex items-center justify-between cursor-pointer hover:bg-black transition-all"
                   onClick={() => setSeccion('recupero')}>
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-white/10 rounded-2xl text-jh7_red"><Wrench size={24} /></div>
                  <div>
                    <h3 className="font-black uppercase text-sm tracking-widest">Gestión de Equipos</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">Control de recuperos y herramientas</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-600" />
              </div>
            </>
          ) : (
            <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <button onClick={() => setSeccion('inicio')} className="text-[10px] font-black text-gray-400 hover:text-jh7_red uppercase tracking-widest flex items-center gap-2">
                ← Volver al inicio
              </button>
              
              <div className="bg-white p-2 rounded-[3rem] shadow-sm border border-gray-100">
                {/* RENDERIZADO DE LAS FUNCIONES */}
                {seccion === 'nueva-instalacion' && <RegistrarInstalacion user={user} />}
                {seccion === 'recupero' && <GestionRecuperos user={user} />}
                {seccion === 'asignado' && <TrabajoAsignado user={user} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};