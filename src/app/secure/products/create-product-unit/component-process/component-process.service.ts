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
    Category: string;
    ProductType: string;
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
    MeasurementUnit: string;
    ConversionFactor: string;
    ImageChildren: ProductModel['Image'];
    Features: any;
    ImageUrl1: string;
    ImageUrl2: string;
    ImageUrl3: string;
    ImageUrl4: string;
    ImageUrl5: string;
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
        Category: null,
        ProductType: null,
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
        ImageChildren: null,
        ConversionFactor: null,
        MeasurementUnit: null,
        Features: null,
        ImageUrl1: null,
        ImageUrl2: null,
        ImageUrl3: null,
        ImageUrl4: null,
        ImageUrl5: null,
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
            this.productData.AssignEan = !data.AssignEan;
            this.productData.HasEAN = !data.AssignEan;
            this.views.showEan = true;
        }
        if (data.CategorySelected) {
            this.views.showCat = true;
            this.productData.Category = data.CategorySelected;
            this.productData.ProductType = data.CategoryType;
        }
        if (data.Name) {
            this.views.showInfo = true;
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
            this.productData.MeasurementUnit = data.MeasurementUnit;
            this.productData.ConversionFactor = data.ConversionFactor;
            this.productData.HexColourCodePDP = data.HexColourCodePDP;
            this.productData.HexColourName = data.HexColourName;
        }
        if (data.Features) {
            this.productData.Features = data.Features;
        }
        if (data.parent_image_url_arrray && data.parent_image_url_arrray.length) {
            this.views.showImg = true;
            this.productData.ImageUrl1 = data.parent_image_url_arrray[0];
            this.productData.ImageUrl2 = data.parent_image_url_arrray[1];
            this.productData.ImageUrl3 = data.parent_image_url_arrray[2];
            this.productData.ImageUrl4 = data.parent_image_url_arrray[3];
            this.productData.ImageUrl5 = data.parent_image_url_arrray[4];
        }
        if (data.children_image_url_arrray && data.children_image_url_arrray.length) {
            for (let i = 0; i < this.productData.Children.length; i++) {
                this.productData.Children[i].ImageUrl1 = data.children_image_url_arrray[i][0];
                this.productData.Children[i].ImageUrl2 = data.children_image_url_arrray[i][1];
                this.productData.Children[i].ImageUrl3 = data.children_image_url_arrray[i][2];
                this.productData.Children[i].ImageUrl4 = data.children_image_url_arrray[i][3];
                this.productData.Children[i].ImageUrl5 = data.children_image_url_arrray[i][4];
            }
        }
        this.change.emit(this.views);
    }

    /**
     * Obtener los datos almacenados.
     *
     * @returns {ProductModel}
     * @memberof ProcessService
     */
    public getProductData(): ProductModel {
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
        this.productData.HasEAN = false;
        this.views.showEan = false;
        this.change.emit(this.views);
    }
}



