
import { MapPinned } from 'lucide-react';

export const PageHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center mb-6">
        <MapPinned className="w-12 h-12 text-indigo-600 animate-bounce" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
        Address to PPC Lookup
      </h1>
      <p className="text-lg text-gray-600 animate-fade-in animation-delay-200">
        Fast and accurate PPC record matching for your addresses
      </p>
    </div>
  );
};
