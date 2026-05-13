const AlmacenHeader = ({ onLogout }) => {
  const [registroIniciado, setRegistroIniciado] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 h-20 flex items-center justify-between px-8 border-b dark:border-slate-700 shadow-sm fixed top-0 right-0 left-0 md:left-64 z-30">
      {/* BUSCADOR DE EMERGENCIA / CLIENTE */}
      <div className="relative w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar solicitud (Ej: 4501)..."
          className="w-full bg-gray-100 dark:bg-slate-700 border-none rounded-xl py-2 pl-10 text-xs focus:ring-2 focus:ring-jh7_red"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* CONTROL DE TIEMPO */}
        <div className="flex gap-2">
          {!registroIniciado ? (
            <button 
              onClick={() => setRegistroIniciado(true)}
              className="bg-green-500 hover:bg-green-600 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase transition-all"
            >
              Marcar Ingreso
            </button>
          ) : (
            <button 
              onClick={() => setRegistroIniciado(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase transition-all"
            >
              Cerrar Ingreso
            </button>
          )}
        </div>

        <button 
          onClick={onLogout}
          className="text-gray-400 hover:text-jh7_red transition-colors flex items-center gap-2 font-bold text-xs uppercase"
        >
          <X size={18} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};