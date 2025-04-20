
import { MapPinned } from 'lucide-react';
import farmersLogo from '@/assets/farmers-insurance-logo.png';

export const PageHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center items-center mb-6 space-x-4">
        <img 
          src={farmersLogo} 
          alt="Farmers Insurance Logo" 
          className="h-16 w-auto object-contain" 
        />
        <MapPinned className="w-12 h-12 text-indigo-600 animate-bounce" />
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
