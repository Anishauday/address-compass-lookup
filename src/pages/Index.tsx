
import AddressSearch from "@/components/AddressSearch";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute animate-blob top-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute animate-blob animation-delay-2000 top-[50%] left-[-10%] w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute animate-blob animation-delay-4000 bottom-[-10%] right-[20%] w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
            Address to PPC Lookup
          </h1>
          <p className="text-lg text-gray-600 animate-fade-in animation-delay-200">
            Fast and accurate PPC record matching for your addresses
          </p>
        </div>
        <AddressSearch />
      </div>
    </div>
  );
}
