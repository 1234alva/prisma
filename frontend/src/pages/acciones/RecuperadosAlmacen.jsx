import { useState, useEffect } from 'react';
import { 
  RotateCcw, Search, CheckCircle, XCircle, 
  User, Hash, Box 
} from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const RecuperadosAlmacen = () => {
  const [equiposPendientes, setEquiposPendientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  
  useEffect(() => {
    const obtenerRecuperados = async () => {
      setCargando(true);
      try {
        const { data } = await jh7Api.get('/inventario/equipos-recuperados');
        setEquiposPendientes(data);
      } catch (error) {
        console.error("Error al cargar recuperados", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerRecuperados();
  }, []);

  const handleProcesar = async (id, decision) => {
    try {
      const nuevoEstado = decision === 'OPERATIVO' ? 'DISPONIBLE' : 'DANADO';
    
      await jh7Api.patch(`/inventario/procesar-recuperado/${id}`, { nuevoEstado });
      
      
      setEquiposPendientes(prev => prev.filter(e => e.id !== id));
      
    
      alert(`Equipo procesado como: ${decision}`);
      
    } catch (error) {
      console.error(error);
      alert("Error al procesar el equipo");
    }
  };


  const filtrados = equiposPendientes.filter(e => 
    e.sn?.toLowerCase().includes(busqueda.toLowerCase()) || 
    e.poseedor?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      {/* HEADER ESTILO JH7 */}
      <div className="mb-8">
        <h2 className="text-4xl font-black text-jh7_dark dark:text-white border-l-8 border-jh7_red pl-6 uppercase italic tracking-tighter">
          Gestión de Recuperados
          <span className="text-gray-400 font-light text-2xl not-italic ml-4">| RECEPCIÓN</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* COLUMNA PRINCIPAL: LISTADO */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* BARRA DE BÚSQUEDA */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
            <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-2xl text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar por S/N o Técnico..."
              className="bg-transparent flex-1 outline-none font-bold text-sm dark:text-white"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* LISTA DE EQUIPOS */}
          <div className="space-y-4">
            {cargando ? (
              <div className="text-center py-10 italic text-gray-400">Cargando equipos...</div>
            ) : filtrados.length > 0 ? (
              filtrados.map((equipo) => (
                <div key={equipo.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all border border-transparent hover:border-jh7_red group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    {/* INFO DEL EQUIPO */}
                    <div className="flex items-center gap-5">
                      <div className="bg-jh7_dark p-4 rounded-2xl text-jh7_red group-hover:scale-110 transition-transform">
                        <Box size={24} />
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-sm dark:text-white italic">{equipo.modelo || "EQUIPO RECUPERADO"}</h4>
                        <div className="flex items-center gap-2 text-gray-500 font-mono text-xs font-bold">
                          <Hash size={12} /> {equipo.sn}
                        </div>
                      </div>
                    </div>

                    {/* INFO ORIGEN */}
                    <div className="flex items-center gap-8">
                      <div className="text-right hidden md:block">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Traído por</p>
                        <div className="flex items-center justify-end gap-2 text-xs font-bold dark:text-gray-300">
                          <User size={14} className="text-jh7_red" /> {equipo.poseedor?.nombre || "TÉCNICO"}
                        </div>
                      </div>

                      {/* ACCIONES */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleProcesar(equipo.id, 'OPERATIVO')}
                          className="flex items-center gap-2 px-5 py-3 bg-green-500/10 text-green-600 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-green-600 hover:text-white transition-all"
                        >
                          <CheckCircle size={16} /> Operativo
                        </button>
                        <button 
                          onClick={() => handleProcesar(equipo.id, 'DAÑADO')}
                          className="flex items-center gap-2 px-5 py-3 bg-red-500/10 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all"
                        >
                          <XCircle size={16} /> Dañado
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-100 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
                <RotateCcw size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No hay equipos pendientes</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA LATERAL: RESUMEN */}
        <div className="space-y-6">
          <div className="bg-jh7_dark rounded-[3rem] p-8 text-white shadow-xl">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 italic text-jh7_red">Resumen Marcelo</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase">Esperando Ingreso</p>
                <p className="text-4xl font-black italic">{equiposPendientes.length}</p>
              </div>
              <div className="h-[1px] bg-white/10"></div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-bold italic">
                "Recuerda que los equipos <span className="text-white">OPERATIVOS</span> vuelven automáticamente al stock disponible."
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};