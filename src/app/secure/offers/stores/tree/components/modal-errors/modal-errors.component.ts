import { Component, Inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';

const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-modal-errors',
  templateUrl: './modal-errors.component.html',
  styleUrls: ['./modal-errors.component.scss']
})
export class ModalErrorsComponent implements AfterViewInit {

  public response: any;
  public has: string;
  public have: string;
  public errors: string;
  public error: string;
  public name: string;
  errorExcepcion: any;

  /**
   * Creates an instance of ModalErrorsComponent.
   * @param {MatDialogRef<ModalErrorsComponent>} dialogRef
   * @param {*} data
   * @memberof ModalErrorsComponent
   */
  constructor(
    public dialogRef: MatDialogRef<ModalErrorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private languageService: TranslateService
  ) {

    this.response = data.response;
    this.has = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.has');
    this.have = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.have');
    this.errors = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.errors');
    this.error = this.languageService.instant('secure.products.create_product_unit.specifications.dialog.error');
    this.name = this.languageService.instant('secure.products.create_product_unit.list_products.product_name');
    this.errorExcepcion = JSON.parse(this.response.body.body);
  }

  ngAfterViewInit() {
  }

  /**
   * Método para cerrar el modal
   * @memberof ModalErrorsComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
