import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';
import { showSuccess, showError } from '../lib/toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setEmailSent(true);
      showSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      const error = err as Error;
      showError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">
            {emailSent 
              ? 'Check your email for reset instructions' 
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        <Card className="p-8">
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-700">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button 
                onClick={() => setEmailSent(false)} 
                variant="secondary" 
                fullWidth
              >
                Try Another Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" fullWidth size="lg" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/signin" className="text-green-800 hover:text-green-900 font-medium">
                Sign In
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-green-800 hover:text-green-900 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
