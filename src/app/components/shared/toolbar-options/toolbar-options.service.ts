
/* 3rd party components */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';

/* our own custom components */
import { HttpErrorHandlingService } from '../../../core/http/http-error-handling.service';
import { EndpointService } from '../../../core/http/endpoint.service';


@Injectable()

/**
 * Clase ToolbarServiceService
 */
export class ToolbarServiceService {

    /**
     * Creates an instance of ToolbarServiceService.
     * @param {HttpClient} http
     * @param {HttpErrorHandlingService} hehs
     * @param {EndpointService} api
     * @memberof ToolbarServiceService
     */
    constructor(
        private http: HttpClient,
        private hehs: HttpErrorHandlingService,
        private api: EndpointService
    ) { }

    /**
     * Método para obtener el filtro actual que el usuario ha aplicado a la consulta de ordenes
     * @returns
     * @memberof ToolbarServiceService
     */
    getCurrentFilterOrders() {
        const currentFilter = JSON.parse(localStorage.getItem('currentFilter'));
        return currentFilter || {};
    }

    /**
     * Metodo para setear el filtro actual que el usuario ha aplicado a las ordenes que esta visualizando
     * @param {any} data
     * @memberof ToolbarServiceService
     */
    setCurrentFilterOrders(data) {
        localStorage.setItem('currentFilter', JSON.stringify(data));
    }

}
