import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { each } from 'lodash';

import { Logger } from '../util/logger.service';


const log = new Logger('HttpCacheService');
const cachePersistenceKey = 'httpCache';

export interface HttpCacheEntry {
  lastUpdated: Date;
  data: HttpResponse<any>;
}

/**
 * Proporciona un recurso de caché para solicitudes HTTP con política de persistencia configurable.
 */
@Injectable()
export class HttpCacheService {

  private cachedData: { [key: string]: HttpCacheEntry; } = {};
  private storage: Storage | null = null;

  constructor() {
    this.loadCacheData();
  }

  /**
   * Establece los datos en caché para la solicitud especificada.
   *
   * @param {!string} url La URL de solicitud.
   * @param {ResponseOptions} data Los datos recibidos.
   * @param {Date=} lastUpdated La última actualización del caché, la fecha actual se usa si no se especifica.
   */
  setCacheData(url: string, data: HttpResponse<any>, lastUpdated?: Date) {
    this.cachedData[url] = {
      lastUpdated: lastUpdated || new Date(),
      data: data
    };
    log.debug(`Caché configurado para la clave: "${url}"`);
    this.saveCacheData();
  }

  /**
   * Obtiene los datos en caché para la solicitud especificada.
   *
   * @param {!string} url La URL de solicitud.
   * @return {?ResponseOptions} Los datos en caché son nulos si no existen datos para esta solicitud.
   */
  getCacheData(url: string): HttpResponse<any> | null {
    const cacheEntry = this.cachedData[url];
    if (cacheEntry) {
      log.debug(`Datos recuperados de caché para la clave: "${url}"`);
      return cacheEntry.data;
    }
    return null;
  }

  /**
   * Obtiene la entrada en caché para la solicitud especificada.
   *
   * @param {!string} url La URL de solicitud.
   * @return {?HttpCacheEntry} La entrada de caché es nula si no existe datos para esta solicitud.
   */
  getHttpCacheEntry(url: string): HttpCacheEntry | null {
    return this.cachedData[url] || null;
  }

  /**
   * Borra la entrada de caché (si existe) para la solicitud especificada.
   *
   * @param {!string} url La URL de solicitud.
   */
  clearCache(url: string): void {
    delete this.cachedData[url];
    log.debug(`Caché borrado para la clave: "${url}"`);
    this.saveCacheData();
  }

  /**
   * Limpia entradas de caché anteriores a la fecha especificada.
   *
   * @param {date=} expirationDate La fecha de vencimiento de la caché.
   *   Si no se especifica ninguna fecha, se borra todo el caché.
   */
  cleanCache(expirationDate?: Date) {
    if (expirationDate) {
      each(this.cachedData, (value: HttpCacheEntry, key: string) => {
        if (expirationDate >= value.lastUpdated) {
          delete this.cachedData[key];
        }
      });
    } else {
      this.cachedData = {};
    }
    this.saveCacheData();
  }

  /**
   * Establece la política de persistencia de caché.
   * Tenga en cuenta que cambiar la persistencia de la memoria caché también
   * borrará la memoria caché de su almacenamiento anterior.
   *
   * @param {'local'|'session'=} persistence Cómo debe conservarse el caché, puede ser local o session
   *   si no se proporciona ningún valor, solo estará en la memoria (valor predeterminado).
   */
  setPersistence(persistence?: 'local' | 'session') {
    this.cleanCache();
    this.storage = persistence === 'local' || persistence === 'session' ? window[persistence + 'Storage'] : null;
    this.loadCacheData();
  }

  private saveCacheData() {
    if (this.storage) {
      this.storage[cachePersistenceKey] = JSON.stringify(this.cachedData);
    }
  }

  private loadCacheData() {
    const data = this.storage ? this.storage[cachePersistenceKey] : null;
    this.cachedData = data ? JSON.parse(data) : {};
  }

} // End class
