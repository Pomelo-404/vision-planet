import { SHOP, type Product } from "./products";
import { SITE_URL } from "./config";
import { mxn } from "./format";

export function waMessage(p: Product) {
  const tail =
    p.stock > 0
      ? "¿Cómo continúo con mi pedido?"
      : "¿Tienen disponibilidad o algo similar?";

  const emoji = "👓";
  const url = `${SITE_URL}/frame/${p.id}`;
  const saleUrl = `${SITE_URL}/confirmar?modelo=${encodeURIComponent(p.id)}`;
  const message = `¡Hola! ${emoji} Me interesa este modelo:

ID: ${p.id}
URL: ${url}

Registro: ${saleUrl}
Precio: ${mxn(p.price)}

${tail}`;
  return message;
}

export const waLink = (p: Product) =>
  `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(waMessage(p))}`;
