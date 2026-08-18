import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Layouts
import { StudentLayout } from './components/layout/StudentLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { ComplaintFormPage } from './pages/public/ComplaintFormPage';
import { SubmissionSuccessPage } from './pages/public/SubmissionSuccessPage';
import { TrackComplaintPage } from './pages/public/TrackComplaintPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminComplaintDetailPage } from './pages/admin/AdminComplaintDetailPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminLocationsPage } from './pages/admin/AdminLocationsPage';
import { AdminActivityLogPage } from './pages/admin/AdminActivityLogPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Student / Public Routes */}
            <Route element={<StudentLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/complaint" element={<ComplaintFormPage />} />
              <Route path="/complaint/success" element={<SubmissionSuccessPage />} />
              <Route path="/track" element={<TrackComplaintPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin ERP Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="complaints" element={<AdminComplaintsPage />} />
              <Route path="complaints/:id" element={<AdminComplaintDetailPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="locations" element={<AdminLocationsPage />} />
              <Route path="activity-log" element={<AdminActivityLogPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
