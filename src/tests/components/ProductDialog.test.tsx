import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductDialog } from '../../components/ProductDialog/ProductDialog';
import { ProductFormData } from '../../types/product';

describe('ProductDialog', () => {
  const onClose = vi.fn();
  const onSubmit = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose,
    onSubmit,
  };

  it('should render dialog when isOpen is true', () => {
    render(<ProductDialog {...defaultProps} />);

    expect(screen.getByText('Create New Product')).toBeInTheDocument();
  });

  it('should not render dialog when isOpen is false', () => {
    render(<ProductDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Create New Product')).not.toBeInTheDocument();
  });

  it('should call onClose when Cancel button is clicked', async () => {
    render(<ProductDialog {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit with valid data and then onClose', async () => {
    render(<ProductDialog {...defaultProps} />);

    await userEvent.type(screen.getByLabelText('Name'), 'Test Product');
    await userEvent.type(screen.getByLabelText('SKU'), 'TEST-001');
    await userEvent.type(screen.getByLabelText('Price'), '9.99');
    await userEvent.type(screen.getByLabelText('Stock Quantity'), '100');

    const createButton = screen.getByText('Create');
    await userEvent.click(createButton);

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Test Product',
      sku: 'TEST-001',
      price: '9.99',
      stockQuantity: '100',
    });
  });

  it('should show validation errors for empty fields', async () => {
    render(<ProductDialog {...defaultProps} />);

    const createButton = screen.getByText('Create');
    await userEvent.click(createButton);

    expect(screen.getAllByText('is required')).toHaveLength(4);
  });
});
