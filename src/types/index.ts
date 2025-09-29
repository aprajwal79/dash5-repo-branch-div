export interface Machine {
  id: number;
  machine_id: string;
  machine_no?: string;
  make?: string;
  model?: string;
  status: 'Active' | 'Breakdown' | 'Idle' | 'Under Service' | 'In Transit';
  ownership: 'Owned' | 'Rented' | 'Demo';
  has_amc?: 'Yes' | 'No';
  'amc-start-date'?: string;
  'amc-end-date'?: string;
  has_warranty?: 'Yes' | 'No';
  'warranty-start-date'?: string;
  'warranty-end-date'?: string;
  calibration_required?: 'Yes' | 'No';
  'next-calibration-at'?: string;
  date_of_installation?: string;
  'asset-current-value'?: number;
  'asset-purchase-value'?: number;
  machine_type?: {
    machine_type: string;
  };
  machine_location?: {
    location_id: string;
  };
  unit?: {
    unit_id: string;
    unit_name: string;
  };
}

export interface BreakdownMaintenance {
  id: number;
  maintainance_type: 'breakdown' | 'preventive';
  status: string;
  'breakdown-category'?: 'Electrical Breakdown' | 'Mechanical Breakdown' | null;
  maintainance_date: string;
  createdAt: string;
  updatedAt: string;
  attended?: string | null;
  solved?: string | null;
  escalation_remarks?: string;
  head_mechanic_remarks?: string;
  unit_manager_remarks?: string | null;
  floor_manager_remarks?: string | null;
  broken_machine?: {
    machine_id: string;
    make?: string;
    model?: string;
    ownership?: string;
    status?: string;
    machine_type?: {
      machine_type: string;
    };
    machine_location?: {
      location_id: string;
      department?: string;
      building?: string;
      floor?: string;
      line?: string;
    };
  };
  assigned_to?: {
    id: number;
    username?: string;
    email?: string;
    phone?: string;
  };
  location?: {
    location_id: string;
    department?: string;
    building?: string;
    floor?: string;
    line?: string;
  };
}

export interface SparePart {
  id: number;
  'spare-parts-item-no'?: string;
  'available-qty': number;
  'critical-qty': number;
  status: 'In Stock' | 'Critical' | 'Out of Stock';
  'spare-parts-item': {
    'spare-parts-item-no': string;
    spares_description?: string;
  };
  unit: {
    unit_id: string;
    unit_name: string;
  };
}

export interface Equipment {
  id: number;
  'equipment-id': string;
  make?: string;
  model?: string;
  'mcs-sl-no'?: string;
  Status: 'Working' | 'Under Service' | 'Not Working';
  'equipment-type'?: {
    'equipment-type': string;
  };
  unit?: {
    unit_id: string;
    unit_name: string;
  };
  location?: {
    location_id: string;
  };
}

export interface ApiResponse<T> {
  data: T[];
  meta: {
    count?: number;
    page: number;
    pageSize: number;
    totalPage?: number;
    hasNext?: boolean;
  };
}