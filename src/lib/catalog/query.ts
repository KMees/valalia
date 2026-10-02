import type { Brand, Product, ProductFormat } from "./types";

export type ProductSort = "featured" | "newest" | "price";

export function getBrandBySlug(brands: Brand[], slug: string): Brand | undefined {
  return brands.find((brand) => brand.slug === slug);
}

export function getBrandById(brands: Brand[], id: string): Brand | undefined {
  return brands.find((brand) => brand.id === id);
}

export function getProductBySlug(products: Product[], slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(products: Product[], id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function productsForBrand(products: Product[], brandId: string): Product[] {
  return products
    .filter((product) => product.brandId === brandId)
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.title.localeCompare(b.title));
}

export function activeProducts(products: Product[]): Product[] {
  return products.filter((product) => product.status === "active");
}

export function countForBrand(products: Product[], brandId: string): number {
  return products.filter((product) => product.brandId === brandId).length;
}

export function nichesOf(brands: Brand[]): string[] {
  return [...new Set(brands.map((brand) => brand.niche))];
}

export function filterBrands(brands: Brand[], niche: string): Brand[] {
  if (!niche) return brands;
  return brands.filter((brand) => brand.niche === niche);
}

export function filterProducts(
  products: Product[],
  input: { brandId?: string; format?: ProductFormat | ""; sort?: ProductSort; query?: string },
): Product[] {
  const query = input.query?.trim().toLowerCase() ?? "";
  let list = products.filter((product) => {
    if (input.brandId && product.brandId !== input.brandId) return false;
    if (input.format && product.format !== input.format) return false;
    if (!query) return true;
    const hay = [product.title, product.summary, product.description, product.tags.join(" ")]
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  });
  const sort = input.sort ?? "featured";
  list = list.slice().sort((a, b) => {
    if (sort === "price") return a.price - b.price || a.title.localeCompare(b.title);
    if (sort === "newest") return b.createdAt.localeCompare(a.createdAt) || a.title.localeCompare(b.title);
    const featured = Number(b.featured) - Number(a.featured);
    if (featured !== 0) return featured;
    return a.title.localeCompare(b.title);
  });
  return list;
}

export function searchBrands(brands: Brand[], query: string): Brand[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return brands.filter((brand) =>
    [brand.name, brand.promise, brand.description, brand.audience, brand.niche]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}
