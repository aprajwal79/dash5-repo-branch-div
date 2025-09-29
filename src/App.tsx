import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  Cog, 
  Zap, 
  Settings, 
  Wrench, 
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Award,
  Gauge
} from 'lucide-react';
import { DashboardSection } from './components/DashboardSection';
import { UnitSelector } from './components/UnitSelector';
import { useUrlParams } from './hooks/useUrlParams';
import { 
  machinesApi, 
  breakdownMaintenanceApi, 
  periodicMaintenanceApi, 
  sparePartsApi, 
  equipmentApi 
} from './services/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function Dashboard() {
  const { divisionId } = useUrlParams();
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>(undefined);

  const machinesTiles = [
    {
      title: 'Total Machines',
      queryKey: `machines-total-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getAll(divisionId, {}, selectedUnitId),
      icon: Cog,
      color: 'border-l-blue-500',
      dataType: 'machine' as const
    },
    {
      title: 'Active Machines',
      queryKey: `machines-active-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByStatus('Active', divisionId, selectedUnitId),
      icon: CheckCircle,
      color: 'border-l-green-500',
      dataType: 'machine' as const
    },
    {
      title: 'Under Service',
      queryKey: `machines-service-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByStatus('Service', divisionId, selectedUnitId),
      icon: Wrench,
      color: 'border-l-yellow-500',
      dataType: 'machine' as const
    },
    {
      title: 'Idle Machines',
      queryKey: `machines-idle-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByStatus('Idle', divisionId, selectedUnitId),
      icon: Clock,
      color: 'border-l-gray-500',
      dataType: 'machine' as const
    },
    {
      title: 'In Transit',
      queryKey: `machines-transit-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByStatus('Moving', divisionId, selectedUnitId),
      icon: TrendingUp,
      color: 'border-l-purple-500',
      dataType: 'machine' as const
    },
    {
      title: 'Owned Machines',
      queryKey: `machines-owned-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByOwnership('Owned', divisionId, selectedUnitId),
      icon: Users,
      color: 'border-l-indigo-500',
      dataType: 'machine' as const
    },
    {
      title: 'Rented Machines',
      queryKey: `machines-rented-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByOwnership('Rented', divisionId, selectedUnitId),
      icon: Package,
      color: 'border-l-orange-500',
      dataType: 'machine' as const
    },
    {
      title: 'Demo Machines',
      queryKey: `machines-demo-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByOwnership('Demo', divisionId, selectedUnitId),
      icon: Settings,
      color: 'border-l-pink-500',
      dataType: 'machine' as const
    },
    {
      title: 'Broken Machines',
      queryKey: `machines-breakdown-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByStatus('Breakdown', divisionId, selectedUnitId),
      icon: AlertTriangle,
      color: 'border-l-red-500',
      dataType: 'machine' as const
    }
  ];

  const amcWarrantyTiles = [
    {
      title: 'AMC Active',
      queryKey: `machines-amc-active-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByAMC('Yes', divisionId, selectedUnitId),
      icon: Shield,
      color: 'border-l-green-500',
      dataType: 'machine' as const
    },
    {
      title: 'No AMC',
      queryKey: `machines-amc-inactive-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByAMC('No', divisionId, selectedUnitId),
      icon: AlertTriangle,
      color: 'border-l-red-500',
      dataType: 'machine' as const
    },
    {
      title: 'Under Warranty',
      queryKey: `machines-warranty-active-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByWarranty('Yes', divisionId, selectedUnitId),
      icon: Award,
      color: 'border-l-blue-500',
      dataType: 'machine' as const
    },
    {
      title: 'No Warranty',
      queryKey: `machines-warranty-inactive-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByWarranty('No', divisionId, selectedUnitId),
      icon: AlertTriangle,
      color: 'border-l-red-500',
      dataType: 'machine' as const
    }
  ];

  const calibrationTiles = [
    {
      title: 'Calibration Required',
      queryKey: `machines-calibration-required-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByCalibration('Yes', divisionId, selectedUnitId),
      icon: Gauge,
      color: 'border-l-yellow-500',
      dataType: 'machine' as const
    },
    {
      title: 'No Calibration',
      queryKey: `machines-calibration-not-required-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => machinesApi.getByCalibration('No', divisionId, selectedUnitId),
      icon: CheckCircle,
      color: 'border-l-green-500',
      dataType: 'machine' as const
    }
  ];

  const breakdownMaintenanceTiles = [
    {
      title: 'Total Breakdown',
      queryKey: `breakdown-total-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => breakdownMaintenanceApi.getAll(divisionId, {}, undefined, selectedUnitId),
      icon: AlertTriangle,
      color: 'border-l-red-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Assigned Breakdown',
      queryKey: `breakdown-assigned-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => breakdownMaintenanceApi.getByStatus('Assigned', divisionId, undefined, selectedUnitId),
      icon: CheckCircle,
      color: 'border-l-green-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Escalated Breakdown',
      queryKey: `breakdown-escalated-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => breakdownMaintenanceApi.getByStatus('Escalated', divisionId, undefined, selectedUnitId),
      icon: TrendingUp,
      color: 'border-l-orange-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Not Attended Breakdown',
      queryKey: `breakdown-not-attended-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => breakdownMaintenanceApi.getByStatus('Not Attended', divisionId, undefined, selectedUnitId),
      icon: AlertTriangle,
      color: 'border-l-red-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Pending Approval',
      queryKey: `breakdown-pending-approval-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => breakdownMaintenanceApi.getByStatus('Pending Approval', divisionId, undefined, selectedUnitId),
      icon: Clock,
      color: 'border-l-yellow-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Resolved Breakdown',
      queryKey: `breakdown-resolved-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => breakdownMaintenanceApi.getByStatus('Resolved', divisionId, undefined, selectedUnitId),
      icon: CheckCircle,
      color: 'border-l-green-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Electrical Breakdown',
      queryKey: `breakdown-electrical-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => breakdownMaintenanceApi.getByCategory('Electrical Breakdown', divisionId, undefined, selectedUnitId),
      icon: Zap,
      color: 'border-l-yellow-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Mechanical Breakdown',
      queryKey: `breakdown-mechanical-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => breakdownMaintenanceApi.getByCategory('Mechanical Breakdown', divisionId, undefined, selectedUnitId),
      icon: Cog,
      color: 'border-l-orange-500',
      dataType: 'maintenance' as const
    }
  ];

  const periodicMaintenanceTiles = [
    {
      title: 'Total Periodic',
      queryKey: `periodic-total-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => periodicMaintenanceApi.getAll(divisionId, {}, undefined, selectedUnitId),
      icon: Calendar,
      color: 'border-l-blue-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Assigned Periodic',
      queryKey: `periodic-assigned-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => periodicMaintenanceApi.getByStatus('Assigned', divisionId, undefined, selectedUnitId),
      icon: CheckCircle,
      color: 'border-l-green-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Not Attended Periodic',
      queryKey: `periodic-not-attended-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => periodicMaintenanceApi.getByStatus('Not Attended', divisionId, undefined, selectedUnitId),
      icon: AlertTriangle,
      color: 'border-l-red-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Escalated Periodic',
      queryKey: `periodic-escalated-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => periodicMaintenanceApi.getByStatus('Escalated', divisionId, undefined, selectedUnitId),
      icon: TrendingUp,
      color: 'border-l-orange-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Pending Approval Periodic',
      queryKey: `periodic-pending-approval-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => periodicMaintenanceApi.getByStatus('Pending Approval', divisionId, undefined, selectedUnitId),
      icon: Clock,
      color: 'border-l-yellow-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Resolved Periodic',
      queryKey: `periodic-resolved-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => periodicMaintenanceApi.getByStatus('Resolved', divisionId, undefined, selectedUnitId),
      icon: CheckCircle,
      color: 'border-l-green-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Pending Periodic',
      queryKey: `periodic-pending-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => periodicMaintenanceApi.getByStatus('Pending', divisionId, undefined, selectedUnitId),
      icon: Clock,
      color: 'border-l-yellow-500',
      dataType: 'maintenance' as const
    },
    {
      title: 'Upcoming Periodic',
      queryKey: `periodic-upcoming-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => periodicMaintenanceApi.getByStatus('Upcoming', divisionId, undefined, selectedUnitId),
      icon: Calendar,
      color: 'border-l-purple-500',
      dataType: 'maintenance' as const
    }
  ];

  const sparePartsTiles = [
    {
      title: 'Total Stock',
      queryKey: `spares-total-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => sparePartsApi.getAll(divisionId, {}, selectedUnitId),
      icon: Package,
      color: 'border-l-blue-500',
      dataType: 'sparepart' as const
    },
    {
      title: 'In Stock',
      queryKey: `spares-in-stock-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => sparePartsApi.getByStatus('In Stock', divisionId, selectedUnitId),
      icon: CheckCircle,
      color: 'border-l-green-500',
      dataType: 'sparepart' as const
    },
    {
      title: 'Critical Stock',
      queryKey: `spares-critical-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => sparePartsApi.getByStatus('Critical', divisionId, selectedUnitId),
      icon: AlertTriangle,
      color: 'border-l-yellow-500',
      dataType: 'sparepart' as const
    },
    {
      title: 'Out of Stock',
      queryKey: `spares-out-of-stock-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => sparePartsApi.getByStatus('Out of Stock', divisionId, selectedUnitId),
      icon: AlertTriangle,
      color: 'border-l-red-500',
      dataType: 'sparepart' as const
    }
  ];

  const electricalUtilityTiles = [
    {
      title: 'Total Equipment',
      queryKey: `equipment-total-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => equipmentApi.getAll(divisionId, {}, selectedUnitId),
      icon: Zap,
      color: 'border-l-blue-500',
      dataType: 'equipment' as const
    },
    {
      title: 'Active Equipment',
      queryKey: `equipment-active-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => equipmentApi.getByStatus('Working', divisionId, selectedUnitId),
      icon: CheckCircle,
      color: 'border-l-green-500',
      dataType: 'equipment' as const
    },
    {
      title: 'Under Service',
      queryKey: `equipment-service-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => equipmentApi.getByStatus('Repair', divisionId, selectedUnitId),
      icon: Wrench,
      color: 'border-l-yellow-500',
      dataType: 'equipment' as const
    },
    {
      title: 'Not Working',
      queryKey: `equipment-not-working-${divisionId}-${selectedUnitId || 'all'}`,
      queryFn: () => equipmentApi.getByStatus('Not Working', divisionId, selectedUnitId),
      icon: AlertTriangle,
      color: 'border-l-red-500',
      dataType: 'equipment' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Asset Management Dashboard</h1>
          {divisionId && (
            <p className="text-gray-600">Division: <span className="font-medium">{divisionId}</span></p>
          )}
        </div>

        {divisionId && (
          <UnitSelector
            divisionId={divisionId}
            selectedUnitId={selectedUnitId}
            onUnitSelect={setSelectedUnitId}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <DashboardSection 
            title="Machines" 
            tiles={machinesTiles} 
            sectionIcon={Cog}
            sectionColor="border-l-blue-500"
          />
          <DashboardSection 
            title="AMC/Warranty Status" 
            tiles={amcWarrantyTiles}
            sectionIcon={Shield}
            sectionColor="border-l-green-500"
          />
          <DashboardSection 
            title="Calibration" 
            tiles={calibrationTiles}
            sectionIcon={Gauge}
            sectionColor="border-l-yellow-500"
          />
          <DashboardSection 
            title="Breakdown Maintenance" 
            tiles={breakdownMaintenanceTiles}
            sectionIcon={AlertTriangle}
            sectionColor="border-l-red-500"
          />
          <DashboardSection 
            title="Periodic Maintenance" 
            tiles={periodicMaintenanceTiles}
            sectionIcon={Calendar}
            sectionColor="border-l-blue-500"
          />
          <DashboardSection 
            title="Spare Parts" 
            tiles={sparePartsTiles}
            sectionIcon={Package}
            sectionColor="border-l-purple-500"
          />
          <DashboardSection 
            title="Electrical and Utility" 
            tiles={electricalUtilityTiles}
            sectionIcon={Zap}
            sectionColor="border-l-orange-500"
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;