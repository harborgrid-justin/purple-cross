/**
 * Reporting & Analytics Module
 * Handles business intelligence, reporting, and data analysis
 */

export interface FinancialReport {
  id: string;
  reportType: 'profit_loss' | 'revenue' | 'expense' | 'budget' | 'cash_flow';
  periodStart: Date;
  periodEnd: Date;
  generatedAt: Date;
  generatedBy: string;
  data: FinancialData;
}

export interface FinancialData {
  totalRevenue: number;
  revenueByCategory: Record<string, number>;
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  netIncome: number;
  profitMargin: number;
  cashFlow: CashFlowData;
  budgetComparison?: BudgetComparison;
}

export interface CashFlowData {
  openingBalance: number;
  cashIn: number;
  cashOut: number;
  closingBalance: number;
  projectedNextMonth?: number;
}

export interface BudgetComparison {
  budgetedRevenue: number;
  actualRevenue: number;
  revenueVariance: number;
  budgetedExpense: number;
  actualExpense: number;
  expenseVariance: number;
}

export interface OperationalReport {
  id: string;
  reportType:
    | 'patient_visits'
    | 'appointment_utilization'
    | 'staff_productivity'
    | 'service_mix'
    | 'capacity';
  periodStart: Date;
  periodEnd: Date;
  data: OperationalData;
}

export interface OperationalData {
  totalPatientVisits: number;
  newPatients: number;
  returningPatients: number;
  appointmentBookingRate: number;
  appointmentUtilization: number;
  averageWaitTime: number;
  staffProductivity: StaffProductivityData[];
  serviceMix: Record<string, number>;
  capacityUtilization: number;
}

export interface StaffProductivityData {
  employeeId: string;
  employeeName: string;
  appointmentsSeen: number;
  proceduresPerformed: number;
  revenueGenerated: number;
  hoursWorked: number;
  efficiency: number;
}

export interface ClinicalReport {
  id: string;
  reportType:
    | 'disease_prevalence'
    | 'treatment_outcomes'
    | 'procedure_success'
    | 'diagnostic_accuracy'
    | 'protocol_compliance';
  periodStart: Date;
  periodEnd: Date;
  data: ClinicalData;
}

export interface ClinicalData {
  diseasePrevalence: DiseaseStatistics[];
  treatmentOutcomes: TreatmentOutcome[];
  procedureSuccessRates: ProcedureStatistics[];
  diagnosticAccuracy: DiagnosticMetrics;
  protocolCompliance: ComplianceMetrics;
}

export interface DiseaseStatistics {
  condition: string;
  cases: number;
  incidenceRate: number;
  prevalenceRate: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface TreatmentOutcome {
  treatment: string;
  totalCases: number;
  successRate: number;
  complicationRate: number;
  averageRecoveryTime: number;
}

export interface ProcedureStatistics {
  procedure: string;
  totalPerformed: number;
  successRate: number;
  complicationRate: number;
  averageDuration: number;
}

export interface DiagnosticMetrics {
  totalDiagnostics: number;
  accuracyRate: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
}

export interface ComplianceMetrics {
  protocolName: string;
  totalCases: number;
  compliantCases: number;
  complianceRate: number;
}

export interface CustomReport {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  template: ReportTemplate;
  schedule?: ReportSchedule;
}

export interface ReportTemplate {
  dataSource: string;
  fields: ReportField[];
  filters: ReportFilter[];
  groupBy?: string[];
  sortBy?: SortCriteria[];
  calculations?: Calculation[];
  chartType?: 'bar' | 'line' | 'pie' | 'table' | 'gauge';
}

export interface ReportField {
  name: string;
  displayName: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  format?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between' | 'in';
  value: any;
}

export interface SortCriteria {
  field: string;
  direction: 'asc' | 'desc';
}

export interface Calculation {
  name: string;
  formula: string;
  format?: string;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'html';
  active: boolean;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  userId: string;
  widgets: DashboardWidget[];
  layout: LayoutConfiguration;
  isDefault: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'gauge' | 'list';
  title: string;
  dataSource: string;
  configuration: WidgetConfiguration;
  position: { x: number; y: number; width: number; height: number };
  refreshInterval?: number;
}

export interface WidgetConfiguration {
  metric?: string;
  chartType?: 'bar' | 'line' | 'pie' | 'area' | 'donut';
  threshold?: ThresholdConfig;
  colors?: string[];
  dataPoints?: number;
  filters?: ReportFilter[];
}

export interface ThresholdConfig {
  warning: number;
  critical: number;
  good: number;
}

export interface LayoutConfiguration {
  columns: number;
  rows: number;
  responsive: boolean;
}

export interface KPI {
  id: string;
  name: string;
  category: string;
  value: number;
  unit?: string;
  target?: number;
  previousValue?: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  lastUpdated: Date;
}

export interface TrendAnalysis {
  metric: string;
  period: { start: Date; end: Date };
  dataPoints: DataPoint[];
  trend: 'increasing' | 'stable' | 'decreasing';
  growthRate: number;
  forecast?: ForecastData;
  anomalies: Anomaly[];
}

export interface DataPoint {
  date: Date;
  value: number;
  label?: string;
}

export interface ForecastData {
  nextPeriod: number;
  nextQuarter: number;
  nextYear: number;
  confidence: number;
  method: string;
}

export interface Anomaly {
  date: Date;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
  explanation?: string;
}

export interface ClientAnalytics {
  totalClients: number;
  activeClients: number;
  newClients: number;
  churnedClients: number;
  acquisitionCost: number;
  retentionRate: number;
  lifetimeValue: number;
  visitFrequency: FrequencyDistribution;
  servicePreferences: Record<string, number>;
}

export interface FrequencyDistribution {
  daily: number;
  weekly: number;
  monthly: number;
  quarterly: number;
  yearly: number;
  occasional: number;
}

export interface ExportJob {
  id: string;
  reportId?: string;
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'xml';
  scheduledFor?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  requestedBy: string;
  completedAt?: Date;
  error?: string;
}
