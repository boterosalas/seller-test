import { ICase } from './case.interface';
import { Attachment } from './attachment.model';

export class CaseSummary implements ICase {
  id: string;
  sellerId: string;
  caseId: string;
  status: number;
  orderNumber: string;
  reasonPQR: string;
  reasonDetail: string;
  description: string;
  createDate: string;
  updateDate: string;
  customerEmail: string;
  read: boolean;
  followLast: Array<any>;
  attachments: Array<Attachment>;
}
