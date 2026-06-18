import { apiClient } from "./api-client";

export interface BackendSku {
  sku: string;
  productId: string;
  type: "buy" | "rent";
  price?: number;
  rentPricePerDay?: number;
  securityDeposit?: number;
  stock: number;
  images?: string[];
  attributes: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface BackendProduct {
  id: string;
  title: string;
  description?: string;
  images?: string[];
  attributes: Record<string, string>;
  category?: string | null;
  isActive: boolean;
  isFeatured?: boolean;
  price?: number;
  compareAtPrice?: number;
  skus?: BackendSku[];
  createdAt: string;
  updatedAt: string;
}

export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  childId?: string[];
  isActive: boolean;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: BackendProduct[];
  total: number;
  page: number;
  limit: number;
}

export const productService = {
  getFeaturedProducts: async (limit = 8): Promise<BackendProduct[]> => {
    const data = await apiClient.get<ProductsResponse>(
      `/products?isFeatured=true&limit=${limit}`
    );
    return data.products;
  },

  getProducts: async (options: {
    page: number;
    limit: number;
    categoryId?: string | null;
    sort?: string;
  }): Promise<ProductsResponse> => {
    let url = `/products?page=${options.page}&limit=${options.limit}`;
    if (options.categoryId)   url += `&categoryId=${options.categoryId}`;
    if (options.sort) url += `&sort=${options.sort}`;

    return apiClient.get<ProductsResponse>(url);
  },

  getCategories: async (): Promise<BackendCategory[]> => {
    return apiClient.get<BackendCategory[]>(
      "/categories"
    );
  },
};
