import { useState, useEffect } from 'react';
import { Box, Hash, Ruler, AlertTriangle, RefreshCcw, Wrench, CheckCircle2, Laptop, Monitor } from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const MiStockTecnico = ({ user }) => {
  const [inventario, setInventario] = useState({ 
    equipos: [], 
    materiales: [], 
    recuperados: [],
    herramientas: [] 
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerStock = async () => {
      try {
        const { data } = await jh7Api.get(`/inventario/tecnico/${user.id}`);
        setInventario(data);
      } catch (error) {
        console.error("Error al cargar stock:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerStock();
  }, [user.id]);

  // Filtramos equipos listos para instalar (DISPONIBLE)
  const equiposDisponibles = inventario.equipos.filter(e => e.estado === 'DISPONIBLE');
  // Filtramos equipos para devolver (DANADO / RECUPERADO)
  const equiposParaDevolver = inventario.equipos.filter(e => e.estado === 'DANADO' || e.estado === 'RECUPERADO');

  if (cargando) return (
    <div className="p-20 text-center animate-pulse font-black text-gray-300 uppercase tracking-widest">
      Sincronizando Inventario...
    </div>
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Contadores Principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Routers Disponibles</p>
          <p className="text-2xl font-black text-jh7_dark">
            {equiposDisponibles.filter(e => e.tipo === 'ROUTER').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Decos TV Disponibles</p>
          <p className="text-2xl font-black text-jh7_dark">
            {equiposDisponibles.filter(e => e.tipo === 'IPTV').length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Equipos para Instalación */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Hash className="text-jh7_red" size={20} />
            <h3 className="font-black text-jh7_dark uppercase text-sm tracking-tighter">Equipos para Instalación</h3>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {equiposDisponibles.map(equipo => (
              <div key={equipo.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                <div className="flex items-center gap-3">
                  {equipo.tipo === 'ROUTER' ? <Laptop className="text-gray-400" size={18}/> : <Monitor className="text-gray-400" size={18}/>}
                  <div>
                    <p className="text-xs font-black text-jh7_dark uppercase">{equipo.tipo} {equipo.modelo === 'RECUPERADO' && <span className="text-[8px] bg-jh7_dark text-white px-1 ml-1 rounded">REC</span>}</p>
                    <p className="text-[10px] font-mono text-jh7_red font-bold">
                      {equipo.sn || equipo.mac} 
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-black bg-green-100 text-green-600 px-3 py-1 rounded-full uppercase tracking-tighter">Listo</span>
              </div>
            ))}
            {equiposDisponibles.length === 0 && (
              <p className="text-center py-10 text-gray-400 text-[10px] font-black uppercase italic">Sin equipos para instalar</p>
            )}
          </div>
        </div>

        {/* Material de Instalación (Se mantiene igual) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Ruler className="text-jh7_red" size={20} />
            <h3 className="font-black text-jh7_dark uppercase text-sm tracking-tighter">Material de Instalación</h3>
          </div>
          <div className="space-y-5">
            {inventario.materiales.map(mat => (
              <div key={mat.id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-[11px] font-black text-jh7_dark uppercase">{mat.nombre}</p>
                  <p className="text-xs font-bold text-gray-500">{mat.cantidad} {mat.unidad}</p>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${mat.cantidad < 20 ? 'bg-jh7_red' : 'bg-jh7_dark'}`}
                    style={{ width: `${Math.min((mat.cantidad / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección de Equipos para Devolución (Equipos Malos/Dañados) */}
      <div className="bg-jh7_dark p-8 rounded-[3rem] shadow-xl text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <RefreshCcw className="text-jh7_red" size={22} />
            <div>
              <h3 className="font-black uppercase text-sm tracking-widest">Equipos para Devolución (MALOS)</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Debes entregarlos en Almacén Central</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {equiposParaDevolver.map(equipo => (
            <div key={equipo.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <div>
                <p className="text-xs font-black text-white uppercase">{equipo.tipo}</p>
                <p className="text-[10px] font-mono text-gray-400 italic">S/N: {equipo.sn || equipo.mac}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black bg-red-500/20 text-jh7_red border border-jh7_red/30 px-2 py-1 rounded-lg uppercase">
                  Para Baja
                </span>
              </div>
            </div>
          ))}
          {equiposParaDevolver.length === 0 && (
            <p className="col-span-2 text-center py-6 text-gray-500 text-[10px] font-bold uppercase">No hay equipos dañados pendientes</p>
          )}
        </div>
      </div>
    </div>
  );
};