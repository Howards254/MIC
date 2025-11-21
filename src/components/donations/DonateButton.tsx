import { useState } from 'react';
import { Heart } from 'lucide-react';
import DonateModal from './DonateModal';

export default function DonateButton({ project, variant = 'primary' }) {
  const [showModal, setShowModal] = useState(false);

  const buttonClasses = variant === 'primary'
    ? 'bg-green-600 hover:bg-green-700 text-white'
    : 'bg-white hover:bg-gray-50 text-green-600 border border-green-600';

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${buttonClasses}`}
      >
        <Heart className="w-4 h-4" />
        Donate
      </button>

      {showModal && (
        <DonateModal
          project={project}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
