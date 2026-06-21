import type { User } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Edit2, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onDeleteClick: (user: User) => void;
}

export function UserTable({ users, isLoading, onDeleteClick }: UserTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!users.length) {
    return (
      <EmptyState
        icon={<Users className="h-10 w-10" />}
        title="No users found"
        description="Try adjusting your search criteria or create a new user."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Documents</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-400">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div>{user.email}</div>
                  <div className="text-slate-400">{user.primaryMobile}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-xs uppercase">{user.pan}</div>
                  <div className="font-mono text-xs text-slate-400">{user.aadhaar}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="success">Active</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/users/${user.id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                        <Edit2 className="h-4 w-4 text-slate-500" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 rounded-full p-0 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => onDeleteClick(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
