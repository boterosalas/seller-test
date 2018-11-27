import { TemplateRef } from '@angular/core';


/**
 * Configuración para el componente.
 */
export class ConfigBulkLoad {
  title: string;
  mainContentTpl: TemplateRef<any>;
}

/**
 * Posibles eventos que pueden ser generados en el componente.
 */
export enum TypeEvents {
  upload = 1,
  download = 2,
  send = 3
}

/**
 * Formato para los eventos.
 */
export interface Event {
  type: number;
  data?: any;
}
