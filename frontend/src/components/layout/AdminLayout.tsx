import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <LoadingSpinner size="lg" label="Validating administrator credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Proctor & Admin Overview';
    if (path.includes('/admin/complaints/')) return 'Complaint Details & Action';
    if (path.includes('/admin/complaints')) return 'Complaint Records Repository';
    if (path.includes('/admin/categories')) return 'Complaint Categories';
    if (path.includes('/admin/locations')) return 'Campus Locations Directory';
    if (path.includes('/admin/activity-log')) return 'Compliance & Audit Trail';
    if (path.includes('/admin/settings')) return 'Campus QR Studio & Settings';
    return 'Admin Management';
  };

  return (
    <div className="min-h-screen bg-paper text-ink-navy flex">
      {/* Persistent Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={getPageTitle()}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
