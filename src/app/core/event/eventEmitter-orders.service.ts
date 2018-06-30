/* 3rd party components */
import { EventEmitter, Injectable } from '@angular/core';

/**
 * Método que permite crear los events emitter que se emplean en la aplicación
 */
@Injectable()
export class EventEmitterOrders {

    orderList = new EventEmitter<any>();
    filterOrderList = new EventEmitter<any>();
    filterBillingList = new EventEmitter<any>();
    filterOrdersWithStatus = new EventEmitter<any>();
    tableInformationUploadGuide = new EventEmitter<any>();


    /**
     *  Evento eventEmitter que permite crear un suscribe para saber cuando consultar las ordenes de acuerdo al estado proporcionado.
     * @param {any} state
     * @memberof EventEmitterOrders
     */
    getOrderList(state) {
        this.orderList.emit(state);
    }

    /**
     *  Evento eventEmitter que permite crear un suscribe para saber cuando
     *  listar una determinada lista de ordenes obtenidas por los filtros aplicados por el usuario en el componente search-order-menu
     * @param {any} data
     * @memberof EventEmitterOrders
     */
    filterOrderListResponse(data) {
        this.filterOrderList.emit(data);
    }
    /**
     * Evento eventEmitter que permite crear un suscribe para saber cuando consultar las ordenes de acuerdo al estado proporcionado.
     * @param {any} state
     * @memberof EventEmitterOrders
     */
    printInformationTable(state) {
        this.tableInformationUploadGuide.emit(state);
    }

    /**
     * Evento eventEmitter que permite crear un suscribe para saber cuando listar una determinada lista de ordenes (billing)
     * obtenidas por los filtros aplicados por el usuario en el componente search-order-menu
     * @param {any} data
     * @memberof EventEmitterOrders
     */
    filterBillingListResponse(data) {
        this.filterBillingList.emit(data);
    }

    /**
     * Evento eventEmitter que permite crear un suscribe para saber cuando listar una determinada lista de ordenes (Solicitudes pendientes)
     * obtenidas por los filtros aplicados por el usuario en el componente search-order-menu
     * @param {any} data
     * @memberof EventEmitterOrders
     */
    filterOrdersWithStatusResponse(data) {
        this.filterOrdersWithStatus.emit(data);
    }
}
