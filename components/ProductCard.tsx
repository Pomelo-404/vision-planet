"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getViews, Shot } from "@/lib/glasses";
import { mxn } from "@/lib/format";
import { CARD_ROTATE_MS, CARD_ROTATE_JITTER } from "@/lib/config";
import type { Product } from "@/lib/products";

export default function ProductCard({ p }: { p: Product }) {
  const views = getViews(p);
  const [idx, setIdx] = useState(0);
  const out = p.stock <= 0;

  useEffect(() => {
    if (views.length < 2) return;
    let interval: ReturnType<typeof setInterval>;
    const delay = setTimeout(() => {
      interval = setInterval(
        () => setIdx((i) => (i + 1) % views.length),
        CARD_ROTATE_MS + Math.random() * CARD_ROTATE_JITTER,
      );
    }, Math.random() * 2500);
    return () => {
      clearTimeout(delay);
      if (interval) clearInterval(interval);
    };
  }, [views.length]);
  return (
    <Link href={`/frame/${p.id}`} className={`card${out ? " out" : ""}`}>
      <div className="pic">
        {out && <span className="badge">Agotado</span>}
        {views.map((v, i) => (
          <div
            key={i}
            className={`slide${i === idx ? " on" : ""}`}
            style={{ background: v.bg }}
          >
            <Shot view={v} p={p} />
          </div>
        ))}
        {views.length > 1 && (
          <div className="cdots">
            {views.map((_, i) => (
              <span key={i} className={`cdot${i === idx ? " on" : ""}`} />
            ))}
          </div>
        )}
      </div>
      <div className="meta">
        <span className="mbrand">{p.brand}</span>
        <span className="mname">{p.name}</span>
        <div className="mrow">
          <span className="mprice">{mxn(p.price)}</span>
          <span className="mid">${p.id}</span>
        </div>
      </div>
    </Link>
  );
}
