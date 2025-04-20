
import farmersLogo from '@/assets/farmers-insurance-logo.png';

export const PageHeader = () => {
  console.log('Logo import path:', farmersLogo); // Added console log to check import

  return (
    <div className="text-center mb-12">
      <div className="flex justify-center mb-6">
        <img 
          src={farmersLogo} 
          alt="Farmers Insurance Logo" 
          className="h-24 w-auto object-contain" 
          onError={(e) => console.error('Image load error:', e)} // Added error handling
        />
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
