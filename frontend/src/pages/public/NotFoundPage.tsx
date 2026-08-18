import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-5 max-w-md">
        <div className="inline-block text-6xl sm:text-7xl font-black text-brand-600 tracking-tight">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-sm text-slate-500">
          The page or grievance link you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/complaint">
            <Button variant="outline" size="md">
              Submit Grievance
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
