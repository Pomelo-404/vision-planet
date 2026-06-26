import { notFound } from "next/navigation";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { products } from "@/lib/products";
import { mxn } from "@/lib/format";
import { waLink, waMessage } from "@/lib/whatsapp";
import Carousel from "@/components/Carousel";
import CopyButton from "@/components/hover/touch/CopyButton";
import BackLink from "@/components/hover/touch/BackLink";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function FramePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Next 15. On Next 14: ({ params }: { params: { id: string } }) and skip await.
  const p = products.find((x) => x.id === id);
  if (!p) notFound();
  const ok = p.stock > 0;

  return (
    <main className="shop">
      <BackLink />
      <div className="detail">
        <Carousel p={p} />
        <div>
          <span className="idpill">ID: {p.id}</span>
          <h1 className="dname">{p.name}</h1>
          <p className="dbrand">{p.brand}</p>
          <div className="dprice">
            {mxn(p.price)}{" "}
            <span className={`avail ${ok ? "ok" : "no"}`}>
              · {ok ? "Disponible" : "Agotado"}
            </span>
          </div>
          <dl className="specs">
            <dt>Color</dt>
            <dd>{p.color}</dd>
            <dt>Forma</dt>
            <dd>{p.shape}</dd>
            <dt>Tamaño</dt>
            <dd>{p.size}</dd>
            <dt>Medidas</dt>
            <dd>{p.mm} mm</dd>
            <dt>Material</dt>
            <dd>{p.material}</dd>
            <dt>Estilo</dt>
            <dd>{p.style}</dd>
            <dt>Tipo</dt>
            <dd>{p.type}</dd>
          </dl>
          <p className="desc">{p.desc}</p>
          <div className="actions">
            <a
              className="btn wa"
              href={waLink(p)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandWhatsapp size={18} />{" "}
              {ok ? "Pedir por WhatsApp" : "Preguntar disponibilidad"}
            </a>
            <CopyButton text={waMessage(p)} />
          </div>
          <p className="hint">
            Las fotos avanzan solas y se pausan al pasar el cursor. Desliza o
            usa las flechas para verlas.
          </p>
        </div>
      </div>
    </main>
  );
}
