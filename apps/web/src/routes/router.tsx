import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Role } from '@ribbon/shared';
import { DashboardShell, RequireRole } from '@/components/layout';
import { RouteError } from '@/components/RouteError';
import { LoginPage, SignupPage } from '@/features/auth/AuthPages';
import { AdminUsersPage } from '@/features/admin/AdminUsersPage';
import { TeacherCoursesPage } from '@/features/teacher/TeacherCoursesPage';
import { TeacherCourseEditorPage } from '@/features/teacher/TeacherCourseEditorPage';
import { TeacherAnalyticsPage } from '@/features/teacher/TeacherAnalyticsPage';
import { StudentCatalogPage } from '@/features/student/StudentCatalogPage';
import { StudentCoursePlayerPage } from '@/features/student/StudentCoursePlayerPage';
import { StudentLearningPage } from '@/features/student/StudentLearningPage';
import { RootRedirect } from './RootRedirect';

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },

  {
    path: '/admin',
    element: (
      <RequireRole role={Role.ADMIN}>
        <DashboardShell />
      </RequireRole>
    ),
    children: [{ index: true, element: <AdminUsersPage />, errorElement: <RouteError /> }],
  },

  {
    path: '/teacher',
    element: (
      <RequireRole role={Role.TEACHER}>
        <DashboardShell />
      </RequireRole>
    ),
    children: [
      { index: true, element: <TeacherCoursesPage />, errorElement: <RouteError /> },
      { path: 'courses/:id', element: <TeacherCourseEditorPage />, errorElement: <RouteError /> },
      {
        path: 'courses/:id/analytics',
        element: <TeacherAnalyticsPage />,
        errorElement: <RouteError />,
      },
    ],
  },

  {
    path: '/student',
    element: (
      <RequireRole role={Role.STUDENT}>
        <DashboardShell />
      </RequireRole>
    ),
    children: [
      { index: true, element: <StudentCatalogPage />, errorElement: <RouteError /> },
      { path: 'learning', element: <StudentLearningPage />, errorElement: <RouteError /> },
      { path: 'courses/:id', element: <StudentCoursePlayerPage />, errorElement: <RouteError /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
