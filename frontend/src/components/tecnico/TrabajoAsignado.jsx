import React, { useState } from 'react';
import { MapPin, Phone, Clock, ChevronRight, User, Hash, Navigation } from 'lucide-react';

export const TrabajoAsignado = ({ user }) => {
  // Datos de ejemplo (Esto vendrá de tu API después)
  const [tickets] = useState([
    {
      id: 1,
      numTicket: "45882",
      cliente: "Carlos Rodriguez",
      direccion: "Av. 6 de Agosto #452, Oruro",
      tipo: "Instalación Fibra",
      prioridad: "Alta",
      hora: "09:00 AM"
    },
    {
      id: 2,
      numTicket: "45889",
      cliente: "Maria Quispe",
      direccion: "Calle Pagador entre Ayacucho",
      tipo: "Mantenimiento / Falla",
      prioridad: "Media",
      hora: "11:30 AM"
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header de la sección */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-black text-jh7_dark uppercase tracking-tighter">Agenda del Día</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Órdenes de trabajo asignadas para hoy</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">
          {tickets.length} Pendientes
        </div>
      </div>

      {/* Lista de Tarjetas */}
      <div className="grid grid-cols-1 gap-4">
        {tickets.map((t) => (
          <div key={t.id} className="group bg-white border border-gray-100 rounded-[2.5rem] p-2 flex flex-col md:flex-row items-center hover:shadow-xl hover:border-blue-200 transition-all duration-300">
            
            {/* Hora y Prioridad */}
            <div className="bg-slate-50 rounded-[2rem] p-6 flex flex-col items-center justify-center min-w-[120px] m-2">
              <Clock size={20} className="text-blue-500 mb-1" />
              <span className="text-lg font-black text-jh7_dark">{t.hora}</span>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full mt-1 uppercase ${
                t.prioridad === 'Alta' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {t.prioridad}
              </span>
            </div>

            {/* Datos del Cliente */}
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Hash size={12} className="text-jh7_red" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ticket #{t.numTicket}</span>
              </div>
              <h3 className="text-xl font-black text-jh7_dark uppercase mb-1">{t.cliente}</h3>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={14} className="text-blue-400" />
                <p className="text-xs font-bold uppercase">{t.direccion}</p>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex gap-2 p-4">
              <button 
                title="Ver en Google Maps"
                className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
              >
                <Navigation size={20} />
              </button>
              <button 
                title="Llamar Cliente"
                className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-green-500 hover:text-white transition-all shadow-sm"
              >
                <Phone size={20} />
              </button>
              <button 
                className="flex items-center gap-2 px-6 bg-jh7_dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-jh7_red transition-all shadow-lg ml-2"
              >
                Iniciar <ChevronRight size={16} />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Mensaje si no hay tickets */}
      {tickets.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-black uppercase text-xs">No tienes trabajos asignados para este momento</p>
        </div>
      )}
    </div>
  );
};