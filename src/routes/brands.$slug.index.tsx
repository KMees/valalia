import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { brandVars, ProductGrid } from "@/components/catalog-ui";
import { getBrand, products } from "@/lib/catalog/data";
import { activeProducts, productsForBrand } from "@/lib/catalog/query";
import { track } from "@/lib/commerce/analytics";

export const Route = createFileRoute("/brands/$slug/")({
  loader: ({ params }) => {
    const brand = getBrand(params.slug);
    if (!brand) throw notFound();
    return { brand };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Brand — Valalia" }] };
    const { brand } = loaderData;
    return {
      meta: [
        { title: `${brand.name} — Valalia` },
        { name: "description", content: brand.promise },
      ],
      links: [{ rel: "stylesheet", href: brand.typography.googleHref }],
    };
  },
  component: BrandPage,
});

function BrandPage() {
  const { brand } = Route.useLoaderData();
  const catalog = productsForBrand(products, brand.id);
  const open = activeProducts(catalog).length > 0;

  useEffect(() => {
    track("view_brand", { brand_id: brand.id, status: brand.status });
  }, [brand.id, brand.status]);

  return (
    <main style={brandVars(brand)}>
      <div className="mx-auto max-w-6xl px-5 py-12">
        {brand.logo.src ? (
          <img src={brand.logo.src} alt="" className="h-20 w-20 object-contain" />
        ) : (
          <p className="text-sm tracking-widest">{brand.logo.monogram}</p>
        )}
        <h1 className="mt-3 text-5xl" style={{ fontFamily: brand.typography.display }}>
          {brand.name}
        </h1>
        <p className="mt-4 max-w-xl text-lg">{brand.promise}</p>
        <p className="mt-4 max-w-2xl">{brand.description}</p>
        <p className="mt-3 text-sm">For {brand.audience}</p>
        {!open ? (
          <p className="mt-6 border-t pt-6" style={{ borderColor: brand.colors.line }}>
            Not for sale yet. The products are here so the shop can be reviewed.
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/brands/$slug/products" params={{ slug: brand.slug }}>
            Products
          </Link>
          <Link to="/brands">All shops</Link>
        </div>
        <h2 className="mt-10 text-sm tracking-widest">Products</h2>
        <div className="mt-4">
          <ProductGrid products={catalog} />
        </div>
        <p className="mt-12 text-sm">A Valalia brand.</p>
      </div>
    </main>
  );
}
