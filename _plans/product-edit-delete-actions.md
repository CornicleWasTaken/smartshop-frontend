---
name: Product Edit and Delete Actions Implementation Plan
description: Step-by-step plan to implement edit and delete actions for product table
branch: claude/feature/product-edit-delete-actions
---

# Plan: Product Edit and Delete Actions

## Overview
Implement inline edit and delete actions for product table rows, refactor the create button to a floating + icon, and add update/delete API functionality.

## Phase 1: API Layer Updates

### 1.1 Add Update and Delete API Functions
**File:** `src/services/productApi.ts`

- Add `UpdateProductRequest` type (similar to `CreateProductRequest` but all fields optional)
- Add `updateProduct(productId: string | number, product: UpdateProductRequest): Promise<Product>` function
- Add `deleteProduct(productId: string | number): Promise<void>` function
- Follow existing error handling pattern with `ApiError`

**Estimated Lines:** ~40 lines

## Phase 2: Type Definitions

### 2.1 Extend Product Types
**File:** `src/types/product.ts`

- Add `UpdateProductRequest` interface (optional fields for partial updates)
- Add `ProductDialogMode` type: `'create' | 'edit'`

**Estimated Lines:** ~8 lines

## Phase 3: ProductTable Component Updates

### 3.1 Add Action Column and Icon Buttons
**File:** `src/components/ProductTable/ProductTable.tsx`

- Import `IconButton` from MUI
- Import `Edit` and `Delete` icons from `@mui/icons-material`
- Add `onEditClick: (product: Product) => void` prop
- Add `onDeleteClick: (product: Product) => void` prop
- Add new table header cell "Actions"
- Add actions cell to each table row with:
  - Edit icon button (pencil icon) with aria-label="Edit product"
  - Delete icon button (trash icon) with aria-label="Delete product"
- Replace "Create New Product" button with Floating Action Button (Fab) with + icon
- Update CSS for action buttons layout

**Estimated Lines:** ~30 lines changed/added

### 3.2 Update ProductTable Styles
**File:** `src/components/ProductTable/ProductTable.css`

- Add styles for action buttons container (flex row)
- Add styles for Fab positioning (bottom-right corner or near header)

**Estimated Lines:** ~15 lines

## Phase 4: ProductDialog Component Updates

### 4.1 Add Mode Support and Pre-filled Data
**File:** `src/components/ProductDialog/ProductDialog.tsx`

- Add `mode: 'create' | 'edit'` prop
- Add `product?: Product` prop (for pre-filling in edit mode)
- Update dialog title to show "Edit Product" or "Create New Product" based on mode
- Pass initial values to `ProductForm` when in edit mode
- Update button labels based on mode

**Estimated Lines:** ~15 lines changed

## Phase 5: ProductForm Updates

### 5.1 Add Initial Values Support
**File:** `src/components/ProductForm/ProductForm.tsx`

- Add `initialValues?: Partial<ProductFormData>` prop
- Initialize form with default values when provided

**Estimated Lines:** ~10 lines

### 5.2 Update useProductForm Hook
**File:** `src/components/ProductForm/useProductForm.ts`

- Modify hook to accept optional `initialValues` parameter
- Pass `defaultValues` to `useForm` hook

**Estimated Lines:** ~5 lines

## Phase 6: ProductManagement Container Updates

### 6.1 Add Edit and Delete State Management
**File:** `src/components/ProductManagement/useProductManagement.ts`

- Add `selectedProduct: Product | null` state
- Add `dialogMode: 'create' | 'edit'` state
- Add `isDeleteConfirmOpen: boolean` state
- Add `handleEditClick(product: Product)` function
- Add `handleDeleteClick(product: Product)` function
- Add `handleConfirmDelete()` function
- Add `handleUpdateProduct(formData: ProductFormData)` function
- Modify `handleCreateClick` to set mode to 'create' and clear selectedProduct
- Import `updateProduct` and `deleteProduct` from API service

**Estimated Lines:** ~60 lines

### 6.2 Update ProductManagement Component
**File:** `src/components/ProductManagement/ProductManagement.tsx`

- Add import for delete confirmation dialog (MUI Dialog)
- Add delete confirmation dialog JSX
- Pass new props to ProductTable (`onEditClick`, `onDeleteClick`)
- Pass mode and product to ProductDialog
- Pass correct submit handler based on mode

**Estimated Lines:** ~40 lines

### 6.3 Add Delete Confirmation Styles
**File:** `src/components/ProductManagement/ProductManagement.css`

- Add styles for delete confirmation dialog if needed

**Estimated Lines:** ~5 lines

## Phase 7: Testing

### 7.1 Update ProductTable Tests
**File:** `src/tests/components/ProductTable.test.tsx`

- Add tests for edit icon click calls `onEditClick`
- Add tests for delete icon click calls `onDeleteClick`
- Add tests for action icons accessibility (aria-labels)

**Estimated Lines:** ~30 lines

### 7.2 Update ProductDialog Tests
**File:** `src/tests/components/ProductDialog.test.tsx`

- Add test for rendering in edit mode with correct title
- Add test for pre-filled form values in edit mode

**Estimated Lines:** ~25 lines

### 7.3 Update ProductApi Tests
**File:** `src/tests/services/productApi.test.ts`

- Add test for `updateProduct` success case
- Add test for `updateProduct` error handling
- Add test for `deleteProduct` success case
- Add test for `deleteProduct` error handling

**Estimated Lines:** ~50 lines

## Phase 8: Edge Case Handling

### 8.1 Error Handling
- Handle API errors during update (show error message, keep dialog open)
- Handle API errors during delete (show error message)
- Handle 404 on delete (product already deleted by another user)
- Handle 409 on update (duplicate SKU)

### 8.2 Loading States
- Add loading state during update submission
- Add loading state during delete operation
- Disable action buttons while operations in progress

### 8.3 Optimistic Updates
- After successful edit: update product in local state immediately
- After successful delete: remove product from local state immediately

## Implementation Order

1. Phase 1: API layer (blocking for all other work)
2. Phase 2: Types (blocking for dialog/form work)
3. Phase 3: ProductTable (can be done in parallel with Phase 4-5)
4. Phase 4: ProductDialog (depends on Phase 2)
5. Phase 5: ProductForm (depends on Phase 2)
6. Phase 6: ProductManagement integration (depends on Phase 1-5)
7. Phase 7: Testing (depends on Phase 1-6)
8. Phase 8: Edge cases (can be part of each phase)

## Open Questions Resolved

Based on spec open questions and best practices:

1. **Delete confirmation pattern:** Use MUI Dialog (consistent with existing patterns)
2. **Edit inline vs dialog:** Use existing dialog with mode prop (reuses validation, consistent UX)
3. **Bulk delete:** Not implemented - single delete only

## Estimated Total Changes

- **Files Modified:** 10
- **Lines Added:** ~350
- **Lines Changed:** ~50
- **New Test Cases:** ~12
