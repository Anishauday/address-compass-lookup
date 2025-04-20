
import { Map, Image, Images } from 'lucide-react';

export const PageHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center gap-4 mb-6">
        <Map className="w-12 h-12 text-indigo-600 animate-bounce" />
        <Image className="w-12 h-12 text-purple-600 animate-pulse" />
        <Images className="w-12 h-12 text-pink-600 animate-bounce animation-delay-2000" />
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

