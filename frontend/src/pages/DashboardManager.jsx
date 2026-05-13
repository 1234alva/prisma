import { AdminDashboard } from './AdminDashboard';
import { AlmacenDashboard } from './AlmacenDashboard';
import { DashboardTecnico } from './DashboardTecnico';

export const DashboardManager = ({ user, seccion }) => {

  const renderContent = () => {
    
    if (!user) return null;

    switch (user.rol) {
      case 'ADMIN':
        
        return <AdminDashboard user={user} seccion={seccion} />; 
      
      case 'ALMACENERO':
        return <AlmacenDashboard user={user} seccion={seccion} />;
      
      case 'TECNICO':
        return <DashboardTecnico user={user} seccion={seccion} />;
      
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] bg-white dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-red-500 font-black text-xl uppercase tracking-widest">Acceso Denegado</p>
            <p className="text-gray-500 mt-2">El rol "{user?.rol}" no tiene permisos para esta zona.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] dark:bg-[#020617] transition-colors duration-300">
      
      {/* QUITAMOS el Sidebar de aquí porque ya lo pusiste en App.jsx. 
          Dejarlo aquí duplicaría el menú en la pantalla.
      */}
      
      <main className="w-full min-h-screen"> 
        
        {/* Header Superior Estilizado */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight uppercase">
              JH7
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Panel de Control <span className="mx-2 text-gray-300">|</span> 
              <span className="text-gray-800 dark:text-gray-200"> {user?.nombre}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-[#0f172a] p-2 pr-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
             <div className="h-10 w-10 rounded-xl bg-jh7_red flex items-center justify-center text-white font-bold shadow-lg shadow-jh7_red/20">
               {user?.rol?.charAt(0)}
             </div>
             <div>
               <p className="text-[10px] uppercase font-black text-gray-400 leading-none tracking-tighter">Nivel de Acceso</p>
               <p className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tighter">
                {user?.rol === 'ADMIN' ? 'Administrador Máster' : user?.rol}
               </p>
             </div>
          </div>
        </header>

        {/* ZONA DE RENDERIZADO DINÁMICO */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderContent()}
        </div>

      </main>
    </div>
  );
};