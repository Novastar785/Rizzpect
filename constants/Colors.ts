// 1. --- Nueva Paleta de Colores ---
// Tema oscuro minimalista con acentos vibrantes

const tintColor = '#C039FF'; // Púrpura vibrante (Acento principal)
const secondaryColor = '#007AFF'; // Azul brillante (Acento secundario)
const accentRed = '#FF3B30'; // Rojo pasión
const accentGreen = '#34C759'; // Verde éxito

export default {
  light: {
    text: '#1A202C',
    background: '#FFFFFF',
    tint: tintColor,
    secondary: secondaryColor,
    accentRed: accentRed,
    accentGreen: accentGreen,
    icon: '#A0AEC0',
    tabIconDefault: '#A0AEC0',
    tabIconSelected: tintColor,
    card: '#F7FAFC',
    border: '#E2E8F0',
  },
  dark: {
    // --- NUEVO TEMA OSCURO UNIFICADO ---
    text: '#FFFFFF', // Blanco
    // CAMBIO CLAVE: Negro puro para unificar con el diseño neón
    background: '#000000', 
    tint: tintColor, // Púrpura
    secondary: secondaryColor, // Azul
    accentRed: accentRed, // Rojo
    accentGreen: accentGreen, // Verde
    icon: '#B3B3B3', // Gris claro para íconos inactivos
    tabIconDefault: '#B3B3B3', // Ícono de pestaña inactivo
    tabIconSelected: tintColor, // Ícono de pestaña activo (Púrpura)
    // Mantenemos las tarjetas un poco más claras para cuando se usen (ej. Profile)
    // pero en la pantalla Rizz las forzamos a transparente.
    card: '#121212', 
    border: '#2A2A2A', // Borde muy sutil
  },
};