export type BrandStatus = "active";
export type ProductStatus = "active" | "preview";
export type ProductFormat = "spreadsheet" | "pdf" | "software";
export type Currency = "USD";

export type BrandColors = {
  paper: string;
  ink: string;
  accent: string;
  line: string;
};

export type BrandTypography = {
  display: string;
  text: string;
  /** Google Fonts CSS2 href. Loaded on that brand's pages only. */
  googleHref: string;
};

export type BrandLogo = {
  monogram: string;
  /** Public shop mark. A logo file, not a product file. */
  src?: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  promise: string;
  description: string;
  audience: string;
  niche: string;
  colors: BrandColors;
  typography: BrandTypography;
  logo: BrandLogo;
  status: BrandStatus;
};

export type ProductFile = {
  /** Private storage key. Not a public URL. */
  key: string;
  filename: string;
  contentType: string;
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  brandId: string;
  title: string;
  summary: string;
  description: string;
  buyerProvides: string;
  returns: string;
  features: string[];
  /** Integer cents. Omitted from the UI when status is preview. */
  price: number;
  currency: Currency;
  format: ProductFormat;
  images: ProductImage[];
  files: ProductFile[];
  license: string;
  tags: string[];
  status: ProductStatus;
  featured: boolean;
  createdAt: string;
};

export type Catalog = {
  brands: Brand[];
  products: Product[];
};
