import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaleForm } from '../../components/SaleForm/SaleForm';

describe('SaleForm', () => {
  const onSubmit = vi.fn();

  const mockProducts = [
    { productId: 1, name: 'Product A', price: 10.0, stockQuantity: 50 },
    { productId: 2, name: 'Product B', price: 25.5, stockQuantity: 30 },
    { productId: 3, name: 'Product C', price: 15.75, stockQuantity: 100 },
  ];

  it('should render customer phone field', () => {
    render(<SaleForm onSubmit={onSubmit} products={mockProducts} />);

    expect(screen.getByLabelText(/customer phone/i)).toBeInTheDocument();
  });

  it('should render product autocomplete', () => {
    render(<SaleForm onSubmit={onSubmit} products={mockProducts} />);

    const autocomplete = screen.getByRole('combobox', { name: /product/i });
    expect(autocomplete).toBeInTheDocument();
  });

  it('should show "No products available" when products array is empty', () => {
    render(<SaleForm onSubmit={onSubmit} products={[]} />);

    expect(screen.getByText('No products available')).toBeInTheDocument();
  });

  it('should render quantity field', () => {
    render(<SaleForm onSubmit={onSubmit} products={mockProducts} />);

    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
  });

  it('should allow adding multiple items', async () => {
    render(<SaleForm onSubmit={onSubmit} products={mockProducts} />);

    const addItemButton = screen.getByRole('button', { name: /add item/i });
    await userEvent.click(addItemButton);

    // Should now have two item rows
    const productSelects = screen.getAllByRole('combobox', { name: /product/i });
    expect(productSelects).toHaveLength(2);
  });

  it('should allow removing items when more than one exists', async () => {
    render(<SaleForm onSubmit={onSubmit} products={mockProducts} />);

    const addItemButton = screen.getByRole('button', { name: /add item/i });
    await userEvent.click(addItemButton);

    const removeButtons = screen.getAllByLabelText('Remove item');
    expect(removeButtons).toHaveLength(2);

    await userEvent.click(removeButtons[0]);

    // Should now have only one remove button
    const remainingRemoveButtons = screen.getAllByLabelText('Remove item');
    expect(remainingRemoveButtons).toHaveLength(1);
  });

  it('should disable remove button when only one item exists', () => {
    render(<SaleForm onSubmit={onSubmit} products={mockProducts} />);

    const removeButton = screen.getByLabelText('Remove item');
    expect(removeButton).toBeDisabled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<SaleForm onSubmit={onSubmit} products={mockProducts} disabled />);

    expect(screen.getByLabelText(/customer phone/i)).toBeDisabled();
    expect(screen.getByRole('combobox', { name: /product/i })).toBeDisabled();
    expect(screen.getByLabelText('Quantity')).toBeDisabled();
    expect(
      screen.getByRole('button', { name: /creating/i })
    ).toBeDisabled();
  });
});
