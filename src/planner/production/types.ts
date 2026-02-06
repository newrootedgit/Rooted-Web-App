export interface ProductionTask {
  id: string;
  title: string;
  type: string;
  dueDate: string | Date;
  status: string | null;
  orderItem?: {
    trays_needed?: number | null;
    quantity_oz?: any;
    orders?: { order_number: string } | null;
    products?: { name: string } | null;
    blends?: { name: string } | null;
  } | null;
}
