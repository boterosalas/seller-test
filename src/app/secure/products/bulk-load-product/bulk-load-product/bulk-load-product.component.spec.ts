import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { BulkLoadProductComponent } from './bulk-load-product.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { ComponentsService } from '@app/shared';
import { BulkLoadProductService } from '../bulk-load-product.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { LoadingService, UserLoginService, UserParametersService, ModalService } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { SupportService } from '@app/secure/support-modal/support.service';
import { of, BehaviorSubject } from 'rxjs';
import { BasicInformationService } from '../../create-product-unit/basic-information/basic-information.component.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SearchService } from '../../create-product-unit/categorization/search.component.service';
import { componentRefresh } from '@angular/core/src/render3/instructions';
import { By } from '@angular/platform-browser';

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
    { Identifier: 'hexColourCodePDPProduct', Value: '^[a-zA-Z0-9]{1,6}$', Module: 'productos' },
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
        'setProducts', 'getCargasMasivas', 'verifyStateCharge', 'getCategoriesVTEX']);
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    // const mockAuthService = jasmine.createSpyObj('AuthService', ['getMenu', 'profileType$']);
    const mockUserParametersService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
    const mockModalService = jasmine.createSpyObj('ModalService', ['showModal']);
    const mockSupportService = jasmine.createSpyObj('SupportService', ['getRegexFormSupport']);
    const mockBasicInformationService = jasmine.createSpyObj('BasicInformationService', ['getActiveBrands']);
    const mockFormBuilder = jasmine.createSpyObj('FormBuilder', ['group']);
    const mockSearchService = jasmine.createSpyObj('SearchService', ['getCategories']);
    const mockMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

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
    }

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
        sellerEmail: 'ccbustamante2@misena.edu.co',
        sellerId: '11618',
        sellerName: 'la tienda de cristian 2019 vs 5',
        sellerNit: '1128438122',
        sellerProfile: 'seller',
    }

    const UserInformationAdmin = {
        sellerEmail: 'ccbustamante2@misena.edu.co',
        sellerId: '11618',
        sellerName: 'la tienda de cristian 2019 vs 5',
        sellerNit: '1128438122',
        sellerProfile: 'admin',
    }


    let fixture: ComponentFixture<BulkLoadProductComponent>;
    let component: BulkLoadProductComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // Se declara el componente a testear
            declarations: [BulkLoadProductComponent],
            imports: [MaterialModule],
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
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BulkLoadProductComponent);
        component = fixture.componentInstance;
        const result = {
            status: 200,
            body: {
                data: JSON.stringify({ Data: 'Success' })
            }
        };
        mockBulkLoadProductService.getAmountAvailableLoads.and.returnValue(of(result));
        const res = {
            body: {
                body: JSON.stringify({ Data: registerRegex })
            }
        };
        mockSupportService.getRegexFormSupport.and.returnValue(of(res));
        mockBasicInformationService.getActiveBrands.and.returnValue(of(brands));
        mockBulkLoadProductService.getCargasMasivas.and.returnValue(of(response));
        mockBulkLoadProductService.getCategoriesVTEX.and.returnValue(of(vetex));
        component.categoryForm = new FormGroup({
            Name: new FormControl(''),
            productType: new FormControl(''),
            TipodeObjeto: new FormControl('')
        });

    });
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
            component.validateFormSupport();
            expect(mockSupportService.getRegexFormSupport).toHaveBeenCalled();
        });

        it('Download excel', () => {
            component.downloadFormatMassiveOfferLoadinternacional();
        });

        it('Download excel spanish', () => {
            component.downloadFormatMassiveOfferLoad();
        });

        it('Validate status charge', () => {
            component.verifyStateCharge();
            expect(mockBulkLoadProductService.getCargasMasivas).toHaveBeenCalled();
        });

        it('Validate status charge checked true', () => {
            response.body.data.status = 1;
            component.verifyStateCharge();
            expect(mockBulkLoadProductService.getCargasMasivas).toHaveBeenCalled();
        });

        it('Validate datos plantilla technology', () => {
            component.getDataFormFileTechnology();
            const prueba = component.getDataFormFileTechnology();
            expect(prueba.categoria).toBeTruthy();
        });

        it('Validate datos plantilla clothing', () => {
            component.getDataFormFileClothing();
            const prueba = component.getDataFormFileClothing();
            expect(prueba.categoria).toBeTruthy();
        });

        it('Configuracion de la tabla', () => {
            component.configDataDialog();
            const pruebaDialog = component.configDataDialog();
            expect(pruebaDialog).toBeTruthy();
        });

        it('Lista por marcas', () => {
            component.listOfBrands();
            expect(mockBasicInformationService.getActiveBrands).toHaveBeenCalled();
        });
    });


    describe('Admin login', () => {
        beforeEach(() => {
            mockAuthService.profileType$.next('Admin');
        });
        it('Get quantity charges in seller', () => {
            component.getAvaliableLoads();
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

        it('export excel Technology', () => {
            component.modelSpecs = {pruebas: '1', testeo: '2'};
            component.categoryType.setValue('Technology');
            component.exportExcel();
            expect(component.exportExcel).toBeTruthy();
        });

        it('export excel Clothing', () => {
            component.modelSpecs = {pruebas: '1', testeo: '2'};
            component.categoryType.setValue('Clothing');
            component.exportExcel();
            expect(component.exportExcel).toBeTruthy();
        });

        it('vtex tree', () => {
            component.trasformTree();
        });

    });

    describe('seller', () => {

        beforeEach(() => {
            mockUserParametersService.getUserData.and.returnValue(UserInformation);
        });

            it('get user data', () => {
                component.getDataUser();
                fixture.whenStable().then(() => {
                    tick();
                    expect(component.user).toContain(UserInformation);
                });
            });

            it('on file change', ()=> {
                component.onFileChange(new Event('change'));
            });

    });


    describe('no seller', () => {
        beforeEach(() => {
            mockUserParametersService.getUserData.and.returnValue(UserInformationAdmin);
        });

        it('get user data', () => {
            component.getDataUser();
        });

    });

});

