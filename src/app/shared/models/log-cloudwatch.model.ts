/**
 * -------------------------------------------------------------------------
 * -- Tipos para trabajar con los logs que se envian a CloudWatch en AWS. --
 * -------------------------------------------------------------------------
 */


/**
 * Nivel que categoriza la importancia de un log en específico.
 *
 * @export
 * @enum {number}
 */
export enum Level {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

/**
 * Módelo para crear los log.
 *
 * @export
 * @class Log
 */
export class Log {
  // Nivel de importancia del log.
  level: Level;
  // Descripción corta de la finalidad del log.
  message: string;
  // Información adicional para entender el log, si es un error se debe anexar el error.
  context?: any;
}