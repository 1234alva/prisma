import { useState } from 'react';
import { LogOut, CheckCircle, AlertTriangle } from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const CierreJornada = ({ user }) => {
  const [confirmado, setConfirmado] = useState(false);

  const finalizarDia = async () => {
    try {
      // Envía un resumen de lo usado hoy al backend NestJS
      await jh7Api.post('/asistencia/cierre', { tecnicoId: user.id });
      setConfirmado(true);
    } catch (error) {
      alert("Error al cerrar jornada. Revisa tu conexión.");
    }
  };

  if (confirmado) return (
    <div className="text-center p-10 bg-white rounded-[3rem] shadow-xl border border-gray-100">
      <CheckCircle size={60} className="mx-auto text-green-500 mb-4" />
      <h2 className="text-2xl font-black text-jh7_dark">¡JORNADA CERRADA!</h2>
      <p className="text-gray-400 font-bold text-xs uppercase mt-2">Los datos de inventario han sido sincronizados.</p>
    </div>
  );

  return (
    <div className="bg-jh7_dark p-10 rounded-[3rem] text-white shadow-2xl max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <LogOut className="text-jh7_red" size={32} />
        <div>
          <h2 className="text-2xl font-black uppercase">Finalizar Turno</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Resumen de liquidación diaria</p>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
        <p className="text-xs font-bold text-gray-300 mb-4">Antes de salir, confirma que:</p>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-[10px] font-black uppercase">
            <div className="w-2 h-2 bg-jh7_red rounded-full" /> Todos los equipos recuperados están en el vehículo.
          </li>
          <li className="flex items-center gap-3 text-[10px] font-black uppercase">
            <div className="w-2 h-2 bg-jh7_red rounded-full" /> No tienes instalaciones pendientes por subir.
          </li>
        </ul>
      </div>

      <button 
        onClick={finalizarDia}
        className="w-full bg-jh7_red py-5 rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-lg"
      >
        CONFIRMAR CIERRE Y SALIR
      </button>
    </div>
  );
};