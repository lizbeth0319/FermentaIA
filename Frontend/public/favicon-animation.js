// Animación de zoom suave para el favicon
(function() {
  let isAnimating = false;
  let originalFavicon = '/favicon.png';
  
  // Crear canvas para generar favicon con zoom
  function createFaviconWithZoom(scale) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 64;  // Tamaño más grande
    canvas.height = 64;
    
    const img = new Image();
    img.onload = function() {
      // Limpiar canvas
      ctx.clearRect(0, 0, 64, 64);
      
      // Calcular posición centrada para el zoom
      const scaledSize = 64 * scale;
      const offsetX = (64 - scaledSize) / 2;
      const offsetY = (64 - scaledSize) / 2;
      
      // Dibujar imagen con zoom centrado
      ctx.drawImage(img, offsetX, offsetY, scaledSize, scaledSize);
      
      // Actualizar favicon
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/png';
      link.rel = 'shortcut icon';
      link.href = canvas.toDataURL();
      document.getElementsByTagName('head')[0].appendChild(link);
    };
    img.src = originalFavicon;
  }
  
  // Función de animación de zoom suave
  function animateFavicon() {
    if (isAnimating) return;
    isAnimating = true;
    
    let scale = 1.0;
    let direction = 1;
    const maxScale = 1.12;  // Zoom muy sutil
    const minScale = 1.0;
    const step = 0.008;     // Pasos muy pequeños para suavidad
    
    const animate = () => {
      scale += direction * step;
      
      if (scale >= maxScale) {
        direction = -1;
      } else if (scale <= minScale) {
        direction = 1;
        isAnimating = false;
        // Pausa más larga para que sea más sutil
        setTimeout(() => animateFavicon(), 3500);
        return;
      }
      
      createFaviconWithZoom(scale);
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // Iniciar animación cuando la página cargue
  window.addEventListener('load', () => {
    setTimeout(() => animateFavicon(), 1500);
  });
})();