import { useState, useEffect } from 'react';
import jh7Api from '../../api/jh7Api'; // Usamos tu instancia configurada con interceptores
import { 
  Users, PlusCircle, Search, UserPlus, Shield, 
  Mail, Key, X, Trash2, Edit, Loader2 
} from 'lucide-react';

export const SeccionPersonal = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    rol: 'TECNICO',
    password: '',
    username: '' // Añadido para coincidir con tu Login de NestJS
  });

  // --- 1. FUNCIÓN DE SINCRONIZACIÓN CON NESTJS ---
  const obtenerPersonalDB = async () => {
    try {
      // Usamos jh7Api que ya tiene el token en el Header
      const { data } = await jh7Api.get('/usuarios'); 
      setUsuarios(data);
      setCargando(false);
    } catch (error) {
      console.error("Error sincronizando personal JH7:", error);
      setCargando(false);
    }
  };

  // --- 2. EFECTO RADAR DE TIEMPO REAL ---
  useEffect(() => {
    obtenerPersonalDB(); // Carga inicial

    // Sincronización constante cada 5 segundos
    const intervalo = setInterval(() => {
      obtenerPersonalDB();
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // --- 3. CREAR USUARIO REAL EN DB ---
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    try {
      await jh7Api.post('/usuarios', nuevoUsuario);
      obtenerPersonalDB(); // Refrescar lista
      setMostrarModal(false);
      setNuevoUsuario({ nombre: '', email: '', rol: 'TECNICO', password: '', username: '' });
    } catch (error) {
      alert("Error al registrar en el servidor JH7");
    }
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
    u.rol?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
            <Users className="text-[#FF0000]" size={32} />
            JH7 CORE Monitor
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
              {usuarios.filter(u => u.activo && u.rol === 'TECNICO').length} Técnicos Operativos Ahora
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 bg-[#FF0000] text-white px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:shadow-lg hover:shadow-red-500/20 transition-all active:scale-95"
        >
          <PlusCircle size={18} />
          Alta de Personal
        </button>
      </div>

      {/* FILTROS */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o cargo..."
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none font-bold text-xs focus:ring-2 focus:ring-red-500/20 transition-all dark:text-white shadow-sm"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* TABLA SINCRONIZADA */}
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Estado</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Nombre del Personal</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Cargo / OT</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
            {cargando ? (
              <tr>
                <td colSpan="4" className="p-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-gray-300" size={32} />
                </td>
              </tr>
            ) : usuariosFiltrados.map((u) => (
              <tr key={u.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="p-6">
                  <div className="flex flex-col items-center gap-1">
                    {u.activo ? (
                      <>
                        <div className="h-4 w-4 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
                        <span className="text-[8px] font-black text-green-600 uppercase italic">En Servicio</span>
                      </>
                    ) : (
                      <>
                        <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        <span className="text-[8px] font-black text-gray-400 uppercase">Fuera</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="p-6">
                  <p className="font-black text-xs text-slate-800 dark:text-white uppercase tracking-tight">{u.nombre}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase italic">{u.email}</p>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                      u.rol === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 
                      u.rol === 'ALMACEN' ? 'bg-blue-100 text-blue-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {u.rol === 'TECNICO' ? 'Técnico Campo' : u.rol}
                    </span>
                    {/* Mostramos el conteo de instalaciones si existe en tu DB */}
                    {u._count?.instalaciones !== undefined && (
                      <span className="text-[10px] font-bold text-gray-400 underline decoration-[#FF0000]">
                        {u._count.instalaciones} OT
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-6 text-right space-x-2">
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-red-500"><Edit size={16}/></button>
                    <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL REGISTRO */}
      {mostrarModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl scale-95 animate-in zoom-in-95">
            <div className="bg-[#FF0000] p-8 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1 italic">JH7 Sistema</p>
                <h4 className="text-2xl font-black uppercase tracking-tighter">Registrar Personal</h4>
              </div>
              <button onClick={() => setMostrarModal(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleCrearUsuario} className="p-10 space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block">Nombre Completo</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-xs focus:ring-2 focus:ring-red-500/20 dark:text-white transition-all"
                    placeholder="NOMBRE APELLIDO"
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value.toUpperCase()})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block">Rol / Cargo</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <select 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-[10px] uppercase focus:ring-2 focus:ring-red-500/20 dark:text-white appearance-none"
                      onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
                    >
                      <option value="TECNICO">Técnico Nivel 1</option>
                      <option value="ALMACEN">Almacenero</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block">Usuario / Login</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-xs focus:ring-2 focus:ring-red-500/20 dark:text-white"
                      placeholder="usuario_login"
                      onChange={(e) => setNuevoUsuario({...nuevoUsuario, username: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block">Contraseña</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    required
                    type="password"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-xs focus:ring-2 focus:ring-red-500/20 dark:text-white"
                    placeholder="••••••••"
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-slate-900 dark:bg-[#FF0000] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:shadow-xl transition-all mt-4"
              >
                Registrar en Servidor JH7
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};