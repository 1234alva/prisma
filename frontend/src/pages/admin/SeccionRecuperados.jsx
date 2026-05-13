import React, { useState, useEffect } from 'react';
import jh7Api from '../../api/jh7Api';
import { 
  RefreshCcw, PackageCheck, Eye, X, 
  Calendar, User, Hash, Info, Smartphone, UserCheck 
} from 'lucide-react';

export const SeccionRecuperados = () => {
  const [recuperados, setRecuperados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      setLoading(true);
      const resp = await jh7Api.get('/instalaciones/recuperaciones/todas'); 
      setRecuperados(resp.data);
    } catch (error) {
      console.error("Error cargando recuperados", error);
    } finally {
      setLoading(false);
    }
  };

  // Función de cierre seguro
  const cerrarModal = (e) => {
    if (e) e.stopPropagation(); // Evita que el evento suba
    setSeleccionado(null);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-jh7_red p-2 rounded-lg">
          <RefreshCcw className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-black uppercase text-jh7_dark">Control de Retiros y Recuperaciones</h2>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-slate-700/50">
            <tr className="text-[11px] font-black uppercase text-gray-400 tracking-widest">
              <th className="px-6 py-5"># Solicitud</th>
              <th className="px-6 py-5">Fecha</th>
              <th className="px-6 py-5">Técnico</th>
              <th className="px-6 py-5">S/N Equipo</th>
              <th className="px-6 py-5 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recuperados.map((item) => (
              <tr key={item.id} className="text-sm font-bold hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4 text-jh7_red">#{item.numSolicitud}</td>
                <td className="px-6 py-4 text-gray-500">
                  {item.fechaRetiro ? new Date(item.fechaRetiro).toLocaleDateString('es-ES') : '---'}
                </td>
                <td className="px-6 py-4">{item.tecnico?.nombre}</td>
                <td className="px-6 py-4 font-mono text-xs">{item.sn_mac}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSeleccionado(item)}
                    className="p-2 hover:bg-jh7_red hover:text-white rounded-xl transition-all"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CORREGIDO */}
      {seleccionado && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          onClick={cerrarModal} // Si haces clic fuera del cuadro blanco, también se cierra
        >
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()} // Evita que al hacer clic dentro del modal se cierre
          >
            {/* Cabecera */}
            <div className="bg-jh7_red p-6 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase opacity-80">Información de Retiro</p>
                <h3 className="text-xl font-black">Solicitud #{seleccionado.numSolicitud}</h3>
              </div>
              <button 
                type="button"
                onClick={cerrarModal} 
                className="hover:rotate-90 transition-transform bg-white/20 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-8 space-y-5">
              <DetailItem icon={<User size={18}/>} label="Cliente" value={seleccionado.clienteNombre} />
              <DetailItem icon={<UserCheck size={18}/>} label="Técnico" value={seleccionado.tecnico?.nombre} />
              <DetailItem 
                icon={<Calendar size={18}/>} 
                label="Fecha Registro" 
                value={seleccionado.fechaRetiro ? new Date(seleccionado.fechaRetiro).toLocaleString('es-ES') : 'N/A'} 
              />
              <DetailItem icon={<Smartphone size={18}/>} label="S/N o MAC" value={seleccionado.sn_mac} />
              <DetailItem icon={<Info size={18}/>} label="Servicio" value={seleccionado.tipo_servicio} />
              
              <div className="mt-4 p-5 bg-gray-50 dark:bg-slate-800 rounded-3xl border-l-4 border-jh7_red">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Observaciones</p>
                <p className="text-sm font-bold text-slate-600 italic">
                  "{seleccionado.observaciones || 'Sin observaciones.'}"
                </p>
              </div>
            </div>

            {/* Botón Inferior */}
            <div className="p-6 bg-gray-50 dark:bg-slate-800 flex justify-end">
              <button 
                type="button"
                onClick={cerrarModal}
                className="bg-jh7_dark text-white px-8 py-3 rounded-2xl font-black uppercase text-xs hover:bg-jh7_red transition-colors"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="text-jh7_red bg-red-50 p-3 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-sm font-black text-slate-700">{value || 'N/A'}</p>
    </div>
  </div>
);