import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorIntl, MatPaginator, ErrorStateMatcher } from '@angular/material';
import { MatPaginatorI18nService } from '@app/shared/services/mat-paginator-i18n.service';
import { readFunctionality } from '@app/secure/auth/auth.consts';
import { FormGroupDirective, NgForm, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

const log = new Logger('PendingProductsComponent');

@Component({
  selector: 'app-pending-products',
  templateUrl: './pending-products.component.html',
  styleUrls: ['./pending-products.component.scss'],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorI18nService,
    }
  ],
})
export class PendingProductsComponent implements OnInit {
  read = readFunctionality;
  validateRegex: any;
  public filterProdutsPending: FormGroup;


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public SUPPORT?: SupportService,
    private fb?: FormBuilder,
  ) { }

  ngOnInit() {
    this.validateFormSupport();
  }

  /**
   * Metodo para crear el formulario
   * @memberof PendingProductsComponent
   */
  createFormControls() {
    this.filterProdutsPending = this.fb.group({
      productName: new FormControl('', Validators.compose([Validators.pattern(this.getValue('nameProduct'))])),
      ean: new FormControl(''),
      initialDate: { disabled: true, value: '' },
      finalDate: { disabled: true, value: '' },
      creationDate: new FormControl('', []),
      matcher: new MyErrorStateMatcher()
    });
  }

  // Funcion para cargar datos de regex
  public validateFormSupport(): void {
    const param = ['productos', null];
    this.SUPPORT.getRegexFormSupport(param).subscribe(res => {
      this.validateRegex = JSON.parse(res.body.body);
      this.createFormControls();
      // this.filterListProducts();
    });
  }

  /**
   * Funcion para obtener el valor de la regex
   * @param {string} name
   * @returns {string}
   * @memberof PendingProductsComponent
   */
  public getValue(name: string): string {
    for (let i = 0; i < this.validateRegex.Data.length; i++) {
      if (this.validateRegex.Data[i].Identifier === name) {
        return this.validateRegex.Data[i].Value;
      }
    }
    return null;
  }

}
