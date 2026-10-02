import { createFileRoute, Link, notFound, Outlet } from "@tanstack/react-router";
import { getBrand } from "@/lib/catalog/data";

export const Route = createFileRoute("/brands/$slug")({
  loader: ({ params }) => {
    const brand = getBrand(params.slug);
    if (!brand) throw notFound();
    return { brand };
  },
  notFoundComponent: MissingBrand,
  component: () => <Outlet />,
});

function MissingBrand() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="text-3xl font-medium">This brand is not in the house.</h1>
      <p className="mt-6">
        <Link to="/brands">Brands</Link>
      </p>
    </main>
  );
}
