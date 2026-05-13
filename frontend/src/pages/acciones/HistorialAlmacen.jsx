import { useState, useEffect } from 'react';
import { 
  History, Calendar, User, ArrowUpRight, ArrowDownLeft, 
  Search, Download, Filter, Loader2, Clock
} from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const HistorialAlmacen = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        
        const { data } = await jh7Api.get('/inventario/historial');
        setMovimientos(data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerHistorial();
  }, []);

  const filtrados = movimientos.filter(mov => 
    mov.material.toLowerCase().includes(filtro.toLowerCase()) ||
    mov.usuario.toLowerCase().includes(filtro.toLowerCase()) ||
    mov.referencia?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-jh7_dark dark:text-white border-l-8 border-jh7_red pl-6 uppercase italic tracking-tighter">
            Historial de Bodega
            <span className="text-gray-400 font-light text-2xl not-italic ml-4">| AUDITORÍA</span>
          </h2>
        </div>
        <button className="bg-jh7_dark text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all">
          <Download size={16} /> Exportar Log
        </button>
      </div>

      {/* BUSCADOR RÁPIDO */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] shadow-sm mb-8 flex items-center gap-4 border border-gray-100 dark:border-slate-700">
        <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-xl text-jh7_red">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="BUSCAR POR TÉCNICO, MATERIAL O NÚMERO DE REMITO..."
          className="flex-1 bg-transparent outline-none font-black text-xs uppercase tracking-tighter dark:text-white"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {/* TABLA DE MOVIMIENTOS */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-jh7_dark text-white text-[10px] font-black uppercase tracking-widest italic">
              <th className="p-6">Fecha / Hora</th>
              <th className="p-6">Tipo</th>
              <th className="p-6">Material / Equipo</th>
              <th className="p-6">Cantidad</th>
              <th className="p-6">Responsable</th>
              <th className="p-6 text-right">Referencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {cargando ? (
              <tr><td colSpan="6" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-jh7_red" size={40}/></td></tr>
            ) : filtrados.map((mov) => (
              <tr key={mov.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/40 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-2 text-xs font-bold dark:text-gray-300">
                    <Clock size={14} className="text-gray-400" />
                    {new Date(mov.fecha).toLocaleString()}
                  </div>
                </td>
                <td className="p-6 text-center">
                  {mov.tipo === 'INGRESO' ? (
                    <span className="flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-50 dark:bg-green-500/10 px-3 py-1 rounded-full uppercase italic">
                      <ArrowDownLeft size={12} /> Entrada
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-black text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full uppercase italic">
                      <ArrowUpRight size={12} /> Salida
                    </span>
                  )}
                </td>
                <td className="p-6">
                  <p className="font-black text-xs uppercase dark:text-white">{mov.material?.nombre}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase italic">unidad: {mov.material?.unidad}</p>
                </td>
                <td className="p-6">
                  <span className={`font-black text-sm italic ${mov.tipo === 'INGRESO' ? 'text-green-600' : 'text-blue-600'}`}>
                    {mov.tipo === 'INGRESO' ? '+' : '-'}{mov.cantidad}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-jh7_red/10 flex items-center justify-center text-jh7_red">
                      <User size={14} />
                    </div>
                    <span className="text-[10px] font-black uppercase dark:text-gray-200">{mov.usuario}</span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <span className="text-[10px] font-mono font-bold bg-gray-100 dark:bg-slate-900 p-2 rounded text-gray-500 uppercase">
                    {mov.referencia || 'S/R'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};