import type { ProductFormData } from '../../types/product';
import { useProductForm } from './useProductForm';
import './ProductForm.css';

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  initialValues?: Partial<ProductFormData>;
  disabled?: boolean;
}

export function ProductForm({ onSubmit, initialValues, disabled = false }: ProductFormProps) {
  const { register, handleSubmit, errors, reset } = useProductForm(onSubmit, initialValues);

  const handleReset = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...register('name')}
          disabled={disabled}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="sku">SKU</label>
        <input
          id="sku"
          type="text"
          {...register('sku')}
          disabled={disabled}
          className={errors.sku ? 'error' : ''}
        />
        {errors.sku && <span className="error-message">{errors.sku.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register('price')}
          disabled={disabled}
          className={errors.price ? 'error' : ''}
        />
        {errors.price && <span className="error-message">{errors.price.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="stockQuantity">Stock Quantity</label>
        <input
          id="stockQuantity"
          type="number"
          {...register('stockQuantity')}
          disabled={disabled}
          className={errors.stockQuantity ? 'error' : ''}
        />
        {errors.stockQuantity && <span className="error-message">{errors.stockQuantity.message}</span>}
      </div>

      <div className="form-actions">
        <button type="button" onClick={handleReset} className="btn-secondary" disabled={disabled}>
          Reset
        </button>
        <button type="submit" className="btn-primary" disabled={disabled}>
          {disabled ? 'Saving...' : (initialValues ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
}
