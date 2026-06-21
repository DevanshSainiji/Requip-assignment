import * as React from 'react';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { UserTable } from '@/components/domain/UserTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User } from '@/types';

export function UserList() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  
  const [deleteModalUser, setDeleteModalUser] = React.useState<User | null>(null);
  
  const { data, isLoading } = useUsers(page, 10, debouncedSearch);
  const deleteMutation = useDeleteUser();
  const { addToast } = useToast();

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteModalUser) return;
    try {
      await deleteMutation.mutateAsync(deleteModalUser.id);
      addToast({
        type: 'success',
        title: 'User Deleted',
        message: `${deleteModalUser.name} was successfully removed.`,
      });
      setDeleteModalUser(null);
    } catch (error: unknown) {
      const err = error as Error;
      addToast({
        type: 'error',
        title: 'Deletion Failed',
        message: err.message || 'An unexpected error occurred.',
      });
    }
  };

  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900">Users</h1>
          <p className="mt-1 text-slate-500">Manage your system users here.</p>
        </div>
        <Link to="/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <UserTable 
        users={data?.data || []} 
        isLoading={isLoading} 
        onDeleteClick={setDeleteModalUser} 
      />

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium">{(page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-medium">{pagination.total}</span> results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pagination.totalPages}
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModalUser}
        onClose={() => setDeleteModalUser(null)}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModalUser(null)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>
              Delete
            </Button>
          </>
        }
      >
        {deleteModalUser && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
            <p className="text-sm font-medium text-rose-800">
              User: {deleteModalUser.name} ({deleteModalUser.email})
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
