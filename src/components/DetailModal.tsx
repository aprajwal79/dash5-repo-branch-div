import React, { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react';
import { Machine, BreakdownMaintenance, SparePart, Equipment } from '../types';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: (Machine | BreakdownMaintenance | SparePart | Equipment)[];
  type: 'machine' | 'maintenance' | 'sparepart' | 'equipment';
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  type
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const itemsPerPage = 100;

  // Filter data by date for maintenance types
  const filteredData = useMemo(() => {
    if (type !== 'maintenance' || (!startDate && !endDate)) {
      return data;
    }

    return data.filter((item) => {
      const maintenanceItem = item as BreakdownMaintenance;
      if (!maintenanceItem.maintainance_date) return true;
      
      const itemDate = new Date(maintenanceItem.maintainance_date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      
      return true;
    });
  }, [data, startDate, endDate, type]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Get current page data
  const currentPageData = useMemo(() => {
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, startIndex, endIndex]);

  // Reset to first page when data or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data, startDate, endDate]);

  // Clear date filters
  const clearDateFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  if (!isOpen) return null;

  const renderMachineRow = (machine: Machine) => (
    <tr key={machine.id} className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{machine.machine_id}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{machine.machine_type?.machine_type || 'N/A'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{machine.make || 'N/A'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{machine.model || 'N/A'}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
          machine.status === 'Active' ? 'bg-green-100 text-green-800' :
          machine.status === 'Breakdown' ? 'bg-red-100 text-red-800' :
          machine.status === 'Under Service' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {machine.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{machine.ownership}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{machine.unit?.unit_name || 'N/A'}</td>
    </tr>
  );

  const renderMaintenanceRow = (maintenance: BreakdownMaintenance) => (
    <tr key={maintenance.id} className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{maintenance.id}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{maintenance.broken_machine?.machine_id || 'N/A'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{maintenance.maintainance_type === 'breakdown' ? (maintenance['breakdown-category'] || 'N/A') : 'Preventive'}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
          maintenance.status.includes('Resolved') || maintenance.status.includes('Assigned') ? 'bg-green-100 text-green-800' :
          maintenance.status.includes('Escalated') || maintenance.status.includes('Not Attended') ? 'bg-red-100 text-red-800' :
          maintenance.status.includes('Pending') ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {maintenance.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{maintenance.broken_machine?.make || 'N/A'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{maintenance.broken_machine?.model || 'N/A'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{maintenance.assigned_to?.username || 'Unassigned'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {maintenance.maintainance_date ? new Date(maintenance.maintainance_date).toLocaleDateString() : 'N/A'}
      </td>
    </tr>
  );

  const renderSparePartRow = (sparePart: SparePart) => (
    <tr key={sparePart.id} className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{sparePart['spare-parts-item']?.['spare-parts-item-no'] || 'N/A'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{sparePart['spare-parts-item']?.spares_description || 'N/A'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{sparePart['available-qty']}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{sparePart['critical-qty']}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
          sparePart.status === 'In Stock' ? 'bg-green-100 text-green-800' :
          sparePart.status === 'Critical' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {sparePart.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{sparePart.unit?.unit_name || 'N/A'}</td>
    </tr>
  );

  const renderEquipmentRow = (equipment: Equipment) => (
    <tr key={equipment.id} className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{equipment['equipment-id']}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{equipment['equipment-type']?.['equipment-type'] || 'N/A'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{equipment.make || 'N/A'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{equipment.model || 'N/A'}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
          equipment.Status === 'Working' ? 'bg-green-100 text-green-800' :
          equipment.Status === 'Under Service' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {equipment.Status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{equipment.unit?.unit_name || 'N/A'}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{equipment.location?.location_id || 'N/A'}</td>
    </tr>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            {type === 'maintenance' && (
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  showDateFilter || startDate || endDate
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Date Filter</span>
                {(startDate || endDate) && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {filteredData.length}
                  </span>
                )}
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Date Filter Panel */}
        {type === 'maintenance' && showDateFilter && (
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={clearDateFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Clear
                </button>
              )}
              <div className="text-sm text-gray-600">
                Showing {filteredData.length} of {data.length} records
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-auto max-h-[70vh]">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>{data.length === 0 ? 'No data available' : 'No records match the selected date range'}</p>
              {data.length > 0 && filteredData.length === 0 && (startDate || endDate) && (
                <button
                  onClick={clearDateFilters}
                  className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Clear date filters
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {type === 'machine' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Make</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ownership</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                    </>
                  )}
                  {type === 'maintenance' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Make</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maintenance Date</th>
                    </>
                  )}
                  {type === 'sparepart' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Critical Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                    </>
                  )}
                  {type === 'equipment' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Make</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPageData.map((item) => {
                  switch (type) {
                    case 'machine':
                      return renderMachineRow(item as Machine);
                    case 'maintenance':
                      return renderMaintenanceRow(item as BreakdownMaintenance);
                    case 'sparepart':
                      return renderSparePartRow(item as SparePart);
                    case 'equipment':
                      return renderEquipmentRow(item as Equipment);
                    default:
                      return null;
                  }
                })}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Controls */}
        {filteredData.length > itemsPerPage && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                {filteredData.length !== data.length && (
                  <span className="text-gray-500 ml-1">(filtered from {data.length})</span>
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};