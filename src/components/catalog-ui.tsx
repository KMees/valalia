import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { getBrandById } from "@/lib/catalog/data";
import type { Brand, Product } from "@/lib/catalog/types";
import { formatLabel, formatMoney } from "@/lib/commerce/money";

export function brandVars(brand: Brand): CSSProperties {
  return {
    background: brand.colors.paper,
    color: brand.colors.ink,
    fontFamily: brand.typography.text,
    ["--brand-accent" as string]: brand.colors.accent,
    ["--brand-line" as string]: brand.colors.line,
    ["--brand-display" as string]: brand.typography.display,
  };
}

export function ProductCover({ product, brand }: { product: Product; brand: Brand }) {
  const image = product.images[0];
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const showImage = image !== undefined && !failed;

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [image?.src]);

  return (
    <div
      className="cover-frame relative overflow-hidden border"
      style={{ background: brand.colors.paper, borderColor: brand.colors.line, color: brand.colors.ink }}
    >
      <span className="absolute inset-y-0 left-0 w-1" style={{ background: brand.colors.accent }} />
      {showImage ? (
        <img
          ref={imgRef}
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full flex-col justify-between p-4 pl-5">
          <p className="text-xs tracking-widest">{brand.name}</p>
          <div>
            <p className="text-xs" style={{ color: brand.colors.ink }}>
              {product.id.toUpperCase()}
            </p>
            <div className="mt-3 space-y-2" aria-hidden="true">
              <div className="h-px w-full" style={{ background: brand.colors.line }} />
              <div className="h-px w-2/3" style={{ background: brand.colors.line }} />
              <div className="h-px w-full" style={{ background: brand.colors.line }} />
            </div>
          </div>
          <p className="text-xs">{formatLabel(product.format)}</p>
          {image && failed ? <p className="sr-only">Cover image unavailable. A generated cover is shown.</p> : null}
        </div>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const brand = getBrandById(product.brandId);
  if (!brand) return null;
  const forSale = product.status === "active";

  return (
    <article className="flex h-full flex-col border border-line bg-field">
      <Link to="/products/$slug" params={{ slug: product.slug }} className="text-ink no-underline">
        <ProductCover product={product} brand={brand} />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-xs tracking-wide text-mute">{formatLabel(product.format)}</p>
          <p className="text-sm text-mute">{brand.name}</p>
          <h3 className="text-lg font-medium text-ink">{product.title}</h3>
          {forSale ? (
            <p className="mt-auto text-ink">{formatMoney(product.price, product.currency)}</p>
          ) : (
            <p className="mt-auto text-sm text-mute">Not for sale yet</p>
          )}
        </div>
      </Link>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

export function BrandDoor({ brand, count }: { brand: Brand; count: number }) {
  return (
    <article className="flex h-full border border-line bg-field">
      <span className="w-1 shrink-0" style={{ background: brand.colors.accent }} aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs tracking-widest text-mute" aria-hidden="true">
          {brand.logo.monogram}
        </p>
        <h2 className="text-2xl font-medium">{brand.name}</h2>
        <p className="text-mute">{brand.promise}</p>
        <p className="text-sm text-mute">
          {count} {count === 1 ? "product" : "products"}
        </p>
        <Link to="/brands/$slug" params={{ slug: brand.slug }} className="mt-auto inline-flex min-h-11 items-center text-measure">
          Enter {brand.name}
        </Link>
      </div>
    </article>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border border-line px-5 py-10">
      <p className="text-lg">{title}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
