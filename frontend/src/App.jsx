import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import LoginForm from './features/auth/components/LoginForm';
import ErrorBoundary from './components/common/ErrorBoundary';
import { CardSkeleton } from './components/common/Skeleton';

import { useAuthStore } from './store/authStore';
import { useSocket } from './hooks/useSocket';

// Lazy loaded components
const StudentDashboard = lazy(() => import('./features/student/Dashboard'));
const StudentDashboardLayout = lazy(() => import('./features/student/layouts/StudentDashboardLayout'));
const StudentCourses = lazy(() => import('./features/student/pages/StudentCourses'));
const StudentTimetable = lazy(() => import('./features/student/pages/StudentTimetable'));
const StudentAttendance = lazy(() => import('./features/student/pages/StudentAttendance'));
const FacultyAttendance = lazy(() => import('./features/faculty/pages/FacultyAttendance'));
const StudentAssignments = lazy(() => import('./features/student/pages/StudentAssignments'));
const FacultyAssignments = lazy(() => import('./features/faculty/pages/FacultyAssignments'));
const StudentExams = lazy(() => import('./features/student/pages/StudentExams'));
const FacultyExams = lazy(() => import('./features/faculty/pages/FacultyExams'));
const StudentFees = lazy(() => import('./features/student/pages/StudentFees'));
const MessageCenter = lazy(() => import('./components/communication/MessageCenter'));
const Announcements = lazy(() => import('./components/communication/Announcements'));
const Events = lazy(() => import('./components/communication/Events'));
const StudentPlacements = lazy(() => import('./features/student/pages/PlacementPortal'));
const FacultyPlacements = lazy(() => import('./features/faculty/pages/FacultyPlacements'));
const Authorities = lazy(() => import('./features/student/pages/Authorities'));
const ProfilePage = lazy(() => import('./features/common/pages/ProfilePage'));
const ComingSoon = lazy(() => import('./components/common/ComingSoon'));
const AdminDashboard = lazy(() => import('./features/admin/components/AdminDashboard'));
const UserManagement = lazy(() => import('./features/admin/components/UserManagement'));
const AcademicExplorer = lazy(() => import('./features/admin/components/AcademicExplorer'));
const TimetableManager = lazy(() => import('./features/admin/components/TimetableManager'));
const TimetableCreate = lazy(() => import('./features/admin/components/timetable/CreateTimetablePage'));
const TimetableEdit = lazy(() => import('./features/admin/components/timetable/EditTimetablePage'));
const FacultyWorkload = lazy(() => import('./features/admin/components/FacultyWorkload'));
const StudentConsole = lazy(() => import('./features/admin/components/StudentConsole'));
const ExamConsole = lazy(() => import('./features/admin/components/ExamConsole'));
const FinancePanel = lazy(() => import('./features/admin/components/FinancePanel'));
const SystemSettings = lazy(() => import('./features/admin/components/SystemSettings'));
const FileGovernance = lazy(() => import('./features/admin/components/FileGovernance'));
const FinanceDashboard = lazy(() => import('./features/finance/components/FinanceDashboard'));
const SectionManagementPage = lazy(() => import('./features/admin/components/SectionManagementPage'));
const AdminFeeManagementPage = lazy(() => import('./features/finance/pages/AdminFeeManagementPage'));
const AdminPaymentHistoryPage = lazy(() => import('./features/finance/pages/AdminPaymentHistoryPage'));
const SalaryManagementPage = lazy(() => import('./features/finance/pages/SalaryManagementPage'));
const SalaryHistoryPage = lazy(() => import('./features/finance/pages/SalaryHistoryPage'));

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

const GlobalSocketWrapper = ({ children }) => {
  useSocket(); // Initializes socket listener if user is logged in
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <GlobalSocketWrapper>
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
                  {/* Timetable — dashboard + two SEPARATE route-based pages (no stale state bleed) */}
                  <Route path="/admin/timetable" element={<Suspense fallback={<CardSkeleton />}><TimetableManager /></Suspense>} />
                  {/* /new MUST come before /:id/edit so "new" isn't treated as an :id param */}
                  <Route path="/admin/timetable/new" element={<Suspense fallback={<CardSkeleton />}><TimetableCreate /></Suspense>} />
                  <Route path="/admin/timetable/:id/edit" element={<Suspense fallback={<CardSkeleton />}><TimetableEdit /></Suspense>} />
                  <Route path="/admin/faculty" element={<Suspense fallback={<CardSkeleton />}><FacultyWorkload /></Suspense>} />
                  <Route path="/admin/students" element={<Suspense fallback={<CardSkeleton />}><StudentConsole /></Suspense>} />
                  <Route path="/admin/sections" element={<Suspense fallback={<CardSkeleton />}><SectionManagementPage /></Suspense>} />
                  <Route path="/admin/exams" element={<Suspense fallback={<CardSkeleton />}><ExamConsole /></Suspense>} />
                  <Route path="/admin/finance/fees" element={<Suspense fallback={<CardSkeleton />}><AdminFeeManagementPage /></Suspense>} />
                  <Route path="/admin/finance/payments" element={<Suspense fallback={<CardSkeleton />}><AdminPaymentHistoryPage /></Suspense>} />
                  <Route path="/admin/finance/salary" element={<Suspense fallback={<CardSkeleton />}><SalaryManagementPage /></Suspense>} />
                  <Route path="/admin/config" element={<Suspense fallback={<CardSkeleton />}><SystemSettings /></Suspense>} />
                  <Route path="/admin/files" element={<Suspense fallback={<CardSkeleton />}><FileGovernance /></Suspense>} />
                  <Route path="/admin/*" element={<Suspense fallback={<CardSkeleton />}><AdminDashboard /></Suspense>} />
                </Route>

                {/* Finance Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Finance']} />}>
                  <Route path="/finance/dashboard" element={<Suspense fallback={<CardSkeleton />}><FinanceDashboard /></Suspense>} />
                  <Route path="/finance/fees" element={<Suspense fallback={<CardSkeleton />}><AdminFeeManagementPage /></Suspense>} />
                  <Route path="/finance/history" element={<Suspense fallback={<CardSkeleton />}><AdminPaymentHistoryPage /></Suspense>} />
                  <Route path="/finance/salary" element={<Suspense fallback={<CardSkeleton />}><SalaryManagementPage /></Suspense>} />
                  <Route path="/finance/salary-history" element={<Suspense fallback={<CardSkeleton />}><SalaryHistoryPage /></Suspense>} />
                  <Route path="/finance/*" element={<Navigate to="/finance/dashboard" replace />} />
                </Route>

                {/* HOD Routes */}
                <Route element={<ProtectedRoute allowedRoles={['HOD']} />}>
                  <Route path="/hod/dashboard" element={<div className="glass" style={{ padding: '24px' }}>HOD Dashboard Coming Soon</div>} />
                </Route>

                {/* Faculty Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Faculty']} />}>
                    <Route path="/faculty/dashboard" element={<Suspense fallback={<CardSkeleton />}><StudentDashboard /></Suspense>} />
                    <Route path="/faculty/courses" element={<ComingSoon featureName="Faculty Courses" />} />
                    <Route path="/faculty/timetable" element={<StudentTimetable />} />
                    <Route path="/faculty/attendance" element={<FacultyAttendance />} />
                    <Route path="/faculty/assignments" element={<FacultyAssignments />} />
                    <Route path="/faculty/exams" element={<FacultyExams />} />
                    <Route path="/faculty/announcements" element={<Announcements />} />
                    <Route path="/faculty/events" element={<Events />} />
                    <Route path="/faculty/messages" element={<MessageCenter />} />
                    <Route path="/faculty/placements" element={<FacultyPlacements />} />
                    <Route path="/faculty/authorities" element={<Authorities />} />
                    <Route path="/faculty/profile" element={<ProfilePage />} />
                    <Route path="/faculty/*" element={<div className="glass" style={{ padding: '24px' }}>Faculty Module Coming Soon</div>} />
                </Route>

                <Route path="/settings" element={<div className="glass" style={{ padding: '24px' }}>Settings Module Coming Soon</div>} />
              </Route>

              {/* Student Specific Layout & Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
                <Route element={<Suspense fallback={<CardSkeleton />}><StudentDashboardLayout /></Suspense>}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/courses" element={<StudentCourses />} />
                  <Route path="/student/timetable" element={<StudentTimetable />} />
                  <Route path="/student/attendance" element={<StudentAttendance />} />
                  <Route path="/student/assignments" element={<StudentAssignments />} />
                  <Route path="/student/exams" element={<StudentExams />} />
                  <Route path="/student/fees" element={<StudentFees />} />
                  <Route path="/student/announcements" element={<Announcements />} />
                  <Route path="/student/events" element={<Events />} />
                  <Route path="/student/messages" element={<MessageCenter />} />
                  <Route path="/student/placements" element={<StudentPlacements />} />
                  <Route path="/student/authorities" element={<Authorities />} />
                  <Route path="/student/profile" element={<ProfilePage />} />
                  <Route path="/student/*" element={<StudentDashboard />} />
                </Route>
              </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </GlobalSocketWrapper>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
