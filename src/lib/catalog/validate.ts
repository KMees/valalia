import type { Brand, Product } from "./types";

/** Parent palette. A store accent must not reuse these. */
export const PARENT_PALETTE = new Set([
  "#F7F6F3",
  "#1A1C1B",
  "#1E3A34",
  "#D8D4CC",
  "#6B6560",
]);

const HEX = /^#[0-9A-F]{6}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function hex(value: string): string {
  return value.trim().toUpperCase();
}

export function validateBrand(brand: Brand, index: number): string[] {
  const problems: string[] = [];
  const at = `brand[${index}] (${brand?.slug ?? "?"})`;
  if (!brand?.id) problems.push(`${at}: id is required`);
  if (!brand?.name) problems.push(`${at}: name is required`);
  if (!brand?.slug || !SLUG.test(brand.slug)) problems.push(`${at}: slug is required`);
  if (!brand?.promise) problems.push(`${at}: promise is required`);
  if (!brand?.description) problems.push(`${at}: description is required`);
  if (!brand?.audience) problems.push(`${at}: audience is required`);
  if (!brand?.niche) problems.push(`${at}: niche is required`);
  if (!brand?.logo?.monogram) problems.push(`${at}: logo.monogram is required`);
  if (brand?.status !== "active") problems.push(`${at}: status must be active`);
  const accent = brand?.colors?.accent ? hex(brand.colors.accent) : "";
  for (const key of ["paper", "ink", "accent", "line"] as const) {
    const value = brand?.colors?.[key] ? hex(brand.colors[key]) : "";
    if (!HEX.test(value)) problems.push(`${at}: colors.${key} must be a hex color`);
  }
  if (accent && PARENT_PALETTE.has(accent)) {
    problems.push(`${at}: accent ${accent} is a parent color`);
  }
  if (!brand?.typography?.display || !brand?.typography?.text) {
    problems.push(`${at}: typography is required`);
  }
  return problems;
}

export function validateProduct(product: Product, index: number, brandIds: Set<string>): string[] {
  const problems: string[] = [];
  const at = `product[${index}] (${product?.slug ?? "?"})`;
  if (!product?.id) problems.push(`${at}: id is required`);
  if (!product?.slug || !SLUG.test(product.slug)) problems.push(`${at}: slug is required`);
  if (!product?.brandId || !brandIds.has(product.brandId)) {
    problems.push(`${at}: brandId must match a brand`);
  }
  if (!product?.title) problems.push(`${at}: title is required`);
  if (!product?.summary) problems.push(`${at}: summary is required`);
  if (!product?.description) problems.push(`${at}: description is required`);
  if (!product?.license) problems.push(`${at}: license is required`);
  if (product?.currency !== "USD") problems.push(`${at}: currency must be USD`);
  if (!Number.isInteger(product?.price) || product.price < 0) {
    problems.push(`${at}: price must be integer cents`);
  }
  if (!["spreadsheet", "pdf", "software"].includes(product?.format)) {
    problems.push(`${at}: format is invalid`);
  }
  if (product?.status !== "active" && product?.status !== "preview") {
    problems.push(`${at}: status must be active or preview`);
  }
  if (product?.status === "active" && (!product.files || product.files.length === 0)) {
    problems.push(`${at}: an active product needs a file reference`);
  }
  for (const file of product?.files ?? []) {
    if (!file.key || !file.filename || !file.contentType) {
      problems.push(`${at}: each file needs key, filename, and contentType`);
    }
    if (/^https?:/i.test(file.key)) {
      problems.push(`${at}: file key must not be a public URL`);
    }
  }
  return problems;
}

export function validateCatalog(brands: Brand[], products: Product[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const [index, brand] of brands.entries()) {
    problems.push(...validateBrand(brand, index));
    if (ids.has(brand.id)) problems.push(`duplicate brand id ${brand.id}`);
    if (slugs.has(brand.slug)) problems.push(`duplicate brand slug ${brand.slug}`);
    ids.add(brand.id);
    slugs.add(brand.slug);
  }
  const productSlugs = new Set<string>();
  const productIds = new Set<string>();
  for (const [index, product] of products.entries()) {
    problems.push(...validateProduct(product, index, ids));
    if (productIds.has(product.id)) problems.push(`duplicate product id ${product.id}`);
    if (productSlugs.has(product.slug)) problems.push(`duplicate product slug ${product.slug}`);
    productIds.add(product.id);
    productSlugs.add(product.slug);
  }
  return problems;
}
