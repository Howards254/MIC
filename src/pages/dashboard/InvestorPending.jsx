import { Clock, CheckCircle } from 'lucide-react';

export default function InvestorPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="text-yellow-600" size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Application Under Review
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for submitting your investor profile! Our admin team is currently reviewing your application.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-900 mb-1">What happens next?</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Admin reviews your profile</li>
                <li>• You'll receive an email notification</li>
                <li>• Once approved, full dashboard access</li>
              </ul>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          This usually takes 24-48 hours. You'll be notified via email once your application is reviewed.
        </p>
      </div>
    </div>
  );
}
