import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Calendar, User, Hash, ClipboardList, 
  ArrowUpRight, ArrowDownLeft, X, Image as ImageIcon, FileText 
} from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const HistorialTrazabilidad = () => {
  const [busqueda, setBusqueda] = useState('');
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  useEffect(() => {
    const cargarHistorialUnificado = async () => {
      try {
        const tecnicoId = localStorage.getItem('tecnicoId');
        
        // 1. Llamada paralela a Instalaciones y Recuperos
        const [resInst, resRecup] = await Promise.all([
          jh7Api.get(`/instalaciones/reporte-dia/${tecnicoId}`),
          jh7Api.get(`/equipos/recuperados?tecnicoId=${tecnicoId}`) // Ajustado a tu API
        ]);

        // 2. Normalizar datos para que quepan en la misma tabla
        const instalaciones = resInst.data.map(i => ({
          ...i,
          idGlobal: `INST-${i.id}`,
          tipoMovimiento: 'INSTALACION',
          displayTipo: i.tipo,
          displaySerie: i.router_sn,
          displayTicket: i.numSolicitud,
          displayFecha: i.fecha
        }));

        const recuperos = resRecup.data.map(r => ({
          ...r,
          idGlobal: `REC-${r.id}`,
          tipoMovimiento: 'RECUPERO',
          displayTipo: r.tipoEquipo,
          displaySerie: r.serie,
          displayTicket: r.solicitud,
          displayFecha: r.fecha
        }));

        // 3. Unir y ordenar por fecha descendente
        const unificado = [...instalaciones, ...recuperos].sort((a, b) => 
          new Date(b.displayFecha) - new Date(a.displayFecha)
        );

        setRegistros(unificado);
      } catch (error) {
        console.error("Error al sincronizar historial:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarHistorialUnificado();
  }, []);

  // Filtro inteligente
  const datosFiltrados = registros.filter(item => {
    const term = busqueda.toLowerCase();
    return (
      item.displayTicket?.toLowerCase().includes(term) ||
      item.displaySerie?.toLowerCase().includes(term) ||
      item.displayTipo?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/* HEADER Y BUSCADOR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-jh7_dark tracking-tighter uppercase">Mi Actividad</h2>
          <p className="text-gray-400 text-xs font-bold">HISTORIAL COMPLETO DE MOVIMIENTOS</p>
        </div>

        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </div>
          <input 
            type="text"
            placeholder="Buscar por S/N, Ticket o Tipo..."
            className="w-full p-4 pl-14 bg-white rounded-2xl shadow-sm border border-gray-100 outline-none focus:ring-2 ring-jh7_red transition-all font-medium text-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {cargando ? (
          <div className="p-20 text-center text-gray-300 font-black animate-pulse tracking-widest uppercase">
            Sincronizando registros...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Tipo</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Equipo / Servicio</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Ticket / Fecha</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {datosFiltrados.map((item) => (
                  <tr key={item.idGlobal} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          item.tipoMovimiento === 'INSTALACION' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                        }`}>
                          {item.tipoMovimiento === 'INSTALACION' ? <ArrowUpRight size={18}/> : <ArrowDownLeft size={18}/>}
                        </div>
                        <span className="text-[10px] font-black uppercase">{item.tipoMovimiento}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-jh7_dark uppercase">{item.displayTipo}</span>
                        <span className="text-[10px] font-mono text-jh7_red font-bold">{item.displaySerie || 'S/N PENDIENTE'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-700 uppercase">#{item.displayTicket}</span>
                        <span className="text-[10px] text-gray-400 font-bold italic">{new Date(item.displayFecha).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => setItemSeleccionado(item)}
                        className="p-3 bg-gray-100 text-gray-400 rounded-2xl group-hover:bg-jh7_dark group-hover:text-white transition-all shadow-sm"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE DETALLES (EL EXPEDIENTE) */}
      {itemSeleccionado && (
        <div className="fixed inset-0 bg-jh7_dark/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 relative animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setItemSeleccionado(null)}
              className="absolute top-8 right-8 p-2 bg-gray-100 hover:bg-jh7_red hover:text-white rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                itemSeleccionado.tipoMovimiento === 'INSTALACION' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
              }`}>
                Expediente Digital: {itemSeleccionado.tipoMovimiento}
              </span>
              <h2 className="text-3xl font-black text-jh7_dark mt-2 uppercase tracking-tighter">Detalles del Movimiento</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                  <Hash className="text-jh7_red" size={18}/>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase">Referencia de Solicitud</p>
                    <p className="text-sm font-bold">#{itemSeleccionado.displayTicket}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                  <Calendar className="text-jh7_red" size={18}/>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase">Fecha y Hora</p>
                    <p className="text-sm font-bold">{new Date(itemSeleccionado.displayFecha).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                  <ClipboardList className="text-jh7_red" size={18}/>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase">Estado del Registro</p>
                    <p className="text-sm font-black text-green-600 uppercase">{itemSeleccionado.estado || 'COMPLETADO'}</p>
                  </div>
                </div>
                {itemSeleccionado.tipoMovimiento === 'INSTALACION' && (
                  <button 
                    onClick={() => window.open(`http://localhost:3001/instalaciones/${itemSeleccionado.id}/pdf`)}
                    className="w-full flex items-center justify-center gap-2 p-4 bg-jh7_dark text-white rounded-2xl font-black text-[10px] uppercase hover:bg-jh7_red transition-colors"
                  >
                    <FileText size={14} /> Descargar Acta PDF
                  </button>
                )}
              </div>
            </div>

            {/* EVIDENCIA VISUAL */}
            <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase text-center mb-4">Evidencia Capturada</p>
              
              {itemSeleccionado.tipoMovimiento === 'RECUPERO' ? (
                <div className="text-center">
                  <img src={itemSeleccionado.firma} alt="Firma Cliente" className="h-24 mx-auto object-contain mix-blend-multiply" />
                  <p className="text-[9px] text-gray-400 mt-2 italic font-bold">Firma de Conformidad del Cliente</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {itemSeleccionado.fotos?.length > 0 ? itemSeleccionado.fotos.map((foto, idx) => (
                    <img key={idx} src={foto} alt="Evidencia" className="rounded-xl h-32 w-full object-cover shadow-sm" />
                  )) : (
                    <div className="col-span-2 py-10 text-center text-gray-400 text-xs font-bold italic flex flex-col items-center gap-2">
                      <ImageIcon size={30} /> No se subieron fotos en esta instalación
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};