
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const RiskCategoryInfo = () => {
  return (
    <Card className="p-6 border border-indigo-100 shadow-md bg-gradient-to-r from-indigo-50 to-purple-50">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Understanding Risk Categories</h3>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-medium text-gray-500 pb-2 border-b border-gray-200">
          <div>Risk Level</div>
          <div>PPC / ALT_PPC Examples</div>
          <div>Description</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <span className="font-medium text-gray-800">Low Risk</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">1-5</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">5/5X</span>
          </div>
          <div className="text-gray-600">
            Urban core or well-protected areas with strong water supply and professional fire departments nearby
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-gray-800">Moderate Risk</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">5X</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">10W</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">5X/10W</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">10W/10</span>
          </div>
          <div className="text-gray-600">
            Suburban areas with limited hydrant access or partial volunteer fire department coverage
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <span className="font-medium text-gray-800">High Risk</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">10</span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">5X/10W/10</span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">N/A</span>
          </div>
          <div className="text-gray-600">
            Rural or remote locations with minimal or no fire infrastructure and limited water sources
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
        Note: Risk categories help determine insurance rates and property protection requirements.
      </div>
    </Card>
  );
};

export default RiskCategoryInfo;
