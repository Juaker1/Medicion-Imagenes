// responsiveFont.js

import { Dimensions, PixelRatio } from 'react-native';

// Obtener las dimensiones de la pantalla
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Definir la escala basada en la dimensión más pequeña
const SCALE = SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT;

// Ancho base de referencia (por ejemplo, iPhone 6/7/8)
const BASE_WIDTH = 375;

// Configuración de factores de escala para diferentes dispositivos y tamaños de pantalla
const fontConfig = {
  phone: {
    small: { min: 0.8, max: 1 },
    medium: { min: 0.9, max: 1.1 },
    large: { min: 1, max: 1.2 },
  },
  tablet: {
    small: { min: 1.3, max: 1.4 },
    medium: { min: 1.4, max: 1.5 },
    large: { min: 1.5, max: 1.7 },
  },
};

// Función para determinar el tipo de dispositivo
export const getDeviceType = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;

  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return 'tablet';
  } else if (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) {
    return 'tablet';
  } else {
    return 'phone';
  }
};

// Función para categorizar el tamaño de la pantalla
const getScreenSizeCategory = () => {
  if (SCALE < 350) return 'small';
  if (SCALE > 500) return 'large';
  return 'medium';
};

// Función para obtener el tamaño de la fuente ajustado
export const getFontSize = (size) => {
  const deviceType = getDeviceType();
  const screenSizeCategory = getScreenSizeCategory();
  const { min, max } = fontConfig[deviceType][screenSizeCategory];
  const scaleFactor = (SCALE / BASE_WIDTH) * (max - min) + min;
  return Math.round(size * scaleFactor);
};
