import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { BrandService } from './brands.component.service';
import { MatDialog, PageEvent, MatDialogRef, ErrorStateMatcher, MatSnackBar, Sort } from '@angular/material';
import { MatPaginator, MatSort } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { SupportService } from '@app/secure/support-modal/support.service';
import { readFunctionality, createFunctionality, updateFunctionality, MenuModel, brandName } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { LoadingService, ModalService } from '@app/core';

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
    id: number;
    name: string;
    status: boolean;
    paginationToken: string;
}

@Component({
    selector: 'app-brands',
    templateUrl: './brands.component.html',
    styleUrls: ['brands.component.scss']
})



export class BrandsComponent implements OnInit {

    sortedData: Brands[];
    brandsList: Brands[];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('dialogContent') content: TemplateRef<any>;
    @ViewChild('matSlideToggle') matSlideToggle: ElementRef;

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
    BrandsRegex = { formatNumber: '' };
    idBrands: number;
    statusBrands: boolean;
    nameBrands: string;
    stringStatus: string;

    permissionComponent: MenuModel;
    canRead: boolean;
    canUpdate: boolean;
    canCreate: boolean;
    urlParams: string;
    filterBrandsId: any;
    filterBrandsName: any;
    dessetUpsert: any;
    showMessage = false;
    body: any;
    validateBrandsExist: boolean;
    dialogReff: DialogWithFormComponent;
    validateExit = true;
    newBrands: string;



    paginationToken_test: Array<any>;
    validatePage_test: any;
    pagaCurrent_test: string = null;


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
        private modalService?: ModalService,
    ) { }


    ngOnInit() {
        this.paginationToken_test = [];
        this.paginationToken_test.push({'page': '0', 'paginationToke': null});
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
        this.filterBrandsId = this.filterBrands.controls['filterBrandsId'].value;
        this.filterBrandsName = this.filterBrands.controls['filterBrandsName'].value;

        if (page || limit) {
            this.countFilter++;
        } else {}

        if (this.countFilter) {
            this.urlParams = `${this.filterBrandsId}/${this.filterBrandsName}/${page}/${limit}/`;
        } else {}
        this.loading.viewSpinner();

        this.brandService.getAllBrands(this.urlParams).subscribe((result: any) => {

            this.brandsList = result.brands,
                this.sortedData = result.brands,
                this.length = result.totalLength;
            this.loading.closeSpinner();
        }, error => {
            this.loading.closeSpinner();
            this.modalService.showModal('errorService');
        });
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
        } else {}

        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id': return this.compare(a.id, b.id, isAsc);
                case 'name': return this.compare(a.name, b.name, isAsc);
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
            filterBrandsId: new FormControl('', [Validators.pattern(this.BrandsRegex.formatNumber)]),
            filterBrandsName: new FormControl('', [Validators.pattern(this.BrandsRegex.formatNumber)]),
        });
        this.form = new FormGroup({
            nameBrands: new FormControl('', [Validators.pattern(this.BrandsRegex.formatNumber)]),
            idBrands: new FormControl('', [Validators.pattern(this.BrandsRegex.formatNumber)]),
            status: new FormControl('', [Validators.pattern(this.BrandsRegex.formatNumber)]),
        });
    }

    /**
     * Abre una ventana de dialogo, recibe la data, status y un index
     * @param brandsData
     * @param status
     * @param index
     */
    public upsetBrands(brandsData: any, status: string, index: number): void {
        const dataDialog = this.setDataChangeStatusDialog(brandsData, status, index);
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
    setDataChangeStatusDialog(brandsData: any, status: string, index: number) {
        let message = '';
        let title = '';
        let icon = '';
        let form = null;
        let messageCenter = false;

        if (brandsData && brandsData.id) {
            message = 'Para editar una marca podrás modificar el nombre, Ten en cuenta que si la marca ya existe no podrás modifcarlo, y que no podrás utilizar ningún símbolo o caracter especial. ';
            icon = 'edit';
            title = 'Editar marca';
            messageCenter = false;
            this.form.controls['nameBrands'].setValue(brandsData.name);
            this.form.controls['idBrands'].setValue(brandsData.id);
            this.form.controls['status'].setValue(brandsData.status);
        } else {
            message = 'Para crear una marca nueva debes ingresar el nombre de la marca como quieres que aparezca en el sitio. Ten en cuenta que si la marca ya existe no podrás crearla, y que no podrás utilizar ningún símbolo o caracter especial.';
            icon = 'control_point';
            title = 'Agregar marca';
            messageCenter = false;
        }
        form = this.form;
        return { title, message, icon, form, messageCenter };
    }

    /**
     * Funcion para hacer la confirmacion del dialogo o cancelarla
     * @param dialog
     */
    configDataDialog(dialog: MatDialogRef<DialogWithFormComponent>) {
        console.log(dialog);
        const dialogInstance = dialog.componentInstance;
        dialogInstance.content = this.content;
        dialogInstance.confirmation = () => {
            this.body = this.form.value;
            this.brandService.changeStatusBrands(this.body).subscribe(result => {
                this.body.nameBrands.toUpperCase();
                //    this.dessetUpsert = this.brandsList.find(x => x.name === this.body.nameBrands);
                //    console.log(this.body.nameBrands);
                //    console.log(this.brandsList);
                //    if (this.dessetUpsert) {
                //      this.showMessage = true;
                //    } else {
                //      this.showMessage = false;
                //    }


                // if (result.status === 200) {
                //     const reponse = result.body.body;
                //     const message = JSON.parse(body);
                //     if (body && message.Message && message.Message === 'El usuario ha sido actualizado éxitosamente.') {
                //         // this.sellerList[index].StartVacations = null;
                //         // this.sellerList[index].EndVacations = null;
                //         // this.snackBar.open('Actualizado correctamente: ' + this.sellerList[index].Name, 'Cerrar', {
                //         //     duration: 3000,
                //         // });
                //     } else {
                //         // this.getRequiredData();
                //     }
                // } else {
                //     this.modalService.showModal('errorService');
                // }
                // // dialog.onNoClick();
                // this.loading.closeSpinner();
            });
        };

        this.subs.push(dialog.afterClosed().subscribe(() => {
            this.form.reset({ nameBrands: '', IdBrands: '' });
        }));
    }

    /**
     * Funcion para cerrar el filtro y limpiar los campos del filtrado
     */
    closeFilter() {
        this.filterBrands.reset({ filterBrandsName: '', filterBrandsId: '' });
    }

    /**
     * Funcion para limipiar los campos del filtro por medio de accion del boton 'LIMPIAR'
     */
    cleanAllFilter() {
        this.filterBrands.reset({ filterBrandsName: '', filterBrandsId: '' });
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
        this.idBrands = brandsData.id;
        this.statusBrands = brandsData.status;
        this.nameBrands = brandsData.name;

        if (this.statusBrands) {
            message = 'Desactivar la marca la eliminará del listado de marcas disponibles para la creación de producto unitario y masivo. ¿Estás seguro de esta acción?';
            icon = '';
            title = 'Desactivar Marca ' + ' (' + brandsData.name + ')';
            messageCenter = false;
        } else {
            message = 'Al Activar la marca, quedará habilitada para la creación de producto unitario y masivo. ¿Estás seguro de esta acción?';
            icon = '';
            title = 'Activar Marca' + ' (' + brandsData.name + ')';
            messageCenter = false;
        }
        return { title, message, icon, form, messageCenter };
    }

    /**
     * funcion para confirmar el cambio de estado de una marca
     *
     * @param {MatDialogRef<DialogWithFormComponent>} dialog
     * @memberof BrandsComponent
     */
    configDataDialogActDes(dialog: MatDialogRef<DialogWithFormComponent>) {
        const dialogInstance = dialog.componentInstance;
        dialogInstance.confirmation = () => {
            const body = {
                id: this.idBrands,
                status: !this.statusBrands,
                name: this.nameBrands.toUpperCase()
            };
            if (body && body.status === true) {
                this.stringStatus = 'activo';
            } else {
                this.stringStatus = 'desactivo';
            }
            this.loading.viewSpinner();
            this.brandService.changeStatusBrands(body).subscribe(result => {
                this.dessetUpsert = this.brandsList.find(x => x.id === body.id);
                this.dessetUpsert.status = body.status;
                this.snackBar.open('Se ' + this.stringStatus + ' correctamente la marca ' + this.nameBrands, 'Cerrar', {
                    duration: 3000,
                });
                dialogInstance.onNoClick();
                this.loading.closeSpinner();
            });
        };
    }
    /**
     * funcion para aplicar filtros al listado de marcas
     *
     * @param {*} params
     * @memberof BrandsComponent
     */
    public filterApply(params: any) {
        this.getAllBrands('', true, false);
    }
    /**
     * Funcion para cambiar paginador
     *
     * @param {*} param
     * @returns {*}
     * @memberof ListProductsComponent
     */
    public changePaginatorBrands(param: any): any {
        // console.log(param);
        // this.token_test = this.brandsList[this.brandsList.length - 1 ].paginationToken;
        // this.brandsList.findIndex(x => x === position)
        // console.log(this.brandsList[position].id)
        this.pageSize = param.pageSize;
        this.pagepaginator = param.pageIndex;

        this.validatePage_test = this.paginationToken_test.find(x => x.page === this.pagepaginator.toString());
        if (this.validatePage_test) {
            this.pagaCurrent_test = this.validatePage_test.paginationToke;
        } else {
            this.paginationToken_test.push({'page': this.pagepaginator.toString(), 'paginationToke': this.brandsList[this.brandsList.length - 1 ].paginationToken });
            this.pagaCurrent_test = this.brandsList[this.brandsList.length - 1 ].paginationToken;
        }
        console.log(this.pagaCurrent_test);
        // console.log(this.pagepaginator);
        this.getAllBrands('', false, false);
    }
    /**
     *
     *
     * @param {*} $event
     * @memberof BrandsComponent
     */
    public validateExist(event: any) {
        console.log(event);
        this.newBrands = event.target.value.toUpperCase();
        if (this.newBrands && this.newBrands !== '' && this.newBrands !== undefined && this.newBrands !== null) {
            this.brandService.validateExistBrands(this.newBrands).subscribe(res => {
                // Validar si la data es un booleano
                // this.validateBrandsExist = (res['data']);
                this.validateExit = true;
                // this.form.controls.nameBrands.setErrors(null);
                this.form.controls.nameBrands.setErrors({ 'validExistBrandsDB': true });
            }, error => {
                // this.validateEanExist = true;
            });
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
