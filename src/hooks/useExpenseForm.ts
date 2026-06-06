import { useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ExpenseStatus } from '../types/financial';
import type { ExpenseFormData, ExpenseCreateRequest, ExpenseUpdateRequest } from '../types/financial';

// Zod schema for expense form validation
const expenseFormSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Amount must be a positive number'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be less than 100 characters'),
  expenseDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, 'Expense date is required'),
  vendor: z
    .string()
    .max(200, 'Vendor name must be less than 200 characters'),
  receiptAttached: z.boolean(),
  status: z.nativeEnum(ExpenseStatus),
});

interface UseExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseCreateRequest | ExpenseUpdateRequest) => Promise<void>;
  onCancel?: () => void;
}

interface UseExpenseFormReturn extends UseFormReturn<ExpenseFormData> {
  isSubmitting: boolean;
  onFormSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  handleCancel: () => void;
}

export const useExpenseForm = ({
  initialData,
  onSubmit,
  onCancel,
}: UseExpenseFormProps): UseExpenseFormReturn => {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: initialData?.description || '',
      amount: initialData?.amount || '',
      category: initialData?.category || '',
      expenseDate: initialData?.expenseDate || new Date(),
      vendor: initialData?.vendor || '',
      receiptAttached: initialData?.receiptAttached || false,
      status: initialData?.status || ExpenseStatus.DRAFT,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form;

  const onFormSubmit = handleSubmit(async (formData) => {
    try {
      // Convert form data to API format
      const apiData: ExpenseCreateRequest = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        expenseDate: formData.expenseDate!.toISOString(),
        vendor: formData.vendor || undefined,
        receiptAttached: formData.receiptAttached,
        status: formData.status,
      };

      await onSubmit(apiData);
    } catch (error) {
      // Set form-level error if submission fails
      setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Failed to save expense',
      });
      throw error; // Re-throw to allow component handling
    }
  });

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return {
    ...form,
    isSubmitting,
    onFormSubmit,
    handleCancel,
  };
};