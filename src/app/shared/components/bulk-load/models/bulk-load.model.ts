import { TemplateRef } from '@angular/core';


export class ConfigBulkLoad {
  title: string;
  mainContentTpl: TemplateRef<any>;
}

export enum TypeEvents {
  upload = 1,
  download = 2,
  send = 3
}

export interface Event {
  type: number;
  data?: any;
}
