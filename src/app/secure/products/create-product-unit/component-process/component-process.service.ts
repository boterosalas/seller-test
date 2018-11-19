import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';


/**
 * Interface que posee los datos de productos que van a ser enviados para guardar.
 *
 * @export
 * @interface ProductModel
 */
export interface ProductModel {
    Ean: string;
    AssignEan: boolean;
    CategorySelected: string;
    CategoryType: string;
    HasEAN: boolean;
    Name: string;
    Brand: string;
    Details: string;
    Model: string;
    SkuShippingSize: string;
    PackageWidth: number;
    PackageHeight: number;
    PackageLength: number;
    PackageWeight: number;
    ProductWidth: number;
    ProductHeight: number;
    ProductLength: number;
    ProductWeight: number;
    Description: string;
    KeyWords: string;
    Children: ProductModel[];
    Size: string;
    Color: string;
    HexColourCodePDP: string;
    HexColourName: string;
    Image: Array<any>;
    ImageChildren: ProductModel['Image'];
}

/**
 * Servicio para manejar las paginas de la creacion de producto unitario.
 * Su funcionamiento radica en:
 * 1)   Interface que es la encargada de almacenar los datos del producto a medida que
 *      el usuario avanza en sus paso.
 * 2)   Modelo que almacena cual vista debe ser mostrada, en este caso por ejemplo showEan: cuando esta valido debe dejar pasar.
 * 3)   La funcion principal es "validData" la que recibe los datos de los componentes, los almacena para luego habilitar el siguiente paso.
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
    productData: ProductModel = {
        Ean: null,
        AssignEan: null,
        CategorySelected: null,
        CategoryType: null,
        HasEAN: false,
        Name: null,
        Brand: null,
        Details: null,
        Model: null,
        SkuShippingSize: null,
        PackageWidth: null,
        PackageHeight: null,
        PackageLength: null,
        PackageWeight: null,
        ProductWidth: null,
        ProductHeight: null,
        ProductLength: null,
        ProductWeight: null,
        Description: null,
        KeyWords: null,
        Children: null,
        Size: null,
        Color: null,
        HexColourCodePDP: null,
        HexColourName: null,
        Image: null,
        ImageChildren: null
    };

    /**
     * Model para habilitar los menus de la creacion.
     *
     * @memberof ProcessService
     */
    views = {
        showEan: false,
        showCat: false,
        showInfo: false,
        showSpec: true,
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
            this.productData.CategoryType = data.CategoryType;
        }
        if (data.Name) {
            this.views.showInfo = true;
            this.productData.HasEAN = data.HasEAN;
            this.productData.Name = data.Name;
            this.productData.Brand = data.Brand;
            this.productData.Details = data.Details;
            this.productData.Model = data.Model;
            this.productData.SkuShippingSize = data.SkuShippingSize;
            this.productData.PackageWidth = data.PackageWidth;
            this.productData.PackageHeight = data.PackageHeight;
            this.productData.PackageLength = data.PackageLength;
            this.productData.PackageWeight = data.PackageWeight;
            this.productData.ProductWidth = data.ProductWidth;
            this.productData.ProductHeight = data.ProductHeight;
            this.productData.ProductLength = data.ProductLength;
            this.productData.ProductWeight = data.ProductWeight;
            this.productData.Description = data.Description;
            this.productData.KeyWords = data.KeyWords;
            this.productData.Children = data.Children;
            this.productData.Size = data.Size;
            this.productData.Color = data.Color;
            this.productData.HexColourCodePDP = data.HexColourCodePDP;
            this.productData.HexColourName = data.HexColourName;
        }
        if (data.Image) {
            this.views.showImg = true;
            this.productData.Image = data.Image;
            this.productData.ImageChildren = data.ImageChildren;
        }
        this.change.emit(this.views);
        console.log('data: ', this.views);
    }

    /**
     * Obtener los datos almacenados.
     *
     * @returns {ProductModel}
     * @memberof ProcessService
     */
    public getProductData(): ProductModel {
        console.log('this.productDat: ', this.productData);
        return this.productData;
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




