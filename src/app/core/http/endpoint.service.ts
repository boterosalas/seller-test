import { Injectable } from '@angular/core';

import { Logger } from '@core/util/logger.service';
import { endpoints, defaultVersion } from '@root/api-endpoints';
import { environment } from '@env/environment';


const log = new Logger('EndpointService');
type typeInterpolation = 'simple';

@Injectable()
export class EndpointService {
  // Prefijo de la versión.
  private prefix: string;
  // Número de versión.
  private number: number;
  // Key con los endpoints para cada entorno.
  private readonly group: string;
  // Combinación del prefijo y número de versión.
  private fullVersion: string;
  // Expresiones regulares para los diferentes casos.
  private readonly re = {
    simple: /{\w+}/,
    clean: /\/{\w+}/
  };

  constructor() {
    // Definir la versión global.
    this.group = environment.endpoints.group;
    this.setVersion(
      defaultVersion.prefix,
      environment.endpoints.version || defaultVersion.number
    );
  }

  /**
   * Inicializa las variables globales necesarias para definir
   * la versión de los endpoints usados.
   *
   * @param {string} prefix
   * @param {number} version
   * @memberof EndpointService
   */
  setVersion(prefix: string, version: number) {
    this.prefix = prefix;
    this.number = version;
    this.fullVersion = `${prefix}${version}`;
    if (!this.existVersion(this.fullVersion)) {
      log.warn('La versión global para consumir los endpoints no existe.');
    }
  }

  /**
   * Retorna un endpoint que este definido en el archivo './api-endpoints.ts'.
   * - Valida la existencia del endpoint.
   * - Realiza la interpolación simple de los parámetros
   *   requeridos por el endpoint.
   * - Elimina los parámetros del endpoint en caso de no ser necesarios.
   *
   * @param {string} name
   * @param {any[]} [params]
   * @param {string} [version=null]
   * @returns {string}
   * @memberof EndpointService
   */
  get(name: string, params?: any[], version: string = null): string {
    let endpoint: string = null;
    const fullVersion = this.fullVersion ? this.fullVersion : version;

    // Si no existe la versión
    if (!this.existVersion(fullVersion)) {
      log.error(`No existe la versión ${fullVersion} para el endpoint: "${name}" en el grupo: "${this.group}".`);
      return null;
    }

    const existName = endpoints[this.group][fullVersion].hasOwnProperty(name);

    // Si existe el nombre del endpoint.
    if (existName) {
      const valueEndPoint = endpoints[this.group][fullVersion][name];
      const lengthParams = (
        valueEndPoint.match(new RegExp(this.re.simple, 'g')) || []
      ).length;
      const applyParams = !this.isEmptyArr(params);

      // Endpoint por defecto
      endpoint = valueEndPoint;

      // Se puede interpolar parámetros.
      if (applyParams) {
        endpoint = this.addParams(valueEndPoint, 'simple', params);
      } else {
        // Si el endpoint tiene parámetros definidos.
        if (lengthParams) {
          endpoint = this.addParams(valueEndPoint, 'simple', lengthParams);
        }
      }
    }
    return endpoint;
  }

  /**
   * Agrega los parámetros necesarios al endpoint, utilizando
   * una expresión regular para buscar y remplazar los parámetros
   * por los valores.
   *
   * @private
   * @param {string} name
   * @param {typeInterpolation} type
   * @param {(any[] | number)} params
   * @returns {string}
   * @memberof EndpointService
   */
  private addParams(
    name: string,
    type: typeInterpolation,
    params: any[] | number
  ): string {
    if (type === 'simple') {
      const length = Array.isArray(params) ? params.length : params;
      for (let index = 0; index < length; index++) {
        if (Array.isArray(params)) {
          const element = params[index];
          name = name.replace(this.re.simple, element);
        } else {
          name = name.replace(this.re.clean, '');
        }
      }
    }
    return name;
  }

  /**
   * Valida si un array posee elemento nulos o indefinidos.
   *
   * @private
   * @param {Array<any>} a
   * @returns {boolean}
   * @memberof EndpointService
   */
  private isEmptyArr(a: Array<any>): boolean {
    if (a) {
      const hasUndefind = a.includes(undefined);
      const hasNull = a.includes(null);
      return hasUndefind || hasNull;
    }
    return true;
  }

  /**
   * Valida la existencia de una versión en un grupo de endpoints.
   *
   * @param {string} fullVersion
   * @returns {boolean}
   */
  private existVersion(fullVersion: string): boolean {
    return endpoints.hasOwnProperty(this.group) &&
      endpoints[this.group].hasOwnProperty(fullVersion);
  }

}
