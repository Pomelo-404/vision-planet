import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REFRESH_SECRET) {
    return NextResponse.json(
      { ok: false, error: "no autorizado" },
      { status: 401 },
    );
  }
  revalidateTag("products", { expire: 0 }); // expira de inmediato; el siguiente visitante ve lo nuevo
  return NextResponse.json({ ok: true, refreshed: new Date().toISOString() });
}
