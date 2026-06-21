import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Placeholders for Phase 5 */}
        <Route 
          path="/" 
          element={<div className="p-6 glass rounded-2xl">Dashboard Component Placeholder</div>} 
        />
        <Route 
          path="/users" 
          element={<div className="p-6 glass rounded-2xl">User List Component Placeholder</div>} 
        />
        <Route 
          path="/settings" 
          element={<div className="p-6 glass rounded-2xl">Settings Component Placeholder</div>} 
        />
      </Route>
    </Routes>
  );
}
