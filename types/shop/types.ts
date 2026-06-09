export type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

export type Product = {
  id: number;
  slug: string;
  name: string;

  price: number;
  compareAtPrice?: number;

  image: string;
  hoverImage: string;
  gallery: string[];

  tag: string | null;

  category: string;
  brand: string;
  sku: string;

  stock: number;

  rating: number;
  reviews: number;

  shortDescription: string;
  description: string;

  materials?: string[];
  colors?: string[];

  dimensions?: {
    width: string;
    depth: string;
    height: string;
    seatHeight?: string;
  };

  weight?: string;

  features?: string[];

  shipping: {
    freeShipping: boolean;
    estimatedDelivery: string;
  };

  returnPolicy: string;
  warranty: string;
  createdAt: string;

  author?: string;
  publisher?: string;
  language?: string;
  pages?: number;
  isbn?: string;
  formats?: string[];
};

export const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A–Z",
};

export const ALL_TAGS = ["New", "Bestseller", "Popular", "Sale"];

export function parsePrice(p: string) {
  return parseFloat(p.replace(/[$,]/g, ""));
}