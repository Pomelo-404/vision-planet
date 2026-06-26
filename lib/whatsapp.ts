import { SHOP, type Product } from "./products";
import { mxn } from "./format";

export function waMessage(p: Product) {
  const tail =
    p.stock > 0
      ? "¿Cómo continúo con mi pedido?"
      : "¿Tienen disponibilidad o algo similar?";

  const emoji = "👓";

  const message = `¡Hola! ${emoji} Me interesa este modelo:

*${p.name}* (${p.brand})
ID: ${p.id}
Color: ${p.color}
Forma: ${p.shape}
Tamaño: ${p.size} (${p.mm})
Material: ${p.material}
Tipo: ${p.type}
Precio: ${mxn(p.price)}

${tail}`;
  console.log(emoji);
  return message;
}

export const waLink = (p: Product) =>
  `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(waMessage(p))}`;
