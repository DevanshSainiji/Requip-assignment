import { useUserStats, useUsers } from '@/hooks/useUsers';
import { StatCard } from '@/components/ui/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Users, UserCheck, UserMinus, Activity, ArrowRight } from 'lucide-react';
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
        ) : (
          <>
            <StatCard 
              title="Total Users" 
              value={stats?.totalUsers || 0} 
              subtitle="All time users"
              icon={<Users className="h-5 w-5" />}
              iconWrapperClass="bg-copper-100 text-copper-600"
            />
            <StatCard 
              title="Active Users" 
              value={stats?.activeUsers || 0} 
              subtitle="from last 30 days"
              icon={<UserCheck className="h-5 w-5" />} 
              iconWrapperClass="bg-emerald-100 text-emerald-600"
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatCard 
              title="Deleted Users" 
              value={stats?.deletedUsers || 0} 
              subtitle="from last 30 days"
              icon={<UserMinus className="h-5 w-5" />} 
              iconWrapperClass="bg-rose-100 text-rose-600"
              trend={{ value: 5.2, isPositive: true }}
            />
            <StatCard 
              title="Recent Users" 
              value={stats?.recentUsers || 0} 
              subtitle="Last 30 days"
              icon={<Activity className="h-5 w-5" />} 
              iconWrapperClass="bg-blue-100 text-blue-600"
            />
          </>
        )}
      </div>

      {/* Recent Users Section */}
      <div className="space-y-4 pt-8">
        <h2 className="font-heading text-xl font-semibold text-slate-900">Recent Users</h2>
        
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Mobile</th>
                  <th className="px-6 py-4">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="px-6 py-4"><Skeleton className="h-6 w-full" /></td>
                    </tr>
                  ))
                ) : recentUsersData?.data && recentUsersData.data.length > 0 ? (
                  recentUsersData.data.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.primaryMobile}</td>
                      <td className="px-6 py-4">
                        {new Date(user.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-8 w-8 text-slate-300 mb-3" />
                        <p className="font-medium text-slate-900">No recent users</p>
                        <p className="text-sm">Wait for new registrations.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <Link to="/users">
            <Button variant="outline" className="group rounded-full px-6 transition-all hover:bg-slate-50 hover:text-copper-600 hover:border-copper-200">
              View All Users 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
