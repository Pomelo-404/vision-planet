"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { IconCheck, IconLock, IconShoppingBag } from "@tabler/icons-react";
import { mxn } from "@/lib/format";
import type { Product } from "@/lib/products";

export default function SaleConfirmation({
  product,
  initialModel,
}: {
  product: Product | null;
  initialModel: string;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [model, setModel] = useState(product?.id ?? initialModel.toUpperCase());
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const unlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/sales/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) return setError(data.error ?? "No se pudo abrir el registro.");
    setUnlocked(true);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    const response = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, customerName, phone, notes }),
    });
    const data = (await response.json()) as { error?: string };
    setSaving(false);
    if (!response.ok) return setError(data.error ?? "No se pudo guardar la compra.");
    setSaved(true);
  };

  return (
    <main className="sale-page">
      <div className="sale-card">
        <Link href="/" className="back">← Volver al catálogo</Link>
        <div className="sale-heading">
          <span className="sale-icon"><IconShoppingBag size={21} /></span>
          <div>
            <p className="eyebrow">Vision Planet</p>
            <h1>Confirmar compra</h1>
          </div>
        </div>

        {!unlocked ? (
          <form className="sale-form" onSubmit={unlock}>
            <p className="sale-intro">Acceso privado para registrar una venta.</p>
            <label>
              <span><IconLock size={15} /> Código de acceso</span>
              <input
                type="password"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                autoComplete="current-password"
                required
                autoFocus
              />
            </label>
            {error && <p className="sale-error" role="alert">{error}</p>}
            <button className="btn sale-submit" type="submit">Abrir registro</button>
          </form>
        ) : saved ? (
          <div className="sale-success" role="status">
            <IconCheck size={26} />
            <h2>Compra registrada</h2>
            <p>La venta ya está guardada en la hoja.</p>
            <button className="btn sale-submit" onClick={() => setSaved(false)}>
              Registrar otra compra
            </button>
          </div>
        ) : (
          <form className="sale-form" onSubmit={submit}>
            {product ? (
              <div className="sale-product">
                <span>{product.brand}</span>
                <strong>{product.name}</strong>
                <small>{product.id} · {product.color} · {mxn(product.price)}</small>
              </div>
            ) : (
              <p className="sale-warning">Verifica el ID del modelo antes de confirmar.</p>
            )}
            <label>
              <span>Modelo / ID</span>
              <input value={model} onChange={(event) => setModel(event.target.value)} required />
            </label>
            <label>
              <span>Nombre del cliente</span>
              <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} autoComplete="name" required />
            </label>
            <label>
              <span>Número de WhatsApp</span>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="Ej. 55 1234 5678" required />
            </label>
            <label>
              <span>Notas <em>Opcional</em></span>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Anticipo, entrega o detalles del pedido" />
            </label>
            {error && <p className="sale-error" role="alert">{error}</p>}
            <button className="btn sale-submit" type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Confirmar y guardar"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
