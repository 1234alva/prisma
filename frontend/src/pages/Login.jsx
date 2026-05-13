import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import jh7Api from '../api/jh7Api';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Realizamos la petición al backend de NestJS
      const { data } = await jh7Api.post('/usuarios/login', { username, password });
      
      /**
       * 2. DESESTRUCTURACIÓN CLAVE:
       * Tu backend envía { access_token, user: { id, nombre, rol } }.
       * Guardamos el token para futuras peticiones y el user para el estado.
       */
      localStorage.setItem('token', data.access_token);
      
      // Enviamos solo el objeto del usuario que contiene el 'rol'
      login(data.user); 
      
    } catch (error) {
      console.error("Error detallado:", error.response?.data || error.message);
      alert("Error en credenciales: Verifica tu usuario y contraseña");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-jh7_dark p-6">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-jh7_red">JH7<span className="text-jh7_dark">SRL</span></h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Acceso Personal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 ml-4 uppercase">Usuario</label>
            <input 
              type="text" 
              placeholder="Ej: armin_admin" 
              className="w-full p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 ring-jh7_red transition"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 ml-4 uppercase">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 ring-jh7_red transition"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-jh7_red text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            INGRESAR AL SISTEMA
          </button>
        </form>
      </div>
    </div>
  );
};