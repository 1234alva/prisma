import { useState, useEffect } from 'react';
import { Briefcase, Send, ClipboardList, Info, Loader2 } from 'lucide-react';
import jh7Api from '../../api/jh7Api'; 

export const SeccionTrabajo = () => {
  const [numSolicitud, setNumSolicitud] = useState("");
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState("");
  const [prioridad, setPrioridad] = useState("Normal");
  
  // Estado para los técnicos de campo (excluyendo a Henry/Admin)
  const [tecnicosCampo, setTecnicosCampo] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const { data } = await jh7Api.get('/usuarios');
        
        /**
         * FILTRO CLAVE:
         * 1. Solo usuarios con rol 'TECNICO'.
         * 2. (Opcional) Excluir específicamente por nombre si Henry tiene rol técnico por error.
         */
        const soloTecnicos = data.filter(u => 
          u.rol === 'TECNICO' && u.nombre !== 'Henry Eulate'
        );

        setTecnicosCampo(soloTecnicos);
      } catch (error) {
        console.error("Error al cargar técnicos:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  const handleAsignar = async (e) => {
    e.preventDefault();
    if(!tecnicoSeleccionado) return alert("Selecciona un técnico");
    
    console.log(`Asignando a: ${tecnicoSeleccionado}`);
    alert(`Trabajo enviado al técnico seleccionado.`);
    setNumSolicitud("");
    setTecnicoSeleccionado("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* FORMULARIO DE DESPACHO */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-gray-100">
        <h3 className="text-2xl font-black uppercase text-jh7_dark dark:text-white mb-6 flex items-center gap-2">
          <Briefcase className="text-jh7_red"/> Despacho de Solicitudes
        </h3>
        
        <form onSubmit={handleAsignar} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2"># Solicitud</label>
            <input 
              type="text" 
              required
              placeholder="Ej: JH-101" 
              className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-jh7_red"
              value={numSolicitud}
              onChange={(e) => setNumSolicitud(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Técnico de Turno</label>
            <select 
              required
              className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl outline-none font-bold text-sm cursor-pointer"
              value={tecnicoSeleccionado}
              onChange={(e) => setTecnicoSeleccionado(e.target.value)}
            >
              <option value="">Seleccionar técnico...</option>
              {tecnicosCampo.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Prioridad</label>
             <div className="flex gap-2">
                {['Normal', 'Urgente'].map(p => (
                  <button key={p} type="button" onClick={() => setPrioridad(p)}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${prioridad === p ? 'bg-jh7_dark text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {p}
                  </button>
                ))}
             </div>
          </div>

          <div className="flex items-end">
            <button type="submit" className="w-full bg-jh7_red text-white p-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg">
              <Send size={18}/> ENVIAR
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LISTADO DINÁMICO DE TAREAS (SÓLO TÉCNICOS REGISTRADOS) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-black text-lg uppercase mb-6 flex items-center gap-2">
            <ClipboardList className="text-jh7_red" size={20}/> Tareas en Curso
          </h3>
          <div className="space-y-4">
              {cargando ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-jh7_red" /></div>
              ) : tecnicosCampo.length > 0 ? (
                tecnicosCampo.map(t => (
                  <TrabajoRow 
                    key={t.id} 
                    id={`ORD-${t.nombre.substring(0,2).toUpperCase()}`} 
                    cliente="Pendiente..." 
                    tecnico={t.nombre} 
                    estado="Disponible" 
                  />
                ))
              ) : (
                <p className="text-center text-gray-400 py-10 font-bold uppercase text-xs">Esperando personal de campo...</p>
              )}
          </div>
        </div>

        {/* RESUMEN DE PERSONAL ACTIVO (SIN HENRY) */}
        <div className="space-y-6">
          <div className="bg-jh7_dark p-6 rounded-3xl text-white shadow-xl border-b-4 border-jh7_red">
            <div className="flex items-center gap-2 mb-4 text-jh7_red">
              <Info size={18}/>
              <h4 className="text-[10px] font-black uppercase tracking-widest">Personal de Campo</h4>
            </div>
            
            <div className="space-y-4">
              {tecnicosCampo.map(t => (
                <div key={t.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                  <span className="text-xs font-bold">{t.nombre}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase text-gray-400">Listo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const TrabajoRow = ({ id, cliente, tecnico, estado }) => (
  <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border-l-4 border-transparent hover:border-jh7_red transition-all shadow-sm">
    <div className="flex items-center gap-6">
      <div className="text-[10px] font-black text-jh7_red font-mono bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-gray-100">{id}</div>
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Responsable</p>
        <p className="text-sm font-black dark:text-gray-200 uppercase">{tecnico}</p>
      </div>
    </div>
    <span className="text-[9px] font-black px-4 py-1.5 rounded-full uppercase bg-green-100 text-green-600 border border-green-200">
      {estado}
    </span>
  </div>
);