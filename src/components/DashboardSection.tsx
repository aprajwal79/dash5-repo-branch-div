import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardTile } from './DashboardTile';
import { DetailModal } from './DetailModal';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DashboardSectionProps {
  title: string;
  tiles: {
    title: string;
    queryKey: string;
    queryFn: () => Promise<any>;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    dataType: 'machine' | 'maintenance' | 'sparepart' | 'equipment';
  }[];
  sectionIcon?: React.ComponentType<{ className?: string }>;
  sectionColor?: string;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ title, tiles, sectionIcon, sectionColor = 'border-l-blue-500' }) => {
  const [selectedTile, setSelectedTile] = useState<{
    title: string;
    data: any[];
    dataType: 'machine' | 'maintenance' | 'sparepart' | 'equipment';
  } | null>(null);
  const [showFullSection, setShowFullSection] = useState(false);

  const tileQueries = tiles.map(tile => 
    useQuery({
      queryKey: [tile.queryKey],
      queryFn: tile.queryFn,
      refetchInterval: 30000, // Auto refresh every 30 seconds
      staleTime: 25000,
    })
  );

  // Calculate total count for the section
  const totalCount = tileQueries.reduce((sum, query) => {
    return sum + (query.data?.meta?.count || query.data?.data?.length || 0);
  }, 0);

  // Get first 4 tiles for preview
  const previewTiles = tiles.slice(0, 4);
  const previewQueries = tileQueries.slice(0, 4);

  // Professional, soft colors that are pleasant and easy on the eyes
  const getSectionBackgroundColor = (color: string) => {
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

  const handleTileClick = (tileIndex: number) => {
    const query = tileQueries[tileIndex];
    if (query.data) {
      setSelectedTile({
        title: tiles[tileIndex].title,
        data: query.data.data,
        dataType: tiles[tileIndex].dataType
      });
    }
  };

  if (!showFullSection) {
    // Show collapsed section as a small tile
    return (
      <div className={`${getSectionBackgroundColor(sectionColor)} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer p-4 transform hover:scale-105`}
           onClick={() => setShowFullSection(true)}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <ChevronRight className="h-4 w-4 text-white" />
            </div>
            
            {/* Preview grid of first 4 tiles */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {previewTiles.map((tile, index) => {
                const query = previewQueries[index];
                const count = query.data?.meta?.count || query.data?.data?.length || 0;
                const Icon = tile.icon;
                return (
                  <div key={tile.queryKey} className="bg-white bg-opacity-20 rounded p-2 flex items-center space-x-1">
                    <Icon className="h-3 w-3 text-white flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-white truncate">{tile.title}</div>
                      <div className="text-sm font-semibold text-white">
                        {query.isLoading ? '...' : count.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-sm text-white">
              Total: <span className="font-semibold">{totalCount.toLocaleString()}</span>
              {tiles.length > 4 && (
                <span className="ml-1 text-white text-xs opacity-80">+{tiles.length - 4} more</span>
              )}
            </div>
          </div>
          
          {sectionIcon && (
            <div className="p-2 rounded-full bg-white bg-opacity-20 ml-3">
              {React.createElement(sectionIcon, { className: 'h-6 w-6 text-white' })}
            </div>
          )}
        </div>
        
        {selectedTile && (
          <DetailModal
            isOpen={true}
            onClose={() => setSelectedTile(null)}
            title={selectedTile.title}
            data={selectedTile.data}
            type={selectedTile.dataType}
          />
        )}
      </div>
    );
  }

  // Show full section page with all tiles
  if (showFullSection) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto">
        <div className="min-h-screen p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                {sectionIcon && React.createElement(sectionIcon, { className: 'h-8 w-8 text-gray-700' })}
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
              </div>
              <button
                onClick={() => setShowFullSection(false)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-md transition-colors border shadow-sm"
              >
                <ChevronDown className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tiles.map((tile, index) => {
                const query = tileQueries[index];
                return (
                  <DashboardTile
                    key={tile.queryKey}
                    title={tile.title}
                    count={query.data?.meta?.count || query.data?.data?.length || 0}
                    icon={tile.icon}
                    color={tile.color}
                    onClick={() => handleTileClick(index)}
                    loading={query.isLoading}
                  />
                );
              })}
            </div>
            
            {selectedTile && (
              <DetailModal
                isOpen={true}
                onClose={() => setSelectedTile(null)}
                title={selectedTile.title}
                data={selectedTile.data}
                type={selectedTile.dataType}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // This should never render now since we removed the expanded inline view
  return null;
};