import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { BulkLoadProductComponent } from './bulk-load-product.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { ComponentsService } from '@app/shared';
import { BulkLoadProductService } from '../bulk-load-product.service';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { LoadingService, UserLoginService, UserParametersService, ModalService } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { SupportService } from '@app/secure/support-modal/support.service';
import { of, BehaviorSubject } from 'rxjs';
import { BasicInformationService } from '../../create-product-unit/basic-information/basic-information.component.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SearchService } from '../../create-product-unit/categorization/search.component.service';
import { componentRefresh } from '@angular/core/src/render3/instructions';
import { By } from '@angular/platform-browser';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

export const registerRegex = [
    { Identifier: 'number', Value: '^[0-9]+$', Module: 'productos' },
    { Identifier: 'eanProduct', Value: '^([A-Z0-9]{5,16})$|0{1}$', Module: 'productos' },
    { Identifier: 'nameProduct', Value: '^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ+\-\,\.\s]{1,60}$', Module: 'productos' },
    { Identifier: 'eanComboProduct', Value: '^[a-zA-Z0-9\,]*$', Module: 'productos' },
    { Identifier: 'brandProduct', Value: 'brandProduct', Module: 'productos' },
    { Identifier: 'keyWordsProduct', Value: '^[\w\W\s\d]{1,500}$', Module: 'productos' },
    { Identifier: 'detailProduct', Value: '^[\w\W\s\d]{1,29}$', Module: 'productos' },
    { Identifier: 'eanImageProduct', Value: 'JPG$|jpg$', Module: 'productos' },
    { Identifier: 'SkuShippingSizeProduct', Value: '^[1-5]{1}$', Module: 'productos' },
    { Identifier: 'Package', Value: '^([0-9]{1,7})(\,[0-9]{1,2})$|^([0-9]{1,10})$', Module: 'productos' },
    { Identifier: 'descriptionProduct', Value: '^((?!<script>|<SCRIPT>|<Script>)[\s\S])*$', Module: 'productos' },
    { Identifier: 'size', Value: '^[^\s]{1,10}$', Module: 'productos' },
    { Identifier: 'limitCharsSixty', Value: '^[\w\W\s\d]{1,60}$', Module: 'productos' },
    { Identifier: 'sizeProduct', Value: '^((\S){1,10})$', Module: 'productos' },
    { Identifier: 'colorProduct', Value: '^(Beige|Negro|Blanco|Azul|Amarillo|Cafe|Gris|Verde|Naranja|Rosa|Morado|Rojo|Plata|Dorado|MultiColor)$', Module: 'productos' },
    { Identifier: 'typeCategory', Value: '^(Technology|Clothing)$', Module: 'productos' },
    { Identifier: 'descUnidadMedidaProduct', Value: '^(Gramo|Mililitro|Metro|Unidad)$', Module: 'productos' },
    { Identifier: 'factConversionProduct', Value: '^(([1-9][0-9]{0,10})|([1-9][0-9]{0,8}([,\.][0-9]{1}))|(([0-9]([0-9]{0,7}([,\.][0-9]{2})|([,\.][1-9]{1})))))?$', Module: 'productos' },
    { Identifier: 'eanCombo', Value: '((^([A-Z0-9]{5,16}))+)+([,](([A-Z0-9]{5,16})))*)$', Module: 'productos' },
];

describe('BulkLoad Products Component', () => {

    const mockAuthService = {
        profileType$: new BehaviorSubject<any>('Tienda'),
        getMenu: () => {

        }
    };

    // Mockeo de servicios por spy
    const mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const mockComponentsService = jasmine.createSpyObj('ComponentsService', ['openSnackBar']);
    const mockBulkLoadProductService = jasmine.createSpyObj('BulkLoadProductService', ['getAmountAvailableLoads', 'setProductsModeration',
        'setProducts', 'getCargasMasivas', 'verifyStateCharge', 'getCategoriesVTEX', 'getVtexTree']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    // const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu', 'profileType$']);
    const mockUserParametersService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
    const mockModalService = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
    const mockBasicInformationService = jasmine.createSpyObj('BasicInformationService', ['getActiveBrands', 'getSizeProducts']);
    const mockFormBuilder = jasmine.createSpyObj('FormBuilder', ['group']);
    const mockSearchService = jasmine.createSpyObj('SearchService', ['getCategories']);
    const mockMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    const DataArrray = [
        { 'size': 'XS' },
        { 'size': 'S' },
        { 'size': 'M' },
        { 'size': 'L' },
        { 'size': 'XL' },
        { 'size': 'XXL' },
        { 'size': 'XXXL' },
    ];

    const dataArray = [
        {
            Ean: '',
            Name: '',
            Category: '',
            Brand: '',
            Model: '',
            Details: '',
            Description: '',
            MetaTitle: '',
            MetaDescription: '',
            KeyWords: '',
            PackageHeight: '',
            PackageLength: '',
            PackageWidth: '',
            PackageWeight: '',
            SkuShippingSize: '',
            ProductHeight: '',
            ProductLength: '',
            ProductWidth: '',
            ProductWeight: '',
            Seller: '',
            ProductType: '',
            Size: '',
            Color: '',
            HexColourCodePDP: '',
            HexColourName: '',
            IsLogisticsExito: '',
            ImageUrl1: '',
            ImageUrl2: '',
            ImageUrl3: '',
            ImageUrl4: '',
            ImageUrl5: '',
            MeasurementUnit: '',
            ConversionFactor: '',
            DrainedFactor: '',
            ParentReference: '',
            ModifyImage: '',
            isVariant: true,
            EanCombo: '',
            errorRow: true,
            errorEan: true,
            errorName: true,
            errorCategory: true,
            errorBrand: true,
            errorModel: true,
            errorDetails: true,
            errorDescription: true,
            errorMetaTitle: true,
            errorMetaDescription: true,
            errorKeyWords: true,
            errorPackageHeight: true,
            errorPackageLength: true,
            errorPackageWidth: true,
            errorPackageWeight: true,
            errorSkuShippingSize: true,
            errorProductHeight: true,
            errorProductLength: true,
            errorProductWidth: true,
            errorProductWeight: true,
            errorSeller: true,
            errorProductType: true,
            errorImageUrl1: true,
            errorImageUrl2: true,
            errorImageUrl3: true,
            errorImageUrl4: true,
            errorImageUrl5: true,
            errorMeasurementUnit: true,
            errorConversionFactor: true,
            errorDrainedFactor: true,
            errorParentReference: true,
            errorSonReference: true,
            errorModifyImage: true,
            errorSize: true,
            errorColor: true,
            errorHexColourCodePDP: true,
            errorHexColourName: true,
            errorIsLogisticsExito: true,
            errorEanCombo: true
        }
    ];

    const res = [
        [
            'Grupo EAN Combo',
            'EAN',
            'Referencia Hijo',
            'Referencia Padre',
            'Nombre del producto',
            'Categoria',
            'Marca',
            'Modelo',
            'Detalles',
            'Descripcion',
            'Palabras Clave',
            'Talla',
            'Color',
            'hexColourCodePDP',
            'hexColourName',
            'Alto del empaque',
            'Largo del empaque',
            'Ancho del empaque',
            'Peso del empaque',
            'skuShippingsize',
            'Alto del producto',
            'Largo del producto',
            'Ancho del producto',
            'Peso del producto',
            'Descripcion Unidad de Medida',
            'Factor de conversion',
            'Tipo de Producto',
            'URL de Imagen 1',
            'URL de Imagen 2',
            'URL de Imagen 3',
            'URL de Imagen 4',
            'URL de Imagen 5',
            'Logistica Exito'
        ],
        [
            null,
            '0',
            'hijtititico2',
            'papapapasito2',
            'producto prueba carga',
            '27605',
            '1a',
            '2019',
            'de',
            'des',
            'pa',
            '25',
            'Azul',
            '123654',
            'azul',
            '4',
            '4',
            '4',
            '4',
            '5',
            '4',
            '4',
            '4',
            '4',
            'Unidad',
            '4',
            'clothing',
            'https://i.imgur.com/R8HsHac.jpg',
            null,
            null,
            null,
            null,
            '0'
        ],
        [],
        [
            null,
            '0',
            'hijtititico2',
            'papapapasito2',
            'producto prueba carga',
            '27605',
            '1a',
            '2019',
            'de',
            'des',
            'pa',
            '25',
            'Azul',
            '123654',
            'azul',
            '4',
            '4',
            '4',
            '4',
            '5',
            '4',
            '4',
            '4',
            '4',
            'Unidad',
            '4',
            'clothing',
            'https://i.imgur.com/R8HsHac.jpg',
            null,
            null,
            null,
            null,
            '0'
        ]
    ];

    const resEN = [
        [
            'Grupo EAN Combo',
            'EAN',
            'Referencia Hijo',
            'Referencia Padre',
            'Product Name',
            'Category',
            'Brand',
            'Model',
            'Product Details',
            'Description',
            'Keywords',
            'Size',
            'Color',
            'hexColourCodePDP',
            'hexColourName',
            'Package Height',
            'Package Lenght',
            'Package Width',
            'Package Weigh',
            'skuShippingsize',
            'Item Height',
            'Item Leght',
            'Item Width',
            'Item Weight',
            'Descripcion Unidad de Medida',
            'Factor de conversion',
            'Product Type',
            'Image URL 1',
            'Image URL 2',
            'Image URL 3',
            'URL de Imagen 4',
            'Image URL 4',
            'Logistica Exito'
        ],
        [
            null,
            '0',
            'hijtititico2',
            'papapapasito2',
            'producto prueba carga',
            '27605',
            '1a',
            '2019',
            'de',
            'des',
            'pa',
            '25',
            'Azul',
            '123654',
            'azul',
            '4',
            '4',
            '4',
            '4',
            '5',
            '4',
            '4',
            '4',
            '4',
            'Unidad',
            '4',
            'clothing',
            'https://i.imgur.com/R8HsHac.jpg',
            null,
            null,
            null,
            null,
            '0'
        ],
        [],
        [
            null,
            '0',
            'hijtititico2',
            'papapapasito2',
            'producto prueba carga',
            '27605',
            '1a',
            '2019',
            'de',
            'des',
            'pa',
            '25',
            'Azul',
            '123654',
            'azul',
            '4',
            '4',
            '4',
            '4',
            '5',
            '4',
            '4',
            '4',
            '4',
            'Unidad',
            'Unidad',
            'clothing',
            'https://i.imgur.com/R8HsHac.jpg',
            null,
            null,
            null,
            null,
            '0'
        ]
    ];

    const paginator = { pageIndex: 1, pageSize: 1 };

    const file = {
        target: {
            files: [
                {
                    lastModified: 1562274067161,
                    name: 'Plantilla general Clothing Blusas de Mujer (1).xlsx',
                    size: 392501,
                    type: ''
                }
            ]
        }
    };

    const dataAvalilable = { amountAvailableLoads: 1000 };
    const dataAvalilable0 = { amountAvailableLoads: 0 };
    const datadataSource = { paginator: 0 };


    const response = {
        status: 200,
        body: {
            data: {
                status: 0,
                checked: 'true',
                Data: 'Success',
                Response: {
                    Error: [],
                    Message: 'Operación realizada exitosamente',
                    Data: {
                        Error: 0,
                        FileName: '',
                        ProductNotify: [],
                        SpecsNotify: [],
                        Successful: 0,
                        TotalProcess: 0,
                        productWaiting: []
                    }
                }
            }
        }
    };
    const responseSetProductModeration = {
        status: 200,
        body: {
            data: {
                status: 0,
                checked: 'true',
                Data: 'Success',
                Response: {
                    Error: [],
                    Message: 'Operación realizada exitosamente',
                    Data: {
                        Error: 0,
                        FileName: '',
                        ProductNotify: [],
                        SpecsNotify: [],
                        Successful: 0,
                        TotalProcess: 0,
                        productWaiting: []
                    }
                }
            }
        }
    };

    const brands = {
        Data: {
            Brands: [{ marca: '000000 000123' }, { marca: '00004567' }]
        }
    };

    const selectedData = {
        productType: 'Technology',
        Name: 'Electrodomésticos',
        TipodeObjeto: 'Nivel 1',
        Son: [
            {
                productType: 'Technology',
                Name: 'Refrigeración',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Nevecones',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Neveras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Minibar',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Cavas de Vino y Cerveza',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Congeladores',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Dispensadores de Agua',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Fabricante de Hielo',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            },
            {
                productType: 'Technology',
                Name: 'Lavado y Secado',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Lavadoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Secadoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Lavadoras Secadoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Torre de Lavado',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Lavavajillas',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            },
            {
                productType: 'Technology',
                Name: 'Cocción',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Campanas - Extractores',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Estufas',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Hornos de Empotrar',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Cubiertas',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            },
            {
                productType: 'Technology',
                Name: 'Máquinas de Coser, Bordaras y Fileteadoras',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Maquinas de Coser',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Fileteadora',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Bordadoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            },
            {
                productType: 'Technology',
                Name: 'Preparación y Cocción de Alimentos',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Licuadoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Procesadores de Alimentos',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Extractores ',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Exprimidores de Cítricos',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Máquinas para Cortar Carne',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Combos Pequeños Electrodomésticos',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Batidoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            },
            {
                productType: 'Technology',
                Name: 'Productos para la Cocción de Alimentos',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Horno Microondas',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Horno Tostador',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Hornos Eléctricos para Pizza',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Hornos Eléctricos Análogos',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Horno Rostizador',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Tostadoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Plancha Asadora',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Sartenes Eléctricos',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Estufa Portátil',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Sanducheras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Panninis',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Olla de Arroz',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Olla Freidora',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Olla Cocción Lenta',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Ollas a Presión Eléctricas',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Vaporeras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Wafflera',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Máquinas para Especialidades',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            },
            {
                productType: 'Technology',
                Name: 'Preparación de Bebidas',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Cafetera',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Teteras Eléctricas',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Hervidor de Agua',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Máquinas para Té Helado',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Purificador de Agua',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            },
            {
                productType: 'Technology',
                Name: 'Accesorios Preparación de Alimentos',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Vaso Licuadora Vidrio',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Vaso Licuadora Plástico',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Empaques Licuadora',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Jarras Cafetera',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Filtros Cafetera',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Cuchillas Licuadora',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Tapas Licuadora',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Accesorios de Batidoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            },
            {
                productType: 'Technology',
                Name: 'Ventilación y Calefacción',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Aires Acondicionados',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Ventiladores',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Enfriadores de Ambiente',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Calentadores de Ambiente',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Calentadores de Agua',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Repuesto de Ventilación',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Purificadores de Aire',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            },
            {
                productType: 'Technology',
                Name: 'Cuidado de Pisos',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Aspiradoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Brilladoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Accesorios Cuidado de Pisos',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            },
            {
                productType: 'Technology',
                Name: 'Planchas de Ropa',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Planchas a Vapor',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Planchas Verticales',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Plancha Seca',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            },
            {
                productType: 'Technology',
                Name: 'Cuidado Personal',
                TipodeObjeto: 'Nivel 2',
                Son: [
                    {
                        productType: 'Technology',
                        Name: 'Secadores',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Espejos Eléctricos',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Afeitadoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Depiladoras',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Vaporizadores',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Plancha Alisadora Cabello',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Masajeadores',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    },
                    {
                        productType: 'Technology',
                        Name: 'Maquina Cortador Cabello',
                        TipodeObjeto: 'Nivel 3',
                        Son: [

                        ],
                        Show: false
                    }
                ],
                Show: false
            }
        ],
        Show: false
    };

    const lastlvl = {
        Name: 'Lavadoras',
        Show: false,
        Son: [],
        TipodeObjeto: 'Nivel 3',
        productType: 'Technology'
    };

    const vetex = {
        errors: [],
        data: {
            idGroup: '636854161363776361',
            groupName: 'Lavadoras',
            specs: [
                {
                    idSpec: '636854161401212951',
                    specName: 'Material principal',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161392547134',
                    specName: 'Capacidad en libras',
                    required: true,
                    values: null,
                    listValues: [
                        '0 - 25.9',
                        '26 - 31',
                        '31.1 en adelante'
                    ]
                },
                {
                    idSpec: '636854161382756614',
                    specName: 'Potencia',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636868940901682966',
                    specName: 'Nombre Especs numbre 62714424',
                    required: false,
                    values: null,
                    listValues: [
                        'Opcion 3',
                        'Opcion 1',
                        'Opcion 4',
                        'Opcion 9'
                    ]
                },
                {
                    idSpec: '636854161390629009',
                    specName: 'Peso Neto',
                    required: true,
                    values: null,
                    listValues: [
                        'op1',
                        'op2'
                    ]
                },
                {
                    idSpec: '636854161396425922',
                    specName: 'Tipo de Instrumento',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161376888095',
                    specName: 'Capacidad en Kilogramos',
                    required: true,
                    values: null,
                    listValues: [
                        '0 - 11',
                        '11.1 - 14',
                        '14.1 en adelante'
                    ]
                },
                {
                    idSpec: '636854161386668731',
                    specName: 'Estilo',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161378842785',
                    specName: 'Tipo de carga',
                    required: true,
                    values: null,
                    listValues: [
                        'Frontal',
                        'Superi or'
                    ]
                },
                {
                    idSpec: '636854161380807452',
                    specName: 'Modelo',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161388568160',
                    specName: 'Referencia',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636924947427602052',
                    specName: 'fray',
                    required: true,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161398340944',
                    specName: 'Tipo de panel',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161409031573',
                    specName: 'Peso Bruto',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161366353090',
                    specName: 'Voltaje',
                    required: true,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161405152291',
                    specName: 'Compatibilidad',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161374889830',
                    specName: 'Beneficio',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161394465125',
                    specName: 'Resistencia',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161407096097',
                    specName: 'Capacidad',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161384712412',
                    specName: 'Tipo',
                    required: false,
                    values: null,
                    listValues: []
                },
                {
                    idSpec: '636854161403150701',
                    specName: 'Especificaciones',
                    required: false,
                    values: null,
                    listValues: []
                }
            ],
            id: '636854161363776361',
            listCategories: [
                {
                    id: 27223,
                    name: 'Lavadoras'
                },
                {
                    id: 27223,
                    name: 'Lavadoras'
                },
                {
                    id: 27707,
                    name: 'Carga Frontal'
                },
                {
                    id: 27714,
                    name: 'Carga Superior'
                },
                {
                    id: 27301,
                    name: 'Lavadoras De Perilla'
                },
                {
                    id: 27302,
                    name: 'Lavadoras Digitales'
                },
                {
                    id: 27550,
                    name: 'Secadoras'
                },
                {
                    id: 27199,
                    name: 'Lavasecadora'
                }
            ],
            idVTEX: ''
        },
        message: 'Operación realizada exitosamente.'
    };

    const UserInformation = {
        sellerEmail: 'ccbustamante2@misena.edu.co', sellerId: '11618', sellerName: 'la tienda de cristian 2019 vs 5', sellerNit: '1128438122', sellerProfile: 'seller'
    };

    const UserInformationAdmin = {
        sellerEmail: 'ccbustamante2@misena.edu.co',
        sellerId: '11618',
        sellerName: 'la tienda de cristian 2019 vs 5',
        sellerNit: '1128438122',
        sellerProfile: 'admin',
    };

    const categories: any = {
        headers: {
            normalizedNames: {

            },
            lazyUpdate: null
        },
        status: 200,
        statusText: 'OK',
        url: 'https://0dk55lff0l.execute-api.us-east-1.amazonaws.com/SellerCommissionCategory/GetAllCategories',
        ok: true,
        type: 4,
        body: {
            statusCode: 200,
            headers: null,
            body: "{\"Errors\":[],\"Data\":[{\"Id\":27316,\"IdParent\":27195,\"Name\":\"A Gas\",\"IdExito\":\"cat790026000\",\"IdCarulla\":\"567_300030040000000\",\"IdCatalogos\":\"k_900010000000000\",\"IdMarketplace\":\"catmp1111000000\",\"ProductType\":\"Technology\",\"SkuShippingSize\":\"5\",\"Promisedelivery\":\"2 a 5\",\"IsExitoShipping\":true,\"Commission\":15.0,\"IdVTEX\":\"34185600\"},{\"Id\":27352,\"IdParent\":27231,\"Name\":\"Abdominales\",\"IdExito\":\"35_900120030040000\",\"IdCarulla\":\"567_300030010060000\",\"IdCatalogos\":\"k_900020020000000\",\"IdMarketplace\":\"catmp1141000000\",\"ProductType\":\"Technology\",\"SkuShippingSize\":\"4\",\"Promisedelivery\":\"2 a 5\",\"IsExitoShipping\":true,\"Commission\":15.0,\"IdVTEX\":\"34185334\"}],\"Message\":\"Operación realizada éxitosamente.\"}",
            isBase64Encoded: false
        }
    };

    const resRegex = {
        body: {
            body: JSON.stringify({ Data: registerRegex })
        }
    };


    let fixture: ComponentFixture<BulkLoadProductComponent>;
    let component: BulkLoadProductComponent;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            // Se declara el componente a testear
            declarations: [BulkLoadProductComponent],
            imports: [MaterialModule, SharedModule, HttpClientTestingModule],
            providers: [{ provide: ComponentsService, useValue: mockComponentsService },
            { provide: BulkLoadProductService, useValue: mockBulkLoadProductService },
            { provide: MatDialog, useValue: mockMatDialog },
            { provide: LoadingService, useValue: mockLoadingService },
            { provide: UserParametersService, useValue: mockUserParametersService },
            { provide: ModalService, useValue: mockModalService },
            { provide: AuthService, useValue: mockAuthService },
            { provide: SupportService, useValue: mockSupportService },
            { provide: BasicInformationService, useValue: mockBasicInformationService },
            { provide: FormBuilder, useValue: mockFormBuilder },
            { provide: SearchService, useValue: mockSearchService },
            { provide: MatSnackBar, useValue: mockMatSnackBar }],
            // Ignora todo lo que no hace parte de ese componente.
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BulkLoadProductComponent);
        component = fixture.componentInstance;
        const result = {
            status: 200,
            body: {
                data: JSON.stringify({ Data: 'Success' })
            }
        };
        mockBulkLoadProductService.getAmountAvailableLoads.and.returnValue(of(result));
        mockBulkLoadProductService.getVtexTree.and.returnValue(of(vetex));
        mockSupportService.getRegexFormSupport.and.returnValue(of(resRegex));
        mockBasicInformationService.getActiveBrands.and.returnValue(of(brands));
        mockBulkLoadProductService.getCargasMasivas.and.returnValue(of(response));
        mockBulkLoadProductService.getCategoriesVTEX.and.returnValue(of(vetex));
        mockBasicInformationService.getSizeProducts.and.returnValue(of(DataArrray));
        mockSearchService.getCategories.and.returnValue(of(categories));
        mockUserParametersService.getUserData.and.returnValue(UserInformation);
        component.categoryForm = new FormGroup({
            Name: new FormControl(''),
            productType: new FormControl(''),
            TipodeObjeto: new FormControl('')
        });
    }));
    afterEach(() => {
        fixture = TestBed.createComponent(BulkLoadProductComponent);
        component = fixture.componentInstance;
        const result = {
            status: 300,
            body: {
                body: JSON.stringify({ Data: 'Success' })
            }
        };
        mockBulkLoadProductService.getAmountAvailableLoads.and.returnValue(of(result));
    });

    it('should create seller list component', () => {
        expect(component).toBeTruthy();
    });

    describe('Seller login', () => {
        beforeEach(() => {
        });

        it('Get quantity charges in seller', () => {
            component.getAvaliableLoads();
            expect(component.isAdmin).toBeFalsy();
            // Se verifica el llamado del metodo getAmountAvailableLoads
            expect(mockBulkLoadProductService.getAmountAvailableLoads).not.toHaveBeenCalled();
        });

        it('Reset variables', () => {
            component.listLog = [];
            component.countErrors = 0;
            component.countRowUpload = 0;
            component.arrayInformation = [];
            component.arrayInformationForSend = [];
            component.orderListLength = true;
            component.numberElements = 0;
            component.fileName = '';
            component.arrayNecessaryData = [];
            component.resetVariableUploadFile();
            expect(component.resetVariableUploadFile).toBeTruthy();
        });

        it('Get regex', () => {
            const productsRegex = {
                number: '',
                eanProduct: '',
                nameProduct: '',
                eanComboProduct: '',
                brandProduct: '',
                keyWordsProduct: '',
                detailProduct: '',
                eanImageProduct: '',
                SkuShippingSizeProduct: '',
                Package: '',
                forbiddenScript: '',
                size: '',
                limitCharsSixty: '',
                sizeProduct: '',
                colorProduct: '',
                typeCategory: '',
                descUnidadMedidaProduct: '',
                factConversionProduct: '',
                eanCombo: ''
              };
            expect(component.productsRegex).toEqual(productsRegex);
            component.validateFormSupport(resRegex);
            expect(component.productsRegex).not.toEqual(productsRegex);
        });

        // it('Download excel', () => {
        //     component.downloadFormatMassiveOfferLoadinternacional();
        // });

        // it('Download excel spanish', () => {
        //     component.downloadFormatMassiveOfferLoad();
        // });

        // it('Validate status charge', () => {
        //     component.verifyStateCharge(response);
        //     expect(mockBulkLoadProductService.getCargasMasivas).toHaveBeenCalled();
        // });

        it('Validate status charge checked true', () => {
            response.body.data.status = 1;
            component.verifyStateCharge(response);
            expect(component.progressStatus).toBeFalsy();
        });

        it('Configuracion de la tabla', () => {
            component.configDataDialog();
            const pruebaDialog = component.configDataDialog();
            expect(pruebaDialog).toBeTruthy();
        });

        it('Lista por marcas', () => {
            const componentBrands = [];
            expect(component.brands).toEqual(componentBrands);
            component.listOfBrands(brands);
            expect(component.brands).not.toEqual(componentBrands);
            expect(component.brands).toEqual(brands.Data.Brands);
        });
    });


    describe('Admin login', () => {
        beforeEach(() => {
            mockAuthService.profileType$.next('Admin');
        });

        it('Get quantity charges in seller', () => {
            component.getAvaliableLoads(mockAuthService.profileType$.getValue());
            expect(component.isAdmin).toBeTruthy();
            // Se verifica el llamado del metodo getAmountAvailableLoads
            expect(mockBulkLoadProductService.getAmountAvailableLoads).toHaveBeenCalled();
        });

        it('Reset variables', () => {
            component.listLog = [];
            component.countErrors = 0;
            component.countRowUpload = 0;
            component.arrayInformation = [];
            component.arrayInformationForSend = [];
            component.orderListLength = true;
            component.numberElements = 0;
            component.fileName = '';
            component.arrayNecessaryData = [];
            component.resetVariableUploadFile();
            expect(component.resetVariableUploadFile).toBeTruthy();
        });
    });

    describe('Download data theme for seller', () => {

        it('element selected first tree lvl', () => {
            component.selectElement(selectedData);
            expect(mockBulkLoadProductService.getCategoriesVTEX).not.toHaveBeenCalled();
        });

        it('element selected last lvl', () => {
            component.selectElement(lastlvl);
            component.categoryForm.patchValue({ lastlvl });
            expect(mockBulkLoadProductService.getCategoriesVTEX).toHaveBeenCalled();
        });

        it('export excel Technology with data', () => {
            component.vetex.data = {
                groupName: 'Lavadoras',
                id: '636945656165896196',
                idGroup: '636945656165896196',
                idVTEX: '',
                listCategories: [{ id: 27223, name: 'Lavadoras' },
                { id: 27707, name: 'Carga Frontal' },
                { id: 27714, name: 'Carga Superior' }],
                specs: [
                    { idSpec: '636945656167650094', specName: 'Voltaje', required: false, values: null, listValues: Array(0) },
                    { idSpec: '636945656198371143', specName: 'Compatibilidad', required: false, values: null, listValues: Array(0) }
                ]
            };
            component.modelSpecs = { pruebas: '1', testeo: '2' };
            component.categoryType.setValue('Technology');
            component.exportExcel();
            expect(component.exportExcel).toBeTruthy();
        });

        it('export excel Clothing with data', () => {
            component.vetex.data = {
                groupName: '',
                id: '',
                idGroup: '',
                idVTEX: '',
                listCategories: [],
                specs: []
            };
            component.modelSpecs = { pruebas: '1', testeo: '2' };
            component.categoryType.setValue('Clothing');
            component.exportExcel();
            expect(component.exportExcel).toBeTruthy();
        });

        it('vtex tree', () => {
            component.trasformTree();
        });
    });

    describe('seller', () => {

        beforeEach(() => { });

        it('get user data', fakeAsync(() => {
            component.getDataUser();
            fixture.whenStable().then(() => {
                tick(50);
                expect(component.user).toEqual(UserInformation);
            });
        }));

        // it('read file', () => {
        //     const fileUpload = fixture.debugElement.query(By.css('#uploadFile'));
        //     const fileUploadNativeElement = fileUpload.nativeElement;
        //     fileUploadNativeElement.dispatchEvent(new Event('change'));
        //     fixture.detectChanges();
        //     //component.readFileUpload(fileUploadNativeElement);
        //     component.onFileChange(fileUploadNativeElement);
        //     expect(mockSearchService.getCategories).toHaveBeenCalled();
        // });

        // it('on file change', () => {
        //     const fileUpload = fixture.debugElement.query(By.css('#uploadFile'));
        //     const fileUploadNativeElement = fileUpload.nativeElement;
        //     fileUploadNativeElement.dispatchEvent(new Event('change'));
        //     fixture.detectChanges();
        //     component.onFileChange(fileUploadNativeElement);
        //     expect(mockSearchService.getCategories).toHaveBeenCalled();
        // });

        it('on file change error', () => {
            component.onFileChange('');
            expect(component.onFileChange).toThrowError();
        });

    });
    describe('validate data from file', () => {
        beforeEach(() => {
            mockBulkLoadProductService.setProducts.and.returnValue(of(responseSetProductModeration));
            mockBulkLoadProductService.setProductsModeration.and.returnValue(of(responseSetProductModeration));
            component.dataAvaliableLoads = dataAvalilable;
            component.profileTypeLoad = 'Tienda';
            component.isAdmin = true;
        });

        it('validate data from file', () => {
            component.validateDataFromFile(res, file);
        });
    });
    describe('validate data from file', () => {
        beforeEach(() => {
            mockBulkLoadProductService.setProducts.and.returnValue(of(responseSetProductModeration));
            mockBulkLoadProductService.setProductsModeration.and.returnValue(of(responseSetProductModeration));
            component.dataAvaliableLoads = dataAvalilable;
            component.profileTypeLoad = 'oficina';
            component.isAdmin = true;
        });

        it('validate data from file', () => {
            component.validateDataFromFile(res, file);
        });
    });
    describe('validate data from file', () => {
        beforeEach(() => {
            component.arrayInformation = dataArray;
        });

        it('validate data from file', () => {
            component.setErrrorColumns();
        });
        it('validate data from file', () => {
            component.closeActualDialog();
        });
    });
});

