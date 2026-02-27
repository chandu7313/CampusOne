import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import LoginForm from './features/auth/components/LoginForm';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import StudentDashboard from './features/academics/components/StudentDashboard';
import AdminDashboard from './features/admin/components/AdminDashboard';
import { Users, GraduationCap, BookOpen, UserPlus } from 'lucide-react';

const StatsCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="glass" style={{ padding: '24px', borderRadius: '16px', flex: 1, minWidth: '240px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
      <div style={{ padding: '10px', background: `${color}15`, color: color, borderRadius: '12px' }}>
        <Icon size={24} />
      </div>
      <span style={{ color: trend.startsWith('+') ? '#10b981' : '#f43f5e', fontSize: '0.875rem', fontWeight: 'bold' }}>
        {trend}
      </span>
    </div>
    <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '4px' }}>{value}</h3>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</p>
  </div>
);


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout children={<Outlet />} />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
            
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
