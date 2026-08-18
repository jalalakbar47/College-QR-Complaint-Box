import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ENV } from '../../config/env';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();

  const [email, setEmail] = useState<string>('chiefproctor@college.edu');
  const [passkey, setPasskey] = useState<string>('proctor2026');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter an authorized administrator email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await login(email, passkey);
    if (result.success) {
      toastSuccess('Signed in successfully.');
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } else {
      setErrorMessage(result.message || 'Invalid credentials or inactive administrative account.');
      toastError(result.message || 'Authentication failed.');
    }
    setIsSubmitting(false);
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPasskey('proctor2026');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative text-center mb-8">
        <Link to="/" className="inline-flex items-center justify-center mb-4 group">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </Link>
        <span className="block text-xs font-bold uppercase tracking-widest text-brand-400 mb-1">
          {ENV.COLLEGE_NAME}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Chief Proctor & Admin Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Authorized administrative access to campus grievance records
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 shadow-2xl rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div>
              <Input
                label="Official Admin Email"
                type="email"
                required
                placeholder="proctor@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
              />
            </div>

            <div>
              <Input
                label="Security Passkey / Password"
                type="password"
                required
                placeholder="••••••••"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                leftIcon={<KeyRound className="w-4 h-4 text-slate-500" />}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 shadow-md shadow-brand-500/20"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Proctor ERP
              </Button>
            </div>
          </form>

          {/* Quick Login Helpers for Demo & Testing */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 text-center">
              Quick-Fill Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('chiefproctor@college.edu')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-left transition-all group"
              >
                <span className="font-bold block text-slate-900 group-hover:text-brand-700 text-xs">Chief Proctor</span>
                <span className="text-[11px] text-slate-500 truncate block mt-0.5">chiefproctor@...</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@college.edu')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-left transition-all group"
              >
                <span className="font-bold block text-slate-900 group-hover:text-brand-700 text-xs">Admin Staff</span>
                <span className="text-[11px] text-slate-500 truncate block mt-0.5">admin@college.edu</span>
              </button>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-slate-300 hover:text-white font-medium transition-colors inline-flex items-center gap-1 hover:underline"
          >
            ← Return to Student Portal Home
          </Link>
        </div>
      </div>
    </div>
  );
};
