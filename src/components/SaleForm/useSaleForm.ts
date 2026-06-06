import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { SaleFormData } from '../../types/sale';

const saleSchema = z.object({
  customerPhone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number format')
    .default(''),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    quantity: z.string()
      .min(1, 'Quantity is required')
      .refine((val) => parseInt(val) > 0, 'Quantity must be at least 1'),
  })).min(1, 'At least one item is required'),
});

export function useSaleForm(onSubmit: (data: SaleFormData) => void) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema as any) as any,
    defaultValues: {
      customerPhone: '',
      items: [{ productId: '', quantity: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onFormSubmit: SubmitHandler<SaleFormData> = (data) => {
    console.log('Sale form submitted with values:', data);
    onSubmit(data);
  };

  const handleAddItem = () => {
    append({ productId: '', quantity: '' });
  };

  const handleRemoveItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    fields,
    append,
    remove: handleRemoveItem,
    handleAddItem,
    handleRemoveItem,
    reset,
    control,
    setValue,
  };
}
