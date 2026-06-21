import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { UserList } from '@/pages/UserList';
import { CreateUser } from '@/pages/CreateUser';
import { EditUser } from '@/pages/EditUser';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<CreateUser />} />
        <Route path="/users/:id/edit" element={<EditUser />} />
        <Route 
          path="/settings" 
          element={<div className="p-6 glass rounded-2xl">Settings is coming soon.</div>} 
        />
      </Route>
    </Routes>
  );
}
