import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState, ProductGrid } from "@/components/catalog-ui";
import { brands, products } from "@/lib/catalog/data";
import { filterProducts, type ProductSort } from "@/lib/catalog/query";
import type { ProductFormat } from "@/lib/catalog/types";

type ProductSearch = {
  brand?: string;
  format?: "" | ProductFormat;
  sort?: ProductSort;
};

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    const format =
      search.format === "spreadsheet" || search.format === "pdf" || search.format === "software"
        ? search.format
        : undefined;
    const sort = search.sort === "newest" || search.sort === "price" || search.sort === "featured" ? search.sort : undefined;
    const brand = typeof search.brand === "string" && search.brand ? search.brand : undefined;
    return { brand, format, sort };
  },
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Products — Valalia" },
      { name: "description", content: "Instruments from the Valalia houses." },
    ],
  }),
});

function ProductsPage() {
  const search = Route.useSearch();
  const brandSlug = search.brand ?? "";
  const format = search.format ?? "";
  const sort = search.sort ?? "featured";
  const brand = brands.find((item) => item.slug === brandSlug);
  const list = filterProducts(products, {
    brandId: brand?.id,
    format,
    sort,
  });

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-medium">Products</h1>
      <form className="mt-6 grid gap-3 md:grid-cols-3" method="get" action="/products">
        <label>
          <span className="mb-1 block text-sm text-mute">Brand</span>
          <select className="field" name="brand" defaultValue={brandSlug}>
            <option value="">All brands</option>
            {brands.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-sm text-mute">Format</span>
          <select className="field" name="format" defaultValue={format}>
            <option value="">All formats</option>
            <option value="spreadsheet">Spreadsheet</option>
            <option value="pdf">PDF</option>
            <option value="software">Software</option>
          </select>
        </label>
        <label>
          <span className="mb-1 block text-sm text-mute">Sort</span>
          <select className="field" name="sort" defaultValue={sort}>
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price">Price</option>
          </select>
        </label>
        <button className="btn md:col-span-3 md:w-fit" type="submit">
          Apply
        </button>
      </form>
      {list.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No products match.">
            <Link to="/products">Clear filters</Link>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-8">
          <ProductGrid products={list} />
        </div>
      )}
    </main>
  );
}
