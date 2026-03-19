export interface Product {
  productId: string | number;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
}

export interface ProductFormData {
  name: string;
  sku: string;
  price: string;
  stockQuantity: string;
}
