import { Component, OnInit, ViewChild, TemplateRef, OnDestroy} from '@angular/core';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { Logger, LoadingService, ModalService } from '@app/core';
import { MatSnackBar, PageEvent, MatSidenav, ErrorStateMatcher, MatChipInputEvent, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { trimField } from '../../../shared/util/validation-messages';

import { AuthService } from '@app/secure/auth/auth.routing';
import { MenuModel, readFunctionality, visualizeFunctionality, enableFunctionality, sellerListName, disableFunctionality, vacationFunctionality, cancelVacacionFunctionality } from '@app/secure/auth/auth.consts';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { DateService } from '@app/shared/util/date.service';
import * as moment from 'moment';
import { LanguageService } from '@app/core/language.service';

export interface ListFilterSeller {
    name: string;
    value: string;
    nameFilter: string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}


const log = new Logger('ManageSellerComponent');
@Component({
    selector: 'app-list-sellers',
    templateUrl: 'list-sellers.component.html',
    styleUrls: ['list-sellers.component.scss']
})

export class SellerListComponent implements OnInit, OnDestroy {

    public filterSeller: FormGroup;
    public id: FormControl;
    public sellerName: FormControl;
    public nit: FormControl;
    public matcher: MyErrorStateMatcher;
    public regexNoSpaces = /^((?!\s+).)*$/;
    showAn = true;
    sellerList: any;
    totalSellerList: any[] = [];
    sellerListOrder: any;
    sellerLength = 0;
    pageSize = 10;
    pageSizeOptions = [10, 20, 50, 100];
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [];
    listFilterSellers: ListFilterSeller[] = [
    ];

    public needFormStates$: BehaviorSubject<{posSeller: number, status: string}> = new BehaviorSubject({posSeller: 0, status: null});
    @ViewChild('dialogContent') content: TemplateRef<any>;
    statusForm: FormGroup;
    @ViewChild('intialPicker') initialPicker;
    @ViewChild('endPicker') endPicker;
    subs: Subscription[] = [];
    InitialDateSubscription: Subscription;

    // MatPaginator Output
    pageEvent: PageEvent;
    @ViewChild('sidenav') sidenav: MatSidenav;
    nameSellerListFilter: any;

    // Variables con los permisos que este componente posee
    permissionComponent: MenuModel;
    read = readFunctionality;
    visualize = visualizeFunctionality;
    enable = enableFunctionality;
    disable = disableFunctionality;
    vacation = vacationFunctionality;
    cancelVacation = cancelVacacionFunctionality;
    canEnabled: boolean;
    canDisabled: boolean;
    canVisualize: boolean;
    canPutInVacation: boolean;
    canCancelVacation: boolean;
    today = DateService.getToday();

    constructor(private storesService: StoresService,
        private loading: LoadingService,
        private snackBar: MatSnackBar,
        private router: Router,
        private fb: FormBuilder,
        private dialog: MatDialog,
        public authService: AuthService,
        private modalService: ModalService,
        private languageService: LanguageService) {
    }

    get reason(): FormControl{
        return this.statusForm.get('Reasons') as FormControl;
    }

    get observation(): FormControl{
        return this.statusForm.get('Observations') as FormControl;
    }

    get startDateVacation(): FormControl{
        return this.statusForm.get('StartDateVacation') as FormControl;
    }

    get endDateVacation(): FormControl{
        return this.statusForm.get('EndDateVacation') as FormControl;
    }

    ngOnInit() {
        const drawer: any = document.querySelector('.mat-drawer-content.mat-sidenav-content');
        !!drawer && drawer.classList.remove('mat-drawer-content');
        const drawerContainer = document.querySelector('.drawer-container.mat-drawer-container');
        !!drawerContainer && drawerContainer.classList.add('height_seller-list');
        this.permissionComponent = this.authService.getMenu(sellerListName);
        this.loading.viewSpinner();
        this.getRequiredData();
        this.createFormControls();
        this.initStatusForm();
        this.canDisabled = this.getFunctionality(this.disable);
        this.canEnabled = this.getFunctionality(this.enable);
        this.canVisualize = this.getFunctionality(this.visualize);
        this.canPutInVacation = this.getFunctionality(this.vacation);
        this.canCancelVacation = this.getFunctionality(this.cancelVacation);
    }

    /**
     * Metodo que crea el formulario de estado
     */
    initStatusForm() {
        this.statusForm = this.fb.group({
            IdSeller : ['', Validators.required]
        });
        this.subs.push(this.needFormStates$.subscribe(status => {
            !!status && this.putComplementDataInStatusForm(status);
        }));
    }

    /**
     * Funcion que verifica si la funcion del modulo posee permisos
     *
     * @param {string} functionality
     * @returns {boolean}
     * @memberof ToolbarComponent
     */
    public getFunctionality(functionality: string): boolean {
        const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
        return permission && permission.ShowFunctionality;
    }

    /**
     * Metodo que abre el dialogo de fecha de a cuerdo al campo clickeado
     * @param pos Posición del dialogo a abrir;
     */
    openPicker(pos: number) {
        switch (pos) {
            case 1:
            this.initialPicker.open();
            break;
            case 2:
            this.endPicker.open();
            break;
        }
    }

    /**
     * Metodo que modifica el formulario de cambio de estado dinamicamente
     * @param status Estado a cambiar
     */
    putComplementDataInStatusForm(status: any) {
        switch (status.status) {
            case 'disabled':
            this.statusForm.addControl('Reasons', new FormControl('', Validators.compose([Validators.maxLength(120), trimField, Validators.required])));
            this.statusForm.addControl('Observations', new FormControl('', Validators.compose([Validators.maxLength(2000), trimField, Validators.required])));
            !!this.InitialDateSubscription && this.InitialDateSubscription.unsubscribe();
            !!this.startDateVacation && this.statusForm.removeControl('StartDateVacation');
            !!this.endDateVacation && this.statusForm.removeControl('EndDateVacation');
            break;
            case 'vacation':
            this.statusForm.addControl('StartDateVacation', new FormControl('', Validators.compose([Validators.required])));
            this.statusForm.addControl('EndDateVacation', new FormControl('', Validators.compose([Validators.required])));
            if (!!this.sellerList[status.posSeller].StartVacations && !!this.sellerList[status.posSeller].EndVacations) {
                this.startDateVacation.setValue(DateService.stringToDate(this.sellerList[status.posSeller].StartVacations));
                this.endDateVacation.setValue(DateService.stringToDate(this.sellerList[status.posSeller].EndVacations));
            }
            this.InitialDateSubscription = this.startDateVacation.valueChanges.subscribe((val) => {
                if (!!val) {
                    this.endDateVacation.reset(null);
                }
            });
            !!this.reason && this.statusForm.removeControl('Reasons');
            !!this.observation && this.statusForm.removeControl('Observations');
            break;
            case 'enabled':
            !!this.InitialDateSubscription && this.InitialDateSubscription.unsubscribe();
            !!this.startDateVacation && this.statusForm.removeControl('StartDateVacation');
            !!this.endDateVacation && this.statusForm.removeControl('EndDateVacation');
            !!this.reason && this.statusForm.removeControl('Reasons');
            !!this.observation && this.statusForm.removeControl('Observations');
        }
    }

    /**
     * Metodo que abre el dialogo de cambio de estado
     * @param sellerData Vendedor al que se dese cambiar el estado
     * @param status Nuevo estado
     */
    public changeSellerStatus(sellerData: any, status: string, index: number): void {
        const dataDialog = this.setDataChangeStatusDialog(sellerData, status, index);
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
     * Metodo que orquesta la creación del dialogo de cancelar vacaciones
     */
    public sendToOpenCancelVacationDialog(index: number) {
        const dataForm = this.setDataCancelVacationsDialog();
        const dialogInstance = this.openCancelVacationDialog(dataForm);
        this.configCancelDialog(dialogInstance, index);
    }

    /**
     * metodo que gestiona la confimación del dialogo
     * @param dialog dialogo de cancelación de vacaciones
     * @param index posición del vendedor
     */
    configCancelDialog(dialog: DialogWithFormComponent, index: number){
        dialog.confirmation = () => {
            this.loading.viewSpinner();
            this.storesService.cancelVacation({IdSeller: this.sellerList[index].IdSeller}).subscribe(val => {
                if (val.status === 200) {
                    const body = val.body.body;
                    const message = JSON.parse(body);
                    if (body && message.Message && message.Message === 'El usuario ha sido actualizado éxitosamente.') {
                        this.sellerList[index].StartVacations = null;
                        this.sellerList[index].EndVacations = null;
                        this.snackBar.open('Actualizado correctamente: ' + this.sellerList[index].Name, 'Cerrar', {
                            duration: 3000,
                        });
                    } else {
                        this.getRequiredData();
                    }
                } else {
                    this.modalService.showModal('errorService');
                }
                dialog.onNoClick();
                this.loading.closeSpinner();
            });
        };
    }

    /**
     * metodo encargado de abrir el dialog
     * @param dataForm Data para abrir la modal
     */
    openCancelVacationDialog(dataForm: any) {
        const dialogRef = this.dialog.open(DialogWithFormComponent, {
            data: dataForm,
            width: '55%',
            minWidth: '280px'
        });
        return dialogRef.componentInstance;
    }

    /**
     * Metodo encargado de cambiar la data del dialogo para cancelar vacaciones
     */
    setDataCancelVacationsDialog() {
        const message = '¿Estas seguro que deseas cancelar tu periodo de vacaciones? Si confirmas esta acción volverás a estado activo, si el periodo ya empezó deberás ofertar nuevamente todas tus ofertas';
        const title = 'Cancelar vacaciones';
        const icon = 'local_airport';
        const form = null;
        const messageCenter = false;
        return {message, title, icon, form, messageCenter};
    }

    /**
     * Metodo que configura el dialogo
     * @param dialog Dialogo de cambio de estado
     */
    configDataDialog(dialog: MatDialogRef<DialogWithFormComponent>) {
        const dialogInstance = dialog.componentInstance;
        dialogInstance.content = this.content;
        dialogInstance.confirmation = () => {
            const form = this.statusForm.value;
            if (form.StartDateVacation && form.EndDateVacation) {
                form.StartDateVacation = DateService.getDateFormatToRequest(form.StartDateVacation);
                form.EndDateVacation = DateService.getDateFormatToRequest(form.EndDateVacation);
            }
            this.loading.viewSpinner();
            this.subs.push(this.storesService.changeStateSeller(form).subscribe(val => {
                const body = val.body;
                if ( body && body.statusCode && body.statusCode === 201) {
                    const resultData = JSON.parse(body.body);
                    if (resultData && resultData.Message && resultData.Messate === 'El usuario ha sido actualizado éxitosamente.') {
                        const status = this.needFormStates$.getValue();
                        this.updateSeller(status);
                    } else {
                        this.getRequiredData();
                    }
                } else {
                    this.modalService.showModal('errorService');
                }
                dialogInstance.onNoClick();
                this.loading.closeSpinner();
            }));
        };

        this.subs.push(dialog.afterClosed().subscribe(() => {
            this.needFormStates$.next(null);
            if (!!this.reason) {
                this.statusForm.reset({IdSeller: '', Reasons: '', Observations: ''});
            } else {
                this.statusForm.reset({IdSeller: '', EndDateVacation: '', StartDateVacation: ''});
            }
        }));
    }

    /**
     * Actualiza el estado del cliente
     * @param value Objeto con la posición del vendedor y el estado a cambiar
     */
    updateSeller(value: {posSeller: number, status: string}) {
        switch (value.status) {
            case 'enabled':
            this.sellerList[value.posSeller].Status = 'Enable';
            break;
            case 'disabled':
            this.sellerList[value.posSeller].Status = 'Disable';
            break;
            case 'vacation':
            this.sellerList[value.posSeller].StartVacations = DateService.getDateFormatToShow(this.startDateVacation.value);
            this.sellerList[value.posSeller].EndVacations = DateService.getDateFormatToShow(this.endDateVacation.value);
            break;
        }
        this.snackBar.open('Actualizado correctamente: ' + this.sellerList[value.posSeller].Name, 'Cerrar', {
            duration: 3000,
        });
    }
    /**
     * Metodo que construye la data del dialogo de a cuerdo al estado
     * @param sellerData La información del vendedor
     * @param status Estado a cambiar
     */
    setDataChangeStatusDialog(sellerData: any, status: string, index: number) {
        let message = '';
        let title = '';
        let icon = '';
        let form = null;
        let messageCenter = false;
        if (status === 'enabled' && sellerData.Status !== 'Enable' && this.canEnabled) {
            message = this.languageService.getValue('secure.seller.list.enabled_message_modal');
            icon = null;
            title = this.languageService.getValue('secure.seller.list.enabled_title_modal');
            messageCenter = true;
            this.needFormStates$.next({posSeller: index, status: 'enabled'});
        } else if (status === 'disabled' && sellerData.Status !== 'Disable' && this.canDisabled) {
            message = this.languageService.getValue('secure.seller.list.disabled_message_modal');
            icon = null;
            title = this.languageService.getValue('secure.seller.list.disabled_title_modal');
            this.needFormStates$.next({posSeller: index, status: status.toString()});
        } else if (status === 'vacation' && sellerData.Status !== 'Disable' && this.canPutInVacation) {
            title =  this.languageService.getValue('secure.seller.list.vacation_title_modal');
            message = this.languageService.getValue('secure.seller.list.vacation_message_modal');
            icon = 'local_airport';
            this.needFormStates$.next({posSeller: index, status: status.toString()});
            if (this.sellerList[index].StartVacations && this.sellerList[index].EndVacations) {
                const startDateVacationsSeller = DateService.stringToDate(this.sellerList[index].StartVacations);
                if (moment(this.today).diff(moment(startDateVacationsSeller)) > 0) {
                    !!this.startDateVacation && this.startDateVacation.setValue(this.today);
                } else {
                    !!this.startDateVacation && this.startDateVacation.setValue(startDateVacationsSeller);
                }
                !!this.endDateVacation && this.endDateVacation.setValue(DateService.stringToDate(this.sellerList[index].EndVacations));
            }
        }
        this.statusForm.get('IdSeller').setValue(sellerData.IdSeller);
        form = this.statusForm;
        return {title, message, icon, form, messageCenter};
    }

    /**
     * @method toggleMenu
     * @memberof FilterComponent
     * @description Metodo para abrir o cerrar el menu
     */
    toggleMenu() {
        this.sidenav.toggle();
    }

    public cleanFilterListSeller(): void {
        this.listFilterSellers = [];
        this.sellerList = this.totalSellerList;
    }

    public filterListSeller() {
        this.cleanFilterListSeller();
        const data = [];
        data.push({ value: this.filterSeller.controls.id.value, name: 'idSeller', nameFilter: 'id' });
        data.push({ value: this.filterSeller.controls.sellerName.value, name: 'nameSeller', nameFilter: 'sellerName' });
        data.push({ value: this.filterSeller.controls.nit.value, name: 'nitSeller', nameFilter: 'nit' });
        this.add(data);
    }


    filterSellerList() {
        if (this.listFilterSellers.length > 0) {
            const filterList = this.totalSellerList.filter((element) => {
                let trueId = true;
                let trueNameSeller = true;
                let trueNit = true;
                this.listFilterSellers.forEach(filterElement => {
                    switch (filterElement.value) {
                        case 'idSeller':
                            trueId = element.IdSeller.toString().match(filterElement.name);
                            break;
                        case 'nameSeller':
                            trueNameSeller = element.Name.toLowerCase().match(filterElement.name.toLowerCase());
                            break;
                        case 'nitSeller':
                            trueNit = element.Nit.toString().match(filterElement.name);
                            break;
                    }
                });
                if (trueId && trueNameSeller && trueNit) {
                    return element;
                }
            });
            this.sellerList = filterList;
        } else {
            this.sellerList = this.totalSellerList;
        }
    }

    public paginatorSellerList(index: number): boolean {
        if (this.pageEvent) {
            return index <= ((this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize) - 1 &&
                index >= ((this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize) - this.pageEvent.pageSize;
        } else {
            return index <= this.pageSize - 1;
        }

    }

    public redirectToSeller(idSeller: number): void {
        this.router.navigate([`/${RoutesConst.sellerCenterIntSellerManage}` , { id: idSeller }]);
        // window.open(`/${RoutesConst.sellerCenterIntSellerManage};id=${idSeller}`);
    }


    public getRequiredData(): void {
        this.storesService.getAllStoresFull(null).subscribe((result: any) => {
            if (result.status === 200) {
                const body = JSON.parse(result.body.body);
                this.sellerList = body.Data;
                this.sellerListOrder = this.sellerList.sort(function (a: any, b: any) {
                    return a['IdSeller'] - b['IdSeller'];
                });
                this.sellerLength = this.sellerList.length;
                this.sellerList.map(seller => {
                    const startDate = new Date(seller.StartVacations);
                    const endDate = new Date(seller.EndVacations);
                    if (startDate.getFullYear() === 1 || endDate.getFullYear() === 1) {
                        seller.StartVacations = null;
                        seller.EndVacations = null;
                    } else {
                        seller.StartVacations = DateService.getDateFormatToShow(startDate);
                        seller.EndVacations = DateService.getDateFormatToShow(endDate);
                    }
                });
                this.totalSellerList = this.sellerList;
            } else {
                log.error('Error al cargar los vendendores: ', result);
            }
            this.loading.closeSpinner();
        }, error => {
            log.error('Error al cargar los vendendores: ', error);
            this.loading.closeSpinner();
        });
    }

    createFormControls() {
        this.filterSeller = this.fb.group({
            id: new FormControl('', [Validators.compose([Validators.pattern(this.regexNoSpaces)])]),
            sellerName: new FormControl('', []),
            nit: new FormControl('', [Validators.compose([Validators.pattern('^[0-9]*$')])]),
            matcher: new MyErrorStateMatcher()
        });
    }

    public cleanFilter() {
        this.filterSeller.reset();
        this.cleanFilterListSeller();
    }

    /**
     * Metodo para añadir los chips de los filtros
     *
     * @param {*} data
     * @memberof SellerListComponent
     */
    public add(data: any): void {
        data.forEach(element => {
            const value = element.value;
            if (value) {
                // Add our listFilterSellers
                if ((value || '').trim()) {
                    this.listFilterSellers.push({ name: value.trim(), value: element.name, nameFilter: element.nameFilter });
                }

            }
        });
        this.filterSellerList();
    }

    /**
     * Metodo para ir eliminando los filtros aplicados
     *
     * @param {ListFilterSeller} listFilterSeller
     * @memberof SellerListComponent
     */
    public remove(listFilterSeller: ListFilterSeller): void {
        const index = this.listFilterSellers.indexOf(listFilterSeller);
        if (index >= 0) {
            this.listFilterSellers.splice(index, 1);
            this[listFilterSeller.value] = '';
            this.filterSeller.controls[listFilterSeller.nameFilter].setValue(null);
        }
        this.filterSellerList();
    }

    ngOnDestroy() {
        this.subs && this.subs.forEach(sub => sub.unsubscribe());
        const drawer = document.querySelector('mat-sidenav-content');
        !!drawer && drawer.classList.add('mat-drawer-content');
        const drawerContainer = document.querySelector('.drawer-container.mat-drawer-container');
        !!drawer && drawerContainer.classList.remove('height_seller-list');
    }
}
