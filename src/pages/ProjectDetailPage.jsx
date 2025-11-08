import { useParams } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Card from '../components/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ProjectDetailPage() {
  const { id } = useParams();

  const fundingGoal = 100000;
  const fundsRaised = 80000;
  const fundingPercentage = (fundsRaised / fundingGoal) * 100;

  return (
    <PageShell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bamboo Composite Building Materials</h1>
          <p className="text-green-800 font-semibold mb-6">Category: Sustainable Materials</p>

          <div className="mb-8">
            <img
              src="https://placehold.co/800x500/cccccc/FFFFFF?text=Project+Image"
              alt="Project"
              className="w-full rounded-lg mb-4"
            />

            <div className="grid grid-cols-3 gap-4">
              <img
                src="https://placehold.co/250x150/cccccc/FFFFFF?text=1"
                alt="Thumbnail"
                className="w-full rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
              />
              <img
                src="https://placehold.co/250x150/cccccc/FFFFFF?text=2"
                alt="Thumbnail"
                className="w-full rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
              />
              <img
                src="https://placehold.co/250x150/cccccc/FFFFFF?text=3"
                alt="Thumbnail"
                className="w-full rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Project</h2>
            <div className="prose max-w-none text-gray-600 space-y-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Updates</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Manufacturing Partnership Secured</h3>
                <p className="text-sm text-gray-500 mb-3">Posted 3 days ago</p>
                <p className="text-gray-600">
                  We are excited to announce a new manufacturing partnership that will help us scale production and reach our sustainability goals faster.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Prototype Testing Complete</h3>
                <p className="text-sm text-gray-500 mb-3">Posted 1 week ago</p>
                <p className="text-gray-600">
                  Our bamboo composite materials have successfully passed all structural testing requirements and are ready for commercial production.
                </p>
              </Card>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6">
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-green-800 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${fundingPercentage}%` }}
                />
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Raised:</span>
                  <span className="text-2xl font-bold text-green-800">
                    ${fundsRaised.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Goal:</span>
                  <span className="text-lg text-gray-900">
                    ${fundingGoal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Backers:</span>
                  <span className="text-lg text-gray-900">124</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Days Left:</span>
                  <span className="text-lg text-gray-900">15</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Donate to this project</h3>

              <div className="mb-4">
                <Input
                  label="Enter Amount"
                  type="number"
                  placeholder="$100"
                />
              </div>

              <Button fullWidth size="lg">Donate Now</Button>

              <p className="text-sm text-gray-500 text-center mt-4">
                Your donation will help save our forests and support sustainable innovation.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
