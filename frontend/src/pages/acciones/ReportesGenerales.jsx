import { useState, useEffect } from 'react';
import { 
  BarChart3, Download, ArrowUpRight, ArrowDownRight, 
  CheckCircle, RotateCcw, Loader2 
} from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const ReportesGenerales = () => {
  const [historial, setHistorial] = useState([]);
  const [stats, setStats] = useState({
    recibido: 0,
    instalados: 0,
    recuperados: 0,
    transito: 0
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarReportes = async () => {
      setCargando(true);
      try {
        // CORRECCIÓN DE RUTAS: Sincronizadas con InventarioController de NestJS
        const [resHistorial, resStats] = await Promise.all([
          jh7Api.get('/inventario/historial'),
          jh7Api.get('/inventario/general') // Usamos el endpoint general para las métricas
        ]);

        setHistorial(resHistorial.data || []);
        
        // Mapeo de estadísticas desde la respuesta del servidor
        if (resStats.data) {
            setStats({
                recibido: resStats.data.totalEquipos || 0,
                instalados: resStats.data.totalAsignados || 0,
                recuperados: 0, // Campo para futura implementación
                transito: resStats.data.totalAsignados || 0
            });
        }
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarReportes();
  }, []);

  // Función para exportar los datos de la tabla a Excel (CSV)
  const exportarExcel = () => {
    if (historial.length === 0) return;
    
    const encabezados = "Fecha,Tipo,Detalle,Responsable,Cantidad\n";
    const filas = historial.map(item => 
      `${item.fecha || ''},${item.tipo || ''},${item.detalle || ''},${item.responsable || ''},${item.cant || 1}`
    ).join("\n");
    
    const blob = new Blob([encabezados + filas], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_JH7SRL_${new Date().toLocaleDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* RESUMEN DE MOVIMIENTOS MENSUALES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Recibido Mes" value={stats.recibido} sub="Equipos nuevos" icon={<ArrowUpRight className="text-green-500"/>} />
        <StatCard title="Instalados" value={stats.instalados} sub="En domicilio" icon={<CheckCircle className="text-blue-500"/>} />
        <StatCard title="Recuperados" value={stats.recuperados} sub="Bajas de servicio" icon={<RotateCcw className="text-orange-500"/>} />
        <StatCard title="En Tránsito" value={stats.transito} sub="Con técnicos" icon={<ArrowDownRight className="text-jh7_red"/>} />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="font-black text-xl uppercase tracking-tighter flex items-center gap-2 italic">
              <BarChart3 className="text-jh7_red"/> Historial de Movimientos
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Auditoría completa de entradas y salidas</p>
          </div>
          
          <button 
            onClick={exportarExcel}
            disabled={historial.length === 0}
            className="flex items-center gap-2 bg-jh7_dark text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14}/> Exportar Excel
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {cargando ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-jh7_red" size={30} />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Procesando historial...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-100 dark:border-slate-700">
                <tr>
                  <th className="pb-4">Fecha</th>
                  <th className="pb-4">Tipo</th>
                  <th className="pb-4">Detalle</th>
                  <th className="pb-4">Técnico / Destino</th>
                  <th className="pb-4 text-right">Cantidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {historial.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-400 font-bold text-xs uppercase">No hay movimientos registrados este mes</td>
                  </tr>
                ) : (
                  historial.map((item, i) => (
                    <tr key={i} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-5 font-mono text-[10px]">
                        {item.fecha ? new Date(item.fecha).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-5 uppercase text-[9px]">
                        <span className={`px-3 py-1 rounded-full font-black ${
                          item.tipo === 'INGRESO' ? 'bg-green-100 text-green-700' : 
                          item.tipo === 'ASIGNACION' ? 'bg-blue-100 text-blue-700' : 
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {item.tipo}
                        </span>
                      </td>
                      <td className="py-5 uppercase tracking-tighter">{item.detalle || 'SIN DETALLE'}</td>
                      <td className="py-5 italic font-medium">{item.responsable || 'SISTEMA'}</td>
                      <td className="py-5 text-right font-black text-jh7_dark dark:text-white">{item.cant || 1}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, sub, icon }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-gray-50 dark:border-slate-700 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{title}</p>
      <div className="p-2 bg-gray-50 dark:bg-slate-900 rounded-xl">
        {icon}
      </div>
    </div>
    <p className="text-3xl font-black dark:text-white tracking-tighter">{value}</p>
    <p className="text-[9px] text-gray-400 font-bold italic mt-1">{sub}</p>
  </div>
);