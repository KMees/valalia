import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/account/")({
  component: AccountHome,
  head: () => ({
    meta: [
      { title: "Account — Valalia" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AccountHome() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-medium">Account</h1>
      <p className="mt-4 border border-line px-4 py-4">
        Accounts are not open. A later session will hold email, orders, and downloads. This prototype keeps orders in the browser only.
      </p>
      <nav className="mt-8 flex flex-col gap-3" aria-label="Account">
        <Link to="/account/orders" className="min-h-11">Orders</Link>
        <Link to="/account/downloads" className="min-h-11">Downloads</Link>
        <Link to="/account/details" className="min-h-11">Details</Link>
      </nav>
    </main>
  );
}
