import { useRef } from 'react';
import SignaturePad from 'react-signature-canvas';

export const FirmaCliente = ({ onSave }) => {
  const padRef = useRef(null);

  const clear = () => padRef.current.clear();
  const save = () => {
    if (!padRef.current.isEmpty()) {
      onSave(padRef.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-2xl border-2 border-dashed border-gray-300">
      <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Firma del Cliente</p>
      <SignaturePad 
        ref={padRef}
        canvasProps={{ className: 'w-full h-40 bg-white rounded-lg cursor-crosshair' }}
      />
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={clear} className="text-xs bg-gray-300 px-3 py-1 rounded-lg">Limpiar</button>
        <button type="button" onClick={save} className="text-xs bg-jh7_dark text-white px-3 py-1 rounded-lg">Fijar Firma</button>
      </div>
    </div>
  );
};