"use client";
import { useState } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export default function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };
  return (
    <button className="btn copy" onClick={copy}>
      {done ? (
        <>
          <IconCheck size={18} /> ¡Copiado!
        </>
      ) : (
        <>
          <IconCopy size={18} /> Copiar datos
        </>
      )}
    </button>
  );
}
