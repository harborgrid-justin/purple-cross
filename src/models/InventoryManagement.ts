/**
 * Inventory & Supply Chain Management Module
 * Handles stock tracking, ordering, and vendor management
 */

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  unit: string;
  quantityOnHand: number;
  reorderPoint: number;
  reorderQuantity: number;
  minimumStock: number;
  maximumStock: number;
  costPerUnit: number;
  pricePerUnit: number;
  location: string;
  lotNumbers: LotInfo[];
  expirationDates: Date[];
  active: boolean;
}

export interface LotInfo {
  lotNumber: string;
  quantity: number;
  expirationDate: Date;
  receivedDate: Date;
  cost: number;
}

export interface StockAlert {
  id: string;
  itemId: string;
  alertType: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  resolvedAt?: Date;
}

export interface AutoReorderRule {
  itemId: string;
  enabled: boolean;
  reorderPoint: number;
  reorderQuantity: number;
  preferredVendorId: string;
  leadTimeDays: number;
  safetyStockDays: number;
  orderFrequency?: 'daily' | 'weekly' | 'monthly';
}

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  address: Address;
  website?: string;
  accountNumber?: string;
  paymentTerms: string;
  deliveryLeadTime: number;
  minimumOrderAmount?: number;
  active: boolean;
  rating: number;
  performance: VendorPerformance;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface VendorPerformance {
  vendorId: string;
  totalOrders: number;
  onTimeDeliveries: number;
  qualityIssues: number;
  averageLeadTime: number;
  lastOrderDate?: Date;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  status: 'draft' | 'submitted' | 'approved' | 'ordered' | 'partially_received' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface PurchaseOrderItem {
  itemId: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQuantity: number;
}

export interface InventoryReceipt {
  id: string;
  purchaseOrderId?: string;
  receiptNumber: string;
  vendorId: string;
  receiptDate: Date;
  items: ReceivedItem[];
  receivedBy: string;
  inspectedBy?: string;
  notes?: string;
}

export interface ReceivedItem {
  itemId: string;
  quantityReceived: number;
  lotNumber: string;
  expirationDate: Date;
  unitCost: number;
  conditionOnArrival: 'good' | 'damaged' | 'defective';
  notes?: string;
}

export interface InventoryValuation {
  date: Date;
  method: 'FIFO' | 'LIFO' | 'average_cost';
  totalValue: number;
  itemValuations: ItemValuation[];
  deadStock: DeadStockItem[];
}

export interface ItemValuation {
  itemId: string;
  itemName: string;
  quantityOnHand: number;
  costPerUnit: number;
  totalValue: number;
  turnoverRate: number;
  daysOfSupply: number;
}

export interface DeadStockItem {
  itemId: string;
  itemName: string;
  quantityOnHand: number;
  value: number;
  lastUsedDate?: Date;
  daysSinceLastUse: number;
  recommendation: string;
}

export interface UsageAnalytics {
  itemId: string;
  period: { start: Date; end: Date };
  totalUsed: number;
  averageDaily: number;
  averageWeekly: number;
  averageMonthly: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  forecast: UsageForecast;
}

export interface UsageForecast {
  nextMonth: number;
  nextQuarter: number;
  nextYear: number;
  confidence: number;
}

export interface InventoryAdjustment {
  id: string;
  itemId: string;
  adjustmentDate: Date;
  adjustmentType: 'count_correction' | 'damage' | 'expiration' | 'theft' | 'donation' | 'other';
  quantityBefore: number;
  quantityAfter: number;
  quantityChange: number;
  reason: string;
  authorizedBy: string;
  notes?: string;
}

export interface EquipmentAsset {
  id: string;
  assetTag: string;
  name: string;
  description: string;
  category: 'diagnostic' | 'surgical' | 'monitoring' | 'laboratory' | 'office' | 'other';
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: Date;
  purchasePrice: number;
  warranty: WarrantyInfo;
  location: string;
  status: 'active' | 'maintenance' | 'retired' | 'disposed';
  maintenanceSchedule: MaintenanceSchedule[];
}

export interface WarrantyInfo {
  startDate: Date;
  endDate: Date;
  provider: string;
  coverage: string;
  active: boolean;
}

export interface MaintenanceSchedule {
  id: string;
  assetId: string;
  maintenanceType: 'calibration' | 'service' | 'inspection' | 'cleaning';
  frequency: number;
  frequencyUnit: 'days' | 'weeks' | 'months' | 'years';
  lastPerformed?: Date;
  nextDue: Date;
  performedBy?: string;
  notes?: string;
}
