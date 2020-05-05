export interface Filter {
  CaseNumber?: string;
  OrderNumber?: string;
  ReasonPQR?: string;
  Status?: Array<any>;
  DateInit?: string; //   dd/mm/yyyy
  DateEnd?: string; //   dd/mm/yyyy
  Page?: number;
  PageSize?: number;
  LastPost?: number;
  SellerId?: number;
 }
