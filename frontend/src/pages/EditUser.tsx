import { useParams, useNavigate } from 'react-router-dom';
import { UserForm } from '@/components/domain/UserForm';
import type { UserFormData } from '@/components/domain/UserForm';
import { useUser, useUpdateUser } from '@/hooks/useUsers';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export function EditUser() {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : null;
  
  const navigate = useNavigate();
  const { data: user, isLoading: isFetching, isError } = useUser(userId);
  const updateMutation = useUpdateUser();
  const { addToast } = useToast();

  const handleSubmit = async (data: UserFormData) => {
    if (!userId) return;
    try {
      await updateMutation.mutateAsync({ id: userId, data });
      addToast({
        type: 'success',
        title: 'User Updated',
        message: 'The user profile has been successfully updated.',
      });
      navigate('/users');
    } catch (error: unknown) {
      const err = error as Error;
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to update user. Please try again.',
      });
    }
  };

  if (isFetching) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6 sm:p-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="mx-auto max-w-3xl pt-12">
        <EmptyState
          icon={<ArrowLeft className="h-10 w-10" />}
          title="User not found"
          description="The user you are looking for does not exist or has been deleted."
          action={
            <Button onClick={() => navigate('/users')}>Back to Users</Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900">Edit User</h1>
          <p className="text-slate-500">Update profile information for {user.name}.</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <UserForm 
          defaultValues={{
            ...user,
            dateOfBirth: user.dateOfBirth || undefined,
          }}
          onSubmit={handleSubmit} 
          isLoading={updateMutation.isPending} 
          submitLabel="Save Changes" 
        />
      </div>
    </div>
  );
}
