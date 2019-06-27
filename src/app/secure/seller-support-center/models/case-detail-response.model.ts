import { CaseDetail } from "./case-detail.model";

export class CaseDetailResponse {
  errors: Array<any>;
  data: CaseDetail;
  message: string;
}
