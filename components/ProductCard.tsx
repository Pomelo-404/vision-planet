"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getViews, Shot } from "@/lib/glasses";
import { mxn } from "@/lib/format";
import { CARD_ROTATE_MS, CARD_ROTATE_JITTER } from "@/lib/config";
import type { Product } from "@/lib/products";

export default function ProductCard({ variants }: { variants: Product[] }) {
  const router = useRouter();
  const rep = variants.find((v) => v.stock > 0) ?? variants[0];
  const multi = variants.length > 1;
  const out = variants.every((v) => v.stock <= 0);
  const slides = multi ? variants.map((v) => ({ view: getViews(v)[0], v })) : getViews(variants[0]).map((view) => ({ view, v: variants[0] }));
  const prices = variants.map((v) => v.price);
  const priceLabel = new Set(prices).size > 1 ? `Desde ${mxn(Math.min(...prices))}` : mxn(prices[0]);
  const [idx, setIdx] = useState(0);
  const [rotationKey, setRotationKey] = useState(0);
  const pointerStart = useRef({ x: 0, y: 0 });

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
  const isColorControl = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest(".cdots"));
  const openCurrentModel = () => router.push(`/frame/${current.v.id}`);

  return (
    <article className={`card${out ? " out" : ""}`}>
      <div
        className="pic"
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          if (isColorControl(event.target)) return;
          pointerStart.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          if (isColorControl(event.target)) return;
          const dx = event.clientX - pointerStart.current.x;
          const dy = event.clientY - pointerStart.current.y;
          if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
            changeSlide(idx + (dx < 0 ? 1 : -1));
            return;
          }
          openCurrentModel();
        }}
      >
        <div
          className="card-image-link"
          role="link"
          tabIndex={0}
          aria-label={`Ver ${current.v.name}`}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openCurrentModel();
            }
          }}
        >
          {out && <span className="badge">Agotado</span>}
          {slides.map((s, i) => <div key={i} className={`slide${i === idx ? " on" : ""}`} style={{ background: s.view.bg }}><Shot view={s.view} p={s.v} /></div>)}
        </div>
        {slides.length > 1 && (
          <div className="cdots" aria-label={multi ? "Colores disponibles" : "Imágenes disponibles"}>
            {slides.map((s, i) => multi ? (
              <button key={s.v.id} className={`cdot swatch${i === idx ? " on" : ""}`} style={{ background: s.v.hex }} onClick={() => changeSlide(i)} aria-label={`Ver color ${s.v.color}`} aria-pressed={i === idx} />
            ) : <span key={i} className={`cdot${i === idx ? " on" : ""}`} />)}
          </div>
        )}
      </div>
      <Link href={`/frame/${current.v.id}`} className="meta card-meta-link">
        <span className="mbrand">{rep.brand}</span>
        <span className="mname">{rep.name}</span>
        <div className="mrow"><span className="mprice">{priceLabel}</span><span className="mid">{multi ? `${variants.length} colores` : rep.id}</span></div>
      </Link>
    </article>
  );
}
