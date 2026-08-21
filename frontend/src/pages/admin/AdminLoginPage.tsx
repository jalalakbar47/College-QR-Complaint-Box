import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
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

  const [email, setEmail] = useState<string>('');
  const [passkey, setPasskey] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  return (
    <div
      className="min-h-screen bg-ink-navy flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: '#101B36' }}
    >
      {/* Subtle fine dot-grid texture on full-bleed ink-navy background */}
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

      {/* Centered Institutional Login Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm relative z-10">
        <Card className="p-6 sm:p-8 bg-paper-card border border-hairline shadow-lg rounded-xl">
          {/* Top Seal-Gold Official Badge */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-seal-gold/15 border border-seal-gold/30 flex items-center justify-center text-seal-gold shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Institutional Title & Subtitle */}
          <div className="text-center mb-6">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-muted font-medium block mb-1">
              {ENV.COLLEGE_NAME || 'Government Post Graduate College Khar District Bajaur'}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink-navy tracking-tight mb-1">
              Chief Proctor Panel
            </h1>
            <p className="text-xs text-ink-muted leading-relaxed">
              Authorized administrative access to campus complaint records
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subtle Inline Error State */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-case-red/10 border border-case-red/20 text-case-red text-xs font-medium flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            <div>
              <Input
                label="Official Admin Email"
                type="email"
                required
                placeholder="proctor@college.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                leftIcon={<Mail className="w-4 h-4 text-ink-muted" />}
                className={errorMessage ? 'border-case-red/50' : ''}
              />
            </div>

            <div>
              <Input
                label="Security Passkey / Password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                leftIcon={<KeyRound className="w-4 h-4 text-ink-muted" />}
                className={errorMessage ? 'border-case-red/50' : ''}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-ink-muted hover:text-ink-navy focus:outline-none transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-medium py-3 min-h-[44px]"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Chief Proctor Panel
              </Button>
            </div>
          </form>
        </Card>

        {/* Quiet Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-mono text-ink-muted hover:text-white transition-colors inline-flex items-center gap-1 hover:underline"
          >
            ← Return to Student Portal Home
          </Link>
        </div>
      </div>
    </div>
  );
};
