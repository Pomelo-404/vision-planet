"use client";
import { useEffect, useRef, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMinus,
  IconPlus,
  IconX,
  IconZoomIn,
} from "@tabler/icons-react";
import { getViews, Shot } from "@/lib/glasses";
import { CAROUSEL_MS } from "@/lib/config";
import type { Product } from "@/lib/products";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.35;

export default function Carousel({ p }: { p: Product }) {
  const views = getViews(p);
  const [idx, setIdx] = useState(0);
  const [navKey, setNavKey] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const paused = useRef(false);
  const zoomValue = useRef(MIN_ZOOM);
  const startX = useRef(0);
  const startY = useRef(0);
  const drag = useRef({ active: false, x: 0, y: 0, panX: 0, panY: 0 });

  useEffect(() => {
    if (views.length < 2) return;
    const t = setInterval(() => {
      if (!paused.current && !viewerOpen) setIdx((i) => (i + 1) % views.length);
    }, CAROUSEL_MS);
    return () => clearInterval(t);
  }, [views.length, navKey, viewerOpen]);

  useEffect(() => {
    if (!viewerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        paused.current = false;
        setViewerOpen(false);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [viewerOpen]);

  const go = (n: number) => {
    setIdx((i) => (i + n + views.length) % views.length);
    setNavKey((k) => k + 1);
  };
  const goTo = (n: number) => {
    setIdx(n);
    setNavKey((k) => k + 1);
  };
  const setZoomLevel = (value: number) => {
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
    zoomValue.current = next;
    setZoom(next);
    if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
  };
  const openViewer = () => {
    paused.current = true;
    zoomValue.current = MIN_ZOOM;
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
    setViewerOpen(true);
  };
  const closeViewer = () => {
    paused.current = false;
    setViewerOpen(false);
  };

  return (
    <div>
      <div
        className="gmain"
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
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
          paused.current = false;
        }}
      >
        {views.map((v, i) => (
          <div key={i} className={`slide${i === idx ? " on" : ""}`} style={{ background: v.bg }}>
            <Shot view={v} p={p} />
          </div>
        ))}
        <button className="gzoom" onClick={openViewer} aria-label="Ampliar imagen" title="Ampliar">
          <IconZoomIn size={18} />
        </button>
        {views.length > 1 && (
          <>
            <button className="gnav prev" onClick={() => go(-1)} aria-label="Anterior"><IconChevronLeft size={18} /></button>
            <button className="gnav next" onClick={() => go(1)} aria-label="Siguiente"><IconChevronRight size={18} /></button>
          </>
        )}
      </div>
      {views.length > 1 && (
        <div className="gdots">
          {views.map((_, i) => <button key={i} className={`gdot${i === idx ? " on" : ""}`} onClick={() => goTo(i)} aria-label={`Imagen ${i + 1}`} />)}
        </div>
      )}

      {viewerOpen && (
        <div className="zoom-viewer" role="dialog" aria-modal="true" aria-label={`Detalle de ${p.name}`} onClick={closeViewer}>
          <div className="zoom-dialog" onClick={(event) => event.stopPropagation()}>
            <div className="zoom-toolbar">
              <span>{p.name} · {Math.round(zoom * 100)}%</span>
              <div>
                <button onClick={() => setZoomLevel(zoomValue.current - ZOOM_STEP)} disabled={zoom <= MIN_ZOOM} aria-label="Alejar"><IconMinus size={18} /></button>
                <button onClick={() => setZoomLevel(zoomValue.current + ZOOM_STEP)} disabled={zoom >= MAX_ZOOM} aria-label="Acercar"><IconPlus size={18} /></button>
                <button onClick={closeViewer} aria-label="Cerrar visor"><IconX size={20} /></button>
              </div>
            </div>
            <div
              className={`zoom-canvas${zoom > MIN_ZOOM ? " is-draggable" : ""}`}
              onWheel={(event) => {
                event.preventDefault();
                setZoomLevel(zoomValue.current + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
              }}
              onPointerDown={(event) => {
                if (zoom <= MIN_ZOOM) return;
                drag.current = { active: true, x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (!drag.current.active) return;
                setPan({ x: drag.current.panX + event.clientX - drag.current.x, y: drag.current.panY + event.clientY - drag.current.y });
              }}
              onPointerUp={() => (drag.current.active = false)}
              onPointerCancel={() => (drag.current.active = false)}
            >
              <div className="zoom-pan" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                <Shot view={views[idx]} p={p} />
              </div>
            </div>
            <p className="zoom-help">Usa la rueda o los botones para acercar. Arrastra la imagen para recorrerla.</p>
          </div>
        </div>
      )}
    </div>
  );
}
