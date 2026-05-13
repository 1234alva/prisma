import { useState } from 'react';

export const InstalacionForm = () => {
  const [tipo, setTipo] = useState('SIMPLE');

  return (
    <div className="p-4 md:p-8 bg-jh7_gray min-h-screen ml-0 md:ml-64">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 border-t-8 border-jh7_red">
        <h2 className="text-2xl font-bold mb-6 text-jh7_dark">Nueva Instalación</h2>
        
        <form className="space-y-6">
          {/* Fila 1: Solicitud y Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">N° Solicitud</label>
              <input type="text" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-jh7_red outline-none" placeholder="123456" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Tipo de Servicio</label>
              <select 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-jh7_red outline-none"
              >
                <option value="SIMPLE">Solo Internet</option>
                <option value="IPTV">Internet + IPTV</option>
              </select>
            </div>
          </div>

          {/* Dinámico: Si es IPTV mostrar hasta 4 MACs */}
          {tipo === 'IPTV' && (
            <div className="bg-red-50 p-4 rounded-xl space-y-3">
              <p className="text-xs font-bold text-jh7_red uppercase">Registros de IPTV (Máx 4)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="MAC Equipo 1" className="p-2 border rounded-lg text-sm" />
                <input placeholder="MAC Equipo 2" className="p-2 border rounded-lg text-sm" />
              </div>
            </div>
          )}

          {/* Sección de Fotos */}
          <div>
            <label className="block text-sm font-semibold mb-2">Fotos de Evidencia (Máx 4)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-jh7_red hover:text-jh7_red cursor-pointer transition">
                  <span className="text-2xl">+</span>
                  <span className="text-[10px]">Foto {i}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full bg-jh7_dark text-white font-bold py-4 rounded-xl hover:bg-jh7_red transition-colors shadow-lg">
            GUARDAR E INSTALAR
          </button>
        </form>
      </div>
    </div>
  );
};