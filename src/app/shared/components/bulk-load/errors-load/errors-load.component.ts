import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';

@Component({
    selector: 'app-show-errors',
    templateUrl: './errors-load.component.html',
    styleUrls: ['./errors-load.component.scss'],
})

export class ShowErrorsComponent implements OnInit {

    @Input() dataWithErrors: any;
    @Input() numberErrors: number;
    @Input() errorsPosition: any;
    @Input() fileName: any;
    numberProductsErrors = 0;
    errorList: any[] = [];
    selectedError: number;
    selectedProductError: number;
    selectedTypeError: string;


    // MatPaginator Inputs
    length = 0;
    pageSize = 20;
    pageSizeOptions: number[] = [20, 30, 40, 100];

    constructor() {
    }


    // MatPaginator Output
    pageEvent: PageEvent;

    setPageSizeOptions(setPageSizeOptionsInput: string) {
        this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

    ngOnInit() {
        if (this.dataWithErrors) {
            this.countProductWithErrors();
            this.length = this.numberErrors;
        }
    }

    public countProductWithErrors(): void {
        let count = 0;
        let countSon = 0;
        let countAll = 0;
        this.dataWithErrors.forEach(element => {
            if (element.Errors.length) { this.numberProductsErrors += 1; }
            countSon = 0;
            element.Errors.forEach(error => {
                countSon++;
                error.indexOf = count + countSon.toString();
                error.indexFather = count;
                error.indexSon = countAll;
                this.errorList.push(error);
                countAll++;
            });
            count++;
        });
    }

    public selectError(error: any): void {
        this.selectedError = error.indexOf;
        this.selectedProductError = error.indexFather;
        this.selectedTypeError = error.Value;
    }

    public getShowError(index: number): boolean {
        if (this.pageEvent) {
            return index <= ((this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize) - 1 &&
                index >= ((this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize) - this.pageEvent.pageSize;
        } else {
            return index <= this.pageSize - 1;
        }
    }

    public getShowProduct(product: any): boolean {
        if (this.pageEvent && product.Errors.length) {
            return product.Errors[0].indexSon <= ((this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize) - 1 &&
            product.Errors[0].indexSon >= ((this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize) - this.pageEvent.pageSize;
        } else if (product.Errors.length) {
            return product.Errors[0].indexSon <= this.pageSize - 1;
        } else {
            return false;
        }
    }

}
