import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import { Target, Shield, BarChart3, Globe } from 'lucide-react';

export default function InvestorsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-green-800 text-white py-20">
        <PageShell>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">For Investors</h1>
            <p className="text-xl mb-8">
              Invest in vetted, high-impact sustainable startups that are creating alternatives to traditional wood products and fighting deforestation.
            </p>
          </div>
        </PageShell>
      </section>

      <PageShell>
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <Target className="text-green-800" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Vetted Opportunities</h2>
              </div>
              <p className="text-gray-600 text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Every project on our platform undergoes rigorous evaluation to ensure viability, impact potential, and alignment with sustainability goals.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <Shield className="text-yellow-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Secure Platform</h2>
              </div>
              <p className="text-gray-600 text-lg">
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Our platform provides transparent reporting, secure transactions, and regular updates on your investments.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <BarChart3 className="text-green-800" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Track Performance</h2>
              </div>
              <p className="text-gray-600 text-lg">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Monitor your portfolio with real-time analytics and detailed performance metrics across all your investments.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <Globe className="text-yellow-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Global Impact</h2>
              </div>
              <p className="text-gray-600 text-lg">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. Make investments that generate both financial returns and measurable environmental impact worldwide.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-12 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Investment Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Apply</h3>
                <p className="text-gray-600 text-sm">
                  Submit your investor profile for verification
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Approved</h3>
                <p className="text-gray-600 text-sm">
                  Our team reviews and approves qualified investors
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Browse Projects</h3>
                <p className="text-gray-600 text-sm">
                  Explore vetted opportunities in your areas of interest
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Invest</h3>
                <p className="text-gray-600 text-sm">
                  Fund projects and track your impact portfolio
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Invest in Wood Alternatives?</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. The wood alternative industry is experiencing rapid growth as consumers and businesses seek sustainable solutions.
              </p>
              <p>
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. Environmental regulations are increasingly favoring sustainable materials, creating massive market opportunities for innovative wood alternatives.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Early-stage investments in this sector offer significant potential for both financial returns and positive environmental impact.
              </p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Make an Impact?</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join our community of forward-thinking investors who are funding the future of sustainable materials.
            </p>
            <Button size="lg">Apply to Invest</Button>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
