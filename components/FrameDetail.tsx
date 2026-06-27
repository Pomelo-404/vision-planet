"use client";
import { useState } from "react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { mxn } from "@/lib/format";
import { waLink, waMessage } from "@/lib/whatsapp";
import Carousel from "./Carousel";
import CopyButton from "./hover/touch/CopyButton";
import BackLink from "./hover/touch/BackLink";
import type { Product } from "@/lib/products";

export default function FrameDetail({
  variants,
  initialId,
}: {
  variants: Product[];
  initialId: string;
}) {
  const [selected, setSelected] = useState<Product>(
    variants.find((v) => v.id === initialId) ?? variants[0],
  );
  const ok = selected.stock > 0;

  const pick = (v: Product) => {
    setSelected(v);
    // actualiza la URL al color elegido (compartible) sin navegación completa
    window.history.replaceState(null, "", `/frame/${v.id}`);
  };

  return (
    <main className="shop">
      <BackLink />
      <div className="detail">
        {/* key reinicia el carrusel a la primera imagen al cambiar de color */}
        <Carousel key={selected.id} p={selected} />
        <div>
          <span className="idpill">ID: {selected.id}</span>
          <h1 className="dname">{selected.name}</h1>
          <p className="dbrand">{selected.brand}</p>

          {variants.length > 1 && (
            <>
              <div className="swatches">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    className={`swatch${v.id === selected.id ? " on" : ""}${v.stock <= 0 ? " soldout" : ""}`}
                    style={{ background: v.hex }}
                    onClick={() => pick(v)}
                    aria-label={v.color}
                    title={v.color + (v.stock <= 0 ? " (agotado)" : "")}
                  />
                ))}
              </div>
              <p className="swlabel">
                Color: {selected.color}
                {selected.stock <= 0 ? " · Agotado" : ""}
              </p>
            </>
          )}

          <div className="dprice">
            {mxn(selected.price)}{" "}
            <span className={`avail ${ok ? "ok" : "no"}`}>
              · {ok ? "Disponible" : "Agotado"}
            </span>
          </div>
          <dl className="specs">
            <dt>Color</dt>
            <dd>{selected.color}</dd>
            <dt>Forma</dt>
            <dd>{selected.shape}</dd>
            <dt>Tamaño</dt>
            <dd>{selected.size}</dd>
            <dt>Medidas</dt>
            <dd>{selected.mm} mm</dd>
            <dt>Material</dt>
            <dd>{selected.material}</dd>
            <dt>Estilo</dt>
            <dd>{selected.style}</dd>
            <dt>Tipo</dt>
            <dd>{selected.type}</dd>
          </dl>
          <p className="desc">{selected.desc}</p>
          <div className="actions">
            <a
              className="btn wa"
              href={waLink(selected)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandWhatsapp size={18} />{" "}
              {ok ? "Pedir por WhatsApp" : "Preguntar disponibilidad"}
            </a>
            <CopyButton text={waMessage(selected)} />
          </div>
          <p className="hint">
            Elige un color arriba. Las fotos avanzan solas y se pausan al pasar
            el cursor.
          </p>
        </div>
      </div>
    </main>
  );
}
