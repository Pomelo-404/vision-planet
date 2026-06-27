"use client";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

export default function BackLink() {
  const router = useRouter();
  const back = () => {
    if (typeof window !== "undefined" && window.history.length > 1)
      router.back();
    else router.push("/");
  };
  return (
    <button className="back" onClick={back}>
      <IconArrowLeft size={16} /> Volver al catálogo
    </button>
  );
}
