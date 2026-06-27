import { notFound } from "next/navigation";
import { getProducts } from "@/lib/sheet";
import FrameDetail from "@/components/FrameDetail";

export const dynamicParams = true; // filas nuevas de la hoja se renderizan sin reconstruir

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id })); // una página por variante de color
}

export default async function FramePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Next 15. En Next 14: ({ params }: { params: { id: string } }) y quita el await.
  const products = await getProducts();
  const p = products.find((x) => x.id === id);
  if (!p) notFound();

  const variants = products.filter((x) => x.model === p.model);
  return <FrameDetail variants={variants} initialId={id} />;
}
