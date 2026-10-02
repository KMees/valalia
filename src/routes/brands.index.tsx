import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandDoor, EmptyState } from "@/components/catalog-ui";
import { brands, products } from "@/lib/catalog/data";
import { countForBrand, filterBrands, nichesOf } from "@/lib/catalog/query";

type BrandSearch = { niche?: string };

export const Route = createFileRoute("/brands/")({
  validateSearch: (search: Record<string, unknown>): BrandSearch => ({
    niche: typeof search.niche === "string" && search.niche ? search.niche : undefined,
  }),
  component: BrandsPage,
  head: () => ({
    meta: [
      { title: "Shops — Valalia" },
      { name: "description", content: "The specialist shops. Each keeps its name." },
    ],
  }),
});

function BrandsPage() {
  const { niche = "" } = Route.useSearch();
  const niches = nichesOf(brands);
  const list = filterBrands(brands, niches.includes(niche) ? niche : "");

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-medium">Shops</h1>
      <p className="mt-3 max-w-xl text-mute">Each shop keeps its name, its buyer, and its color.</p>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by niche">
        <Link to="/brands" className="btn btn-secondary" aria-current={!niche ? "true" : undefined}>
          All
        </Link>
        {niches.map((item) => (
          <Link
            key={item}
            to="/brands"
            search={{ niche: item }}
            className="btn btn-secondary"
            aria-current={niche === item ? "true" : undefined}
          >
            {item}
          </Link>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No shops match.">
            <Link to="/brands">Clear filter</Link>
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {list.map((brand) => (
            <li key={brand.id}>
              <BrandDoor brand={brand} count={countForBrand(products, brand.id)} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
