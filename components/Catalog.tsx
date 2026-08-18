"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  IconSearch,
  IconFilter,
  IconChevronRight,
  IconArrowLeft,
  IconCheck,
  IconX,
  IconEye,
  IconTag,
  IconEyeglass2,
  IconPalette,
  IconRuler2,
  IconSun,
} from "@tabler/icons-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";
import Image from "next/image";
import logo from "@/public/iso.png";

type Key = "brand" | "shape" | "color" | "size" | "type";
type Filters = Record<Key, string> & { q: string; stock: boolean };

const cats: { k: Key; l: string; Icon: typeof IconTag }[] = [
  { k: "brand", l: "Marca", Icon: IconTag },
  { k: "shape", l: "Forma", Icon: IconEyeglass2 },
  { k: "color", l: "Color", Icon: IconPalette },
  { k: "size", l: "Tamaño", Icon: IconRuler2 },
  { k: "type", l: "Tipo", Icon: IconSun },
];

const empty: Filters = {
  q: "",
  brand: "",
  shape: "",
  color: "",
  size: "",
  type: "",
  stock: false,
};

export default function Catalog({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allowed = useMemo(
    () =>
      cats.reduce(
        (m, c) => {
          m[c.k] = [...new Set(products.map((p) => p[c.k]))].sort();
          return m;
        },
        {} as Record<Key, string[]>,
      ),
    [products],
  );

  const [f, setF] = useState<Filters>(() => {
    const val = (k: Key) => {
      const v = searchParams.get(k) ?? "";
      return v && allowed[k].includes(v) ? v : "";
    };
    return {
      q: searchParams.get("q") ?? "",
      brand: val("brand"),
      shape: val("shape"),
      color: val("color"),
      size: val("size"),
      type: val("type"),
      stock: searchParams.get("stock") === "1",
    };
  });
  const [open, setOpen] = useState(false);
  const [showVals, setShowVals] = useState(false);
  const [activeCat, setActiveCat] = useState<Key>("brand");

  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams();
      if (f.q) params.set("q", f.q);
      cats.forEach((c) => {
        if (f[c.k]) params.set(c.k, f[c.k]);
      });
      if (f.stock) params.set("stock", "1");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 200);
    return () => clearTimeout(id);
  }, [f, pathname, router]);

  // filtra a nivel variante
  const filtered = products.filter((p) => {
    const q = f.q.toLowerCase();
    if (q && !`${p.name} ${p.id} ${p.brand}`.toLowerCase().includes(q))
      return false;
    return (
      cats.every((c) => !f[c.k] || p[c.k] === f[c.k]) &&
      (!f.stock || p.stock > 0)
    );
  });

  // agrupa las variantes en una entrada por modelo
  const groups = useMemo(() => {
    const m = new Map<string, Product[]>();
    filtered.forEach((p) => {
      const arr = m.get(p.model) ?? [];
      arr.push(p);
      m.set(p.model, arr);
    });
    return [...m.values()];
  }, [filtered]);

  const setVal = (v: string) => setF((s) => ({ ...s, [activeCat]: v }));
  const reset = () => setF(empty);
  const activeCount = cats.filter((c) => f[c.k]).length + (f.stock ? 1 : 0);
  const activeLabel = cats.find((c) => c.k === activeCat)!.l;

  const chips = [
    ...cats
      .filter((c) => f[c.k])
      .map((c) => ({ k: c.k as Key | "stock", label: `${c.l}: ${f[c.k]}` })),
    ...(f.stock ? [{ k: "stock" as const, label: "Solo disponibles" }] : []),
  ];
  const removeChip = (k: Key | "stock") =>
    setF((s) => (k === "stock" ? { ...s, stock: false } : { ...s, [k]: "" }));

  return (
    <main className="shop">
      <div className="head">
        <div className="brand">
          <Image
            src={logo}
            alt="Vision Planet"
            width={100}
            priority
            className="logo"
          />
          <div>
            <p className="brandname">Vision Planet • Catálogo</p>
            <p className="tag">Elige tu armazón y pídelo por WhatsApp</p>
          </div>
        </div>
        <span className="count">
          {groups.length} modelo{groups.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="searchrow">
        <label className="search">
          <IconSearch size={17} />
          <input
            name="buscar"
            type="text"
            value={f.q}
            placeholder="Buscar por nombre o ID…"
            onChange={(e) => setF((s) => ({ ...s, q: e.target.value }))}
            aria-label="Buscar"
          />
        </label>
        <button
          className={`filterbtn${activeCount ? " active" : ""}`}
          onClick={() => {
            setOpen((o) => !o);
            setShowVals(false);
          }}
          aria-expanded={open}
          aria-controls="filter-panel"
        >
          <IconFilter size={19} />
          <span>Filtros</span>
          {activeCount > 0 && (
            <span className="fbadge show">{activeCount}</span>
          )}
        </button>
      </div>

      {chips.length > 0 && (
        <div className="chips">
          {chips.map((c) => (
            <span key={c.k} className="chip" onClick={() => removeChip(c.k)}>
              {c.label} <IconX size={14} />
            </span>
          ))}
        </div>
      )}

      {open && (
        <section
          id="filter-panel"
          className={`fpanel open${showVals ? " show-vals" : ""}`}
          aria-label="Opciones de filtro"
        >
          <div className="fcats">
            <div className="fhead">
              <span>Filtrar por</span>
              {activeCount > 0 && (
                <button className="clear-filters" onClick={reset}>
                  Limpiar todo
                </button>
              )}
            </div>
            {cats.map((c) => (
              <button
                key={c.k}
                className={`frow${activeCat === c.k ? " active" : ""}`}
                onClick={() => {
                  setActiveCat(c.k);
                  setShowVals(true);
                }}
              >
                <c.Icon size={19} />
                <span className="fl">{c.l}</span>
                <span className="fv">{f[c.k]}</span>
                <IconChevronRight size={16} className="ch" />
              </button>
            ))}
            <button
              className="frow"
              onClick={() => setF((s) => ({ ...s, stock: !s.stock }))}
            >
              <IconEye size={19} />
              <span className="fl">Solo disponibles</span>
              <span className="fv">{f.stock && <IconCheck size={16} />}</span>
            </button>
          </div>
          <div className="fvals">
            <div className="fhead">
              <button
                className="vback"
                onClick={() => setShowVals(false)}
                aria-label="Atrás"
              >
                <IconArrowLeft size={17} />
              </button>
              <span>Elige {activeLabel.toLowerCase()}</span>
            </div>
            <button
              className={`vrow${!f[activeCat] ? " on" : ""}`}
              onClick={() => setVal("")}
            >
              <span>Todos</span>
              {!f[activeCat] && <IconCheck size={18} />}
            </button>
            {allowed[activeCat].map((v) => (
              <button
                key={v}
                className={`vrow${f[activeCat] === v ? " on" : ""}`}
                onClick={() => setVal(v)}
              >
                <span>{v}</span>
                {f[activeCat] === v && <IconCheck size={18} />}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="grid">
        {groups.length === 0 ? (
          <div className="empty">No hay modelos con esos filtros.</div>
        ) : (
          groups.map((vs) => <ProductCard key={vs[0].model} variants={vs} />)
        )}
      </div>
    </main>
  );
}
