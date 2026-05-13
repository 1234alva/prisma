import { useState, useEffect } from 'react';
import { Wrench, User, RotateCcw, Plus, Loader2, Search } from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const GestionHerramientas = () => {
  const [herramientas, setHerramientas] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState(""); 
  
  const [nuevaAsignacion, setNuevaAsignacion] = useState({
    herramientaId: "",
    tecnicoId: ""
  });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      // CORRECCIÓN: Rutas actualizadas a /inventario/...
      const [resHerramientas, resUsuarios] = await Promise.all([
        jh7Api.get('/inventario/herramientas'),
        jh7Api.get('/usuarios')
      ]);
      
      setHerramientas(resHerramientas.data || []);
      // Ajuste en el filtro de técnicos activos
      setTecnicos(resUsuarios.data.filter(u => u.rol === 'TECNICO'));
    } catch (error) {
      console.error("Error cargando gestión de herramientas:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleAsignar = async (e) => {
    e.preventDefault();
    if (!nuevaAsignacion.herramientaId || !nuevaAsignacion.tecnicoId) return;
    try {
      // CORRECCIÓN: Endpoint de asignación
      await jh7Api.post('/inventario/herramientas/asignar', nuevaAsignacion);
      setNuevaAsignacion({ herramientaId: "", tecnicoId: "" });
      cargarDatos();
    } catch (error) {
      alert("Error al procesar la asignación");
    }
  };

  const handleDevolucion = async (id) => {
    if (!window.confirm("¿Confirmas que la herramienta ha regresado al almacén?")) return;
    try {
      // CORRECCIÓN: Endpoint de devolución
      await jh7Api.patch(`/inventario/herramientas/devolver/${id}`);
      cargarDatos();
    } catch (error) {
      alert("Error al registrar devolución");
    }
  };

  // Filtrado en tiempo real
  const herramientasFiltradas = herramientas.filter(h => 
    (h.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) || 
    (h.tecnico?.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      {/* HEADER DINÁMICO */}
      <div className="mb-8">
        <h2 className="text-4xl font-black text-jh7_dark dark:text-white border-l-8 border-jh7_red pl-6 uppercase italic tracking-tighter">
          Gestión de Activos
          <span className="text-gray-400 font-light text-2xl not-italic ml-4">| HERRAMIENTAS</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA LISTADO */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* BUSCADOR ESTILIZADO */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
            <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-2xl text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar herramienta o técnico..."
              className="bg-transparent flex-1 outline-none font-bold text-sm dark:text-white"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-[0.2em]">Inventario Actual</h3>
              {cargando && <Loader2 className="animate-spin text-jh7_red" size={20}/>}
            </div>

            <div className="space-y-4">
              {herramientasFiltradas.length === 0 && !cargando && (
                <div className="text-center py-10 opacity-30 italic font-black uppercase text-xs">No hay herramientas registradas</div>
              )}
              
              {herramientasFiltradas.map(h => (
                <div key={h.id} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-900/40 rounded-[2rem] border-2 border-transparent hover:border-jh7_red transition-all group">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl shadow-inner ${h.estado === 'DISPONIBLE' || h.estado === 'Disponible' ? 'bg-green-500/10 text-green-500' : 'bg-jh7_red/10 text-jh7_red'}`}>
                       <Wrench size={22}/>
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase dark:text-white italic tracking-tight">{h.nombre}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${h.estado === 'DISPONIBLE' || h.estado === 'Disponible' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                          {h.estado}
                        </span>
                        {h.tecnico && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                            <User size={12} className="text-jh7_red" /> {h.tecnico.nombre}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {(h.estado !== 'DISPONIBLE' && h.estado !== 'Disponible') && (
                    <button 
                      onClick={() => handleDevolucion(h.id)}
                      className="group/btn relative overflow-hidden bg-jh7_dark text-white p-4 rounded-2xl hover:bg-jh7_red transition-all shadow-lg active:scale-95" 
                      title="Marcar como devuelto"
                    >
                      <RotateCcw size={18} className="group-hover/btn:-rotate-180 transition-transform duration-500"/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA FORMULARIO */}
        <div className="space-y-6">
          <div className="bg-jh7_dark p-10 rounded-[3rem] text-white shadow-2xl h-fit border-t-4 border-jh7_red">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-2 h-8 bg-jh7_red"></div>
               <h4 className="font-black uppercase text-sm tracking-tighter italic">Nueva Asignación</h4>
            </div>
            
            <form className="space-y-6" onSubmit={handleAsignar}>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 mb-3 block ml-1 tracking-widest">Herramienta disponible</label>
                <select 
                  value={nuevaAsignacion.herramientaId}
                  onChange={(e) => setNuevaAsignacion({...nuevaAsignacion, herramientaId: e.target.value})}
                  className="w-full bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-jh7_red transition-all text-white appearance-none cursor-pointer"
                >
                  <option value="">Seleccionar herramienta...</option>
                  {herramientas.filter(h => h.estado === 'DISPONIBLE' || h.estado === 'Disponible').map(h => (
                    <option key={h.id} value={h.id}>{h.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 mb-3 block ml-1 tracking-widest">Técnico responsable</label>
                <select 
                  value={nuevaAsignacion.tecnicoId}
                  onChange={(e) => setNuevaAsignacion({...nuevaAsignacion, tecnicoId: e.target.value})}
                  className="w-full bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-jh7_red transition-all text-white appearance-none cursor-pointer"
                >
                  <option value="">Seleccionar responsable...</option>
                  {tecnicos.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                disabled={!nuevaAsignacion.herramientaId || !nuevaAsignacion.tecnicoId}
                className="w-full bg-jh7_red py-5 rounded-2xl font-black uppercase text-xs shadow-xl shadow-red-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
              >
                <Plus size={20}/> Registrar Préstamo
              </button>
            </form>
          </div>

          {/* INDICADOR DE INFO */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-slate-700">
             <p className="text-[10px] font-bold text-gray-400 text-center uppercase leading-relaxed">
               Las herramientas en <span className="text-jh7_red font-black">Uso</span> deben ser devueltas antes de ser asignadas a otro técnico.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};