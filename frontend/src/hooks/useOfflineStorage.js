import Dexie from 'dexie';

// Definimos la base de datos local
export const db = new Dexie('JH7_OfflineDB');
db.version(1).stores({
  pendientes: '++id, numSolicitud, tipo, synced' // Tabla para instalaciones sin subir
});

export const useOfflineStorage = () => {
  // Guardar instalación localmente
  const guardarLocal = async (datos) => {
    return await db.pendientes.add({ ...datos, synced: false, fechaLocal: new Date() });
  };

  // Sincronizar cuando vuelva el internet
  const sincronizar = async (api) => {
    const pendientes = await db.pendientes.where({ synced: false }).toArray();
    
    for (const item of pendientes) {
      try {
        await api.post('/operaciones/instalacion', item);
        await db.pendientes.update(item.id, { synced: true });
        console.log(`Sincronizado: ${item.numSolicitud}`);
      } catch (err) {
        console.error("Error sincronizando, se intentará luego", err);
      }
    }
  };

  return { guardarLocal, sincronizar };
};