import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/legal")({
  component: LegalPage,
  head: () => ({
    meta: [
      { title: "Legal — Valalia" },
      { name: "description", content: "Legal notes for the Valalia prototype." },
    ],
  }),
});

function LegalPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-medium">Legal</h1>
      <div className="mt-6 space-y-4">
        <p>The legal entity name will be added when it exists. It is not invented here.</p>
        <p>Files do arithmetic or print a form. They are not financial, tax, legal, or business advice.</p>
        <p>
          <Link to="/privacy">Privacy</Link>
          {" · "}
          <Link to="/terms">Terms</Link>
        </p>
      </div>
    </main>
  );
}
