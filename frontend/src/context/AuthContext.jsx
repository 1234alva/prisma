import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicializamos el estado intentando leer del localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Estado para controlar si el sistema está listo (opcional para animaciones de carga)
  const [isActivo, setIsActivo] = useState(false);

  const login = (userData) => {
    /**
     * IMPORTANTE:
     * Si tu API de NestJS devuelve el usuario dentro de un objeto como { user: {...}, token: '...' }
     * esta lógica extrae solo la parte del perfil para que 'user.rol' funcione siempre.
     */
    const perfilValido = userData.usuario || userData.user || userData;
    
    // Guardamos en el estado de React
    setUser(perfilValido);
    
    // Persistimos en el navegador para que no se pierda al recargar (F5)
    localStorage.setItem('user', JSON.stringify(perfilValido));
    
    console.log("Sesión iniciada para:", perfilValido.nombre, "con rol:", perfilValido.rol);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Opcional: Limpiar todo el almacenamiento para evitar rastros de roles previos
    localStorage.clear();
    console.log("Sesión cerrada y almacenamiento limpio.");
  };

  // Efecto para verificar si hay un usuario activo al cargar la app
  useEffect(() => {
    if (user) {
      setIsActivo(true);
    } else {
      setIsActivo(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isActivo, 
      setIsActivo, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};