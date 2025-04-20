
import { LocationPinIcon } from 'lucide-react';

export const PageHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center mb-6">
        <LocationPinIcon className="h-24 w-24 text-gray-700" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
        Public Protection Classification Lookup
      </h1>
      <p className="text-lg text-gray-600 animate-fade-in animation-delay-200">
        Discover detailed fire risk, protection data, and fire station information for addresses
      </p>
    </div>
  );
};
