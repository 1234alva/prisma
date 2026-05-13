import { useState, useEffect } from 'react';
import jh7Api from '../api/jh7Api'; 
import { 
  PlusCircle, Inbox, Search, 
  ArrowRightLeft, History, X, Wrench, Box
} from 'lucide-react';


import { RegistrarIngreso } from './acciones/RegistrarIngreso';
import { DetalleSolicitud } from './acciones/DetalleSolicitud';

export const AlmacenDashboard = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarIngreso, setMostrarIngreso] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [equipoADespachar, setEquipoADespachar] = useState(null);
  
  
  const [stats, setStats] = useState({
    equiposStock: 0,
    fibraKm: 0,
    pendientes: 0,
    equiposLista: []
  });

  const [materiales, setMateriales] = useState([]); // Consumibles reales de la DB

  const cargarDatosReales = async () => {
    try {
      // 1. Obtener contadores globales (equiposStock, fibraKm, pendientes)
      const respStats = await jh7Api.get('/instalaciones/stats/globales');
      
      // 2. Obtener equipos disponibles en bodega
      const respEquipos = await jh7Api.get('/inventario/stock/disponible'); 
      
      // 3. Obtener lista de materiales (Drop, Tensores, etc)
      const respMateriales = await jh7Api.get('/inventario/materiales'); 
      
      setStats({
        equiposStock: respStats.data.equiposStock || 0,
        fibraKm: respStats.data.fibraKm || 0,
        pendientes: respStats.data.pendientes || 0,
        equiposLista: respEquipos.data.equiposBodega || []
      });

      setMateriales(respMateriales.data || []);
    } catch (error) {
      console.error("Error cargando datos de almacén:", error);
    }
  };

  useEffect(() => {
    cargarDatosReales();
  }, [mostrarIngreso]);

  const manejarBusqueda = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== "") {
      setSolicitudSeleccionada(searchTerm);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-[#f1f5f9] dark:bg-slate-900 transition-colors relative">
      
      {/* MODALES DE ACCIÓN */}
      {solicitudSeleccionada && (
        <DetalleSolicitud 
          idSolicitud={solicitudSeleccionada} 
          onClose={() => setSolicitudSeleccionada(null)} 
        />
      )}

      {equipoADespachar && (
        <ModalDespacho 
          equipo={equipoADespachar} 
          onClose={() => setEquipoADespachar(null)} 
          onFinish={cargarDatosReales} 
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-jh7_dark dark:text-white border-l-8 border-jh7_red pl-6 uppercase tracking-tighter italic">
            Centro de Logística
            <span className="text-gray-400 font-light text-2xl not-italic"> | ALMACÉN</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] mt-2 ml-6 text-[10px]">
              Operador: <span className="text-jh7_red">{user?.nombre || "Marcelo Manzaneda"}</span>
          </p>
        </div>

        <button 
          onClick={() => setMostrarIngreso(!mostrarIngreso)}
          className={`px-8 py-4 rounded-2xl text-[11px] font-black flex items-center justify-center gap-2 transition-all shadow-xl ${
            mostrarIngreso ? 'bg-jh7_dark text-white' : 'bg-jh7_red text-white shadow-red-500/20 hover:scale-105'
          }`}
        >
          {mostrarIngreso ? <><X size={18}/> CANCELAR</> : <><PlusCircle size={18}/> NUEVO INGRESO</>}
        </button>
      </div>

      {mostrarIngreso ? (
        <div className="animate-in slide-in-from-bottom-8 duration-500">
          <RegistrarIngreso onFinish={() => { setMostrarIngreso(false); cargarDatosReales(); }} />
        </div>
      ) : (
        <div className="animate-in fade-in duration-500 space-y-8">
          
          {/* 1. RESUMEN REAL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatBox title="Equipos en Stock" value={stats.equiposStock} />
            <StatBox title="Fibra Instalada" value={`${stats.fibraKm} km`} />
            <StatBox title="Tareas Pendientes" value={stats.pendientes} red={stats.pendientes > 0} />
          </div>

          {/* 2. BUSCADOR INTELIGENTE */}
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-jh7_red transition-colors" size={22} />
            <input 
              type="text" 
              placeholder="Buscar por Serie, MAC o Modelo..."
              className="w-full p-6 pl-16 rounded-[2rem] border-none shadow-lg focus:ring-4 focus:ring-jh7_red/10 dark:bg-slate-800 dark:text-white outline-none text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={manejarBusqueda}
            />
          </div>

          {/* 3. GRID PRINCIPAL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              {/* TABLA DE EQUIPOS */}
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-black text-2xl mb-10 flex items-center gap-3 uppercase tracking-tighter italic text-jh7_dark dark:text-white">
                  <Box className="text-jh7_red" size={24}/> Inventario de Equipos
                </h3>
                <TablaStock equipos={stats.equiposLista} onDespacho={setEquipoADespachar} /> 
              </div>

              {/* CONTROL DE HERRAMIENTAS */}
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-black text-2xl mb-10 flex items-center gap-3 uppercase tracking-tighter italic text-jh7_dark dark:text-white">
                  <Wrench className="text-jh7_red" size={24}/> Herramientas (Nivel 1)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToolStatus name="Fusionadora Skycom" status="Asignada: Armin" isOk={true} />
                    <ToolStatus name="Taladro Percutor" status="En Bodega" isOk={true} />
                    <ToolStatus name="Escalera 7m" status="Mantenimiento" isOk={false} />
                </div>
              </div>
            </div>

            {/* BARRA LATERAL - Consumibles Dinámicos */}
            <aside className="space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-black text-xl mb-8 flex items-center gap-3 uppercase tracking-tighter italic text-jh7_dark dark:text-white">
                  <Inbox className="text-jh7_red" size={22}/> Consumibles
                </h3>
                <div className="space-y-4">
                  {materiales.length > 0 ? materiales.map((m) => (
                    <MaterialItem 
                      key={m.id} 
                      name={m.nombre} 
                      stock={`${m.cantidadTotal} ${m.unidad === 'Metros' ? 'm' : 'pzas'}`} 
                      alert={m.cantidadTotal < 10} 
                    />
                  )) : (
                    <p className="text-[10px] text-gray-400 font-bold uppercase text-center py-4">Sin materiales en stock</p>
                  )}
                </div>
              </div>
              <ActividadReciente />
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTES INTERNOS ---

const ModalDespacho = ({ equipo, onClose, onFinish }) => {
    const [tecnicos, setTecnicos] = useState([]);
    const [tecnicoId, setTecnicoId] = useState("");
    const [enviando, setEnviando] = useState(false);
  
    useEffect(() => {
      const cargarTecnicos = async () => {
        try {
          const { data } = await jh7Api.get('/usuarios');
          setTecnicos(data.filter(u => u.rol === 'TECNICO'));
        } catch (error) { console.error(error); }
      };
      cargarTecnicos();
    }, []);
  
    const confirmar = async () => {
      if (!tecnicoId) return;
      setEnviando(true);
      try {
        await jh7Api.post(`/inventario/asignar-todo`, { 
          tecnicoId, 
          equiposIds: [equipo.id],
          materiales: [] 
        });
        onFinish();
        onClose();
      } catch (e) { 
        alert("Error al procesar salida"); 
      } finally { 
        setEnviando(false); 
      }
    };
  
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-jh7_dark/90 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative">
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-jh7_red transition-colors"><X size={24}/></button>
          <h3 className="text-2xl font-black uppercase italic mb-8 dark:text-white">Despacho de Equipo</h3>
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl mb-8">
            <p className="text-[10px] font-black text-jh7_red uppercase mb-1">Activo</p>
            <p className="text-sm font-bold dark:text-white">{equipo.modelo} - {equipo.sn || equipo.mac || equipo.serie}</p>
          </div>
          <select 
            className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-sm dark:text-white"
            value={tecnicoId}
            onChange={(e) => setTecnicoId(e.target.value)}
          >
            <option value="">Seleccionar Técnico...</option>
            {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
          <button 
            onClick={confirmar}
            disabled={!tecnicoId || enviando}
            className="w-full mt-8 py-5 bg-jh7_red text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-red-500/20 disabled:opacity-50"
          >
            {enviando ? "DESPACHANDO..." : "CONFIRMAR ENTREGA"}
          </button>
        </div>
      </div>
    );
};

const StatBox = ({ title, value, red }) => (
  <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-700">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{title}</p>
    <p className={`text-5xl font-black tracking-tighter ${red ? 'text-jh7_red' : 'text-jh7_dark dark:text-white'}`}>
        {value}
    </p>
  </div>
);

const ToolStatus = ({ name, status, isOk }) => (
    <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-700 hover:scale-[1.02] transition-all">
        <div>
            <p className="text-xs font-black uppercase dark:text-white tracking-tighter">{name}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{status}</p>
        </div>
        <div className={`h-3 w-3 rounded-full ${isOk ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500 animate-pulse'}`} />
    </div>
);

const TablaStock = ({ equipos, onDespacho }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-100 dark:border-slate-700">
        <tr>
          <th className="pb-4">Modelo</th>
          <th className="pb-4">SN/Serie</th>
          <th className="pb-4">Estado</th>
          <th className="pb-4 text-right">Acción</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
        {equipos && equipos.length > 0 ? equipos.map((equipo, i) => (
          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
            <td className="py-5 font-bold text-sm dark:text-white">{equipo.modelo}</td>
            <td className="py-5 text-gray-400 font-mono text-xs italic">{equipo.sn || equipo.mac || equipo.serie}</td>
            <td className="py-5">
              <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${
                equipo.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {equipo.estado}
              </span>
            </td>
            <td className="py-5 text-right">
              <button 
                onClick={() => onDespacho(equipo)}
                className="bg-jh7_red/10 text-jh7_red p-2 rounded-xl hover:bg-jh7_red hover:text-white transition-all shadow-sm"
              >
                <ArrowRightLeft size={16}/>
              </button>
            </td>
          </tr>
        )) : (
            <tr><td colSpan="4" className="py-10 text-center text-gray-400 font-black uppercase text-[10px]">No hay equipos disponibles en bodega</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const MaterialItem = ({ name, stock, alert }) => (
    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border-l-4 border-transparent hover:border-jh7_red transition-all">
      <span className="font-black text-[10px] uppercase text-gray-500">{name}</span>
      <p className={`text-lg font-black ${alert ? 'text-red-600' : 'dark:text-white'}`}>{stock}</p>
    </div>
);

const ActividadReciente = () => (
  <div className="bg-jh7_dark rounded-[3rem] p-10 shadow-xl text-white">
    <h3 className="font-black text-[10px] mb-8 flex items-center gap-3 uppercase tracking-widest italic">
      <History className="text-jh7_red" size={18}/> Eventos de hoy
    </h3>
    <div className="space-y-6">
      <div className="border-l-2 border-jh7_red pl-4">
        <p className="text-[9px] font-black uppercase text-gray-500">Sistema</p>
        <p className="text-xs font-bold">Base de datos sincronizada con Prisma</p>
        <p className="text-[8px] text-jh7_red mt-1 font-bold uppercase tracking-tighter">Ahora</p>
      </div>
    </div>
  </div>
);