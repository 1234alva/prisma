export const useGps = () => {
  const getUbicacion = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject("GPS no soportado");
      
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err)
      );
    });
  };

  return { getUbicacion };
};