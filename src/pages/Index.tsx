
import AddressSearch from "@/components/AddressSearch";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { PageHeader } from "@/components/PageHeader";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 relative overflow-hidden">
      <AnimatedBackground />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <PageHeader />
        <AddressSearch />
      </div>
    </div>
  );
}

