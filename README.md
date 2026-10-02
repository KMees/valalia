# Valalia

Prototype `prototype-v0.1.0`. The house and its owned commerce platform.

Valalia (va-LAH-lee-ah) builds products. The shops keep their names: Elvoria, Tallybench, Lotline, Kipround, Platen, Vitrine, Pelage.

This is not a live shop. Checkout does not charge a card. Delivery does not release a file. Accounts are not open.

The approved brand guide is the visual and voice source. The commerce specification is the information architecture. The dark, gold study inside that specification was not built.

## Architecture

Content, brand configuration, and UI are separate.

```
content/brands.json       brand records
content/products.json     product records
src/lib/catalog/          load, validate, query
src/lib/commerce/         cart, orders, payment seam, delivery seam
src/components/           chrome and catalog UI. No product copy.
src/routes/               one template per surface, not per SKU
public/brand/             approved logo files (mark, wordmark, lockup, favicon, app icon)
```

The header mark is `public/brand/valalia-mark.svg`. The favicon is the approved `valalia-favicon.svg`.

A page reads a record. It does not contain a product name.

Adding a brand is a record in `content/brands.json`:

- id, name, slug, description, audience, promise, niche
- colors (paper, ink, accent, line). Accent must not be Field `#F7F6F3`, Ink `#1A1C1B`, Measure `#1E3A34`, Line `#D8D4CC`, or Mute `#6B6560`
- typography and a Google Fonts stylesheet URL
- logo monogram
- status

Adding a product is a record in `content/products.json`:

- id, slug, brandId, title, description, summary
- price (integer cents), currency
- images (`src`, `alt`). A missing or broken image falls back to a generated cover
- features, buyerProvides, returns
- files: `key`, `filename`, `contentType`. The key is a private reference, never a public URL
- license, format (`spreadsheet`, `pdf`, `software`), tags, status (`active` or `preview`), featured

An `active` product must name at least one file. A `preview` product can omit files and cannot be added to the cart.

Parent chrome stays Field, Ink, and Measure. A store color is used on that store's door, badge edge, and product cover. Store type is applied on the brand page and the product article.

### Payment

`src/lib/commerce/payment.ts` is the only payment seam.

- `VITE_PAYMENT_PROVIDER=mock` records a prototype order. No card field. No charge.
- `VITE_PAYMENT_PROVIDER=closed` keeps the checkout route and pauses payment. The cart stays.

A live processor should implement `createCheckout` and a server event handler in this module. Pages must not import a provider SDK.

### Delivery

`src/lib/commerce/delivery.ts` is the only delivery seam. `sign(fileKey, filename, orderId)` returns a short-lived prototype locator (`delivery://…`). It does not point at a file. A live provider should sign a private object URL behind the same function, and only after a paid event.

### Accounts and orders

Account, order, and download routes exist. Sign-in is not connected. Prototype orders stay in the browser (`localStorage`) so the confirmation and download states can be reviewed. They are not a customer account.

### Analytics

`track()` records `view_brand`, `view_product`, `search`, `add_to_cart`, `begin_checkout`, `payment_redirect`, `purchase`, `download`, and `download_failed`. The default sink is in-memory on `window.__valaliaEvents`. Set `VITE_ANALYTICS_SINK=console` to print them. No card data. No file URLs.

## Setup

Requirements: Node 22.

```sh
npm install
npm run dev
```

The dev server listens on port 8080.

```sh
npm run typecheck
npm run build
node --experimental-strip-types --test src/lib/catalog/catalog.test.ts src/lib/commerce/commerce.test.ts
```

## Environment variables

Copy `.env.example` only if you need to override a default. Do not commit a `.env`. Do not commit payment, storage, or mail secrets.

| Variable | Default | Meaning |
| --- | --- | --- |
| `VITE_SITE_URL` | empty | Public origin for canonical URLs. No trailing slash. |
| `VITE_PAYMENT_PROVIDER` | `mock` | `mock` or `closed`. |
| `VITE_DELIVERY_PROVIDER` | `mock` | Prototype signing only. |
| `VITE_ANALYTICS_SINK` | silent | `console` to print events. |

Only `VITE_` variables reach the browser. Live provider secrets belong on the host, behind the payment and delivery modules, when a human opens that gate.

## Sample data

Elvoria has the twelve production titles as active records, with sample prices. The other six brands each have one preview instrument. Preview items show “Not for sale yet.”

Prices are sample catalog prices. They are not a live price list.

## Routes

| Path | Role |
| --- | --- |
| `/` | House |
| `/brands`, `/brands/{slug}`, `/brands/{slug}/products` | Doors and storefronts |
| `/products`, `/products/{slug}` | Catalog and product |
| `/search` | Products and brands |
| `/cart` | Browser cart. Quantity is 1 |
| `/checkout`, `/checkout/confirmation/{order}` | Prototype checkout |
| `/account`, `/account/orders`, `/account/downloads`, `/account/details` | Closed account, local orders |
| `/about`, `/support`, `/legal`, `/privacy`, `/terms` | House pages |

Unknown brands and products return a not-found state with a link back to the brands.

## QA checklist

- [ ] Home shows the house line, seven doors, and featured Elvoria products
- [ ] Parent bar stays Measure. Store accents stay on doors and covers
- [ ] `/brands/elvoria` lists twelve instruments and does not list other shops
- [ ] `/brands/tallybench` renders from the same template and says the catalog is not open
- [ ] A product page is one route, filled from the record
- [ ] Add to cart, cart count, remove, empty cart
- [ ] Checkout email validation, failed-payment state (cart kept), prototype order
- [ ] Confirmation shows the order and a signed locator that is not a file
- [ ] “Files pending” state links to support
- [ ] Account routes say accounts are not open
- [ ] Search with no match, and a cleared search
- [ ] `/products/missing-product` and `/brands/missing-brand`
- [ ] Paycheck Calendar uses a missing image and still shows a cover
- [ ] Mobile width does not overflow. Tap targets are at least 44px
- [ ] Focus is visible. Buttons have names

## Known limitations

- Not production. No legal entity, no domain checkout, no tax, no real payment, no private storage, no email.
- The short website-spec paths (`/elvoria` and the rest) are not the routes. This prototype uses `/brands/{slug}` from the commerce information architecture. Categories and collections are not routes.
- Orders and the cart live in one browser. A new device does not see them.
- Sample prices are not the shop’s live prices.
- Elvoria descriptions are shortened from the production listings. They are not the full listing copy.
- Preview brands do not yet attach production files.
- No customer accounts, no refunds, no analytics vendor.
- `format: software` is accepted by the record and has no sample product yet.
- Signed locators expire on a timestamp and are not checked by a server. They are not downloads.
- The header used a redrawn mark until `prototype-v0.1.0`. It now uses the approved file.

## Next steps

1. Register the domain when the name is purchased.
2. Replace `payment.ts` with a processor or merchant of record. Keep card data off this app.
3. Put files in private storage and implement `delivery.ts` to sign expiring URLs after a paid event.
4. Open accounts only when orders must persist across devices. Scope every order to that account.
5. Replace sample prices with the approved price list.
6. Attach the other six shops’ files and switch those products from `preview` to `active`.
