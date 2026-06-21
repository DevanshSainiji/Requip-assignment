import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Mail, Phone, CreditCard, FileText, Calendar } from 'lucide-react';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format').max(150),
  primaryMobile: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g. ABCDE1234F)'),
  aadhaar: z.string().regex(/^\d{12}$/, 'Must be a valid 12-digit Aadhaar number'),
  dateOfBirth: z.string().optional().refine((val) => {
    if (!val) return true;
    const dob = new Date(val);
    const age = (new Date().getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18;
  }, 'User must be at least 18 years old'),
});

export type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  defaultValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function UserForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Save' }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      primaryMobile: defaultValues?.primaryMobile || '',
      pan: defaultValues?.pan || '',
      aadhaar: defaultValues?.aadhaar || '',
      dateOfBirth: defaultValues?.dateOfBirth ? new Date(defaultValues.dateOfBirth).toISOString().split('T')[0] : '',
    },
    mode: 'onTouched',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Section: Personal Info */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label="Full Name"
            placeholder="John Doe"
            leftIcon={<User className="h-4 w-4" />}
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Primary Mobile"
            placeholder="9876543210"
            leftIcon={<Phone className="h-4 w-4" />}
            {...register('primaryMobile')}
            error={errors.primaryMobile?.message}
          />
          <Input
            label="Date of Birth"
            type="date"
            leftIcon={<Calendar className="h-4 w-4" />}
            {...register('dateOfBirth')}
            error={errors.dateOfBirth?.message}
          />
        </div>
      </div>

      {/* Section: Identifiers */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
          Identity Documents
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label="PAN Number"
            placeholder="ABCDE1234F"
            className="uppercase"
            leftIcon={<CreditCard className="h-4 w-4" />}
            {...register('pan')}
            error={errors.pan?.message}
          />
          <Input
            label="Aadhaar Number"
            placeholder="123456789012"
            leftIcon={<FileText className="h-4 w-4" />}
            {...register('aadhaar')}
            error={errors.aadhaar?.message}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
