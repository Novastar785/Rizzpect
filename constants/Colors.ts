// 1. ¡Este es tu nuevo color primario de Figma!
const tintColor = '#5AB198';

// 2. Aquí definimos tu nueva paleta de colores
// He añadido 'card' y 'border' para estandarizar los componentes
export default {
  light: {
    text: '#1A202C', // Gris oscuro (para texto)
    background: '#FFFFFF', // Blanco
    tint: tintColor, // Tu verde azulado
    icon: '#A0AEC0', // Gris claro (para íconos/placeholders)
    tabIconDefault: '#A0AEC0',
    tabIconSelected: tintColor,
    card: '#F7FAFC', // Un gris muy claro para fondos de tarjetas
    border: '#E2E8F0', // Un borde sutil
  },
  dark: {
    text: '#FFFFFF', // Blanco (para texto)
    background: '#1C1C1E', // Nuestro fondo oscuro
    tint: tintColor, // Tu verde azulado
    icon: '#718096', // Gris (para íconos/placeholders)
    tabIconDefault: '#718096',
    tabIconSelected: tintColor,
    card: '#2C2C2E', // Un gris oscuro para fondos de tarjetas
    border: '#3E3E40', // Un borde sutil para modo oscuro
  },
};