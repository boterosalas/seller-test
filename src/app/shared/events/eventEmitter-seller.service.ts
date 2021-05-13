/* 3rd party components */
import { EventEmitter, Injectable } from '@angular/core';

/**
 * Método que permite crear los events emitter que se emplean en el módulo stores
 */
@Injectable()
export class EventEmitterSeller {

    eventSearchSeller = new EventEmitter<any>();
    eventSearchSellerHistoric = new EventEmitter<any>();
    eventSearchFraud = new EventEmitter<any>();
    eventSearchSellerModal = new EventEmitter<any>();

    /**
     *  Evento eventEmitter que permite detectar cuando un usuario a realizado la busqueda de una tienda.
     * @param {any} store
     * @memberof EventEmitterSeller
     */
    searchSeller(seller: any) {
        this.eventSearchSeller.emit(seller);
    }

    searchSellerHistoric(seller: any) {
        this.eventSearchSellerHistoric.emit(seller);
    }

    searchSellerFraud(seller: any) {
        this.eventSearchFraud.emit(seller);
    }

    searchSellerModal(seller: any) {
        this.eventSearchSellerModal.emit(seller);
    }
}
