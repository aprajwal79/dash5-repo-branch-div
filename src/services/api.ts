import { ApiResponse, Machine, BreakdownMaintenance, SparePart, Equipment } from '../types';

const API_BASE_URL = '/api';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVOYW1lIjoicm9vdCIsImlhdCI6MTc1ODU1ODExOCwiZXhwIjoxNzYxMTUwMTE4fQ.wcSIsNQZN5b1eL781pIhUadLebDbpUD3_fShcJ0_iEY';
const getHeaders = () => ({
  'Accept': 'application/json, text/plain, */*',
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  'X-Hostname': 'shahiassets.com',
  'X-Authenticator': 'basic',
  'X-Timezone': '+05:30',
  'X-With-ACL-Meta': 'true',
  'X-Role': 'admin',
  'X-Locale': 'en-US'
});

// Helper function to fetch all pages of data
const fetchAllPages = async (baseUrl: string, headers: any): Promise<any> => {
  let allData: any[] = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore) {
    const url = baseUrl.replace(/page=\d+/, `page=${currentPage}`);
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const data = await response.json();
    allData = [...allData, ...data.data];
    
    // Check if there are more pages
    hasMore = data.meta.hasNext || (data.meta.totalPage && currentPage < data.meta.totalPage);
    currentPage++;
    
    // Safety check to prevent infinite loops
    if (currentPage > 100) break;
  }

  return {
    data: allData,
    meta: {
      count: allData.length, // Use actual count of fetched data
      page: 1,
      pageSize: allData.length,
      totalPage: 1,
      hasNext: false
    }
  };
};

const buildMaintenanceFilter = (filters: Record<string, any>, divisionId?: string, dateRange?: { startDate?: string; endDate?: string }, unitId?: string) => {
  const filterArray = Object.entries(filters).map(([key, value]) => ({ [key]: value }));
  
  if (unitId) {
    // Filter by specific unit via location->unit path
    filterArray.push({
      "location": {
        "unit": {
          "unit_id": {
            "$eq": unitId
          }
        }
      }
    });
  } else if (divisionId) {
    // Filter by division via location->unit->division->division_id path
    filterArray.push({
      "location": {
        "unit": {
          "division": {
            "division_id": {
              "$eq": divisionId
            }
          }
        }
      }
    });
  }

  // Add date range filter if provided
  if (dateRange && (dateRange.startDate || dateRange.endDate)) {
    const dateFilter: any = {};
    if (dateRange.startDate && dateRange.endDate) {
      dateFilter["maintainance_date"] = {
        "$gte": dateRange.startDate,
        "$lte": dateRange.endDate
      };
    } else if (dateRange.startDate) {
      dateFilter["maintainance_date"] = {
        "$gte": dateRange.startDate
      };
    } else if (dateRange.endDate) {
      dateFilter["maintainance_date"] = {
        "$lte": dateRange.endDate
      };
    }
    filterArray.push(dateFilter);
  }

  return encodeURIComponent(JSON.stringify({ "$and": filterArray }));
};

const buildSparePartsFilter = (filters: Record<string, any>, divisionId?: string, unitId?: string) => {
  const filterArray = Object.entries(filters).map(([key, value]) => ({ [key]: value }));
  
  if (unitId) {
    // Filter by specific unit
    filterArray.push({
      "unit": {
        "unit_id": {
          "$eq": unitId
        }
      }
    });
  } else if (divisionId) {
    // Filter by division (all units in division)
    filterArray.push({
      "unit": {
        "division": {
          "division_id": {
            "$eq": divisionId
          }
        }
      }
    });
  }

  return encodeURIComponent(JSON.stringify({ "$and": filterArray }));
};

const buildEquipmentFilter = (filters: Record<string, any>, divisionId?: string, unitId?: string) => {
  const filterArray = Object.entries(filters).map(([key, value]) => ({ [key]: value }));
  
  if (unitId) {
    // Filter by specific unit
    filterArray.push({
      "unit": {
        "unit_id": {
          "$eq": unitId
        }
      }
    });
  } else if (divisionId) {
    // Filter by division (all units in division)
    filterArray.push({
      "unit": {
        "division": {
          "division_id": {
            "$eq": divisionId
          }
        }
      }
    });
  }

  return encodeURIComponent(JSON.stringify({ "$and": filterArray }));
};

const buildMachineFilter = (filters: Record<string, any>, divisionId?: string, unitId?: string) => {
  const filterArray = Object.entries(filters).map(([key, value]) => ({ [key]: value }));
  
  console.log('Building machine filter with divisionId:', divisionId, 'unitId:', unitId);
  
  if (unitId) {
    // Filter by specific unit
    filterArray.push({
      "unit": {
        "unit_id": {
          "$eq": unitId
        }
      }
    });
  } else if (divisionId) {
    // Filter by division (all units in division)
    filterArray.push({
      "unit": {
        "division": {
          "division_id": {
            "$eq": divisionId
          }
        }
      }
    });
  }

  const filter = { "$and": filterArray };
  console.log('Final machine filter:', JSON.stringify(filter, null, 2));
  return encodeURIComponent(JSON.stringify(filter));
};

export const machinesApi = {
  async getAll(divisionId?: string, additionalFilters?: Record<string, any>, unitId?: string): Promise<ApiResponse<Machine>> {
    try {
      const filters = additionalFilters || {};
      const filterParam = buildMachineFilter(filters, divisionId, unitId);
      
      const baseUrl = `${API_BASE_URL}/machines:list?pageSize=200&appends[]=machine_location&appends[]=machine_type&appends[]=unit&page=1&filter=${filterParam}`;
      console.log('Machines API call:', baseUrl);
      
      const data = await fetchAllPages(baseUrl, getHeaders());
      console.log('Machines API response:', data);
      return data;
    } catch (error) {
      console.error('Machines API error:', error);
      throw error;
    }
  },

  async getByStatus(status: string, divisionId?: string, unitId?: string): Promise<ApiResponse<Machine>> {
    return this.getAll(divisionId, { "status": { "$eq": status } }, unitId);
  },

  async getByOwnership(ownership: string, divisionId?: string, unitId?: string): Promise<ApiResponse<Machine>> {
    return this.getAll(divisionId, { "ownership": { "$eq": ownership } }, unitId);
  },

  async getByAMC(hasAMC: string, divisionId?: string, unitId?: string): Promise<ApiResponse<Machine>> {
    return this.getAll(divisionId, { "has_amc": { "$eq": hasAMC } }, unitId);
  },

  async getByWarranty(hasWarranty: string, divisionId?: string, unitId?: string): Promise<ApiResponse<Machine>> {
    return this.getAll(divisionId, { "has_warranty": { "$eq": hasWarranty } }, unitId);
  },

  async getByCalibration(calibrationRequired: string, divisionId?: string, unitId?: string): Promise<ApiResponse<Machine>> {
    return this.getAll(divisionId, { "calibration_required": { "$eq": calibrationRequired } }, unitId);
  }
};

export const breakdownMaintenanceApi = {
  async getAll(divisionId?: string, additionalFilters?: Record<string, any>, dateRange?: { startDate?: string; endDate?: string }, unitId?: string): Promise<ApiResponse<BreakdownMaintenance>> {
    try {
      const filters = { "maintainance_type": { "$eq": "breakdown" }, ...(additionalFilters || {}) };
      const filterParam = buildMaintenanceFilter(filters, divisionId, dateRange, unitId);
      
      const baseUrl = `${API_BASE_URL}/breakdown_maintainance:list?pageSize=200&sort[]=-id&appends[]=broken_machine&appends[]=broken_machine.machine_type&appends[]=broken_machine.machine_location&appends[]=assigned_to&appends[]=location&page=1&filter=${filterParam}`;
      console.log('Breakdown API call:', baseUrl);
      
      const data = await fetchAllPages(baseUrl, getHeaders());
      console.log('Breakdown API response:', data);
      return data;
    } catch (error) {
      console.error('Breakdown API error:', error);
      throw error;
    }
  },

  async getByStatus(status: string, divisionId?: string, dateRange?: { startDate?: string; endDate?: string }, unitId?: string): Promise<ApiResponse<BreakdownMaintenance>> {
    return this.getAll(divisionId, { "status": { "$includes": status } }, dateRange, unitId);
  },

  async getByCategory(category: string, divisionId?: string, dateRange?: { startDate?: string; endDate?: string }, unitId?: string): Promise<ApiResponse<BreakdownMaintenance>> {
    return this.getAll(divisionId, { "breakdown-category": { "$eq": category } }, dateRange, unitId);
  }
};

export const periodicMaintenanceApi = {
  async getAll(divisionId?: string, additionalFilters?: Record<string, any>, dateRange?: { startDate?: string; endDate?: string }, unitId?: string): Promise<ApiResponse<BreakdownMaintenance>> {
    try {
      const filters = { "maintainance_type": { "$eq": "preventive" }, ...(additionalFilters || {}) };
      const filterParam = buildMaintenanceFilter(filters, divisionId, dateRange, unitId);
      
      const baseUrl = `${API_BASE_URL}/breakdown_maintainance:list?pageSize=200&sort[]=-id&appends[]=broken_machine&appends[]=broken_machine.machine_type&appends[]=broken_machine.machine_location&appends[]=assigned_to&appends[]=location&page=1&filter=${filterParam}`;
      console.log('Periodic API call:', baseUrl);
      
      const data = await fetchAllPages(baseUrl, getHeaders());
      console.log('Periodic API response:', data);
      return data;
    } catch (error) {
      console.error('Periodic API error:', error);
      throw error;
    }
  },

  async getByStatus(status: string, divisionId?: string, dateRange?: { startDate?: string; endDate?: string }, unitId?: string): Promise<ApiResponse<BreakdownMaintenance>> {
    return this.getAll(divisionId, { "status": { "$includes": status } }, dateRange, unitId);
  }
};

export const sparePartsApi = {
  async getAll(divisionId?: string, additionalFilters?: Record<string, any>, unitId?: string): Promise<ApiResponse<SparePart>> {
    try {
      const filters = additionalFilters || {};
      const filterParam = buildSparePartsFilter(filters, divisionId, unitId);
      
      const baseUrl = `${API_BASE_URL}/spare-parts-item:list?pageSize=200&appends[]=spare-parts-item&appends[]=unit&page=1&filter=${filterParam}`;
      console.log('Spare Parts API call:', baseUrl);
      
      const data = await fetchAllPages(baseUrl, getHeaders());
      console.log('Spare Parts API response:', data);
      return data;
    } catch (error) {
      console.error('Spare Parts API error:', error);
      throw error;
    }
  },

  async getByStatus(status: string, divisionId?: string, unitId?: string): Promise<ApiResponse<SparePart>> {
    return this.getAll(divisionId, { "status": { "$eq": status } }, unitId);
  }
};

export const equipmentApi = {
  async getAll(divisionId?: string, additionalFilters?: Record<string, any>, unitId?: string): Promise<ApiResponse<Equipment>> {
    try {
      const filters = additionalFilters || {};
      const filterParam = buildEquipmentFilter(filters, divisionId, unitId);
      
      const baseUrl = `${API_BASE_URL}/Equipments:list?pageSize=200&appends[]=equipment-type&appends[]=unit&appends[]=location&appends[]=createdBy&appends[]=updatedBy&page=1&filter=${filterParam}`;
      console.log('Equipment API call:', baseUrl);
      
      const data = await fetchAllPages(baseUrl, getHeaders());
      console.log('Equipment API response:', data);
      return data;
    } catch (error) {
      console.error('Equipment API error:', error);
      throw error;
    }
  },

  async getByStatus(status: string, divisionId?: string, unitId?: string): Promise<ApiResponse<Equipment>> {
    return this.getAll(divisionId, { "Status": { "$eq": status } }, unitId);
  }
};

// Units API for fetching units within a division
export const unitsApi = {
  async getByDivision(divisionId: string): Promise<ApiResponse<{ unit_id: string; unit_name: string }>> {
    try {
      const filterParam = encodeURIComponent(JSON.stringify({
        "division": {
          "division_id": {
            "$eq": divisionId
          }
        }
      }));
      
      const baseUrl = `${API_BASE_URL}/units:list?pageSize=200&page=1&filter=${filterParam}`;
      console.log('Units API call:', baseUrl);
      
      const data = await fetchAllPages(baseUrl, getHeaders());
      console.log('Units API response:', data);
      return data;
    } catch (error) {
      console.error('Units API error:', error);
      throw error;
    }
  }
};
