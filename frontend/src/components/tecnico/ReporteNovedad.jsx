import { useState } from 'react';
import { MessageSquareWarning, Camera, Send } from 'lucide-react';

export const ReporteNovedad = () => {
  const [reporte, setReporte] = useState({ tipo: 'CLIENTE_AUSENTE', descripcion: '' });

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquareWarning className="text-orange-500" size={24} />
        <h3 className="font-black text-jh7_dark uppercase text-sm">Reportar Incidencia</h3>
      </div>

      <div className="space-y-4">
        <select 
          className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-600 text-xs"
          onChange={e => setReporte({...reporte, tipo: e.target.value})}
        >
          <option value="CLIENTE_AUSENTE">CLIENTE NO SE ENCUENTRA</option>
          <option value="SIN_ACCESO">SIN ACCESO AL POSTE/NODO</option>
          <option value="EQUIPO_FALTANTE">MATERIAL INSUFICIENTE</option>
          <option value="OTRO">OTRO MOTIVO</option>
        </select>

        <textarea 
          placeholder="Describe brevemente lo ocurrido..."
          className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-xs min-h-[100px]"
          onChange={e => setReporte({...reporte, descripcion: e.target.value})}
        />

        <div className="flex gap-4">
          <button className="flex-1 bg-gray-100 text-gray-400 p-4 rounded-2xl flex justify-center gap-2 font-black text-[10px] uppercase">
            <Camera size={14} /> Foto Evidencia
          </button>
          <button className="flex-1 bg-jh7_dark text-white p-4 rounded-2xl flex justify-center gap-2 font-black text-[10px] uppercase hover:bg-black transition">
            <Send size={14} /> Enviar
          </button>
        </div>
      </div>
    </div>
  );
};