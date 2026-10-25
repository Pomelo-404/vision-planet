"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getViews, Shot } from "@/lib/glasses";
import { mxn } from "@/lib/format";
import { CARD_ROTATE_MS, CARD_ROTATE_JITTER } from "@/lib/config";
import type { Product } from "@/lib/products";

export default function ProductCard({ variants }: { variants: Product[] }) {
  const rep = variants.find((v) => v.stock > 0) ?? variants[0];
  const multi = variants.length > 1;
  const out = variants.every((v) => v.stock <= 0);
  const slides = multi ? variants.map((v) => ({ view: getViews(v)[0], v })) : getViews(variants[0]).map((view) => ({ view, v: variants[0] }));
  const prices = variants.map((v) => v.price);
  const priceLabel = new Set(prices).size > 1 ? `Desde ${mxn(Math.min(...prices))}` : mxn(prices[0]);
  const [idx, setIdx] = useState(0);
  const [rotationKey, setRotationKey] = useState(0);
  const touchStart = useRef({ x: 0, y: 0 });
  const didSwipe = useRef(false);

  useEffect(() => {
    if (slides.length < 2) return;
    let interval: ReturnType<typeof setInterval>;
    const delay = setTimeout(() => {
      interval = setInterval(() => setIdx((i) => (i + 1) % slides.length), CARD_ROTATE_MS + Math.random() * CARD_ROTATE_JITTER);
    }, Math.random() * 2500);
    return () => {
      clearTimeout(delay);
      if (interval) clearInterval(interval);
    };
  }, [slides.length, rotationKey]);

  const changeSlide = (next: number) => {
    setIdx((next + slides.length) % slides.length);
    setRotationKey((key) => key + 1);
  };
  const current = slides[idx] ?? slides[0];
  const stopFollowAfterSwipe = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!didSwipe.current) return;
    event.preventDefault();
    didSwipe.current = false;
  };

  return (
    <article className={`card${out ? " out" : ""}`}>
      <div
        className="pic"
        onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
        onTouchEnd={(event) => {
          const dx = event.changedTouches[0].clientX - touchStart.current.x;
          const dy = event.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
            didSwipe.current = true;
            changeSlide(idx + (dx < 0 ? 1 : -1));
          }
        }}
      >
        <Link href={`/frame/${current.v.id}`} className="card-image-link" aria-label={`Ver ${current.v.name}`} onClick={stopFollowAfterSwipe}>
          {out && <span className="badge">Agotado</span>}
          {slides.map((s, i) => <div key={i} className={`slide${i === idx ? " on" : ""}`} style={{ background: s.view.bg }}><Shot view={s.view} p={s.v} /></div>)}
        </Link>
        {slides.length > 1 && (
          <div className="cdots" aria-label={multi ? "Colores disponibles" : "Imágenes disponibles"}>
            {slides.map((s, i) => multi ? (
              <button key={s.v.id} className={`cdot swatch${i === idx ? " on" : ""}`} style={{ background: s.v.hex }} onClick={() => changeSlide(i)} aria-label={`Ver color ${s.v.color}`} aria-pressed={i === idx} />
            ) : <span key={i} className={`cdot${i === idx ? " on" : ""}`} />)}
          </div>
        )}
      </div>
      <Link href={`/frame/${current.v.id}`} className="meta card-meta-link" onClick={stopFollowAfterSwipe}>
        <span className="mbrand">{rep.brand}</span>
        <span className="mname">{rep.name}</span>
        <div className="mrow"><span className="mprice">{priceLabel}</span><span className="mid">{multi ? `${variants.length} colores` : rep.id}</span></div>
      </Link>
    </article>
  );
}
