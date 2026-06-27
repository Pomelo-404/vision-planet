import type { Product, Shape } from "./products";
import Image from "next/image";

function lensEl(shape: Shape) {
  const x = 92,
    y = 70;
  switch (shape) {
    case "Redondo":
      return <circle cx={x} cy={y} r={40} />;
    case "Cuadrado":
      return <rect x={x - 44} y={y - 34} width={88} height={68} rx={16} />;
    case "Rectangular":
      return <rect x={x - 48} y={y - 27} width={96} height={54} rx={10} />;
    case "Wayfarer":
      return (
        <path
          d={`M ${x - 46} ${y - 30} L ${x + 44} ${y - 32} Q ${x + 50} ${y - 32} ${x + 48} ${y - 20} L ${x + 40} ${y + 26} Q ${x + 38} ${y + 34} ${x + 26} ${y + 34} L ${x - 30} ${y + 34} Q ${x - 44} ${y + 34} ${x - 46} ${y + 18} Z`}
        />
      );
    case "Aviador":
      return (
        <path
          d={`M ${x - 44} ${y - 26} Q ${x - 44} ${y - 34} ${x - 28} ${y - 34} L ${x + 34} ${y - 34} Q ${x + 46} ${y - 34} ${x + 44} ${y - 20} Q ${x + 38} ${y + 30} ${x + 2} ${y + 32} Q ${x - 32} ${y + 32} ${x - 42} ${y + 2} Q ${x - 46} ${y - 12} ${x - 44} ${y - 26} Z`}
        />
      );
    case "Ojo de gato":
      return (
        <path
          d={`M ${x - 50} ${y - 32} C ${x - 30} ${y - 40} ${x + 20} ${y - 36} ${x + 44} ${y - 26} C ${x + 50} ${y - 14} ${x + 40} ${y + 26} ${x + 4} ${y + 30} C ${x - 26} ${y + 33} ${x - 44} ${y + 22} ${x - 50} ${y - 2} C ${x - 52} ${y - 16} ${x - 52} ${y - 24} ${x - 50} ${y - 32} Z`}
        />
      );
  }
}

const tint = (p: Product) =>
  p.type === "Sol" ? "rgba(28,28,28,.5)" : "rgba(120,150,170,.16)";

export function Glasses({ p }: { p: Product }) {
  return (
    <svg viewBox="0 0 320 150" role="img" aria-label={`${p.shape} ${p.color}`}>
      <g
        fill={tint(p)}
        stroke={p.hex}
        strokeWidth={6}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {lensEl(p.shape)}
        <g transform="translate(320,0) scale(-1,1)">{lensEl(p.shape)}</g>
        <path d="M 134 60 Q 160 50 186 60" fill="none" />
        <path d="M 50 56 L 14 46" fill="none" />
        <g transform="translate(320,0) scale(-1,1)">
          <path d="M 50 56 L 14 46" fill="none" />
        </g>
      </g>
    </svg>
  );
}

export function SideView({ p }: { p: Product }) {
  return (
    <svg viewBox="0 0 320 150" role="img" aria-label={`${p.name} perfil`}>
      <g
        fill={tint(p)}
        stroke={p.hex}
        strokeWidth={6}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <g transform="translate(235,70) scale(.5,1) translate(-92,-70)">
          {lensEl(p.shape)}
        </g>
        <path d="M 213 60 L 40 56 Q 18 55 17 70 Q 16 83 27 87" fill="none" />
      </g>
    </svg>
  );
}
/* 
Original colors 

{ bg: "#efe9df", kind: "front" },
    {
      bg: "#ece4d4",
      kind: "front",
      transform: "perspective(760px) rotateY(-26deg) scale(.95)",
    },
    {
      bg: "#efe7d6",
      kind: "front",
      transform: "perspective(760px) rotateY(22deg) rotateX(8deg) scale(.94)",
    },
    { bg: "#ece4d4", kind: "side" },*/
export type View =
  | { bg: string; src: string }
  | { bg: string; transform?: string; kind: "front" | "side" };

export function getViews(p: Product): View[] {
  if (p.imgs && p.imgs.length)
    return p.imgs.map((src) => ({ bg: "#ffffff", src }));
  return [
    { bg: "#ffffff", kind: "front" },
    {
      bg: "#ffffff",
      kind: "front",
      transform: "perspective(760px) rotateY(-26deg) scale(.95)",
    },
    {
      bg: "#ffffff",
      kind: "front",
      transform: "perspective(760px) rotateY(22deg) rotateX(8deg) scale(.94)",
    },
    { bg: "#ffffff", kind: "side" },
  ];
}

export function Shot({ view, p }: { view: View; p: Product }) {
  if ("src" in view) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={view.src}
          alt={p.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  const node = view.kind === "side" ? <SideView p={p} /> : <Glasses p={p} />;

  return (
    <div className="shot" style={{ transform: view.transform }}>
      {node}
    </div>
  );
}
