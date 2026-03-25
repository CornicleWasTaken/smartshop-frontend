import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from '../../components/ProductForm/ProductForm';

describe('ProductForm', () => {
  const onSubmit = vi.fn();

  it('should render all form fields', () => {
    render(<ProductForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('SKU')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Stock Quantity')).toBeInTheDocument();
  });

  it('should call onSubmit with valid data', async () => {
    render(<ProductForm onSubmit={onSubmit} />);

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
    render(<ProductForm onSubmit={onSubmit} />);

    const createButton = screen.getByText('Create');
    await userEvent.click(createButton);

    expect(screen.getAllByText(/is required/)).toHaveLength(4);
  });

  it('should show error for negative price', async () => {
    render(<ProductForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Name'), 'Test Product');
    await userEvent.type(screen.getByLabelText('SKU'), 'TEST-001');
    await userEvent.type(screen.getByLabelText('Price'), '-5');
    await userEvent.type(screen.getByLabelText('Stock Quantity'), '100');

    const createButton = screen.getByText('Create');
    await userEvent.click(createButton);

    expect(screen.getByText('Price must be a positive number')).toBeInTheDocument();
  });

  it('should show error for negative stock quantity', async () => {
    render(<ProductForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Name'), 'Test Product');
    await userEvent.type(screen.getByLabelText('SKU'), 'TEST-001');
    await userEvent.type(screen.getByLabelText('Price'), '9.99');
    await userEvent.type(screen.getByLabelText('Stock Quantity'), '-10');

    const createButton = screen.getByText('Create');
    await userEvent.click(createButton);

    expect(screen.getByText('Stock quantity must be a non-negative integer')).toBeInTheDocument();
  });

  it('should call reset when Reset button is clicked', async () => {
    render(<ProductForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Name'), 'Test Product');
    await userEvent.type(screen.getByLabelText('SKU'), 'TEST-001');

    const resetButton = screen.getByText('Reset');
    await userEvent.click(resetButton);

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('SKU')).toHaveValue('');
  });
});
