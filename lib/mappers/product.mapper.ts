import { BackendProduct, BackendSku } from "../api/product.service";
import { Product } from "@/types/shop/types";

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
  skus?: BackendSku[];
  defaultSku?: BackendSku;
  unit?: string;
  unitName?: string;
  attributes?: Record<string, string>;
  rawProduct?: any;
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

    const defaultSku = p.skus && p.skus.length > 0
      ? (p.skus.find((s) => s.type === "buy") || p.skus[0])
      : undefined;

    const rawUnit =
      (p as any).unitName ||
      (p as any).unit_name ||
      (p as any).unit ||
      (p as any).pricingUnit ||
      (p as any).priceUnit ||
      (p as any).uom ||
      p.attributes?.unitName ||
      p.attributes?.['Unit Name'] ||
      p.attributes?.['unit_name'] ||
      p.attributes?.unit ||
      p.attributes?.Unit ||
      p.attributes?.pricingUnit ||
      p.attributes?.uom ||
      (defaultSku as any)?.unitName ||
      (defaultSku as any)?.unit_name ||
      (defaultSku as any)?.unit ||
      defaultSku?.attributes?.unitName ||
      defaultSku?.attributes?.['Unit Name'] ||
      defaultSku?.attributes?.['unit_name'] ||
      defaultSku?.attributes?.unit ||
      defaultSku?.attributes?.Unit ||
      defaultSku?.attributes?.format ||
      defaultSku?.attributes?.Format;

    let unit: string | undefined = undefined;
    if (rawUnit) {
      const u = String(rawUnit).trim();
      const lower = u.toLowerCase();
      if (u === "-" || u === "--" || u === "—" || u === "–" || lower === "none" || lower === "n/a" || lower === "single" || lower === "single piece") {
        unit = undefined;
      } else if (lower === "dz" || lower === "dozen" || lower === "doz") {
        unit = "DZ";
      } else if (lower === "pac" || lower === "pack") {
        unit = "PAC";
      } else if (lower === "pc" || lower === "piece" || lower === "pcs") {
        unit = "PC";
      } else {
        unit = u.toUpperCase().replace(/^\/+\s*/, "");
      }
    } else {
      const title = p.title.toLowerCase();
      if (/\b(dz|dozen|doz)\b/.test(title)) unit = "DZ";
      else if (/\b(pac|pack)\b/.test(title)) unit = "PAC";
      else if (/\b(pc|pcs)\b/.test(title)) unit = "PC";
      else {
        const match = title.match(/\b(box|set|bundle|pkt|packet|carton|pair)\b/i);
        if (match) unit = match[1].toUpperCase();
      }
    }

    return {
      id: p.id,
      slug,
      name: p.title,
      price: Math.round(p.price || 0),
      compareAtPrice: p.compareAtPrice ? Math.round(p.compareAtPrice) : undefined,
      image,
      hoverImage,
      category: categoryName,
      tag: p.isFeatured ? "Featured" : null,
      skus: p.skus,
      defaultSku,
      unit,
      unitName: unit,
      attributes: p.attributes,
      rawProduct: p,
    };
  }

  static toDisplayProductList(products: BackendProduct[], categoryMap: Map<string, string>): DisplayProduct[] {
    return products.map((p) => this.toDisplayProduct(p, categoryMap));
  }

  static toDetailProduct(p: BackendProduct, categoryMap: Map<string, string>): Product {
    const slug = p.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const categoryName = p.category ? (categoryMap.get(p.category) || "General") : "General";

    // Dynamic extraction of attributes with sensible defaults
    const author = p.attributes?.author || p.attributes?.Author;
    const publisher = p.attributes?.publisher || p.attributes?.Publisher;
    const language = p.attributes?.language || p.attributes?.Language || "English";
    const pages = p.attributes?.pages ? parseInt(p.attributes.pages, 10) : undefined;
    const isbn = p.attributes?.isbn || p.attributes?.ISBN;
    
    // Brand can be author for books, or attributes.brand for other products
    const brand = author || p.attributes?.brand || p.attributes?.Brand || "Nord Living";

    const image = p.images?.[0] || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80";
    const hoverImage = p.images?.[1] || p.images?.[0] || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80";
    const gallery = p.images && p.images.length > 0 ? p.images : [image];

    // Formats and custom variant properties
    const formats = p.skus?.map((s) => s.attributes?.format || s.type).filter(Boolean) as string[] || [];
    const colors = p.skus?.map((s) => s.attributes?.color).filter(Boolean) as string[] || [];
    const materials = p.attributes?.materials || p.attributes?.Materials 
      ? (p.attributes.materials || p.attributes.Materials).split(",").map((s) => s.trim()) 
      : undefined;

    // Use default pricing from backend mapped price
    const price = Math.round(p.price || 0);
    const compareAtPrice = p.compareAtPrice ? Math.round(p.compareAtPrice) : undefined;

    const skus = p.skus?.map((s) => ({
      ...s,
      price: s.price !== undefined ? Math.round(s.price) : undefined,
      rentPricePerDay: s.rentPricePerDay !== undefined ? Math.round(s.rentPricePerDay) : undefined,
      securityDeposit: s.securityDeposit !== undefined ? Math.round(s.securityDeposit) : undefined,
    }));

    // Sum total stock from variants
    const stock = p.skus?.reduce((sum, s) => sum + s.stock, 0) ?? 0;

    return {
      id: p.id,
      skus,
      slug,
      name: p.title,
      price,
      compareAtPrice,
      image,
      hoverImage,
      gallery,
      tag: p.isFeatured ? "Featured" : null,
      category: categoryName,
      brand,
      sku: p.skus?.[0]?.sku || "SKU-CODE",
      stock,
      rating: p.attributes?.rating ? parseFloat(p.attributes.rating) : 4.8,
      reviews: p.attributes?.reviews ? parseInt(p.attributes.reviews, 10) : 128,
      shortDescription: p.description ? (p.description.substring(0, 160) + "...") : "A premium product.",
      description: p.description || "No description available.",
      materials,
      colors: colors.length > 0 ? colors : undefined,
      weight: p.attributes?.weight || p.attributes?.Weight,
      features: p.attributes?.features 
        ? p.attributes.features.split(",").map((s) => s.trim())
        : ["Premium build quality", "Secure transaction", "Manufacturer warranty"],
      shipping: {
        freeShipping: true,
        estimatedDelivery: "3-5 Business Days",
      },
      returnPolicy: "30-Day Returns",
      warranty: "1 Year Manufacturer Warranty",
      createdAt: p.createdAt,
      author,
      publisher,
      language,
      pages,
      isbn,
      formats: formats.length > 0 ? formats : undefined,
    };
  }
}
