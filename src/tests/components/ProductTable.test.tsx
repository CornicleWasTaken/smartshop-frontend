import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductTable } from '../../components/ProductTable/ProductTable';
import type { Product } from '../../types/product';

describe('ProductTable', () => {
  const mockProducts: Product[] = [
    { productId: 1, name: 'Test Product', sku: 'TEST-001', price: 9.99, stockQuantity: 100 },
    { productId: 2, name: 'Another Product', sku: 'TEST-002', price: 19.99, stockQuantity: 50 },
  ];

  const onCreateClick = vi.fn();
  const onEditClick = vi.fn();
  const onDeleteClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display products in the table', () => {
    render(
      <ProductTable
        products={mockProducts}
        isLoading={false}
        onCreateClick={onCreateClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Another Product')).toBeInTheDocument();
    expect(screen.getByText('TEST-001')).toBeInTheDocument();
    expect(screen.getByText('TEST-002')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    render(
      <ProductTable
        products={[]}
        isLoading={true}
        onCreateClick={onCreateClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    );

    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('should display empty state when no products', () => {
    render(
      <ProductTable
        products={[]}
        isLoading={false}
        onCreateClick={onCreateClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    );

    expect(screen.getByText('No products available')).toBeInTheDocument();
  });

  it('should call onCreateClick when FAB is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProductTable
        products={mockProducts}
        isLoading={false}
        onCreateClick={onCreateClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    );

    const createButton = screen.getByLabelText('Create new product');
    await user.click(createButton);
    expect(onCreateClick).toHaveBeenCalledTimes(1);
  });

  it('should display formatted prices', () => {
    render(
      <ProductTable
        products={mockProducts}
        isLoading={false}
        onCreateClick={onCreateClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    );

    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('should call onEditClick when edit icon is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProductTable
        products={mockProducts}
        isLoading={false}
        onCreateClick={onCreateClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    );

    const editButtons = screen.getAllByLabelText('Edit product');
    await user.click(editButtons[0]);
    expect(onEditClick).toHaveBeenCalledTimes(1);
    expect(onEditClick).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('should call onDeleteClick when delete icon is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProductTable
        products={mockProducts}
        isLoading={false}
        onCreateClick={onCreateClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    );

    const deleteButtons = screen.getAllByLabelText('Delete product');
    await user.click(deleteButtons[0]);
    expect(onDeleteClick).toHaveBeenCalledTimes(1);
    expect(onDeleteClick).toHaveBeenCalledWith(mockProducts[0]);
  });
});
