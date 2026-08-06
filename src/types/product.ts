export interface Product {
  productId: string | number;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  category?: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  category?: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  price: string;
  stockQuantity: string;
  category?: string;
}

export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  price?: number;
  stockQuantity?: number;
  category?: string;
}

export type ProductDialogMode = 'create' | 'edit';
