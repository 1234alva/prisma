import React, { useState, useMemo } from 'react';
import { 
  Search, Calendar, Hash, ChevronRight, FileText, 
  Image as LucideImage, Box, ClipboardList 
} from 'lucide-react';

export const MisInstalaciones = ({ instalacionesReales = [], estaCargando }) => {
  const [seleccionada, setSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // LÓGICA DE FILTRADO + DATOS DE RESPALDO
  const historialFiltrado = useMemo(() => {
    // Si no hay datos en la DB, mostramos estos ejemplos para que la UI no se vea vacía al probar
    const fuenteDeDatos = instalacionesReales.length > 0 ? instalacionesReales : [
      { 
        id: "demo-1", 
        numSolicitud: "123456", 
        cliente: "Juan Perez (EJEMPLO)", 
        fecha: "2026-05-07", 
        tipo: "Solo Internet",
        observacion: "Instalación estándar sin problemas",
        materialesUsados: { "Cable Drop": "120m", "Conectores": 2 }
      },
      { 
        id: "demo-2", 
        numSolicitud: "458752", 
        cliente: "Ana Lopez (EJEMPLO)", 
        fecha: "2026-05-05", 
        tipo: "Duo (TV + Net)",
        materialesUsados: { "Cable Drop": "45m", "Deco IPTV": 1 }
      }
    ];

    // Filtrado seguro: usamos ?. y || "" por si vienen valores null de la DB
    return fuenteDeDatos.filter(item => 
      (item.cliente?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
      (item.numSolicitud?.toString() || "").includes(busqueda)
    );
  }, [busqueda, instalacionesReales]);

  // 1. ESTADO DE CARGA (Opcional, si el Dashboard lo informa)
  if (estaCargando && instalacionesReales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-jh7_red border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando con la base de datos...</p>
      </div>
    );
  }

  // 2. VISTA DE DETALLE (Cuando se selecciona un trabajo)
  if (seleccionada) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSeleccionada(null)}
          className="px-6 py-3 bg-white rounded-2xl text-[10px] font-black text-gray-400 hover:text-jh7_red flex items-center gap-3 uppercase tracking-widest transition-all shadow-sm border border-gray-100"
        >
          ← Volver al Historial
        </button>

        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
          <div className="bg-jh7_dark p-8 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-jh7_red uppercase tracking-[0.2em] mb-1">Detalle de Instalación</p>
              <h2 className="text-3xl font-black uppercase">Ticket #{seleccionada.numSolicitud}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold opacity-60 uppercase">
                {new Date(seleccionada.fecha).toLocaleDateString()}
              </p>
              <p className="text-xs font-black text-green-400 uppercase italic">Estado: Ejecutada</p>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2">Información General</h3>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl text-jh7_dark"><FileText size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Cliente</p>
                  <p className="text-sm font-bold uppercase">{seleccionada.cliente}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-xl text-jh7_dark"><ClipboardList size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Tipo de Servicio</p>
                  <p className="text-sm font-bold uppercase">{seleccionada.tipo}</p>
                </div>
              </div>
              {seleccionada.observacion && (
                <div className="p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100">
                  <p className="text-[9px] font-black text-yellow-600 uppercase mb-1">Observaciones</p>
                  <p className="text-xs text-gray-600 italic">"{seleccionada.observacion}"</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2">Materiales Utilizados</h3>
              <div className="grid grid-cols-2 gap-4">
                {seleccionada.materialesUsados ? (
                  Object.entries(seleccionada.materialesUsados).map(([nombre, cantidad]) => (
                    <div key={nombre} className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">{nombre}</p>
                      <p className="text-lg font-black text-jh7_dark">{cantidad}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic col-span-2">No hay registro de materiales.</p>
                )}
                <div className="p-4 bg-jh7_red/5 rounded-2xl border border-jh7_red/10 col-span-2 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-jh7_red uppercase">Evidencia Fotográfica</p>
                    <p className="text-sm font-black text-jh7_dark">{seleccionada.fotos?.length || 0} Archivos subidos</p>
                  </div>
                  <LucideImage className="text-jh7_red opacity-40" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. VISTA PRINCIPAL (LISTADO)
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-jh7_dark uppercase tracking-tighter">Historial de Instalaciones</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Base de datos técnica - Armin</p>
        </div>
        <div className="text-right">
          <span className="text-[20px] font-black text-jh7_red">{historialFiltrado.length}</span>
          <p className="text-[9px] font-bold text-gray-400 uppercase">Trabajos encontrados</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-jh7_red transition-colors" size={20} />
        <input 
          type="text" 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="BUSCAR POR NOMBRE DE CLIENTE O TICKET..."
          className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[2rem] text-[11px] font-bold uppercase focus:bg-white focus:ring-4 focus:ring-jh7_red/5 focus:border-jh7_red outline-none shadow-sm transition-all"
        />
      </div>

      {/* Lista de Solicitudes */}
      <div className="grid grid-cols-1 gap-4">
        {historialFiltrado.length > 0 ? (
          historialFiltrado.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSeleccionada(item)}
              className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center justify-between hover:shadow-2xl hover:shadow-gray-200/50 hover:border-jh7_red/20 cursor-pointer transition-all duration-300"
            >
              <div className="flex items-center gap-6">
                <div className="p-5 bg-gray-50 text-gray-400 group-hover:bg-jh7_red group-hover:text-white rounded-[1.5rem] transition-all duration-500 group-hover:rotate-[360deg]">
                  <Hash size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-jh7_dark uppercase tracking-tight group-hover:text-jh7_red transition-colors">
                      {item.cliente}
                    </span>
                    <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase italic">
                      #{item.numSolicitud}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 mt-2 text-gray-400">
                    <span className="text-[10px] font-bold flex items-center gap-1.5 uppercase">
                      <Calendar size={13} className="text-jh7_red" /> 
                      {new Date(item.fecha).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] font-bold flex items-center gap-1.5 uppercase">
                      <Box size={13} className="text-blue-500" /> 
                      {item.tipo}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest group-hover:text-jh7_red transition-colors">Ver Detalles</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-full group-hover:bg-jh7_red/10 group-hover:text-jh7_red transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-200">
              <Search size={32} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No se encontraron instalaciones</p>
          </div>
        )}
      </div>
    </div>
  );
};