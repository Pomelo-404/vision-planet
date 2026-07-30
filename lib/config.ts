export const CARD_ROTATE_MS = 5200; // Milisegundos para caombio de imagen
export const CARD_ROTATE_JITTER = 3600; // Extra random para que las tarjetas se desync
export const CAROUSEL_MS = 6500; // Milisegundos para caombio de imagen en carousel
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://vision-planet-pink.vercel.app"; // URL del sitio, sin barra al final
