import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandDoor, ProductGrid } from "@/components/catalog-ui";
import { brands, products } from "@/lib/catalog/data";
import { countForBrand, filterProducts } from "@/lib/catalog/query";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const featured = filterProducts(products, { sort: "featured" }).filter((product) => product.featured);

  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="mb-6 h-1 w-12 bg-measure" />
        <h1 className="max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">Valalia builds products.</h1>
        <p className="mt-5 max-w-xl text-lg text-mute">Specialist instruments for independent work.</p>
        <form action="/search" className="mt-8 max-w-xl">
          <label htmlFor="home-search" className="sr-only">
            Search products and shops
          </label>
          <input id="home-search" className="field" type="search" name="q" placeholder="Search products and shops" />
        </form>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/products" className="btn">
            Browse products
          </Link>
          <a className="btn btn-secondary" href="#shops">
            The shops
          </a>
        </div>
      </section>

      <section id="shops" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-6">
        <h2 className="text-sm tracking-widest text-mute">Shops</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <li key={brand.id}>
              <BrandDoor brand={brand} count={countForBrand(products, brand.id)} />
            </li>
          ))}
        </ul>
      </section>

      <section id="featured" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-sm tracking-widest text-mute">Featured</h2>
          <Link to="/products">All products</Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <ul className="grid gap-8 border-t border-line pt-8 md:grid-cols-3">
          <li>
            <p className="font-medium">One job. One result.</p>
            <p className="mt-2 text-mute">Each file does a single piece of work.</p>
          </li>
          <li>
            <p className="font-medium">One standard.</p>
            <p className="mt-2 text-mute">Every shop is catalogued the same way.</p>
          </li>
          <li>
            <p className="font-medium">Checkout stays here.</p>
            <p className="mt-2 text-mute">Payment is a separate provider. This prototype does not charge a card.</p>
          </li>
        </ul>
      </section>
    </main>
  );
}
