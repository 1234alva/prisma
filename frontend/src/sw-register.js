export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('SW registrado con éxito', reg);
      }).catch(err => {
        console.log('Fallo al registrar SW', err);
      });
    });
  }
}