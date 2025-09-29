import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users } from 'lucide-react';
import { unitsApi } from '../services/api';

interface UnitSelectorProps {
  divisionId: string;
  selectedUnitId?: string;
  onUnitSelect: (unitId?: string) => void;
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({
  divisionId,
  selectedUnitId,
  onUnitSelect
}) => {
  const { data: unitsData, isLoading } = useQuery({
    queryKey: ['units', divisionId],
    queryFn: () => unitsApi.getByDivision(divisionId),
    enabled: !!divisionId,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });

  const units = unitsData?.data || [];

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Building2 className="h-5 w-5 text-gray-600" />
          <span className="text-lg font-semibold text-gray-800">Division: {divisionId}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-md"></div>
          <div className="animate-pulse bg-gray-200 h-10 w-20 rounded-md"></div>
          <div className="animate-pulse bg-gray-200 h-10 w-28 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Building2 className="h-5 w-5 text-gray-600" />
        <span className="text-lg font-semibold text-gray-800">Division: {divisionId}</span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* All Units (Division) Button */}
        <button
          onClick={() => onUnitSelect(undefined)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            !selectedUnitId
              ? 'bg-slate-600 text-white hover:bg-slate-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>All Units</span>
        </button>

        {/* Individual Unit Buttons */}
        {units.map((unit) => (
          <button
            key={unit.unit_id}
            onClick={() => onUnitSelect(unit.unit_id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedUnitId === unit.unit_id
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>{unit.unit_name}</span>
          </button>
        ))}
      </div>
      
      {units.length === 0 && !isLoading && (
        <div className="text-gray-500 text-sm">
          No units found for this division
        </div>
      )}
    </div>
  );
};
