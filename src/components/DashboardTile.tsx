import React from 'react';

interface DashboardTileProps {
  title: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
  loading?: boolean;
}

export const DashboardTile: React.FC<DashboardTileProps> = ({
  title,
  count,
  icon: Icon,
  color,
  onClick,
  loading = false
}) => {
  // Professional, soft colors that are pleasant and easy on the eyes
  const getBackgroundColor = (color: string) => {
    if (color.includes('blue')) return 'bg-slate-600 hover:bg-slate-700'; // Soft slate blue
    if (color.includes('green')) return 'bg-emerald-600 hover:bg-emerald-700'; // Soft emerald green
    if (color.includes('red')) return 'bg-rose-500 hover:bg-rose-600'; // Soft rose red
    if (color.includes('yellow')) return 'bg-amber-500 hover:bg-amber-600'; // Soft amber yellow
    if (color.includes('purple')) return 'bg-violet-600 hover:bg-violet-700'; // Soft violet purple
    if (color.includes('orange')) return 'bg-orange-500 hover:bg-orange-600'; // Soft orange
    if (color.includes('pink')) return 'bg-pink-500 hover:bg-pink-600'; // Soft pink
    if (color.includes('indigo')) return 'bg-indigo-600 hover:bg-indigo-700'; // Soft indigo
    if (color.includes('gray')) return 'bg-gray-600 hover:bg-gray-700'; // Soft gray
    return 'bg-slate-600 hover:bg-slate-700'; // default soft slate
  };

  return (
    <div
      onClick={onClick}
      className={`${getBackgroundColor(color)} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer p-4 transform hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon className="h-5 w-5 text-white" />
            <h3 className="text-sm font-medium text-white">{title}</h3>
          </div>
          <div className="text-2xl font-bold text-white">
            {loading ? (
              <div className="animate-pulse bg-white bg-opacity-30 h-6 w-12 rounded"></div>
            ) : (
              <span>{count.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};