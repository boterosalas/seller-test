/* 3rd party components */
import { EventEmitter, Injectable } from '@angular/core';

/**
 * Método que permite crear los events emitter que se emplean en el módulo stores
 */
@Injectable()
export class EventEmitterStore {

    eventSearchStore = new EventEmitter<any>();
    eventExpandAllNodes = new EventEmitter<any>();
    eventInformationForTreeIsLoad = new EventEmitter<any>();

    /**
     *  Evento eventEmitter que permite detectar cuando un usuario a realizado la busqueda de una tienda.
     * @param {any} store
     * @memberof EventEmitterStore
     */
    searchStore(store) {
        this.eventSearchStore.emit(store);
    }

    /**
    *  Evento eventEmitter que permite detectar cuando el usuario quiere visualizar todos los nodos de un arbol.
    * @param {any} store
    * @memberof EventEmitterStore
    */
    expandAllNodes(store) {
        this.eventExpandAllNodes.emit(store);
    }

    /**
    *  Evento eventEmitter que permite detectar cuando la información para armar el arbol ha sido cargada correctamente.
    * @param {any} information
    * @memberof EventEmitterStore
    */
    informationForTreeIsLoad(information) {
        this.eventInformationForTreeIsLoad.emit(information);
    }
}
