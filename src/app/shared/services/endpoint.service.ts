/* 3rd party components */
import { Injectable } from '@angular/core';

/* our own custom components */
import { defaultVersion, endpoints } from '../../../../api-endpoints';
import { Logger } from './logger.service';


const log = new Logger('EndpointService');
type typeInterpolation = 'simple' | 'dynamic';

@Injectable()
export class EndpointService {

    public apiUrl = '';
    // Prefijo de la versión
    private prefix: string;
    // Número de versión
    private number: number;
    // Combinación del prefijo y número de versión
    private fullVersion: string;
    // Expresiones regulares para los diferentes casos
    private re = {
        simple: /{\w+}/,
        clean: /\/{\w+}/
    };

    /**
     * Creates an instance of EndpointService.
     * @memberof EndpointService
     */
    constructor() {
        // Setear la versión global
        this.setVersion(defaultVersion.prefix, defaultVersion.number);
    }

    /**
     * Inicializa las variables globales necesarias para definir
     * la versión de los endpoint que se estan usando.
     * @param {string} prefix
     * @param {number} version
     * @memberOf EndpointService
     */
    protected setVersion(prefix: string, version: number) {
        this.prefix = prefix;
        this.number = version;
        this.fullVersion = `${prefix}${version}`;
        const existVersion = endpoints.hasOwnProperty(this.fullVersion);
        if (!existVersion) {
            log.warn('La versión global para consumir los endpoints no existe.');
        }
    }

    /**
     * Retorna un endpoint que este definido en el archivo './api-endpoints.ts'.
     * - Valida la existencia del endpoint.
     * - Realiza la interpolación simple de los ids
     *   requeridos por el endpoint.
     * - Elimina los ids del endpoint en caso de no ser necesarios.
     * @param {string} name
     * @param {any[]} [params]
     * @param {string} [version=null]
     * @returns {string}
     * @memberOf EndpointService
     */
    get(name: string, params?: any[], version: string = null): string {
        let endpoint: string = null;
        const fullVersion = this.fullVersion ? this.fullVersion : version;
        const existVersion = endpoints.hasOwnProperty(fullVersion);

        // Si no existe la versión
        if (!existVersion) {
            log.error('La versión global para consumir los endpoints no existe.');
            return null;
        }

        const existName = endpoints[fullVersion].hasOwnProperty(name);

        // Si existe el nombre del endpoint
        if (existName) {
            const valueEndPoint = endpoints[fullVersion][name];
            const lengthParams = (
                valueEndPoint.match(new RegExp(this.re.simple.toString(), 'g')) || []
            ).length;
            const applyParams = !this.isEmptyArr(params);

            // Endpoint por defecto
            if (this.apiUrl === '') {
                endpoint = `${this.apiUrl}${valueEndPoint}`;
            } else {
                endpoint = `${this.apiUrl}/${valueEndPoint}`;
            }

            // Se puede interpolar parametros
            if (applyParams) {
                endpoint = this.addParams(endpoint, 'simple', params);
            } else {
                // Si el endpoint tiene parametros definidos
                if (lengthParams) {
                    endpoint = this.addParams(endpoint, 'simple', lengthParams);
                }
            }
            log.debug(endpoint);

        }
        return endpoint;
    }

    /**
     * Agrega los parametros necesarios al endpoint, utilizando
     * una expresión regular para buscar y remplazar los parametros
     * por los valores.
     *
     * @private
     * @param {string} name
     * @param {typeInterpolation} type
     * @param {(any[] | number)} params
     * @returns {string}
     * @memberOf EndpointService
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
     * @memberOf EndpointService
     */
    private isEmptyArr(a: Array<any>): boolean {
        if (a) {
            const hasUndefind = a.includes(undefined);
            const hasNull = a.includes(null);
            return hasUndefind || hasNull;
        }
        return true;
    }

}
