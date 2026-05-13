import { useState, useEffect } from 'react';
import { Wrench, History, UserCheck, AlertCircle, Loader2, ArrowLeftRight } from 'lucide-react';
import jh7Api from '../../api/jh7Api'; 

export const SeccionHerramientas = () => {
  const [herramientas, setHerramientas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. CARGAR DATOS REALES DE LA BASE DE DATOS
  const obtenerHerramientas = async () => {
    try {
      setCargando(true);
      // Esta ruta debe devolver las herramientas incluyendo el modelo "poseedor"
      const { data } = await jh7Api.get('/herramientas');
      setHerramientas(data);
    } catch (error) {
      console.error("Error al cargar herramientas:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerHerramientas();
  }, []);

  // 2. LÓGICA DE DEVOLUCIÓN
  const manejarDevolucion = async (id) => {
    if (!window.confirm("¿Confirmas que la herramienta ha sido devuelta al almacén?")) return;
    
    try {
      // Llamada al backend para poner poseedorId en null y estado en DISPONIBLE
      await jh7Api.patch(`/herramientas/${id}/devolver`);
      alert("Herramienta devuelta con éxito");
      obtenerHerramientas(); // Recargar lista
    } catch (error) {
      console.error("Error al devolver:", error);
      alert("No se pudo procesar la devolución");
    }
  };

  // 3. CÁLCULO DE ESTADÍSTICAS EN TIEMPO REAL
  const stats = {
    total: herramientas.length,
    prestadas: herramientas.filter(h => h.estado === 'PRESTADO' || h.poseedorId !== null).length,
    disponibles: herramientas.filter(h => h.estado === 'DISPONIBLE' && !h.poseedorId).length,
    reparacion: herramientas.filter(h => h.estado === 'REPARACION').length
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. RESUMEN DE ACTIVOS REAL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatHerramienta title="Total Herramientas" valor={stats.total} color="bg-jh7_dark" />
        <StatHerramienta title="En Uso (Prestadas)" valor={stats.prestadas} color="bg-orange-500" />
        <StatHerramienta title="Disponibles" valor={stats.disponibles} color="bg-green-500" />
        <StatHerramienta title="En Reparación" valor={stats.reparacion} color="bg-red-500" />
      </div>

      {/* 2. TABLA DE CONTROL */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black uppercase flex items-center gap-2">
            <Wrench className="text-jh7_red"/> Control de Activos y Herramientas
          </h3>
          <button className="bg-jh7_dark text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-jh7_red transition-colors">
            Registrar Nueva Herramienta
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="pb-4 px-4">Herramienta / Código</th>
                <th className="pb-4">Responsable (Poseedor)</th>
                <th className="pb-4">Estado Actual</th>
                <th className="pb-4 text-right pr-4">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
              {cargando ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-jh7_red" size={40}/>
                    <p className="text-[10px] font-black text-gray-400 uppercase mt-4">Sincronizando Inventario...</p>
                  </td>
                </tr>
              ) : herramientas.length > 0 ? (
                herramientas.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-5 px-4">
                      <p className="font-black text-sm dark:text-white uppercase">{h.nombre}</p>
                      <p className="text-[9px] text-jh7_red font-bold uppercase tracking-tighter">ID: {h.id.substring(0,8)}</p>
                    </td>
                    
                    <td className="py-5">
                      <div className="flex items-center gap-2">
                        <UserCheck size={14} className={h.poseedor ? "text-jh7_red" : "text-gray-300"}/>
                        <div>
                          <p className={`text-xs font-black uppercase ${h.poseedor ? 'text-jh7_dark dark:text-gray-200' : 'text-gray-400'}`}>
                            {h.poseedor ? h.poseedor.nombre : 'En Almacén'}
                          </p>
                          {h.poseedor && <p className="text-[9px] text-gray-400 font-bold uppercase">Técnico de Campo</p>}
                        </div>
                      </div>
                    </td>

                    <td className="py-5">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border ${
                        h.estado === 'DISPONIBLE' 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : h.estado === 'REPARACION' 
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {h.estado}
                      </span>
                    </td>

                    <td className="py-5 text-right pr-4">
                      {h.poseedorId ? (
                        <button 
                          onClick={() => manejarDevolucion(h.id)}
                          className="text-[9px] font-black flex items-center gap-2 ml-auto bg-jh7_dark text-white px-4 py-2 rounded-xl hover:bg-jh7_red transition-all uppercase shadow-md shadow-black/10"
                        >
                          <ArrowLeftRight size={12}/> Confirmar Devolución
                        </button>
                      ) : (
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Listo para asignar</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <AlertCircle className="mx-auto text-gray-200 mb-2" size={40}/>
                    <p className="text-xs font-black text-gray-400 uppercase">No hay herramientas registradas en la base de datos</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatHerramienta = ({ title, valor, color }) => (
  <div className={`${color} p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group`}>
    <div className="relative z-10">
      <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-1">{title}</p>
      <p className="text-4xl font-black">{valor}</p>
    </div>
    <Wrench className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform" size={100} />
  </div>
);