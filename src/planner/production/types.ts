export interface ProductionTask {
  id: string;
  title: string;
  type: string;
  dueDate: string | Date;
  status: string | null;
  completedAt?: string | Date | null;
  completedBy?: string | null;
  completionNotes?: string | null;
  actualTrays?: number | null;
  actualYieldOz?: number | null;
  seedLot?: string | null;
  orderItem?: {
    trays_needed?: number | null;
    quantity_oz?: any;
    quantity_units?: number | null;
    orders?: { order_number: string } | null;
    products?: { name: string } | null;
    blends?: { name: string } | null;
    skus?: { name: string } | null;
  } | null;
  rackAssignments?: Array<{
    rack_element_id?: string;
    level?: number;
    tray_count?: number;
  }> | null;
}
