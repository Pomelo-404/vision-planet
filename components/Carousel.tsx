"use client";
import { useEffect, useRef, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import { getViews, Shot } from "@/lib/glasses";
import { CAROUSEL_MS } from "@/lib/config";
import type { Product } from "@/lib/products";

export default function Carousel({ p }: { p: Product }) {
  const views = getViews(p);
  const [idx, setIdx] = useState(0);
  const [navKey, setNavKey] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const paused = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    if (views.length < 2) return;
    const t = setInterval(() => {
      if (!paused.current) setIdx((i) => (i + 1) % views.length);
    }, CAROUSEL_MS);
    return () => clearInterval(t);
  }, [views.length, navKey]);

  const go = (n: number) => {
    setIdx((i) => (i + n + views.length) % views.length);
    setNavKey((k) => k + 1);
    setZoomed(false);
  };
  const goTo = (n: number) => {
    setIdx(n);
    setNavKey((k) => k + 1);
    setZoomed(false);
  };

  const toggleZoom = () => setZoomed((value) => !value);

  return (
    <div>
      <div
        className={`gmain${zoomed ? " is-zoomed" : ""}`}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onTouchStart={(e) => {
          startX.current = e.touches[0].clientX;
          startY.current = e.touches[0].clientY;
          paused.current = true;
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - startX.current;
          const dy = e.changedTouches[0].clientY - startY.current;
          if (!zoomed && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            go(dx < 0 ? 1 : -1);
          }
          paused.current = false;
        }}
      >
        {views.map((v, i) => (
          <div
            key={i}
            className={`slide${i === idx ? " on" : ""}`}
            style={{ background: v.bg }}
          >
            <div
              className={`zoom-target${zoomed && i === idx ? " is-zoomed" : ""}`}
            >
              <Shot view={v} p={p} />
            </div>
          </div>
        ))}
        <button
          className="gzoom"
          onClick={toggleZoom}
          aria-pressed={zoomed}
          aria-label={zoomed ? "Reducir imagen" : "Ampliar imagen"}
          title={zoomed ? "Reducir" : "Ampliar"}
        >
          {zoomed ? <IconZoomOut size={18} /> : <IconZoomIn size={18} />}
        </button>
        {views.length > 1 && (
          <>
            <button
              className="gnav prev"
              onClick={() => go(-1)}
              aria-label="Anterior"
            >
              <IconChevronLeft size={18} />
            </button>
            <button
              className="gnav next"
              onClick={() => go(1)}
              aria-label="Siguiente"
            >
              <IconChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      {views.length > 1 && (
        <div className="gdots">
          {views.map((_, i) => (
            <button
              key={i}
              className={`gdot${i === idx ? " on" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
