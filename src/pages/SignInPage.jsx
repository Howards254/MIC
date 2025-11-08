import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600">Welcome back to Maathai Innovation Catalyst</p>
        </div>

        <Card className="p-8">
          <form className="space-y-6">
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-green-800 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <a href="#" className="text-sm text-green-800 hover:text-green-900 font-medium">
                Forgot password?
              </a>
            </div>

            <Button fullWidth size="lg">Sign In</Button>
          </form>

          <div className="mt-6 text-center">
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
