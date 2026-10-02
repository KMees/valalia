import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms — Valalia" },
      { name: "description", content: "Terms for the Valalia prototype." },
    ],
  }),
});

function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-medium">Terms</h1>
      <div className="mt-6 space-y-4">
        <p>This site is a prototype. Recording an order does not create a sale and does not deliver a file.</p>
        <p>A license, when a product is sold, is personal. The buyer keeps their copy. The file is not for resale.</p>
        <p>Prices shown on active products are sample catalog prices for this prototype.</p>
        <p>Preview products are not for sale.</p>
      </div>
    </main>
  );
}
