import { useUserStats, useUsers } from '@/hooks/useUsers';
import { StatCard } from '@/components/ui/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Users, UserCheck, UserMinus, Activity } from 'lucide-react';
import { UserTable } from '@/components/domain/UserTable';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: recentUsersData, isLoading: usersLoading } = useUsers(1, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Overview of your Requip user base.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </>
        ) : stats ? (
          <>
            <StatCard 
              title="Total Users" 
              value={stats.totalUsers} 
              icon={<Users className="h-5 w-5" />} 
            />
            <StatCard 
              title="Active Users" 
              value={stats.activeUsers} 
              icon={<UserCheck className="h-5 w-5" />} 
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard 
              title="Deleted Users" 
              value={stats.deletedUsers} 
              icon={<UserMinus className="h-5 w-5" />} 
            />
            <StatCard 
              title="Recent Joins (30d)" 
              value={stats.recentUsers} 
              icon={<Activity className="h-5 w-5" />} 
            />
          </>
        ) : null}
      </div>

      {/* Recent Users Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-slate-900">Recent Users</h2>
          <Link to="/users">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        <UserTable 
          users={recentUsersData?.data || []} 
          isLoading={usersLoading} 
          onDeleteClick={() => {}} 
        />
      </div>
    </div>
  );
}
