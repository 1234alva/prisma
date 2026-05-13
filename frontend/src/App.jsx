import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { DashboardManager } from './pages/DashboardManager';
import { Login } from './pages/Login';
import { useAuth } from './context/AuthContext';
import { MisInstalaciones } from './components/tecnico/MisInstalaciones'; 
import { TrabajoAsignado } from './components/tecnico/TrabajoAsignado';
import { MiStockTecnico } from './components/tecnico/MiStockTecnico';
import { ReportesTecnicos } from './components/tecnico/ReportesTecnicos';
import { AsignarATecnico } from './pages/acciones/AsignarATecnico';
import { ReportesGenerales } from './pages/acciones/ReportesGenerales';
import { GestionHerramientas } from './pages/acciones/GestionHerramientas';
import { RecuperadosAlmacen } from './pages/acciones/RecuperadosAlmacen'; 
import { HistorialAlmacen } from './pages/acciones/HistorialAlmacen'; 


function App() {
  const { user, logout } = useAuth(); 

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <Route
              path="/*"
              element={
                <div className="flex">
                  <Sidebar user={user} logout={logout} />
                  
                  <main className="flex-1 lg:pl-64 min-h-screen">
                    <div className="w-full p-4 md:p-8 animate-in fade-in duration-500"> 
                      <Routes>
                        <Route path="/" element={<DashboardManager user={user} seccion="inicio" />} />
                        
                        {/* --- RUTAS TÉCNICO --- */}
                        {user.rol === 'TECNICO' && (
                          <>
                            <Route path="/trabajo-asignado" element={<TrabajoAsignado user={user} />} />
                            <Route path="/nueva-instalacion" element={<MisInstalaciones user={user} />} />
                            <Route path="/gestion-equipos" element={<MiStockTecnico user={user} />} />
                            <Route path="/mis-reportes" element={<ReportesTecnicos user={user} />} />
                          </>
                        )}
                        
                        {/* --- RUTAS ALMACENERO --- */}
                        {user.rol === 'ALMACENERO' && (
                          <>
                            <Route path="/inventario-general" element={<ReportesGenerales user={user} />} />
                            <Route path="/despacho-materiales" element={<AsignarATecnico user={user} />} />
                            <Route path="/recuperados" element={<RecuperadosAlmacen user={user} />} />
                            <Route path="/control-herramientas" element={<GestionHerramientas user={user} />} />
                            <Route path="/historial-bodega" element={<HistorialAlmacen user={user} />} />
                            <Route path="/stock-general" element={<DashboardManager user={user} seccion="material" />} />
                          </>
                        )}

                        {/* --- RUTAS ADMIN (CORREGIDAS) --- */}
                        {user.rol === 'ADMIN' && (
                          <>
                            <Route path="/gestion-usuarios" element={<DashboardManager user={user} seccion="personal" />} />
                            <Route path="/asignar-trabajo" element={<DashboardManager user={user} seccion="trabajo" />} />
                            <Route path="/stock-general" element={<DashboardManager user={user} seccion="material" />} />
                            <Route path="/control-equipos" element={<DashboardManager user={user} seccion="equipos" />} />
                            <Route path="/control-herramientas" element={<DashboardManager user={user} seccion="herramientas" />} />
                            <Route path="/recuperados" element={<DashboardManager user={user} seccion="recuperados" />} />
                            <Route path="/reportes-globales" element={<DashboardManager user={user} seccion="reportes" />} />
                            <Route path="/historial-bodega" element={<HistorialAlmacen user={user} />} />
                            
                            {/* ESTA ES LA LÍNEA QUE FALTABA PARA EL ADMIN */}
                            <Route path="/despacho-materiales" element={<AsignarATecnico user={user} />} />
                          </>
                        )}

                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              }
            />
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;