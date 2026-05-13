import { useState } from 'react';
import { MapPin, Camera, CheckCircle2, Box } from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const RegistrarInstalacion = ({ user }) => {
  const [tipo, setTipo] = useState('SIMPLE');
  const [fotos, setFotos] = useState([]);
  const [form, setForm] = useState({
    solicitud: '',
    snRouter: '',
    estadoRouter: 'NUEVO',
    // Materiales
    cableDrop: 0,
    tensores: 0,
    anillas: 0,
    evillas: 0,
    rosetas: 0,
    conectores: 0,
    patchSc: 0,
    patchUtp: 0,
    // Otros
    macs: ['', '', '', ''],
    latitud: '',
    longitud: ''
  });

  const capturarUbicacion = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm({
        ...form,
        latitud: pos.coords.latitude.toString(),
        longitud: pos.coords.longitude.toString()
      });
    });
  };

  const guardar = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Datos Base
      formData.append('solicitud', form.solicitud);
      formData.append('snRouter', form.snRouter);
      formData.append('estadoRouter', form.estadoRouter);
      formData.append('tipo', tipo);
      formData.append('tecnicoId', user.id);
      formData.append('latitud', form.latitud);
      formData.append('longitud', form.longitud);
      
      // Envío de Materiales (Convertidos a número)
      formData.append('cableDrop', Number(form.cableDrop));
      formData.append('tensores', Number(form.tensores));
      formData.append('anillas', Number(form.anillas));
      formData.append('evillas', Number(form.evillas));
      formData.append('rosetas', Number(form.rosetas));
      formData.append('conectores', Number(form.conectores));
      formData.append('patchSc', Number(form.patchSc));
      formData.append('patchUtp', Number(form.patchUtp));

      // IPTV Macs
      formData.append('macs', JSON.stringify(form.macs.filter(m => m !== '')));

      // Fotos
      fotos.forEach((archivo) => {
        formData.append('fotos', archivo);
      });

      await jh7Api.post('/instalaciones', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("🚀 Instalación y descuento de materiales exitoso");
      // Opcional: limpiar formulario o redireccionar
    } catch (error) {
      console.error("Error al guardar:", error.response?.data);
      alert("Error al guardar: " + (error.response?.data?.message || "Revisa la conexión"));
    }
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-jh7_dark uppercase tracking-tighter">Nueva Instalación</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registro de campo y materiales</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button type="button" onClick={() => setTipo('SIMPLE')}
            className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${tipo === 'SIMPLE' ? 'bg-jh7_red text-white shadow-md' : 'text-gray-400'}`}>
            SOLO INTERNET
          </button>
          <button type="button" onClick={() => setTipo('IPTV')}
            className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${tipo === 'IPTV' ? 'bg-jh7_red text-white shadow-md' : 'text-gray-400'}`}>
            INTERNET + IPTV
          </button>
        </div>
      </div>

      <form onSubmit={guardar} className="space-y-6">
        {/* SECCIÓN 1: DATOS TÉCNICOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="group">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Información de Solicitud</label>
              <input placeholder="N° de Solicitud (Ej: 3424583736)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-jh7_red font-bold transition-all" 
                     onChange={e => setForm({...form, solicitud: e.target.value})} required />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="SN Router" className="p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-jh7_red font-mono uppercase" 
                     onChange={e => setForm({...form, snRouter: e.target.value})} required />
              <select className="p-4 bg-gray-50 rounded-2xl outline-none font-bold text-xs text-gray-500 border-2 border-transparent" onChange={e => setForm({...form, estadoRouter: e.target.value})}>
                <option value="NUEVO">NUEVO</option>
                <option value="REACONDICIONADO">REACONDICIONADO</option>
              </select>
            </div>

            {tipo === 'IPTV' && (
              <div className="p-6 bg-red-50/50 rounded-[2rem] space-y-3 border border-red-100">
                <p className="text-[10px] font-black text-jh7_red uppercase tracking-widest flex items-center gap-2">
                  <Box size={14}/> MACs DECODIFICADORES
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {form.macs.map((mac, i) => (
                    <input key={i} placeholder={`MAC ${i+1}`} className="p-3 bg-white rounded-xl text-xs font-mono outline-none border border-red-100 focus:border-jh7_red" 
                           onChange={e => {
                             let newMacs = [...form.macs];
                             newMacs[i] = e.target.value;
                             setForm({...form, macs: newMacs});
                           }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 2: MATERIALES (CONSUMIBLES) */}
          <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100">
            <p className="text-[10px] font-black text-jh7_dark uppercase mb-4 tracking-widest flex items-center gap-2">
              <Box size={14} className="text-jh7_red"/> Materiales Utilizados
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-400 uppercase ml-2">Metros Drop</label>
                <input type="number" placeholder="0" className="w-full p-3 bg-white rounded-xl outline-none text-sm font-bold border border-gray-100 focus:border-jh7_red" 
                       onChange={e => setForm({...form, cableDrop: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-400 uppercase ml-2">Tensores (u)</label>
                <input type="number" placeholder="0" className="w-full p-3 bg-white rounded-xl outline-none text-sm font-bold border border-gray-100 focus:border-jh7_red" 
                       onChange={e => setForm({...form, tensores: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-400 uppercase ml-2">Anillas/Evillas</label>
                <div className="flex gap-1">
                  <input type="number" placeholder="An" className="w-1/2 p-3 bg-white rounded-xl outline-none text-xs font-bold border border-gray-100 focus:border-jh7_red" 
                         onChange={e => setForm({...form, anillas: e.target.value})} />
                  <input type="number" placeholder="Ev" className="w-1/2 p-3 bg-white rounded-xl outline-none text-xs font-bold border border-gray-100 focus:border-jh7_red" 
                         onChange={e => setForm({...form, evillas: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-400 uppercase ml-2">Conectores</label>
                <input type="number" placeholder="0" className="w-full p-3 bg-white rounded-xl outline-none text-sm font-bold border border-gray-100 focus:border-jh7_red" 
                       onChange={e => setForm({...form, conectores: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-400 uppercase ml-2">Rosetas</label>
                <input type="number" placeholder="0" className="w-full p-3 bg-white rounded-xl outline-none text-sm font-bold border border-gray-100 focus:border-jh7_red" 
                       onChange={e => setForm({...form, rosetas: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-gray-400 uppercase ml-2">Patch SC / UTP</label>
                <div className="flex gap-1">
                  <input type="number" placeholder="SC" className="w-1/2 p-3 bg-white rounded-xl outline-none text-xs font-bold border border-gray-100 focus:border-jh7_red" 
                         onChange={e => setForm({...form, patchSc: e.target.value})} />
                  <input type="number" placeholder="UTP" className="w-1/2 p-3 bg-white rounded-xl outline-none text-xs font-bold border border-gray-100 focus:border-jh7_red" 
                         onChange={e => setForm({...form, patchUtp: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: UBICACIÓN Y FOTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button type="button" onClick={capturarUbicacion} 
                  className={`p-5 rounded-[2rem] font-black text-xs transition-all flex justify-center items-center gap-3 border-2 ${form.latitud ? 'bg-green-500 border-green-600 text-white shadow-lg' : 'bg-white border-jh7_dark text-jh7_dark hover:bg-gray-50'}`}>
            <MapPin size={18} />
            {form.latitud ? 'COORDENADAS CAPTURADAS' : '📍 REGISTRAR UBICACIÓN GPS'}
          </button>

          <div className={`relative p-5 border-2 border-dashed rounded-[2rem] text-center transition-all ${fotos.length >= 4 ? 'border-green-500 bg-green-50/30' : 'border-gray-200 hover:border-jh7_red'}`}>
            <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="fotos" 
                   onChange={e => setFotos(Array.from(e.target.files))} />
            <div className="flex flex-col items-center gap-1">
              <Camera size={18} className={fotos.length >= 4 ? 'text-green-600' : 'text-gray-400'} />
              <p className={`text-[9px] font-black uppercase ${fotos.length >= 4 ? 'text-green-600' : 'text-gray-400'}`}>
                {fotos.length > 0 ? `${fotos.length} FOTOS LISTAS` : 'CARGAR EVIDENCIAS (MÍN. 4)'}
              </p>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-jh7_dark text-white p-6 rounded-[2.5rem] font-black text-sm shadow-2xl hover:bg-jh7_red hover:scale-[1.01] transition-all flex items-center justify-center gap-3 group">
          <CheckCircle2 className="group-hover:animate-bounce" />
          FINALIZAR E INSTALAR SERVICIO
        </button>
      </form>
    </div>
  );
};