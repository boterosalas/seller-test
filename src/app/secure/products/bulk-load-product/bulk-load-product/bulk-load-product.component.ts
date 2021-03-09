import { animate, state, style, transition, trigger } from '@angular/animations';

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { LoadingService, Logger, ModalService, UserParametersService } from '@app/core';
import { ComponentsService, UserInformation } from '@app/shared';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { BulkLoadProductService } from '../bulk-load-product.service';
import { FinishUploadProductInformationComponent, } from '../finish-upload-product-information/finish-upload-product-information.component';
import { AbaliableLoadModel, ModelProduct } from '../models/product.model';
import { MenuModel, loadFunctionality, bulkLoadProductName } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { distinctUntilChanged } from 'rxjs/operators';
import { SupportService } from '@app/secure/support-modal/support.service';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { VtexTree } from './VTEXtreeList';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { trimField } from '../../../../shared/util/validation-messages';
import { SearchService } from '../../create-product-unit/categorization/search.component.service';
import { TreeSelected } from '@app/secure/parameterize/category/category-tree/category-tree.component';
import { combineLatest } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

/* log component */
const log = new Logger('BulkLoadProductComponent');
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-bulk-load-product',
  templateUrl: './bulk-load-product.component.html',
  styleUrls: ['./bulk-load-product.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BulkLoadProductComponent implements OnInit, TreeSelected {

  public paginator: any;

  /* Información del usuario*/
  public user: UserInformation;

  /* Nombre del archivo cargado*/
  public fileName: any;

  /* Sort para la tabla*/
  public sort: any;

  /*Variable para almacenar los datos de la limitacion de carga */
  public dataAvaliableLoads: AbaliableLoadModel;

  /*  Variable que almacena el numero de elementos de la tabla*/
  public numberElements: number;

  /* Variable que se emplea para el proceso de la carga de excel, se indica 501 por que se cuenta la primera fila que contiene los titulos*/
  public limitRowExcel: number;

  /* Número de filas cargadas*/
  public countRowUpload: number;

  /* Numero de errores*/
  public countErrors: number;

  /* Número de órdenes cargadas*/
  public orderListLength: boolean;

  /* Creo el elemento que se empleara para la tabla*/
  public dataSource: MatTableDataSource<ModelProduct>;

  /* Objeto que contendra los datos del excel*/
  public arrayInformation: Array<ModelProduct>;

  /* Objeto que contendra los datos del excel y servira para realizar el envio de la información*/
  public arrayInformationForSend: Array<{}>;

  /* Lista de logs*/
  public listLog: Array<any>;

  public arrayNecessaryData: Array<any>;

  /* Mirar el estado del progreso de la carga*/
  public progressStatus = false;

  public eanComboArray: any[];

  public eanComboPosition = -1;

  public iVal: any;

  public showCharge: boolean;

  /*listado de categorias*/
  listCategories: any[] = [];

  /*listado de especificaciones*/
  listSpecs: any[] = [];

  checkIfDoneCharge: any = null;


  // Objeto moquear regex
  productsRegex = {
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

  // listado de colores
  listColorProducts: any = [];

  // active brands
  brands: any = [];

  // categorias vetex
  vetex: any = [];

  // size
  size: any = [];

  culture = 'ES';

  // specName

  modelSpecs: any;

  // variable para la  creacion del excel
  dataTheme;

  // tipo extension XLSX
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';

  // Variables con los permisos que este componente posee
  permissionComponent: MenuModel;
  load = loadFunctionality;

  /* Input file que carga el archivo*/
  @ViewChild('fileUploadOption', {static: false}) inputFileUpload: any;
  isAdmin: boolean;
  profileTypeLoad: any;

  // Formulario para la seleccion de una categoria a descargar planitlla
  categoryForm: FormGroup;

  /*arabol vtex*/
  vtextree: any[] = [];

  // Variable para mostrar loading
  public isLoad = false;

  public status = 1;

  dataProduct:any = {};

  @ViewChild('modalContent', {static: false}) contentDialog: TemplateRef<any>;
  copySizeArray: any;
  setInterval: any;

  constructor(
    public componentService: ComponentsService,
    public BulkLoadProductS: BulkLoadProductService,
    public dialog: MatDialog,
    private loadingService: LoadingService,
    public userParams: UserParametersService,
    private modalService: ModalService,
    public authService: AuthService,
    public SUPPORT: SupportService,
    private service: BasicInformationService,
    public fb: FormBuilder,
    private searchService: SearchService,
    private snackBar: MatSnackBar,
    private languageService: TranslateService
  ) {
    /*Se le asigna valor a todas las variables*/
    this.arrayInformation = [];
    this.arrayInformationForSend = [];
    this.listLog = [];
    this.arrayNecessaryData = [];
    this.orderListLength = true;
    this.limitRowExcel = 1048576;
    this.numberElements = 0;
    this.countRowUpload = 0;
    this.countErrors = 0;
    this.fileName = '';
    this.eanComboArray = [];

    this.categoryForm = this.fb.group({
      Name: ['', Validators.compose([Validators.required, trimField])],
      productType: ['', Validators.compose([Validators.required, trimField])],
      TipodeObjeto: ['', Validators.compose([Validators.required, trimField])]
    });

  }

  /**
   * @memberof BulkLoadProductComponent
   */
  ngOnInit() {
    /*Se llama el metodo que valida si se encuentra logeado, este metodo hace un callback y llama el metodo isLoggedIn()*/
    this.permissionComponent = this.authService.getMenu(bulkLoadProductName);
    // if (this.getFunctionality(this.load)) {
    //   this.getAvaliableLoads();
    // }
    this.getDataUser();
    this.refreshVtexTree();
    this.trasformTree();
    // Prepare es el metodo que debe quedar
    this.prepareComponent();
    // this.listOfCategories();
    // this.listOfSpecs();
  }

  prepareComponent() {
    const availableLoads$ = this.authService.profileType$.pipe(distinctUntilChanged());
    const verifyStateCharge$ = this.BulkLoadProductS.getCargasMasivas();
    const validateRegex$ = this.SUPPORT.getRegexFormSupport(null);
    const getBrands$ = this.service.getActiveBrands();
    const getColor$ = this.service.getColorProducts();
    const categoryList$ = this.searchService.getCategories();
    const listOfSize$ = this.service.getSizeProducts();

    this.loadingService.viewSpinner();
    combineLatest(
      availableLoads$,
      verifyStateCharge$,
      validateRegex$,
      getBrands$,
      getColor$,
      categoryList$,
      listOfSize$
    ).subscribe(([
      availableLoads,
      verifyStateCharge,
      validateRegex,
      getBrands,
      getColor,
      categoryList,
      listOfSize
    ]) => {
      this.getAvaliableLoads(availableLoads);
      this.verifyStateCharge(verifyStateCharge);
      this.validateFormSupport(validateRegex);
      this.listOfBrands(getBrands);
      this.listColor(getColor);
      this.getCategoriesList(categoryList);
      this.listOfSize(listOfSize);
      this.loadingService.closeSpinner();
    });
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.showCharge = true;
    } else {
      this.showCharge = false;
    }
  }

  /**
   * @method getAvaliableLoads
   * @description Metodo que consume el servicio de productos y obtiene cuantas cargas se pueden realizar
   */
  getAvaliableLoads(type?: any) {

    /*Se muestra el loading*/
    /*Se llama el metodo que consume el servicio de las cargas permitidas por día y se hace un subscribe*/
    if (!this.profileTypeLoad && !!type) {
      this.profileTypeLoad = type;
      this.isAdmin = type !== 'Tienda';
    }
    if (this.isAdmin) {
      this.BulkLoadProductS.getAmountAvailableLoads().subscribe(
        (result: any) => {
          /*se valida que el status de la respuesta del servicio sea 200 y traiga datos*/
          if (result.status === 200 && result.body.data) {
            /*Se guardan los datos en una variable*/
            this.dataAvaliableLoads = result.body.data;
          } else {
            /*si el status es diferente de 200 y el servicio devolvio datos se muestra el modal de error*/
            this.modalService.showModal('errorService');
          }
        }
      );
    }
  }

  /**
   * @memberof BulkLoadProductComponent
   */
  resetUploadFIle() {
    /*Limpio el input file*/
    this.inputFileUpload.nativeElement.value = '';
  }

  /**
   * @memberof BulkLoadProductComponent
   */
  resetVariableUploadFile() {
    /*Limpio las variables empleadas para visualizar los resultados de la carga*/
    this.listLog = [];
    this.countErrors = 0;
    this.countRowUpload = 0;
    this.arrayInformation = [];
    this.arrayInformationForSend = [];
    this.orderListLength = true;
    this.numberElements = 0;
    this.fileName = '';
    this.arrayNecessaryData = [];
    /*Se llama el metodo que finaliza la carga*/
    this.finishProcessUpload();
  }

  /**
   * Método que permite detectar el input file
   * @param {*} evt
   * @memberof BulkLoadProductComponent
   */
  onFileChange(evt: any) {
    /*1. Limpio las variables empleadas en el proceso de carga.*/
    this.resetVariableUploadFile();
    /*2. Capturo los datos del excel*/
    this.readFileUpload(evt).then(data => {
      /*3. Valido los datos del excel*/
      this.validateDataFromFile(data, evt);
      this.resetUploadFIle();
    }, err => {
      this.loadingService.closeSpinner();
      this.resetVariableUploadFile();
      this.resetUploadFIle();
      this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.error_has_uploading'), 'Aceptar', 4000);
    });
  }

  /**
   * Funcionalidad que permite capturar los datos del excel.
   * @param {*} evt
   * @returns {Promise<any>}
   * @memberof BulkLoadProductComponent
   */
  readFileUpload(evt: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // this.loadingService.viewSpinner();
      let data: any;
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) {
        throw new Error('Cannot use multiple files');
      }
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        try {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { raw: true, type: 'binary', sheetRows: this.limitRowExcel });
          /* grab first sheet */
          // let ws: XLSX.WorkSheet = !!wb.Sheets['Productos'] ? wb.Sheets['Productos'] : wb.Sheets['Products'];
          let ws: XLSX.WorkSheet;

          if (wb.Sheets && wb.SheetNames[0]) {
            ws = wb.Sheets[wb.SheetNames[0]];
          }

          /* save data */
          if (ws && ws !== null && ws !== undefined) {
            data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
            log.debug(data);
            resolve(data);
          } else {
            reject(e);
          }
        } catch (e) {
          log.info(e);
          reject(e);
        }
      };
      reader.readAsBinaryString(target.files[0]);
    });
  }

  /**
   * Metodo que se encarga de validar los datos del excel
   * @param {any} res
   * @param {*} file
   * @memberof BulkLoadProductComponent
   */
  validateDataFromFile(res: any, file: any) {

    /*
    *if Valido si la cantidad de carga permitidas por día es menor o igual a 0
    *else if Valido que la cantidad de cargas permitidas por día sea mayor a 0
    */
    if (this.dataAvaliableLoads && this.dataAvaliableLoads.amountAvailableLoads <= 0) {
      this.loadingService.closeSpinner();
      this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.limit_for_day'), 'Aceptar', 10000);
    } else if ((this.dataAvaliableLoads && this.dataAvaliableLoads.amountAvailableLoads > 0) || !this.isAdmin) {
      /*
      * if Valido que el excel tenga mas de 1 registro (por lo general el primer registro son los titulos)
      * else el archino no tiene datos y no lo deja continuar*/
      if (res.length > 1) {
        /*Variable para controlar cuantas filas vacias hay*/
        let contEmptyRow = 0;

        /*Se hace iteración en todas las filas del excel*/
        for (let i = 0; i < res.length; i++) {
          /*Se crea un nuevo objeto por cada fila que traiga el excel*/
          this.arrayNecessaryData.push([]);
          /*Se hace iteración en todas las columnas que tenga una fila del excel*/
          for (let j = 0; j < res[0].length; j++) {
            /*Se valida si la primera celda de cada columna si tenga dato, si no tiene no se tendra en cuenta*/
            if (res[0][j] !== '' && res[0][j] !== null && res[0][j] !== undefined && res[i][j] !== 'Seleccionar' && res[i][j] !== 'Escribe o elige un valor de la hoja de marcas') {
              /*Se insertan los datos de la celda en el objeto creato anteriormente dentro del arreglo de datos necesarios, solo si el la primera celda de toda la columna trae datos*/
              this.arrayNecessaryData[i].push(res[i][j]);
            }
          }
        }

        /*Constante para almacenar cuantas columnas tienes el archivo de excel*/
        const numCol: any = this.arrayNecessaryData[0].length;

        /*Se hace iteración en el arreglo dependiendo del número de filas*/
        for (let i = 0; i < this.arrayNecessaryData.length; i++) {
          /*Variable para contar cuantas celdas vacias tiene una fila*/
          let contEmptycell = 0;
          /*Variable para decir si una fila esta vacia*/
          let rowEmpty = false;

          /*Iteracion de 0 hasta el número de columnas */
          for (let j = 0; j < numCol; j++) {
            /*Validación para saber si una celda esta vacia*/
            if (this.arrayNecessaryData[i][j] === undefined || this.arrayNecessaryData[i][j] === null ||
              this.arrayNecessaryData[i][j] === ' ' || this.arrayNecessaryData[i][j] === '') {
              /*Si hay celdas vacias se empiezan a contar*/
              contEmptycell += 1;
              /*Validación si el número de celdas vacias es igual al número de columnas*/
              if (contEmptycell === numCol) {
                /*Se empiezan a contar las filas vacias*/
                contEmptyRow += 1;
                /*Se confirma que hay una fila vacia*/
                rowEmpty = true;
              }
            }
          }

          /*Validación si hay fila vacia */
          if (rowEmpty) {
            /*Si hay fila vacia esta se remueve y se devuelve la iteración un paso */
            this.arrayNecessaryData.splice(i, 1);
            i--;
          }

        }

        /*Variable para contar el número de registros que esta en el excel, se resta 1 porque no se tiene en cuenta la primera fila que es la fila de titulos */
        const numberRegister = this.arrayNecessaryData.length - 1;
        /*
        * if valido si el excel solo trae 2 registros y hay 1 vacio
        * else if se valida que el documento tenga en los titulos o primera columna nos datos, EAN, Tipo de Productoo y Categoria
        * else si no lo tiene significa que el formato es invalido y manda un error*/
        if ((res.length - contEmptyRow) === 1) {
          this.loadingService.closeSpinner();
          this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.no_information_contains'), 'Aceptar', 10000);
        } else {
          if (this.arrayNecessaryData[0].includes('EAN') && this.arrayNecessaryData[0].includes('TipoProducto') || this.arrayNecessaryData[0].includes('EAN') && this.arrayNecessaryData[0].includes('ProductType')
            || this.arrayNecessaryData[0].includes('EAN') && this.arrayNecessaryData[0].includes('TypeProduct')) {
            if (this.profileTypeLoad === 'Tienda') {
              if (this.arrayNecessaryData[0].indexOf('Product Name') !== -1) {
                this.iVal = {
                  iEAN: this.arrayNecessaryData[0].indexOf('EAN'),
                  iNombreProd: this.arrayNecessaryData[0].indexOf('Product Name'),
                  iCategoria: this.arrayNecessaryData[0].indexOf('Category'),
                  iMarca: this.arrayNecessaryData[0].indexOf('Brand'),
                  iDescripcion: this.arrayNecessaryData[0].indexOf('Description'),
                  iMetaTitulo: this.arrayNecessaryData[0].indexOf('Meta Title'),
                  iMetaDescripcion: this.arrayNecessaryData[0].indexOf('Meta Description'),
                  iPalabrasClave: this.arrayNecessaryData[0].indexOf('Keywords'),
                  iAltoDelEmpaque: this.arrayNecessaryData[0].indexOf('Package Height'),
                  ilargoDelEmpaque: this.arrayNecessaryData[0].indexOf('Package Length'),
                  iAnchoDelEmpaque: this.arrayNecessaryData[0].indexOf('Package Width'),
                  iPesoDelEmpaque: this.arrayNecessaryData[0].indexOf('Package Weight'),
                  iSkuShippingSize: this.arrayNecessaryData[0].indexOf('skuShippingsize'),
                  iAltoDelProducto: this.arrayNecessaryData[0].indexOf('Item Height'),
                  iLargoDelProducto: this.arrayNecessaryData[0].indexOf('Item Length'),
                  iAnchoDelProducto: this.arrayNecessaryData[0].indexOf('Item Width'),
                  iPesoDelProducto: this.arrayNecessaryData[0].indexOf('Item Weight'),
                  iVendedor: this.arrayNecessaryData[0].indexOf('Seller'),
                  iTipoDeProducto: this.arrayNecessaryData[0].indexOf('ProductType'),
                  iURLDeImagen1: this.arrayNecessaryData[0].indexOf('Image URL 1'),
                  iURLDeImagen2: this.arrayNecessaryData[0].indexOf('Image URL 2'),
                  iURLDeImagen3: this.arrayNecessaryData[0].indexOf('Image URL 3'),
                  iURLDeImagen4: this.arrayNecessaryData[0].indexOf('Image URL 4'),
                  iURLDeImagen5: this.arrayNecessaryData[0].indexOf('Image URL 5'),
                  iModificacionImagen: this.arrayNecessaryData[0].indexOf('Image Modification'),
                  iParentReference: this.arrayNecessaryData[0].indexOf('Parent reference'),
                  // iSonReference: this.arrayNecessaryData[0].indexOf('Child reference'),
                  iSize: this.arrayNecessaryData[0].indexOf('Size'),
                  iColor: this.arrayNecessaryData[0].indexOf('Color'),
                  iHexColourName: this.arrayNecessaryData[0].indexOf('hexColourName'),
                  iLogisticExito: this.arrayNecessaryData[0].indexOf('Exito Logistics'),
                  iMeasurementUnit: this.arrayNecessaryData[0].indexOf('Measuring Unit'),
                  iConversionFactor: this.arrayNecessaryData[0].indexOf('Conversion Factor'),
                  iDrainedFactor: this.arrayNecessaryData[0].indexOf('Drained Factor'),
                  iEanCombo: this.arrayNecessaryData[0].indexOf('Combo EAN Group')
                };
              } else if (this.arrayNecessaryData[0].indexOf('Nombre del producto') !== -1) {
                this.iVal = {
                  iEAN: this.arrayNecessaryData[0].indexOf('EAN'),
                  iNombreProd: this.arrayNecessaryData[0].indexOf('Nombre del producto'),
                  iCategoria: this.arrayNecessaryData[0].indexOf('Categoria'),
                  iMarca: this.arrayNecessaryData[0].indexOf('Marca'),
                  iDescripcion: this.arrayNecessaryData[0].indexOf('Descripcion'),
                  iMetaTitulo: this.arrayNecessaryData[0].indexOf('Meta Titulo'),
                  iMetaDescripcion: this.arrayNecessaryData[0].indexOf('Meta Descripcion'),
                  iPalabrasClave: this.arrayNecessaryData[0].indexOf('Palabras Clave'),
                  iAltoDelEmpaque: this.arrayNecessaryData[0].indexOf('Alto del empaque'),
                  ilargoDelEmpaque: this.arrayNecessaryData[0].indexOf('Largo del empaque'),
                  iAnchoDelEmpaque: this.arrayNecessaryData[0].indexOf('Ancho del empaque'),
                  iPesoDelEmpaque: this.arrayNecessaryData[0].indexOf('Peso del empaque'),
                  iSkuShippingSize: this.arrayNecessaryData[0].indexOf('skuShippingsize'),
                  iAltoDelProducto: this.arrayNecessaryData[0].indexOf('Alto del producto'),
                  iLargoDelProducto: this.arrayNecessaryData[0].indexOf('Largo del producto'),
                  iAnchoDelProducto: this.arrayNecessaryData[0].indexOf('Ancho del producto'),
                  iPesoDelProducto: this.arrayNecessaryData[0].indexOf('Peso del producto'),
                  iVendedor: this.arrayNecessaryData[0].indexOf('Vendedor'),
                  iTipoDeProducto: this.arrayNecessaryData[0].indexOf('TipoProducto'),
                  iURLDeImagen1: this.arrayNecessaryData[0].indexOf('URL de Imagen 1'),
                  iURLDeImagen2: this.arrayNecessaryData[0].indexOf('URL de Imagen 2'),
                  iURLDeImagen3: this.arrayNecessaryData[0].indexOf('URL de Imagen 3'),
                  iURLDeImagen4: this.arrayNecessaryData[0].indexOf('URL de Imagen 4'),
                  iURLDeImagen5: this.arrayNecessaryData[0].indexOf('URL de Imagen 5'),
                  iModificacionImagen: this.arrayNecessaryData[0].indexOf('Modificacion Imagen'),
                  iParentReference: this.arrayNecessaryData[0].indexOf('Referencia Padre'),
                  // iSonReference: this.arrayNecessaryData[0].indexOf('Referencia Hijo'),
                  iSize: this.arrayNecessaryData[0].indexOf('Talla'),
                  iColor: this.arrayNecessaryData[0].indexOf('Color'),
                  iHexColourName: this.arrayNecessaryData[0].indexOf('hexColourName'),
                  iLogisticExito: this.arrayNecessaryData[0].indexOf('Logistica Exito'),
                  iMeasurementUnit: this.arrayNecessaryData[0].indexOf('Descripcion Unidad de Medida'),
                  iConversionFactor: this.arrayNecessaryData[0].indexOf('Factor de conversion'),
                  iDrainedFactor: this.arrayNecessaryData[0].indexOf('Factor escurrido'),
                  iEanCombo: this.arrayNecessaryData[0].indexOf('Grupo EAN Combo')
                };
              } else {
                if (this.arrayNecessaryData[0].indexOf('Nom du produit') !== -1) {
                  this.iVal = {
                    iEAN: this.arrayNecessaryData[0].indexOf('EAN'),
                    iNombreProd: this.arrayNecessaryData[0].indexOf('Nom du produit'),
                    iCategoria: this.arrayNecessaryData[0].indexOf('Catégorie'),
                    iMarca: this.arrayNecessaryData[0].indexOf('Marque'),
                    iDescripcion: this.arrayNecessaryData[0].indexOf('Description'),
                    iMetaTitulo: this.arrayNecessaryData[0].indexOf('Meta Titulo'),
                    iMetaDescripcion: this.arrayNecessaryData[0].indexOf('Description de la méta'),
                    iPalabrasClave: this.arrayNecessaryData[0].indexOf('Mots-clés'),
                    iAltoDelEmpaque: this.arrayNecessaryData[0].indexOf('Hauteur de l\'emballage'),
                    ilargoDelEmpaque: this.arrayNecessaryData[0].indexOf('Longueur d\'emballage'),
                    iAnchoDelEmpaque: this.arrayNecessaryData[0].indexOf('Largeur de l\'emballage'),
                    iPesoDelEmpaque: this.arrayNecessaryData[0].indexOf('Poids de l\'emballage'),
                    iSkuShippingSize: this.arrayNecessaryData[0].indexOf('skuShippingsize'),
                    iAltoDelProducto: this.arrayNecessaryData[0].indexOf('Hauteur du produit'),
                    iLargoDelProducto: this.arrayNecessaryData[0].indexOf('Longueur du produit'),
                    iAnchoDelProducto: this.arrayNecessaryData[0].indexOf('Largeur du produit'),
                    iPesoDelProducto: this.arrayNecessaryData[0].indexOf('Poids du produit'),
                    iVendedor: this.arrayNecessaryData[0].indexOf('Vendeur'),
                    iTipoDeProducto: this.arrayNecessaryData[0].indexOf('TypeProduct'),
                    iURLDeImagen1: this.arrayNecessaryData[0].indexOf('URL de l\'image 1'),
                    iURLDeImagen2: this.arrayNecessaryData[0].indexOf('URL de l\'image 2'),
                    iURLDeImagen3: this.arrayNecessaryData[0].indexOf('URL de l\'image 3'),
                    iURLDeImagen4: this.arrayNecessaryData[0].indexOf('URL de l\'image 4'),
                    iURLDeImagen5: this.arrayNecessaryData[0].indexOf('URL de l\'image 5'),
                    iModificacionImagen: this.arrayNecessaryData[0].indexOf('Modification d\'image'),
                    iParentReference: this.arrayNecessaryData[0].indexOf('Référence Père'),
                    // iSonReference: this.arrayNecessaryData[0].indexOf('Référence Enfant'),
                    iSize: this.arrayNecessaryData[0].indexOf('Taille'),
                    iColor: this.arrayNecessaryData[0].indexOf('Couleur'),
                    iHexColourName: this.arrayNecessaryData[0].indexOf('hexColourName'),
                    iLogisticExito: this.arrayNecessaryData[0].indexOf('Exito logistique'),
                    iMeasurementUnit: this.arrayNecessaryData[0].indexOf('Description Unité de mesure'),
                    iConversionFactor: this.arrayNecessaryData[0].indexOf('Facteur de conversion'),
                    iDrainedFactor: this.arrayNecessaryData[0].indexOf('Facteur drainé'),
                    iEanCombo: this.arrayNecessaryData[0].indexOf('Bundle EAN')
                  };
                }
              }
            } else {
              if (this.arrayNecessaryData[0].indexOf('Product Name') !== -1) {
                this.iVal = {
                  iEAN: this.arrayNecessaryData[0].indexOf('EAN'),
                  iNombreProd: this.arrayNecessaryData[0].indexOf('Product Name'),
                  iCategoria: this.arrayNecessaryData[0].indexOf('Category'),
                  iMarca: this.arrayNecessaryData[0].indexOf('Brand'),
                  iDescripcion: this.arrayNecessaryData[0].indexOf('Description'),
                  iMetaTitulo: this.arrayNecessaryData[0].indexOf('Meta Title'),
                  iMetaDescripcion: this.arrayNecessaryData[0].indexOf('Meta Description'),
                  iPalabrasClave: this.arrayNecessaryData[0].indexOf('Keywords'),
                  iAltoDelEmpaque: this.arrayNecessaryData[0].indexOf('Package Height'),
                  ilargoDelEmpaque: this.arrayNecessaryData[0].indexOf('Package Length'),
                  iAnchoDelEmpaque: this.arrayNecessaryData[0].indexOf('Package Width'),
                  iPesoDelEmpaque: this.arrayNecessaryData[0].indexOf('Package Weight'),
                  iSkuShippingSize: this.arrayNecessaryData[0].indexOf('skuShippingsize'),
                  iAltoDelProducto: this.arrayNecessaryData[0].indexOf('Item Height'),
                  iLargoDelProducto: this.arrayNecessaryData[0].indexOf('Item Length'),
                  iAnchoDelProducto: this.arrayNecessaryData[0].indexOf('Item Width'),
                  iPesoDelProducto: this.arrayNecessaryData[0].indexOf('Item Weight'),
                  iVendedor: this.arrayNecessaryData[0].indexOf('Seller'),
                  iTipoDeProducto: this.arrayNecessaryData[0].indexOf('ProductType'),
                  iURLDeImagen1: this.arrayNecessaryData[0].indexOf('Image URL 1'),
                  iURLDeImagen2: this.arrayNecessaryData[0].indexOf('Image URL 2'),
                  iURLDeImagen3: this.arrayNecessaryData[0].indexOf('Image URL 3'),
                  iURLDeImagen4: this.arrayNecessaryData[0].indexOf('Image URL 4'),
                  iURLDeImagen5: this.arrayNecessaryData[0].indexOf('Image URL 5'),
                  iModificacionImagen: this.arrayNecessaryData[0].indexOf('Image Modification'),
                  iParentReference: this.arrayNecessaryData[0].indexOf('Parent reference'),
                  iSonReference: this.arrayNecessaryData[0].indexOf('Child reference'),
                  iSize: this.arrayNecessaryData[0].indexOf('Size'),
                  iColor: this.arrayNecessaryData[0].indexOf('Color'),
                  iHexColourName: this.arrayNecessaryData[0].indexOf('hexColourName'),
                  iLogisticExito: this.arrayNecessaryData[0].indexOf('Exito Logistics'),
                  iMeasurementUnit: this.arrayNecessaryData[0].indexOf('Measuring Unit'),
                  iConversionFactor: this.arrayNecessaryData[0].indexOf('Conversion Factor'),
                  iDrainedFactor: this.arrayNecessaryData[0].indexOf('Drained Factor'),
                  iEanCombo: this.arrayNecessaryData[0].indexOf('Combo EAN Group')
                };
              } else if (this.arrayNecessaryData[0].indexOf('Nombre del producto') !== -1) {
                this.iVal = {
                  iEAN: this.arrayNecessaryData[0].indexOf('EAN'),
                  iNombreProd: this.arrayNecessaryData[0].indexOf('Nombre del producto'),
                  iCategoria: this.arrayNecessaryData[0].indexOf('Categoria'),
                  iMarca: this.arrayNecessaryData[0].indexOf('Marca'),
                  iDescripcion: this.arrayNecessaryData[0].indexOf('Descripcion'),
                  iMetaTitulo: this.arrayNecessaryData[0].indexOf('Meta Titulo'),
                  iMetaDescripcion: this.arrayNecessaryData[0].indexOf('Meta Descripcion'),
                  iPalabrasClave: this.arrayNecessaryData[0].indexOf('Palabras Clave'),
                  iAltoDelEmpaque: this.arrayNecessaryData[0].indexOf('Alto del empaque'),
                  ilargoDelEmpaque: this.arrayNecessaryData[0].indexOf('Largo del empaque'),
                  iAnchoDelEmpaque: this.arrayNecessaryData[0].indexOf('Ancho del empaque'),
                  iPesoDelEmpaque: this.arrayNecessaryData[0].indexOf('Peso del empaque'),
                  iSkuShippingSize: this.arrayNecessaryData[0].indexOf('skuShippingsize'),
                  iAltoDelProducto: this.arrayNecessaryData[0].indexOf('Alto del producto'),
                  iLargoDelProducto: this.arrayNecessaryData[0].indexOf('Largo del producto'),
                  iAnchoDelProducto: this.arrayNecessaryData[0].indexOf('Ancho del producto'),
                  iPesoDelProducto: this.arrayNecessaryData[0].indexOf('Peso del producto'),
                  iVendedor: this.arrayNecessaryData[0].indexOf('Vendedor'),
                  iTipoDeProducto: this.arrayNecessaryData[0].indexOf('TipoProducto'),
                  iURLDeImagen1: this.arrayNecessaryData[0].indexOf('URL de Imagen 1'),
                  iURLDeImagen2: this.arrayNecessaryData[0].indexOf('URL de Imagen 2'),
                  iURLDeImagen3: this.arrayNecessaryData[0].indexOf('URL de Imagen 3'),
                  iURLDeImagen4: this.arrayNecessaryData[0].indexOf('URL de Imagen 4'),
                  iURLDeImagen5: this.arrayNecessaryData[0].indexOf('URL de Imagen 5'),
                  iModificacionImagen: this.arrayNecessaryData[0].indexOf('Modificacion Imagen'),
                  iParentReference: this.arrayNecessaryData[0].indexOf('Referencia Padre'),
                  iSonReference: this.arrayNecessaryData[0].indexOf('Referencia Hijo'),
                  iSize: this.arrayNecessaryData[0].indexOf('Talla'),
                  iColor: this.arrayNecessaryData[0].indexOf('Color'),
                  iHexColourName: this.arrayNecessaryData[0].indexOf('hexColourName'),
                  iLogisticExito: this.arrayNecessaryData[0].indexOf('Logistica Exito'),
                  iMeasurementUnit: this.arrayNecessaryData[0].indexOf('Descripcion Unidad de Medida'),
                  iConversionFactor: this.arrayNecessaryData[0].indexOf('Factor de conversion'),
                  iDrainedFactor: this.arrayNecessaryData[0].indexOf('Factor escurrido'),
                  iEanCombo: this.arrayNecessaryData[0].indexOf('Grupo EAN Combo')
                };
              } else {
                if (this.arrayNecessaryData[0].indexOf('Nom du produit') !== -1) {
                  this.iVal = {
                    iEAN: this.arrayNecessaryData[0].indexOf('EAN'),
                    iNombreProd: this.arrayNecessaryData[0].indexOf('Nom du produit'),
                    iCategoria: this.arrayNecessaryData[0].indexOf('Catégorie'),
                    iMarca: this.arrayNecessaryData[0].indexOf('Marque'),
                    iDescripcion: this.arrayNecessaryData[0].indexOf('Description'),
                    iMetaTitulo: this.arrayNecessaryData[0].indexOf('Meta Titulo'),
                    iMetaDescripcion: this.arrayNecessaryData[0].indexOf('Description de la méta'),
                    iPalabrasClave: this.arrayNecessaryData[0].indexOf('Mots-clés'),
                    iAltoDelEmpaque: this.arrayNecessaryData[0].indexOf('Hauteur de l\'emballage'),
                    ilargoDelEmpaque: this.arrayNecessaryData[0].indexOf('Longueur d\'emballage'),
                    iAnchoDelEmpaque: this.arrayNecessaryData[0].indexOf('Largeur de l\'emballage'),
                    iPesoDelEmpaque: this.arrayNecessaryData[0].indexOf('Poids de l\'emballage'),
                    iSkuShippingSize: this.arrayNecessaryData[0].indexOf('skuShippingsize'),
                    iAltoDelProducto: this.arrayNecessaryData[0].indexOf('Hauteur du produit'),
                    iLargoDelProducto: this.arrayNecessaryData[0].indexOf('Longueur du produit'),
                    iAnchoDelProducto: this.arrayNecessaryData[0].indexOf('Largeur du produit'),
                    iPesoDelProducto: this.arrayNecessaryData[0].indexOf('Poids du produit'),
                    iVendedor: this.arrayNecessaryData[0].indexOf('Vendeur'),
                    iTipoDeProducto: this.arrayNecessaryData[0].indexOf('TypeProduct'),
                    iURLDeImagen1: this.arrayNecessaryData[0].indexOf('URL de l\'image 1'),
                    iURLDeImagen2: this.arrayNecessaryData[0].indexOf('URL de l\'image 2'),
                    iURLDeImagen3: this.arrayNecessaryData[0].indexOf('URL de l\'image 3'),
                    iURLDeImagen4: this.arrayNecessaryData[0].indexOf('URL de l\'image 4'),
                    iURLDeImagen5: this.arrayNecessaryData[0].indexOf('URL de l\'image 5'),
                    iModificacionImagen: this.arrayNecessaryData[0].indexOf('Modification d\'image'),
                    iParentReference: this.arrayNecessaryData[0].indexOf('Référence Père'),
                    iSonReference: this.arrayNecessaryData[0].indexOf('Référence Enfant'),
                    iSize: this.arrayNecessaryData[0].indexOf('Taille'),
                    iColor: this.arrayNecessaryData[0].indexOf('Couleur'),
                    iHexColourName: this.arrayNecessaryData[0].indexOf('hexColourName'),
                    iLogisticExito: this.arrayNecessaryData[0].indexOf('Exito logistique'),
                    iMeasurementUnit: this.arrayNecessaryData[0].indexOf('Description Unité de mesure'),
                    iConversionFactor: this.arrayNecessaryData[0].indexOf('Facteur de conversion'),
                    iDrainedFactor: this.arrayNecessaryData[0].indexOf('Facteur drainé'),
                    iEanCombo: this.arrayNecessaryData[0].indexOf('Bundle EAN')
                  };
                }
              }
            }


            this.arrayNecessaryData.splice(1,2);

            this.eanComboPosition = this.iVal.iEanCombo;

            if (this.isAdmin) {
              /*
            * if si el número de registros es mayor al número de cargas permitidas no lo deja continuar
            * else if si el número de registros es mayor al maximo de cargas permitidas no lo deja continuar
            * else se obtiene el nombre del archivo y se llama la funcion de crear tabla
            */
              if (numberRegister > this.dataAvaliableLoads.amountAvailableLoads) {
                this.loadingService.closeSpinner();
                this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.contains_more_assets'), 'Aceptar', 10000);
              } else if (numberRegister > this.dataAvaliableLoads.maximumAvailableLoads) {
                this.loadingService.closeSpinner();
                this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.amount_records') + this.dataAvaliableLoads.maximumAvailableLoads + this.languageService.instant('secure.products.bulk_upload.amount_allowed'), 'Aceptar', 10000);
              } else {
                this.fileName = file.target.files[0].name;
                this.createTable(this.arrayNecessaryData, this.iVal, numCol);
              }
            } else {
              this.fileName = file.target.files[0].name;
              this.createTable(this.arrayNecessaryData, this.iVal, numCol);
            }
          } else {
            this.loadingService.closeSpinner();
            this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.formt_invalid'), 'Aceptar', 10000);
          }
        }

      } else {
        this.loadingService.closeSpinner();
        this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.no_information_contains'), 'Aceptar', 10000);
      }
    }
  }

  /**
   * Método que se encarga de crear la tabla
   * @param {any} res
   * @memberof BulkLoadProductComponent
   */
  createTable(res: any, iVal: any, numCol: any) {
    for (let i = 0; i < res.length; i++) {
      let variant = false;
      let isModifyImage = false;
      let errorInCell = false;
      if (i !== 0 && i > 0) {
        if (res[i][iVal.iTipoDeProducto].trim() === 'Clothing') {
          variant = true;
        }
        for (let j = 0; j < numCol; j++) {
          if (res[i][j] !== undefined && res[i][j] !== '' && res[i][j] !== null) {
            if (j === iVal.iEAN) {
              const validFormatEan = this.validFormat(res[i][j], 'ean');
              if (!validFormatEan && validFormatEan === false) {
                this.countErrors += 1;
                const row = i + 1,
                  column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'Ean'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iMeasurementUnit) {
              if (res[i][j] !== undefined && res[i][j] !== '') {
                const validformatDescUnidadMedida = this.validFormat(res[i][j], 'descUniMedida');
                if (!validformatDescUnidadMedida && validformatDescUnidadMedida === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'invalidFormatUnidad',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: 'MeasurementUnit'
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }
              }
            } else if (j === iVal.iConversionFactor) {
              if (res[i][j] !== undefined && res[i][j] !== '') {
                const validformatFactConversion = this.validFormat(res[i][j], 'factConversion');
                if (!validformatFactConversion && validformatFactConversion === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'invalidFortFact',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: 'ConversionFactor'
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }
              }
            } else if (j === iVal.iDrainedFactor) {
              if (res[i][j] !== undefined && res[i][j] !== '') {
                const validformatFactEscurrido = this.validFormat(res[i][j], 'factEscurrido');
                if (!validformatFactEscurrido && validformatFactEscurrido === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'invalidFortFact',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: 'DrainedFactor'
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }
              }
            } else if (j === iVal.iEanCombo) {
              if (res[i][j] !== undefined && res[i][j] !== '') {
                const validformatEanCombo = this.validFormat(res[i][j], 'eanCombo');
                if (!validformatEanCombo && validformatEanCombo === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'invalidFormat',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: 'EanCombo'
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                } else {
                  const counterEanCombo = res[i][this.eanComboPosition].split(',');
                  const uniqs = counterEanCombo.filter(function (item: any, index: any, array: any) {
                    return array.indexOf(item) === index;
                  });
                  if (uniqs.length !== counterEanCombo.length) {
                    this.countErrors += 1;
                    const row = i + 1, column = j + 1;
                    const itemLog = {
                      row: this.arrayInformation.length,
                      column: j,
                      type: 'EanComboRepeatError',
                      columna: column,
                      fila: row,
                      positionRowPrincipal: i,
                      dato: 'EanCombo'
                    };
                    this.listLog.push(itemLog);
                    errorInCell = true;
                  }
                }
              }
            } else if (j === iVal.iTipoDeProducto) {
              if (res[i][j] !== 'Clothing' && res[i][j] !== 'Technology') {
                const validFormatCategory = this.validFormat(res[i][j], 'category');
                if (!validFormatCategory && validFormatCategory === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'invalidFormatProduct',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: 'ProductType'
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }
              }
            } else if (j === iVal.iModificacionImagen) {
              const isBoolean = this.validFormat(res[i][j], 'boolean');
              if (!isBoolean && isBoolean === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'BoleanFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'ModifyImage'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              } else {
                if (res[i][j] === '1') {
                  isModifyImage = true;
                }
              }
            } else if (j === iVal.iNombreProd) {
              const isFormatNameProd = this.validFormat(res[i][j], 'nameProd');
              if (!isFormatNameProd && isFormatNameProd === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'Name'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iCategoria) {
              const isNumeric = this.validFormat(res[i][j], 'greaterThanZero');
              if (!isNumeric && isNumeric === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'LessThanZero',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'Category'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iMarca || j === iVal.iMetaTitulo || j === iVal.iMetaDescripcion) {
              const allChars = this.validFormat(res[i][j], 'formatAllChars');
              if (!allChars && allChars === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: j === iVal.iMarca ? 'Brand' : j === iVal.iMetaTitulo ? 'MetaTitle' : j === iVal.iMetaDescripcion ? 'MetaDescription' : null
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iPalabrasClave) {
              const allChars = this.validFormat(res[i][j], 'formatAllCharsKeyWords');
              if (!allChars && allChars === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: j === iVal.iPalabrasClave ? 'KeyWords' : null
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iVendedor) {
              const formatSeller = this.validFormat(res[i][j], 'formatSeller');
              if (!formatSeller && formatSeller === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'Seller'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iURLDeImagen1 || j === iVal.iURLDeImagen2 || j === iVal.iURLDeImagen3 || j === iVal.iURLDeImagen4 || j === iVal.iURLDeImagen5) {
              if (j === iVal.iURLDeImagen1 && isModifyImage === true && isModifyImage) {
                if (res[i][j] === undefined || res[i][j] === '' || res[i][j] === null) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'dateNotFound',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iURLDeImagen1 ? 'ImageUrl1' : null
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }
              } else {
                const validFormatImg = this.validFormat(res[i][j], 'formatImg');
                if (!validFormatImg && validFormatImg === false) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'invalidFormatImage',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iURLDeImagen1 ? 'ImageUrl1' : j === iVal.iURLDeImagen2 ? 'ImageUrl2' : j === iVal.iURLDeImagen3 ? 'ImageUrl3' : j === iVal.iURLDeImagen4 ? 'ImageUrl4' : j === iVal.iURLDeImagen5 ? 'ImageUrl5' : null
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                }
              }

            } else if (j === iVal.iskuShippingsize) {
              const validFormatSku = this.validFormat(res[i][j], 'formatSku');
              if (!validFormatSku && validFormatSku === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'SkuShippingSize'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (
              j === iVal.iAltoDelEmpaque || j === iVal.ilargoDelEmpaque || j === iVal.iAnchoDelEmpaque || j === iVal.iPesoDelEmpaque ||
              j === iVal.iAltoDelProducto || j === iVal.iLargoDelProducto || j === iVal.iAnchoDelProducto || j === iVal.iPesoDelProducto) {
              const validFormatPackage = this.validFormat(res[i][j].replace('.', ','), 'formatPackage');
              if (!validFormatPackage && validFormatPackage === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: j === iVal.iAltoDelEmpaque ? 'PackageHeight' : j === iVal.ilargoDelEmpaque ? 'PackageLength' : j === iVal.iAnchoDelEmpaque ? 'PackageWidth' : j === iVal.iPesoDelEmpaque ? 'PackageWeight'
                    : j === iVal.iAltoDelProducto ? 'ProductHeight' : j === iVal.iLargoDelProducto ? 'ProductLength' : j === iVal.iAnchoDelProducto ? 'ProductWidth' : j === iVal.iPesoDelProducto ? 'ProductWeight' : null
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iDescripcion) {
              const validFormatDesc = this.validFormat(res[i][j], 'formatDescription');
              if (!validFormatDesc && validFormatDesc === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'Description'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (j === iVal.iLogisticExito) {
              const isBoolean = this.validFormat(res[i][j], 'boolean');
              if (!isBoolean && isBoolean === false) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'BoleanFormat',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i,
                  dato: 'IsLogisticsExito'
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            } else if (variant === true) {
              if (iVal.iParentReference === -1 || iVal.iSonReference === -1) {
                this.loadingService.closeSpinner();
                this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.formt_invalid'), 'Aceptar', 4000);
                return;
              } else if (j === iVal.iParentReference || j === iVal.iSonReference) {
                if (res[i][j] === undefined || res[i][j] === '' || res[i][j] === null) {
                  this.countErrors += 1;
                  const row = i + 1, column = j + 1;
                  const itemLog = {
                    row: this.arrayInformation.length,
                    column: j,
                    type: 'dateNotFound',
                    columna: column,
                    fila: row,
                    positionRowPrincipal: i,
                    dato: j === iVal.iParentReference ? 'ParentReference' : j === iVal.iSonReference ? 'SonReference' : null
                  };
                  this.listLog.push(itemLog);
                  errorInCell = true;
                } else {
                  const validFormat = this.validFormat(res[i][j], 'formatAllChars');
                  if (!validFormat && validFormat === false) {
                    this.countErrors += 1;
                    const row = i + 1, column = j + 1;
                    const itemLog = {
                      row: this.arrayInformation.length,
                      column: j,
                      type: 'invalidFormat',
                      columna: column,
                      fila: row,
                      positionRowPrincipal: i,
                      dato: j === iVal.iParentReference ? 'ParentReference' : j === iVal.iSonReference ? 'SonReference' : null
                    };
                    this.listLog.push(itemLog);
                    errorInCell = true;
                  }
                }
              }
              if (res[i][j] !== undefined && res[i][j] !== '' && res[i][j] !== null) {
                if (j === iVal.iSize) {
                  const validFormatSize = this.validFormat(res[i][j], 'size');
                  if (!validFormatSize && validFormatSize === false) {
                    this.countErrors += 1;
                    const row = i + 1, column = j + 1;
                    const itemLog = {
                      row: this.arrayInformation.length,
                      column: j,
                      type: 'invalidFormat',
                      columna: column,
                      fila: row,
                      positionRowPrincipal: i,
                      dato: 'Size'
                    };
                    this.listLog.push(itemLog);
                    errorInCell = true;
                  }
                } else if (j === iVal.iColor) {
                  const validColor = this.validFormat(res[i][j], 'color');
                  if (!validColor && validColor === false) {
                    this.countErrors += 1;
                    const row = i + 1, column = j + 1;
                    const itemLog = {
                      row: this.arrayInformation.length,
                      column: j,
                      type: 'invalidFormat',
                      columna: column,
                      fila: row,
                      positionRowPrincipal: i,
                      dato: 'Color'
                    };
                    this.listLog.push(itemLog);
                    errorInCell = true;
                  }
                } else if (j === iVal.iHexColourName) {
                  const validColorName = this.validFormat(res[i][j], 'colorName');
                  if (!validColorName && validColorName === false) {
                    this.countErrors += 1;
                    const row = i + 1, column = j + 1;
                    const itemLog = {
                      row: this.arrayInformation.length,
                      column: j,
                      type: 'invalidFormat',
                      columna: column,
                      fila: row,
                      positionRowPrincipal: i,
                      dato: 'HexColourName'
                    };
                    this.listLog.push(itemLog);
                    errorInCell = true;
                  }
                }
              }
            } else {
              const extraFields = this.validFormat(res[i][j]);
              if (extraFields === false && !extraFields) {
                this.countErrors += 1;
                const row = i + 1, column = j + 1;
                const itemLog = {
                  row: this.arrayInformation.length,
                  column: j,
                  type: 'invalidFormatExtraField',
                  columna: column,
                  fila: row,
                  positionRowPrincipal: i
                };
                this.listLog.push(itemLog);
                errorInCell = true;
              }
            }
          } else if (j === iVal.iEAN || j === iVal.iTipoDeProducto) {
            if (res[i][j] === undefined || res[i][j] === '' || res[i][j] === null) {
              this.countErrors += 1;
              const row = i + 1, column = j + 1;
              const itemLog = {
                row: this.arrayInformation.length,
                column: j,
                type: 'dateNotFound',
                columna: column,
                fila: row,
                positionRowPrincipal: i,
                dato: j === iVal.iEAN ? 'Ean' : j === iVal.iTipoDeProducto ? 'ProductType' : null
              };
              this.listLog.push(itemLog);
              errorInCell = true;
            }
          }
        }
      }

      if (errorInCell) {
        this.addRowToTable(res, i, iVal, variant);
      }
      this.addInfoTosend(res, i, iVal, variant, errorInCell);
      errorInCell = false;
    }

    this.orderListLength = this.arrayInformationForSend.length === 0 ? true : false;

    if (this.countErrors === 0) {
      this.sendJsonInformation();
    }

  }

  /* Get categories from service, and storage in list categories.
  */
  public getCategoriesList(result?: any): void {
    // guardo el response
    if (result.status === 200) {
      const body = JSON.parse(result.body.body);
      this.listCategories = body.Data;
    } else {
      log.debug('BulkLoadProductComponent:' + result.message);
    }
  }

  /**
   * Método que Almacena los  Registros cargados y que se emplearan para realizar el envio
   * @param {any} res
   * @param {any} index
   * @memberof BulkLoadProductComponent
   */
  addInfoTosend(res: any, i: any, iVal: any, variant?: any, errorInCell: boolean = false) {
    const regex = new RegExp('"', 'g');

    const newObjectForSend = {
      Ean: res[i][iVal.iEAN] ? res[i][iVal.iEAN].trim() : null,
      Name: res[i][iVal.iNombreProd] ? res[i][iVal.iNombreProd].trim() : null,
      Category: res[i][iVal.iCategoria] ? res[i][iVal.iCategoria].trim() : null,
      Brand: res[i][iVal.iMarca] ? res[i][iVal.iMarca].trim() : null,
      Description: res[i][iVal.iDescripcion] ? res[i][iVal.iDescripcion].trim().replace(regex, '\'') : null,
      MetaTitle: res[i][iVal.iMetaTitulo] ? res[i][iVal.iMetaTitulo].trim() : null,
      // MetaTitle: null,
      MetaDescription: res[i][iVal.iMetaDescripcion] ? res[i][iVal.iMetaDescripcion].trim() : null,
      // MetaDescription: null,
      KeyWords: res[i][iVal.iPalabrasClave] ? res[i][iVal.iPalabrasClave].trim() : null,
      PackageHeight: res[i][iVal.iAltoDelEmpaque] ? res[i][iVal.iAltoDelEmpaque].trim().replace('.', ',') : null,
      PackageLength: res[i][iVal.ilargoDelEmpaque] ? res[i][iVal.ilargoDelEmpaque].trim().replace('.', ',') : null,
      PackageWidth: res[i][iVal.iAnchoDelEmpaque] ? res[i][iVal.iAnchoDelEmpaque].trim().replace('.', ',') : null,
      PackageWeight: res[i][iVal.iPesoDelEmpaque] ? res[i][iVal.iPesoDelEmpaque].trim().replace('.', ',') : null,
      SkuShippingSize: res[i][iVal.iSkuShippingSize] ? res[i][iVal.iSkuShippingSize].trim() : null,
      ProductHeight: res[i][iVal.iAltoDelProducto] ? res[i][iVal.iAltoDelProducto].trim().replace('.', ',') : null,
      ProductLength: res[i][iVal.iLargoDelProducto] ? res[i][iVal.iLargoDelProducto].trim().replace('.', ',') : null,
      ProductWidth: res[i][iVal.iAnchoDelProducto] ? res[i][iVal.iAnchoDelProducto].trim().replace('.', ',') : null,
      ProductWeight: res[i][iVal.iPesoDelProducto] ? res[i][iVal.iPesoDelProducto].trim().replace('.', ',') : null,
      Seller: 'Marketplace',
      ProductType: res[i][iVal.iTipoDeProducto] ? res[i][iVal.iTipoDeProducto].trim() : null,
      ImageUrl1: res[i][iVal.iURLDeImagen1] ? res[i][iVal.iURLDeImagen1].trim() : null,
      ImageUrl2: res[i][iVal.iURLDeImagen2] ? res[i][iVal.iURLDeImagen2].trim() : null,
      ImageUrl3: res[i][iVal.iURLDeImagen3] ? res[i][iVal.iURLDeImagen3].trim() : null,
      ImageUrl4: res[i][iVal.iURLDeImagen4] ? res[i][iVal.iURLDeImagen4].trim() : null,
      ImageUrl5: res[i][iVal.iURLDeImagen5] ? res[i][iVal.iURLDeImagen5].trim() : null,
      ModifyImage: res[i][iVal.iModificacionImagen] ? res[i][iVal.iModificacionImagen].trim() : null,
      IsLogisticsExito: res[i][iVal.iLogisticExito] ? res[i][iVal.iLogisticExito] : '0',
      MeasurementUnit: res[i][iVal.iMeasurementUnit] ? res[i][iVal.iMeasurementUnit].trim() : null,
      ConversionFactor: res[i][iVal.iConversionFactor] ? res[i][iVal.iConversionFactor].trim() : null,
      DrainedFactor: res[i][iVal.iDrainedFactor] ? res[i][iVal.iDrainedFactor].trim() : null,
      EanCombo: res[i][iVal.iEanCombo] ? res[i][iVal.iEanCombo].trim() : null,
      features: []
    };

    if (variant && variant === true) {
      newObjectForSend['ParentReference'] = res[i][iVal.iParentReference] ? res[i][iVal.iParentReference].trim() : null;
      newObjectForSend['SonReference'] = res[i][iVal.iSonReference] ? res[i][iVal.iSonReference].trim() : null;
      newObjectForSend['Size'] = res[i][iVal.iSize] ? res[i][iVal.iSize].trim() : null;
      newObjectForSend['Color'] = res[i][iVal.iColor] ? res[i][iVal.iColor].trim() : null;
      newObjectForSend['HexColourName'] = res[i][iVal.iHexColourName] ? res[i][iVal.iHexColourName].trim() : null;
    }

    if (i > 0 && i !== 0) {
      for (let k = 0; k < res[0].length; k++) {
        const newFeatures = {};
        if (k !== iVal.iEAN &&
          k !== iVal.iNombreProd &&
          k !== iVal.iCategoria &&
          k !== iVal.iMarca &&
          k !== iVal.iDescripcion &&
          k !== iVal.iMetaTitulo &&
          k !== iVal.iMetaDescripcion &&
          k !== iVal.iPalabrasClave &&
          k !== iVal.iAltoDelEmpaque &&
          k !== iVal.ilargoDelEmpaque &&
          k !== iVal.iAnchoDelEmpaque &&
          k !== iVal.iPesoDelEmpaque &&
          k !== iVal.iSkuShippingSize &&
          k !== iVal.iAltoDelProducto &&
          k !== iVal.iLargoDelProducto &&
          k !== iVal.iAnchoDelProducto &&
          k !== iVal.iPesoDelProducto &&
          k !== iVal.iVendedor &&
          k !== iVal.iTipoDeProducto &&
          k !== iVal.iURLDeImagen1 &&
          k !== iVal.iURLDeImagen2 &&
          k !== iVal.iURLDeImagen3 &&
          k !== iVal.iURLDeImagen4 &&
          k !== iVal.iURLDeImagen5 &&
          k !== iVal.iModificacionImagen &&
          k !== iVal.iLogisticExito &&
          k !== iVal.iMeasurementUnit &&
          k !== iVal.iConversionFactor &&
          k !== iVal.iDrainedFactor &&
          k !== iVal.iEanCombo
        ) {
          if (variant && variant === true) {
            if (k !== iVal.iParentReference &&
              k !== iVal.iSonReference &&
              k !== iVal.iSize &&
              k !== iVal.iColor &&
              k !== iVal.iHexColourName) {
              if (res[i][k] !== null && res[i][k] !== undefined && res[i][k] !== '') {
                newFeatures['key'] = res[0][k].trim();
                newFeatures['value'] = res[i][k].trim();
                this.validateFeature(res, i, k, iVal, res[i][k].trim(), variant, errorInCell);
                newObjectForSend.features.push(newFeatures);
              }
            }
          } else if (!variant && variant === false) {
            if (res[i][k] !== null && res[i][k] !== undefined && res[i][k] !== '') {
              newFeatures['key'] = res[0][k].trim();
              newFeatures['value'] = res[i][k].trim();
              this.validateFeature(res, i, k, iVal, res[i][k].trim(), variant, errorInCell);
              newObjectForSend.features.push(newFeatures);
            }
          }

        }

      }
    }
    /*
    * Primero listo las categorias, si hay categorias, recorro el excel en la posicion de las categorias,
    * valido que la categoria del archivo del excel sea el mismo que el Id de la lista de categorias..
    * Capturo el nombre de la categoria por su Id para enviarlo en el Json en los campos de metatitulo y metadescription
    */
    if (this.listCategories) {
      this.listCategories.forEach(element => {
        if (newObjectForSend.Name) {
          if (element.Id === parseFloat(newObjectForSend.Category)) {
            // newObjectForSend.Category = element.Name;
            if (newObjectForSend.Name.match(newObjectForSend.Brand)) {
              newObjectForSend.MetaTitle = '##ProductName## - Compras por Internet ##site##';
              newObjectForSend.MetaDescription = 'Compra por Internet ##ProductName##. ##site## tienda Online de Colombia con lo mejor de ##BrandName## en ' + element.Name;
            } else if (newObjectForSend.Name.match(newObjectForSend.Brand)) {
              newObjectForSend.MetaTitle = '##ProductName####ProductModel## - Compras por Internet ##site##';
              newObjectForSend.MetaDescription = 'Compra por Internet ##ProductName## ##ProductModel##. ##site## tienda Online de Colombia con lo mejor de ##BrandName## en ' + element.Name;
            } else {
              newObjectForSend.MetaTitle = '##ProductName####ProductModel####BrandName## - Compras por Internet ##site##';
              newObjectForSend.MetaDescription = 'Compra por Internet ##ProductName## ##ProductModel##. ##site## tienda Online de Colombia con lo mejor de ##BrandName## en ' + element.Name;
            }
          }
        } else {
          newObjectForSend.MetaTitle = null;
          newObjectForSend.MetaDescription = null;
        }

      });
    } else {
      this.snackBar.open('Se produjo un error al realizar la petición al servidor.', 'Cerrar', {
        duration: 5000,
      });
    }
    this.arrayInformationForSend.push(newObjectForSend);
  }

  /**
   * Function to validate the required feature format.
   * And introduce error in two list, one on them to show error position.
   * And second one to show table with principal data.
   * @author luis.echeverry
   * @param {*} res
   * @param {*} i
   * @param {*} k
   * @param {*} iVal
   * @param {*} featureValue
   * @param {*} [variant]
   * @returns {boolean}
   * @memberof BulkLoadProductComponent
   */
  validateFeature(res: any, i: any, k: any, iVal: any, featureValue: any, variant?: any, errorInCell: boolean = false): boolean {
    // const format = /^[0-9A-Za-zá é í ó ú ü ñ  à è ù ë ï ü â ê î ô û ç Á É Í Ó Ú Ü Ñ  À È Ù Ë Ï Ü Â Ê Î Ô Û Ç]*$/;
    if (featureValue.length > 200) {
      this.countErrors += 1;
      const itemLog = {
        row: this.arrayInformation.length,
        column: i,
        type: 'invalidFormat',
        columna: k + 1,
        fila: i + 1,
        positionRowPrincipal: i,
        dato: 'Feature'
      };
      this.listLog.push(itemLog);
      if (!errorInCell) {
        this.addRowToTable(res, i, iVal, variant);
      }
      return true;
    }
    return false;
  }

  /**
   * Método que permite almacenar los registros de errores que se visualizaran en la tabla
   * @param {any} res
   * @param {any} index
   * @memberof BulkLoadProductComponent
   */
  addRowToTable(res: any, index: any, iVal: any, variant: any) {
    /* elemento que contendra la estructura del excel y permitra agregarlo a la variable final que contendra todos los datos del excel */
    const newObject: ModelProduct = {
      Ean: res[index][iVal.iEAN],
      Name: res[index][iVal.iNombreProd],
      Category: res[index][iVal.iCategoria],
      Brand: res[index][iVal.iMarca],
      Description: res[index][iVal.iDescripcion],
      MetaTitle: res[index][iVal.iMetaTitulo],
      MetaDescription: res[index][iVal.iMetaDescripcion],
      KeyWords: res[index][iVal.iPalabrasClave],
      PackageHeight: res[index][iVal.iAltoDelEmpaque] ? res[index][iVal.iAltoDelEmpaque].replace('.', ',') : null,
      PackageLength: res[index][iVal.ilargoDelEmpaque] ? res[index][iVal.ilargoDelEmpaque].replace('.', ',') : null,
      PackageWidth: res[index][iVal.iAnchoDelEmpaque] ? res[index][iVal.iAnchoDelEmpaque].replace('.', ',') : null,
      PackageWeight: res[index][iVal.iPesoDelEmpaque] ? res[index][iVal.iPesoDelEmpaque].replace('.', ',') : null,
      SkuShippingSize: res[index][iVal.iSkuShippingSize],
      ProductHeight: res[index][iVal.iAltoDelProducto] ? res[index][iVal.iAltoDelProducto].replace('.', ',') : null,
      ProductLength: res[index][iVal.iLargoDelProducto] ? res[index][iVal.iLargoDelProducto].replace('.', ',') : null,
      ProductWidth: res[index][iVal.iAnchoDelProducto] ? res[index][iVal.iAnchoDelProducto].replace('.', ',') : null,
      ProductWeight: res[index][iVal.iPesoDelProducto] ? res[index][iVal.iPesoDelProducto].replace('.', ',') : null,
      Seller: res[index][iVal.iVendedor],
      ProductType: res[index][iVal.iTipoDeProducto],
      Size: res[index][iVal.iSize],
      Color: res[index][iVal.iColor],
      HexColourName: res[index][iVal.iHexColourName],
      ParentReference: res[index][iVal.iParentReference],
      SonReference: res[index][iVal.iSonReference],
      ModifyImage: res[index][iVal.iModificacionImagen],
      IsLogisticsExito: res[index][iVal.iLogisticExito] ? res[index][iVal.iLogisticExito] : '0',
      ImageUrl1: res[index][iVal.iURLDeImagen1],
      ImageUrl2: res[index][iVal.iURLDeImagen2],
      ImageUrl3: res[index][iVal.iURLDeImagen3],
      ImageUrl4: res[index][iVal.iURLDeImagen4],
      ImageUrl5: res[index][iVal.iURLDeImagen5],
      MeasurementUnit: res[index][iVal.iMeasurementUnit],
      ConversionFactor: res[index][iVal.iConversionFactor],
      DrainedFactor: res[index][iVal.iDrainedFactor],
      EanCombo: res[index][iVal.iEanCombo],
      isVariant: variant
    };

    this.arrayInformation.push(newObject);
  }

  /**
   * Método que termina de armar los datos para la tabla.
   * @memberof BulkLoadProductComponent
   */
  finishProcessUpload() {
    /* almaceno el numero de filas cargadas correctamente */
    this.countRowUpload = this.arrayInformationForSend.length;
    /* opción para visualizar el contenedor de no se ha cargado información */
    this.orderListLength = this.arrayInformationForSend.length === 0 ? true : false;
    /* Creo el elemento que permite pintar la tabla */
    const data = JSON.stringify(this.arrayInformation);
    this.dataSource = new MatTableDataSource(JSON.parse(data));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.numberElements = this.dataSource.data.length;
    this.loadingService.closeSpinner();
  }

  /**
   * Funcionalidad para limpiar los errores seleccionados en la tabla
   * @memberof BulkLoadProductComponent
   */
  setErrrorColumns() {
    for (let index = 0; index < this.arrayInformation.length; index++) {
      this.arrayInformation[index].errorEan = false;
      this.arrayInformation[index].errorName = false;
      this.arrayInformation[index].errorCategory = false;
      this.arrayInformation[index].errorBrand = false;
      this.arrayInformation[index].errorDescription = false;
      this.arrayInformation[index].errorMetaTitle = false;
      this.arrayInformation[index].errorMetaDescription = false;
      this.arrayInformation[index].errorKeyWords = false;
      this.arrayInformation[index].errorPackageHeight = false;
      this.arrayInformation[index].errorPackageLength = false;
      this.arrayInformation[index].errorPackageWidth = false;
      this.arrayInformation[index].errorPackageWeight = false;
      this.arrayInformation[index].errorSkuShippingSize = false;
      this.arrayInformation[index].errorProductHeight = false;
      this.arrayInformation[index].errorProductLength = false;
      this.arrayInformation[index].errorProductWidth = false;
      this.arrayInformation[index].errorProductWeight = false;
      this.arrayInformation[index].errorSeller = false;
      this.arrayInformation[index].errorProductType = false;
      this.arrayInformation[index].errorImageUrl1 = false;
      this.arrayInformation[index].errorImageUrl2 = false;
      this.arrayInformation[index].errorImageUrl3 = false;
      this.arrayInformation[index].errorImageUrl4 = false;
      this.arrayInformation[index].errorImageUrl5 = false;
      this.arrayInformation[index].errorParentReference = false;
      this.arrayInformation[index].errorSonReference = false;
      this.arrayInformation[index].errorModifyImage = false;
      this.arrayInformation[index].errorRow = false;
      this.arrayInformation[index].errorSize = false;
      this.arrayInformation[index].errorColor = false;
      this.arrayInformation[index].errorHexColourName = false;
      this.arrayInformation[index].errorIsLogisticsExito = false;
      this.arrayInformation[index].errorMeasurementUnit = false;
      this.arrayInformation[index].errorConversionFactor = false;
      this.arrayInformation[index].errorDrainedFactor = false;
    }
  }

  /**
   * Funcionalidad para seleccionar el error del log en la tabla
   * @param {*} item
   * @memberof BulkLoadProductComponent
   */
  selectErrorLog(item: any) {
    this.setErrrorColumns();
    this.arrayInformation[item.row]['error' + item.dato] = true;

    this.arrayInformation[item.row].errorRow = true;

    const data = JSON.stringify(this.arrayInformation);
    this.dataSource = new MatTableDataSource(JSON.parse(data));

    /* ubico el indice de la paginación en la posición inicial */
    this.paginator.pageIndex = 0;

    /* seteo el paginador de la tabla */
    this.dataSource.paginator = this.paginator;

    /* capturo el item seleccionado por el usuairio */
    const currentItem = item.row + 1;

    const indexPage = this.paginator.pageSize;

    /* Metodo para calcular la posicion del elemento seleccionado por el usuario en la lista de errores,
    recibe la ubicación del item y el numero de paginas que el usuario tiene aplicadas. con estos datos se calcula donde esta el registro */
    this.paginator.pageIndex = Math.ceil((currentItem / indexPage)) - 1;

    /* seteo los valores a la tabla */
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Metodo para validar la talla del servicio de tallas y enviar siempre el label en español.
   * @memberof BulkLoadProductComponent
   */
  changeSize() {
    this.arrayInformationForSend.splice(0, 1);
    this.arrayInformationForSend.forEach((element) => {
      this.copySizeArray.forEach((el) => {
        if (el.Size === element['Size']) {
          element['Size'] = el.Label;
        }
      });
    });
  }

  /**
   * Método que permite realizar el envío del json cargado del excel
   * @memberof BulkLoadProductComponent
   */
  sendJsonInformation() {
    this.arrayInformationForSend.splice(0, 1);
    this.loadingService.viewSpinner();
    // call to the bulk load product service
    if (this.profileTypeLoad === 'Tienda') {
      this.BulkLoadProductS.setProductsModeration(this.arrayInformationForSend)
        .subscribe(
          (result: any) => {
            if (result.status === 201 || result.status === 200) {
              const data = result;
              if (data.body.data !== null && data.body.data !== undefined) {
                if (data.body.successful !== 0 || data.body.error !== 0) {
                  this.progressStatus = false;
                  // this.BulkLoadProductS.getCargasMasivas().subscribe((res: any) => this.verifyStateCharge(res));
                  this.setIntervalStatusCharge();
                  this.getAvaliableLoads();
                  // Validar que los errores existan para poder mostrar el modal.
                  if (result.body.data.error > 0) {
                    this.openDialogSendOrder(data);
                  }
                } else if (data.body.successful === 0 && data.body.error === 0) {
                  this.modalService.showModal('errorService');
                }
              } else {
                this.modalService.showModal('errorService');
              }

            } else {
              this.modalService.showModal('errorService');
            }
            this.resetVariableUploadFile();
            this.loadingService.closeSpinner();
          }
        );
    } else {
      this.BulkLoadProductS.setProducts(this.arrayInformationForSend)
        .subscribe(
          (result: any) => {
            if (result.status === 201 || result.status === 200) {
              const data = result;
              if (data.body.data !== null && data.body.data !== undefined) {
                if (data.body.successful !== 0 || data.body.error !== 0) {
                  this.progressStatus = false;
                  // this.BulkLoadProductS.getCargasMasivas().subscribe((res: any) => this.verifyStateCharge(res));
                  this.setIntervalStatusCharge();
                  this.getAvaliableLoads();
                  // Validar que los errores existan para poder mostrar el modal.
                  if (result.body.data.error > 0) {
                    this.openDialogSendOrder(data);
                  }
                } else if (data.body.successful === 0 && data.body.error === 0) {
                  this.modalService.showModal('errorService');
                }
              } else {
                this.modalService.showModal('errorService');
              }

            } else {
              this.modalService.showModal('errorService');
            }
            this.resetVariableUploadFile();
            this.loadingService.closeSpinner();
          }
        );
    }
  }

  /**
   * Metodo para llamar cierto tiempo el servicio del status de la carga
   * @memberof BulkLoadProductComponent
   */
  setIntervalStatusCharge() {
    clearInterval(this.checkIfDoneCharge);
    this.checkIfDoneCharge = setInterval(() => this.BulkLoadProductS.getCargasMasivas().subscribe((res: any) => {
      this.verifyStateCharge(res);
    }), 7000);
  }

  /*
  Funcion para validar status de la carga
*/

  public closeActualDialog(): void {
    if (this.progressStatus) {
      this.dialog.closeAll();
    }
  }

  /*Funcion para validar el status de la carga y abrir o no el modal */
  verifyStateCharge(result?: any) {
    // Convertimos el string que nos envia el response a JSON que es el formato que acepta
    if (result.body.data.response) {
      result.body.data.response = JSON.parse(result.body.data.response);
    }
    if (result.body.data.status === 0 || result.body.data.checked === 'true') {
    } else if (result.body.data.status === 1 || result.body.data.status === 4) {
      result.body.data.status = 1;
      if (!this.progressStatus) {
        this.openDialogSendOrder(result);
      }
      this.progressStatus = true;
    } else if (result.body.data.status === 2) {
      clearInterval(this.checkIfDoneCharge);
      this.closeActualDialog();
      this.openDialogSendOrder(result);
    } else if (result.body.data.status === 3) {
      this.closeActualDialog();
      clearInterval(this.checkIfDoneCharge);
      if (result.body.data.response.Errors['0']) {
        this.modalService.showModal('errorService');
      } else {
        this.openDialogSendOrder(result);

      }
    }
  }

  /**
   * Funcionalidad para desplegar el
   * modal que permite visualizar la lista de
   * mensajes que retorna el back con los errores o registros correctos.
   * @param {any} res
   * @memberof BulkLoadProductComponent
   */
  openDialogSendOrder(res: any): void {
    if (!res.body.data) {
      res.body.data = {};
      res.body.data.status = 3;
      res.productNotifyViewModel = res.body.productNotifyViewModel;
    } else {
      // Condicional apra mostrar errores mas profundos. ;
      if (res.body.data.response) {
        res.productNotifyViewModel = res.body.data.response.Data.ProductNotify;
      } else {
        if (res.body.data.status === undefined) {
          res.body.data.status = 3;
          res.productNotifyViewModel = res.body.data.productNotifyViewModel;
        }
      }
    }
    const dialogRef = this.dialog.open(FinishUploadProductInformationComponent, {
      width: '95%',
      disableClose: res.body.data.status === 1,
      data: {
        response: res
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The dialog was closed');
    });
  }

  /*---------------------------------------- Metodos para validar el formato de los campos ----------------------------------------*/

  /**
   * @method validFormat
   * @param inputtxt
   * @param validation
   * @description Metodo para validar el formato de las celdas enviadas del excel
   * @memberof BulkLoadProductComponent
   */
  validFormat(inputtxt: any, validation?: string) {
    let valueReturn: boolean;

    if (inputtxt === undefined) {
      valueReturn = false;
    } else if (inputtxt !== undefined) {
      inputtxt = inputtxt.trim();
      switch (validation) {
        case 'ean':
          if ((inputtxt.match(this.productsRegex.eanProduct))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'descUniMedida':
          if ((inputtxt.match(this.productsRegex.descUnidadMedidaProduct))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'factConversion':
          if ((inputtxt.match(this.productsRegex.factConversionProduct))) {
            if (inputtxt > 0) {
              valueReturn = true;
            } else {
              valueReturn = false;
            }
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'factEscurrido':
          if ((inputtxt.match(this.productsRegex.factConversionProduct))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'eanCombo':
          if ((inputtxt.match(this.productsRegex.eanCombo))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'nameProd':
          if ((inputtxt.match(this.productsRegex.nameProduct))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'numeric':
          if ((inputtxt.match(this.productsRegex.number))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatAllChars':
          if ((inputtxt.match(this.productsRegex.brandProduct))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatAllCharsKeyWords':
          if ((inputtxt.match(this.productsRegex.keyWordsProduct))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatlimitChars':
          if ((inputtxt.match(this.productsRegex.detailProduct))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatSeller':
          if (inputtxt === 'Marketplace') {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatImg':
          if ((inputtxt.match(this.productsRegex.eanImageProduct))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatSku':
          if ((inputtxt.match(this.productsRegex.SkuShippingSizeProduct))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'formatPackage':
          if ((inputtxt.match(this.productsRegex.Package))) {
            // const num = parseInt(inputtxt, 10);
            const num = inputtxt.replace(',', '.');
            if (+num > 0) {
              valueReturn = true;
            } else {
              valueReturn = false;
            }
          } else {
            valueReturn = false;
          }
          break;
        case 'formatDescription':
          if ((inputtxt.match(this.productsRegex.forbiddenScript))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'boolean':
          if ((inputtxt.match(this.productsRegex.number))) {
            if (inputtxt === '1' || inputtxt === '0') {
              valueReturn = true;
            } else {
              valueReturn = false;
            }
          } else {
            valueReturn = false;
          }
          break;
        case 'greaterThanZero':
          if ((inputtxt.match(this.productsRegex.number))) {
            const num = parseInt(inputtxt, 10);
            if (num > 0) {
              valueReturn = true;
            } else {
              valueReturn = false;
            }
          } else {
            valueReturn = false;
          }
          break;
        case 'category':
          if (inputtxt.match(this.productsRegex.typeCategory)) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'size':
          if ((inputtxt.match(this.productsRegex.size))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        case 'color':
          if (this.listColorProducts.length > 0) {
           const validateColor =  this.listColorProducts.find(x => x.Color.toLowerCase() === inputtxt.toLowerCase());
           if (validateColor !== undefined) {
            valueReturn = true;
           } else {
            valueReturn = false;
           }
          } else {
            valueReturn = false;
          }
          break;
        case 'colorName':
          if ((inputtxt.match(this.productsRegex.limitCharsSixty))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
        default:
          if ((inputtxt.match(this.productsRegex.brandProduct))) {
            valueReturn = true;
          } else {
            valueReturn = false;
          }
          break;
      }
    }
    return valueReturn;
  }

  /*---------------------------------------- Fin Metodos para validar el formato de los campos ----------------------------------------*/

  /*---------------------------------------- Metodos para descargar formato ----------------------------------------*/

  // Funcion para cargar datos de regex
  public validateFormSupport(res?: any): void {
    let dataOffertRegex = JSON.parse(res.body.body);
    dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'productos');
    for (const val in this.productsRegex) {
      if (!!val) {
        const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
        this.productsRegex[val] = element && `${element.Value}`;
      }
    }
  }

  /*Generar excel*/

  exportExcel() {
    if (localStorage.getItem('culture_current')) {
      this.culture = localStorage.getItem('culture_current');
    }
    // this.translateFile(this.culture, this.categoryType.value);

    if (this.categoryType.value === 'Technology') {
      this.dataTheme = this.getDataFormFileTechnology();
    }
    if (this.categoryType.value === 'Clothing') {
      this.dataTheme = this.getDataFormFileClothing();
    }

    // Crea las hojas
    const worksheetProducts: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataTheme.productos);
    const worksheetCategory: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataTheme.categoria);
    const worksheetBrands: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataTheme.marcas);
    const worksheetSpecifications: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataTheme.especificaciones);
    let workbook: XLSX.WorkBook;

    // SheetNames: Arreglo con el nombre de la hoja
    // Sheets Solo trae la data, si el primer valor del objeto es igual al SheetNames en su misma posición
    // const workbook: XLSX.WorkBook = { Sheets: { 'Productos': worksheetProducts, 'Categoría': worksheetCategory, 'Marcas': worksheetBrands, 'Especificaciones': worksheetSpecifications }, SheetNames: ['Productos', 'Categoría', 'Marcas', 'Especificaciones'] };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    if (this.categoryType.value === 'Clothing') {
      const worksheetSize: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataTheme.talla);
      XLSX.utils.sheet_add_json(worksheetSize, this.dataTheme.color, { skipHeader: false, origin: 'B1' });

      // SheetNames: Arreglo con el nombre de la hoja
      // Sheets Solo trae la data, si el primer valor del objeto es igual al SheetNames en su misma posición
      if (this.culture === 'ES') {
        workbook = { Sheets: { 'Productos': worksheetProducts, 'Categoría': worksheetCategory, 'Marcas': worksheetBrands, 'Especificaciones': worksheetSpecifications, 'Tallas y Colores': worksheetSize }, SheetNames: ['Productos', 'Categoría', 'Marcas', 'Especificaciones', 'Tallas y Colores'] };
      } else if (this.culture === 'FR') {
        worksheetBrands['A1'].v = 'MARQUES';
        worksheetSize['A1'].v = 'TAILLES';
        workbook = { Sheets: { 'Produits': worksheetProducts, 'Catégorie': worksheetCategory, 'Marques': worksheetBrands, 'Spécifications': worksheetSpecifications, 'Tailles et couleurs': worksheetSize }, SheetNames: ['Produits', 'Catégorie', 'Marques', 'Spécifications', 'Tailles et couleurs'] };
      } else {
        worksheetBrands['A1'].v = 'BRANDS';
        worksheetSize['A1'].v = 'SIZE';
        workbook = { Sheets: { 'Products': worksheetProducts, 'Category': worksheetCategory, 'Brands': worksheetBrands, 'Specifications': worksheetSpecifications, 'Color and size': worksheetSize }, SheetNames: ['Products', 'Category', 'Brands', 'Specifications', 'Color and size'] };
      }
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcel(excelBuffer, this.languageService.instant('secure.products.bulk_load_product_moderation.template_download_clothing') + ' ' + this.categoryName.value);
    } else {
      // SheetNames: Arreglo con el nombre de la hoja
      // Sheets Solo trae la data, si el primer valor del objeto es igual al SheetNames en su misma posición
      if (this.culture === 'ES') {
        workbook = { Sheets: { 'Productos': worksheetProducts, 'Categoría': worksheetCategory, 'Marcas': worksheetBrands, 'Especificaciones': worksheetSpecifications }, SheetNames: ['Productos', 'Categoría', 'Marcas', 'Especificaciones'] };
      } else if (this.culture === 'FR') {
        worksheetBrands['A1'].v = 'MARQUES';
        if (worksheetCategory['A1'] && worksheetCategory['B1']) {
          worksheetCategory['A1'].v = 'Code de catégorie';
          worksheetCategory['B1'].v = 'Catégorie spécifique';
        }
        workbook = { Sheets: { 'Produits': worksheetProducts, 'Catégorie': worksheetCategory, 'Marques': worksheetBrands, 'Spécifications': worksheetSpecifications }, SheetNames: ['Produits', 'Catégorie', 'Marques', 'Spécifications', 'Tailles et couleurs'] };
      } else {
        worksheetBrands['A1'].v = 'BRANDS';
        if (worksheetCategory['A1'] && worksheetCategory['B1']) {
          worksheetCategory['A1'].v = 'Category Code';
          worksheetCategory['B1'].v = 'Specific Category';
        }
        workbook = { Sheets: { 'Products': worksheetProducts, 'Category': worksheetCategory, 'Brands': worksheetBrands, 'Specifications': worksheetSpecifications }, SheetNames: ['Products', 'Category', 'Brands', 'Specifications'] };
      }

      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcel(excelBuffer, this.languageService.instant('secure.products.bulk_load_product_moderation.template_download_technology') + ' ' + this.categoryName.value);
    }
  }

  saveAsExcel(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: this.EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName);
  }



  /* Datos de plantilla Technology */

  getDataFormFileTechnology() {
    const productos = this.setCultureColumnsTechnology();
    const categoria = this.listOfCategories();
    const marcas = this.brands;
    const especificaciones = this.listOfSpecs();
    return { productos, categoria, marcas, especificaciones };
  }


  /* Datos de plantilla Clothing */


  setCultureColumnsTechnology() {
    let productos = [];
    if (this.culture === 'ES') {
      productos = [{
        'Grupo EAN Combo': undefined,
        'EAN': undefined,
        'Nombre del producto': undefined,
        'Categoria': undefined,
        'Marca': undefined,
        'Descripcion': undefined,
        'Palabras Clave': undefined,
        'Alto del empaque': undefined,
        'Largo del empaque': undefined,
        'Ancho del empaque': undefined,
        'Peso del empaque': undefined,
        'skuShippingsize': undefined,
        'Alto del producto': undefined,
        'Largo del producto': undefined,
        'Ancho del producto': undefined,
        'Peso del producto': undefined,
        'Descripcion Unidad de Medida': undefined,
        'Factor de conversion': undefined,
        'TipoProducto': undefined,
        'URL de Imagen 1': undefined,
        'URL de Imagen 2': undefined,
        'URL de Imagen 3': undefined,
        'URL de Imagen 4': undefined,
        'URL de Imagen 5': undefined,
        // 'Modificacion Imagen': undefined,
        'Logistica Exito': undefined,
      },
      this.modelSpecs
      ];

    } else if (this.culture === 'US') {
      productos = [{
        'Combo EAN Group': undefined,
        'EAN': undefined,
        'Product Name': undefined,
        'Category': undefined,
        'Brand': undefined,
        'Description': undefined,
        'Keywords': undefined,
        'Package Height': undefined,
        'Package Length': undefined,
        'Package Width': undefined,
        'Package Weight': undefined,
        'skuShippingsize': undefined,
        'Item Height': undefined,
        'Item Length': undefined,
        'Item Width': undefined,
        'Item Weight': undefined,
        'Measuring Unit': undefined,
        'Conversion Factor': undefined,
        'ProductType': undefined,
        'Image URL 1': undefined,
        'Image URL 2': undefined,
        'Image URL 3': undefined,
        'Image URL 4': undefined,
        'Image URL 5': undefined,
        // 'Image Modification': undefined,
        'Exito Logistics': undefined,
      },
      this.modelSpecs
      ];
    } else if (this.culture === 'FR') {
      productos = [{
        'Bundle EAN': undefined,
        'EAN': undefined,
        'Nom du produit': undefined,
        'Catégorie': undefined,
        'Marque': undefined,
        'Description': undefined,
        'Mots-clés': undefined,
        'Hauteur de l\'emballage': undefined,
        'Longueur d\'emballage': undefined,
        'Largeur de l\'emballage': undefined,
        'Poids de l\'emballage': undefined,
        'skuShippingsize': undefined,
        'Hauteur du produit': undefined,
        'Longueur du produit': undefined,
        'Largeur du produit': undefined,
        'Poids du produit': undefined,
        'Description Unité de mesure': undefined,
        'Facteur de conversion': undefined,
        'TypeProduct': undefined,
        'URL de l\'image 1': undefined,
        'URL de l\'image 2': undefined,
        'URL de l\'image 3': undefined,
        'URL de l\'image 4': undefined,
        'URL de l\'image 5': undefined,
        // 'Image Modification': undefined,
        'Exito logistique': undefined,
      },
      this.modelSpecs
      ];
    }
    return productos;
  }

  getDataFormFileClothing() {
    const productos = this.setCultureColumnsClothing();
    const categoria = this.listOfCategories();
    const marcas = this.brands;
    const especificaciones = this.listOfSpecs();
    const talla = this.size;
    const color = this.listColorProducts;
    return { productos, categoria, marcas, especificaciones, talla, color };
  }


  setCultureColumnsClothing() {
    let productos = [];
    if (this.profileTypeLoad === 'Tienda') {
      if (this.culture === 'ES') {
        productos = [{
          'Grupo EAN Combo': undefined,
          'EAN': undefined,
          // 'Referencia Hijo': undefined,
          'Referencia Padre': undefined,
          'Nombre del producto': undefined,
          'Categoria': undefined,
          'Marca': undefined,
          'Descripcion': undefined,
          'Palabras Clave': undefined,
          'Talla': undefined,
          'Color': undefined,
          'hexColourName': undefined,
          'Alto del empaque': undefined,
          'Largo del empaque': undefined,
          'Ancho del empaque': undefined,
          'Peso del empaque': undefined,
          'skuShippingsize': undefined,
          'Alto del producto': undefined,
          'Largo del producto': undefined,
          'Ancho del producto': undefined,
          'Peso del producto': undefined,
          'Descripcion Unidad de Medida': undefined,
          'Factor de conversion': undefined,
          'TipoProducto': undefined,
          'URL de Imagen 1': undefined,
          'URL de Imagen 2': undefined,
          'URL de Imagen 3': undefined,
          'URL de Imagen 4': undefined,
          'URL de Imagen 5': undefined,
          // 'Modificacion Imagen': undefined,
          'Logistica Exito': undefined,
        },
        this.modelSpecs
        ];
      } else if (this.culture === 'US') {
        productos = [{
          'Combo EAN Group': undefined,
          'EAN': undefined,
          // 'Child reference': undefined,
          'Parent reference': undefined,
          'Product Name': undefined,
          'Category': undefined,
          'Brand': undefined,
          'Description': undefined,
          'Keywords': undefined,
          'Size': undefined,
          'Color': undefined,
          'hexColourName': undefined,
          'Package Height': undefined,
          'Package Length': undefined,
          'Package Width': undefined,
          'Package Weight': undefined,
          'skuShippingsize': undefined,
          'Item Height': undefined,
          'Item Length': undefined,
          'Item Width': undefined,
          'Item Weight': undefined,
          'Measuring Unit': undefined,
          'Conversion Factor': undefined,
          'ProductType': undefined,
          'Image URL 1': undefined,
          'Image URL 2': undefined,
          'Image URL 3': undefined,
          'Image URL 4': undefined,
          'Image URL 5': undefined,
          // 'Image Modification': undefined,
          'Exito Logistics': undefined,
        },
        this.modelSpecs
        ];
      } else if (this.culture === 'FR') {
        productos = [{
          'Bundle EAN': undefined,
          'EAN': undefined,
          // 'Child reference': undefined,
          'Référence Père': undefined,
          'Nom du produit': undefined,
          'Catégorie': undefined,
          'Marque': undefined,
          'Description': undefined,
          'Mots-clés': undefined,
          'Taille': undefined,
          'Couleur': undefined,
          'hexColourName': undefined,
          'Hauteur de l\'emballage': undefined,
          'Longueur d\'emballage': undefined,
          'Largeur de l\'emballage': undefined,
          'Poids de l\'emballage': undefined,
          'skuShippingsize': undefined,
          'Hauteur du produit': undefined,
          'Longueur du produit': undefined,
          'Largeur du produit': undefined,
          'Poids du produit': undefined,
          'Description Unité de mesure': undefined,
          'Facteur de conversion': undefined,
          'TypeProduct': undefined,
          'URL de l\'image 1': undefined,
          'URL de l\'image 2': undefined,
          'URL de l\'image 3': undefined,
          'URL de l\'image 4': undefined,
          'URL de l\'image 5': undefined,
          // 'Image Modification': undefined,
          'Exito logistique': undefined,
        },
        this.modelSpecs
        ];
      }
    } else {
      if (this.culture === 'ES') {
        productos = [{
          'Grupo EAN Combo': undefined,
          'EAN': undefined,
          'Referencia Hijo': undefined,
          'Referencia Padre': undefined,
          'Nombre del producto': undefined,
          'Categoria': undefined,
          'Marca': undefined,
          'Descripcion': undefined,
          'Palabras Clave': undefined,
          'Talla': undefined,
          'Color': undefined,
          'hexColourName': undefined,
          'Alto del empaque': undefined,
          'Largo del empaque': undefined,
          'Ancho del empaque': undefined,
          'Peso del empaque': undefined,
          'skuShippingsize': undefined,
          'Alto del producto': undefined,
          'Largo del producto': undefined,
          'Ancho del producto': undefined,
          'Peso del producto': undefined,
          'Descripcion Unidad de Medida': undefined,
          'Factor de conversion': undefined,
          'TipoProducto': undefined,
          'URL de Imagen 1': undefined,
          'URL de Imagen 2': undefined,
          'URL de Imagen 3': undefined,
          'URL de Imagen 4': undefined,
          'URL de Imagen 5': undefined,
          // 'Modificacion Imagen': undefined,
          'Logistica Exito': undefined,
        },
        this.modelSpecs
        ];
      } else if (this.culture === 'US') {
        productos = [{
          'Combo EAN Group': undefined,
          'EAN': undefined,
          'Parent reference': undefined,
          'Product Name': undefined,
          'Category': undefined,
          'Brand': undefined,
          'Description': undefined,
          'Keywords': undefined,
          'Size': undefined,
          'Color': undefined,
          'hexColourName': undefined,
          'Package Height': undefined,
          'Package Length': undefined,
          'Package Width': undefined,
          'Package Weight': undefined,
          'skuShippingsize': undefined,
          'Item Height': undefined,
          'Item Length': undefined,
          'Item Width': undefined,
          'Item Weight': undefined,
          'Measuring Unit': undefined,
          'Conversion Factor': undefined,
          'ProductType': undefined,
          'Image URL 1': undefined,
          'Image URL 2': undefined,
          'Image URL 3': undefined,
          'Image URL 4': undefined,
          'Image URL 5': undefined,
          // 'Image Modification': undefined,
          'Exito Logistics': undefined,
        },
        this.modelSpecs
        ];
      } else if (this.culture === 'FR') {
        productos = [{
          'Bundle EAN': undefined,
          'EAN': undefined,
          'Référence Enfant': undefined,
          'Référence Père': undefined,
          'Nom du produit': undefined,
          'Catégorie': undefined,
          'Marque': undefined,
          'Description': undefined,
          'Mots-clés': undefined,
          'Taille': undefined,
          'Couleur': undefined,
          'hexColourName': undefined,
          'Hauteur de l\'emballage': undefined,
          'Longueur d\'emballage': undefined,
          'Largeur de l\'emballage': undefined,
          'Poids de l\'emballage': undefined,
          'skuShippingsize': undefined,
          'Hauteur du produit': undefined,
          'Longueur du produit': undefined,
          'Largeur du produit': undefined,
          'Poids du produit': undefined,
          'Description Unité de mesure': undefined,
          'Facteur de conversion': undefined,
          'TypeProduct': undefined,
          'URL de l\'image 1': undefined,
          'URL de l\'image 2': undefined,
          'URL de l\'image 3': undefined,
          'URL de l\'image 4': undefined,
          'URL de l\'image 5': undefined,
          // 'Image Modification': undefined,
          'Exito logistique': undefined,
        },
        this.modelSpecs
        ];
      }
    }
    return productos;
  }

  /* Lista por marcas activas */
  listOfCategories() {
    if (this.vetex.data !== null) {
      return this.vetex.data.listCategories.map((element) => {
        return { 'Código de Categoría': element.id, 'Categoría Especifica': element.name };
      });
    } else {
      return this.vetex.data = {
        groupName: '',
        id: '',
        idGroup: '',
        idVTEX: '',
        listCategories: [],
        specs: []
      };
    }
  }

  listOfSpecs() {
    // Arreglo a retornar
    const specs = [];

    // Modelo de especificaciones a construir
    this.modelSpecs = {};
    // Maximo numero de valores de una especificacion
    let maxSpecsValue = 0;
    this.vetex.data.specs.forEach((element) => {
      // Crea la key del objeto
      this.modelSpecs[element.specName] = undefined;
      // Comprueba el maximo valor
      if (maxSpecsValue < element.listValues.length) {
        maxSpecsValue = element.listValues.length;
      }
    });

    if (Array.isArray(this.vetex.data.specs)) {
      for (let i = 0; i < maxSpecsValue; i++) {
        const object = Object.assign({}, this.modelSpecs);
        specs.push(object);
      }
    }
    if (maxSpecsValue === 0) {
      const object = Object.assign({}, this.modelSpecs);
      specs.push(object);
    }

    this.vetex.data.specs.map((element) => {
      if (element.listValues.length > 0) {
        element.listValues.forEach((specElement, i) => {
          // Agrega el valor de la especificacion (specName) al objeto situado en la posicion i
          specs[i][element.specName] = specElement;
        });
      } else {
        specs.forEach(specElement => specElement[element.specName] = null);
      }
    });
    return specs;
  }

  /* Lista por marcas activas */

  listOfBrands(brands?: any) {
    const initialBrands = brands.Data.Brands;
    this.brands = initialBrands.sort((a, b) => {
      if (a.Name > b.Name) {
        return 1;
      }
      if (a.Name < b.Name) {
        return -1;
      }
      return 0;
    });
    initialBrands.forEach((element, i) => {
      this.brands[i] = { Marca: element.Name };
    });
  }
  /**
   * Funcion para somunir el listado de tallas
   *
   * @memberof BulkLoadProductComponent
   */
  listOfSize(size?: any) {
    const sizeArray = JSON.parse(size.body);
    this.copySizeArray = sizeArray;
    sizeArray.forEach((element, i) => {
      this.size[i] = { Talla: element.Size };
    });
  }

  listColor(color?: any) {
    if (color.status === 200 || color.status === 201) {
      if (color && color.body.errors.length === 0) {
          const colorArray = color.body.data;
        //   this.listColorProducts = this.mapItems(
        //     this.listColorProducts
        // );
        colorArray.forEach((element, i ) => {
          this.listColorProducts[i] = {Color: element.name };
        });
        }
      }
  }

  mapItems(items: any[]): any[] {
    return items.map(x => {
        return {
            name: x.name,
        };
    });
}


  /**
   * Generación del arbol VTEX
   */
  trasformTree() {
    this.BulkLoadProductS.getVtexTree().subscribe((result: any) => {
      // Copia el Listado del insumo
      const arrayTree = [...VtexTree.VTEX_TREE];
      if (result && result.body) {
        // Agrega los atributos SON y SHOW a cada elemento
        const vtexTree: any[] = result.body.map((element: any) => {
          element.Son = [];
          element.Show = false;
          return element;
        });
        let lastFirst: number, lastSecond = -1;
        // transforma la lista de categorias VTEX a un arreglo de árboles
        this.vtextree = vtexTree.reduce((previous: any[], current: any, i: number) => {
          if (!!current && !!current.TipodeObjeto && current.TipodeObjeto === 'Nivel 1') {
            lastFirst = i;
            previous.push(current);
          }
          if (!!current && !!current.TipodeObjeto && current.TipodeObjeto === 'Nivel 2') {
            lastSecond = i;
            if (lastFirst >= 0) {
              vtexTree[lastFirst].Son.push(current);
            }
          }
          if (!!current && !!current.TipodeObjeto && current.TipodeObjeto === 'Nivel 3') {
            if (lastSecond >= 0) {
              vtexTree[lastSecond].Son.push(current);
            }
          }
          return previous;
        }, []);
      } else {
        this.languageService.instant('public.auth.forgot.error_try_again');
      }
      this.isLoad = false;
    });
  }

  /**
   * Metodo para escuchar el evento del lenguaje para poder armar el arbol de categoria de vtex
   * @memberof BulkLoadProductComponent
   */
  public refreshVtexTree() {
    this.languageService.onLangChange.subscribe((e: Event) => {
      localStorage.setItem('culture_current', e['lang']);
      this.isLoad = true;
      this.vtextree = [];
      this.trasformTree();
      this.prepareComponent();
    });
  }

  /**
   * Abre la modal para seleccionar una categoría
   */
  openModalVtexTree() {
    // this.loadingService.viewSpinner();
    const dataDialog = this.configDataDialog();
    const dialogRef = this.dialog.open(DialogWithFormComponent, {
      width: '70%',
      minWidth: '280px',
      maxHeight: '80vh',
      data: dataDialog
    });
    this.configDialog(dialogRef);
  }

  /**
   * Configuración del contenido y confirmación de la acción
   */
  configDialog(dialogRef: any) {
    const dialogComponent = dialogRef.componentInstance;
    dialogComponent.content = this.contentDialog;
    dialogComponent.confirmation = () => {
      //this.exportExcel();
      const {productType, Label} = this.dataProduct;
      this.BulkLoadProductS.getProductsTemplate(productType, Label).subscribe(({data, message})=> {
        if(data) {
          this.loadingService.viewSpinner();

          if(this.status === 1)  {

            let statusInterval = setInterval(() => {

            this.BulkLoadProductS.statusLoad().subscribe(({status, response})=> {
              this.status = status;
              if(status !== 1) {
                clearInterval(statusInterval);
                this.downloadFile(response);
                this.loadingService.closeSpinner();
                this.status = 1;
              }
            })
            
          }, 5000);
        } 
          
        } else {
          this.componentService.openSnackBar(message, 'Cerrar', 4000);
        }
      })
    };
  }

  private downloadFile(filePath){
    var link=document.createElement('a');
    link.href = filePath;
    link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
    link.click();
}

  /**
   * Configuración de la data del modal
   * Selecciona una categoría de producto para descargar el archivo de carga con los campos correspondientes
   */
  configDataDialog() {
    let title = '';
    this.languageService.stream('secure.parametize.category.categories.subtitle').subscribe(val => {
      title = val;
    });
    const message = null;
    const icon = null;
    const form = this.categoryForm;
    const messageCenter = false;
    const showButtons = true;
    const btnConfirmationText = this.languageService.instant('actions.download');
    return { title, message, icon, form, messageCenter, showButtons, btnConfirmationText };
  }

  /**
   * Se define el comportamiento a realizar con el elemento seleccionado
   * @param element Elemento seleccionado
   */
  selectElement(element: any) {
    if (element.Son.length > 0) {
      element.Show = !element.Show;
    } else {
      this.categoryForm.patchValue(element);
      this.dataProduct = element;
      // Aca se debe lanzar la petición para consultar el grupo de especificaciones
      // this.loadingService.viewSpinner();
      // this.BulkLoadProductS.getCategoriesVTEX(element.Label).subscribe(resp => {
      //   this.loadingService.closeSpinner();
      //   this.vetex = resp;
      //   this.listOfCategories();
      //   this.listOfSpecs();
      // });

    }
  }

  get categoryName(): FormControl {
    return this.categoryForm.get('Name') as FormControl;
  }

  get categoryType(): FormControl {
    return this.categoryForm.get('productType') as FormControl;
  }

  get categoryLvl(): FormControl {
    return this.categoryForm.get('TipodeObjeto') as FormControl;
  }

}
