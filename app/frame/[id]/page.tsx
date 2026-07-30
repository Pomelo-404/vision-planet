import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/sheet";
import { mxn } from "@/lib/format";
import { SITE_URL } from "@/lib/config";
import FrameDetail from "@/components/FrameDetail";

export const dynamicParams = true; // filas nuevas de la hoja se renderizan sin reconstruir

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id })); // una página por variante de color
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const products = await getProducts();
  const p = products.find((x) => x.id === id);
  if (!p) return { title: "Vision Planet" };

  const img = p.imgs?.[0] ? `${SITE_URL}${p.imgs[0]}` : `${SITE_URL}/og.png`;
  const url = `${SITE_URL}/frame/${p.id}`;
  const titulo = `${p.name} - ${p.brand}`;
  const desc = `${p.color} · ${mxn(p.price)}`;

  return {
    title: `${titulo} | Vision Planet`,
    description: desc,
    openGraph: {
      title: titulo,
      description: desc,
      url,
      images: [img],
      type: "website",
    },
  };
}

export default async function FramePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Next 15/16. En Next 14: ({ params }: { params: { id: string } }) y quita el await.
  const products = await getProducts();
  const p = products.find((x) => x.id === id);
  if (!p) notFound();

  const variants = products.filter((x) => x.model === p.model);
  return <FrameDetail variants={variants} initialId={id} />;
}
