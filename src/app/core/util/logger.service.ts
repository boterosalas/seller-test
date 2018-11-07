import { Log, Level } from '@app/shared/models/log-cloudwatch.model';

/**
 * Sistema de logger simple con posibilidad de registrar salidas personalizadas.
 *
 * Se proporcionan 4 niveles de registro diferentes, con los métodos correspondientes:
 * - debug: para información de debug
 * - info: para el estado informativo de la aplicación (éxito, ...)
 * - advertencia: para errores no críticos que no impiden el comportamiento normal de la aplicación
 * - error: para errores críticos que impiden el comportamiento normal de la aplicación
 *
 * Ejemplo de uso:
 * `` `
 * importar {Logger} desde 'app / core / logger.service';
 *
 * const log = new Logger ('myFile');
 * ...
 * log.debug ('algo sucedió');
 * `` `
 *
 * Para deshabilitar los registros de depuración e información en producción, agregue este fragmento a su componente raíz:
 * `` `
 * la clase de exportación AppComponent implementa OnInit {
 *  ngOnInit () {
 *    if (environment.production) {
 *      Logger.enableProductionMode ();
 *    }
 *  }
 * }
 *
 * Si desea procesar registros a través de otras salidas que no sean la consola, 
 * puede agregar las funciones LogOutput a Logger.outputs.
 */



/**
 * Los posibles niveles de registro.
 * LogLevel.Off nunca se emite y solo se usa con la propiedad Logger.level para deshabilitar los registros.
 *
 * @export
 * @enum {number}
 */
export enum LogLevel {
  Off = 0,
  Error,
  Warning,
  Info,
  Debug
}

/**
 * Manejador de salida de registro.
 */
export type LogOutput = (source: string, level: LogLevel, ...objects: any[]) => void;

export class Logger {

  /**
   * Nivel de registro actual.
   * Establézcalo en LogLevel.Off para deshabilitar los registros completamente.
   *
   * @static
   * @memberof Logger
   */
  static level = LogLevel.Debug;

  /**
   * Salidas de registro adicionales.
   *
   * @static
   * @type {LogOutput[]}
   * @memberof Logger
   */
  static outputs: LogOutput[] = [];

  /**
   * Habilita el modo de producción.
   * Establece el nivel de registro en LogLevel.Warning.
   *
   * @static
   * @param {LogLevel} [level=LogLevel.Warning]
   * @memberof Logger
   */
  static enableProductionMode(level: LogLevel = LogLevel.Warning) {
    Logger.level = level;
  }

  /**
   * Datos necesarios para guardar los logs en el servidor.
   *
   * @private
   * @static
   * @memberof Logger
   */
  private static server = {
    url: null,
    levelReport: LogLevel.Error,
    authToken: null
  };

  /**
   * Configura los datos necesarios para guardar los logs en el servidor.
   *
   * @static
   * @param {string} url
   * @param {string} authToken
   * @param {LogLevel} [levelReport=LogLevel.Error]
   * @memberof Logger
   */
  static setServerConfig(url: string, authToken: string, levelReport: LogLevel = LogLevel.Error) {
    Logger.server = {
      url: url,
      levelReport: levelReport,
      authToken: authToken
    }
  }

  constructor(private source?: string) { }

  /**
   * Registra mensajes u objetos con el nivel de depuración.
   * Funciona igual que console.log().
   */
  debug(...objects: any[]) {
    this.log(console.log, LogLevel.Debug, objects);
  }

  /**
   * Registra mensajes u objetos con el nivel de información.
   * Funciona igual que console.info().
   */
  info(...objects: any[]) {
    this.log(console.info, LogLevel.Info, objects);
  }

  /**
   * Registra mensajes u objetos con el nivel de advertencia.
   * Funciona igual que console.warn().
   */
  warn(...objects: any[]) {
    this.log(console.warn, LogLevel.Warning, objects);
  }

  /**
   * Registra mensajes u objetos con el nivel de error.
   * Funciona igual que console.error().
   */
  error(...objects: any[]) {
    this.log(console.error, LogLevel.Error, objects);
  }

  /**
   * Realiza una petición http al servicio encargado de guardar los
   * log en el servidor.
   *
   * @param {Log} log
   * @returns
   * @memberof Logger
   */
  async sendToServer(log: Log) {
    try {
      const url = Logger.server.url;
      const authToken = Logger.server.authToken;
      if (url && authToken) {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': authToken,
          },
          body: JSON.stringify(log)
        });
        const body = await response.json();
        if (response.status === 200) {
          this.debug('Log stored in CloudWatch: ', log);
        } else {
          this.debug('The log could not be saved in CloudWatch: ', response, body);
        }
        return body;
      }
    } catch (error) {
      console.error('Error when saving the log in CloudWatch: ', error)
    }
  }

  /**
   * Emite los logs según la configuración suministrada.
   *
   * @private
   * @param {Function} func
   * @param {LogLevel} level
   * @param {any[]} objects
   * @memberof Logger
   */
  private log(func: Function, level: LogLevel, objects: any[]) {
    // Mostrar log en el cliente.
    if (level <= Logger.level) {
      const log = this.source ? ['[' + this.source + ']'].concat(objects) : objects;
      func.apply(console, log);
      Logger.outputs.forEach((output) => output.apply(output, [this.source, level].concat(objects)));
    }
    // Guardar log en el servidor.
    if (level <= Logger.server.levelReport) {
      const hasMessage = typeof objects[0] === 'string';
      const message = hasMessage ? objects[0] : 'Mensaje no definido por el desarrollador.';
      this.sendToServer({
        level: this.getLevelServer(level),
        message: message,
        context: hasMessage ? objects.slice(1) : objects
      });
    }
  }

  /**
   * Convierte datos de enumeración 'LogLevel' a 'Level' la cual es compatible
   * con el servicio encargado de guardar los logs.
   *
   * @private
   * @param {LogLevel} level
   * @returns {Level}
   * @memberof Logger
   */
  private getLevelServer(level: LogLevel): Level {
    let levelServer: Level;
    switch (level) {
      case LogLevel.Debug:
        levelServer = Level.DEBUG;
        break;
      case LogLevel.Error:
        levelServer = Level.ERROR;
        break;
      case LogLevel.Info:
        levelServer = Level.INFO;
        break;
      case LogLevel.Warning:
        levelServer = Level.WARN;
        break;
    }
    return levelServer;
  }

}
