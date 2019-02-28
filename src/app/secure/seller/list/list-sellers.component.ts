import { Component, OnInit, ViewChild } from '@angular/core';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { Logger, LoadingService } from '@app/core';
import { MatSnackBar, PageEvent, MatSidenav, ErrorStateMatcher, MatChipInputEvent } from '@angular/material';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AuthService } from '@app/secure/auth/auth.routing';
import { MenuModel, readFunctionality, visualizeFunctionality, enableFunctionality, sellerListName } from '@app/secure/auth/auth.consts';

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

export class SellerListComponent implements OnInit {

    public filterSeller: FormGroup;
    public id: FormControl;
    public sellerName: FormControl;
    public nit: FormControl;
    idSeller: any;
    nameSeller: any;
    nitSeller: any;
    // public stateSeller: FormControl;
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

    // MatPaginator Output
    pageEvent: PageEvent;
    @ViewChild('sidenav') sidenav: MatSidenav;
    nameSellerListFilter: any;
    // Variables con los permisos que este componente posee
    permissionComponent: MenuModel;
    read = readFunctionality;
    visualize = visualizeFunctionality;
    enable = enableFunctionality;

    constructor(private storesService: StoresService,
        private loading: LoadingService,
        private snackBar: MatSnackBar,
        private router: Router,
        private fb: FormBuilder,
        public authService: AuthService) {
    }

    ngOnInit() {
        this.permissionComponent = this.authService.getMenu(sellerListName);
        this.loading.viewSpinner();
        this.getRequiredData();
        this.createFormControls();
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

    public changeSellerState(sellerData: any): void {
        sellerData.block = true;
        this.storesService.changeStateSeller(sellerData.idSeller).subscribe(data => {
            setTimeout(() => {
                sellerData.block = false;
                this.snackBar.open('Actualizado correctamente: ' + sellerData.Name, 'Cerrar', {
                    duration: 3000,
                });
            }, 3000);
        });
    }

    /**
     * @method toggleMenu
     * @memberof FilterComponent
     * @description Metodo para abrir o cerrar el menu
     */
    toggleMenu() {
        // this.sidenav.toggle();
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
}
