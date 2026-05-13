import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-jh7_gray p-6 text-center">
    <h1 className="text-9xl font-black text-gray-200">404</h1>
    <p className="text-xl font-bold text-jh7_dark mb-6">Parece que te perdiste en la red.</p>
    <Link to="/" className="bg-jh7_red text-white px-8 py-3 rounded-2xl font-bold shadow-lg">
      VOLVER AL INICIO
    </Link>
  </div>
);