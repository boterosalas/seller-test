import { Component, OnInit } from '@angular/core';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { Logger, LoadingService } from '@app/core';
import { MatSnackBar, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';


const log = new Logger('ManageSellerComponent');
@Component({
    selector: 'app-list-sellers',
    templateUrl: 'list-sellers.component.html',
    styleUrls: ['list-sellers.component.scss']
})

export class SellerListComponent implements OnInit {

    showAn = true;
    sellerList: any;
    sellerLength = 0;
    pageSize = 10;
    pageSizeOptions = [10, 20, 50, 100];

     // MatPaginator Output
  pageEvent: PageEvent;

    constructor(private storesService: StoresService,
        private loading: LoadingService,
        private snackBar: MatSnackBar,
        private router: Router) {
    }

    ngOnInit() {
        this.loading.viewSpinner();
        this.getRequiredData();
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
                const body = JSON.parse(result.body.body);
                this.sellerList = body.Data;
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
}
