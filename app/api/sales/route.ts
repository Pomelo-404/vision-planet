import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/sheet";
import { isAuthorized, normalisePhone, saleCookieName } from "@/lib/sales";

type SaleRequest = {
  model?: string;
  customerName?: string;
  phone?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!isAuthorized(cookieStore.get(saleCookieName)?.value)) {
    return NextResponse.json({ error: "Acceso no autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as SaleRequest;
  const model = body.model?.trim().toUpperCase();
  const customerName = body.customerName?.trim();
  const phone = normalisePhone(body.phone?.trim() ?? "");

  if (!model || !customerName || phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json(
      { error: "Ingresa un modelo, nombre y número de cliente válidos." },
      { status: 400 },
    );
  }

  const products = await getProducts();
  const product = products.find((p) => p.id.toUpperCase() === model);
  if (!product) {
    return NextResponse.json(
      { error: "No encontramos ese modelo en el catálogo." },
      { status: 404 },
    );
  }

  const webhookUrl = process.env.GOOGLE_SALES_WEBHOOK_URL;
  const webhookToken = process.env.GOOGLE_SALES_WEBHOOK_TOKEN;
  if (!webhookUrl || !webhookToken) {
    return NextResponse.json(
      { error: "Falta conectar la hoja de ventas." },
      { status: 503 },
    );
  }

  const sale = {
    token: webhookToken,
    timestamp: new Date().toISOString(),
    status: "Confirmado",
    customerName,
    phone,
    id: product.id,
    model: product.model,
    name: product.name,
    brand: product.brand,
    color: product.color,
    price: product.price,
    notes: body.notes?.trim() ?? "",
  };

  try {
    const result = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sale),
      cache: "no-store",
    });
    if (!result.ok) throw new Error(`La hoja respondió ${result.status}`);
    const response = (await result.json()) as { ok?: boolean };
    if (!response.ok) throw new Error("La hoja no aceptó el registro.");
  } catch (error) {
    console.error("sales: no se pudo guardar la venta", error);
    return NextResponse.json(
      { error: "No se pudo guardar la compra. Inténtalo de nuevo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
