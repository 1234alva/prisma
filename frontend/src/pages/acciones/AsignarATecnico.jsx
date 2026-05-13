import { useState, useEffect } from 'react';
import { User, Search, Package, CheckCircle2, ArrowRight, Loader2, HardDrive, ShieldCheck, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jh7Api from '../../api/jh7Api';

export const AsignarATecnico = ({ user, onFinish }) => {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  
  const [tecnicos, setTecnicos] = useState([]);
  const [inventario, setInventario] = useState([]); // Equipos (S/N)
  const [materialesDB, setMaterialesDB] = useState([]); // Materiales (Metros/Unidades)
  const [busqueda, setBusqueda] = useState("");
  
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState(null);
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);

  // Cargar Técnicos
  useEffect(() => {
    const obtenerTecnicos = async () => {
      setCargando(true);
      try {
        const { data } = await jh7Api.get('/usuarios');
        const activos = data.filter(u => u.rol === 'TECNICO' && u.activo === true);
        setTecnicos(activos);
      } catch (error) {
        console.error("Error cargando personal:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerTecnicos();
  }, []);

  // Cargar Stock (Equipos + Materiales)
  useEffect(() => {
    if (paso === 2) {
      const obtenerStockTodo = async () => {
        setCargando(true);
        try {
          // Asumiendo que tienes estos endpoints en tu backend NestJS
          const [resEquipos, resMateriales] = await Promise.all([
            jh7Api.get('/inventario/stock/disponible'),
            jh7Api.get('/inventario/materiales') 
          ]);
          setInventario(resEquipos.data);
          setMaterialesDB(resMateriales.data);
        } catch (error) {
          console.error("Error cargando stock:", error);
        } finally {
          setCargando(false);
        }
      };
      obtenerStockTodo();
    }
  }, [paso]);

  const toggleEquipo = (equipo) => {
    const existe = equiposSeleccionados.find(e => e.id === equipo.id);
    if (existe) {
      setEquiposSeleccionados(equiposSeleccionados.filter(e => e.id !== equipo.id));
    } else {
      setEquiposSeleccionados([...equiposSeleccionados, equipo]);
    }
  };

  const manejarCambioMaterial = (material, cantidad) => {
    const cantNum = parseInt(cantidad);
    if (isNaN(cantNum) || cantNum <= 0) {
      setMaterialesSeleccionados(materialesSeleccionados.filter(m => m.id !== material.id));
      return;
    }
    
    const existe = materialesSeleccionados.find(m => m.id === material.id);
    if (existe) {
      setMaterialesSeleccionados(materialesSeleccionados.map(m => 
        m.id === material.id ? { ...m, cantidadDespacho: cantNum } : m
      ));
    } else {
      setMaterialesSeleccionados([...materialesSeleccionados, { ...material, cantidadDespacho: cantNum }]);
    }
  };

  const ejecutarAsignacion = async () => {
    setCargando(true);
    try {
      const payload = {
        tecnicoId: tecnicoSeleccionado.id,
        // Equipos (Cambiarán poseedorId en la DB)
        equiposIds: equiposSeleccionados.map(e => e.id),
        // Materiales (Afectarán StockTecnico y cantidadTotal en Material)
        materiales: materialesSeleccionados.map(m => ({
          materialId: m.id,
          cantidad: m.cantidadDespacho
        })),
        herramientas: [],
      };

      await jh7Api.post('/inventario/despacho-completo', payload);
      alert("✅ Despacho registrado con éxito en JH7 System");
      
      if(onFinish) {
        onFinish();
      } else {
        navigate('/historial-bodega');
      }
    } catch (error) {
      alert("Error al procesar la asignación. Verifique el stock disponible.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
      
      {/* HEADER DE SECCIÓN */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-black text-jh7_dark dark:text-white border-l-8 border-jh7_red pl-6 uppercase italic tracking-tighter">
          Despacho Integral
          <span className="text-gray-400 font-light text-2xl not-italic ml-4">| FASE {paso}</span>
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-slate-700 transition-all">
        
        {/* INDICADOR DE PASOS */}
        <div className="flex justify-center mb-12 gap-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex flex-col items-center gap-2">
                <div className={`h-2 w-20 rounded-full transition-all duration-700 ${paso >= num ? 'bg-jh7_red shadow-[0_0_15px_rgba(231,0,0,0.4)]' : 'bg-gray-100 dark:bg-slate-900'}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${paso === num ? 'text-jh7_red' : 'text-gray-300'}`}>Fase {num}</span>
            </div>
          ))}
        </div>

        {/* PASO 1: SELECCIONAR TÉCNICO */}
        {paso === 1 && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black text-jh7_dark dark:text-white uppercase italic tracking-tight">Personal Responsable</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Selecciona al técnico que retira el material</p>
              </div>
              <div className="relative w-full md:w-72 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-jh7_red transition-colors" size={16} />
                <input 
                  type="text" placeholder="BUSCAR POR NOMBRE..."
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-[10px] font-black outline-none border-2 border-transparent focus:border-jh7_red transition-all shadow-inner"
                  value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
              {cargando ? (
                <div className="col-span-full py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-jh7_red mb-4" size={32} />
                    <span className="font-black text-gray-300 uppercase italic tracking-widest">Sincronizando con Servidor JH7...</span>
                </div>
              ) : (
                tecnicos.filter(t => t.nombre.toLowerCase().includes(busqueda.toLowerCase())).map((tec) => (
                  <button key={tec.id} onClick={() => { setTecnicoSeleccionado(tec); setPaso(2); setBusqueda(""); }}
                    className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-transparent hover:border-jh7_red hover:bg-white dark:hover:bg-slate-900 transition-all group relative overflow-hidden">
                    <div className="flex items-center gap-5 z-10">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl text-jh7_red shadow-sm group-hover:bg-jh7_red group-hover:text-white transition-all duration-300">
                        <User size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-jh7_dark dark:text-white uppercase text-xs italic">{tec.nombre}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Estado: Activo</p>
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-gray-300 group-hover:text-jh7_red group-hover:translate-x-2 transition-all z-10" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* PASO 2: SELECCIONAR EQUIPOS Y MATERIALES */}
        {paso === 2 && (
          <div className="animate-in slide-in-from-right duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
              <div>
                <h3 className="text-2xl font-black text-jh7_dark dark:text-white uppercase italic tracking-tight">Inventario Disponible</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Asignando a {tecnicoSeleccionado?.nombre}</p>
              </div>
              <div className="flex gap-2">
                <div className="bg-jh7_dark text-white px-5 py-3 rounded-2xl text-[9px] font-black uppercase border-b-4 border-jh7_red">
                  {equiposSeleccionados.length} EQUIPOS
                </div>
                <div className="bg-jh7_dark text-white px-5 py-3 rounded-2xl text-[9px] font-black uppercase border-b-4 border-gray-500">
                  {materialesSeleccionados.length} MATERIALES
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar mb-8">
              
              {/* COLUMNA EQUIPOS (S/N) */}
              <div>
                <p className="text-[10px] font-black text-jh7_red uppercase tracking-widest mb-4 flex items-center gap-2">
                  <HardDrive size={14} /> Equipos con Serial
                </p>
                <div className="space-y-3">
                  {inventario.map((equipo) => (
                    <div key={equipo.id} onClick={() => toggleEquipo(equipo)}
                      className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex justify-between items-center ${
                        equiposSeleccionados.find(e => e.id === equipo.id) 
                        ? 'border-jh7_red bg-red-50 dark:bg-red-500/10' 
                        : 'border-transparent bg-gray-50 dark:bg-slate-900/40'
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${equiposSeleccionados.find(e => e.id === equipo.id) ? 'bg-jh7_red text-white' : 'bg-white dark:bg-slate-800 text-gray-400'}`}>
                          <Package size={16} />
                        </div>
                        <div>
                          <p className="font-black text-[10px] uppercase dark:text-white">{equipo.modelo}</p>
                          <p className="text-[9px] font-mono text-jh7_red">{equipo.sn}</p>
                        </div>
                      </div>
                      {equiposSeleccionados.find(e => e.id === equipo.id) && <CheckCircle2 size={18} className="text-jh7_red" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMNA MATERIALES (CONSUMIBLES) */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Box size={14} /> Materiales Consumibles
                </p>
                <div className="space-y-3">
                  {materialesDB.map((mat) => (
                    <div key={mat.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/40 border-2 border-transparent flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-black text-[10px] uppercase dark:text-white">{mat.nombre}</p>
                          <p className="text-[9px] text-gray-500 font-bold">Disponible: {mat.cantidadTotal} {mat.unidad}</p>
                        </div>
                        <input 
                          type="number" 
                          min="0"
                          placeholder="0"
                          className="w-16 p-2 bg-white dark:bg-slate-800 rounded-xl text-[11px] font-black text-center outline-none border-b-2 border-transparent focus:border-jh7_red transition-all"
                          onChange={(e) => manejarCambioMaterial(mat, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setPaso(1)} className="flex-1 py-5 font-black text-[10px] uppercase text-gray-400 hover:text-jh7_red transition-colors italic">Atrás</button>
              <button 
                disabled={equiposSeleccionados.length === 0 && materialesSeleccionados.length === 0} 
                onClick={() => setPaso(3)} 
                className="flex-[3] bg-jh7_dark text-white py-5 rounded-2xl font-black text-[11px] uppercase shadow-2xl disabled:opacity-20 hover:scale-[1.01] active:scale-95 transition-all tracking-widest border-b-4 border-jh7_red">
                Revisar Resumen de Carga
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: CONFIRMACIÓN FINAL */}
        {paso === 3 && (
          <div className="animate-in zoom-in duration-500 text-center max-w-xl mx-auto">
            <div className="w-24 h-24 bg-jh7_dark text-jh7_red rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl border-b-4 border-jh7_red relative">
                <Package size={40} />
                <ShieldCheck className="absolute -top-2 -right-2 text-green-500 bg-white rounded-full p-1 shadow-lg" size={30} />
            </div>
            
            <h3 className="text-3xl font-black text-jh7_dark dark:text-white uppercase mb-4 tracking-tighter italic">Validar Salida</h3>
            
            <div className="bg-gray-50 dark:bg-slate-900/60 p-8 rounded-[2.5rem] mb-10 text-left border-2 border-dashed border-gray-200 dark:border-slate-700">
              <p className="text-[10px] text-gray-400 font-black uppercase mb-4 tracking-[0.2em]">Técnico Receptor:</p>
              <div className="flex items-center gap-4 mb-6 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                 <div className="w-10 h-10 bg-jh7_red rounded-xl flex items-center justify-center text-white font-black uppercase text-xl">
                    {tecnicoSeleccionado?.nombre.charAt(0)}
                 </div>
                 <p className="font-black text-sm uppercase dark:text-white">{tecnicoSeleccionado?.nombre}</p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {/* LISTA RESUMEN EQUIPOS */}
                {equiposSeleccionados.map(e => (
                  <div key={e.id} className="flex justify-between items-center py-3 px-5 bg-white dark:bg-slate-800 rounded-xl border-l-4 border-jh7_red">
                    <span className="text-[10px] font-black uppercase dark:text-gray-200 italic">{e.modelo}</span>
                    <span className="text-[10px] font-mono font-black text-jh7_red">{e.sn}</span>
                  </div>
                ))}

                {/* LISTA RESUMEN MATERIALES */}
                {materialesSeleccionados.map(m => (
                  <div key={m.id} className="flex justify-between items-center py-3 px-5 bg-white dark:bg-slate-800 rounded-xl border-l-4 border-gray-400">
                    <span className="text-[10px] font-black uppercase dark:text-gray-200">{m.nombre}</span>
                    <span className="text-[10px] font-black text-gray-500">{m.cantidadDespacho} {m.unidad}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setPaso(2)} className="flex-1 py-5 font-black text-[10px] uppercase text-gray-400 hover:text-jh7_dark transition-all">Regresar</button>
              <button onClick={ejecutarAsignacion} disabled={cargando}
                className="flex-[3] bg-jh7_red text-white py-6 rounded-[2rem] font-black text-xs uppercase shadow-2xl shadow-red-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 tracking-[0.1em]">
                {cargando ? <Loader2 className="animate-spin" size={20} /> : 'CONFIRMAR DESPACHO'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};