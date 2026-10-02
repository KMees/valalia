import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Valalia" },
      { name: "description", content: "Valalia holds the standard. The shops hold the niche." },
    ],
  }),
});

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-medium">About</h1>
      <div className="mt-6 space-y-4">
        <p>Valalia builds products.</p>
        <p>Valalia holds the standard: how a product is made, sold, delivered, and accounted for. The shops hold the niche.</p>
        <p>A product returns a result. It does not sell a course or a personality.</p>
        <p>Elvoria, Tallybench, Lotline, Kipround, Platen, Vitrine, and Pelage keep their names.</p>
      </div>
    </main>
  );
}
