import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import LoginForm from './features/auth/components/LoginForm';
import ErrorBoundary from './components/common/ErrorBoundary';
import { CardSkeleton } from './components/common/Skeleton';

import { useAuthStore } from './store/authStore';

// Lazy loaded components
const StudentDashboard = lazy(() => import('./features/student/Dashboard'));
const StudentDashboardLayout = lazy(() => import('./features/student/layouts/StudentDashboardLayout'));
const AdminDashboard = lazy(() => import('./features/admin/components/AdminDashboard'));
const UserManagement = lazy(() => import('./features/admin/components/UserManagement'));
const AcademicExplorer = lazy(() => import('./features/admin/components/AcademicExplorer'));
const TimetableManager = lazy(() => import('./features/admin/components/TimetableManager'));
const FacultyWorkload = lazy(() => import('./features/admin/components/FacultyWorkload'));
const StudentConsole = lazy(() => import('./features/admin/components/StudentConsole'));
const ExamConsole = lazy(() => import('./features/admin/components/ExamConsole'));
const FinancePanel = lazy(() => import('./features/admin/components/FinancePanel'));
const SystemSettings = lazy(() => import('./features/admin/components/SystemSettings'));
const FileGovernance = lazy(() => import('./features/admin/components/FileGovernance'));
const FinanceDashboard = lazy(() => import('./features/finance/components/FinanceDashboard'));

// Helper component for landing page redirect
const RoleDashboardRedirect = () => {
  const { user } = useAuthStore();
  
  switch (user?.role) {
    case 'Admin': return <Navigate to="/admin/dashboard" replace />;
    case 'Faculty': return <Navigate to="/faculty/dashboard" replace />;
    case 'Student': return <Navigate to="/student/dashboard" replace />;
    case 'Finance': return <Navigate to="/finance/dashboard" replace />;
    case 'HOD': return <Navigate to="/hod/dashboard" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/unauthorized" element={<div className="glass" style={{ padding: '24px', margin: '20px' }}>403 - Unauthorized Access</div>} />
          
          {/* Base Protected Wrap */}
          <Route element={<ProtectedRoute />}>
              <Route path="/" element={<RoleDashboardRedirect />} />
              <Route path="/dashboard" element={<RoleDashboardRedirect />} />
              
              {/* Admin/Generic Layout Routes */}
              <Route element={<DashboardLayout />}>
                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                  <Route path="/admin/dashboard" element={<Suspense fallback={<CardSkeleton />}><AdminDashboard /></Suspense>} />
                  <Route path="/admin/users" element={<Suspense fallback={<CardSkeleton />}><UserManagement /></Suspense>} />
                  <Route path="/admin/academic" element={<Suspense fallback={<CardSkeleton />}><AcademicExplorer /></Suspense>} />
                  <Route path="/admin/timetable" element={<Suspense fallback={<CardSkeleton />}><TimetableManager /></Suspense>} />
                  <Route path="/admin/faculty" element={<Suspense fallback={<CardSkeleton />}><FacultyWorkload /></Suspense>} />
                  <Route path="/admin/students" element={<Suspense fallback={<CardSkeleton />}><StudentConsole /></Suspense>} />
                  <Route path="/admin/exams" element={<Suspense fallback={<CardSkeleton />}><ExamConsole /></Suspense>} />
                  <Route path="/admin/finance" element={<Suspense fallback={<CardSkeleton />}><FinancePanel /></Suspense>} />
                  <Route path="/admin/config" element={<Suspense fallback={<CardSkeleton />}><SystemSettings /></Suspense>} />
                  <Route path="/admin/files" element={<Suspense fallback={<CardSkeleton />}><FileGovernance /></Suspense>} />
                  <Route path="/admin/*" element={<Suspense fallback={<CardSkeleton />}><AdminDashboard /></Suspense>} />
                </Route>

                {/* Finance Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Finance']} />}>
                  <Route path="/finance/dashboard" element={<Suspense fallback={<CardSkeleton />}><FinanceDashboard /></Suspense>} />
                  <Route path="/finance/*" element={<Suspense fallback={<CardSkeleton />}><FinanceDashboard /></Suspense>} />
                </Route>

                {/* HOD Routes */}
                <Route element={<ProtectedRoute allowedRoles={['HOD']} />}>
                  <Route path="/hod/dashboard" element={<div className="glass" style={{ padding: '24px' }}>HOD Dashboard Coming Soon</div>} />
                </Route>

                {/* Faculty Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Faculty']} />}>
                    <Route path="/faculty/dashboard" element={<Suspense fallback={<CardSkeleton />}><StudentDashboard /></Suspense>} />
                    <Route path="/faculty/*" element={<div className="glass" style={{ padding: '24px' }}>Faculty Module Coming Soon</div>} />
                </Route>

                <Route path="/settings" element={<div className="glass" style={{ padding: '24px' }}>Settings Module Coming Soon</div>} />
              </Route>

              {/* Student Specific Layout & Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
                <Route element={<Suspense fallback={<CardSkeleton />}><StudentDashboardLayout /></Suspense>}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/*" element={<StudentDashboard />} />
                </Route>
              </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
