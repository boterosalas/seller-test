import { Status } from './status';

export class StatusResponse {
  errors: Array<any>;
  data: Array<Status>;
  message: string;
}
