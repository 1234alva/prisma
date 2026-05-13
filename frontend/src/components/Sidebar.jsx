import { 
  Home, Package, ClipboardList, LogOut, Sun, Moon, 
  Users, FileBarChart, Briefcase, Box, Wrench, RotateCcw,
  Monitor, Truck, History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Sidebar = ({ user }) => {
  const { logout } = useAuth(); 
  const location = useLocation(); 
  const [dark, setDark] = useState(false);

  
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <aside className="h-screen w-64 bg-jh7_dark dark:bg-[#0f172a] text-white p-6 flex flex-col fixed left-0 top-0 border-r border-gray-800 transition-colors duration-300 z-50 shadow-2xl">
      
      {/* Header del Sidebar: Logo + Modo Oscuro */}
      <div className="flex items-center justify-between mb-10">
        <div className="text-left">
          <h1 className="text-2xl font-black text-jh7_red tracking-tighter italic">
            JH7
          </h1>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black opacity-80">Telecomunicaciones</p>
        </div>
        
        <button 
          onClick={() => setDark(!dark)}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-gray-400 group"
          title={dark ? 'Modo Claro' : 'Modo Oscuro'}
        >
          {dark ? (
            <Sun size={16} className="text-yellow-400 animate-pulse" />
          ) : (
            <Moon size={16} className="group-hover:rotate-12 transition-transform" />
          )}
        </button>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
        
        <p className="px-4 pb-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">General</p>
        
        <SidebarLink 
          to="/" 
          icon={<Home size={18}/>} 
          label="Dashboard" 
          active={location.pathname === '/'} 
        />

        {/* SECCIÓN: TÉCNICO */}
        {user?.rol === 'TECNICO' && (
          <div className="pt-4 space-y-1.5">
            <p className="px-4 pb-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Operaciones</p>
            <SidebarLink 
              to="/trabajo-asignado" 
              icon={<Briefcase size={18}/>} 
              label="Trabajo Asignado" 
              active={location.pathname === '/trabajo-asignado'} 
            />
            <SidebarLink 
              to="/nueva-instalacion" 
              icon={<ClipboardList size={18}/>} 
              label="Mis Instalaciones" 
              active={location.pathname === '/nueva-instalacion'} 
            />
            <SidebarLink 
              to="/gestion-equipos" 
              icon={<Box size={18}/>} 
              label="Mi Stock" 
              active={location.pathname === '/gestion-equipos'} 
            />
            <SidebarLink 
              to="/mis-reportes" 
              icon={<FileBarChart size={18}/>} 
              label="Mis Reportes" 
              active={location.pathname === '/mis-reportes'} 
            />
          </div>
        )}

        {/* SECCIÓN: ALMACENERO (Marcelo) */}
        {user?.rol === 'ALMACENERO' && (
          <div className="pt-4 space-y-1.5">
            <p className="px-4 pb-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Logística</p>
            
            <SidebarLink 
              to="/inventario-general" 
              icon={<Monitor size={18}/>} 
              label="Equipos (S/N)" 
              active={location.pathname === '/inventario-general'} 
            />
            <SidebarLink 
              to="/despacho-materiales" 
              icon={<Truck size={18}/>} 
              label="Despachos" 
              active={location.pathname === '/despacho-materiales'} 
            />
            <SidebarLink 
              to="/recuperados" 
              icon={<RotateCcw size={18}/>} 
              label="Recuperados" 
              active={location.pathname === '/recuperados'} 
            />
            <SidebarLink 
              to="/historial-bodega" 
              icon={<History size={18}/>} 
              label="Auditoría Bodega" 
              active={location.pathname === '/historial-bodega'} 
            />
            <SidebarLink 
              to="/control-herramientas" 
              icon={<Wrench size={18}/>} 
              label="Herramientas" 
              active={location.pathname === '/control-herramientas'} 
            />
            <SidebarLink 
              to="/stock-general" 
              icon={<Package size={18}/>} 
              label="Consumibles" 
              active={location.pathname === '/stock-general'} 
            />
          </div>
        )}

        {/* SECCIÓN: ADMIN (Control Total) */}
        {user?.rol === 'ADMIN' && (
          <div className="pt-4 space-y-1.5">
            <p className="px-4 pb-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Gestión Máster</p>
            
            <SidebarLink 
              to="/gestion-usuarios" 
              icon={<Users size={18}/>} 
              label="Personal" 
              active={location.pathname === '/gestion-usuarios'} 
            />

            {/* NUEVO: Botón de Despachos añadido para el ADMIN */}
            <SidebarLink 
              to="/despacho-materiales" 
              icon={<Truck size={18}/>} 
              label="Despachos" 
              active={location.pathname === '/despacho-materiales'} 
            />

            <SidebarLink 
              to="/asignar-trabajo" 
              icon={<Briefcase size={18}/>} 
              label="Asignar Trabajo" 
              active={location.pathname === '/asignar-trabajo'} 
            />

            <SidebarLink 
              to="/stock-general" 
              icon={<Package size={18}/>} 
              label="Stock General" 
              active={location.pathname === '/stock-general'} 
            />

            <SidebarLink 
              to="/control-equipos" 
              icon={<Monitor size={18}/>} 
              label="Equipos (S/N)" 
              active={location.pathname === '/control-equipos'} 
            />

            <SidebarLink 
              to="/historial-bodega" 
              icon={<History size={18}/>} 
              label="Log Auditoría" 
              active={location.pathname === '/historial-bodega'} 
            />

            <SidebarLink 
              to="/control-herramientas" 
              icon={<Wrench size={18}/>} 
              label="Herramientas" 
              active={location.pathname === '/control-herramientas'} 
            />

            <SidebarLink 
              to="/recuperados" 
              icon={<RotateCcw size={18}/>} 
              label="Recuperados" 
              active={location.pathname === '/recuperados'} 
            />

            <SidebarLink 
              to="/reportes-globales" 
              icon={<FileBarChart size={18}/>} 
              label="Reportes Globales" 
              active={location.pathname === '/reportes-globales'} 
            />
          </div>
        )}
      </nav>

      {/* Perfil y Salida */}
      <div className="mt-auto pt-6 border-t border-gray-800/50">
        <div className="bg-white/5 p-4 rounded-[2rem] mb-4 border border-white/5">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Usuario Activo</p>
            <p className="text-[10px] font-bold text-jh7_red truncate uppercase">{user?.nombre || 'S/N'}</p>
            <p className="text-[8px] font-bold text-gray-400/50 uppercase tracking-tighter">Rol: {user?.rol}</p>
        </div>
        <button 
          onClick={logout}
          className="w-full p-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] bg-red-500/5 hover:bg-jh7_red text-red-500 hover:text-white transition-all uppercase tracking-widest group"
        >
          <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

/* COMPONENTE LINK INTERNO */
const SidebarLink = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-wider ${
      active 
        ? 'bg-jh7_red text-white shadow-lg shadow-jh7_red/20 translate-x-2' 
        : 'hover:bg-white/5 text-gray-400 hover:text-white'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-gray-500'}`}>{icon}</span>
    <span>{label}</span>
  </Link>
);