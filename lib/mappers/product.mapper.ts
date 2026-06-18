import { BackendProduct } from "../api/product.service";

export interface DisplayProduct {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  hoverImage: string;
  category: string;
  tag: string | null;
}

export class ProductViewMapper {
  static toDisplayProduct(p: BackendProduct, categoryMap: Map<string, string>): DisplayProduct {
    const slug = p.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const image = p.images?.[0] || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80";
    const hoverImage = p.images?.[1] || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80";
    const categoryName = p.category ? (categoryMap.get(p.category) || "General") : "General";

    return {
      id: p.id,
      slug,
      name: p.title,
      price: p.price || 0,
      compareAtPrice: p.compareAtPrice,
      image,
      hoverImage,
      category: categoryName,
      tag: p.isFeatured ? "Featured" : null,
    };
  }

  static toDisplayProductList(products: BackendProduct[], categoryMap: Map<string, string>): DisplayProduct[] {
    return products.map((p) => this.toDisplayProduct(p, categoryMap));
  }
}
