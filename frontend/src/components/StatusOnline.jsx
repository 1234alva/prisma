import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export const StatusOnline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
  }, []);

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-full flex items-center gap-2 text-white font-bold text-xs shadow-lg transition-all ${
      isOnline ? 'bg-green-500' : 'bg-orange-500 animate-pulse'
    }`}>
      {isOnline ? <Wifi size={14}/> : <WifiOff size={14}/>}
      {isOnline ? 'CONECTADO' : 'MODO OFFLINE (Local)'}
    </div>
  );
};