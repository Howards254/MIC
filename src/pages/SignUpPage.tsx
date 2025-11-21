import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { showSuccess, showError, showInfo } from '../lib/toast';

export default function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: '', terms: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.fullName.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }

    if (!formData.role) {
      setError('Please select your role');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (!formData.terms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    
    try {
      // Sign up with Supabase Auth (profile will be created automatically by trigger)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard',
          data: {
            full_name: formData.fullName,
            role: formData.role,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Signup failed - no user returned');

      // Success! Profile is automatically created by database trigger
      const successMsg = 'Account created! Please check your email to verify your account.';
      setSuccess(successMsg);
      showSuccess(successMsg);
      showInfo('Check your spam folder if you don\'t see the email.');
      setTimeout(() => navigate('/signin'), 3000);
      
    } catch (err) {
      const error = err as Error;
      console.error('Signup error:', error);
      
      // User-friendly error messages
      let errorMsg = '';
      if (error.message?.includes('already registered')) {
        errorMsg = 'This email is already registered. Try signing in instead.';
      } else {
        errorMsg = error.message || 'Failed to create account. Please try again.';
      }
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join the movement to save our forests</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />

            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am signing up as
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'innovator'})}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.role === 'innovator'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Innovator</div>
                  <div className="text-sm text-gray-600 mt-1">Submit projects & post jobs</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'investor'})}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.role === 'investor'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Investor</div>
                  <div className="text-sm text-gray-600 mt-1">Fund sustainable projects</div>
                </button>
              </div>
            </div>

            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength={6}
            />

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                className="h-4 w-4 text-green-800 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-green-800 hover:text-green-900 font-medium">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-green-800 hover:text-green-900 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
