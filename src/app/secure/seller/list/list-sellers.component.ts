import { Component, OnInit, ViewChild } from '@angular/core';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { Logger, LoadingService } from '@app/core';
import { MatSnackBar, PageEvent, MatSidenav, ErrorStateMatcher } from '@angular/material';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';

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
    // public stateSeller: FormControl;
    public matcher: MyErrorStateMatcher;
    public regexNoSpaces = /^((?! \s+|\s+$).)*$/;
    showAn = true;
    sellerList: any;
    sellerLength = 0;
    pageSize = 10;
    pageSizeOptions = [10, 20, 50, 100];

    // MatPaginator Output
    pageEvent: PageEvent;
    @ViewChild('sidenav') sidenav: MatSidenav;

    constructor(private storesService: StoresService,
        private loading: LoadingService,
        private snackBar: MatSnackBar,
        private router: Router,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.loading.viewSpinner();
        this.getRequiredData();
        this.createFormControls();
        this.createForm();
        // this.matDrawer.closedStart = tri
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
        console.log(this.sidenav);
        // this.sidenav.toggle();
        this.sidenav.toggle();
    }


    public showSeller(index: number): boolean {
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
                console.log('data: ', result);
                const body = JSON.parse(result.body.body);
                this.sellerList = body.Data;
                console.log('this.sellerList: ', this.sellerList);
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
        id: ['', Validators.pattern(this.regexNoSpaces)],
        sellerName: [''],
        nit: ['', Validators.pattern('^[0-9]*$')],
        matcher: new MyErrorStateMatcher()
        });
    }

    createForm() {
        this.filterSeller = new FormGroup({
            id: this.id,
            sellerName: this.sellerName,
            nit: this.nit,
            // stateSeller: this.stateSeller
        });
    }
}
