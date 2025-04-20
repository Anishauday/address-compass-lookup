
import AddressSearch from "@/components/AddressSearch";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Address to PPC Lookup
          </h1>
          <p className="text-lg text-gray-600">
            Fast and accurate PPC record matching for your addresses
          </p>
        </div>
        <AddressSearch />
      </div>
    </div>
  );
}
