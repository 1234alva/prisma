import { useState } from 'react';
import { Save, Smartphone, AlertCircle, Laptop, Monitor } from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const GestionRecuperos = ({ user }) => {
  const [form, setForm] = useState({
    numSolicitud: '',
    clienteNombre: '',
    sn_mac: '',      
    mac_iptv: '',   
    tipo: 'ROUTER',
    estadoEquipo: 'MALO', 
    accesorios: 'Cargadores y Cables',
    observaciones: '',
    firmaDigital: 'Firma_Digital_Default'
  });

  const [cargando, setCargando] = useState(false);

  const handleGuardar = async (e) => {
    e.preventDefault();
    
    // VALIDACIÓN CRÍTICA: Si no hay ID de usuario, el backend dará Error 500
    if (!user?.id) {
      alert("Error: No se detectó la sesión del técnico. Por favor, vuelve a iniciar sesión.");
      return;
    }

    setCargando(true);
    
    try {
      const payload = {
        ...form,
        numSolicitud: form.numSolicitud.trim().toUpperCase(),
        clienteNombre: form.clienteNombre.trim().toUpperCase(),
        sn_mac: form.sn_mac.trim().toUpperCase(),
        // Enviamos null si no es IPTV para evitar ruido en la DB
        mac_iptv: form.tipo === 'IPTV' ? form.mac_iptv.trim().toUpperCase() : null,
        tecnicoId: user.id 
      };

      await jh7Api.post('/instalaciones/recuperar', payload);

      alert("¡Éxito! Equipo ingresado al sistema y asignado a tu stock personal.");
    
      // Reset del formulario a valores iniciales
      setForm({
        numSolicitud: '',
        clienteNombre: '',
        sn_mac: '',
        mac_iptv: '',
        tipo: 'ROUTER',
        estadoEquipo: 'MALO',
        accesorios: 'Cargadores y Cables',
        observaciones: '',
        firmaDigital: 'Firma_Digital_Default'
      });
    } catch (error) {
      console.error("Error en el registro:", error.response?.data);
      // Mostramos el detalle del error que viene del backend (nuestro throw InternalServerErrorException)
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Error de conexión.";
      alert(`Error al guardar: ${errorMsg}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-50">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-jh7_dark p-3 rounded-2xl shadow-lg shadow-jh7_red/20">
              <Smartphone className="text-jh7_red" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-jh7_dark uppercase tracking-tight">Retiro de Equipos</h2>
              <p className="text-[10px] font-bold text-jh7_red uppercase tracking-widest">Gestión de Inventario JH7</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-gray-400 uppercase">Técnico Responsable</p>
            <p className="text-sm font-bold text-jh7_dark">{user?.nombre || 'Usuario Desconocido'}</p>
          </div>
        </div>

        <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Columna 1: Datos de la Orden */}
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">Servicio a Recuperar</label>
              <select 
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-jh7_red font-bold text-jh7_dark transition-all"
                value={form.tipo}
                onChange={e => setForm({...form, tipo: e.target.value})}
              >
                <option value="ROUTER">SÓLO INTERNET (ROUTER)</option>
                <option value="IPTV">INTERNET + TV (DECO IPTV)</option>
              </select>
            </div>

            <input 
              placeholder="N° DE SOLICITUD / TICKET" 
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-jh7_red font-bold uppercase transition-all"
              value={form.numSolicitud}
              onChange={e => setForm({...form, numSolicitud: e.target.value})}
              required
            />

            <input 
              placeholder="NOMBRE COMPLETO DEL CLIENTE" 
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold uppercase text-jh7_dark"
              value={form.clienteNombre}
              onChange={e => setForm({...form, clienteNombre: e.target.value})}
              required
            />
          </div>

          {/* Columna 2: Hardware */}
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">S/N Router Principal</label>
              <div className="relative">
                <input 
                  placeholder="SN: JH7XXXXXXXX" 
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-jh7_red font-mono uppercase font-bold text-jh7_dark"
                  value={form.sn_mac}
                  onChange={e => setForm({...form, sn_mac: e.target.value})}
                  required
                />
                <Laptop className="absolute right-4 top-4 text-gray-300" size={20} />
              </div>
            </div>

            {form.tipo === 'IPTV' && (
              <div className="animate-in slide-in-from-top duration-300">
                <label className="text-[10px] font-black text-jh7_red ml-2 uppercase">MAC Decodificador IPTV</label>
                <div className="relative">
                  <input 
                    placeholder="MAC: 00:00:00:00" 
                    className="w-full p-4 bg-red-50/50 rounded-2xl outline-none border-2 border-jh7_red/20 focus:border-jh7_red font-mono uppercase font-bold text-jh7_dark"
                    value={form.mac_iptv}
                    onChange={e => setForm({...form, mac_iptv: e.target.value})}
                    required={form.tipo === 'IPTV'}
                  />
                  <Monitor className="absolute right-4 top-4 text-jh7_red/40" size={20} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({...form, estadoEquipo: 'BUENO'})}
                className={`py-4 rounded-2xl font-black text-[11px] transition-all border-2 ${form.estadoEquipo === 'BUENO' ? 'bg-green-500 border-green-600 text-white shadow-lg' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}
              >
                ESTADO: BUENO
              </button>
              <button
                type="button"
                onClick={() => setForm({...form, estadoEquipo: 'MALO'})}
                className={`py-4 rounded-2xl font-black text-[11px] transition-all border-2 ${form.estadoEquipo === 'MALO' ? 'bg-jh7_red border-red-700 text-white shadow-lg' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}
              >
                ESTADO: MALO
              </button>
            </div>
          </div>

          {/* Detalles adicionales */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
               <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">Accesorios</label>
               <input 
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm font-bold uppercase"
                value={form.accesorios}
                onChange={e => setForm({...form, accesorios: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">Observaciones Técnicas</label>
              <textarea 
                placeholder="DETALLES DEL RETIRO..." 
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none h-14 text-sm font-bold uppercase resize-none transition-all focus:bg-white focus:ring-1 focus:ring-jh7_red"
                value={form.observaciones}
                onChange={e => setForm({...form, observaciones: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={cargando}
            type="submit" 
            className="md:col-span-2 bg-jh7_dark text-white p-6 rounded-[2.5rem] font-black hover:bg-black active:scale-[0.98] transition-all flex justify-center items-center gap-4 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={24} className={cargando ? 'animate-spin' : 'text-jh7_red'} />
            {cargando ? 'PROCESANDO INVENTARIO...' : 'FINALIZAR REGISTRO Y ASIGNAR A MI STOCK'}
          </button>
        </form>
      </div>

      <div className="mt-6 bg-jh7_dark p-6 rounded-[2.5rem] flex items-center gap-4 border border-jh7_red/20">
        <AlertCircle className="text-jh7_red shrink-0" size={24} />
        <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
          <span className="text-jh7_red font-black uppercase">Aviso Técnico:</span> Al registrar un equipo marcado como <span className="text-white font-bold">BUENO</span>, este se habilitará automáticamente en tu inventario para ser utilizado en nuevas instalaciones.
        </p>
      </div>
    </div>
  );
};