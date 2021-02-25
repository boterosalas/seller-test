import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { BrandService } from './brands.component.service';
import { MatDialog, PageEvent, MatDialogRef, ErrorStateMatcher, MatSnackBar, Sort, MatPaginatorIntl } from '@angular/material';
import { MatPaginator, MatSort } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { SupportService } from '@app/secure/support-modal/support.service';
import { readFunctionality, createFunctionality, updateFunctionality, MenuModel, brandName } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { EndpointService, LoadingService, Logger, ModalService } from '@app/core';
import { CustomPaginator } from '../../products/list-products/listFilter/paginatorList';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx';
import { ComponentsService } from '@app/shared';
import { ModalBulkloadBrandsComponent } from './modal-bulkload-brands/modal-bulkload-brands.component';

const log = new Logger('BrandsComponent');


/**
 * exporta funcion para mostrar los errores de validacion del formulario
 *
 * @export
 * @class MyErrorStateMatcher
 * @implements {ErrorStateMatcher}
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

export interface Brands {
    Id: number;
    Name: string;
    Status: boolean;
    PaginationToken: string;
}

export interface ListFilterBrands {
    name: string;
    value: string;
    nameFilter: string;
}

@Component({
    selector: 'app-brands',
    templateUrl: './brands.component.html',
    styleUrls: ['brands.component.scss'],
    providers: [
        { provide: MatPaginatorIntl, useValue: CustomPaginator() }
    ]
})

export class BrandsComponent implements OnInit {

    sortedData: Brands[];
    brandsList: Brands[];

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChild('dialogContent', {static: false}) content: TemplateRef<any>;
    @ViewChild('matSlideToggle', {static: false}) matSlideToggle: ElementRef;
    @ViewChild('buttonClose', {static: false}) buttonClose: ElementRef;

    public form: FormGroup;
    public filterBrands: FormGroup;
    public matcher: MyErrorStateMatcher;
    length = 0;
    pageSize = 50;
    pagepaginator = 0;
    countFilter = 0;

    pageSizeOptions: number[] = [50, 70, 100];
    pageEvent: PageEvent;
    boleano = null;
    color = '#4caf50';
    subs: Subscription[] = [];
    BrandsRegex = { brandsName: '', formatIntegerNumber: '' };
    idBrands: number;
    statusBrands: boolean;
    nameBrands: string;
    stringStatus: string;

    permissionComponent: MenuModel;
    canRead: boolean;
    canUpdate: boolean;
    canCreate: boolean;
    urlParams: string;
    urlParamsUpdate: string;
    filterBrandsId: any;
    filterBrandsName: string;
    dessetUpsert: any;
    showMessage = false;
    body: any;
    validateBrandsExist: boolean;
    dialogReff: DialogWithFormComponent;
    validateExit = true;
    newBrands: string;
    serviceParams: {};
    showSpinner = false;
    showButton = false;
    listFilterBrands: ListFilterBrands[] = [];
    removable = true;
    changeNameBrands: string;
    filterBrandsControlsName: any;
    filterBrandsControlsId: any;
    separatorKeysCodes: number[] = [];
    errorMessageBrand: any;

    public urlDownloadFile: string;

    /* Input file que carga el archivo*/
    @ViewChild('fileUploadOption', {static: false}) inputFileUpload: any;
    /* Variable que se emplea para el proceso de la carga de excel, se indica 501 por que se cuenta la primera fila que contiene los titulos*/
    public limitRowExcel: number;
    public arrayNecessaryData: Array<any>;
    public iVal: any;
    public arrayInformationForSend: Array<{}>;
    fileName: any;

    checkIfDoneCharge: any = null;


    /* Mirar el estado del progreso de la carga*/
    public progressStatus = false;
    setInterval: any;
    fileSize: any;


    /**
     * Instanciar servicios, formularios y dialogos
     * @param {BrandService} brandService
     * @memberof BrandsComponent
     */
    constructor(
        private brandService: BrandService,
        private loading: LoadingService,
        public dialog: MatDialog,
        public SUPPORT: SupportService,
        public authService: AuthService,
        private snackBar: MatSnackBar,
        private languageService: TranslateService,
        private modalService?: ModalService,
        private api?: EndpointService,
        public componentService?: ComponentsService,


    ) {
    }


    ngOnInit() {
        this.getRegexByModule();
        this.createForm();
        this.validatePermission();
        this.getAllBrands();
        this.urlDownloadFile = this.api.get('uploadMasiveBrand');
        this.setIntervalStatusCharge();
    }

    /**
     * Limpio el input file
     * @memberof BrandsComponent
     */
    resetUploadFIle() {
        this.inputFileUpload.nativeElement.value = '';
    }

    /**
     * Limpio las variables empleadas para visualizar los resultados de la carga
     * @memberof BrandsComponent
     */
    resetVariableUploadFile() {
        this.fileName = '';
        this.arrayNecessaryData = [];
    }

    /**
     * Funcionalidad que permite capturar los datos del excel.
     * @param {*} evt
     * @returns {Promise<any>}
     * @memberof BrandsComponent
     */
    readFileUpload(evt: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let data: any;
            /* wire up file reader */
            const target: DataTransfer = <DataTransfer>(evt.target);
            if (target.files.length !== 1) {
                throw new Error('Cannot use multiple files');
            }
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
                try {
                    const bstr: string = e.target.result;
                    const wb: XLSX.WorkBook = XLSX.read(bstr, { raw: true, type: 'binary', sheetRows: this.limitRowExcel });
                    let ws: XLSX.WorkSheet;
                    if (wb.Sheets && wb.Sheets['Hoja1']) {
                        ws = wb.Sheets['Hoja1'];
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
     * @param {*} res
     * @param {*} file
     * @memberof BrandsComponent
     */
    validateDataFromFile(res: any, file: any) {
        if (res.length > 1) {
            let contEmptyRow = 0;
            /*Se hace iteración en todas las filas del excel*/
            for (let i = 0; i < res.length; i++) {
                /*Se crea un nuevo objeto por cada fila que traiga el excel*/
                this.arrayNecessaryData.push([]);
                /*Se hace iteración en todas las columnas que tenga una fila del excel*/
                for (let j = 0; j < res[0].length; j++) {
                    /*Se valida si la primera celda de cada columna si tenga dato, si no tiene no se tendra en cuenta*/
                    if (res[0][j] !== '' && res[0][j] !== null && res[0][j] !== undefined) {
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
                this.loading.closeSpinner();
                this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.no_information_contains'), 'Aceptar', 10000);
            } else {
                if (this.arrayNecessaryData[0].includes('Nombre de marca')) {
                    this.iVal = {
                        iNombreMarca: this.arrayNecessaryData[0].indexOf('Nombre de marca'),
                    };
                }
                this.fileName = file.target.files[0].name;
                this.fileSize = file.target.files[0].size;
                this.sendJsonMassiveBrand(this.arrayNecessaryData);
            }
        } else {
            this.loading.closeSpinner();
            this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.no_information_contains'), 'Aceptar', 10000);
        }
    }

    /**
     * Metodo para enviar JSON al back con array de marcas
     * @param {*} arraData
     * @memberof BrandsComponent
     */
    sendJsonMassiveBrand(arraData) {
        let sendBrand = false;
        if (this.fileSize > 8000000) {
            this.componentService.openSnackBar('El archivo no puede pesar mas de 8MB.', 'Aceptar', 7000);
            sendBrand = true;
        }
        arraData.splice(0, 1);
        let dataToSend = [];
        arraData.forEach(element => {
            element.forEach(el => {
                dataToSend.push(el);
            });
        });
        if (dataToSend.length > 300) {
            this.componentService.openSnackBar('El archivo no puede tener mas de 300 marcas.', 'Aceptar', 7000);
            sendBrand = true;
        }
        if (!sendBrand) {
            this.loading.viewSpinner();
            this.brandService.createMassiceBrands(dataToSend).subscribe(res => {
                if (res) {
                    const body = JSON.parse(res['body']);
                    if (body) {
                        if (body.Data !== false) {
                            this.progressStatus = false;
                            this.setIntervalStatusCharge();
                        } else {
                            this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), {
                                duration: 3000,
                            });
                        }
                    } else {
                        this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), {
                            duration: 3000,
                        });
                    }
                } else {
                    this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), {
                        duration: 3000,
                    });
                    this.loading.closeSpinner();
                }
            });
        }
    }

    /**
     * Funcion para limpiar la lista de archivos
     * @memberof BrandsComponent
     */
    clearListFiles() {
        this.arrayInformationForSend = [];
        this.fileName = '';
        this.arrayNecessaryData = [];
    }

    /**
     * Método que permite detectar el input file
     * @param {*} evt
     * @memberof BrandsComponent
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
            this.loading.closeSpinner();
            this.resetVariableUploadFile();
            this.resetUploadFIle();
            this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.error_has_uploading'), this.languageService.instant('actions.accpet_min'), 4000);
        });
    }

    /**
     * Funcion para ejecutir el serv de status cada cierto tiempo
     * @memberof BrandsComponent
     */
    setIntervalStatusCharge() {
        clearInterval(this.checkIfDoneCharge);
        this.checkIfDoneCharge = setInterval(() => this.brandService.statusMassiceBrands().subscribe((res: any) => {
            this.verifyStateCharge(res);
        }), 7000);
    }

    /**
     * Metodo para cerrar el dialogo
     * @memberof BrandsComponent
     */
    public closeActualDialog(): void {
        if (this.progressStatus) {
            this.dialog.closeAll();
        }
    }

    /**
     * Metodo para validar el status de la carga y abrir el modal de errores, proceso, o satisfactorio
     * @param {*} [result]
     * @memberof BrandsComponent
     */
    verifyStateCharge(result?: any) {
        if (result.body.Data.Checked === 'true') {
            clearInterval(this.checkIfDoneCharge);
        } else if (result.body.Data.Status === 1 || result.body.Data.Status === 4) {
            result.body.Data.Status = 1;
            if (!this.progressStatus) {
                this.openDialogSendOrder(result);
            }
            this.progressStatus = true;
            this.loading.closeSpinner();
        } else if (result.body.Data.Status === 2) {
            clearInterval(this.checkIfDoneCharge);
            this.closeActualDialog();
            this.openDialogSendOrder(result);
            this.loading.closeSpinner();
        } else if (result.body.Data.Status === 3) {
            this.closeActualDialog();
            clearInterval(this.checkIfDoneCharge);
            const resultBody = JSON.parse(result.body.Data.Response);
            if (resultBody.Errors.length > 0) {
                this.openDialogSendOrder(result);
            }
            this.loading.closeSpinner();
        }
    }

    /**
     * Metodo para abrir dialogo con msj de error o satisfactorio
     * @param {*} res
     * @memberof BrandsComponent
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
        const dialogRef = this.dialog.open(ModalBulkloadBrandsComponent, {
            width: '95%',
            disableClose: true,
            data: {
                response: res
            },
        });
        dialogRef.afterClosed().subscribe(result => {
            log.info('The dialog was closed');
        });
    }



    // addInfoTosend(res: any, i: any, iVal: any, errorInCell: boolean = false) {
    //     const newObjectForSend = {
    //         Brand: res[i][iVal.iPLU] ? res[i][iVal.iNombreMarca].trim() : null,
    //     };
    //     this.arrayInformationForSend.push(newObjectForSend);
    // }

    /**
     * Funcion para consultar las marcas registradas, recibe filtros, parametros y validacion para mostrar errores
     *
     * @param {*} [params]
     * @param {*} [activeFilter]
     * @param {boolean} [showErrors=true]
     * @memberof BrandsComponent
     */
    public getAllBrands(params?: any, activeFilter?: any, showErrors: boolean = true) {
        const page = this.pagepaginator;
        const limit = this.pageSize;
        const IdVTEX = 'null';
        const Status = 'null';
        let filterName = '';
        this.filterBrandsControlsName = this.filterBrands.controls['filterBrandsId'].value;
        this.filterBrandsControlsId = this.filterBrands.controls['filterBrandsName'].value;
        if (this.filterBrandsControlsName) {
            this.filterBrandsId = <number>this.filterBrands.controls['filterBrandsId'].value;
        } else {
            this.filterBrandsId = 'null';
        }

        if (this.filterBrandsControlsId) {
            this.filterBrandsName = (this.filterBrands.controls['filterBrandsName'].value).toUpperCase();
        } else {
            this.filterBrandsName = 'null';
        }

        if (page || limit) {
            this.countFilter++;
        } else { this.countFilter = 0; }
        if (this.filterBrandsName === '/') {
            filterName = encodeURIComponent(this.filterBrandsName);
        } else {
            filterName = encodeURIComponent(this.filterBrandsName);
        }
        this.filterBrandsName = filterName;

        const reg1 = /\'/gi;
        const reg2 = /\//gi;
        this.filterBrandsName = this.filterBrandsName.replace(reg1, '%27');
        this.filterBrandsName = this.filterBrandsName.replace(reg2, '%2F');

        this.urlParams = `${this.filterBrandsId}/${this.filterBrandsName}/${Status}/${IdVTEX}/${page}/${limit}`;
        this.loading.viewSpinner();
        this.brandService.getAllBrands(this.urlParams).subscribe((result: any) => {
           /* tslint:disable */ const res = JSON.parse(result.body.replace(/([\[:])?(\d+)([,\}\]])/g, "$1\"$2\"$3")).Data; /* tslint:disable */
            if (res && parseInt(res.Total) > 0) {
                this.brandsList = res.Brands;
                this.length = res.Total;
                this.sortedData = this.mapItems(
                    res.Brands,
                );
            } else {
                this.sortedData = null;
            }

            this.loading.closeSpinner();
        }, error => {
            this.loading.closeSpinner();
            this.modalService.showModal('errorService');
        });
    }
    /**
     *funcion para mapear el resultado del servicio get all brands
     * @param {any[]} items
     * @returns {any[]}
     * @memberof BrandsComponent
     */
    mapItems(items: any[]): any[] {
        return items.map(x => {
            return {
                Id: x.Id,
                Name: x.Name,
                Status: this.changeStatus(x.Status),
                IdVTEX: x.IdVTEX,
                UpdateStatus: x.UpdateStatus,
            };
        });
    }
    /**
     * funcion para cambiar de 1/0 a boleano y poder pintar el interruptor de activo/inactivo
     * @param {string} status
     * @returns
     * @memberof BrandsComponent
     */
    changeStatus(status: string) {
        if (status === "1") {
            return true;
        } else {
            return false;
        }
    }

    /**
     * funcion para ordenar columnas de la tabla de forma asc
     *
     * @param {Sort} sort
     * @returns
     * @memberof BrandsComponent
     */
    sortData(sort: Sort) {
        const data = this.brandsList.slice();
        if (!sort.active || sort.direction === '') {
            this.sortedData = data;
            return;
        }
        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id': return this.compare(a.Id, b.Id, isAsc);
                case 'name': return this.compare(a.Name, b.Name, isAsc);
                default: return 0;
            }
        });
    }

    /**
     * funcion para comparar el orden de las colunmas de la tabla (sort)
     *
     * @param {(number | string)} a
     * @param {(number | string)} b
     * @param {boolean} isAsc
     * @returns
     * @memberof BrandsComponent
     */
    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    /**
     * funcion para validar los permisos del usuario, consulta, editar y crear
     * @param functionality
     */
    validatePermission() {
        this.permissionComponent = this.authService.getMenu(brandName);
        this.canRead = this.getFunctionality(readFunctionality);
        this.canUpdate = this.getFunctionality(updateFunctionality);
        this.canCreate = this.getFunctionality(createFunctionality);
    }

    /**
     * Funcion que verifica si la funcion del modulo posee permisos
     * @param functionality
     * @memberof ToolbarComponent
     * @returns {boolean}
     */
    public getFunctionality(functionality: string): boolean {
        const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
        return permission && permission.ShowFunctionality;
    }

    /**
     * funcion para inicializar los grupos de formularios y los controles que tendrán esos grupos
     *
     * @memberof BrandsComponent
     */
    createForm() {
        this.filterBrands = new FormGroup({
            filterBrandsId: new FormControl('', [Validators.pattern(this.BrandsRegex.formatIntegerNumber)]),
            filterBrandsName: new FormControl(''),
        });
        this.form = new FormGroup({
            nameBrands: new FormControl('', [Validators.pattern(this.BrandsRegex.brandsName)]),
            idBrands: new FormControl('', [Validators.pattern(this.BrandsRegex.formatIntegerNumber)]),
            status: new FormControl(''),
        });

        this.form.valueChanges.subscribe(() => {
            this.validateExit = true;
        });
    }

    /**
     * Abre una ventana de dialogo, recibe la data, status y un index
     * @param brandsData
     * @param status
     * @param index
     */
    public upsetBrands(brandsData: any): void {
        const dataDialog = this.setDataChangeStatusDialog(brandsData);
        this.form.controls['nameBrands'].setErrors({ 'validExist': true });
        if (!!dataDialog && !!dataDialog.title) {
            const dialogRef = this.dialog.open(DialogWithFormComponent, {
                width: '55%',
                minWidth: '280px',
                data: dataDialog
            });
            setTimeout(() => {
                this.configDataDialog(dialogRef);
            });
        }
    }

    /**
     * funcion que recibe tres parametros, data, status y un index
     * envia mensaje, titulo, icono, posicion del texto y el formulario (template en el html)
     * @param brandsData
     * @param status
     * @param index
     */
    setDataChangeStatusDialog(brandsData: any) {
        let message = '';
        let title = '';
        let icon = '';
        let form = null;
        let messageCenter = false;
        const showButtons = false;
        const btnConfirmationText = null;

        if (brandsData && brandsData.Id) {
            message = this.languageService.instant('secure.parametize.brands.txt_edit_brand');
            icon = 'edit';
            title = this.languageService.instant('secure.parametize.brands.edit_brand');
            messageCenter = false;
            this.changeNameBrands = brandsData.Name;
            this.form.controls['nameBrands'].setValue(brandsData.Name);
            this.form.controls['idBrands'].setValue(brandsData.Id);
            this.form.controls['status'].setValue(brandsData.Status);
        } else {
            message = this.languageService.instant('secure.parametize.brands.txt_add_brand');;
            icon = 'control_point';
            title = this.languageService.instant('secure.parametize.brands.btn_add_brand');;
            messageCenter = false;
        }
        form = this.form;
        return { title, message, icon, form, messageCenter, showButtons, btnConfirmationText };
    }

    /**
     * Funcion para hacer la confirmacion del dialogo o cancelarla
     * @param dialog
     */
    configDataDialog(dialog: MatDialogRef<DialogWithFormComponent>) {
        const dialogInstance = dialog.componentInstance;
        dialogInstance.content = this.content;
        this.subs.push(dialog.afterClosed().subscribe(() => {
            this.form.reset({ nameBrands: '', IdBrands: '' });
        }));
    }

    /**
     * Funcion para limipiar los campos del filtro por medio de accion del boton 'LIMPIAR'
     */
    cleanAllFilter() {
        this.filterBrands.reset({ filterBrandsName: '', filterBrandsId: '' });
        this.listFilterBrands = [];
        this.getAllBrands();
    }

    /**
     * Consulta del servicio de regex para validar el formulario
     */
    public getRegexByModule(): void {
        this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
            let dataOffertRegex = JSON.parse(res.body.body);
            dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'parametrizacion');
            for (const val in this.BrandsRegex) {
                if (!!val) {
                    const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
                    this.BrandsRegex[val] = element && `${element.Value}`;
                }
            }
            this.createForm();
        });
    }

    /**
     * Funcion para abrir dialogo y poder activar o desactivar una marca
     */
    changeStatusBrands(event: any, brand: any) {
        event.preventDefault();
        this.setDataDialog(brand);
    }

    /**
     * Abre una ventana de dialogo, recibe la data, status y un index
     * @param brandsData
     * @param status
     * @param index
     */
    public setDataDialog(brandsData: any): void {
        const dataDialog = this.setStatusBrand(brandsData);
        if (!!dataDialog && !!dataDialog.title) {
            const dialogRef = this.dialog.open(DialogWithFormComponent, {
                width: '55%',
                minWidth: '280px',
                data: dataDialog
            });
            setTimeout(() => {
                this.configDataDialogActDes(dialogRef);
            });
        }
    }

    /**
     * funcion para activar o desactivar marcas, recibe el elemento el cual se le cambiara el estado
     */
    setStatusBrand(brandsData: any) {
        let message = '';
        let title = '';
        let icon = '';
        const form = null;
        let messageCenter = false;
        const showButtons = true;
        const btnConfirmationText = null;
        this.idBrands = brandsData.Id;
        this.statusBrands = brandsData.Status;
        this.nameBrands = brandsData.Name;

        if (this.statusBrands) {
            message = 'Desactivar la marca la eliminará del listado de marcas disponibles para la creación de producto unitario y masivo. ¿Estás seguro de esta acción?';
            icon = '';
            title = 'Desactivar Marca ' + ' (' + brandsData.Name + ')';
            messageCenter = false;
        } else {
            message = 'Al activar la marca, quedará habilitada para la creación de producto unitario y masivo. ¿Estás seguro de esta acción?';
            icon = '';
            title = 'Activar Marca' + ' (' + brandsData.Name + ')';
            messageCenter = false;
        }
        return { title, message, icon, form, messageCenter, showButtons, btnConfirmationText };
    }

    /**
     * funcion para confirmar el cambio de estado de una marca
     * @param {MatDialogRef<DialogWithFormComponent>} dialog
     * @memberof BrandsComponent
     */
    configDataDialogActDes(dialog: MatDialogRef<DialogWithFormComponent>) {
        let nameChangeStatus = '';
        if (this.nameBrands.toUpperCase() === '/') {
            nameChangeStatus = encodeURIComponent(this.nameBrands.toUpperCase());
        } else {
            nameChangeStatus = encodeURIComponent(this.nameBrands.toUpperCase());
        }
        let reg1 = /\'/gi;
        let reg2 = /\//gi;
        nameChangeStatus = nameChangeStatus.replace(reg1, '%27');
        nameChangeStatus = nameChangeStatus.replace(reg2, '%2F');
        const dialogInstance = dialog.componentInstance;
        dialogInstance.confirmation = () => {
            const body = {
                Id: this.idBrands,
                Name: nameChangeStatus,
                UpdateStatus: true,
            };
            if (!this.statusBrands === true) {
                this.stringStatus = 'activo';
            } else {
                this.stringStatus = 'desactivo';
            }
            this.loading.viewSpinner();
            this.brandService.changeStatusBrands(body).subscribe(result => {
                this.dessetUpsert = this.sortedData.find(x => x.Id === body.Id);
                this.dessetUpsert.Status = !this.statusBrands;
                this.snackBar.open('Se ' + this.stringStatus + ' correctamente la marca ' + this.nameBrands, 'Cerrar', {
                    duration: 3000,
                });
                dialogInstance.onNoClick();
                this.loading.closeSpinner();
            }, error => { console.error(error); });
        };
    }

    /**
     * funcion para aplicar filtros al listado de marcas
     *
     * @param {*} params
     * @memberof BrandsComponent
     */
    public filterApply(drawer: any) {
        this.pagepaginator = 0;
        this.paginator.firstPage();
        this.listFilterBrands = [];
        let filterName = '';
        if (this.filterBrands.controls['filterBrandsId'].value) {
            this.filterBrandsId = <number>this.filterBrands.controls['filterBrandsId'].value;
        } else {
            this.filterBrandsId = 'null';
        }

        if (this.filterBrands.controls['filterBrandsName'].value) {
            this.filterBrandsName = (this.filterBrands.controls['filterBrandsName'].value).toUpperCase();
        } else {
            this.filterBrandsName = 'null';
        }
        const data = [];

        data.push({ value: this.filterBrandsId, name: 'filterBrandsId', nameFilter: 'filterBrandsId' });
        data.push({ value: this.filterBrandsName, name: 'filterBrandsName', nameFilter: 'filterBrandsName' });
        this.add(data);
        this.getAllBrands('', true, false);
        drawer.toggle();
    }

    /**
     *funcion para agregar chips de filtrado
     *
     * @param {*} data
     * @memberof BrandsComponent
     */
    public add(data: any): void {
        data.forEach(element => {
            const value = element.value;
            if (value && value != 'null') {
                this.listFilterBrands.push({ name: element.value, value: element.name, nameFilter: element.nameFilter });
            }
        });
    }

    /**
     * funcion para remover los chips de filtrados, recargar con los filtros restantes 
     * @param {ListFilterBrands} brandsFilter
     * @memberof BrandsComponent
     */
    public remove(brandsFilter: ListFilterBrands): void {
        const index = this.listFilterBrands.indexOf(brandsFilter);
        if (index >= 0) {
            this.listFilterBrands.splice(index, 1);
            this[brandsFilter.value] = '';
            this.filterBrands.controls[brandsFilter.nameFilter].setValue(null);
        }
        this.getAllBrands();
    }


    /**
     * Funcion para cambiar paginador
     * @param {*} param
     * @returns {*}
     * @memberof ListProductsComponent
     */
    public changePaginatorBrands(param: any): any {
        this.pageSize = param.pageSize;
        this.pagepaginator = param.pageIndex;
        this.getAllBrands('', false, false);
    }

    /**
     * funcion para confirmar las acciones de creacion y edicion de marcas
     *
     * @memberof BrandsComponent
     */
    confirmation() {
        this.body = this.form.value;
        let reg1 = /\'/gi;
        let reg2 = /\//gi;
        this.body.nameBrands = this.body.nameBrands.replace(reg1, '%27');
        this.body.nameBrands = this.body.nameBrands.replace(reg2, '%2F');
        this.loading.viewSpinner();
        if (this.body && this.body.idBrands) {
            let nameUpdate = '';
            if (this.body.nameBrands.toUpperCase() === '/') {
                nameUpdate = encodeURIComponent(this.body.nameBrands.toUpperCase());
            } else {
                nameUpdate = this.body.nameBrands.toUpperCase();
            }
            this.brandService.changeStatusBrands({ Id: this.body.idBrands, Name: nameUpdate, UpdateStatus: false }).subscribe(result => {
                const errorMessage = JSON.parse(result.body);

                if (result.statusCode === 200 || result.statusCode === 201) {
                    this.snackBar.open('Actualizó correctamente la marca.', 'Cerrar', {
                        duration: 5000,
                    });
                    this.dialog.closeAll();
                    this.loading.closeSpinner();
                    this.getAllBrands();
                } else {
                    this.snackBar.open(errorMessage[0].Message, 'Cerrar', {
                        duration: 5000,
                    });
                    this.dialog.closeAll();
                    this.loading.closeSpinner();
                }
            });
        } else {
            let nameCreate = ''
            if (this.body.nameBrands.toUpperCase() === '/') {
                nameCreate = encodeURIComponent(this.body.nameBrands.toUpperCase());
            } else {
                nameCreate = this.body.nameBrands.toUpperCase();

            }
            this.brandService.createBrands({ Name: nameCreate }).subscribe(result => {
                const errorMessage = JSON.parse(result.body);

                if (result.statusCode === 200 || result.statusCode === 201) {
                    this.getAllBrands();
                    this.snackBar.open('Agregó correctamente una marca.', 'Cerrar', {
                        duration: 5000,
                    });
                    this.dialog.closeAll();
                    this.loading.closeSpinner();
                } else {
                    this.snackBar.open(errorMessage[0].Message, 'Cerrar', {
                        duration: 5000,
                    });
                    this.dialog.closeAll();
                    this.loading.closeSpinner();
                }
            });
        }
    }
    /**
     * funcion para validar la exitencia de una marca ya creada, si esta creada sale un snack bar y no permite la creacion
     *
     * @param {*} $event
     * @memberof BrandsComponent
     */
    public validateExist(event: any) {
        if (event.target.value.trim() === '' || event.target.value.trim() === null || event.target.value.trim() === undefined) {
            this.snackBar.open('El nombre de la marca no puede estar vacía.', 'Cerrar', {
                duration: 4000,
            });
        } else {
            this.newBrands = encodeURIComponent(event.target.value.toUpperCase());
            if (this.newBrands === '/') {
                this.newBrands = encodeURIComponent(this.newBrands)
            }
            let reg1 = /\'/gi;
            let reg2 = /\'/gi;
            this.newBrands = this.newBrands.replace(reg2, '%2F');
            this.newBrands = this.newBrands.replace(reg1, '%27');
            if (this.newBrands && this.newBrands !== '' && this.newBrands !== undefined && this.newBrands !== null) {
                if (this.newBrands !== this.changeNameBrands) {
                    this.urlParams = `null/${this.newBrands}/null/null`;
                    this.showSpinner = true;
                    this.brandService.validateExistBrands(this.urlParams).subscribe(result => {
                     /* tslint:disable */ const res = JSON.parse(result.body.replace(/([\[:])?(\d+)([,\}\]])/g, "$1\"$2\"$3")).Data; /* tslint:disable */
                        this.showSpinner = false;
                        if (res && parseInt(res.Total) > 0) {
                            this.snackBar.open('La marca ya existe en la base de datos.', 'Cerrar', {
                                duration: 4000,
                            });
                            this.validateExit = true;

                        } else {
                            this.validateExit = false;

                        }
                    }, error => {
                        this.showSpinner = false;
                        this.validateExit = true;
                        this.form.controls.nameBrands.setErrors({ 'validExistBrandsDB': true });
                    });
                }

            } else { return null; }
        }
    }
    /**
     * funcion para cerrar el dialogo de agregar marca
     *
     * @memberof BrandsComponent
     */
    onNoClick() {
        this.dialog.closeAll();
    }
}
