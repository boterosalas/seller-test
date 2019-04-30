import { Component, OnInit, ViewChild } from '@angular/core';
import { BrandService, BrandModel } from './brands.component.service';
import { AddDialogComponent } from '../dialog/dialog-add.component';
import { MatDialog, PageEvent } from '@angular/material';
import {MatPaginator, MatTableDataSource} from '@angular/material';

export interface PeriodicElement {
    name: string;
    id: number;
    status: boolean;
  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {id: 1, name: 'Carulla', status: true},
    {id: 2, name: 'Troopx', status: true},
    {id: 3, name: 'Textil', status: true},
    {id: 4, name: 'Taeq', status: true},
    {id: 5, name: 'Surtimax', status: true},
    {id: 6, name: 'Super Inter', status: true},
    {id: 7, name: 'Porchi', status: true},
    {id: 8, name: 'Pomona', status: true},
    {id: 9, name: 'Exito', status: true},
    {id: 10, name: 'Ekono', status: true},
    {id: 11, name: 'Cautivia', status: true},
    {id: 12, name: 'Arkitect', status: true},
    {id: 13, name: 'People', status: true},
    {id: 14, name: 'Bronzini', status: true},
    {id: 15, name: 'WKD', status: true},
    {id: 16, name: 'Coquí', status: true},
    {id: 17, name: 'Custer', status: true},
    {id: 18, name: 'Carrel', status: true},
    {id: 19, name: 'Bluss', status: true},
    {id: 20, name: 'Eventi', status: true},
  ];


@Component({
    selector: 'app-brands',
    templateUrl: './brands.component.html',
    styleUrls: ['brands.component.scss']
})



export class BrandsComponent implements OnInit {


  displayedColumns: string[] = ['id', 'name', 'status', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;


  length = 0;
  pageSize = 30;
  pagepaginator = 0;
  separatorKeysCodes: number[] = [];
  pageSizeOptions: number[] = [30, 60, 120, 600];
  pageEvent: PageEvent;






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
        this.dataSource.paginator = this.paginator;
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
