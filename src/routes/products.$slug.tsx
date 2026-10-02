import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { brandVars, ProductCover } from "@/components/catalog-ui";
import { getBrandById, getProduct } from "@/lib/catalog/data";
import { formatLabel, formatMoney } from "@/lib/commerce/money";
import { track } from "@/lib/commerce/analytics";
import { siteUrl } from "@/lib/env";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    const brand = getBrandById(product.brandId);
    if (!brand) throw notFound();
    return { product, brand };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product — Valalia" }] };
    const { product, brand } = loaderData;
    const description = product.summary.slice(0, 160);
    const origin = siteUrl();
    return {
      meta: [
        { title: `${product.title} — ${brand.name} — Valalia` },
        { name: "description", content: description },
      ],
      links: [
        { rel: "stylesheet", href: brand.typography.googleHref },
        ...(origin ? [{ rel: "canonical", href: `${origin}/products/${product.slug}` }] : []),
      ],
    };
  },
  notFoundComponent: MissingProduct,
  component: ProductPage,
});

function ProductPage() {
  const { product, brand } = Route.useLoaderData();
  const forSale = product.status === "active";

  useEffect(() => {
    track("view_product", {
      brand_id: brand.id,
      product_id: product.id,
      price: product.price,
      status: product.status,
    });
  }, [brand.id, product.id, product.price, product.status]);

  const jsonLd = forSale
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.summary,
        brand: { "@type": "Brand", name: brand.name },
        offers: {
          "@type": "Offer",
          priceCurrency: product.currency,
          price: (product.price / 100).toFixed(2),
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <main className="pb-28 md:pb-12">
      <article className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ProductCover product={product} brand={brand} />
        <div style={brandVars(brand)} className="border p-6 md:p-8" >
          <p className="text-sm">
            <Link to="/brands/$slug" params={{ slug: brand.slug }}>
              {brand.name}
            </Link>
          </p>
          <h1 className="mt-3 text-4xl" style={{ fontFamily: brand.typography.display }}>
            {product.title}
          </h1>
          <p className="mt-4 text-lg">{product.summary}</p>
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between gap-4 border-b py-2" style={{ borderColor: brand.colors.line }}>
              <dt>Format</dt>
              <dd>{formatLabel(product.format)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b py-2" style={{ borderColor: brand.colors.line }}>
              <dt>License</dt>
              <dd className="text-right">{product.license}</dd>
            </div>
            {forSale ? (
              <div className="flex justify-between gap-4 py-2">
                <dt>Price</dt>
                <dd>{formatMoney(product.price, product.currency)}</dd>
              </div>
            ) : (
              <div className="py-2">Not for sale yet.</div>
            )}
          </dl>
          <div className="mt-6 hidden md:block">
            <AddToCart product={product} />
          </div>
        </div>
      </article>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2">
        <div>
          <h2 className="text-sm tracking-widest text-mute">What it returns</h2>
          <p className="mt-3">{product.returns}</p>
          <p className="mt-4 text-mute">{product.description}</p>
        </div>
        <div>
          <h2 className="text-sm tracking-widest text-mute">What you provide</h2>
          <p className="mt-3">{product.buyerProvides}</p>
          <h2 className="mt-8 text-sm tracking-widest text-mute">Included</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="text-sm tracking-widest text-mute">Files</h2>
        {product.files.length === 0 ? (
          <p className="mt-3 text-mute">No file is attached yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line border border-line">
            {product.files.map((file) => (
              <li key={file.key} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
                <span>{file.filename}</span>
                <span className="text-sm text-mute">{file.contentType}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-sm text-mute">File names are references. They are not public links.</p>
        <p className="mt-8 text-sm text-mute">A Valalia brand.</p>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-field px-5 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          {forSale ? <p>{formatMoney(product.price, product.currency)}</p> : <p className="text-sm text-mute">Not for sale yet</p>}
          <AddToCart product={product} />
        </div>
      </div>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      ) : null}
    </main>
  );
}

function MissingProduct() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="text-3xl font-medium">This product is not in the catalog.</h1>
      <p className="mt-6">
        <Link to="/brands">Brands</Link>
      </p>
    </main>
  );
}
