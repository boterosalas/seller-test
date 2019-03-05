import { Component, OnInit, ViewChild, TemplateRef, OnDestroy} from '@angular/core';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { Logger, LoadingService } from '@app/core';
import { MatSnackBar, PageEvent, MatSidenav, ErrorStateMatcher, MatChipInputEvent, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DialogWithFormComponent } from './dialog-with-form/dialog-with-form.component';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { trimField } from '../../../shared/util/validation-messages'


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
    idSeller: any;
    nameSeller: any;
    nitSeller: any;
    public matcher: MyErrorStateMatcher;
    public regexNoSpaces = /^((?!\s+).)*$/;
    showAn = true;
    sellerList: any;
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

    public needFormStates$: BehaviorSubject<string> = new BehaviorSubject(null);
    @ViewChild('dialogContent') content: TemplateRef<any>;
    statusForm: FormGroup;
    @ViewChild('intialPicker') initialPicker;
    @ViewChild('endPicker') endPicker;
    subs: Subscription[] = []

    // MatPaginator Output
    pageEvent: PageEvent;
    @ViewChild('sidenav') sidenav: MatSidenav;
    nameSellerListFilter: any;
    



    constructor(private storesService: StoresService,
        private loading: LoadingService,
        private snackBar: MatSnackBar,
        private router: Router,
        private fb: FormBuilder,
        private dialog: MatDialog) {
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
        this.loading.viewSpinner();
        this.getRequiredData();
        this.createFormControls();
        this.initStatusForm();
        // this.createForm();
        // this.matDrawer.closedStart = tri
    }

    /**
     * Method that create the statusForm
     */
    initStatusForm(){
        this.statusForm = this.fb.group({
            IdSeller : ['', Validators.required]
        })
        this.subs.push(this.needFormStates$.subscribe(status => {
            this.putComplementDataInStatusForm(status);
        }));
    }

    /**
     * Method that open a specific datePicker at click an input
     * @param pos Pos of datepicker to open;
     */
    openPicker(pos: number){
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
     * Method that build the statusForm dynamic
     * @param status Status to change
     */
    putComplementDataInStatusForm(status: string) {
        if(status == 'disabled') {
            this.statusForm.addControl('Reasons', new FormControl('', Validators.compose([Validators.maxLength(120), trimField, Validators.required])));
            this.statusForm.addControl('Observations', new FormControl('', Validators.compose([Validators.maxLength(2000), trimField, Validators.required])));
            !!this.startDateVacation ? this.statusForm.removeControl('StartDateVacation') : null;
            !!this.endDateVacation ? this.statusForm.removeControl('EndDateVacation') : null;
        } else if(status == 'vacation'){
            this.statusForm.addControl('StartDateVacation',new FormControl('', Validators.compose([Validators.required])));
            this.statusForm.addControl('EndDateVacation',new FormControl('', Validators.compose([Validators.required])))
            !!this.reason ? this.statusForm.removeControl('Reasons') : null;
            !!this.observation ? this.statusForm.removeControl('Observations') : null;
        } else {
            !!this.startDateVacation ? this.statusForm.removeControl('StartDateVacation') : null;
            !!this.endDateVacation ? this.statusForm.removeControl('EndDateVacation') : null;
            !!this.reason ? this.statusForm.removeControl('Reasons') : null;
            !!this.observation ? this.statusForm.removeControl('Observations') : null;
        }
    }

    /**
     * Method that change the date format to DD/MM/YYYY
     * @param date Date to change the format
     */
    setFormatDate(date: Date){
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    /**
     * Method that open the dialog to confirmation change status
     * @param sellerData 
     * @param status 
     */
    public changeSellerStatus(sellerData: any, status: string): void {
        const dataDialog = this.setDataChangeStatusDialog(sellerData, status);
        const dialogRef = this.dialog.open(DialogWithFormComponent, {
            width: '55%',
            minWidth: '280px',
            data: dataDialog
        });
        if(!!dataDialog) {
            setTimeout(() => {
                this.configDataDialog(dialogRef);
            })
        }
        /*
        sellerData.block = true;
        this.storesService.changeStateSeller(sellerData.idSeller).subscribe(data => {
            setTimeout(() => {
                sellerData.block = false;
                this.snackBar.open('Actualizado correctamente: ' + sellerData.Name, 'Cerrar', {
                    duration: 3000,
                });
            }, 3000);
        });
        */
    }

    /**
     * Config the Confirmation, afterclose actions and the content to render in the dialog
     * @param dialog Dialog to confirm the change status
     */
    configDataDialog(dialog: MatDialogRef<DialogWithFormComponent>){
        const dialogInstance = dialog.componentInstance; 
        dialogInstance.content = this.content;
        dialogInstance.confirmation = () => {
            const form = this.statusForm.value;
            if(form.StartDateVacation && form.EndDateVacation) {
                form.StartDateVacation = this.setFormatDate(form.StartDateVacation);
                form.EndDateVacation = this.setFormatDate(form.EndDateVacation);
            }
            this.loading.viewSpinner();
            this.subs.push(this.storesService.changeStateSeller(form).subscribe(val => {
                this.loading.closeSpinner();
            }));
        };

        this.subs.push(dialog.afterClosed().subscribe(() => {
            this.needFormStates$.next(null);
        }));
    }
    /**
     * Method that build the data for Dialog Confirmation at change status
     * @param sellerData Seller's data to change status
     * @param status statatus to change
     */
    setDataChangeStatusDialog(sellerData: any, status: string){
        let message = "";
        let title = "";
        let icon = "";
        let form = null;
        if(status=="enabled" && sellerData.status != 'enabled'){
            message = "¿Estas seguro que deseas activar este vendedor?";
            icon = null;
            title = "Activación";
        } else if (status == "disabled" && sellerData.status != 'disabled') {
            message = "Para desactivar este vendedor debes ingresar un motivo y una observación que describan al vendedor la razón por la cual su tienda está siendo desactivada. Una vez ingresados podrás dar clic al botón ACEPTAR.";
            icon = null;
            title= "Desactivación";
            this.needFormStates$.next(status.toString());
        } else if(status == "vacation" && sellerData.status != 'disabled') {
            title = "Vacaciones";
            message = "Para programar la tienda en estado de vacaciones debes ingresar una fecha inicial y una fecha final para el periodo, y dar clic al botón PROGRAMAR. Los efectos solo tendrán lugar una vez empiece la fecha programada. Recuerda ofertar nuevamente una vez el periodo se haya cumplido, de lo contrario tus ofertas no se verán en los sitios.";
            icon = "local_airport"
            this.needFormStates$.next(status.toString());
        }
        this.statusForm.get('IdSeller').setValue(sellerData.IdSeller);
        form = this.statusForm;
        return {title, message, icon, form}
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
        this.idSeller = null;
        this.nameSeller = null;
        this.nitSeller = null;
        this.listFilterSellers = [];

    }

    public filterListSeller() {
        this.cleanFilterListSeller();
        this.idSeller = this.filterSeller.controls.id.value;
        this.nameSeller = this.filterSeller.controls.sellerName.value;
        // Resetea la variable siempre y cuando no sea nulla
        if (this.nameSeller !== null) {
            this.nameSeller = this.nameSeller.trim().toLowerCase();
        }
        this.nitSeller = this.filterSeller.controls.nit.value;
        const data = [];
        data.push({ value: this.idSeller, name: 'idSeller', nameFilter: 'id' });
        data.push({ value: this.nameSeller, name: 'nameSeller', nameFilter: 'sellerName' });
        data.push({ value: this.nitSeller, name: 'nitSeller', nameFilter: 'nit' });
        this.add(data);
    }

    /**
     *  showSeller => Metodo para realizar el filtro de listado de vendedores.
     *
     * @param {number} index
     * @returns {boolean}
     * @memberof SellerListComponent
     */
    public showSeller(index: number): boolean {
        const count = 3;
        let accomp = 0;
        if (this.idSeller) {
            if (this.sellerList[index].IdSeller.toString().match(this.idSeller)) {
                accomp++;
            }
        } else {
            accomp++;
        }
        if (this.nameSeller) {
            this.nameSellerListFilter = this.sellerList[index].Name;
            this.nameSellerListFilter = this.nameSellerListFilter.toLowerCase();
            if (this.nameSellerListFilter.match(this.nameSeller)) {
                accomp++;
            }
        } else {
            accomp++;
        }
        if (this.nitSeller) {
            if (this.sellerList[index].Nit.toString().match(this.nitSeller)) {
                accomp++;
            }
        } else {
            accomp++;
        }
        if (accomp === count) {
            return true;
        } else {
            return false;
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
        this.router.navigate([`/${RoutesConst.sellerCenterIntSellerManage}`, { id: idSeller }]);
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
            id: new FormControl('', [Validators.pattern(this.regexNoSpaces)]),
            sellerName: new FormControl('', []),
            nit: new FormControl('', [Validators.pattern('^[0-9]*$')]),
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
    }

    ngOnDestroy() {
        this.subs && this.subs.forEach(sub => {
            sub.unsubscribe();
        })
    }
}
