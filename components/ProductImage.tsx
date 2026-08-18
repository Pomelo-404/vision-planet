"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`product-image${loaded ? " is-loaded" : ""}${failed ? " is-failed" : ""}`}
    >
      {!loaded && !failed && <span className="image-skeleton" aria-hidden="true" />}
      <Image
        src={src}
        alt={alt}
        width={800}
        height={800}
        sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 280px"
        className="product-image-file"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
