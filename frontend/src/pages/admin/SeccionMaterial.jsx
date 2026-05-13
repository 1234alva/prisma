import { useState, useEffect } from 'react';
import { Box, User, PackageCheck, AlertTriangle, Search, ArrowRight, Loader2 } from 'lucide-react';
import jh7Api from '../../api/jh7Api'; // Asegúrate de que la ruta sea correcta

export const SeccionMaterial = () => {
  const [busquedaTecnico, setBusquedaTecnico] = useState("");
  const [tecnicosReales, setTecnicosReales] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. CARGAR DATOS REALES DE LA DB
  useEffect(() => {
    const obtenerStock = async () => {
      try {
        const { data } = await jh7Api.get('/usuarios');
        // Filtramos: Solo rol TECNICO y que NO sea Henry Eulate (el admin)
        const soloTecnicos = data.filter(u => 
          u.rol === 'TECNICO' && u.nombre !== 'Henry Eulate'
        );
        setTecnicosReales(soloTecnicos);
      } catch (error) {
        console.error("Error cargando stock real:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerStock();
  }, []);

  // 2. FUNCIÓN PARA BUSCAR MATERIALES EN EL STOCK DE CADA TÉCNICO
  const obtenerCantidad = (usuario, nombreMaterial) => {
    const item = usuario.stockPersonal?.find(s => 
      s.material?.nombre.toLowerCase().includes(nombreMaterial.toLowerCase())
    );
    return item ? (item.asignado - item.utilizado) : 0;
  };

  // 3. FILTRO DE BÚSQUEDA
  const tecnicosFiltrados = tecnicosReales.filter(t => 
    t.nombre.toLowerCase().includes(busquedaTecnico.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* VISTA DE ALMACÉN GENERAL (Se mantiene igual o puedes conectarlo luego) */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-gray-100">
         {/* ... (Tu código de Stock General Empresa) ... */}
      </div>

      {/* MATERIAL POR TÉCNICO (DATOS REALES) */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h3 className="text-xl font-black uppercase text-jh7_dark dark:text-white flex items-center gap-2">
            <User className="text-jh7_red" size={22}/> Material Asignado a Técnicos
          </h3>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar técnico real..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-2xl outline-none text-xs font-bold"
              value={busquedaTecnico}
              onChange={(e) => setBusquedaTecnico(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="pb-4 px-4">Nombre del Técnico</th>
                <th className="pb-4 text-center">Cable Drop</th>
                <th className="pb-4 text-center">Conectores</th>
                <th className="pb-4 text-center">Rosetas</th>
                <th className="pb-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
              {cargando ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-jh7_red"/></td>
                </tr>
              ) : (
                tecnicosFiltrados.map((tecnico) => {
                  const cable = obtenerCantidad(tecnico, 'cable');
                  return (
                    <tr key={tecnico.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-jh7_dark text-white rounded-full flex items-center justify-center font-black text-[10px]">
                            {tecnico.nombre.charAt(0)}
                          </div>
                          <span className="font-bold text-sm dark:text-gray-200">{tecnico.nombre}</span>
                        </div>
                      </td>
                      <td className="py-5 text-center font-mono text-sm">{cable}m</td>
                      <td className="py-5 text-center font-mono text-sm">{obtenerCantidad(tecnico, 'conector')} und</td>
                      <td className="py-5 text-center font-mono text-sm">{obtenerCantidad(tecnico, 'roseta')} und</td>
                      <td className="py-5 text-right">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${
                          cable < 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {cable < 50 ? 'REABASTECER' : 'OPERATIVO'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};