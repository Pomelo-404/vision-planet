"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getViews, Shot } from "@/lib/glasses";
import { mxn } from "@/lib/format";
import { CARD_ROTATE_MS, CARD_ROTATE_JITTER } from "@/lib/config";
import type { Product } from "@/lib/products";

export default function ProductCard({ variants }: { variants: Product[] }) {
  const rep = variants.find((v) => v.stock > 0) ?? variants[0];
  const multi = variants.length > 1;
  const out = variants.every((v) => v.stock <= 0);

  // multicolor -> una diapositiva por color; un solo color -> las fotos de ese color
  const slides = multi
    ? variants.map((v) => ({ view: getViews(v)[0], v }))
    : getViews(variants[0]).map((view) => ({ view, v: variants[0] }));

  const prices = variants.map((v) => v.price);
  const priceLabel =
    new Set(prices).size > 1
      ? `Desde ${mxn(Math.min(...prices))}`
      : mxn(prices[0]);

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    let interval: ReturnType<typeof setInterval>;
    const delay = setTimeout(() => {
      interval = setInterval(
        () => setIdx((i) => (i + 1) % slides.length),
        CARD_ROTATE_MS + Math.random() * CARD_ROTATE_JITTER,
      );
    }, Math.random() * 2500);
    return () => {
      clearTimeout(delay);
      if (interval) clearInterval(interval);
    };
  }, [slides.length]);

  const current = slides[idx] ?? slides[0];

  return (
    <Link
      href={`/frame/${current.v.id}`}
      className={`card${out ? " out" : ""}`}
    >
      <div className="pic">
        {out && <span className="badge">Agotado</span>}
        {slides.map((s, i) => (
          <div
            key={i}
            className={`slide${i === idx ? " on" : ""}`}
            style={{ background: s.view.bg }}
          >
            <Shot view={s.view} p={s.v} />
          </div>
        ))}
        {slides.length > 1 && (
          <div className="cdots">
            {slides.map((s, i) => (
              <span
                key={i}
                className={`cdot${multi ? " swatch" : ""}${i === idx ? " on" : ""}`}
                style={multi ? { background: s.v.hex } : undefined}
              />
            ))}
          </div>
        )}
      </div>
      <div className="meta">
        <span className="mbrand">{rep.brand}</span>
        <span className="mname">{rep.name}</span>
        <div className="mrow">
          <span className="mprice">{priceLabel}</span>
          <span className="mid">
            {multi ? `${variants.length} colores` : rep.id}
          </span>
        </div>
      </div>
    </Link>
  );
}
