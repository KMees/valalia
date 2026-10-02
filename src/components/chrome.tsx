import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Mark } from "@/components/mark";
import { cartCount, useCart } from "@/lib/commerce/cart";
import { useCartReady } from "@/lib/use-mounted";

const NAV = [
  { to: "/brands", label: "Shops" },
  { to: "/account", label: "Account" },
  { to: "/cart", label: "Cart" },
] as const;

export function SiteHeader() {
  const ready = useCartReady();
  const items = useCart((state) => state.items);
  const prune = useCart((state) => state.prune);
  const count = ready ? cartCount(items) : 0;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (ready) prune();
  }, [ready, prune, items]);

  function closeMenu() {
    dialogRef.current?.close();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-field">
      <div className="h-0.5 bg-measure" />
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <Link to="/" className="flex items-center gap-2 text-ink no-underline" aria-label="Valalia, home">
          <Mark />
          <span className="wordmark text-sm">VALALIA</span>
        </Link>
        <form action="/search" className="hidden min-w-0 flex-1 md:block">
          <label htmlFor="site-search" className="sr-only">
            Search products and shops
          </label>
          <input
            id="site-search"
            className="field"
            type="search"
            name="q"
            placeholder="Search products and shops"
          />
        </form>
        <nav className="ml-auto hidden items-center gap-5 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="inline-flex min-h-11 items-center text-ink no-underline hover:underline"
              aria-current={pathname === item.to ? "page" : undefined}
            >
              {item.label}
              {item.to === "/cart" ? <span className="ml-1 text-mute">({count})</span> : null}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <Link to="/search" className="inline-flex size-11 items-center justify-center text-ink" aria-label="Search">
            <Search className="size-5" aria-hidden="true" />
          </Link>
          <Link to="/cart" className="inline-flex min-h-11 items-center px-2 text-ink no-underline" aria-label={`Cart, ${count} items`}>
            Cart ({count})
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center"
            aria-label="Open menu"
            onClick={() => dialogRef.current?.showModal()}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <dialog ref={dialogRef} className="menu-dialog" aria-label="Menu" onClick={(event) => {
        if (event.target === dialogRef.current) closeMenu();
      }}>
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="wordmark text-sm">VALALIA</span>
          <button type="button" className="inline-flex size-11 items-center justify-center" aria-label="Close menu" onClick={closeMenu}>
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex flex-col px-3 py-2" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex min-h-11 items-center px-2 text-ink no-underline"
              onClick={closeMenu}
            >
              {item.label}
              {item.to === "/cart" ? ` (${count})` : ""}
            </Link>
          ))}
          <Link to="/products" className="flex min-h-11 items-center px-2 text-ink no-underline" onClick={closeMenu}>
            Products
          </Link>
          <Link to="/about" className="flex min-h-11 items-center px-2 text-ink no-underline" onClick={closeMenu}>
            About
          </Link>
        </nav>
      </dialog>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="wordmark text-sm">VALALIA</p>
          <p className="mt-3 max-w-sm text-mute">Valalia builds products. The shops keep their names.</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          <Link to="/about" className="text-measure">About</Link>
          <Link to="/support" className="text-measure">Support</Link>
          <Link to="/legal" className="text-measure">Legal</Link>
          <Link to="/privacy" className="text-measure">Privacy</Link>
          <Link to="/terms" className="text-measure">Terms</Link>
        </nav>
      </div>
      <p className="border-t border-line px-5 py-4 text-center text-sm text-mute">
        Prototype. No payment is processed.
      </p>
    </footer>
  );
}
