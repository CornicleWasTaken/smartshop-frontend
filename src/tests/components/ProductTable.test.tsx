import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductTable } from '../../components/ProductTable/ProductTable';
import { Product } from '../../types/product';

describe('ProductTable', () => {
  const mockProducts: Product[] = [
    { id: 1, name: 'Test Product', sku: 'TEST-001', price: 9.99, stockQuantity: 100 },
    { id: 2, name: 'Another Product', sku: 'TEST-002', price: 19.99, stockQuantity: 50 },
  ];

  const onCreateClick = vi.fn();

  it('should display products in the table', () => {
    render(
      <ProductTable
        products={mockProducts}
        isLoading={false}
        onCreateClick={onCreateClick}
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
      />
    );

    expect(screen.getByText('No products available')).toBeInTheDocument();
  });

  it('should call onCreateClick when button is clicked', () => {
    render(
      <ProductTable
        products={mockProducts}
        isLoading={false}
        onCreateClick={onCreateClick}
      />
    );

    const createButton = screen.getByText('Create New Product');
    createButton.click();
    expect(onCreateClick).toHaveBeenCalledTimes(1);
  });

  it('should display formatted prices', () => {
    render(
      <ProductTable
        products={mockProducts}
        isLoading={false}
        onCreateClick={onCreateClick}
      />
    );

    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });
});
