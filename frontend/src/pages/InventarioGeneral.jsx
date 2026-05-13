import { useState, useEffect } from 'react';
import { 
  Package, Search, Filter, AlertTriangle, 
  Download, Loader2, Edit3, Trash2, Plus
} from 'lucide-react';
import jh7Api from '../api/jh7Api';

export const InventarioGeneral = ({ user }) => {
  const [stock, setStock] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [categoria, setCategoria] = useState("TODOS");

  // Verificar si el usuario es Admin
  const isAdmin = user?.rol === 'ADMIN';

  useEffect(() => {
    const obtenerInventario = async () => {
      try {
        const { data } = await jh7Api.get('/almacen/stock-general');
        setStock(data);
      } catch (error) {
        console.error("Error al cargar inventario:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerInventario();
  }, []);

  const filtrados = stock.filter(item => {
    const coincideTexto = item.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
                          (item.sn && item.sn.toLowerCase().includes(filtro.toLowerCase()));
    const coincideCat = categoria === "TODOS" || item.categoria === categoria;
    return coincideTexto && coincideCat;
  });

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-jh7_dark dark:text-white border-l-8 border-jh7_red pl-6 uppercase italic tracking-tighter">
            Inventario Central
            <span className="text-gray-400 font-light text-2xl not-italic ml-4">
              | {isAdmin ? 'MODO ADMINISTRADOR' : 'CONTROL DE STOCK'}
            </span>
          </h2>
        </div>
        
        <div className="flex gap-3">
          {/* Botón que solo ve el Admin para agregar nuevos productos al catálogo */}
          {isAdmin && (
            <button className="bg-jh7_dark text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 hover:bg-black">
              <Plus size={16} className="text-jh7_red" /> Nuevo Item
            </button>
          )}
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center gap-2">
            <Download size={16} /> Excel
          </button>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="BUSCAR EQUIPO, MATERIAL O NÚMERO DE SERIE..."
            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-800 rounded-[1.5rem] text-[11px] font-black outline-none border-2 border-transparent focus:border-jh7_red shadow-sm transition-all uppercase"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] flex items-center px-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <Filter className="text-gray-400 mr-3" size={18} />
          <select 
            className="w-full bg-transparent py-5 text-[10px] font-black uppercase outline-none cursor-pointer dark:text-white"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="TODOS">Categorías</option>
            <option value="ONU">ONUs</option>
            <option value="ROUTER">Routers</option>
            <option value="CABLE">Cables</option>
            <option value="HERRAMIENTA">Herramientas</option>
          </select>
        </div>
      </div>

      {/* TABLA CON ACCIONES CONDICIONALES */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-jh7_dark text-white">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest italic">Descripción de Activo</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest italic text-center">Stock</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest italic text-center">Estado</th>
              {/* Solo mostramos la columna de acciones si es Admin */}
              {isAdmin && <th className="p-6 text-[10px] font-black uppercase tracking-widest italic text-right">Gestión</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {cargando ? (
               <tr><td colSpan={isAdmin ? 4 : 3} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-jh7_red" size={40}/></td></tr>
            ) : filtrados.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <Package size={20} className="text-jh7_red" />
                    </div>
                    <div>
                      <p className="font-black text-xs uppercase dark:text-white">{item.nombre}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{item.categoria} {item.sn ? `• S/N: ${item.sn}` : ''}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className="text-sm font-black italic dark:text-gray-200">{item.cantidad} <small className="text-[9px] text-gray-400">{item.unidad}</small></span>
                </td>
                <td className="p-6 text-center">
                  {item.cantidad <= (item.minimo || 5) ? (
                    <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic border border-red-100">
                      <AlertTriangle size={12} /> Stock Crítico
                    </div>
                  ) : (
                    <span className="text-[9px] font-black text-green-600 bg-green-50 dark:bg-green-500/10 px-4 py-1.5 rounded-full uppercase">Stock Saludable</span>
                  )}
                </td>
                
                {/* ACCIONES EXCLUSIVAS DEL ADMIN */}
                {isAdmin && (
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-jh7_dark dark:text-white hover:bg-jh7_red hover:text-white transition-all">
                        <Edit3 size={14} />
                      </button>
                      <button className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-red-500 hover:bg-red-600 hover:text-white transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};