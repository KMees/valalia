import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy — Valalia" },
      { name: "description", content: "How the Valalia prototype stores a cart and an order." },
    ],
  }),
});

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-medium">Privacy</h1>
      <div className="mt-6 space-y-4">
        <p>The cart stays in this browser until you clear it or record a prototype order.</p>
        <p>A prototype order stores the email you typed, the product names, and a prototype payment reference in this browser. It is not an account. It is not sent to a server.</p>
        <p>When accounts open, the identifier will be the account email. Card data stays with the payment provider. Valalia does not store the card.</p>
        <p>The list is not sold.</p>
        <p>File references are private keys. A signed link, when delivery is connected, will expire.</p>
      </div>
    </main>
  );
}
