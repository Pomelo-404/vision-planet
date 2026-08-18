import { NextResponse } from "next/server";
import {
  accessIsConfigured,
  accessToken,
  saleCookieName,
  validAccessCode,
} from "@/lib/sales";

export async function POST(request: Request) {
  const { code } = (await request.json()) as { code?: string };

  if (!accessIsConfigured()) {
    return NextResponse.json(
      { error: "Falta configurar el acceso de ventas." },
      { status: 503 },
    );
  }
  if (!code || !validAccessCode(code)) {
    return NextResponse.json({ error: "Código incorrecto." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(saleCookieName, accessToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
