// Sale status enum (matches backend SaleStatus.java)
export type SaleStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

// Sale item for API response
export interface SaleItem {
  saleItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

// Full sale object (API response)
export interface Sale {
  saleId: number;
  saleDate: string; // ISO 8601 from backend
  totalAmount: number;
  customerPhone: string | null;
  status: SaleStatus;
  items: SaleItem[];
}

// Request payload for creating a sale
export interface CreateSaleRequest {
  customerPhone?: string;
  items: SaleItemRequest[];
}

export interface SaleItemRequest {
  productId: number;
  quantity: number;
}

// Form data type (strings for input binding)
export interface SaleFormData {
  customerPhone: string;
  items: SaleFormItemFormData[];
}

export interface SaleFormItemFormData {
  productId: string;
  quantity: string;
}

// For product dropdown in sale form
export interface ProductOption {
  productId: number;
  name: string;
  price: number;
  stockQuantity: number;
}

export type SaleDialogMode = 'create' | 'view-details' | 'download-options';
