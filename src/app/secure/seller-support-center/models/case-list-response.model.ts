import { IResponse } from "./response.interface";
import { CaseSummary } from "./case-summary.model";

export class CaseListResponse implements IResponse {
  errors: Array<any>;
  data: {
    totalPages: number;
    page: number;
    pageSize: number;
    cases: Array<CaseSummary>;
  };
  message: string;
}
