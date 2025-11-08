import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join the movement to save our forests</p>
        </div>

        <Card className="p-8">
          <form className="space-y-6">
            <Input
              label="Full Name"
              id="name"
              type="text"
              placeholder="John Doe"
            />

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
              placeholder="Create a strong password"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a:
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="innovator"
                    name="userType"
                    type="radio"
                    className="h-4 w-4 text-green-800 focus:ring-green-500 border-gray-300"
                  />
                  <label htmlFor="innovator" className="ml-3 block text-sm text-gray-700">
                    Innovator (I have a project idea)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="investor"
                    name="userType"
                    type="radio"
                    className="h-4 w-4 text-green-800 focus:ring-green-500 border-gray-300"
                  />
                  <label htmlFor="investor" className="ml-3 block text-sm text-gray-700">
                    Investor (I want to fund projects)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="jobseeker"
                    name="userType"
                    type="radio"
                    className="h-4 w-4 text-green-800 focus:ring-green-500 border-gray-300"
                  />
                  <label htmlFor="jobseeker" className="ml-3 block text-sm text-gray-700">
                    Job Seeker (I'm looking for opportunities)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-green-800 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-green-800 hover:text-green-900 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-green-800 hover:text-green-900 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button fullWidth size="lg">Sign Up</Button>
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
