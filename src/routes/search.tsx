import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { BrandDoor, EmptyState, ProductGrid } from "@/components/catalog-ui";
import { brands, products } from "@/lib/catalog/data";
import { countForBrand, filterProducts, searchBrands } from "@/lib/catalog/query";
import { track } from "@/lib/commerce/analytics";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    if (typeof search.q === "string" && search.q) return { q: search.q };
    return {};
  },
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "Search — Valalia" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const query = q.trim();
  const foundProducts = query ? filterProducts(products, { query, sort: "featured" }) : [];
  const foundBrands = query ? searchBrands(brands, query) : [];

  useEffect(() => {
    if (query) track("search", { q: query });
  }, [query]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-medium">Search</h1>
      <form className="mt-6" action="/search">
        <label htmlFor="q" className="sr-only">
          Search products and shops
        </label>
        <input id="q" className="field" type="search" name="q" defaultValue={q} placeholder="Search products and shops" />
      </form>
      {!query ? <p className="mt-8 text-mute">Search products and shops.</p> : null}
      {query && foundProducts.length === 0 && foundBrands.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No products match.">
            <Link to="/search">Clear search</Link>
          </EmptyState>
        </div>
      ) : null}
      {foundBrands.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-sm tracking-widest text-mute">Shops</h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {foundBrands.map((brand) => (
              <li key={brand.id}>
                <BrandDoor brand={brand} count={countForBrand(products, brand.id)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {foundProducts.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-sm tracking-widest text-mute">Products</h2>
          <div className="mt-4">
            <ProductGrid products={foundProducts} />
          </div>
        </section>
      ) : null}
    </main>
  );
}
