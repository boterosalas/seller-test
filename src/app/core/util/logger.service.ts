import { Log, Level } from '@app/shared/models/log-cloudwatch.model';

/**
 * Simple logger system with the possibility of registering custom outputs.
 *
 * 4 different log levels are provided, with corresponding methods:
 * - debug   : for debug information
 * - info    : for informative status of the application (success, ...)
 * - warning : for non-critical errors that do not prevent normal application behavior
 * - error   : for critical errors that prevent normal application behavior
 *
 * Example usage:
 * ```
 * import { Logger } from 'app/core/logger.service';
 *
 * const log = new Logger('myFile');
 * ...
 * log.debug('something happened');
 * ```
 *
 * To disable debug and info logs in production, add this snippet to your root component:
 * ```
 * export class AppComponent implements OnInit {
 *   ngOnInit() {
 *     if (environment.production) {
 *       Logger.enableProductionMode();
 *     }
 *     ...
 *   }
 * }
 *
 * If you want to process logs through other outputs than console, you can add LogOutput functions to Logger.outputs.
 */

/**
 * The possible log levels.
 * LogLevel.Off is never emitted and only used with Logger.level property to disable logs.
 */
export enum LogLevel {
  Off = 0,
  Error,
  Warning,
  Info,
  Debug
}

/**
 * Log output handler function.
 */
export type LogOutput = (source: string, level: LogLevel, ...objects: any[]) => void;

export class Logger {

  /**
   * Current logging level.
   * Set it to LogLevel.Off to disable logs completely.
   */
  static level = LogLevel.Debug;

  /**
   * Additional log outputs.
   */
  static outputs: LogOutput[] = [];

  /**
   * Enables production mode.
   * Sets logging level to LogLevel.Warning.
   */
  static enableProductionMode(level: LogLevel = LogLevel.Warning) {
    Logger.level = level;
  }

  static setServerConfig(url: string, authToken: string, levelReport: LogLevel = LogLevel.Error) {
    Logger.server = {
      url: url,
      levelReport: levelReport,
      authToken: authToken
    }
  }

  private static server = {
    url: null,
    levelReport: LogLevel.Error,
    authToken: null
  };

  constructor(private source?: string) { }

  /**
   * Logs messages or objects  with the debug level.
   * Works the same as console.log().
   */
  debug(...objects: any[]) {
    this.log(console.log, LogLevel.Debug, objects);
  }

  /**
   * Logs messages or objects  with the info level.
   * Works the same as console.log().
   */
  info(...objects: any[]) {
    this.log(console.info, LogLevel.Info, objects);
  }

  /**
   * Logs messages or objects  with the warning level.
   * Works the same as console.log().
   */
  warn(...objects: any[]) {
    this.log(console.warn, LogLevel.Warning, objects);
  }

  /**
   * Logs messages or objects  with the error level.
   * Works the same as console.log().
   */
  error(...objects: any[]) {
    this.log(console.error, LogLevel.Error, objects);
  }

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

  private log(func: Function, level: LogLevel, objects: any[]) {
    if (level <= Logger.level) {
      const log = this.source ? ['[' + this.source + ']'].concat(objects) : objects;
      func.apply(console, log);
      Logger.outputs.forEach((output) => output.apply(output, [this.source, level].concat(objects)));
    }
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
