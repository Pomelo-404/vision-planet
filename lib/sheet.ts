import { products as fallback, type Product, type Shape } from "./products";

const SHAPES: Shape[] = [
  "Redondo",
  "Cuadrado",
  "Rectangular",
  "Wayfarer",
  "Aviador",
  "Ojo de gato",
];

// Parser CSV mínimo — maneja comillas, comillas escapadas y saltos de línea dentro de comillas.
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") field += ch;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function toProducts(rows: string[][]): Product[] {
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const c = (name: string) => header.indexOf(name);
  const col = {
    id: c("id"),
    model: c("model"),
    name: c("name"),
    brand: c("brand"),
    color: c("color"),
    hex: c("hex"),
    shape: c("shape"),
    size: c("size"),
    mm: c("mm"),
    material: c("material"),
    style: c("style"),
    type: c("type"),
    price: c("price"),
    stock: c("stock"),
    imgs: c("imgs"),
    desc: c("desc"),
  };
  const get = (r: string[], i: number) =>
    i >= 0 && i < r.length ? r[i].trim() : "";

  return rows
    .slice(1)
    .filter((r) => get(r, col.id))
    .map((r) => {
      const shape = get(r, col.shape) as Shape;
      const id = get(r, col.id);
      return {
        id,
        model: get(r, col.model) || id, // model en blanco = tarjeta propia de un solo color
        name: get(r, col.name),
        brand: get(r, col.brand),
        color: get(r, col.color),
        hex: get(r, col.hex) || "#1c1c1c",
        shape: SHAPES.includes(shape) ? shape : "Cuadrado",
        size: get(r, col.size),
        mm: get(r, col.mm),
        material: get(r, col.material),
        style: get(r, col.style),
        type: get(r, col.type) === "Sol" ? "Sol" : "Oftálmico",
        price: Number(get(r, col.price)) || 0,
        stock: Number(get(r, col.stock)) || 0,
        imgs: get(r, col.imgs)
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean),
        desc: get(r, col.desc),
      } satisfies Product;
    });
}

export async function getProducts(): Promise<Product[]> {
  const url = process.env.SHEET_CSV_URL;
  if (!url) return fallback;
  try {
    const res = await fetch(url, {
      next: { revalidate: 604800, tags: ["products"] }, // 604800 = 1 semana; "products" lo usa /api/refresh
    });
    if (!res.ok) throw new Error(`La hoja respondió ${res.status}`);
    const csv = (await res.text()).replace(/^\uFEFF/, ""); // quita BOM
    const items = toProducts(parseCSV(csv));
    return items.length ? items : fallback;
  } catch (e) {
    console.error("getProducts: usando datos locales de respaldo —", e);
    return fallback;
  }
}
