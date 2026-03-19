import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ProductFormData } from '../types/product';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.string().min(1, 'Price is required').refine((val) => parseFloat(val) > 0, {
    message: 'Price must be a positive number',
  }),
  stockQuantity: z.string().min(1, 'Stock quantity is required').refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
  }, {
    message: 'Stock quantity must be a non-negative integer',
  }),
});

export function useProductForm(onSubmit: (data: ProductFormData) => void) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onFormSubmit: SubmitHandler<ProductFormData> = (data) => {
    console.log('Form submitted with values:', data);
    onSubmit(data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    reset,
  };
}
