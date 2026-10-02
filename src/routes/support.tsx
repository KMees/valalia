import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support — Valalia" },
      { name: "description", content: "Support for Valalia orders and files." },
    ],
  }),
});

function SupportPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-medium">Support</h1>
      <div className="mt-6 space-y-4">
        <p>Support is documentary. State the product name and the order number.</p>
        <p>A support address will be published when the shop is live. This prototype does not send mail.</p>
        <p>If a file is pending after an order, the order still exists. Request the file again from the order page when delivery is connected.</p>
        <p>
          <Link to="/account/orders">Orders in this browser</Link>
        </p>
      </div>
    </main>
  );
}
