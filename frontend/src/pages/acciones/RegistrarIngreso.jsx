import { useState } from 'react';
import { Save, Package, HardDrive, Cpu, CheckCircle2, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const RegistrarIngreso = ({ onFinish }) => {
  const [paso, setPaso] = useState(1);
  const [tipo, setTipo] = useState("equipo");
  const [cargando, setCargando] = useState(false);

  const [formData, setFormData] = useState({
    modelo: "", 
    identificador: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Forzamos mayúsculas solo si no es la cantidad numérica de materiales
    const processedValue = (name === 'modelo' || (name === 'identificador' && tipo === 'equipo')) 
      ? value.toUpperCase() 
      : value;

    setFormData({ ...formData, [name]: processedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const esEquipo = tipo === 'equipo';

      // PAYLOAD AJUSTADO PARA INVENTARIO SERVICE
      const payload = {
        tipo: esEquipo ? 'ROUTER' : 'MATERIAL', 
        modelo: formData.modelo.trim(),
        nombre: formData.modelo.trim(), // Requerido por el service para materiales
        sn: esEquipo ? formData.identificador.trim() : null, // Solo para equipos
        cantidad: esEquipo ? 1 : Number(formData.identificador), // Cantidad numérica para materiales
        identificador: formData.identificador, 
        unidad: esEquipo ? 'PIEZA' : 'UNIDADES'
      };

      // Usamos la ruta genérica de ingreso del almacenero
      await jh7Api.post('/inventario/ingreso', payload);
      
      alert(`✅ ${esEquipo ? 'Equipo' : 'Material'} registrado: ${formData.modelo}`);
      
      // Limpiar y resetear
      setFormData({ modelo: "", identificador: "" });
      setPaso(1);
      
      if (onFinish) onFinish(); 
    } catch (error) {
      console.error("Error al registrar ingreso:", error);
      const mensajeError = error.response?.data?.message || "Error al conectar con el servidor.";
      alert(`❌ ERROR: ${mensajeError}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8 pl-4">
        <h2 className="text-3xl font-black text-jh7_dark dark:text-white border-l-8 border-jh7_red pl-6 uppercase italic tracking-tighter">
          Entrada de Bodega
          <span className="text-gray-400 font-light text-xl not-italic ml-4">| RECEPCIÓN</span>
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
        
        <div className="bg-jh7_dark p-10 text-white flex justify-between items-center border-b-4 border-jh7_red">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-jh7_red text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-red-900/40">
                Stock Manager
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Paso {paso} de 2</span>
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter italic">Ingreso de Mercadería</h3>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-[2rem]">
            <Package className="text-jh7_red" size={40} />
          </div>
        </div>

        <div className="p-12">
          {paso === 1 ? (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="text-center">
                 <p className="font-black uppercase text-gray-400 text-[11px] tracking-[0.3em]">Seleccione Clasificación de Carga</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TipoCard 
                  active={tipo === 'equipo'} 
                  onClick={() => setTipo('equipo')}
                  icon={<HardDrive size={35}/>}
                  title="Equipos Activos"
                  desc="Requieren S/N individual (ONUs, Routers)"
                />
                <TipoCard 
                  active={tipo === 'material'} 
                  onClick={() => setTipo('material')}
                  icon={<Cpu size={35}/>}
                  title="Consumibles"
                  desc="Carga por volumen (Herrajes, Cables)"
                />
              </div>

              <button 
                onClick={() => setPaso(2)}
                className="w-full bg-jh7_red text-white py-6 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-red-500/20 flex items-center justify-center gap-3"
              >
                CONFIGURAR DETALLES <ArrowLeft size={18} className="rotate-180" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-right duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[11px] font-black uppercase text-gray-400 ml-4 italic tracking-widest">
                    {tipo === 'equipo' ? 'Modelo del Equipo' : 'Nombre del Material'}
                  </label>
                  <input 
                    required 
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    type="text" 
                    className="w-full p-6 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-jh7_red outline-none font-black text-xs transition-all uppercase shadow-inner" 
                    placeholder={tipo === 'equipo' ? "EJ: HUAWEI HG8245W5" : "EJ: TENSORES PLÁSTICOS"} 
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[11px] font-black uppercase text-gray-400 ml-4 italic tracking-widest">
                    {tipo === 'equipo' ? 'Número de Serie (SN)' : 'Cantidad (Número)'}
                  </label>
                  <input 
                    required 
                    name="identificador"
                    value={formData.identificador}
                    onChange={handleChange}
                    type={tipo === 'equipo' ? 'text' : 'number'} 
                    className="w-full p-6 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-jh7_red outline-none font-black text-xs transition-all uppercase shadow-inner" 
                    placeholder={tipo === 'equipo' ? "SN-XXXX-XXXX" : "0"} 
                  />
                </div>
              </div>
              
              <div className="bg-jh7_dark text-white p-8 rounded-[2.5rem] border-l-8 border-jh7_red flex gap-6 items-center shadow-xl">
                <div className="bg-red-500/20 p-3 rounded-full text-jh7_red">
                  <ShieldCheck size={24}/>
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase italic tracking-widest text-jh7_red">Confirmación de Registro</p>
                  <p className="text-[12px] text-gray-300 mt-1 font-bold">
                    Registrando <span className="text-white border-b border-jh7_red pb-0.5">{formData.modelo || 'item'}</span> en el inventario central.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setPaso(1)} 
                  className="flex-1 py-6 font-black uppercase text-[11px] text-gray-400 hover:text-jh7_red transition-all"
                >
                  Regresar
                </button>
                <button 
                  type="submit" 
                  disabled={cargando}
                  className="flex-[3] bg-jh7_dark text-white py-6 rounded-[2rem] font-black uppercase text-[12px] flex items-center justify-center gap-4 shadow-2xl hover:bg-black border-b-4 border-jh7_red transition-all disabled:opacity-50 tracking-widest"
                >
                  {cargando ? <Loader2 className="animate-spin" size={20}/> : <><Save size={20}/> CONFIRMAR INGRESO</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const TipoCard = ({ active, onClick, icon, title, desc }) => (
  <button 
    type="button"
    onClick={onClick} 
    className={`p-10 rounded-[3rem] border-4 transition-all text-left group relative overflow-hidden ${
      active 
      ? 'border-jh7_red bg-red-50 dark:bg-red-900/10 shadow-lg' 
      : 'border-transparent bg-gray-50 dark:bg-slate-900/50 hover:bg-white'
    }`}
  >
    <div className={`${active ? 'text-jh7_red scale-110' : 'text-gray-300 group-hover:text-jh7_red'} mb-6 transition-all duration-300`}>
      {icon}
    </div>
    <h4 className={`font-black uppercase text-xs tracking-tight ${active ? 'text-jh7_dark dark:text-white' : 'text-gray-400'}`}>
      {title}
    </h4>
    <p className="text-[10px] text-gray-400 mt-2 font-bold leading-relaxed uppercase tracking-widest italic">
      {desc}
    </p>
    {active && (
      <div className="absolute top-6 right-6 text-jh7_red">
        <CheckCircle2 size={24} />
      </div>
    )}
  </button>
);