import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Cpu, CheckCircle, ArrowUpRight, History, ShieldCheck, Loader2 } from 'lucide-react';
import jh7Api from '../../api/jh7Api'; 

export const SeccionEquipos = () => {
  const [filtroEquipo, setFiltroEquipo] = useState("Todos");
  const [personalConEquipos, setPersonalConEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. CARGAR TÉCNICOS REALES DESDE LA BASE DE DATOS
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { data } = await jh7Api.get('/usuarios');
        
        // Filtramos: Solo Técnicos y que NO sea Henry Eulate
        const soloTecnicos = data.filter(u => 
          u.rol === 'TECNICO' && u.nombre !== 'Henry Eulate'
        );
        
        setPersonalConEquipos(soloTecnicos);
      } catch (error) {
        console.error("Error al cargar equipos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. DASHBOARD DE ACTIVOS (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EquipoStatCard title="Routers ONU" total="142" sub="Stock JH7 SRL" icon={<Cpu className="text-jh7_red"/>} />
        <EquipoStatCard title="Decos IPTV" total="89" sub="En Almacén" icon={<Monitor className="text-blue-500"/>} />
        <EquipoStatCard title="Equipos en Campo" total={personalConEquipos.length} sub="En manos de técnicos" icon={<Smartphone className="text-orange-500"/>} />
      </div>

      {/* 2. TABLA DE RASTREO DINÁMICA */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-xl font-black uppercase text-jh7_dark dark:text-white flex items-center gap-2">
              <History className="text-jh7_red" size={22}/> Seguimiento de Hardware
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-8">Equipos vinculados a personal registrado</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="pb-4 px-4">Equipo / Tipo</th>
                <th className="pb-4">S/N (Número de Serie)</th>
                <th className="pb-4 text-center">Responsable Real</th>
                <th className="pb-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
              {cargando ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-jh7_red" size={30} />
                    <p className="text-[10px] font-black text-gray-400 mt-2 uppercase">Sincronizando inventario...</p>
                  </td>
                </tr>
              ) : (
                personalConEquipos.map((tecnico) => (
                  <tr key={tecnico.id} className="group hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-5 px-4">
                      <p className="font-bold text-sm dark:text-gray-200">Router ONU / ONU</p>
                      <p className="text-[9px] text-jh7_red font-black uppercase tracking-tighter">MODEL-HUAWEI</p>
                    </td>
                    <td className="py-5 font-mono text-xs text-gray-500 font-bold uppercase">
                      SN-{tecnico.id.substring(0, 8)}
                    </td>
                    <td className="py-5 text-center">
                      <span className="text-xs font-black text-jh7_dark dark:text-gray-200 uppercase">{tecnico.nombre}</span>
                    </td>
                    <td className="py-5 text-right">
                      <span className="text-[9px] font-black px-3 py-1 rounded-full uppercase bg-blue-100 text-blue-600">
                        Asignado
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {!cargando && personalConEquipos.length === 0 && (
            <p className="text-center py-10 text-gray-400 font-bold uppercase text-xs">No hay técnicos de campo para asignar equipos</p>
          )}
        </div>
      </div>

      {/* 3. BANNER DE AUDITORÍA */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24}/>
          </div>
          <div>
            <h4 className="font-black text-sm uppercase dark:text-white text-jh7_dark">Inventario JH7 SRL</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Control total del hardware asignado a tu personal registrado</p>
          </div>
        </div>
      </div>

    </div>
  );
};

const EquipoStatCard = ({ title, total, sub, icon }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:border-jh7_red transition-all">
    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl group-hover:bg-jh7_red/10 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-black text-jh7_dark dark:text-white tracking-tighter">{total}</p>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
      <p className="text-[10px] text-jh7_red font-bold mt-1 uppercase italic">{sub}</p>
    </div>
  </div>
);