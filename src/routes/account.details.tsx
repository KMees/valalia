import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/account/details")({
  component: DetailsPage,
  head: () => ({
    meta: [
      { title: "Details — Valalia" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function DetailsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm">
        <Link to="/account">Account</Link>
      </p>
      <h1 className="mt-3 text-4xl font-medium">Details</h1>
      <form className="mt-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
        <label className="block">
          <span className="mb-1 block">Email</span>
          <input className="field" type="email" name="email" disabled placeholder="Accounts are not open" />
        </label>
        <button className="btn" type="submit" disabled>
          Save
        </button>
      </form>
      <p className="mt-4 text-sm text-mute">The account provider is not connected. No profile is stored.</p>
    </main>
  );
}
