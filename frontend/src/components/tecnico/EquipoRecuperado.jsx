import { useState, useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Save, Trash2, Smartphone } from 'lucide-react';
import jh7Api from '../../api/jh7Api';

export const EquipoRecuperado = ({ user }) => {
  const sigPad = useRef({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    solicitud: '',
    tipoEquipo: 'ROUTER',
    serie: '',
    estado: 'MALO', // Por defecto para revisión
    observaciones: ''
  });

  const limpiarFirma = () => sigPad.current.clear();

  const guardarRecupero = async () => {
    if (sigPad.current.isEmpty()) return alert("Se requiere la firma del cliente");
    
    setLoading(true);
    try {
      const firmaUrl = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
      const payload = { ...form, firma: firmaUrl, tecnicoId: user.id };
      
      // Conexión con tu backend NestJS
      await jh7Api.post('/equipos/recuperar', payload);
      
      alert("Recupero registrado con éxito. El equipo se cargó a tu inventario.");
      // Resetear formulario
      setForm({ solicitud: '', tipoEquipo: 'ROUTER', serie: '', estado: 'MALO', observaciones: '' });
      limpiarFirma();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el recupero");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-jh7_dark rounded-2xl text-white">
          <Smartphone size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-jh7_dark uppercase">Retiro de Equipo</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Soporte Técnico JH7SRL</p>
        </div>
      </div>

      <div className="space-y-4">
        <input 
          placeholder="N° de Solicitud / Ticket" 
          className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-jh7_dark outline-none transition"
          value={form.solicitud}
          onChange={e => setForm({...form, solicitud: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">
          <select 
            className="p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-600"
            onChange={e => setForm({...form, tipoEquipo: e.target.value})}
          >
            <option value="ROUTER">ROUTER ONT</option>
            <option value="IPTV">DECO IPTV</option>
          </select>
          <input 
            placeholder="S/N o MAC" 
            className="p-4 bg-gray-50 rounded-2xl outline-none"
            value={form.serie}
            onChange={e => setForm({...form, serie: e.target.value})}
          />
        </div>

        <textarea 
          placeholder="Motivo del retiro (ej. Falla de puerto, cambio de plan...)" 
          className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[100px]"
          onChange={e => setForm({...form, observaciones: e.target.value})}
        />

        {/* ÁREA DE FIRMA */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-gray-400 uppercase">Firma de conformidad del cliente</span>
            <button onClick={limpiarFirma} className="text-jh7_red flex items-center gap-1 text-[10px] font-bold">
              <Trash2 size={12} /> LIMPIAR
            </button>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 overflow-hidden">
            <SignaturePad 
              ref={sigPad} 
              canvasProps={{ className: 'w-full h-48 cursor-crosshair' }} 
            />
          </div>
        </div>

        <button 
          onClick={guardarRecupero}
          disabled={loading}
          className="w-full bg-jh7_dark text-white p-5 rounded-2xl font-black shadow-lg hover:bg-black transition flex justify-center items-center gap-3"
        >
          <Save size={20} />
          {loading ? 'GUARDANDO...' : 'FINALIZAR Y REGISTRAR'}
        </button>
      </div>
    </div>
  );
};