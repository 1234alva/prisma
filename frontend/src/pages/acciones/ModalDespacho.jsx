import { useState, useEffect } from 'react';
import { X, User, Send, CheckCircle2 } from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const ModalDespacho = ({ equipo, onClose, onFinish }) => {
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoId, setTecnicoId] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarTecnicos = async () => {
      try {
        const { data } = await jh7Api.get('/usuarios');
        // Filtramos solo los que pueden recibir equipos
        setTecnicos(data.filter(u => u.rol.toUpperCase().includes('TECNICO')));
      } catch (error) {
        console.error("Error al cargar técnicos:", error);
      }
    };
    cargarTecnicos();
  }, []);

  const confirmarDespacho = async () => {
    if (!tecnicoId) return;
    setEnviando(true);
    try {
      // Endpoint para asignar el equipo al técnico
      await jh7Api.patch(`/equipos/despachar/${equipo.id}`, { tecnicoId });
      onFinish(); // Recarga el stock en el dashboard
      onClose();
    } catch (error) {
      alert("Error al despachar: " + error.response?.data?.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-jh7_dark/90 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Decoración Superior */}
        <div className="absolute top-0 left-0 w-full h-2 bg-jh7_red"></div>

        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-jh7_red transition-colors">
          <X size={24} />
        </button>

        <div className="mb-8">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic dark:text-white">
            Despachar Equipo
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Transfiriendo responsabilidad de activo
          </p>
        </div>

        {/* Info del Equipo Seleccionado */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl mb-8 border border-gray-100 dark:border-slate-700">
          <p className="text-[9px] font-black text-jh7_red uppercase mb-1">Equipo Seleccionado</p>
          <p className="text-sm font-bold dark:text-white">{equipo.modelo}</p>
          <p className="text-xs font-mono text-gray-500 italic">{equipo.serie}</p>
        </div>

        {/* Selección de Técnico */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Seleccionar Técnico Receptor</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-jh7_red/20 transition-all dark:text-white appearance-none"
              value={tecnicoId}
              onChange={(e) => setTecnicoId(e.target.value)}
            >
              <option value="">-- Elige un técnico --</option>
              {tecnicos.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={confirmarDespacho}
          disabled={!tecnicoId || enviando}
          className={`w-full mt-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
            tecnicoId && !enviando 
              ? 'bg-jh7_red text-white shadow-xl shadow-red-500/20 hover:scale-[1.02]' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {enviando ? "PROCESANDO..." : <><Send size={16}/> CONFIRMAR SALIDA</>}
        </button>
      </div>
    </div>
  );
};