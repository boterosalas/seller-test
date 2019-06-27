import { IPagination } from "./pagination.interface";

export interface IResponse {
  errors: Array<any>;
  data: IPagination;
  message: string;
}
