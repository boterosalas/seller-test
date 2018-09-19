import { Injectable } from '@angular/core';

@Injectable()
export class ToolbarServiceService {

    constructor() { }

    /**
     * Método para obtener el filtro actual que el usuario ha aplicado a la consulta de órdenes
     * @returns
     * @memberof ToolbarServiceService
     */
    getCurrentFilterOrders() {
        const currentFilter = JSON.parse(localStorage.getItem('currentFilter'));
        return currentFilter || {};
    }

    /**
     * Metodo para setear el filtro actual que el usuario ha aplicado a las órdenes que esta visualizando
     * @param {any} data
     * @memberof ToolbarServiceService
     */
    setCurrentFilterOrders(data) {
        localStorage.setItem('currentFilter', JSON.stringify(data));
    }

}
