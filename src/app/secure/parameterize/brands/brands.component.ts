import { Component, OnInit } from '@angular/core';
import { BrandService, BrandModel } from './brands.component.service';
import { AddDialogComponent } from '../dialog/dialog-add.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-brands',
    templateUrl: './brands.component.html',
    styleUrls: ['brands.component.scss']
})

export class BrandsComponent implements OnInit {

    /**
     * Inicializacion de variables.
     * @param brandService
     */
    public brandList: BrandModel[] = [];

    /**
     * Creates an instance of BrandsComponent.
     * @param {BrandService} brandService
     * @memberof BrandsComponent
     */
    constructor(
        private brandService: BrandService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.getRequiredData();
    }

    public getRequiredData(): void {
        this.brandService.getBrands().subscribe(result => {
            this.brandList = result.data as BrandModel[];
        }, error => {

        });
    }

    public addBrand(): void {
        const data = {
            type: 1
        };
        this.openDialog(data);
    }

    public openDialog(data: any): void {
        const dialogRef = this.dialog.open(AddDialogComponent, {
            width: '600px',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
        });

    }
}
