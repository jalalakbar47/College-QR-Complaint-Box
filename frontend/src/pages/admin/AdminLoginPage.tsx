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
        <Card className="p-6 sm:p-8 bg-slate-800/90 border border-slate-700 shadow-2xl backdrop-blur-md text-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Official Admin Email
              </label>
              <Input
                type="email"
                required
                placeholder="proctor@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Security Passkey / Password
              </label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
                className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-400"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Proctor ERP
              </Button>
            </div>
          </form>

          {/* Quick Login Helpers for Demo & Testing */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              Quick-Fill Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('chiefproctor@college.edu')}
                className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-700 border border-slate-700 text-slate-300 text-left transition-colors"
              >
                <span className="font-bold block text-white text-[11px]">Chief Proctor</span>
                <span className="text-[10px] text-slate-400 truncate block">chiefproctor@...</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@college.edu')}
                className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-700 border border-slate-700 text-slate-300 text-left transition-colors"
              >
                <span className="font-bold block text-white text-[11px]">Admin Staff</span>
                <span className="text-[10px] text-slate-400 truncate block">admin@college.edu</span>
              </button>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Student Portal Home
          </Link>
        </div>
      </div>
    </div>
  );
};
