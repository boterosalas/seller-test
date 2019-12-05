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
import { LoadingService, ModalService } from '@app/core';
import { CustomPaginator } from '../../products/list-products/listFilter/paginatorList';
import { TranslateService } from '@ngx-translate/core';

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

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('dialogContent') content: TemplateRef<any>;
    @ViewChild('matSlideToggle') matSlideToggle: ElementRef;
    @ViewChild('buttonClose') buttonClose: ElementRef;

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
    ) { }


    ngOnInit() {
        this.getRegexByModule();
        this.createForm();
        this.validatePermission();
        this.getAllBrands();
    }

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

        this.urlParams = `${this.filterBrandsId}/${this.filterBrandsName}/${Status}/${IdVTEX}/${page}/${limit}`;
        this.loading.viewSpinner();
        this.brandService.getAllBrands(this.urlParams).subscribe((result: any) => {
           /* tslint:disable */ const res = JSON.parse(result.body.replace(/([\[:])?(\d+)([,\}\]])/g, "$1\"$2\"$3")).Data; /* tslint:disable */
           if ( res && parseInt(res.Total) > 0) {
                this.brandsList = res.Brands,
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
        } else { }

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
        return { title, message, icon, form, messageCenter, showButtons, btnConfirmationText};
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
        const dialogInstance = dialog.componentInstance;
        dialogInstance.confirmation = () => {
            const body = {
                Id: this.idBrands,
                Name: this.nameBrands,
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
        this.loading.viewSpinner();
        if (this.body && this.body.idBrands) {
            this.brandService.changeStatusBrands({ Id: this.body.idBrands, Name: this.body.nameBrands.toUpperCase(), UpdateStatus: false }).subscribe(result => {
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
            this.brandService.createBrands({ Name: this.body.nameBrands }).subscribe(result => {
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
        this.newBrands = event.target.value.toUpperCase();
        if (this.newBrands && this.newBrands !== '' && this.newBrands !== undefined && this.newBrands !== null) {
            if (this.newBrands !== this.changeNameBrands) {
                this.urlParams = `null/${this.newBrands}/null/null`;
                this.showSpinner = true;
                this.brandService.validateExistBrands(this.urlParams).subscribe(result => {
                     /* tslint:disable */ const res = JSON.parse(result.body.replace(/([\[:])?(\d+)([,\}\]])/g, "$1\"$2\"$3")).Data; /* tslint:disable */
                    this.showSpinner = false;
                    if (res && parseInt(res.Total) > 0) {
                        this.snackBar.open('La marca ya existe en la base de datos.', 'Cerrar', {
                            duration: 3000,
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
    /**
     * funcion para cerrar el dialogo de agregar marca
     *
     * @memberof BrandsComponent
     */
    onNoClick() {
        this.dialog.closeAll();
    }
}
