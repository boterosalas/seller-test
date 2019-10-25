import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EndpointService } from '@app/core/http/endpoint.service';
import { of } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';



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
    CategoryName: string;
    ProductType: string;
    HasEAN: boolean;
    Name: string;
    Brand: string;
    Details: string;
    Seller: string;
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
    // Image: Array<any>;
    MeasurementUnit: string;
    ConversionFactor: string;
    // ImageChildren: ProductModel['Image'];
    Features: any;
    ImageUrl1: string;
    ImageUrl2: string;
    ImageUrl3: string;
    ImageUrl4: string;
    ImageUrl5: string;
    MetaTitle: string;
    MetaDescription: string;
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


    specificationList = [{
        idGroup: 1,
        groupName: 'Todas las Especificaciones',
        Show: false,
        Value: null,
        specs: [
            {
                idSpec: 2,
                specName: 'Lente',
                obligatory: true,
                list: [{
                    name: 'Item 1'
                }, {
                    name: 'Item 2'
                }, {
                    name: 'Item 3'
                }, {
                    name: 'Item 4'
                }
                ]
            }, {
                idSpec: 3,
                obligatory: true,
                specName: 'Modelo'
            }, {
                idSpec: 4,
                obligatory: true,
                specName: 'Especificacion libre'
            }]
    }, {

        idGroup: 2,
        groupName: 'Banguera es km',
        Show: false,
        Value: null,
        specs: [
            {
                idSpec: 2,
                specName: 'hola',
            }
        ]
    }];

    idCategory: any;



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
        CategoryName: null,
        ProductType: null,
        HasEAN: false,
        Name: null,
        Brand: null,
        Details: null,
        Seller: 'Marketplace',
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
        // Image: null,
        // ImageChildren: null,
        ConversionFactor: null,
        MeasurementUnit: null,
        Features: null,
        ImageUrl1: null,
        ImageUrl2: null,
        ImageUrl3: null,
        ImageUrl4: null,
        ImageUrl5: null,
        MetaTitle: null,
        MetaDescription: null
    };

    /**
     * Model para habilitar los menus de la creacion.
     *
     * @memberof ProcessService
     */
    views = {
        showEan: true,
        showCat: false,
        showInfo: true,
        showSpec: true,
        showImg: true,
    };

    /**
     * Event emitter que envia los cambios que ocurran en la vista.
     *
     * @type {EventEmitter<any>}
     * @memberof ProcessService
     */
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() specsByCategory: EventEmitter<any> = new EventEmitter();
    @Output() isLoad: EventEmitter<any> = new EventEmitter();

    /**
     * Crea una instancia del servicio.
     * @param {HttpClient} http
     * @memberof ProcessService
     */
    constructor(
        private http: HttpClient,
        private api: EndpointService,
        private languageService: TranslateService
        ) {
        this.productData.AssignEan = false;
        this.refreshSpecifications();
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
     * Funcion para obtener las especificaciones dependiendo de la categoria,
     * TODO:POR AHORA USA UN MOCK PARA PRUEBAS EN FRONT.
     *
     * @param {number} idCategory
     * @memberof ProcessService
     */
    public getSpecsByCategories(idCategory: string): void {
        this.idCategory = idCategory;
        this.http.get(this.api.get('getSpecByCategory', [idCategory])).subscribe(data => {
            // if (data) {
                this.specsByCategory.emit(data);
            // }
        }, error => {
            console.error(error);
        });
    }

    public refreshSpecifications () {
        this.languageService.onLangChange.subscribe((e: Event) => {
            this.isLoad.emit(true);
            localStorage.setItem('culture_current', e['lang']);
            this.getSpecsByCategories(this.idCategory);
          });
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
            this.productData.CategoryName = data.CategoryName;
            this.productData.Category = data.CategorySelected;
            this.productData.ProductType = data.CategoryType;
            this.getSpecsByCategories(this.productData.Category);
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

    public setFeatures(Features: any): void {
        this.productData.Features = Features;
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

    /**
     * Funcion para validar campos metadescription y metatitulo
     *
     * @memberof ProcessService
     */
    public sendFieldMeta(): void {
        if (this.productData.Name.match(this.productData.Brand) && this.productData.Name.match(this.productData.Model)) {
            this.productData.MetaTitle = '##ProductName## - Compras por Internet ##site##';
            this.productData.MetaDescription = 'Compra por Internet ##ProductName##. ##site## tienda Online de Colombia con lo mejor de ##BrandName## en ' + this.productData.CategoryName;
        } else if (this.productData.Name.match(this.productData.Brand)) {
            this.productData.MetaTitle = '##ProductName####ProductModel## - Compras por Internet ##site##';
            this.productData.MetaDescription = 'Compra por Internet ##ProductName## ##ProductModel##. ##site## tienda Online de Colombia con lo mejor de ##BrandName## en ' + this.productData.CategoryName;
        } else if (this.productData.Name.match(this.productData.Model)) {
            this.productData.MetaTitle = '##ProductName####BrandName## - Compras por Internet ##site##';
            this.productData.MetaDescription = 'Compra por Internet ##ProductName## ##ProductModel##. ##site## tienda Online de Colombia con lo mejor de ##BrandName## en ' + this.productData.CategoryName;
        } else {
            this.productData.MetaTitle = '##ProductName####ProductModel####BrandName## - Compras por Internet ##site##';
            this.productData.MetaDescription = 'Compra por Internet ##ProductName## ##ProductModel##. ##site## tienda Online de Colombia con lo mejor de ##BrandName## en ' + this.productData.CategoryName;
        }
    }

    /**
     * Servicio que valida el guardado de la informacion de la creacion unitaria de producto.
     *
     * @param {*} params
     * @returns {Observable<{}>}
     * @memberof ProcessService
     */
    public saveInformationUnitreation(): Observable<{}> {
        this.sendFieldMeta();
        return new Observable(observer => {
            observer.next(this.productData);
          });
        // return this.http.post(this.api.get('postSaveInformationUnitCreation'), this.productData);
    }

    resetProduct() {
        this.productData = {
            Ean: null,
            AssignEan: null,
            Category: null,
            CategoryName: null,
            ProductType: null,
            HasEAN: false,
            Name: null,
            Brand: null,
            Details: null,
            Seller: 'Marketplace',
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
            // Image: null,
            // ImageChildren: null,
            ConversionFactor: null,
            MeasurementUnit: null,
            Features: null,
            ImageUrl1: null,
            ImageUrl2: null,
            ImageUrl3: null,
            ImageUrl4: null,
            ImageUrl5: null,
            MetaTitle: null,
            MetaDescription: null
        };
        this.views.showCat = false;
    }
}




