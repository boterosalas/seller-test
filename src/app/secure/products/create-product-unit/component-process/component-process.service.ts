import { Injectable, Output, EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ProductModel {
    Ean: string;
    AssignEan: boolean;
    CategorySelected: string;
}

/**
 * Servicio para manejar las paginas de la creacion de producto unitario.
 * Su funcionamiento radica en:
 * 1)   Interface que es la encargada de almacenar los datos del producto a medida que
 *      el usuario avanza en sus paso.
 * 2)   Modelo que almacena cual vista debe ser mostrada, en este caso por ejemplo showEan: cuando esta valido debe dejar pasar.
 * 3)   La funcion principal es "vaidData" la que recibe los datos de los componentes, los almacena para luego habilitar el siguiente paso.
 *
 * @export
 * @class ProcessService
 */
@Injectable()
export class ProcessService {

    /**
     * Modelo tipo ProductModel que almacena los datos de producto para ser enviados por el servicio
     *
     * @type {ProductModel}
     * @memberof ProcessService
     */
    productData: ProductModel = { Ean: null, AssignEan: null, CategorySelected: null};

    /**
     * Model para habilitar los menus de la creacion.
     *
     * @memberof ProcessService
     */
    views = {
        showEan: true,
        showCat: false,
        showInfo: false,
        showSpec: false,
        showImg: false,
    };

    /**
     * Event emitter que envia los cambios que ocurran en la vista.
     *
     * @type {EventEmitter<any>}
     * @memberof ProcessService
     */
    @Output() change: EventEmitter<any> = new EventEmitter();

    /**
     * Crea una instancia del servicio.
     * @param {HttpClient} http
     * @memberof ProcessService
     */
    constructor(private http: HttpClient) {
        this.productData.AssignEan = false;
    }

    /**
     * Muestra el modelo de vistas, de ser necesario para cambio manual.
     *
     * @returns {*}
     * @memberof ProcessService
     */
    public showView(): any {
        return this.views;
    }

    public getViews(): any {
        return this.views;
    }

    public setViews(views: any): void {
        this.views = views;
        this.change.emit(this.views);
    }

    /**
     * Valida los datos enviados, y habilita menu.
     *
     * @param {*} data
     * @memberof ProcessService
     */
    public validaData(data: any): void {
        if (data.Ean || data.AssignEan) {
            this.productData.Ean = data.Ean;
            this.productData.AssignEan = data.AssginEan;
            this.views.showEan = true;
        }
        if (data.CategorySelected) {
            this.views.showCat = true;
            this.productData.CategorySelected = data.CategorySelected;
        }
        this.change.emit(this.views);
    }

    /**
     * Ya que validacion ean necesita de varias validaciones para continuar fue necesario una funcion para inhabilitar este paso manualmente.
     *
     * @memberof ProcessService
     */
    public unavailableEanView(): void {
        this.productData.Ean = null;
        this.productData.AssignEan = false;
        this.views.showEan = false;
        this.change.emit(this.views);

    }
}




