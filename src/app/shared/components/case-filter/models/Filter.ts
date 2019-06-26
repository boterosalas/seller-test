export interface Filter {
  CaseNumber?: string;
  OrderNumber?: string;
  ReasonPQR?: string;
  Status?: Array<number>;
  DateInit?: string; //   dd/mm/yyyy
  DateEnd?: string; //   dd/mm/yyyy
  Page?: number;
  PageSize?: number;
 }
