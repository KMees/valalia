import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProductGrid } from "@/components/catalog-ui";
import { getBrand, products } from "@/lib/catalog/data";
import { productsForBrand } from "@/lib/catalog/query";

export const Route = createFileRoute("/brands/$slug/products")({
  loader: ({ params }) => {
    const brand = getBrand(params.slug);
    if (!brand) throw notFound();
    return { brand };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `${loaderData.brand.name} products — Valalia` : "Products — Valalia",
      },
    ],
    links: loaderData ? [{ rel: "stylesheet", href: loaderData.brand.typography.googleHref }] : [],
  }),
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="text-3xl font-medium">This brand is not in the house.</h1>
      <p className="mt-6">
        <Link to="/brands">Brands</Link>
      </p>
    </main>
  ),
  component: BrandProducts,
});

function BrandProducts() {
  const { brand } = Route.useLoaderData();
  const catalog = productsForBrand(products, brand.id);
  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-sm text-mute">
        <Link to="/brands/$slug" params={{ slug: brand.slug }}>
          {brand.name}
        </Link>
      </p>
      <h1 className="mt-3 text-4xl font-medium">Products</h1>
      {catalog.length === 0 ? <p className="mt-6">The catalog is not open.</p> : <div className="mt-8"><ProductGrid products={catalog} /></div>}
    </main>
  );
}
