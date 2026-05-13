import { Plus, Trash2 } from 'lucide-react';

export const MaterialSelector = ({ materialesDisponibles, seleccionados, setSeleccionados }) => {
  
  const addMaterial = () => {
    setSeleccionados([...seleccionados, { id: '', cantidad: 0 }]);
  };

  const updateMaterial = (index, field, value) => {
    const newItems = [...seleccionados];
    newItems[index][field] = value;
    setSeleccionados(newItems);
  };

  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded-2xl">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-gray-600 uppercase">Materiales Utilizados</label>
        <button type="button" onClick={addMaterial} className="bg-jh7_red text-white p-1 rounded-full">
          <Plus size={16}/>
        </button>
      </div>
      
      {seleccionados.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <select 
            className="flex-1 p-2 rounded-lg border text-sm"
            onChange={(e) => updateMaterial(index, 'id', e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {materialesDisponibles.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
          <input 
            type="number" 
            placeholder="Cant." 
            className="w-20 p-2 rounded-lg border text-sm"
            onChange={(e) => updateMaterial(index, 'cantidad', e.target.value)}
          />
          <button onClick={() => setSeleccionados(seleccionados.filter((_, i) => i !== index))} className="text-red-500">
            <Trash2 size={18}/>
          </button>
        </div>
      ))}
    </div>
  );
};