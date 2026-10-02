import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { filterProducts, getProductBySlug, productsForBrand } from "./query.ts";
import type { Brand, Product } from "./types.ts";
import { validateCatalog } from "./validate.ts";

const brands = JSON.parse(readFileSync(new URL("../../../content/brands.json", import.meta.url), "utf8")) as Brand[];
const products = JSON.parse(readFileSync(new URL("../../../content/products.json", import.meta.url), "utf8")) as Product[];

test("sample catalog is valid and Elvoria is fully represented", () => {
  assert.deepEqual(validateCatalog(brands, products), []);
  const elvoria = brands.find((brand) => brand.slug === "elvoria");
  assert.ok(elvoria);
  const elvoriaProducts = productsForBrand(products, elvoria.id);
  assert.equal(elvoriaProducts.length, 12);
  assert.equal(elvoriaProducts.filter((product) => product.status === "active").length, 12);
  assert.equal(brands.length, 7);
});

test("a second brand and a second product can be added as records", () => {
  const extraBrand: Brand = {
    id: "northline",
    name: "Northline",
    slug: "northline",
    promise: "Field survey sheets",
    description: "A record added without a new page.",
    audience: "A surveyor.",
    niche: "Survey",
    colors: { paper: "#F4F7F8", ink: "#1B2830", accent: "#3E6B78", line: "#D5DEE2" },
    typography: {
      display: "\"Outfit\", sans-serif",
      text: "\"Outfit\", sans-serif",
      googleHref: "https://fonts.googleapis.com/css2?family=Outfit&display=swap",
    },
    logo: { monogram: "NL" },
    status: "active",
  };
  const extraProduct: Product = {
    id: "nor-001",
    slug: "station-log",
    brandId: "northline",
    title: "Station Log",
    summary: "A second product record.",
    description: "Added in data.",
    buyerProvides: "Station notes.",
    returns: "A log.",
    features: ["One job"],
    price: 1000,
    currency: "USD",
    format: "pdf",
    images: [],
    files: [{ key: "private/northline/nor-001/log.pdf", filename: "log.pdf", contentType: "application/pdf" }],
    license: "Personal use.",
    tags: ["survey"],
    status: "active",
    featured: false,
    createdAt: "2026-10-02",
  };
  const nextBrands = [...brands, extraBrand];
  const nextProducts = [...products, extraProduct];
  assert.deepEqual(validateCatalog(nextBrands, nextProducts), []);
  assert.equal(productsForBrand(nextProducts, "northline")[0]?.title, "Station Log");
});

test("a parent color cannot be used as a store accent", () => {
  const broken = structuredClone(brands);
  broken[0].colors.accent = "#1E3A34";
  const problems = validateCatalog(broken, products);
  assert.ok(problems.some((problem) => problem.includes("parent color")));
});

test("missing product and broken public file URLs are rejected or absent", () => {
  assert.equal(getProductBySlug(products, "not-a-product"), undefined);
  const withUrl = structuredClone(products);
  withUrl[0].files[0].key = "https://example.com/file.xlsx";
  const problems = validateCatalog(brands, withUrl);
  assert.ok(problems.some((problem) => problem.includes("public URL")));
});

test("preview products stay out of a sale filter", () => {
  const sale = filterProducts(products, { format: "spreadsheet", sort: "price" }).filter(
    (product) => product.status === "active",
  );
  assert.ok(sale.every((product) => product.status === "active"));
  assert.ok(products.some((product) => product.status === "preview"));
});
