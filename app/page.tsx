import { Suspense } from "react";
import Catalog from "@/components/Catalog";
import { getProducts } from "@/lib/sheet";

export default async function Home() {
  const products = await getProducts();
  return (
    <Suspense fallback={null}>
      <Catalog products={products} />
    </Suspense>
  );
}
