import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Calendar, Monitor, Wrench, Loader2, CheckCircle2 } from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const DetalleSolicitud = ({ idSolicitud, onClose }) => {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        const { data } = await jh7Api.get(`/instalaciones/${idSolicitud}`);
        setDatos(data);
      } catch (error) {
        console.error("Error al obtener la solicitud:", error);
      } finally {
        setCargando(false);
      }
    };
    if (idSolicitud) obtenerDetalle();
  }, [idSolicitud]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20">
        
        {/* CABECERA (Se mantiene similar) */}
        <div className="bg-[#1e293b] p-8 text-white flex justify-between items-center border-b-4 border-jh7_red">
          <div>
            <span className="bg-[#E31E24] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {cargando ? 'Consultando...' : `OT #${idSolicitud}`}
            </span>
            <h3 className="text-2xl font-black uppercase mt-2 tracking-tighter italic">Detalle Técnico</h3>
          </div>
          <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-[#E31E24] transition-all"><X size={24} /></button>
        </div>

        {cargando ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#E31E24]" size={40} />
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Sincronizando datos...</p>
          </div>
        ) : datos ? (
          <>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoBlock icon={<User size={18}/>} label="Cliente" value={datos.cliente?.nombre || "N/A"} />
              <InfoBlock icon={<MapPin size={18}/>} label="Ubicación" value={datos.direccion || "N/A"} />
              <InfoBlock icon={<Calendar size={18}/>} label="Instalado el" value={new Date(datos.fecha).toLocaleDateString()} />
              <InfoBlock icon={<Wrench size={18}/>} label="Técnico" value={datos.tecnico?.nombre || "Sin asignar"} />
              
              {/* SECCIÓN DINÁMICA DE EQUIPOS */}
              <div className="md:col-span-2 bg-gray-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
                <div className="flex gap-4 items-start">
                  <Monitor className="text-[#E31E24] mt-1" />
                  <div className="w-full">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-3">Activos Vinculados</p>
                    
                    {/* Tarjeta de Equipo Principal */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm mb-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-black text-jh7_dark dark:text-white uppercase">
                                {datos.equipoTipo || 'EQUIPO'}: {datos.equipoModelo}
                            </p>
                            <span className="text-[9px] bg-green-100 text-green-600 px-2 py-0.5 rounded-md font-bold">ACTIVO</span>
                        </div>
                        <p className="text-[11px] font-mono text-gray-400 mt-1">S/N: {datos.equipoSN}</p>
                        
                        {/* Lógica para IPTV */}
                        {datos.equipoTipo === 'IPTV' && (
                            <div className="mt-3 flex gap-2">
                                <span className="text-[8px] font-black bg-blue-50 text-blue-500 px-2 py-1 rounded-lg border border-blue-100 uppercase">CABLE HDMI INCLUIDO</span>
                                <span className="text-[8px] font-black bg-blue-50 text-blue-500 px-2 py-1 rounded-lg border border-blue-100 uppercase">CONTROL REMOTO</span>
                            </div>
                        )}
                    </div>

                    {/* Desglose de Consumibles */}
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2 mt-4 ml-1">Insumos Utilizados</p>
                    <div className="grid grid-cols-2 gap-2">
                        {datos.materiales && datos.materiales.length > 0 ? (
                            datos.materiales.map((m, idx) => (
                                <div key={idx} className="bg-gray-100 dark:bg-slate-800 p-3 rounded-xl flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase">{m.nombre}</span>
                                    <span className="text-xs font-black text-jh7_red">{m.cantidad} {m.unidad}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-[10px] text-gray-400 italic">No hay insumos registrados en esta OT.</p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 flex justify-end">
              <button 
                onClick={onClose} 
                className="bg-jh7_dark text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-jh7_red transition-all shadow-xl"
              >
                CERRAR DETALLE
              </button>
            </div>
          </>
        ) : (
          <div className="p-20 text-center">
            <p className="text-jh7_red font-black uppercase text-sm italic">Error: El registro #{idSolicitud} no existe.</p>
          </div>
        )}
      </div>
    </div>
  );
};