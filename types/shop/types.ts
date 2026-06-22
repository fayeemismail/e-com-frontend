import type { BackendSku } from "@/lib/api/product.service";

export type SortOption = "featured" | "name-asc" | "name-desc";

export type Product = {
  id: string | number;
  skus?: BackendSku[];
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
  "name-asc": "Alphabetical: A–Z",
  "name-desc": "Alphabetical: Z–A",
};

export function parsePrice(p: string) {
  return parseFloat(p.replace(/[$,]/g, ""));
}