import { useNavigate } from 'react-router-dom';
import { UserForm } from '@/components/domain/UserForm';
import type { UserFormData } from '@/components/domain/UserForm';
import { useCreateUser } from '@/hooks/useUsers';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CreateUser() {
  const navigate = useNavigate();
  const createMutation = useCreateUser();
  const { addToast } = useToast();

  const handleSubmit = async (data: UserFormData) => {
    try {
      const payload: Record<string, unknown> = {
        ...data,
        dateOfBirth: data.dateOfBirth || null,
      };
      if (!payload.secondaryMobile) {
        delete payload.secondaryMobile;
      }
      
      await createMutation.mutateAsync(payload as unknown as Parameters<typeof createMutation.mutateAsync>[0]);
      addToast({
        type: 'success',
        title: 'User Created',
        message: 'The new user has been successfully added to the system.',
      });
      navigate('/users');
    } catch (error: unknown) {
      const err = error as Error;
      addToast({
        type: 'error',
        title: 'Creation Failed',
        message: err.message || 'Failed to create user. Please check the inputs.',
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900">Create New User</h1>
          <p className="text-slate-500">Add a new user to the Requip platform.</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <UserForm onSubmit={handleSubmit} isLoading={createMutation.isPending} submitLabel="Create User" />
      </div>
    </div>
  );
}
