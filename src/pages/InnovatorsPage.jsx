import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import { Lightbulb, Users, TrendingUp, Award } from 'lucide-react';

export default function InnovatorsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-green-800 text-white py-20">
        <PageShell>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">For Innovators</h1>
            <p className="text-xl mb-8">
              Turn your sustainable wood-alternative ideas into reality with funding, mentorship, and support from our global community.
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
                  <Lightbulb className="text-green-800" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Submit Your Innovation</h2>
              </div>
              <p className="text-gray-600 text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Present your groundbreaking ideas for wood alternatives and sustainable materials to our community of investors and supporters.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <Users className="text-yellow-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Connect with Experts</h2>
              </div>
              <p className="text-gray-600 text-lg">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Get matched with industry experts, mentors, and advisors who can guide your project to success.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <TrendingUp className="text-green-800" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Secure Funding</h2>
              </div>
              <p className="text-gray-600 text-lg">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Access capital from vetted investors who are passionate about environmental sustainability and innovation.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <Award className="text-yellow-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Build Your Brand</h2>
              </div>
              <p className="text-gray-600 text-lg">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Gain visibility and credibility through our platform and community endorsement.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-12 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">The Innovator Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Submit Project</h3>
                <p className="text-gray-600 text-sm">
                  Share your idea and vision with our community
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Review Process</h3>
                <p className="text-gray-600 text-sm">
                  Our team evaluates your project for feasibility
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Funded</h3>
                <p className="text-gray-600 text-sm">
                  Connect with investors and raise capital
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Build & Launch</h3>
                <p className="text-gray-600 text-sm">
                  Execute your vision and change the world
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
            </p>
            <Button size="lg">Submit Your Project</Button>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
