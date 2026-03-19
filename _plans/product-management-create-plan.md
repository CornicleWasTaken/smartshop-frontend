# Plan: Product Management System with Create Dialog

## Context

This plan implements a Product Management System feature for the ishop-frontend React application. The feature provides an admin interface to view products in a data table and create new products via a dialog form. The system integrates with a backend service running at `localhost:8087`.

**Problem:** The application currently has no product management capabilities. Admin users need a way to browse existing products and add new ones to the inventory.

**Solution:** Build a Product Management page with a modern data table displaying products and a dialog form for creating new products with validation and backend integration.

## Technical Stack

| Category | Choice | Justification |
|----------|--------|---------------|
| UI Library | **Material-UI (MUI) v7** | Full React 19 support, ready-to-use Table, Dialog, TextField, Button components, comprehensive TypeScript definitions |
| HTTP Client | **Fetch API** | Native browser support, no additional bundle size, sufficient for simple CRUD operations |
| Form Management | **react-hook-form** | Performance (minimal re-renders), easy validation integration |
| Validation | **Zod** | TypeScript-first schema validation, excellent error messages |
| Testing | **Vitest + React Testing Library** | Vite-native test runner, familiar API for React component testing |

## NPM Packages to Install

### Core Dependencies
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react-hook-form @hookform/resolvers zod
```

### Dev Dependencies
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## Folder Structure

```
src/
├── components/
│   ├── ProductManagement/
│   │   ├── ProductManagement.tsx      # Main container component
│   │   ├── useProductManagement.ts    # Hook for products state and API
│   │   └── ProductManagement.css
│   ├── ProductTable/
│   │   ├── ProductTable.tsx           # Data table with Create button
│   │   └── ProductTable.css
│   ├── ProductDialog/
│   │   ├── ProductDialog.tsx          # Dialog wrapper
│   │   └── ProductDialog.css
│   └── ProductForm/
│       ├── ProductForm.tsx            # Form with validation
│       ├── useProductForm.ts          # Hook for form state/validation
│       └── ProductForm.css
├── services/
│   └── productApi.ts                  # API service functions
├── types/
│   └── product.ts                     # TypeScript interfaces
├── tests/
│   ├── setup.ts                       # Test configuration
│   ├── components/
│   │   ├── ProductTable.test.tsx
│   │   ├── ProductForm.test.tsx
│   │   └── ProductDialog.test.tsx
│   └── services/
│       └── productApi.test.ts
├── App.tsx
└── main.tsx
```

## Implementation Details

### 1. Type Definitions (src/types/product.ts)

```typescript
export interface Product {
  id: string | number;
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
```

### 2. API Service (src/services/productApi.ts)

**Key Functions:**
- `fetchProducts(): Promise<Product[]>` - GET /api/products
- `createProduct(product: CreateProductRequest): Promise<Product>` - POST /api/products

**Error Handling:** Custom ApiError class with status code and response data for user-friendly error messages.

### 3. Component Architecture

**ProductManagement (Container)**
- Manages `products` state
- Manages `isDialogOpen` state
- Handles `loadProducts()` on mount
- Handles `handleCreateProduct()` with table refresh

**ProductTable (Presentational)**
- Receives `products`, `isLoading`, `onCreateClick` props
- "Create New Product" button positioned top-right
- Displays products in MUI Table

**ProductDialog (Presentational)**
- Receives `isOpen`, `onClose`, `onSubmit` props
- MUI Dialog component with form content

**ProductForm (Presentational)**
- Uses `useProductForm` hook for state management
- Controlled inputs with real-time validation
- Validates: required fields, positive price, non-negative stock
- Logs submitted values to console
- Calls `onSubmit` prop on valid submission

### 4. Form Validation Rules

| Field | Validation |
|-------|------------|
| name | Required, non-empty string |
| sku | Required, non-empty string |
| price | Required, positive number |
| stockQuantity | Required, non-negative integer |

### 5. Configuration Changes

**vite.config.ts** - Add proxy for API calls:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8087',
      changeOrigin: true,
    },
  },
},
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/tests/setup.ts',
}
```

**src/tests/setup.ts** - Test setup:
```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
afterEach(() => cleanup());
```

## Critical Files to Modify

1. **package.json** - Add MUI, react-hook-form, Zod, and testing dependencies
2. **vite.config.ts** - Add proxy configuration and Vitest test settings
3. **src/types/product.ts** - Create TypeScript interfaces
4. **src/services/productApi.ts** - Implement fetchProducts and createProduct
5. **src/components/ProductManagement/** - Main container with state management
6. **src/components/ProductTable/ProductTable.tsx** - Table with Create button (top-right)
7. **src/components/ProductDialog/ProductDialog.tsx** - Dialog wrapper
8. **src/components/ProductForm/** - Form with validation and submission logic
9. **src/App.tsx** - Replace default content with ProductManagement component
10. **src/tests/** - Test files for components and services

## Verification Steps

1. **Install dependencies:** Run `npm install` after updating package.json
2. **Start dev server:** Run `npm run dev` and verify no build errors
3. **Test table display:** Verify products load from backend (ensure localhost:8087 is running)
4. **Test dialog:** Click "Create New Product" button, verify dialog opens
5. **Test form validation:** Submit empty form, verify validation errors display
6. **Test submission:** Fill valid data, submit, verify console log and table refresh
7. **Test error handling:** Stop backend, submit form, verify error message displays
8. **Run tests:** Execute `npm test` to verify all tests pass

## Edge Cases Handled

- Backend unavailable (network error handling)
- Empty required fields (form validation)
- Negative price/stock values (numeric validation)
- User closes dialog without saving (dialog state management)
- Duplicate SKU (API error propagation)
- Network timeout (fetch timeout handling)

## Open Questions from Spec

The following questions were noted in the spec but are not blockers for implementation:
- Authentication/authorization requirements
- Whether dialog should support editing existing products
- Expected response format from backend
- Confirmation message after successful creation
- Specific SKU format validation rules

**Assumptions made:**
- No authentication required for MVP
- Dialog is create-only (edit can be added later)
- Backend returns created Product object on POST
- Success indicated by dialog close and table refresh
- SKU format is free-form string
