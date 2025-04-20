
import { Check, AlertTriangle, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';

const RiskCategoryInfo = () => {
  return (
    <Card className="p-6 bg-gray-900 text-white">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 pb-2 border-b border-gray-700">
          <div className="font-semibold">Risk Level</div>
          <div className="font-semibold">PPC / ALT_PPC Examples</div>
          <div className="font-semibold">Description</div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Check className="text-green-400" />
            <span>Low Risk</span>
          </div>
          <div className="flex gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">1-5</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">5/5X</span>
          </div>
          <div>Urban core or well-protected suburbs, strong water and fire response</div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-400" />
            <span>Moderate Risk</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">5X</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">10W</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">5X/10W</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">10W/10</span>
          </div>
          <div>Outskirts, weak hydrant access, some volunteer fire coverage</div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex items-center gap-2">
            <Flame className="text-red-400" />
            <span>High Risk</span>
          </div>
          <div className="flex gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">10</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">5X/10W/10</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">N/A</span>
          </div>
          <div>Remote, rural areas with minimal or no fire infrastructure</div>
        </div>
      </div>
    </Card>
  );
};

export default RiskCategoryInfo;
