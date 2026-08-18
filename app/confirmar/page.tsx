import { getProducts } from "@/lib/sheet";
import SaleConfirmation from "@/components/SaleConfirmation";

export default async function ConfirmSalePage({
  searchParams,
}: {
  searchParams: Promise<{ modelo?: string }>;
}) {
  const { modelo = "" } = await searchParams;
  const products = await getProducts();
  const product = products.find(
    (item) => item.id.toUpperCase() === modelo.trim().toUpperCase(),
  );

  return <SaleConfirmation product={product ?? null} initialModel={modelo} />;
}
