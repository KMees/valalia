import brandsJson from "../../../content/brands.json";
import productsJson from "../../../content/products.json";
import { validateCatalog } from "./validate";
import type { Brand, Product } from "./types";

export const brands = brandsJson as Brand[];
export const products = productsJson as Product[];

const problems = validateCatalog(brands, products);
if (problems.length > 0) {
  throw new Error(`Catalog invalid:\n${problems.join("\n")}`);
}

export function getBrand(slug: string): Brand | undefined {
  return brands.find((brand) => brand.slug === slug);
}

export function getBrandById(id: string): Brand | undefined {
  return brands.find((brand) => brand.id === id);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
